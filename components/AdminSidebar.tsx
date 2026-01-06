
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Layers, 
  Settings, 
  BarChart3, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import Logo from './Logo';

const AdminSidebar: React.FC = () => {
  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Moderation', icon: ShieldCheck, path: '/admin/moderation' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Categories', icon: Layers, path: '/admin/categories' },
    { name: 'Revenue & Plans', icon: BarChart3, path: '/admin/settings' },
  ];

  return (
    <aside className="w-80 bg-primary min-h-screen flex flex-col border-r border-white/5 sticky top-0">
      <div className="p-8 mb-4">
        <Logo size="sm" className="items-start" />
        <div className="mt-4 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full inline-flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
          <span className="text-[10px] font-black text-accent uppercase tracking-widest">Admin Control</span>
        </div>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-6 py-4 rounded-2xl transition-all group
              ${isActive 
                ? 'bg-accent text-primary shadow-xl shadow-accent/10' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            <div className="flex items-center gap-4">
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
            </div>
            <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity`} />
          </NavLink>
        ))}
      </nav>

      <div className="p-8 border-t border-white/5">
        <button className="flex items-center gap-4 text-gray-400 hover:text-red-400 transition-colors text-xs font-black uppercase tracking-widest px-6 w-full">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
