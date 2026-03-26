import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { 
    Zap, 
    ArrowRight, 
    CheckCircle, 
    ChevronLeft,
    MapPin,
    Calendar,
    User,
    ShieldCheck
} from 'lucide-react';

const Matches = () => {
    const { itemId } = useParams();
    const [matches, setMatches] = useState([]);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                
                // If specific item ID, fetch its matches
                if (itemId) {
                    const [itemRes, matchesRes] = await Promise.all([
                        axios.get(`http://localhost:5000/api/items/${itemId}`, config),
                        axios.get(`http://localhost:5000/api/items/${itemId}/matches`, config)
                    ]);
                    setItem(itemRes.data);
                    setMatches(matchesRes.data);
                } else {
                    // Fetch all possible matches for user's reports (simplified for now)
                    const myPostsRes = await axios.get('http://localhost:5000/api/items/my-posts', config);
                    if (myPostsRes.data.length > 0) {
                        const firstItem = myPostsRes.data[0];
                        setItem(firstItem);
                        const matchesRes = await axios.get(`http://localhost:5000/api/items/${firstItem._id}/matches`, config);
                        setMatches(matchesRes.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, [itemId, user.token]);

    const handleClaim = async (targetItemId) => {
        const message = window.prompt("Enter a message for the finder (e.g., proof of ownership):");
        if (!message) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.post('http://localhost:5000/api/claims', { itemId: targetItemId, message }, config);
            alert('Claim request sent successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send claim');
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto font-inter">
                <header className="mb-10">
                    <Link to="/dashboard" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-2 mb-6">
                        <ChevronLeft size={16} /> Back to Dashboard
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-extrabold text-primary mb-2">Potential Matches</h1>
                            <p className="text-slate-500 font-medium">
                                {item ? `Showing matches for your ${item.type} item: ` : 'Review potential connections discovered by our digital curators.'}
                                {item && <span className="text-accent font-bold">"{item.title}"</span>}
                            </p>
                        </div>
                        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl flex items-center gap-2">
                            <ShieldCheck size={18} />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest">Privacy Protected</span>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64 font-bold text-slate-300">Searching for matches...</div>
                ) : matches.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Zap className="text-slate-200" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-2">No Matches Found Yet</h3>
                        <p className="text-slate-400 mb-0 max-w-sm mx-auto text-sm">We're continuously scanning new reports. You'll be notified via the portal as soon as a potential match is found.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {matches.map((match) => (
                            <div key={match.item._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-8 items-center group relative overflow-hidden">
                                
                                <div className="absolute top-0 right-0 px-6 py-2 bg-accent text-white text-[10px] font-extrabold uppercase tracking-widest rounded-bl-2xl shadow-lg">
                                    {match.score}% Match Confidence
                                </div>

                                <div className="w-full md:w-64 h-48 bg-slate-100 rounded-3xl overflow-hidden shrink-0">
                                    {match.item.image ? (
                                        <img 
                                            src={`http://localhost:5000/uploads/${match.item.image}`} 
                                            alt={match.item.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Zap size={48} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em]">
                                            ITEM {match.item.type}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-2xl font-extrabold text-primary leading-tight group-hover:text-accent transition-colors">
                                        {match.item.title}
                                    </h3>
                                    
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                                        {match.item.description}
                                    </p>

                                    <div className="flex flex-wrap gap-6 pt-2">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <div className="bg-slate-50 p-2 rounded-lg"><MapPin size={14} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Location</span>
                                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">{match.item.location}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <div className="bg-slate-50 p-2 rounded-lg"><Calendar size={14} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Date Reported</span>
                                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                                                    {new Date(match.item.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <div className="bg-slate-50 p-2 rounded-lg"><User size={14} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Reported By</span>
                                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">{match.item.reporter?.rollNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex flex-col gap-3">
                                    <button 
                                        onClick={() => handleClaim(match.item._id)}
                                        className="bg-primary text-white px-8 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/10"
                                    >
                                        Claim Property <CheckCircle size={18} />
                                    </button>
                                    <button className="text-xs font-bold text-slate-400 hover:text-primary py-2 transition-colors">
                                        Not my item
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Matches;
