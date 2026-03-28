import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, HelpCircle, User, Settings } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 font-inter">
            <div className="text-xl font-bold text-primary tracking-tight">Academic Curator</div>
            
            <div className="flex items-center gap-8">
                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/dashboard" className="text-sm font-bold text-primary border-b-2 border-primary py-1">Dashboard</Link>
                    <Link to="/chat" className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-2">
                        Chat
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </Link>
                    <Link to="/settings" className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">Settings</Link>
                </nav>

                <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                        <Bell size={20} />
                    </button>
                    <button className="text-slate-400 hover:text-primary transition-colors">
                        <HelpCircle size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.rollNumber || 'User'}`} alt="avatar" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
