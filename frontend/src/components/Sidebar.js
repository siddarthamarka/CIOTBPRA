import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/CIOTBPRALogo.png';

const NAV = [
  { to: '/dashboard',  label: 'Overview',  icon: '◈' },
  { to: '/trends',     label: 'Trends',    icon: '↗' },
  { to: '/analytics',  label: 'Analytics', icon: '⬡' },
  { to: '/history',    label: 'History',   icon: '≡' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src={logo} alt="CIOT-BPRA Logo" className="sidebar__logo-img" />
        <div>
          <p className="sidebar__brand-name">CIOT-BPRA</p>
          <p className="sidebar__brand-sub">Health Monitor</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__link-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={handleLogout}>
          <span>⏻</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}