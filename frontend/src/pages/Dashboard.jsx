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
    Smartphone,
    MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Lost Items', desc: "Check reported missing items", icon: Search, color: 'bg-indigo-50 text-indigo-600', path: '/lost-items' },
        { label: 'Found Items', desc: "Recovered campus property", icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600', path: '/found-items' },
        { label: 'My Reports', desc: "Manage your active posts", icon: Package, color: 'bg-slate-50 text-slate-600', path: '/my-posts' },
        { label: 'Chat', desc: "Discuss with other partners", icon: MessageSquare, color: 'bg-purple-50 text-purple-600', path: '/chat' }
    ];

    const recentActivity = []; // Temporarily empty as we are transitioning to Chat

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
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-extrabold text-primary">Recent Activity</h2>
                            <button className="text-xs font-bold text-accent hover:underline decoration-2 underline-offset-4">View All Activity</button>
                        </div>
                        
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? recentActivity.map((activity) => (
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
                            )) : (
                                <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
