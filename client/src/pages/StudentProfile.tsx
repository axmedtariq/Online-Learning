import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const StudentProfile = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return navigate('/login');
                const response = await axios.get(`${API_URL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (err) {
                console.error("Session expired");
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) return (
        <div className="min-h-screen bg-[#0b1326] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#c0c1ff] border-t-transparent rounded-full animate-spin"></div>
                <p className="font-serif italic text-xl text-[#c0c1ff] animate-pulse">Syncing your intellectual journey...</p>
            </div>
        </div>
    );

    const enrolledCourses = user?.enrolledCourses || [];
    const inProgressCourses = enrolledCourses.filter((c: any) => (c.progress || 0) > 0 && (c.progress || 0) < 100);

    return (
        <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] font-sans selection:bg-[#c0c1ff]/30 selection:text-[#c0c1ff]">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Personalized Greeting */}
                <header className="max-w-screen-2xl mx-auto px-6 lg:px-12 mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2 animate-fade-in-up">
                            <p className="text-[#c0c1ff] font-sans tracking-[0.4em] uppercase text-xs font-bold">Welcome Back, {user?.username || 'Curator'}</p>
                            <h1 className="font-serif italic text-5xl md:text-7xl text-slate-50 tracking-tight leading-tight">
                                Continue your <span className="font-normal not-italic text-slate-300">intellectual journey.</span>
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4 pb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="text-right">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Membership Status</p>
                                <p className="text-slate-200 text-sm font-bold uppercase tracking-wider">Premiere Elite</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#131b2e] border border-white/10 flex items-center justify-center shadow-2xl">
                                <span className="material-symbols-outlined text-[#c0c1ff] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Currently Learning - Horizontal Scroll */}
                {(inProgressCourses.length > 0 || enrolledCourses.length > 0) && (
                    <section className="mb-24 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 mb-8 flex justify-between items-baseline">
                            <h2 className="font-serif text-3xl text-slate-100 italic font-bold">Currently Learning</h2>
                            <button className="text-xs font-black uppercase tracking-widest text-[#c0c1ff] hover:text-white transition-colors border-b border-[#c0c1ff]/30 pb-1">View Full Schedule</button>
                        </div>
                        <div className="flex overflow-x-auto no-scrollbar gap-8 px-6 lg:px-12 pb-8">
                            {(inProgressCourses.length > 0 ? inProgressCourses : enrolledCourses.slice(0, 3)).map((course: any) => (
                                <div key={course.id} className="flex-none w-[350px] md:w-96 group cursor-pointer" onClick={() => navigate(`/watch/${course.id}`)}>
                                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-[#171f33] shadow-2xl border border-white/5">
                                        <img 
                                            src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100 group-hover:grayscale-0 grayscale transition-all"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-4 left-6 right-6">
                                            <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-[#c0c1ff] shadow-[0_0_12px_rgba(192,193,255,0.6)] transition-all duration-1000"
                                                    style={{ width: `${course.progress || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black text-[#c0c1ff] uppercase tracking-[0.3em] mb-2">{course.category || 'Curated Theory'}</p>
                                    <h3 className="font-serif text-2xl text-slate-100 leading-tight italic font-bold group-hover:text-[#c0c1ff] transition-colors">{course.title}</h3>
                                    <p className="text-xs text-slate-500 mt-2 font-serif italic tracking-wide">
                                        {course.progress || 0}% Complete • {course.lessons?.length || 0} Lessons
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Library Filter & Content */}
                <section className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                    <div className="flex items-center gap-12 border-b border-white/5 mb-12 overflow-x-auto no-scrollbar whitespace-nowrap">
                        {[
                            { id: 'all', label: 'All Courses' },
                            { id: 'lists', label: 'My Lists' },
                            { id: 'wishlist', label: 'Wishlist' },
                            { id: 'completed', label: 'Completed' }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                                    activeTab === tab.id ? 'text-slate-100' : 'text-slate-600 hover:text-slate-300'
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c0c1ff] shadow-[0_0_8px_rgba(192,193,255,0.4)]"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        {/* Main Library Grid */}
                        <div className="md:col-span-8 space-y-12">
                            {enrolledCourses.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {enrolledCourses.filter((c: any) => {
                                        if (activeTab === 'completed') return c.progress >= 100;
                                        return true;
                                    }).map((course: any) => (
                                        <div 
                                            key={course.id} 
                                            className="bg-[#131b2e] rounded-2xl overflow-hidden border border-white/5 group cursor-pointer transition-all hover:translate-y-[-8px] hover:border-indigo-400/20 shadow-xl"
                                            onClick={() => navigate(`/watch/${course.id}`)}
                                        >
                                            <div className="aspect-video relative overflow-hidden bg-[#171f33]">
                                                <img 
                                                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"} 
                                                    alt={course.title} 
                                                    className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-700" 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent"></div>
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                                        <span className="material-symbols-outlined text-white text-2xl">play_arrow</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                <h4 className="font-serif text-2xl text-slate-100 mb-3 italic font-bold group-hover:text-[#c0c1ff] transition-colors">{course.title}</h4>
                                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    <span>{course.instructor?.username || 'Curator'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                    <span>{course.lessons?.length || 0} Modules</span>
                                                </div>
                                                <div className="mt-6">
                                                     <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-[#c0c1ff]/40 transition-all"
                                                            style={{ width: `${course.progress || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-32 text-center bg-[#131b2e] rounded-[30px] border border-dashed border-slate-700/50 flex flex-col items-center">
                                    <span className="material-symbols-outlined text-6xl text-slate-800 mb-6 block">import_contacts</span>
                                    <h3 className="font-serif text-2xl font-bold text-slate-500 italic mb-2">Your learning library is empty</h3>
                                    <p className="text-slate-600 text-sm max-w-xs mb-8">Enroll in your first masterclass to begin your curatorial journey.</p>
                                    <button 
                                        onClick={() => navigate('/courses')}
                                        className="px-10 py-3.5 bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#1000a9] font-black uppercase tracking-[0.2em] text-[10px] rounded-full shadow-2xl active:scale-95 transition-all"
                                    >
                                        Explore Academy
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recommended Editorial Sidebar */}
                        <aside className="md:col-span-4 animate-fade-in-right">
                            <div className="bg-[#131b2e] rounded-3xl p-8 sticky top-32 border border-white/5 shadow-2xl">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="font-serif text-2xl text-slate-100 italic font-bold">Recommended</h3>
                                    <span className="material-symbols-outlined text-[#c0c1ff] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                </div>
                                <div className="space-y-10">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="flex gap-5 items-start">
                                                <div className="w-20 h-20 flex-none rounded-xl overflow-hidden bg-slate-800 border border-white/5 shadow-lg">
                                                    <img 
                                                        src={`https://images.unsplash.com/photo-${150000000000 + i}?auto=format&fit=crop&q=80&w=200`} 
                                                        alt="Recommended" 
                                                        className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                                                    />
                                                </div>
                                                <div>
                                                    <h5 className="text-slate-200 font-serif text-lg leading-tight group-hover:text-[#c0c1ff] transition-colors italic font-bold">Perspective & Theory {i}</h5>
                                                    <p className="text-slate-600 text-[9px] mt-2 font-black uppercase tracking-[0.2em]">Editorial Choice</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 pt-10 border-t border-white/5">
                                    <p className="text-slate-500 text-sm leading-relaxed font-serif italic mb-8">
                                        "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
                                    </p>
                                    <button 
                                        onClick={() => navigate('/courses')}
                                        className="w-full py-4 border border-indigo-500/30 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/10 transition-all active:scale-95 shadow-lg"
                                    >
                                        Explore Curriculum
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>

            {/* Footer Shell */}
            <footer className="bg-[#060e20] border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 px-6 lg:px-16 py-24 max-w-screen-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="text-xl font-serif text-slate-200 italic font-bold">Lumina Premiere</div>
                        <p className="font-sans text-slate-500 leading-relaxed text-xs uppercase tracking-widest font-bold">
                            © 2026 Lumina Premiere. <br/> The Art of Curated Learning.
                        </p>
                    </div>
                    {[
                        { title: 'The Institution', links: ['The Manifesto', 'Editorial Standards'] },
                        { title: 'Membership', links: ['Corporate Access', 'Terms of Excellence'] },
                        { title: 'Support', links: ['Concierge', 'Privacy Policy'] }
                    ].map(col => (
                        <div key={col.title} className="space-y-6">
                            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-100">{col.title}</h6>
                            <ul className="space-y-4 font-sans text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                {col.links.map(link => (
                                    <li key={link}><button className="hover:text-[#c0c1ff] transition-all hover:translate-x-1 inline-block">{link}</button></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </footer>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                @keyframes fade-in-right {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-right {
                    animation: fade-in-right 1s ease-out forwards;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default StudentProfile;