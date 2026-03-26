import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  PlusCircle, 
  Eye, 
  FileText, 
  Settings, 
  LogOut,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Report Lost', icon: Search, path: '/report/lost' },
        { name: 'Report Found', icon: PlusCircle, path: '/report/found' },
        { name: 'View Matches', icon: Eye, path: '/matches' },
        { name: 'My Posts', icon: FileText, path: '/my-posts' },
    ];

    return (
        <div className="w-64 bg-secondary-light border-r border-slate-200 h-screen sticky top-0 flex flex-col p-6 font-inter">
            <div className="flex items-center gap-2 mb-10 px-2">
                <div className="bg-primary p-1.5 rounded-md text-white">
                    <Package size={20} />
                </div>
                <div>
                    <h1 className="text-sm font-bold text-primary leading-tight">Lost & Found</h1>
                    <p className="text-[10px] text-slate-400 font-medium">Digital Curator Portal</p>
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

            <div className="pt-4 mt-4 border-t border-slate-200">
                <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-all"
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
            
            <div className="mt-8 bg-primary rounded-2xl p-4 text-white">
                <h3 className="text-xs font-bold mb-2">Need Help?</h3>
                <p className="text-[10px] text-slate-300 mb-3 leading-relaxed">Contact the student center for immediate assistance.</p>
                <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-[10px] font-bold transition-all">Support Center</button>
            </div>
        </div>
    );
};

export default Sidebar;
