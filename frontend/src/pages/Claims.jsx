import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import {
    MessageSquare,
    Check,
    X,
    Clock,
    User,
    Package,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
// simple comment
const Claims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchClaims();
    }, [user.token]);

    const fetchClaims = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('/api/claims/received', config);
            setClaims(data);
        } catch (error) {
            console.error('Error fetching claims:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put(`/api/claims/${id}`, { status }, config);
            fetchClaims(); // Refresh
        } catch (error) {
            alert('Failed to update claim');
        }
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto font-inter">
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold text-primary mb-2">Claim Requests</h1>
                    <p className="text-slate-500 font-medium">Review and process requests from users claiming items you've found.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64 font-bold text-slate-300">Loading claims...</div>
                ) : claims.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
                        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="text-blue-200" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-2">No active claims</h3>
                        <p className="text-slate-400 mb-0 max-w-sm mx-auto text-sm">When someone claims an item you reported as found, their request will appear here for your review.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {claims.map((claim) => (
                            <div key={claim._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center group transition-all hover:border-slate-300">
                                <div className="bg-slate-50 p-4 rounded-2xl text-primary shrink-0 relative">
                                    <Package size={32} />
                                    {claim.status === 'approved' && (
                                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
                                            <CheckCircle2 size={16} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-1 text-center md:text-left">
                                    <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-1">
                                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Requester:</span>
                                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5">
                                            <User size={12} /> {claim.requester.rollNumber}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-primary">
                                        Claim for "{claim.item?.title}"
                                    </h3>
                                    <p className="text-sm text-slate-500 italic bg-secondary/50 p-4 rounded-xl mt-3 border border-slate-100">
                                        "{claim.message || 'No message provided.'}"
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                                    {claim.status === 'pending' ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAction(claim._id, 'approved')}
                                                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-600/10"
                                            >
                                                <Check size={18} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(claim._id, 'rejected')}
                                                className="flex-1 bg-white border border-red-100 text-red-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                                            >
                                                <X size={18} /> Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 uppercase tracking-widest ${claim.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {claim.status === 'approved' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                            {claim.status}
                                        </div>
                                    )}
                                    <div className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest text-center mt-1">
                                        Request sent {new Date(claim.createdAt).toLocaleDateString()}
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

export default Claims;
