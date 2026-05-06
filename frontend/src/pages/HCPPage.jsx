import React, { useState } from 'react';

const HCPPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock HCP data based on project context
  const initialHCPs = [
    { id: 1, name: 'Dr. Smith', specialty: 'Cardiology', hospital: 'City Hospital', lastInteraction: '2024-04-15', status: 'High Value' },
    { id: 2, name: 'Dr. Jones', specialty: 'Oncology', hospital: 'Central Clinic', lastInteraction: '2024-05-01', status: 'Standard' },
    { id: 3, name: 'Dr. Sarah Wilson', specialty: 'Neurology', hospital: 'St. Mary\'s Medical Center', lastInteraction: '2024-03-20', status: 'High Value' },
    { id: 4, name: 'Dr. Michael Chen', specialty: 'Dermatology', hospital: 'Skin Care Institute', lastInteraction: '2024-04-28', status: 'New Prospect' },
    { id: 5, name: 'Dr. Elena Rodriguez', specialty: 'Pediatrics', hospital: 'Children\'s Health', lastInteraction: '2024-05-02', status: 'Standard' },
    { id: 6, name: 'Dr. David Kim', specialty: 'Endocrinology', hospital: 'Metabolic Center', lastInteraction: '2024-02-15', status: 'High Value' },
  ];

  const filteredHCPs = initialHCPs.filter(hcp => 
    hcp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hcp.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hcp.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    container: {
      padding: '32px',
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 64px)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#202124'
    },
    addButton: {
      backgroundColor: '#1a73e8',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)'
    },
    searchBox: {
      backgroundColor: '#fff',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center'
    },
    searchInput: {
      flex: 1,
      border: '1px solid #dadce0',
      borderRadius: '4px',
      padding: '10px 16px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    tableContainer: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left'
    },
    th: {
      backgroundColor: '#f8f9fa',
      padding: '16px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#5f6368',
      textTransform: 'uppercase',
      borderBottom: '1px solid #dadce0'
    },
    td: {
      padding: '16px',
      fontSize: '14px',
      color: '#3c4043',
      borderBottom: '1px solid #f1f3f4'
    },
    badge: (status) => ({
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: status === 'High Value' ? '#e8f0fe' : status === 'New Prospect' ? '#fef7e0' : '#f1f3f4',
      color: status === 'High Value' ? '#1a73e8' : status === 'New Prospect' ? '#b06000' : '#5f6368'
    }),
    actionButton: {
      color: '#1a73e8',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Healthcare Professionals</h1>
          <p style={{ color: '#5f6368', fontSize: '14px', marginTop: '4px' }}>Manage and search for your HCP connections.</p>
        </div>
        <button style={styles.addButton} onClick={() => alert('Add HCP Modal...')}>+ Add New HCP</button>
      </div>

      <div style={styles.searchBox}>
        <input 
          style={styles.searchInput}
          placeholder="Search by name, specialty, or hospital..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Specialty</th>
              <th style={styles.th}>Hospital / Clinic</th>
              <th style={styles.th}>Last Interaction</th>
              <th style={styles.th}>Segment</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHCPs.map(hcp => (
              <tr key={hcp.id} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{...styles.td, fontWeight: '500'}}>{hcp.name}</td>
                <td style={styles.td}>{hcp.specialty}</td>
                <td style={styles.td}>{hcp.hospital}</td>
                <td style={styles.td}>{hcp.lastInteraction}</td>
                <td style={styles.td}>
                  <span style={styles.badge(hcp.status)}>{hcp.status}</span>
                </td>
                <td style={styles.td}>
                  <button style={styles.actionButton} onClick={() => alert(`Viewing ${hcp.name}'s profile...`)}>View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredHCPs.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#5f6368' }}>
            No HCPs found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default HCPPage;
