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
    const [filterType, setFilterType] = useState('all');
    const { user } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('/api/items/my-posts', config);
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
            await axios.delete(`/api/items/${id}`, config);
            setPosts(posts.filter(post => post._id !== id));
        } catch (error) {
            alert('Failed to delete post');
        }
    };

    const filteredPosts = posts.filter(post => filterType === 'all' || post.type === filterType);

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary mb-2">My Reports</h1>
                        <p className="text-slate-500 font-medium text-sm">Manage and track your reported lost and found items.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/report/lost" className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-light transition-all flex items-center gap-2">
                             Report Lost
                        </Link>
                        <Link to="/report/found" className="bg-white border border-slate-200 text-primary px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                             Report Found
                        </Link>
                    </div>
                </header>

                <div className="mb-8 flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 w-fit">
                    {['all', 'lost', 'found'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filterType === t ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64 font-bold text-slate-300">Loading your reports...</div>
                ) : filteredPosts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200 shadow-sm">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="text-slate-200" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">No {filterType !== 'all' ? filterType : ''} reports found</h3>
                        <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium">Use the buttons above to report a lost or found item.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <div key={post._id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                                <div className="h-48 bg-slate-100 relative">
                                    {post.image ? (
                                        <img 
                                            src={`/uploads/${post.image}`} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Package size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${post.type === 'lost' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                                            {post.type}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-1">{post.title}</h3>
                                    
                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <MapPin size={16} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{post.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <Calendar size={16} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                                {post.date ? new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex gap-2">
                                            <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-all">
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(post._id)}
                                                className="p-3 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
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
