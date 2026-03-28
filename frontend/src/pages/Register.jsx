import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Lock, ArrowRight, Info, UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        rollNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            await register({
                rollNumber: formData.rollNumber,
                password: formData.password
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4 font-inter">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px]">
                
                {/* Left Side: Branding */}
                <div className="md:w-1/2 bg-slate-900 p-12 flex flex-col justify-between relative text-white">
                    <div className="z-10">
                        <div className="flex items-center gap-3 font-bold text-xl mb-16">
                            <div className="bg-white p-2 rounded-lg text-primary">
                                <LayoutDashboard size={24} />
                            </div>
                            <span>AcademicConnect</span>
                        </div>
                        
                        <h1 className="text-5xl font-extrabold leading-tight mb-6">
                            Join the <br />
                            <span className="text-accent">Guardian Network</span>
                        </h1>
                        
                        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                            Create your account to start reporting lost items and helping others recover their property.
                        </p>
                    </div>
                    
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <img src="https://images.unsplash.com/photo-1523050335102-c32509087440?auto=format&fit=crop&q=80&w=1200" alt="Campus" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-3xl font-bold text-primary mb-2">Create Account</h2>
                        <p className="text-slate-500 mb-8 text-sm">Register with your university roll number.</p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex gap-3 items-center mb-6 border border-red-100 animate-shake">
                                <Info size={20} className="shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Roll Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <LayoutDashboard size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        placeholder="e.g. 2024-UG-452"
                                        className="w-full pl-12 pr-4 py-4 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                        value={formData.rollNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/10 mt-4"
                            >
                                Create Account <UserPlus size={20} />
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500">
                                Already have an account? <Link to="/login" className="text-accent font-bold hover:underline">Sign in instead</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
