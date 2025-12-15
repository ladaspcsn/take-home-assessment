import React, { useState, useEffect } from 'react';
import './PatientDetail.css';
import { apiService } from '../services/apiService';

const PatientDetail = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch patient details
        const patientData = await apiService.getPatient(patientId);
        setPatient(patientData);

        // Fetch patient records
        const recordsData = await apiService.getPatientRecords(patientId);
        // Handle if records come back as array or in a data property
        if (Array.isArray(recordsData)) {
          setRecords(recordsData);
        } else if (recordsData.records) {
          setRecords(recordsData.records);
        } else {
          setRecords([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch patient data');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="patient-detail-container">
        <div className="loading">Loading patient details...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="patient-detail-container">
        <div className="error">Error loading patient: {error || 'Patient not found'}</div>
        <button onClick={onBack} className="back-btn">Back to List</button>
      </div>
    );
  }

  return (
    <div className="patient-detail-container">
      <div className="patient-detail-header">
        <button onClick={onBack} className="back-btn">← Back to List</button>
      </div>

      <div className="patient-detail-content">
        <div className="patient-info-section">
          <h2>Patient Information</h2>
          <div className="patient-info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{patient.name}</span>
            </div>
            <div className="info-item">
              <label>Patient ID:</label>
              <span>{patient.patientId}</span>
            </div>
            <div className="info-item">
              <label>Date of Birth:</label>
              <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Gender:</label>
              <span>{patient.gender}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{patient.email}</span>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <span>{patient.phone}</span>
            </div>
            <div className="info-item">
              <label>Address:</label>
              <span>{patient.address}</span>
            </div>
            <div className="info-item">
              <label>Wallet Address:</label>
              <span 
                className="wallet-address" 
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  navigator.clipboard.writeText(patient.walletAddress);
                  alert('Wallet address copied to clipboard!');
                }}
                title={patient.walletAddress}
              >
                {patient.walletAddress.slice(0, 6)}...{patient.walletAddress.slice(-4)}
              </span>
            </div>
          </div>
        </div>

        <div className="patient-records-section">
          <h2>Medical Records ({records.length})</h2>
          {records.length === 0 ? (
            <div className="no-records">
              <p>No medical records found for this patient.</p>
            </div>
          ) : (
            <div className="records-list">
              {records.map((record) => (
                <div key={record.id} className="record-card">
                  <div className="record-header">
                    <h3>{record.title}</h3>
                    <span className={`record-status status-${record.status}`}>
                      {record.status}
                    </span>
                  </div>
                  <div className="record-details">
                    <p><strong>Type:</strong> {record.type}</p>
                    <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                    <p><strong>Doctor:</strong> {record.doctor}</p>
                    <p><strong>Hospital:</strong> {record.hospital}</p>
                    {record.description && (
                      <p><strong>Description:</strong> {record.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;