import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
    const { user, login } = useAuth();
    const [rollNumber, setRollNumber] = useState(user?.rollNumber || '');
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.put('http://localhost:5000/api/auth/profile', { rollNumber }, config);
            
            // Update local storage/context with new user data
            const updatedUser = { ...user, rollNumber: data.rollNumber, token: data.token };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            // Note: If useAuth has a method to update user, use it here. 
            // Assuming we might need to re-login or refresh
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating profile' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put('http://localhost:5000/api/auth/change-password', {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            }, config);
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error changing password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold text-primary mb-2">Account Settings</h1>
                    <p className="text-slate-500 font-medium">Manage your profile and security preferences.</p>
                </header>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {message.type === 'success' ? <ShieldCheck size={20} /> : <Lock size={20} />}
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Profile Section */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <User size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-primary">Profile Information</h2>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Roll Number</label>
                                <input
                                    type="text"
                                    value={rollNumber}
                                    onChange={(e) => setRollNumber(e.target.value)}
                                    className="w-full px-6 py-4 bg-secondary border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-white outline-none transition-all text-sm font-medium"
                                    placeholder="Enter roll number"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                <Save size={18} /> Update Profile
                            </button>
                        </form>
                    </div>

                    {/* Password Section */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Lock size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-primary">Security</h2>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.oldPassword}
                                    onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                                    className="w-full px-6 py-4 bg-secondary border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-white outline-none transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                    className="w-full px-6 py-4 bg-secondary border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-white outline-none transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                    className="w-full px-6 py-4 bg-secondary border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-white outline-none transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                <Save size={18} /> Change Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
