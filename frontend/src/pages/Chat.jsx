import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Send, User, MessageSquare, Search, ArrowLeft, Package, MapPin, Calendar, ExternalLink, X, Eye } from 'lucide-react';

const Chat = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeItem, setActiveItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const scrollRef = useRef();

    // Parse URL params for direct chat request
    const queryParams = new URLSearchParams(location.search);
    const receiverId = queryParams.get('receiver');
    const itemId = queryParams.get('itemId');

    // Fetch the item details when itemId is present
    useEffect(() => {
        if (itemId) {
            const fetchItem = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get(`http://localhost:5000/api/items/${itemId}`, config);
                    setActiveItem(data);
                    
                    // If we also have a receiverId, immediately set the selected user 
                    // from the item's reporter so chat can proceed without needing a prior conversation
                    if (receiverId && data.reporter) {
                        setSelectedUser(data.reporter);
                    }
                } catch (err) {
                    console.error('Error fetching item details:', err);
                }
            };
            fetchItem();
        }
    }, [itemId, user.token, receiverId]);

    // Fetch conversations list
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/messages/conversations', config);
                setConversations(data);
                
                // If receiverId in URL, try to find existing conversation
                if (receiverId && !selectedUser) {
                    const existing = data.find(c => c.user?._id === receiverId);
                    if (existing) {
                        setSelectedUser(existing.user);
                    } else if (!itemId) {
                        // No item context and no existing conversation — create minimal user
                        setSelectedUser({ _id: receiverId, rollNumber: receiverId.substring(0, 8) });
                    }
                    // If itemId is present, the item fetch effect above handles setting selectedUser
                } else if (data.length > 0 && !selectedUser && !receiverId) {
                    setSelectedUser(data[0].user);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, [user.token, receiverId, activeItem]);

    const hasAutoSent = useRef(false);
    
    // Auto-send the first message when arriving via "I Found It" or "Claim Item"
    useEffect(() => {
        if (selectedUser && itemId && activeItem && !hasAutoSent.current && !loading) {
            const sendInitialMessage = async () => {
                hasAutoSent.current = true;
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const initialContent = activeItem.type === 'lost' 
                        ? `Hi, I found your lost item: "${activeItem.title}". I'd like to return it to you!`
                        : `Hi, I'm claiming the item you found: "${activeItem.title}". It belongs to me!`;
                    
                    const { data } = await axios.post('http://localhost:5000/api/messages', {
                        receiver: selectedUser._id,
                        content: initialContent,
                        item: itemId
                    }, config);
                    
                    setMessages(prev => [...prev, data]);
                    
                    // Refresh conversation list
                    const { data: convs } = await axios.get('http://localhost:5000/api/messages/conversations', config);
                    setConversations(convs);
                } catch (err) {
                    console.error('Error auto-sending message:', err);
                }
            };
            sendInitialMessage();
        }
    }, [selectedUser, activeItem, itemId, user.token, loading]);


    useEffect(() => {
        if (selectedUser) {
            const fetchMessages = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get(`http://localhost:5000/api/messages/${selectedUser._id}`, config);
                    setMessages(data);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchMessages();
            // Start polling for new messages every 5 seconds (simplest way without sockets)
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedUser, user.token]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('http://localhost:5000/api/messages', {
                receiver: selectedUser._id,
                content: newMessage,
                item: itemId
            }, config);
            
            setMessages([...messages, data]);
            setNewMessage('');
            
            // Refresh conversation list to show latest message
            const { data: convs } = await axios.get('http://localhost:5000/api/messages/conversations', config);
            setConversations(convs);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] flex bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
                {/* Conversations List */}
                <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-8 border-b border-slate-50">
                        <h2 className="text-2xl font-extrabold text-primary mb-6">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Find partner..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-12 text-center">
                                <MessageSquare className="mx-auto text-slate-200 mb-4" size={32} />
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No chats yet</p>
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <div 
                                    key={conv.user._id}
                                    onClick={() => setSelectedUser(conv.user)}
                                    className={`p-6 flex items-center gap-4 cursor-pointer border-b border-slate-50 transition-all ${selectedUser?._id === conv.user._id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold shadow-sm">
                                        {conv.user.rollNumber.substring(0, 2)}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-bold text-primary">{conv.user.rollNumber}</span>
                                            <span className="text-[10px] text-slate-400">{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 truncate font-medium">{conv.lastMessage}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Window */}
                <div className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    {selectedUser ? (
                        <>
                            <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 text-slate-400">
                                        <ArrowLeft size={20} />
                                    </button>
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/20">
                                            {selectedUser?.rollNumber?.substring(0, 2) || "U"}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-primary">{selectedUser?.rollNumber || "User"}</h3>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Partner</span>
                                        </div>
                                    </div>
                                    
                                    {activeItem && (
                                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100/50 shadow-inner">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm shrink-0">
                                                {activeItem.image ? (
                                                    <img 
                                                        src={`http://localhost:5000/uploads/${activeItem.image}`} 
                                                        alt={activeItem.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                                                        <Package size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${activeItem.type === 'lost' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                                                        {activeItem.type}
                                                    </span>
                                                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Contextual Product</span>
                                                </div>
                                                <h4 className="text-sm font-extrabold text-primary truncate leading-tight">{activeItem.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={10} /> {activeItem.location}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={10} /> {new Date(activeItem.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/50">
                                {messages.map((msg, idx) => {
                                    const isMe = msg.sender._id === user._id;
                                    return (
                                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] space-y-2`}>
                                                {msg.item && typeof msg.item === 'object' && (
                                                    <div 
                                                        onClick={() => setViewingItem(msg.item)}
                                                        className={`p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-all group/item ${isMe ? 'mr-4 ml-auto' : 'ml-4 mr-auto'}`}
                                                    >
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                                            {msg.item.image ? (
                                                                <img 
                                                                    src={`http://localhost:5000/uploads/${msg.item.image}`} 
                                                                    className="w-full h-full object-cover" 
                                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=Item'; }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={16} /></div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Product Link</p>
                                                            <div className="flex items-center justify-between">
                                                                <h5 className="text-xs font-bold text-blue-600 underline underline-offset-4 decoration-blue-200 group-hover/item:decoration-blue-600 truncate mr-2">
                                                                    {msg.item.title || 'Untitled Item'}
                                                                </h5>
                                                                <Eye size={12} className="text-blue-500 shrink-0 group-hover/item:scale-125 transition-transform" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className={`p-5 rounded-[2rem] text-sm font-medium shadow-md transition-all hover:shadow-lg ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-primary border border-slate-100 rounded-tl-none'}`}>
                                                    {msg.content}
                                                    <div className={`text-[10px] mt-2 opacity-50 font-bold ${isMe ? 'text-right' : 'text-left'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={scrollRef} />
                            </div>

                            <div className="bg-white border-t border-slate-100 p-6">
                                {activeItem && (
                                    <div className="mb-4 flex items-center gap-4 bg-primary/5 p-4 rounded-[2rem] border border-primary/10 animate-in slide-in-from-bottom-4 duration-500 relative group">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm shrink-0">
                                            {activeItem.image ? (
                                                <img src={`http://localhost:5000/uploads/${activeItem.image}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200"><Package size={24} /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${activeItem.type === 'lost' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                                                    {activeItem.type}
                                                </span>
                                                <span className="text-[8px] text-primary font-black uppercase tracking-widest">Chat Context</span>
                                            </div>
                                            <h4 className="text-sm font-black text-primary truncate">{activeItem.title}</h4>
                                        </div>
                                        <button 
                                            onClick={() => setActiveItem(null)}
                                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 flex items-center justify-center shadow-lg transition-all"
                                        >
                                            <Search size={14} className="rotate-45" />
                                        </button>
                                    </div>
                                )}
                                <form onSubmit={handleSendMessage} className="flex gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Type your message..."
                                        className="flex-1 bg-slate-50 border-none rounded-[2rem] px-8 py-5 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold placeholder:text-slate-300"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-primary text-white p-5 rounded-[2rem] hover:bg-primary-light transition-all shadow-[0_15px_30px_-10px_rgba(var(--primary-rgb),0.4)] active:scale-95 group"
                                    >
                                        <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-24 h-24 bg-white rounded-full border border-slate-100 shadow-xl flex items-center justify-center mb-6">
                                <MessageSquare className="text-slate-200" size={48} />
                            </div>
                            <h2 className="text-2xl font-extrabold text-primary mb-2">Select a Conversation</h2>
                            <p className="text-slate-400 text-sm max-w-xs font-medium">Connect with other partners to discuss lost and found items.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Item Detail Modal */}
            {viewingItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewingItem(null)} />
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setViewingItem(null)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-primary transition-all z-10 shadow-lg"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="h-64 bg-slate-100 relative overflow-hidden">
                            {viewingItem.image ? (
                                <img 
                                    src={`http://localhost:5000/uploads/${viewingItem.image}`} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                    <Package size={64} />
                                </div>
                            )}
                            <div className="absolute top-6 left-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${viewingItem.type === 'lost' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                                    {viewingItem.type || 'Item'}
                                </span>
                            </div>
                        </div>

                        <div className="p-8">
                            <h2 className="text-2xl font-black text-primary mb-2 line-clamp-1">{viewingItem.title || 'Untitled Item'}</h2>
                            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed line-clamp-2">
                                {viewingItem.description || `This item was reported as ${viewingItem.type || 'an item'} in ${viewingItem.location || 'campus'}.`}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-3xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Located at</p>
                                    <div className="flex items-center gap-2 text-primary font-bold text-sm truncate">
                                        <MapPin size={16} className="shrink-0" /> {viewingItem.location || 'Unknown'}
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-3xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Date Reported</p>
                                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                        <Calendar size={16} className="shrink-0" /> {viewingItem.date ? new Date(viewingItem.date).toLocaleDateString() : 'Unknown'}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setViewingItem(null)}
                                className="w-full mt-8 bg-primary text-white py-5 rounded-[2rem] font-black text-sm hover:bg-black transition-all shadow-xl shadow-primary/20"
                            >
                                Back to Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Chat;
