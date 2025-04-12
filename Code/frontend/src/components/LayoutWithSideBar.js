import React from 'react';
import Sidebar from './SideBar';

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
