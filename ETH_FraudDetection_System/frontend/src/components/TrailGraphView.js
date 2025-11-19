import React, { useState, useEffect, useMemo, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import axios from 'axios';

/**
 * TrailGraphView Component
 * Display transaction trail graph for a wallet address
 */
const TrailGraphView = ({ walletAddress, onClose }) => {
  const [trailData, setTrailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (walletAddress) {
      fetchTrail();
    }
  }, [walletAddress]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth || 800;
        setDimensions({ width, height: 600 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [trailData]);

  const fetchTrail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/enhanced-trail/${walletAddress}`, {
        params: {
          depth: 2,
          limit: 50,
          chain: 'eth'
        }
      });

      if (response.data.success) {
        setTrailData(response.data);
      } else {
        setError(response.data.message || 'Failed to fetch trail');
      }
    } catch (err) {
      console.error('Error fetching trail:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch transaction trail');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get node color
  const getNodeColor = (node) => {
    if (node.isRoot) return '#ef4444'; // Red for root wallet
    if (node.type === 'token') return '#06b6d4'; // Cyan for tokens
    if (node.riskScore > 50) return '#dc2626'; // Dark red for high risk
    if (node.riskScore > 20) return '#f59e0b'; // Orange for medium risk
    return '#3b82f6'; // Blue for normal wallets
  };

  // Process graph data for visualization
  const graphData = useMemo(() => {
    if (!trailData || !trailData.graph) {
      return { nodes: [], links: [] };
    }

    const nodes = (trailData.graph.nodes || []).map(node => ({
      ...node,
      color: getNodeColor(node),
      size: node.isRoot ? 12 : node.riskScore > 20 ? 10 : 8,
      label: node.label || node.id.substring(0, 10) + '...'
    }));

    const links = (trailData.graph.edges || []).map(edge => ({
      ...edge,
      source: edge.from,
      target: edge.to,
      color: edge.type === 'native' ? '#3b82f6' : '#10b981',
      strokeWidth: Math.max(1, Math.min(4, Math.log10((edge.valueUsd || 0) + 1)))
    }));

    return { nodes, links };
  }, [trailData]);

  const containerStyle = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    margin: '16px'
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px'
  };

  const graphContainerStyle = {
    width: '100%',
    height: '600px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>Transaction Trail Graph</h3>
        <div style={{ textAlign: 'center', padding: '64px', color: '#6b7280' }}>
          Loading transaction trail...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>Transaction Trail Graph</h3>
        <div style={{
          padding: '16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#991b1b'
        }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  if (!trailData || graphData.nodes.length === 0) {
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>Transaction Trail Graph</h3>
        <div style={{ textAlign: 'center', padding: '64px', color: '#6b7280' }}>
          No transaction data available for this wallet
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={titleStyle}>Transaction Trail Graph</h3>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        )}
      </div>

      {trailData.summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginBottom: '16px',
          padding: '12px',
          background: '#f9fafb',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <div>
            <div style={{ color: '#6b7280', fontSize: '12px' }}>Transactions</div>
            <div style={{ fontWeight: '600', color: '#111827' }}>{trailData.summary.totalTransactions}</div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: '12px' }}>ERC20 Transfers</div>
            <div style={{ fontWeight: '600', color: '#111827' }}>{trailData.summary.totalERC20Transfers}</div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: '12px' }}>Nodes</div>
            <div style={{ fontWeight: '600', color: '#111827' }}>{trailData.summary.totalNodes}</div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: '12px' }}>Edges</div>
            <div style={{ fontWeight: '600', color: '#111827' }}>{trailData.summary.totalEdges}</div>
          </div>
        </div>
      )}

      <div ref={containerRef} style={graphContainerStyle}>
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeLabel={node => `${node.label || node.id}<br/>Type: ${node.type}<br/>Risk: ${node.riskScore || 0}`}
          nodeColor={node => node.color}
          nodeVal={node => node.size || 8}
          linkLabel={link => `${link.value || ''}<br/>${link.type || ''}<br/>Hash: ${link.txHash?.substring(0, 16)}...`}
          linkColor={link => link.color}
          linkWidth={link => link.strokeWidth || 1}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          onNodeClick={(node) => setSelectedNode(node)}
          onBackgroundClick={() => setSelectedNode(null)}
          cooldownTicks={100}
          onEngineStop={() => {
            if (fgRef.current) {
              fgRef.current.zoomToFit(400, 20);
            }
          }}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>

      {selectedNode && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px' }}>Selected Node</div>
          <div style={{ fontFamily: 'monospace', color: '#6b7280' }}>
            <div>Address: {selectedNode.id}</div>
            <div>Type: {selectedNode.type}</div>
            <div>Label: {selectedNode.label}</div>
            {selectedNode.riskScore !== undefined && (
              <div>Risk Score: {selectedNode.riskScore}/100</div>
            )}
          </div>
        </div>
      )}

      {trailData.riskFlags && trailData.riskFlags.length > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#fffbeb',
          border: '1px solid #fde047',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#854d0e' }}>
            ⚠️ Risk Flags Detected
          </div>
          {trailData.riskFlags.map((flag, idx) => (
            <div key={idx} style={{ fontSize: '12px', color: '#713f12', marginTop: '4px' }}>
              • {flag.type.replace(/_/g, ' ')}: {flag.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrailGraphView;

