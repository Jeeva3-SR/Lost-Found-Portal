import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  PlusCircle, 
  FileText, 
  Settings, 
  LogOut,
  Package,
  MessageSquare,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const initials = user?.rollNumber ? user.rollNumber.substring(0, 2).toUpperCase() : 'U';

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Lost Items', icon: Search, path: '/lost-items' },
        { name: 'Found Items', icon: PlusCircle, path: '/found-items' },
        { name: 'My Reports', icon: FileText, path: '/my-posts' },
        { name: 'Chat', icon: MessageSquare, path: '/chat' },
    ];

    return (
        <div className="w-64 bg-secondary-light border-r border-slate-200 h-screen sticky top-0 flex flex-col p-6 font-inter">
            <div className="flex items-center gap-2 mb-10 px-2">
                <div className="bg-primary p-1.5 rounded-md text-white">
                    <Package size={20} />
                </div>
                <div>
                    <h1 className="text-sm font-bold text-primary leading-tight">AcademicConnect</h1>
                    <p className="text-[10px] text-slate-400 font-medium">Lost & Found Portal</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                            ${isActive 
                                ? 'bg-white text-primary shadow-sm border border-slate-100' 
                                : 'text-slate-500 hover:bg-slate-100'
                            }
                        `}
                    >
                        <item.icon size={18} />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="pt-4 mt-4 border-t border-slate-200 space-y-1">
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-[1px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <User size={10} className="text-slate-500" />
                        </div>
                    </div>
                    Profile
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <Settings size={18} />
                    Settings
                </NavLink>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all mt-1"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
