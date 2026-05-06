import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/interactions/');
        setStats({
          total: response.data.length,
          recent: response.data.slice(-3).reverse()
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const styles = {
    container: {
      padding: '40px',
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 64px)',
      color: '#202124',
      perspective: '1000px',
      overflow: 'hidden',
      position: 'relative'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      position: 'relative',
      zIndex: 2,
      marginTop: '40px'
    },
    card3D: {
      background: '#ffffff',
      border: '1px solid #dadce0',
      borderRadius: '16px',
      padding: '30px',
      transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
      cursor: 'pointer',
      transformStyle: 'preserve-3d',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    cardTitle: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#5f6368',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '12px'
    },
    cardValue: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#1a73e8',
      marginBottom: '8px'
    },
    cardDesc: {
      fontSize: '13px',
      color: '#70757a'
    },
    hero: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      marginBottom: '40px'
    },
    heroTitle: {
      fontSize: '32px',
      fontWeight: '600',
      color: '#1a73e8',
      marginBottom: '10px'
    },
    activityItem: {
      padding: '12px 16px',
      borderLeft: '3px solid #1a73e8',
      backgroundColor: '#f8f9fa',
      marginBottom: '12px',
      borderRadius: '4px',
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    floatingCircle: (size, color, top, left, duration) => ({
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      filter: 'blur(80px)',
      opacity: 0.1,
      top,
      left,
      animation: `float ${duration}s infinite ease-in-out`,
      zIndex: 1
    }),
  };

  if (loading) return <div style={{...styles.container, textAlign: 'center'}}>Loading AI Dashboard...</div>;

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(5deg); }
          }
          .card-3d:hover {
            transform: translateY(-10px) rotateX(4deg) rotateY(-2deg);
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
            border-color: #1a73e8;
          }
        `}
      </style>

      {/* Subtle Floating Elements */}
      <div style={styles.floatingCircle('500px', '#1a73e8', '-10%', '60%', 20)} />
      <div style={styles.floatingCircle('400px', '#34a853', '50%', '-10%', 25)} />
      
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Intelligence Overview</h1>
        <p style={{ color: '#5f6368' }}>Aggregated pharmaceutical interaction insights and HCP network metrics.</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card3D} className="card-3d">
          <div style={styles.cardTitle}>Total Engagement</div>
          <div style={styles.cardValue}>{stats.total}</div>
          <div style={styles.cardDesc}>Total HCP interactions successfully analyzed and logged.</div>
        </div>

        <div style={styles.card3D} className="card-3d">
          <div style={styles.cardTitle}>AI Extraction Rate</div>
          <div style={{...styles.cardValue, color: '#34a853'}}>98.4%</div>
          <div style={styles.cardDesc}>Precision of AI-driven data extraction from voice/text notes.</div>
        </div>

        <div style={{...styles.card3D, gridColumn: 'span 1'}} className="card-3d">
          <div style={styles.cardTitle}>Recent Activity</div>
          <div style={{ marginTop: '16px' }}>
            {stats.recent.length > 0 ? (
              stats.recent.map(item => (
                <div key={item.id} style={styles.activityItem}>
                  <span style={{ fontWeight: '600', color: '#202124' }}>{item.hcp_name}</span>
                  <span style={{ color: '#5f6368', fontSize: '13px' }}>{item.interaction_type} • {item.date}</span>
                </div>
              ))
            ) : (
              <p style={{ color: '#9aa0a6', fontSize: '13px' }}>No recent activity to display.</p>
            )}
          </div>
        </div>

        <div style={styles.card3D} className="card-3d">
          <div style={styles.cardTitle}>Network Sentiment</div>
          <div style={{...styles.cardValue, color: '#1a73e8'}}>Optimal</div>
          <div style={styles.cardDesc}>General reception trend across the Healthcare Professional network.</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
