import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
            scrolled ? 'bg-slate-950/90 backdrop-blur-2xl py-4 shadow-2xl' : 'bg-transparent py-6'
        }`}>
            <div className="flex justify-between items-center px-6 lg:px-12 w-full max-w-screen-2xl mx-auto h-12">
                {/* Brand */}
                <Link to="/" className="text-2xl font-serif italic font-bold text-white tracking-tighter group flex items-center gap-3">
                    <span className="text-[#c0c1ff] group-hover:text-white transition-colors duration-500">Lumina</span>
                    <span className="text-slate-100 group-hover:text-[#c0c1ff] transition-colors duration-500">Premiere</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-10 font-serif font-light italic text-slate-400">
                    <Link to="/courses" className="text-sm tracking-widest uppercase font-sans font-black hover:text-[#c0c1ff] transition-all">Curations</Link>
                    <Link to="/courses" className="text-sm tracking-widest uppercase font-sans font-black hover:text-[#c0c1ff] transition-all">Masterclasses</Link>
                    {token && (
                        <Link to="/profile" className="text-[#c0c1ff] font-serif italic text-lg hover:text-white transition-all border-b border-[#c0c1ff]/30 pb-1">Library</Link>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    {/* Search Bar - Minimalist */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
                        <input 
                            type="text"
                            placeholder="Search catalogs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full py-2 px-10 text-xs text-white focus:w-64 w-40 transition-all duration-500 focus:bg-white/10 outline-none font-sans font-black uppercase tracking-widest"
                        />
                        <span className="material-symbols-outlined absolute left-3 text-slate-500 text-lg group-focus-within:text-[#c0c1ff] transition-colors">search</span>
                    </form>

                    {token ? (
                        <div className="flex items-center gap-5">
                            <span className="material-symbols-outlined text-slate-500 hover:text-[#c0c1ff] cursor-pointer transition-all">notifications</span>
                            
                            <div className="relative group/profile">
                                <div 
                                    className="w-10 h-10 rounded-full overflow-hidden border border-white/10 cursor-pointer group-hover/profile:border-[#c0c1ff] transition-all shadow-xl shadow-black/40"
                                    onClick={() => navigate('/profile')}
                                >
                                    {user?.profilePic ? (
                                        <img src={user.profilePic} alt="profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                                            <span className="material-symbols-outlined text-2xl">person</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Dropdown */}
                                <div className="absolute top-full right-0 mt-4 w-56 bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 opacity-0 scale-95 group-hover/profile:opacity-100 group-hover/profile:scale-100 transition-all duration-300 pointer-events-none group-hover/profile:pointer-events-auto shadow-3xl">
                                    <div className="pb-4 mb-4 border-b border-white/5 px-2">
                                        <p className="text-white text-sm font-serif italic font-bold">{user?.username}</p>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{user?.role || 'Curator'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-xs text-slate-400 hover:text-[#c0c1ff] hover:bg-white/5 rounded-lg transition-all font-black uppercase tracking-widest">
                                            <span className="material-symbols-outlined text-lg">account_circle</span>
                                            Identity
                                        </Link>
                                        {user?.role === 'instructor' && (
                                            <Link to="/instructor/dashboard" className="flex items-center gap-3 px-3 py-2 text-xs text-slate-400 hover:text-[#c0c1ff] hover:bg-white/5 rounded-lg transition-all font-black uppercase tracking-widest">
                                                <span className="material-symbols-outlined text-lg">dashboard</span>
                                                Studio
                                            </Link>
                                        )}
                                        {user?.role === 'admin' && (
                                            <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-xs text-slate-400 hover:text-[#c0c1ff] hover:bg-white/5 rounded-lg transition-all font-black uppercase tracking-widest">
                                                <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                                                Command
                                            </Link>
                                        )}
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 rounded-lg transition-all font-black uppercase tracking-widest text-left"
                                        >
                                            <span className="material-symbols-outlined text-lg">logout</span>
                                            Exit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <button 
                                className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all hidden sm:block"
                                onClick={() => navigate('/login')}
                            >
                                Enter
                            </button>
                            <button 
                                className="bg-[#c0c1ff] text-[#1000a9] px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#c0c1ff]/10"
                                onClick={() => navigate('/signup')}
                            >
                                Join
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </nav>
    );
};

export default Navbar;
