import React, { useState } from 'react';
import axios from 'axios';

/**
 * EvidenceVerifyModal Component
 * Verify evidence file authenticity
 */
const EvidenceVerifyModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [txId, setTxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 25 * 1024 * 1024) {
        setError('File size must be less than 25 MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!txId) {
      setError('Please enter Transaction/Case ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('txId', txId);

      const response = await axios.post(`${API_BASE_URL}/api/evidence/verify`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
      
      // Log for debugging
      if (response.data.status === 'TAMPERED_OR_UNKNOWN') {
        console.log('❌ Verification failed:', response.data.message);
        console.log('   Case ID used:', response.data.txId);
        console.log('   Computed hash:', response.data.fileHash);
      }
    } catch (err) {
      console.error('Error verifying evidence:', err);
      setError(err.response?.data?.message || err.message || 'Failed to verify evidence');
    } finally {
      setLoading(false);
    }
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const contentStyle = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '24px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    marginTop: '8px',
    marginBottom: '16px'
  };

  const resultStyle = (isAuthentic) => ({
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center',
    backgroundColor: isAuthentic ? '#f0fdf4' : '#fef2f2',
    border: `2px solid ${isAuthentic ? '#86efac' : '#fecaca'}`
  });

  const badgeStyle = (isAuthentic) => ({
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px',
    color: isAuthentic ? '#166534' : '#991b1b'
  });

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={titleStyle}>Verify Evidence</h2>

        {result ? (
          <div>
            <div style={resultStyle(result.status === 'AUTHENTIC')}>
              <div style={badgeStyle(result.status === 'AUTHENTIC')}>
                {result.status === 'AUTHENTIC' ? '✔ Authentic Evidence' : '❌ Tampered or Not Found'}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                File Hash: <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{result.fileHash}</span>
              </div>
              {result.onChainVerified && (
                <div style={{ fontSize: '12px', color: '#15803d', marginTop: '8px' }}>
                  ✓ Verified on-chain
                </div>
              )}
              {result.uploadedAt && (
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                  Uploaded: {new Date(result.uploadedAt).toLocaleString()}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
                setTxId('');
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Verify Another File
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                File to Verify
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.gif,.csv,.txt,.log"
                style={inputStyle}
                disabled={loading}
              />
              {file && (
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '-12px', marginBottom: '16px' }}>
                  Selected: {file.name}
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Transaction/Case ID
              </label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="Enter transaction or case ID"
                style={inputStyle}
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div style={{
                padding: '12px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#991b1b',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                disabled={loading}
              >
                Close
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
                disabled={loading || !file || !txId}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EvidenceVerifyModal;

