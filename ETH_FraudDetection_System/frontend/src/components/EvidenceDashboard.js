import React, { useState, useEffect } from 'react';
import EvidenceUploadModal from './EvidenceUploadModal';
import EvidenceVerifyModal from './EvidenceVerifyModal';
import axios from 'axios';

/**
 * Evidence Dashboard Component
 * Main view for evidence hashing functionality
 */
const EvidenceDashboard = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('txId'); // 'txId' or 'wallet'
  const [searchValue, setSearchValue] = useState('');
  const [uploadForm, setUploadForm] = useState({
    txId: '',
    walletAddress: '',
    uploaderRole: 'BANK'
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleUploadSuccess = (evidence) => {
    console.log('Evidence uploaded:', evidence);
    // Refresh evidence list if searching
    if (searchValue) {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setEvidenceList([]);
      return;
    }

    setLoading(true);
    try {
      let response;
      if (searchType === 'txId') {
        response = await axios.get(`${API_BASE_URL}/api/evidence/tx/${searchValue}`);
      } else {
        response = await axios.get(`${API_BASE_URL}/api/evidence/wallet/${searchValue}`);
      }

      // Handle both response formats: status: 'OK' or success: true
      if (response.data.status === 'OK' || response.data.success) {
        setEvidenceList(response.data.evidence || []);
      } else {
        setEvidenceList([]);
      }
    } catch (error) {
      console.error('Error searching evidence:', error);
      setEvidenceList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchValue.trim()) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500); // Debounce search

      return () => clearTimeout(timeoutId);
    } else {
      setEvidenceList([]);
    }
  }, [searchValue, searchType]);

  const containerStyle = {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    background: '#f9fafb',
    minHeight: '100vh'
  };

  const headerStyle = {
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#6b7280'
  };

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px'
  };

  const buttonStyle = (primary = false) => ({
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: primary ? 'none' : '1px solid #d1d5db',
    backgroundColor: primary ? '#3b82f6' : '#ffffff',
    color: primary ? '#ffffff' : '#374151',
    transition: 'all 0.2s',
    marginRight: '12px'
  });

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    marginTop: '8px',
    marginBottom: '16px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Evidence Hashing</h1>
        <p style={subtitleStyle}>
          Upload evidence files, compute SHA-256 hashes, and store on-chain for tamper-proof verification
        </p>
      </div>

      {/* Action Buttons */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowUploadModal(true)}
            style={buttonStyle(true)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            📤 Upload Evidence
          </button>
          <button
            onClick={() => setShowVerifyModal(true)}
            style={buttonStyle(false)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            ✓ Verify Evidence
          </button>
        </div>
      </div>

      {/* Quick Upload Form */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Quick Upload
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Transaction/Case ID
            </label>
            <input
              type="text"
              value={uploadForm.txId}
              onChange={(e) => setUploadForm({ ...uploadForm, txId: e.target.value })}
              style={inputStyle}
              placeholder="Enter case or transaction ID"
            />
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Wallet Address
            </label>
            <input
              type="text"
              value={uploadForm.walletAddress}
              onChange={(e) => setUploadForm({ ...uploadForm, walletAddress: e.target.value })}
              style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '12px' }}
              placeholder="0x..."
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Uploader Role
          </label>
          <select
            value={uploadForm.uploaderRole}
            onChange={(e) => setUploadForm({ ...uploadForm, uploaderRole: e.target.value })}
            style={inputStyle}
          >
            <option value="BANK">Bank</option>
            <option value="LEA">Law Enforcement Agency</option>
          </select>
        </div>
        <button
          onClick={() => {
            if (uploadForm.txId && uploadForm.walletAddress) {
              setShowUploadModal(true);
            }
          }}
          style={buttonStyle(true)}
          disabled={!uploadForm.txId || !uploadForm.walletAddress}
        >
          Open Upload Modal
        </button>
      </div>

      {/* Search Evidence */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Search Evidence
        </h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setSearchValue('');
              setEvidenceList([]);
            }}
            style={{ ...inputStyle, width: 'auto', minWidth: '180px' }}
          >
            <option value="txId">Search by Transaction/Case ID</option>
            <option value="wallet">Search by Wallet Address</option>
          </select>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              ...inputStyle,
              flex: 1,
              fontFamily: searchType === 'wallet' ? 'monospace' : 'inherit',
              fontSize: searchType === 'wallet' ? '12px' : '14px'
            }}
            placeholder={searchType === 'txId' ? 'Enter transaction or case ID' : 'Enter wallet address (0x...)'}
          />
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
            Searching...
          </div>
        )}

        {!loading && evidenceList.length > 0 && (
          <div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              Found {evidenceList.length} evidence record{evidenceList.length !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {evidenceList.map((evidence, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    background: '#f9fafb'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {evidence.fileName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>
                        Hash: {evidence.fileHash}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: evidence.uploaderRole === 'BANK' ? '#dbeafe' : '#fef3c7',
                      color: evidence.uploaderRole === 'BANK' ? '#1e40af' : '#92400e'
                    }}>
                      {evidence.uploaderRole}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '2px' }}>Type</div>
                      <div>{evidence.evidenceType}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '2px' }}>Uploaded</div>
                      <div>{new Date(evidence.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '2px' }}>On-chain</div>
                      <div style={{ color: evidence.onChainTxHash ? '#10b981' : '#ef4444' }}>
                        {evidence.onChainTxHash ? '✓ Verified' : '✗ Not verified'}
                      </div>
                    </div>
                  </div>
                  {evidence.onChainTxHash && (
                    <div style={{ marginTop: '8px', fontSize: '11px', fontFamily: 'monospace', color: '#9ca3af' }}>
                      TX: {evidence.onChainTxHash.substring(0, 20)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && searchValue && evidenceList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
            No evidence found for this {searchType === 'txId' ? 'transaction/case ID' : 'wallet address'}
          </div>
        )}

        {!searchValue && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '14px' }}>
            Enter a {searchType === 'txId' ? 'transaction/case ID' : 'wallet address'} to search for evidence
          </div>
        )}
      </div>

      {/* Information Card */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          How It Works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>1️⃣</div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Upload File</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Select a file (PDF, image, CSV, log). System computes SHA-256 hash automatically.
            </div>
          </div>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>2️⃣</div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Store On-Chain</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Hash is stored on Ethereum smart contract for permanent, tamper-proof record.
            </div>
          </div>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>3️⃣</div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Verify Later</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Upload the same file anytime to verify it hasn't been tampered with.
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUploadModal && (
        <EvidenceUploadModal
          txId={uploadForm.txId}
          walletAddress={uploadForm.walletAddress}
          uploaderRole={uploadForm.uploaderRole}
          onClose={() => setShowUploadModal(false)}
          onUploaded={handleUploadSuccess}
        />
      )}

      {showVerifyModal && (
        <EvidenceVerifyModal
          onClose={() => setShowVerifyModal(false)}
        />
      )}
    </div>
  );
};

export default EvidenceDashboard;

