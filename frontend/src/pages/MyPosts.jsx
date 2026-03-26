import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { 
    Package, 
    Trash2, 
    Edit, 
    Eye, 
    Clock, 
    CheckCircle, 
    AlertCircle,
    MapPin,
    Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/items/my-posts', config);
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [user.token]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`http://localhost:5000/api/items/${id}`, config);
            setPosts(posts.filter(post => post._id !== id));
        } catch (error) {
            alert('Failed to delete post');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'claimed': return 'bg-blue-100 text-blue-700';
            case 'resolved': return 'bg-slate-100 text-slate-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary mb-2">My Reports</h1>
                        <p className="text-slate-500 font-medium">Manage and track the status of your reported items.</p>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64 font-bold text-slate-300">Loading your reports...</div>
                ) : posts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">No reports yet</h3>
                        <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm">You haven't reported any lost or found items. Your active reports will appear here.</p>
                        <div className="flex justify-center gap-4">
                            <Link to="/report-lost" className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-light transition-all">Report Lost</Link>
                            <Link to="/report-found" className="bg-white border border-slate-200 text-primary px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Report Found</Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post._id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                                <div className="h-48 bg-slate-100 relative">
                                    {post.image ? (
                                        <img 
                                            src={`http://localhost:5000/uploads/${post.image}`} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Package size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${post.type === 'lost' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                                            {post.type}
                                        </span>
                                    </div>
                                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusStyle(post.status)}`}>
                                        {post.status}
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">{post.title}</h3>
                                    
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{post.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                                {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex gap-2">
                                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(post._id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <Link 
                                            to={`/matches/${post._id}`}
                                            className="flex items-center gap-2 text-xs font-bold text-accent hover:underline"
                                        >
                                            View Matches <Eye size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyPosts;
