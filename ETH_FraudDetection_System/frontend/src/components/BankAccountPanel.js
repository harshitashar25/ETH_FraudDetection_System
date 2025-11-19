import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * BankAccountPanel Component
 * Manage bank account freezing and wallet linking
 */
const BankAccountPanel = ({ walletAddress, onAccountUpdated }) => {
  const [searchType, setSearchType] = useState('account'); // 'account' or 'wallet'
  const [searchValue, setSearchValue] = useState('');
  const [account, setAccount] = useState(null);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Freeze/Unfreeze form
  const [freezeReason, setFreezeReason] = useState('');
  const [showFreezeForm, setShowFreezeForm] = useState(false);
  const [linking, setLinking] = useState(false);
  const [linkForm, setLinkForm] = useState({
    bankAccountId: '',
    holderName: '',
    walletAddress: walletAddress || ''
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Load linked accounts if wallet address is provided
  useEffect(() => {
    if (walletAddress) {
      loadAccountsByWallet(walletAddress);
    }
  }, [walletAddress]);

  const loadAccountsByWallet = async (wallet) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bank/wallet/${wallet}`);
      if (response.data.success) {
        setLinkedAccounts(response.data.accounts || []);
      }
    } catch (err) {
      console.error('Error loading accounts:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('Please enter a search value');
      return;
    }

    setLoading(true);
    setError(null);
    setAccount(null);

    try {
      if (searchType === 'account') {
        const response = await axios.get(`${API_BASE_URL}/api/bank/${searchValue}`);
        if (response.data.success) {
          setAccount(response.data.bankAccount);
        }
      } else {
        // Search by wallet
        const response = await axios.get(`${API_BASE_URL}/api/bank/wallet/${searchValue}`);
        if (response.data.success) {
          setLinkedAccounts(response.data.accounts || []);
          if (response.data.accounts.length > 0) {
            setAccount(response.data.accounts[0]);
          } else {
            setError('No accounts found for this wallet');
          }
        }
      }
    } catch (err) {
      console.error('Error searching:', err);
      setError(err.response?.data?.message || err.message || 'Failed to search account');
    } finally {
      setLoading(false);
    }
  };

  const handleFreeze = async () => {
    if (!account || !freezeReason.trim()) {
      setError('Please enter a freeze reason');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bank/freeze`, {
        bankAccountId: account.bankAccountId,
        reason: freezeReason,
        frozenBy: 'LEA_USER' // In production, get from auth context
      });

      if (response.data.success) {
        setSuccess('Account frozen successfully');
        setAccount(response.data.bankAccount);
        setShowFreezeForm(false);
        setFreezeReason('');
        
        if (onAccountUpdated) {
          onAccountUpdated(response.data.bankAccount);
        }

        // Reload if we searched by wallet
        if (account.linkedWallet) {
          loadAccountsByWallet(account.linkedWallet);
        }
      }
    } catch (err) {
      console.error('Error freezing account:', err);
      setError(err.response?.data?.message || err.message || 'Failed to freeze account');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfreeze = async () => {
    if (!account) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bank/unfreeze`, {
        bankAccountId: account.bankAccountId,
        unfrozenBy: 'LEA_USER' // In production, get from auth context
      });

      if (response.data.success) {
        setSuccess('Account unfrozen successfully');
        setAccount(response.data.bankAccount);
        
        if (onAccountUpdated) {
          onAccountUpdated(response.data.bankAccount);
        }

        // Reload if we searched by wallet
        if (account.linkedWallet) {
          loadAccountsByWallet(account.linkedWallet);
        }
      }
    } catch (err) {
      console.error('Error unfreezing account:', err);
      setError(err.response?.data?.message || err.message || 'Failed to unfreeze account');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkWallet = async () => {
    if (!linkForm.bankAccountId || !linkForm.walletAddress) {
      setError('Bank Account ID and Wallet Address are required');
      return;
    }

    setLinking(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bank/link-wallet`, linkForm);

      if (response.data.success) {
        setSuccess('Wallet linked successfully');
        setAccount(response.data.bankAccount);
        setLinkForm({ bankAccountId: '', holderName: '', walletAddress: '' });
        
        if (linkForm.walletAddress) {
          loadAccountsByWallet(linkForm.walletAddress);
        }
      }
    } catch (err) {
      console.error('Error linking wallet:', err);
      setError(err.response?.data?.message || err.message || 'Failed to link wallet');
    } finally {
      setLinking(false);
    }
  };

  const containerStyle = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    margin: '16px'
  };

  const titleStyle = {
    fontSize: '20px',
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

  const buttonStyle = (primary = false) => ({
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: loading || linking ? 'not-allowed' : 'pointer',
    border: primary ? 'none' : '1px solid #d1d5db',
    backgroundColor: primary ? '#3b82f6' : '#ffffff',
    color: primary ? '#ffffff' : '#374151',
    opacity: (loading || linking) ? 0.6 : 1,
    transition: 'all 0.2s'
  });

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Bank Account Management</h2>

      {/* Link Wallet Form */}
      <div style={{
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          Link Wallet to Bank Account
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Bank Account ID
            </label>
            <input
              type="text"
              value={linkForm.bankAccountId}
              onChange={(e) => setLinkForm({ ...linkForm, bankAccountId: e.target.value })}
              style={inputStyle}
              placeholder="Enter bank account ID"
              disabled={linking}
            />
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Wallet Address
            </label>
            <input
              type="text"
              value={linkForm.walletAddress}
              onChange={(e) => setLinkForm({ ...linkForm, walletAddress: e.target.value })}
              style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '12px' }}
              placeholder="0x..."
              disabled={linking}
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Holder Name (optional)
          </label>
          <input
            type="text"
            value={linkForm.holderName}
            onChange={(e) => setLinkForm({ ...linkForm, holderName: e.target.value })}
            style={inputStyle}
            placeholder="Account holder name"
            disabled={linking}
          />
        </div>
        <button
          onClick={handleLinkWallet}
          style={buttonStyle(true)}
          disabled={linking}
        >
          {linking ? 'Linking...' : 'Link Wallet'}
        </button>
      </div>

      {/* Search Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={{ ...inputStyle, width: 'auto', minWidth: '150px' }}
          >
            <option value="account">Search by Account ID</option>
            <option value="wallet">Search by Wallet</option>
          </select>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{ ...inputStyle, flex: 1, fontFamily: searchType === 'wallet' ? 'monospace' : 'inherit', fontSize: searchType === 'wallet' ? '12px' : '14px' }}
            placeholder={searchType === 'account' ? 'Enter bank account ID' : 'Enter wallet address'}
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            style={buttonStyle(true)}
            disabled={loading || !searchValue.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Linked Accounts List */}
      {linkedAccounts.length > 0 && walletAddress && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Linked Accounts ({linkedAccounts.length})
          </h3>
          {linkedAccounts.map((acc, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer'
              }}
              onClick={() => setAccount(acc)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{acc.bankAccountId}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{acc.holderName || 'N/A'}</div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: acc.status === 'FROZEN' ? '#fef2f2' : '#f0fdf4',
                  color: acc.status === 'FROZEN' ? '#991b1b' : '#166534'
                }}>
                  {acc.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Account Details */}
      {account && (
        <div style={{
          padding: '20px',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Account Details
          </h3>
          
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Account ID</div>
            <div style={{ fontWeight: '500', fontFamily: 'monospace', fontSize: '14px' }}>
              {account.bankAccountId}
            </div>
          </div>

          {account.holderName && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Holder Name</div>
              <div style={{ fontWeight: '500' }}>{account.holderName}</div>
            </div>
          )}

          {account.linkedWallet && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Linked Wallet</div>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#3b82f6' }}>
                {account.linkedWallet}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Status</div>
            <div style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: account.status === 'FROZEN' ? '#fee2e2' : '#dcfce7',
              color: account.status === 'FROZEN' ? '#991b1b' : '#166534'
            }}>
              {account.status}
            </div>
          </div>

          {account.status === 'FROZEN' && (
            <div style={{
              padding: '12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: '600', marginBottom: '4px' }}>
                Freeze Reason
              </div>
              <div style={{ fontSize: '14px', color: '#7f1d1d' }}>{account.freezeReason}</div>
              {account.frozenAt && (
                <div style={{ fontSize: '12px', color: '#991b1b', marginTop: '8px' }}>
                  Frozen at: {new Date(account.frozenAt).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {account.status === 'ACTIVE' ? (
              <>
                <button
                  onClick={() => setShowFreezeForm(!showFreezeForm)}
                  style={buttonStyle(true)}
                  disabled={loading}
                >
                  {showFreezeForm ? 'Cancel' : 'Freeze Account'}
                </button>
                {showFreezeForm && (
                  <div style={{
                    width: '100%',
                    padding: '16px',
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    borderRadius: '8px',
                    marginTop: '12px'
                  }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                      Freeze Reason
                    </label>
                    <textarea
                      value={freezeReason}
                      onChange={(e) => setFreezeReason(e.target.value)}
                      style={{
                        ...inputStyle,
                        minHeight: '80px',
                        resize: 'vertical'
                      }}
                      placeholder="Enter reason for freezing..."
                      disabled={loading}
                    />
                    <button
                      onClick={handleFreeze}
                      style={{
                        ...buttonStyle(true),
                        backgroundColor: '#dc2626'
                      }}
                      disabled={loading || !freezeReason.trim()}
                    >
                      {loading ? 'Freezing...' : 'Confirm Freeze'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={handleUnfreeze}
                style={{
                  ...buttonStyle(true),
                  backgroundColor: '#10b981'
                }}
                disabled={loading}
              >
                {loading ? 'Unfreezing...' : 'Unfreeze Account'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div style={{
          padding: '12px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#991b1b',
          fontSize: '14px',
          marginTop: '16px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '12px',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '8px',
          color: '#166534',
          fontSize: '14px',
          marginTop: '16px'
        }}>
          ✅ {success}
        </div>
      )}
    </div>
  );
};

export default BankAccountPanel;

