import React from 'react';
import LogInteractionForm from '../components/LogInteractionForm';
import ChatInterface from '../components/ChatInterface';

const LogInteractionPage = () => {
  const containerStyle = {
    display: 'flex',
    padding: '24px',
    maxWidth: '1440px',
    margin: '0 auto',
    gap: '24px'
  };

  return (
    <div style={containerStyle}>
      <LogInteractionForm />
      <ChatInterface />
    </div>
  );
};

export default LogInteractionPage;
