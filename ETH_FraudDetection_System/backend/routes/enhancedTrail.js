const express = require('express');
const router = express.Router();
const enhancedTrailService = require('../services/enhancedTrailService');

/**
 * GET /api/trail/:address
 * Get transaction trail for a wallet address
 * Query params:
 *   - depth: Maximum depth (default: 2)
 *   - limit: Max transactions (default: 50)
 *   - chain: Chain ID (default: 'eth')
 */
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const depth = parseInt(req.query.depth) || 2;
    const limit = parseInt(req.query.limit) || 50;
    const chain = req.query.chain || 'eth';

    // Validate address
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        error: 'Invalid wallet address format'
      });
    }

    // Validate depth and limit
    if (depth < 1 || depth > 5) {
      return res.status(400).json({
        error: 'Depth must be between 1 and 5'
      });
    }

    if (limit < 1 || limit > 200) {
      return res.status(400).json({
        error: 'Limit must be between 1 and 200'
      });
    }

    // Get trail
    const trail = await enhancedTrailService.getWalletTrail(address, {
      depth,
      limit,
      chain
    });

    res.json(trail);
  } catch (error) {
    console.error('Error in /api/trail/:address:', error);
    res.status(500).json({
      error: 'Failed to get transaction trail',
      message: error.message
    });
  }
});

module.exports = router;

