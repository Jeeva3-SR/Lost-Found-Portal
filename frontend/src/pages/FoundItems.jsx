import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { 
    Search, 
    MapPin, 
    Calendar, 
    Package, 
    ArrowRight,
    SearchCheck
} from 'lucide-react';

const FoundItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/items?type=found', config);
                setItems(data);
            } catch (error) {
                console.error('Error fetching found items:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [user.token]);

    const filteredItems = items.filter(item => {
        // Exclude own reports — those belong in "My Reports"
        if (item.reporter?._id === user._id) return false;

        const matchesSearch = (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        let matchesDate = true;
        let matchesMonth = true;
        let matchesYear = true;
        if (item.date) {
            const itemDate = new Date(item.date);
            if (dateFilter) {
                matchesDate = itemDate.toISOString().split('T')[0] === dateFilter;
            }
            matchesMonth = monthFilter === '' || itemDate.getMonth().toString() === monthFilter;
            matchesYear = yearFilter === '' || itemDate.getFullYear().toString() === yearFilter;
        }

        return matchesSearch && matchesDate && matchesMonth && matchesYear;
    });

    const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
    const months = [
        { val: '0', name: 'January' }, { val: '1', name: 'February' }, { val: '2', name: 'March' },
        { val: '3', name: 'April' }, { val: '4', name: 'May' }, { val: '5', name: 'June' },
        { val: '6', name: 'July' }, { val: '7', name: 'August' }, { val: '8', name: 'September' },
        { val: '9', name: 'October' }, { val: '10', name: 'November' }, { val: '11', name: 'December' }
    ];

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary mb-2">Found Items Gallery</h1>
                        <p className="text-slate-500 font-medium text-sm">Browse recovered items and claim what belongs to you.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search items..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:border-primary/20 outline-none transition-all text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-bold text-slate-600 outline-none focus:border-primary/20 cursor-pointer"
                            />
                            <select 
                                value={monthFilter}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="pl-4 pr-10 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-bold text-slate-600 outline-none focus:border-primary/20 cursor-pointer appearance-none"
                            >
                                <option value="">Month</option>
                                {months.map(m => <option key={m.val} value={m.val}>{m.name}</option>)}
                            </select>
                            
                            <select 
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="pl-4 pr-10 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-bold text-slate-600 outline-none focus:border-primary/20 cursor-pointer appearance-none"
                            >
                                <option value="">Year</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64 font-bold text-slate-300">Loading found items...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-sm">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <SearchCheck className="text-slate-300" size={36} />
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-2">No found items yet</h3>
                        <p className="text-slate-400 mb-0 max-w-xs mx-auto text-sm font-medium">Try searching or broaden your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <div key={item._id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group">
                                <div className="h-56 bg-slate-100 relative">
                                    {item.image ? (
                                        <img 
                                            src={`http://localhost:5000/uploads/${item.image}`} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Package size={56} />
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg shadow-blue-600/20">
                                            Found
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-1">{item.title}</h3>
                                    <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2 font-medium">{item.description}</p>
                                    
                                    <div className="flex flex-col gap-3 mb-8">
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <div className="p-1.5 bg-slate-50 rounded-lg">
                                                <MapPin size={14} className="text-primary" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <div className="p-1.5 bg-slate-50 rounded-lg">
                                                <Calendar size={14} className="text-primary" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {item.reporter?._id && (
                                        <button 
                                            onClick={() => navigate(`/chat?receiver=${item.reporter._id}&itemId=${item._id}`)}
                                            className="w-full bg-blue-600 text-white py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-black transition-all group/btn shadow-lg shadow-blue-600/10"
                                        >
                                            Claim Item <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default FoundItems;
