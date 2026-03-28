import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import { 
    Search, 
    CheckCircle,
    Package,
    MessageSquare,
    Clock,
    ArrowUpRight,
    MapPin,
    Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [recentItems, setRecentItems] = useState([]);
    const [loadingActivity, setLoadingActivity] = useState(true);

    const stats = [
        { label: 'Lost Items', desc: "Check reported missing items", icon: Search, color: 'bg-indigo-50 text-indigo-600', path: '/lost-items' },
        { label: 'Found Items', desc: "Recovered campus property", icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600', path: '/found-items' },
        { label: 'My Reports', desc: "Manage your active posts", icon: Package, color: 'bg-slate-50 text-slate-600', path: '/my-posts' },
        { label: 'Chat', desc: "Messages & conversations", icon: MessageSquare, color: 'bg-purple-50 text-purple-600', path: '/chat' }
    ];

    // Fetch recent items for the activity feed
    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const [lostRes, foundRes] = await Promise.all([
                    axios.get('/api/items?type=lost', config),
                    axios.get('/api/items?type=found', config)
                ]);
                
                // Combine, sort by date, take latest 5
                const all = [...lostRes.data, ...foundRes.data]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);
                    
                setRecentItems(all);
            } catch (err) {
                console.error('Error fetching recent activity:', err);
            } finally {
                setLoadingActivity(false);
            }
        };
        fetchRecent();
    }, [user.token]);

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold text-primary mb-2">Welcome back, {user?.rollNumber}</h1>
                    <p className="text-slate-500 max-w-2xl leading-relaxed">
                        Your lost & found dashboard — report, track, and recover campus belongings.
                    </p>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <Link 
                            key={i} 
                            to={stat.path}
                            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-primary mb-1 group-hover:text-accent transition-colors">{stat.label}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">{stat.desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-extrabold text-primary">Recent Activity</h2>
                        <Link to="/lost-items" className="text-xs font-bold text-accent hover:underline decoration-2 underline-offset-4">View All</Link>
                    </div>
                    
                    <div className="space-y-4">
                        {loadingActivity ? (
                            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center">
                                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading activity...</p>
                            </div>
                        ) : recentItems.length > 0 ? recentItems.map((item) => (
                            <div key={item._id} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-5 hover:border-slate-300 transition-colors group">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                                    {item.image ? (
                                        <img 
                                            src={`/uploads/${item.image}`} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={20} /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {item.type}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                                            <Clock size={10} /> {timeAgo(item.createdAt)}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-primary mb-0.5 truncate">{item.title}</h4>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <span className="flex items-center gap-1"><MapPin size={10} /> {item.location || 'Unknown'}</span>
                                        {item.reporter?.rollNumber && <span>by {item.reporter.rollNumber}</span>}
                                    </div>
                                </div>
                                <Link to={item.type === 'lost' ? '/lost-items' : '/found-items'} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100">
                                    <ArrowUpRight size={18} />
                                </Link>
                            </div>
                        )) : (
                            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No recent activity — start by reporting a lost or found item!</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default Dashboard;
