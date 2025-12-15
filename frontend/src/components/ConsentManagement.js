import React, { useState, useEffect } from 'react';
import './ConsentManagement.css';
import { apiService } from '../services/apiService';
import { useWeb3 } from '../hooks/useWeb3';

const ConsentManagement = ({ account }) => {
  const { signMessage } = useWeb3();
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    purpose: '',
  });

  useEffect(() => {
    const fetchConsents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Call API with status filter (null for 'all')
        const statusParam = filterStatus === 'all' ? null : filterStatus;
        const response = await apiService.getConsents(null, statusParam);
        
        // Handle different response structures
        if (response.consents) {
          setConsents(response.consents);
        } else if (Array.isArray(response)) {
          setConsents(response);
        } else {
          setConsents([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch consents');
        setConsents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConsents();
  }, [filterStatus]);

  const handleCreateConsent = async (e) => {
    e.preventDefault();
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Create message to sign
      const message = `I consent to: ${formData.purpose} for patient: ${formData.patientId}`;
      
      // Sign the message with MetaMask
      const signature = await signMessage(message);
      
      // Create consent with signature
      const consentData = {
        patientId: formData.patientId,
        purpose: formData.purpose,
        walletAddress: account,
        signature: signature,
        message: message
      };
      
      await apiService.createConsent(consentData);
      
      // Reset form and refresh list
      setFormData({ patientId: '', purpose: '' });
      setShowCreateForm(false);
      
      // Refresh consents
      const statusParam = filterStatus === 'all' ? null : filterStatus;
      const response = await apiService.getConsents(null, statusParam);
      if (response.consents) {
        setConsents(response.consents);
      } else if (Array.isArray(response)) {
        setConsents(response);
      }
      
      alert('Consent created successfully!');
    } catch (err) {
      alert('Failed to create consent: ' + err.message);
    }
  };

  const handleUpdateStatus = async (consentId, newStatus) => {
    try {
      await apiService.updateConsent(consentId, { status: newStatus });
      
      // Refresh consents
      const statusParam = filterStatus === 'all' ? null : filterStatus;
      const response = await apiService.getConsents(null, statusParam);
      if (response.consents) {
        setConsents(response.consents);
      } else if (Array.isArray(response)) {
        setConsents(response);
      }
      
      alert(`Consent status updated to ${newStatus}!`);
    } catch (err) {
      alert('Failed to update consent: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="consent-management-container">
        <div className="loading">Loading consents...</div>
      </div>
    );
  }

  return (
    <div className="consent-management-container">
      <div className="consent-header">
        <h2>Consent Management</h2>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={!account}
        >
          {showCreateForm ? 'Cancel' : 'Create New Consent'}
        </button>
      </div>

      {!account && (
        <div className="warning">
          Please connect your MetaMask wallet to manage consents
        </div>
      )}

      {showCreateForm && account && (
        <div className="create-consent-form">
          <h3>Create New Consent</h3>
          <form onSubmit={handleCreateConsent}>
            <div className="form-group">
              <label>Patient ID</label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
                placeholder="e.g., patient-001"
              />
            </div>
            <div className="form-group">
              <label>Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
              >
                <option value="">Select purpose...</option>
                <option value="Research Study Participation">Research Study Participation</option>
                <option value="Data Sharing with Research Institution">Data Sharing with Research Institution</option>
                <option value="Third-Party Analytics Access">Third-Party Analytics Access</option>
                <option value="Insurance Provider Access">Insurance Provider Access</option>
              </select>
            </div>
            <button type="submit" className="submit-btn">
              Sign & Create Consent
            </button>
          </form>
        </div>
      )}

      <div className="consent-filters">
        <button
          className={filterStatus === 'all' ? 'active' : ''}
          onClick={() => setFilterStatus('all')}
        >
          All
        </button>
        <button
          className={filterStatus === 'active' ? 'active' : ''}
          onClick={() => setFilterStatus('active')}
        >
          Active
        </button>
        <button
          className={filterStatus === 'pending' ? 'active' : ''}
          onClick={() => setFilterStatus('pending')}
        >
          Pending
        </button>
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <div className="consents-list">
        {consents.length === 0 ? (
          <div className="no-consents">
            <p>No consents found</p>
            {!account && <p>Connect your wallet to create consents</p>}
          </div>
        ) : (
          consents.map((consent) => (
            <div key={consent.id} className="consent-card">
              <div className="consent-card-header">
                <h3>{consent.purpose}</h3>
                <span className={`consent-status status-${consent.status}`}>
                  {consent.status}
                </span>
              </div>
              <div className="consent-details">
                <p><strong>Patient ID:</strong> {consent.patientId}</p>
               <p>
                <strong>Wallet Address:</strong>{' '}
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    navigator.clipboard.writeText(consent.walletAddress);
                    alert('Wallet address copied to clipboard!');
                  }}
                  title={consent.walletAddress}
                >
                  {consent.walletAddress.slice(0, 6)}...{consent.walletAddress.slice(-4)}
                </span>
              </p>
                <p><strong>Created:</strong> {new Date(consent.createdAt).toLocaleString()}</p>
                {consent.blockchainTxHash && (
                  <p>
                    <strong>Blockchain Tx:</strong>{' '}
                    <span className="tx-hash" title={consent.blockchainTxHash}>
                      {consent.blockchainTxHash.slice(0, 10)}...{consent.blockchainTxHash.slice(-8)}
                    </span>
                  </p>
                )}
              </div>
              {consent.status === 'pending' && account && (
                <div className="consent-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleUpdateStatus(consent.id, 'active')}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleUpdateStatus(consent.id, 'revoked')}
                  >
                    Revoke
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsentManagement;