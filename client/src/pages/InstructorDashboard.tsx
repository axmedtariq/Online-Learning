import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const InstructorDashboard = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalStudents: 0, totalEarnings: 0, avgRating: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${API_URL}/api/courses/instructor/my-courses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(data);

                const totalStudents = data.reduce((acc: number, c: any) => acc + (c.studentsEnrolled?.length || 0), 0);
                const totalRating = data.reduce((acc: number, c: any) => acc + (c.averageRating || 0), 0);
                const avgRating = data.length > 0 ? totalRating / data.length : 0;

                setStats({ totalStudents, totalEarnings: totalStudents * 49.99, avgRating });
            } catch (err) {
                console.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b1326] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#c0c1ff] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#c0c1ff] font-serif italic text-xl animate-pulse">Entering The Premiere...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans selection:bg-[#c0c1ff]/30">
            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-2xl shadow-[0_20px_40px_rgba(6,14,32,0.4)]">
                <div className="flex justify-between items-center px-6 lg:px-12 py-5 w-full max-w-screen-2xl mx-auto h-20">
                    <div className="font-serif text-2xl italic font-bold text-slate-50 cursor-pointer" onClick={() => navigate('/')}>The Premiere</div>
                    <div className="hidden md:flex items-center gap-10">
                        <button className="text-indigo-400 border-b-2 border-indigo-500 pb-1 font-serif text-lg tracking-tight">Management</button>
                        <button className="text-slate-400 font-medium hover:text-indigo-300 transition-all text-sm tracking-widest uppercase" onClick={() => navigate('/courses')}>Browse</button>
                        <button className="text-slate-400 font-medium hover:text-indigo-300 transition-all text-sm tracking-widest uppercase">Performance</button>
                        <button className="text-slate-400 font-medium hover:text-indigo-300 transition-all text-sm tracking-widest uppercase">Settings</button>
                    </div>
                    <div className="flex items-center gap-6">
                        <button 
                            className="bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#1000a9] px-8 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-[#c0c1ff]/10 active:scale-95"
                            onClick={() => navigate('/instructor/create-course')}
                        >
                            Publish Class
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative w-full h-[600px] flex flex-col items-center justify-end overflow-hidden px-6 lg:px-12 border-b border-indigo-500/10">
                    <div className="absolute inset-0 z-0">
                        <img 
                            className="w-full h-full object-cover object-center opacity-40 brightness-75 scale-105 transition-transform duration-[10s] animate-gentle-zoom" 
                            src={user?.profilePic || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000"} 
                            alt="Instructor Profile"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/40 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 w-full max-w-screen-xl mx-auto mb-20 animate-fade-in-up">
                        <div className="max-w-3xl">
                            <span className="font-sans text-[#c0c1ff] tracking-[0.4em] uppercase text-xs mb-6 block font-bold">Respected Mentor & Curator</span>
                            <h1 className="font-serif text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9] italic">
                                {user?.username || 'Expert Practitioner'}
                            </h1>
                            <div className="mt-8 flex items-center gap-12 text-slate-400">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mb-1">Students</span>
                                    <span className="text-2xl font-serif text-white italic">{stats.totalStudents.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mb-1">Revenue</span>
                                    <span className="text-2xl font-serif text-white italic">${stats.totalEarnings.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mb-1">Impact Rating</span>
                                    <span className="text-2xl font-serif text-white italic">{stats.avgRating.toFixed(1)} <span className="text-sm">★</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Philosophical Approach / Intro Section */}
                <section className="py-32 px-6 lg:px-12 bg-[#0b1326]">
                    <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        <div className="lg:col-span-4 sticky top-32">
                            <h2 className="font-serif text-4xl text-white italic font-bold">Curatorial <br/>Philosophy</h2>
                            <div className="w-12 h-1 bg-[#c0c1ff] mt-6 shadow-[0_0_12px_rgba(192,193,255,0.4)]"></div>
                        </div>
                        <div className="lg:col-span-8">
                            <blockquote className="font-serif text-3xl md:text-5xl text-slate-300 leading-relaxed italic font-light mb-12">
                                "The role of the educator is not to distribute information, but to architect an environment where the student can discover their own singular voice."
                            </blockquote>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans text-slate-400 leading-relaxed text-lg">
                                <p>
                                    As part of The Premiere collective, your methodology transcends traditional education. Your classes are designed to be cinematic experiences that demand focus, introspection, and technical mastery.
                                </p>
                                <p>
                                    Maintain the editorial integrity of your catalogs by ensuring every lesson provides unique tensional depth. Excellence is the only metric of authority in this library.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Current Masterclasses Grid */}
                <section className="py-32 px-6 lg:px-12 bg-[#060e20]">
                    <div className="max-w-screen-xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                            <div className="animate-fade-in-left">
                                <h2 className="font-serif text-5xl text-white mb-4 italic font-bold">Published Catalogs</h2>
                                <p className="font-sans text-slate-500 max-w-md">The current collective of your curated wisdom and archived insight.</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 rounded-full border border-slate-700/50 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-indigo-400/50 transition-all">
                                    Analytics
                                </button>
                                <button 
                                    className="px-6 py-3 rounded-full bg-slate-800 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg active:scale-95"
                                    onClick={() => navigate('/instructor/create-course')}
                                >
                                    Add Catalog
                                </button>
                            </div>
                        </div>

                        {/* Bento Grid for Courses */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {courses.length > 0 ? (
                                courses.map((course, idx) => {
                                    // Make first course or every 3rd course larger for bento effect
                                    const isLarge = idx % 3 === 0;
                                    return (
                                        <div 
                                            key={course.id} 
                                            className={`${isLarge ? 'md:col-span-8' : 'md:col-span-4'} group relative overflow-hidden rounded-2xl bg-[#171f33] border border-white/5 hover:border-indigo-400/20 transition-all duration-500 shadow-2xl`}
                                            style={{ aspectRatio: isLarge ? '16/10' : '1/1' }}
                                        >
                                            <img 
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-50 grayscale group-hover:grayscale-0" 
                                                src={course.thumbnail} 
                                                alt={course.title} 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                                            <div className="absolute bottom-0 p-10 w-full translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                <span className="text-[#c0c1ff] text-[10px] font-black tracking-widest uppercase mb-3 block shadow-sm">
                                                    {course.status || 'Active Catalog'}
                                                </span>
                                                <h3 className={`font-serif ${isLarge ? 'text-4xl' : 'text-2xl'} font-bold text-white mb-6 italic tracking-tight group-hover:text-[#c0c1ff] transition-colors`}>
                                                    {course.title}
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-6 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                        <span className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-[#c0c1ff] text-base">group</span>
                                                            {course.studentsEnrolled?.length || 0}
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-[#c0c1ff] text-base">layers</span>
                                                            {course.lessons?.length || 0} Lessons
                                                        </span>
                                                    </div>
                                                    <button 
                                                        className="w-12 h-12 rounded-full glass-card border border-white/10 flex items-center justify-center text-white hover:bg-[#c0c1ff] hover:text-[#1000a9] transition-all shadow-xl group/btn active:scale-90"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/instructor/edit/${course.id}`);
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined text-xl transition-transform group-hover/btn:rotate-45">edit_note</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-12 py-40 text-center bg-[#131b2e] rounded-3xl border border-dashed border-slate-700/50">
                                    <span className="material-symbols-outlined text-7xl text-slate-800 mb-6 block">auto_stories</span>
                                    <h3 className="font-serif text-3xl font-bold text-slate-500 italic mb-10">Your library is waiting for its first masterpiece.</h3>
                                    <button 
                                        onClick={() => navigate('/instructor/create-course')}
                                        className="px-10 py-4 bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#1000a9] font-black uppercase tracking-[0.2em] text-xs rounded-full shadow-2xl active:scale-95"
                                    >
                                        Create New Catalog
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Mobile Bottom NavBar */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-8 pb-8 pt-4 bg-slate-900/80 backdrop-blur-3xl border-t border-slate-800/50 z-50 rounded-t-[40px]">
                <button className="flex flex-col items-center justify-center text-slate-500 hover:text-white transition-all">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    <span className="font-sans text-[9px] font-black uppercase tracking-widest mt-1">Discover</span>
                </button>
                <button className="flex flex-col items-center justify-center text-indigo-300 bg-indigo-500/10 px-6 py-3 rounded-full scale-110 shadow-lg">
                    <span className="material-symbols-outlined">school</span>
                    <span className="font-sans text-[9px] font-black uppercase tracking-widest mt-1">Manage</span>
                </button>
                <button className="flex flex-col items-center justify-center text-slate-500 hover:text-white transition-all" onClick={() => navigate('/profile')}>
                    <span className="material-symbols-outlined">person</span>
                    <span className="font-sans text-[9px] font-black uppercase tracking-widest mt-1">Identity</span>
                </button>
            </nav>

            <style>{`
                @keyframes gentle-zoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.1); }
                }
                .animate-gentle-zoom {
                    animation: gentle-zoom 20s linear infinite alternate;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1.2s ease-out forwards;
                }
                @keyframes fade-in-left {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-left {
                    animation: fade-in-left 1s ease-out forwards;
                }
                .glass-card {
                    background: rgba(34, 42, 61, 0.4);
                    backdrop-filter: blur(12px);
                }
            `}</style>
        </div>
    );
};

export default InstructorDashboard;
