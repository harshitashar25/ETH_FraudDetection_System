const { ethers } = require('ethers');
const MoralisService = require('./moralisService');
const MoralisTrailEngine = require('./moralisTrailEngine');

/**
 * Enhanced Transaction Trail Service
 * Builds graph structures for frontend visualization
 */
class EnhancedTrailService {
  constructor() {
    this.moralisEngine = new MoralisTrailEngine();
  }

  /**
   * Get transaction trail for a wallet address
   * @param {string} address - Wallet address
   * @param {Object} options - Trail options
   * @param {number} options.depth - Maximum depth (default: 2)
   * @param {number} options.limit - Max transactions per level (default: 50)
   * @param {string} options.chain - Chain ID (default: 'eth')
   * @returns {Promise<Object>} Trail graph structure
   */
  async getWalletTrail(address, options = {}) {
    const {
      depth = 2,
      limit = 50,
      chain = 'eth'
    } = options;

    try {
      // Normalize address
      const normalizedAddress = address.toLowerCase();
      
      if (!ethers.isAddress(normalizedAddress)) {
        throw new Error('Invalid wallet address');
      }

      // Use existing Moralis trail engine
      const trailData = await this.moralisEngine.extractTrail(normalizedAddress, chain, depth);

      // Build simplified graph structure
      const graph = this.buildGraphStructure(trailData, normalizedAddress, depth);

      return {
        success: true,
        address: normalizedAddress,
        chain,
        depth,
        graph: {
          nodes: graph.nodes,
          edges: graph.edges
        },
        summary: {
          totalTransactions: trailData.transactions?.length || 0,
          totalERC20Transfers: trailData.erc20Transfers?.length || 0,
          totalNodes: graph.nodes.length,
          totalEdges: graph.edges.length
        },
        riskFlags: trailData.riskFlags || [],
        timeline: trailData.timeline?.slice(0, limit) || []
      };
    } catch (error) {
      console.error('Error getting wallet trail:', error);
      throw error;
    }
  }

  /**
   * Build graph structure from trail data
   * @param {Object} trailData - Trail data from Moralis engine
   * @param {string} rootAddress - Root wallet address
   * @param {number} maxDepth - Maximum depth
   * @returns {Object} Graph structure
   */
  buildGraphStructure(trailData, rootAddress, maxDepth) {
    const nodes = new Map();
    const edges = [];
    const nodeIds = new Set();

    // Add root node
    nodes.set(rootAddress, {
      id: rootAddress,
      label: this.getAddressLabel(rootAddress, 'wallet'),
      type: 'wallet',
      isRoot: true,
      riskScore: this.calculateNodeRiskScore(rootAddress, trailData)
    });
    nodeIds.add(rootAddress);

    // Process native transactions
    if (trailData.transactions && trailData.transactions.length > 0) {
      trailData.transactions.forEach(tx => {
        // Add nodes
        if (tx.from && !nodes.has(tx.from)) {
          nodes.set(tx.from, {
            id: tx.from,
            label: this.getAddressLabel(tx.from, 'wallet'),
            type: 'wallet',
            riskScore: tx.riskScore || 0
          });
          nodeIds.add(tx.from);
        }

        if (tx.to && !nodes.has(tx.to)) {
          nodes.set(tx.to, {
            id: tx.to,
            label: this.getAddressLabel(tx.to, 'wallet'),
            type: 'wallet',
            riskScore: tx.riskScore || 0
          });
          nodeIds.add(tx.to);
        }

        // Add edge
        if (tx.from && tx.to) {
          edges.push({
            from: tx.from,
            to: tx.to,
            value: `${tx.valueEth?.toFixed(6) || '0'} ETH`,
            valueUsd: tx.valueUsd || 0,
            txHash: tx.hash,
            timestamp: new Date(tx.timestamp).getTime(),
            type: 'native'
          });
        }
      });
    }

    // Process ERC20 transfers
    if (trailData.erc20Transfers && trailData.erc20Transfers.length > 0) {
      trailData.erc20Transfers.forEach(transfer => {
        // Add nodes
        if (transfer.from && !nodes.has(transfer.from)) {
          nodes.set(transfer.from, {
            id: transfer.from,
            label: this.getAddressLabel(transfer.from, 'wallet'),
            type: 'wallet',
            riskScore: transfer.riskScore || 0
          });
          nodeIds.add(transfer.from);
        }

        if (transfer.to && !nodes.has(transfer.to)) {
          nodes.set(transfer.to, {
            id: transfer.to,
            label: this.getAddressLabel(transfer.to, 'wallet'),
            type: 'wallet',
            riskScore: transfer.riskScore || 0
          });
          nodeIds.add(transfer.to);
        }

        // Add token node
        if (transfer.tokenAddress && !nodes.has(transfer.tokenAddress)) {
          nodes.set(transfer.tokenAddress, {
            id: transfer.tokenAddress,
            label: transfer.tokenSymbol || 'Token',
            type: 'token',
            tokenSymbol: transfer.tokenSymbol,
            tokenName: transfer.tokenName
          });
          nodeIds.add(transfer.tokenAddress);
        }

        // Add edge
        if (transfer.from && transfer.to) {
          edges.push({
            from: transfer.from,
            to: transfer.to,
            value: `${transfer.valueFormatted?.toFixed(4) || '0'} ${transfer.tokenSymbol || 'TOKEN'}`,
            valueUsd: transfer.valueUsd || 0,
            txHash: transfer.hash,
            timestamp: new Date(transfer.timestamp).getTime(),
            type: 'erc20',
            token: transfer.tokenSymbol
          });
        }
      });
    }

    // Convert nodes map to array
    const nodesArray = Array.from(nodes.values());

    return {
      nodes: nodesArray,
      edges: edges
    };
  }

  /**
   * Get address label for display
   * @param {string} address - Wallet address
   * @param {string} type - Node type
   * @returns {string} Display label
   */
  getAddressLabel(address, type) {
    if (!address) return 'Unknown';
    
    // Shorten address for display
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  }

  /**
   * Calculate risk score for a node
   * @param {string} address - Wallet address
   * @param {Object} trailData - Trail data
   * @returns {number} Risk score (0-100)
   */
  calculateNodeRiskScore(address, trailData) {
    let riskScore = 0;

    // Check if address appears in risk flags
    if (trailData.riskFlags) {
      trailData.riskFlags.forEach(flag => {
        if (flag.addresses && flag.addresses.includes(address.toLowerCase())) {
          if (flag.severity === 'high') riskScore += 50;
          else if (flag.severity === 'medium') riskScore += 25;
          else riskScore += 10;
        }
      });
    }

    return Math.min(riskScore, 100);
  }
}

module.exports = new EnhancedTrailService();

