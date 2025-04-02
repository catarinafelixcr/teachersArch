import React from 'react';
import Sidebar from './SideBar';

function LayoutWithSidebar({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-page">
        {children}
      </div>
    </div>
  );
}

export default LayoutWithSidebar;
