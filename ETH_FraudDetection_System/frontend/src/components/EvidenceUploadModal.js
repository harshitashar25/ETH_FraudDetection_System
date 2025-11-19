import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * EvidenceUploadModal Component
 * Upload evidence files and store hash on-chain
 */
const EvidenceUploadModal = ({ txId, walletAddress, onClose, onUploaded, uploaderRole = 'BANK' }) => {
  const [file, setFile] = useState(null);
  const [evidenceType, setEvidenceType] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Local state for editable fields
  const [localTxId, setLocalTxId] = useState(txId || '');
  const [localWalletAddress, setLocalWalletAddress] = useState(walletAddress || '');

  // Update local state when props change
  useEffect(() => {
    if (txId) setLocalTxId(txId);
    if (walletAddress) setLocalWalletAddress(walletAddress);
  }, [txId, walletAddress]);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (25 MB)
      if (selectedFile.size > 25 * 1024 * 1024) {
        setError('File size must be less than 25 MB');
        return;
      }
      setFile(selectedFile);
      setError(null);

      // Auto-detect file type
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['pdf'].includes(ext)) setEvidenceType('pdf');
      else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) setEvidenceType('image');
      else if (['csv'].includes(ext)) setEvidenceType('csv');
      else if (['txt', 'log'].includes(ext)) setEvidenceType('log');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    // Use local state values instead of props
    if (!localTxId || !localWalletAddress) {
      setError('Missing required fields: Transaction/Case ID and Wallet Address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('txId', localTxId);
      formData.append('walletAddress', localWalletAddress);
      formData.append('uploaderRole', uploaderRole);
      formData.append('evidenceType', evidenceType);

      const response = await axios.post(`${API_BASE_URL}/api/evidence/upload`, formData, {
        // Let axios automatically set Content-Type with boundary for multipart/form-data
        timeout: 60000 // 60 seconds timeout for file uploads
      });

      if (response.data.success) {
        setSuccess({
          fileHash: response.data.fileHash,
          onChainTxHash: response.data.onChainTxHash,
          evidenceId: response.data.evidenceId
        });

        if (onUploaded) {
          onUploaded(response.data);
        }

        // Auto-close after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (err) {
      console.error('Error uploading evidence:', err);
      
      // Provide more detailed error messages
      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        const errorData = err.response.data;
        
        if (status === 404) {
          setError(`API endpoint not found. Please check if backend is running on ${API_BASE_URL}/api/evidence/upload`);
        } else if (status === 400) {
          setError(errorData.error || errorData.message || 'Invalid request. Please check all fields.');
        } else if (status === 500) {
          setError(errorData.message || errorData.error || 'Server error. Please try again later.');
        } else {
          setError(errorData.message || errorData.error || `Request failed with status ${status}`);
        }
      } else if (err.request) {
        // Request made but no response received
        setError(`Cannot connect to backend server. Make sure the backend is running on ${API_BASE_URL}`);
      } else {
        // Error setting up request
        setError(err.message || 'Failed to upload evidence');
      }
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
    maxHeight: '90vh',
    overflowY: 'auto',
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

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    marginRight: '12px'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db'
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={titleStyle}>Upload Evidence</h2>

        {success ? (
          <div style={{
            padding: '16px',
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <div style={{ color: '#166534', fontWeight: '600', marginBottom: '8px' }}>
              ✅ Evidence uploaded successfully!
            </div>
            <div style={{ fontSize: '12px', color: '#15803d', fontFamily: 'monospace' }}>
              <div>File Hash: {success.fileHash}</div>
              {success.onChainTxHash && (
                <div>On-chain TX: {success.onChainTxHash}</div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                File
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
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Evidence Type
              </label>
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value)}
                style={inputStyle}
                disabled={loading}
              >
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
                <option value="csv">CSV</option>
                <option value="log">Log/TXT</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Transaction/Case ID
              </label>
              <input
                type="text"
                value={localTxId}
                onChange={(e) => setLocalTxId(e.target.value)}
                style={inputStyle}
                placeholder="Enter transaction or case ID"
                disabled={loading}
              />
            </div>

            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Wallet Address
              </label>
              <input
                type="text"
                value={localWalletAddress}
                onChange={(e) => setLocalWalletAddress(e.target.value)}
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '12px' }}
                placeholder="0x..."
                disabled={loading}
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                type="button"
                onClick={onClose}
                style={secondaryButtonStyle}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={primaryButtonStyle}
                disabled={loading || !file || !localTxId || !localWalletAddress}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#3b82f6';
                }}
              >
                {loading ? 'Uploading...' : 'Upload Evidence'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EvidenceUploadModal;

