import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import { 
    Package, Clock, MapPin, MessageSquare, FileText, 
    Calendar, LogOut, Settings, Shield, User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [myItems, setMyItems] = useState([]);
    const [stats, setStats] = useState({ lost: 0, found: 0, messages: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('lost');

    const initials = user?.rollNumber ? user.rollNumber.substring(0, 2).toUpperCase() : 'U';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const [lostRes, foundRes, convsRes] = await Promise.all([
                    axios.get('/api/items?type=lost', config),
                    axios.get('/api/items?type=found', config),
                    axios.get('/api/messages/conversations', config)
                ]);
                
                const myLost = lostRes.data.filter(i => i.reporter?._id === user._id);
                const myFound = foundRes.data.filter(i => i.reporter?._id === user._id);
                
                setMyItems([...myLost, ...myFound]);
                setStats({
                    lost: myLost.length,
                    found: myFound.length,
                    messages: convsRes.data.length
                });
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const filteredItems = myItems.filter(i => i.type === activeTab);

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
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                    {/* Cover gradient */}
                    <div className="h-36 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                    
                    <div className="px-8 pb-8 relative">
                        {/* Avatar */}
                        <div className="-mt-16 mb-6 flex items-end gap-6">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[3px] shadow-2xl shadow-purple-500/30">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                    <User size={48} className="text-slate-400" />
                                </div>
                            </div>
                            <div className="pb-2 flex-1">
                                <h1 className="text-2xl font-extrabold text-primary">{user?.rollNumber}</h1>
                                <p className="text-sm text-slate-400 font-medium flex items-center gap-2">
                                    <Shield size={14} /> Student • AcademicConnect Member
                                </p>
                            </div>
                            <div className="pb-2 flex items-center gap-3">
                                <Link to="/settings" className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-primary transition-colors flex items-center gap-2">
                                    <Settings size={14} /> Edit Profile
                                </Link>
                                <button 
                                    onClick={() => { logout(); navigate('/login'); }}
                                    className="px-4 py-2.5 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-bold text-red-600 transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <p className="text-2xl font-black text-primary">{stats.lost}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lost Reports</p>
                            </div>
                            <div className="w-px h-8 bg-slate-100"></div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-primary">{stats.found}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Found Reports</p>
                            </div>
                            <div className="w-px h-8 bg-slate-100"></div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-primary">{stats.messages}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversations</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100">
                        <button 
                            onClick={() => setActiveTab('lost')}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest text-center transition-colors border-b-2 ${activeTab === 'lost' ? 'border-red-500 text-red-600 bg-red-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            <Package size={14} className="inline-block mr-2" />
                            Lost ({stats.lost})
                        </button>
                        <button 
                            onClick={() => setActiveTab('found')}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest text-center transition-colors border-b-2 ${activeTab === 'found' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            <FileText size={14} className="inline-block mr-2" />
                            Found ({stats.found})
                        </button>
                    </div>

                    {/* Items Grid */}
                    <div className="p-6">
                        {loading ? (
                            <div className="py-12 text-center">
                                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Loading...</p>
                            </div>
                        ) : filteredItems.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {filteredItems.map(item => (
                                    <div key={item._id} className="group cursor-pointer">
                                        <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3 relative">
                                            {item.image ? (
                                                <img 
                                                    src={`/uploads/${item.image}`} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                    <Package size={40} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <div className="text-white">
                                                    <p className="text-xs font-bold truncate">{item.title}</p>
                                                    <p className="text-[10px] opacity-75 flex items-center gap-1"><MapPin size={10} /> {item.location || 'Unknown'}</p>
                                                </div>
                                            </div>
                                            <div className="absolute top-2 right-2">
                                                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-600">
                                                    {timeAgo(item.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <h4 className="text-xs font-bold text-primary truncate">{item.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                            <MapPin size={9} /> {item.location || 'Unknown'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <Package className="mx-auto text-slate-200 mb-3" size={40} />
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                    No {activeTab} items reported yet
                                </p>
                                <Link to={`/report/${activeTab}`} className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-light transition-colors">
                                    Report {activeTab === 'lost' ? 'a Lost' : 'a Found'} Item
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
