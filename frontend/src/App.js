import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import LogInteractionPage from './pages/LogInteractionPage';
import ReportsPage from './pages/ReportsPage';
import HCPPage from './pages/HCPPage';
import DashboardPage from './pages/DashboardPage';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Interactions':
        return <LogInteractionPage />;
      case 'Dashboard':
        return <DashboardPage />;
      case 'HCPs':
        return <HCPPage />;
      case 'Reports':
        return <ReportsPage />;
      default:
        return <LogInteractionPage />;
    }
  };

  return (
    <Provider store={store}>
      <div className="App">
        <Header activeItem={activeTab} onItemClick={setActiveTab} />
        <main>
          {renderContent()}
        </main>
      </div>
    </Provider>
  );
}

export default App;
