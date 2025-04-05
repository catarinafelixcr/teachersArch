import React from 'react';
import Sidebar from './Sidebar';

function LayoutWithSideBar({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}

export default LayoutWithSideBar;
