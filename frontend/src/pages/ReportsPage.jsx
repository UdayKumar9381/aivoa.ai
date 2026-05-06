import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportsPage = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/interactions/');
        setInteractions(response.data);
      } catch (error) {
        console.error('Error fetching interactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInteractions();
  }, []);

  const getStats = () => {
    const total = interactions.length;
    const sentiment = interactions.reduce((acc, curr) => {
      acc[curr.hcp_sentiment] = (acc[curr.hcp_sentiment] || 0) + 1;
      return acc;
    }, {});
    const types = interactions.reduce((acc, curr) => {
      acc[curr.interaction_type] = (acc[curr.interaction_type] || 0) + 1;
      return acc;
    }, {});

    return { total, sentiment, types };
  };

  const stats = getStats();

  const styles = {
    container: {
      display: 'flex',
      height: 'calc(100vh - 64px)',
      backgroundColor: '#f8f9fa'
    },
    sidebar: {
      width: '300px',
      backgroundColor: '#fff',
      borderRight: '1px solid #dadce0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    sidebarHeader: {
      padding: '20px',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#5f6368',
      borderBottom: '1px solid #f1f3f4',
      textTransform: 'uppercase'
    },
    historyList: {
      flex: 1,
      overflowY: 'auto',
      padding: '10px'
    },
    historyItem: {
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '8px',
      cursor: 'pointer',
      transition: 'background 0.2s',
      border: '1px solid transparent'
    },
    historyItemHover: {
      backgroundColor: '#f1f3f4'
    },
    mainContent: {
      flex: 1,
      padding: '32px',
      overflowY: 'auto'
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#202124',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#5f6368'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '24px',
      marginBottom: '40px'
    },
    card: {
      backgroundColor: '#fff',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      display: 'flex',
      flexDirection: 'column'
    },
    cardTitle: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#5f6368',
      textTransform: 'uppercase',
      marginBottom: '12px'
    },
    cardValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a73e8'
    },
    chartSection: {
      display: 'flex',
      gap: '24px'
    },
    barContainer: {
      flex: 1,
      backgroundColor: '#fff',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
    },
    bar: {
      height: '24px',
      backgroundColor: '#e8f0fe',
      borderRadius: '4px',
      marginBottom: '12px',
      position: 'relative',
      overflow: 'hidden'
    },
    barFill: (percent, color) => ({
      height: '100%',
      width: `${percent}%`,
      backgroundColor: color || '#1a73e8',
      transition: 'width 1s ease-in-out'
    }),
    labelRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      marginBottom: '4px',
      color: '#3c4043'
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading reports...</div>;

  return (
    <div style={styles.container}>
      {/* Sidebar - History */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>Recent Interactions</div>
        <div style={styles.historyList}>
          {interactions.length > 0 ? (
            interactions.map(item => (
              <div key={item.id} style={styles.historyItem} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div style={{ fontWeight: '500', fontSize: '14px', color: '#202124' }}>{item.hcp_name}</div>
                <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>
                  {item.interaction_type} • {item.date}
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  display: 'inline-block', 
                  marginTop: '8px', 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  backgroundColor: item.hcp_sentiment === 'Positive' ? '#e6f4ea' : item.hcp_sentiment === 'Negative' ? '#fce8e6' : '#f1f3f4',
                  color: item.hcp_sentiment === 'Positive' ? '#137333' : item.hcp_sentiment === 'Negative' ? '#c5221f' : '#3c4043'
                }}>
                  {item.hcp_sentiment}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#9aa0a6', fontSize: '12px' }}>No interactions yet.</div>
          )}
        </div>
      </div>

      {/* Main Content - Analytics */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <div style={styles.title}>Performance Analytics</div>
          <div style={styles.subtitle}>Statistical overview of Healthcare Professional interactions.</div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Total Interactions</div>
            <div style={styles.cardValue}>{stats.total}</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Positive Sentiment</div>
            <div style={{...styles.cardValue, color: '#137333'}}>
              {Math.round((stats.sentiment['Positive'] || 0) / (stats.total || 1) * 100)}%
            </div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Primary Channel</div>
            <div style={{...styles.cardValue, fontSize: '20px', marginTop: '10px'}}>
              {Object.entries(stats.types).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A'}
            </div>
          </div>
        </div>

        {/* Charts Representation */}
        <div style={styles.chartSection}>
          <div style={styles.barContainer}>
            <div style={{...styles.cardTitle, marginBottom: '24px'}}>Interaction Types Distribution</div>
            {['Meeting', 'Call', 'Email', 'Conference'].map(type => {
              const count = stats.types[type] || 0;
              const percent = Math.round((count / (stats.total || 1)) * 100);
              return (
                <div key={type} style={{ marginBottom: '20px' }}>
                  <div style={styles.labelRow}>
                    <span>{type}</span>
                    <span>{count} ({percent}%)</span>
                  </div>
                  <div style={styles.bar}>
                    <div style={styles.barFill(percent, '#1a73e8')} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.barContainer}>
            <div style={{...styles.cardTitle, marginBottom: '24px'}}>HCP Sentiment Analysis</div>
            {[
              { label: 'Positive', color: '#137333' },
              { label: 'Neutral', color: '#5f6368' },
              { label: 'Negative', color: '#d93025' }
            ].map(s => {
              const count = stats.sentiment[s.label] || 0;
              const percent = Math.round((count / (stats.total || 1)) * 100);
              return (
                <div key={s.label} style={{ marginBottom: '20px' }}>
                  <div style={styles.labelRow}>
                    <span>{s.label}</span>
                    <span>{count} ({percent}%)</span>
                  </div>
                  <div style={styles.bar}>
                    <div style={styles.barFill(percent, s.color)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
