import React from 'react';

const Header = ({ activeItem, onItemClick }) => {
  const navItems = ['Dashboard', 'HCPs', 'Interactions', 'Reports'];

  const headerStyle = {
    height: '64px',
    borderBottom: '1px solid #dadce0',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    backgroundColor: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const logoStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a73e8',
    marginRight: '48px',
    letterSpacing: '-0.5px',
    cursor: 'pointer'
  };

  const navLinkStyle = (isActive) => ({
    marginRight: '32px',
    color: isActive ? '#1a73e8' : '#5f6368',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: isActive ? '500' : '400',
    padding: '21px 0',
    borderBottom: isActive ? '2px solid #1a73e8' : '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  return (
    <header style={headerStyle}>
      <div style={logoStyle} onClick={() => onItemClick('Dashboard')}>AIVOA.AI</div>
      <nav style={{ display: 'flex' }}>
        {navItems.map(item => (
          <div 
            key={item} 
            style={navLinkStyle(item === activeItem)}
            onClick={() => onItemClick(item)}
          >
            {item}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Header;
