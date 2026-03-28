import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
    Send, 
    Upload, 
    MapPin, 
    Calendar, 
    ArrowRight, 
    ChevronLeft,
    CheckCircle,
    Clock,
    Shield
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ReportItem = () => {
    const { type } = useParams(); // 'lost' or 'found'
    const isLost = type === 'lost';
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        image: null
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('type', type);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('location', formData.location);
        data.append('date', formData.date);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.post('/api/items', data, config);
            navigate('/my-posts');
        } catch (error) {
            console.error('Error reporting item:', error);
            alert('Failed to report item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold text-primary mb-3">Report a {isLost ? 'Lost' : 'Found'} Item</h1>
                        <p className="text-slate-500 max-w-xl leading-relaxed text-sm font-medium">
                            Provide the details of your {isLost ? 'missing possession' : 'found item'} to help our digital curators match it with reported {isLost ? 'found' : 'lost'} items.
                        </p>
                    </div>
                    <div className="text-right pb-1">
                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em]">Step {step} of 3</span>
                        <div className="w-32 h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
                        </div>
                    </div>
                </header>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Item Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="e.g., Midnight Blue MacBook Pro 14 inch"
                                        className="w-full px-6 py-4 bg-secondary border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-white outline-none transition-all text-sm font-medium"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Detailed Description</label>
                                    <textarea
                                        name="description"
                                        rows="4"
                                        placeholder="Include distinctive features, stickers, or serial numbers if known..."
                                        className="w-full px-6 py-4 bg-secondary border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-white outline-none transition-all text-sm font-medium resize-none"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Location {isLost ? 'Last Seen' : 'Found'}</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                                                <MapPin size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="e.g., Central Library, Floor 2"
                                                className="w-full pl-14 pr-6 py-4 bg-secondary border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-white outline-none transition-all text-sm font-medium"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Date {isLost ? 'Lost' : 'Found'}</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                                                <Calendar size={18} />
                                            </div>
                                            <input
                                                type="date"
                                                name="date"
                                                className="w-full pl-14 pr-6 py-4 bg-secondary border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-white outline-none transition-all text-sm font-medium"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Upload Item Images</label>
                                    <div className={`
                                        border-2 border-dashed rounded-[2rem] p-12 text-center transition-all
                                        ${preview ? 'border-primary/20 bg-primary/5' : 'border-slate-200 hover:border-primary/30 hover:bg-slate-50'}
                                    `}>
                                        {preview ? (
                                            <div className="relative inline-block">
                                                <img src={preview} alt="Upload Preview" className="max-h-64 rounded-2xl shadow-lg" />
                                                <button 
                                                    type="button"
                                                    onClick={() => {setPreview(null); setFormData({...formData, image: null})}}
                                                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-all"
                                                >
                                                    <ArrowRight className="rotate-45" size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer flex flex-col items-center">
                                                <div className="bg-primary text-white p-4 rounded-full mb-4 shadow-lg shadow-primary/20">
                                                    <Upload size={24} />
                                                </div>
                                                <span className="text-sm font-bold text-primary mb-1">Click to upload or drag and drop</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PNG, JPG or PDF (max. 10MB)</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                            <button 
                                type="button"
                                onClick={() => navigate(-1)}
                                className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                            >
                                <ChevronLeft size={16} /> Back to Dashboard
                            </button>
                            
                            <div className="flex gap-4">
                                <button type="button" className="text-sm font-bold text-slate-400 px-6 py-3 hover:text-primary transition-all">Save as Draft</button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Report'} <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-slate-50 p-6 rounded-2xl flex flex-col gap-3">
                        <Shield className="text-accent" size={24} />
                        <h4 className="text-sm font-extrabold text-primary">Private Matching</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Your contact details are never shared. We curate matches and notify you through the portal.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl flex flex-col gap-3">
                        <CheckCircle className="text-accent" size={24} />
                        <h4 className="text-sm font-extrabold text-primary">Verification Process</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Proof of ownership may be requested by university staff before items are released.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl flex flex-col gap-3">
                        <Clock className="text-accent" size={24} />
                        <h4 className="text-sm font-extrabold text-primary">Active Timeline</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Items are held in the central depository for 90 days before academic donation.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ReportItem;
