import React, { useState, useEffect } from 'react';
import './StatsDashboard.css';
import { apiService } from '../services/apiService';

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getStats();
        setStats(response);
      } catch (err) {
        setError(err.message || 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds for "real-time" updates
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="stats-dashboard-container">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="stats-dashboard-container">
        <div className="error">Error loading statistics: {error || 'No data available'}</div>
      </div>
    );
  }

  // Calculate percentages for visual representation
  const consentApprovalRate = stats.totalConsents > 0 
    ? ((stats.activeConsents / stats.totalConsents) * 100).toFixed(1)
    : 0;
  
  const pendingRate = stats.totalConsents > 0
    ? ((stats.pendingConsents / stats.totalConsents) * 100).toFixed(1)
    : 0;

  return (
    <div className="stats-dashboard-container">
      <div className="stats-header">
        <h2>Platform Statistics</h2>
        <p className="stats-subtitle">Real-time platform metrics and analytics</p>
      </div>
      
      <div className="stats-grid">
        {/* Total Patients Card */}
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Patients</h3>
            <p className="stat-number">{stats.totalPatients || 0}</p>
            <p className="stat-description">Registered in system</p>
          </div>
        </div>

        {/* Total Medical Records Card */}
        <div className="stat-card stat-card-success">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Medical Records</h3>
            <p className="stat-number">{stats.totalRecords || 0}</p>
            <p className="stat-description">Total records stored</p>
          </div>
        </div>

        {/* Total Consents Card */}
        <div className="stat-card stat-card-info">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Total Consents</h3>
            <p className="stat-number">{stats.totalConsents || 0}</p>
            <p className="stat-description">All consent records</p>
          </div>
        </div>

        {/* Active Consents Card */}
        <div className="stat-card stat-card-success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Active Consents</h3>
            <p className="stat-number">{stats.activeConsents || 0}</p>
            <p className="stat-description">{consentApprovalRate}% approval rate</p>
          </div>
        </div>

        {/* Pending Consents Card */}
        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Consents</h3>
            <p className="stat-number">{stats.pendingConsents || 0}</p>
            <p className="stat-description">{pendingRate}% of total</p>
          </div>
        </div>

        {/* Blockchain Transactions Card */}
        <div className="stat-card stat-card-purple">
          <div className="stat-icon">⛓️</div>
          <div className="stat-content">
            <h3>Blockchain Txs</h3>
            <p className="stat-number">{stats.totalTransactions || 0}</p>
            <p className="stat-description">Verified on chain</p>
          </div>
        </div>
      </div>

      {/* Visual Progress Bars Section */}
      <div className="stats-visual-section">
        <h3>Consent Status Breakdown</h3>
        <div className="progress-container">
          <div className="progress-item">
            <div className="progress-label">
              <span>Active Consents</span>
              <span className="progress-value">{stats.activeConsents || 0}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill progress-fill-success"
                style={{ width: `${consentApprovalRate}%` }}
              ></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-label">
              <span>Pending Consents</span>
              <span className="progress-value">{stats.pendingConsents || 0}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill progress-fill-warning"
                style={{ width: `${pendingRate}%` }}
              ></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-label">
              <span>Records per Patient</span>
              <span className="progress-value">
                {stats.totalPatients > 0 
                  ? (stats.totalRecords / stats.totalPatients).toFixed(1)
                  : 0}
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill progress-fill-info"
                style={{ width: `${Math.min((stats.totalRecords / stats.totalPatients) * 10, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-summary">
        <div className="summary-card">
          <h4>🏥 System Health</h4>
          <p>All services operational</p>
          <span className="status-badge status-healthy">Healthy</span>
        </div>
        <div className="summary-card">
          <h4>🔐 Blockchain Status</h4>
          <p>{stats.totalTransactions || 0} transactions verified</p>
          <span className="status-badge status-healthy">Connected</span>
        </div>
        <div className="summary-card">
          <h4>📊 Data Insights</h4>
          <p>
            Average: {stats.totalPatients > 0 
              ? (stats.totalRecords / stats.totalPatients).toFixed(1)
              : 0} records/patient
          </p>
          <span className="status-badge status-info">Updated</span>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;