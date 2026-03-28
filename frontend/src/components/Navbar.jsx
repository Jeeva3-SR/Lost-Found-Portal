import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, User } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();

    // Generate initials from roll number
    const initials = user?.rollNumber ? user.rollNumber.substring(0, 2).toUpperCase() : 'U';

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 font-inter">
            <div className="text-xl font-bold text-primary tracking-tight">AcademicConnect</div>
            
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
                    <button className="text-slate-400 hover:text-primary transition-colors relative">
                        <Bell size={20} />
                    </button>
                    {/* Instagram-style gradient avatar with initials */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <span className="text-xs font-black bg-gradient-to-br from-purple-600 to-pink-500 bg-clip-text text-transparent">{initials}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
