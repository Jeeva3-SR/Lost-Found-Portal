import React from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { 
    Search, 
    PlusCircle, 
    Zap, 
    Clock, 
    ArrowRight, 
    CheckCircle,
    Package,
    Navigation,
    CreditCard,
    Headphones,
    Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Report Lost Item', desc: "Describe what you're missing", icon: Search, color: 'bg-indigo-50 text-indigo-600', path: '/report/lost' },
        { label: 'Report Found Item', desc: "Help return someone's property", icon: PlusCircle, color: 'bg-blue-50 text-blue-600', path: '/report/found' },
        { label: 'View Matches', desc: "Potential item connections", icon: Zap, color: 'bg-amber-50 text-amber-600', badge: '03 NEW', path: '/matches' },
        { label: 'My Posts', desc: "Manage your active reports", icon: Package, color: 'bg-slate-50 text-slate-600', badge: '07 TOTAL', path: '/my-posts' }
    ];

    const recentActivity = [
        { id: 1, title: 'Silver MacBook Pro', details: 'Reported Lost • Engineering Library', time: '2 hours ago', status: 'In Review', icon: Smartphone },
        { id: 2, title: 'Leather Wallet', details: 'Reported Found • Student Center', time: 'Yesterday', status: 'Match Found', statusColor: 'text-blue-600', icon: CreditCard },
        { id: 3, title: 'Car Key Fob', details: 'Reported Found • Faculty Parking', time: '3 days ago', status: 'Closed', icon: Navigation }
    ];

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold text-primary mb-2">Welcome back, {user?.rollNumber}</h1>
                    <p className="text-slate-500 max-w-2xl leading-relaxed">
                        Your digital curator dashboard for tracking campus belongings and lost-and-found status.
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
                                {stat.badge && (
                                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-md text-[10px] font-bold">
                                        {stat.badge}
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-primary mb-1 group-hover:text-accent transition-colors">{stat.label}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">{stat.desc}</p>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-extrabold text-primary">Recent Activity</h2>
                            <button className="text-xs font-bold text-accent hover:underline decoration-2 underline-offset-4">View All Activity</button>
                        </div>
                        
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-5 hover:border-slate-300 transition-colors">
                                    <div className="bg-slate-50 p-3 rounded-xl text-primary">
                                        <activity.icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-primary mb-0.5">{activity.title}</h4>
                                        <p className="text-xs text-slate-400 font-medium">{activity.details}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-[10px] font-extrabold uppercase tracking-wider mb-1 ${activity.statusColor || 'text-slate-400'}`}>
                                            {activity.status}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Latest Matches Side Panel */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-extrabold text-primary">Latest Matches</h2>
                        
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-3xl border-2 border-blue-600 shadow-lg shadow-blue-600/5 relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                                        High Confidence
                                        <CheckCircle size={14} className="fill-current text-blue-600" />
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-primary mb-2">Sony Headphones (Black)</h4>
                                <p className="text-xs text-slate-500 mb-6 leading-relaxed font-medium">Matches your "Lost Sony XM4" report from Nov 12.</p>
                                <button className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                                    Claim Property
                                </button>
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CheckCircle size={16} className="text-blue-600" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                                        Potential Match
                                        <Clock size={14} />
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-primary mb-2">Hydroflask Water Bottle</h4>
                                <p className="text-xs text-slate-500 mb-6 leading-relaxed font-medium">Found near Gym. Could be your reported "Blue Hydroflask".</p>
                                <button className="w-full border border-slate-200 text-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-inter">
                                    Verify Details
                                </button>
                                <div className="absolute -bottom-4 -right-4 text-orange-50 opacity-10">
                                    <PlusCircle size={80} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
