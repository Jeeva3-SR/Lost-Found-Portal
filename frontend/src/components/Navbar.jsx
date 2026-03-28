import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, MessageSquare, Check, X, User } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const initials = user?.rollNumber ? user.rollNumber.substring(0, 2).toUpperCase() : 'U';
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/notifications', config);
                setNotifications(data);
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };
        if (user?.token) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
    }, [user?.token]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/notifications/${id}`, {}, config);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        const unread = notifications.filter(n => !n.isRead);
        for (const n of unread) {
            await markAsRead(n._id);
        }
    };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 font-inter">
            <div className="text-xl font-bold text-primary tracking-tight">AcademicConnect</div>
            
            <div className="flex items-center gap-8">
                <nav className="hidden md:flex items-center gap-6">
                    <NavLink to="/dashboard" className={({ isActive }) => `text-sm font-semibold py-1 transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}>Dashboard</NavLink>
                    <NavLink to="/chat" className={({ isActive }) => `text-sm font-semibold py-1 transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}>Chat</NavLink>
                    <NavLink to="/settings" className={({ isActive }) => `text-sm font-semibold py-1 transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}>Settings</NavLink>
                </nav>

                <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
                    {/* Notification Bell */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="text-slate-400 hover:text-primary transition-colors relative p-2"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/30">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-sm font-extrabold text-primary">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                                            <Check size={10} /> Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <Bell className="mx-auto text-slate-200 mb-3" size={28} />
                                            <p className="text-xs text-slate-400 font-bold">No notifications yet</p>
                                        </div>
                                    ) : (
                                        notifications.slice(0, 15).map(n => (
                                            <div 
                                                key={n._id}
                                                onClick={() => {
                                                    if (!n.isRead) markAsRead(n._id);
                                                    if (n.link) navigate(n.link);
                                                    setShowDropdown(false);
                                                }}
                                                className={`p-4 flex items-start gap-3 cursor-pointer border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                                            >
                                                <div className={`p-2 rounded-xl shrink-0 ${n.type === 'message' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    <MessageSquare size={14} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-primary leading-relaxed line-clamp-2">{n.content}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold mt-1">{timeAgo(n.createdAt)}</p>
                                                </div>
                                                {!n.isRead && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5"></div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile avatar with person silhouette */}
                    <Link to="/profile" className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[2px] hover:scale-110 transition-transform">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <User size={18} className="text-slate-500" />
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
