import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut, Settings, Zap
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
];

const adminItems = [
  { to: '/team', icon: Users, label: 'Team' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <aside className="flex flex-col h-full" style={{
      width: '220px',
      minWidth: '220px',
      background: '#080808',
      borderRight: '1px solid #111111',
      padding: '16px 12px',
    }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg"
          style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
          <Zap size={14} color="white" />
        </div>
        <div>
          <span style={{ fontWeight: 700, fontSize: '14px', color: '#f5f5f0', letterSpacing: '-0.02em' }}>Ethara</span>
          <span style={{ fontWeight: 300, fontSize: '14px', color: '#555550', letterSpacing: '-0.02em' }}>Flow</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        <div style={{ fontSize: '10px', fontWeight: 500, color: '#333330', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: '6px' }}>
          Workspace
        </div>

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div style={{ fontSize: '10px', fontWeight: 500, color: '#333330', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: '6px', marginTop: '16px' }}>
              Admin
            </div>
            {adminItems.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User Section */}
      <div style={{ borderTop: '1px solid #111111', paddingTop: '12px', marginTop: '12px' }}>
        <div className="flex items-center gap-2.5 px-2 mb-3">
          <div className="avatar" style={{ width: '28px', height: '28px', background: '#161616', fontSize: '11px' }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#f5f5f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '10.5px', color: '#444440', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.role}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="sidebar-item w-full"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
