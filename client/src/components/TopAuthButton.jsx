import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User } from 'lucide-react';
import { useAppData } from '../context/AppContext';

export default function TopAuthButton({ theme = 'light', className = 'absolute top-4 right-4 z-50' }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppData();

  const isDark = theme === 'dark';
  const buttonClass = isDark 
    ? "flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm transition-all shadow-sm border border-white/10"
    : "flex items-center gap-2 bg-white hover:bg-surface-high backdrop-blur-md px-4 py-2 rounded-full text-navy font-semibold text-sm transition-all shadow-sm border border-outline-light";

  return (
    <div className={className}>
      {isAuthenticated ? (
        <button
          onClick={() => navigate('/dashboard')}
          className={buttonClass}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className={buttonClass}
        >
          <User size={16} />
          Login
        </button>
      )}
    </div>
  );
}
