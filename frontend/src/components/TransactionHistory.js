import React, { useState, useEffect } from 'react';
import './TransactionHistory.css';
import { apiService } from '../services/apiService';
import { useWeb3 } from '../hooks/useWeb3';

const TransactionHistory = () => {
  const { account } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterWallet, setFilterWallet] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch transactions, filter by wallet if provided
        const walletParam = filterWallet || null;
        const response = await apiService.getTransactions(walletParam);
        
        // Handle different response structures
        if (response.transactions) {
          setTransactions(response.transactions);
        } else if (Array.isArray(response)) {
          setTransactions(response);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filterWallet]);

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  const handleFilterByConnectedWallet = () => {
    if (account) {
      setFilterWallet(account);
    } else {
      alert('Please connect your wallet first');
    }
  };

  const handleClearFilter = () => {
    setFilterWallet('');
  };

  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <h2>Blockchain Transaction History</h2>
        <div className="filter-controls">
          {account && !filterWallet && (
            <button className="filter-btn" onClick={handleFilterByConnectedWallet}>
              Filter by My Wallet
            </button>
          )}
          {filterWallet && (
            <div className="active-filter">
              <span>Filtering: {formatAddress(filterWallet)}</span>
              <button className="clear-filter-btn" onClick={handleClearFilter}>
                ✕ Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions found</p>
            {filterWallet && <p>Try clearing the filter to see all transactions</p>}
          </div>
        ) : (
          <div className="transaction-table">
            <div className="transaction-table-header">
              <div className="th-type">Type</div>
              <div className="th-hash">Transaction Hash</div>
              <div className="th-wallet">Wallet Address</div>
              <div className="th-timestamp">Timestamp</div>
              <div className="th-status">Status</div>
            </div>
            {transactions.map((tx) => (
              <div key={tx.id} className="transaction-row">
                <div className="td-type">
                  <span className={`tx-type-badge tx-type-${tx.type}`}>
                    {tx.type || 'Unknown'}
                  </span>
                </div>
                <div className="td-hash">
                  {tx.blockchainTxHash ? (
                    <span
                      className="tx-hash-link"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        navigator.clipboard.writeText(tx.blockchainTxHash);
                        alert('Transaction hash copied to clipboard!');
                      }}
                      title={tx.blockchainTxHash}
                    >
                      {`${tx.blockchainTxHash.slice(0, 10)}...${tx.blockchainTxHash.slice(-8)}`}
                    </span>
                  ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>Pending</span>
                  )}
                </div>
                <div className="td-wallet">
                  {tx.from ? (
                    <span
                      className="wallet-address"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        navigator.clipboard.writeText(tx.from);
                        alert('Wallet address copied to clipboard!');
                      }}
                      title={tx.from}
                    >
                      {formatAddress(tx.from)}
                    </span>
                  ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>N/A</span>
                  )}
                </div>
                <div className="td-timestamp">
                  {formatDate(tx.timestamp)}
                </div>
                <div className="td-status">
                  <span className={`status-badge status-${tx.status}`}>
                    {tx.status || 'confirmed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="transaction-footer">
        <p className="transaction-count">
          Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default TransactionHistory;