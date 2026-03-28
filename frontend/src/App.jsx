import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportItem from './pages/ReportItem';
import MyPosts from './pages/MyPosts';
import LostItems from './pages/LostItems';
import FoundItems from './pages/FoundItems';
import Settings from './pages/Settings';
import Chat from './pages/Chat';

// Protected Route — waits for auth hydration, then redirects if not logged in
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading…</p>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" />;
    return children;
};

// Public Route — redirects logged-in users to dashboard
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (user) return <Navigate to="/dashboard" />;
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/report/:type" element={<ProtectedRoute><ReportItem /></ProtectedRoute>} />
                <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
                <Route path="/lost-items" element={<ProtectedRoute><LostItems /></ProtectedRoute>} />
                <Route path="/found-items" element={<ProtectedRoute><FoundItems /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;
