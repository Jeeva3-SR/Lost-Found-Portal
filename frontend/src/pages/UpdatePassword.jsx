import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2, Circle, Info } from 'lucide-react';

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { changePassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await changePassword(oldPassword, newPassword);
            navigate('/dashboard');
        } catch (err) {
            setError(err);
        }
    };

    const requirements = [
        { label: '8+ Characters', met: newPassword.length >= 8 },
        { label: 'One Number', met: /\d/.test(newPassword) },
        { label: 'Special Char', met: /[^A-Za-z0-9]/.test(newPassword) },
        { label: 'Mixed Case', met: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) },
    ];

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4 font-inter">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px]">
                
                {/* Left Side: Branding */}
                <div className="md:w-2/5 bg-primary p-12 text-white flex flex-col justify-between">
                    <div>
                        <div className="text-2xl font-bold mb-16 underline decoration-accent underline-offset-8">Academic Curator</div>
                        
                        <div className="space-y-8 mt-24">
                            <div className="w-12 h-1 bg-slate-400 opacity-50"></div>
                            <h1 className="text-4xl font-extrabold leading-tight">
                                Secure your <br />
                                curator identity.
                            </h1>
                            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
                                Our enhanced security protocols ensure that your research data and academic records remain private and protected.
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex -space-x-3 mb-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-slate-300 overflow-hidden">
                                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400">Joined by 4,000+ researchers this month</p>
                    </div>
                    
                    <div className="flex gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Security Terms</a>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-3/5 p-12 flex flex-col justify-center bg-slate-50/30">
                    <div className="max-w-md mx-auto w-full">
                        <div className="inline-flex items-center gap-2 bg-red-100/50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            Action Required
                        </div>
                        
                        <h2 className="text-3xl font-bold text-primary mb-2">Update Credentials</h2>
                        <p className="text-slate-500 mb-8 text-sm">You must change your password before continuing to the Academic Curator dashboard.</p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100 flex items-center gap-2">
                                <Info size={16} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Old Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Enter current password"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-200/50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Create new password"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-200/50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {requirements.map((req, idx) => (
                                        <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-medium transition-colors ${req.met ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200/50 text-slate-500'}`}>
                                            {req.met ? <CheckCircle2 size={14} className="text-indigo-600" /> : <Circle size={14} />}
                                            {req.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Repeat new password"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-200/50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/10"
                            >
                                Update Credentials <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className="mt-8 text-center text-xs font-bold">
                            <a href="#" className="text-accent hover:underline uppercase tracking-widest">Contact IT Support</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <p className="absolute bottom-6 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                © 2024 Academic Curator Portal. Institutional Rights Reserved.
            </p>
        </div>
    );
};

export default UpdatePassword;
