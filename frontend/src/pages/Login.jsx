import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Lock, ArrowRight, Info } from 'lucide-react';

const Login = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(rollNumber, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4 font-inter">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px]">
                
                {/* Left Side: Branding */}
                <div className="md:w-1/2 bg-secondary-light p-12 flex flex-col justify-between relative">
                    <div>
                        <div className="flex items-center gap-3 text-primary font-bold text-xl mb-16">
                            <div className="bg-primary p-2 rounded-lg text-white">
                                <LayoutDashboard size={24} />
                            </div>
                            <span>AcademicConnect</span>
                        </div>
                        
                        <h1 className="text-5xl font-extrabold text-primary leading-tight mb-6">
                            The Digital <br />
                            <span className="text-accent">Curator Portal</span>
                        </h1>
                        
                        <p className="text-slate-500 text-lg max-w-md leading-relaxed">
                            Recovering lost possessions with the same precision and care as our academic excellence.
                        </p>
                    </div>
                    
                    <div className="mt-12">
                        <div className="bg-slate-200 rounded-2xl h-48 w-full flex items-center justify-center overflow-hidden">
                            <div className="text-slate-400 opacity-50">
                                <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800" alt="University" className="w-full h-full object-cover grayscale" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 tracking-widest uppercase">
                            Est. 1924 • Institutional Integrity
                        </p>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-3xl font-bold text-primary mb-2">Welcome Back</h2>
                        <p className="text-slate-500 mb-8 text-sm">Please enter your credentials to access the portal.</p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex gap-3 items-center mb-6 border border-red-100 animate-shake">
                                <Info size={20} className="shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Roll Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <LayoutDashboard size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2024-UG-452"
                                        className="w-full pl-12 pr-4 py-4 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                        value={rollNumber}
                                        onChange={(e) => setRollNumber(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-semibold text-primary">Password</label>
                                    <a href="#" className="text-sm text-accent font-medium hover:underline">Forgot Password?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="remember" className="rounded border-slate-300 text-primary focus:ring-primary" />
                                <label htmlFor="remember" className="text-sm text-slate-500">Keep me logged in for 30 days</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/10 active:scale-[0.98]"
                            >
                                Sign Into Portal <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account? <Link to="/register" className="text-accent font-bold hover:underline">Register as student</Link>
                            </p>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center gap-6 text-xs text-slate-400 font-medium">
                            <a href="#" className="hover:text-primary transition-colors">Security Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Support Desk</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">System Status: Secure & Operational</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
