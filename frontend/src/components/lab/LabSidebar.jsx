import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, FileText, Package, ChevronsLeft, ChevronsRight } from 'lucide-react';

const SidebarNavLink = ({ to, icon: Icon, text, isCollapsed, onCloseMobileSidebar }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `w-full flex items-center py-3 rounded-lg transition-all duration-200 ${
                isCollapsed ? 'px-3 justify-center' : 'px-4 space-x-3'
            } ${
                isActive 
                ? 'bg-gradient-to-r from-[#0096C7] to-[#2A9D8F] text-white shadow-md' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`
        }
        onClick={onCloseMobileSidebar} // Close mobile sidebar on link click
    >
        <Icon size={22} className="flex-shrink-0" />
        {/* Text ko conditionally render kiya gaya hai */}
        {!isCollapsed && <span className="font-semibold">{text}</span>}
    </NavLink>
);

const LabSidebar = ({ isCollapsed, toggleCollapse, onCloseMobileSidebar }) => {
  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/lab/dashboard',
    },
    {
      name: 'Test Order Management',
      icon: CalendarDays,
      path: '/lab/test-order-management',
    },
    {
      name: 'Report & Data Management',
      icon: FileText,
      path: '/lab/report-data-management',
    },
    {
      name: 'Stock Analytics',
      icon: Package,
      path: '/lab/stock-analytics',
    },
  ];

  console.log('LabSidebar.jsx - Nav Items:', navItems);

  return (
    <aside className="w-full h-full bg-card text-foreground flex flex-col p-4 border-r border-border relative">
      {/* HealthSphere Logo for Desktop View */}
      <div className={`mb-6 items-center transition-all duration-300 ${isCollapsed ? 'justify-center flex' : 'justify-between px-2 flex'} hidden md:flex`}>
        <NavLink to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2] p-2 rounded-md">
            <LayoutDashboard className="text-primary-foreground" size={24}/>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
              Lab Dashboard
            </span>
          )}
        </NavLink>
      </div>

      {/* HealthSphere Logo for Mobile View */}
      {!isCollapsed && (
        <div className="mb-6 flex items-center justify-between md:hidden">
          <NavLink to="/" className="flex items-center space-x-2" onClick={onCloseMobileSidebar}>
            <div className="bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2] p-2 rounded-md">
              <LayoutDashboard className="text-primary-foreground" size={24}/>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
              Lab Dashboard
            </span>
          </NavLink>
          {onCloseMobileSidebar && (
            <button
              onClick={onCloseMobileSidebar}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <ChevronsLeft size={20} />
            </button>
          )}
        </div>
      )}
      
      {/* Desktop Collapse Button */}
      <button 
          onClick={toggleCollapse} 
          className="absolute -right-3 top-8 z-10 p-1 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hidden md:block"
      >
          {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
      </button>
      
      <nav className="flex-1 flex flex-col space-y-2">
        {navItems.map((item) => (
          <SidebarNavLink 
              key={item.name}
              to={item.path}
              icon={item.icon}
              text={item.name}
              isCollapsed={isCollapsed}
              onCloseMobileSidebar={onCloseMobileSidebar} // Pass this prop down
          />
        ))}
      </nav>
    </aside>
  );
};

export default LabSidebar;
