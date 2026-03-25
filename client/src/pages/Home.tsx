import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface Course {
    id: string | number;
    title: string;
    description?: string;
    price: number;
    thumbnail?: string;
    instructor?: {
        username: string;
    };
    averageRating?: number;
    numReviews?: number;
    lessons?: any[];
    duration?: string;
    level?: string;
    category?: string;
}

const Home = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get<Course[]>(`${API_URL}/api/courses`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const categories = [
        { name: 'Theory', icon: 'auto_stories' },
        { name: 'Practice', icon: 'architecture' },
        { name: 'Digital', icon: 'fluorescent' },
        { name: 'Aesthetic', icon: 'palette' },
        { name: 'Editorial', icon: 'newspaper' },
        { name: 'Mastery', icon: 'workspace_premium' },
    ];

    return (
        <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] font-sans selection:bg-[#c0c1ff]/30 selection:text-[#c0c1ff]">
            <Navbar />
            
            <main className="relative overflow-hidden">
                {/* --- Cinematic Hero Section --- */}
                <section className="relative min-h-screen flex flex-col justify-center px-6 lg:px-12 pt-20">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1326] via-[#0b1326]/60 to-transparent z-10"></div>
                        <img 
                            className="w-full h-full object-cover grayscale opacity-40 brightness-75 scale-105 animate-hero-zoom transition-transform duration-[20s]" 
                            src="https://images.unsplash.com/photo-1542621334-a254cf47738d?auto=format&fit=crop&q=80&w=2000" 
                            alt="Cinematic background"
                        />
                        {/* Dramatic Light Streaks */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#c0c1ff]/10 via-transparent to-transparent opacity-50 z-20 pointer-events-none"></div>
                    </div>
                    
                    <div className="relative z-20 max-w-6xl animate-fade-in-up">
                        <div className="mb-10 flex items-center gap-6 overflow-hidden">
                            <div className="h-px w-10 bg-[#c0c1ff] shadow-[0_0_12px_rgba(192,193,255,0.6)]"></div>
                            <span className="font-sans text-[#c0c1ff] tracking-[0.5em] uppercase text-xs font-black">The Institution of Mastery</span>
                        </div>
                        
                        <h1 className="font-serif text-[clamp(3.5rem,10vw,11rem)] text-white leading-[0.85] italic font-light tracking-tighter mb-12">
                            Elevate your <br/>
                            <span className="font-bold text-glow">Perception.</span>
                        </h1>
                        
                        <p className="font-serif text-xl md:text-3xl text-slate-400 max-w-2xl leading-relaxed italic mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            A high-bandwidth library for practitioners, curators, and architects of the digital age. Curated for those who demand excellence in every singular execution.
                        </p>
                        
                        <div className="flex flex-wrap gap-8 items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <button 
                                onClick={() => navigate('/courses')}
                                className="bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#1000a9] px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:scale-105 transition-all shadow-2xl active:scale-95"
                            >
                                Explore Catalogs
                            </button>
                            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex items-center relative group">
                                <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-14 text-xs font-black uppercase tracking-widest text-white focus:bg-white/10 outline-none transition-all duration-500 shadow-2xl" 
                                    placeholder="Seek wisdom..." 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <span className="material-symbols-outlined absolute left-6 text-slate-500 text-xl group-focus-within:text-[#c0c1ff] transition-colors">search</span>
                            </form>
                        </div>
                    </div>

                    {/* Branding Decorative Scroll */}
                    <div className="absolute bottom-16 right-12 hidden md:block">
                        <div className="flex flex-col items-end gap-6">
                            <div className="flex items-center gap-10">
                                <span className="font-sans text-[10px] tracking-[0.4em] text-slate-500 uppercase font-black">Scroll Catalyst</span>
                                <div className="w-40 h-[1px] bg-gradient-to-r from-transparent to-[#c0c1ff]/30"></div>
                            </div>
                            <span className="font-serif italic text-white text-lg opacity-40">Series I: Digital Architecture</span>
                        </div>
                    </div>
                </section>

                {/* --- Bento-Grid Collections Section --- */}
                <section className="py-40 bg-[#060e20] px-6 lg:px-12">
                    <div className="max-w-screen-2xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                            <div className="max-w-xl">
                                <h2 className="font-serif text-6xl text-white italic font-bold leading-tight mb-8">Curated Editorial Collections</h2>
                                <p className="text-slate-500 font-serif italic text-xl">Choosing brilliance over volume. Our catalogs are refined by lead practitioners for high-tension mastery.</p>
                            </div>
                            <div className="flex gap-4">
                                {['Newest', 'Popular', 'Premium'].map(tab => (
                                    <button key={tab} className="px-8 py-3 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#c0c1ff] hover:border-[#c0c1ff]/30 transition-all active:scale-95">
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bento Layout for Courses */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {courses.length > 0 ? (
                                courses.slice(0, 5).map((course, idx) => {
                                    // Make some boxes larger for bento look
                                    const isLarge = idx === 0 || idx === 3;
                                    return (
                                        <div 
                                            key={course.id} 
                                            className={`${isLarge ? 'md:col-span-8' : 'md:col-span-4'} group relative overflow-hidden rounded-3xl bg-[#131b2e] border border-white/5 shadow-2xl transition-all duration-700 hover:border-[#c0c1ff]/20 hover:translate-y-[-10px] cursor-pointer`}
                                            style={{ aspectRatio: isLarge ? '16/9' : '1/1' }}
                                            onClick={() => navigate(`/course/${course.id}`)}
                                        >
                                            <img 
                                                className="absolute inset-0 w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-90 contrast-125" 
                                                src={course.thumbnail} 
                                                alt={course.title}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent"></div>
                                            
                                            <div className="absolute bottom-0 p-10 w-full translate-y-6 group-hover:translate-y-0 transition-all duration-500">
                                                <span className="text-[#c0c1ff] text-[9px] font-black tracking-[0.3em] uppercase mb-4 block">{course.category || 'Professional Theory'}</span>
                                                <h3 className={`font-serif ${isLarge ? 'text-4xl' : 'text-2xl'} font-bold text-white mb-6 italic tracking-tight leading-tight group-hover:text-glow`}>
                                                    {course.title}
                                                </h3>
                                                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                                    <div className="flex items-center gap-1.5 text-orange-400">
                                                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                        <span className="text-white text-xs font-black">{course.averageRating || '4.9'}</span>
                                                    </div>
                                                    <div className="text-white font-serif italic text-2xl">${course.price}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full py-40 flex flex-col items-center gap-8 justify-center border border-dashed border-white/5 rounded-3xl">
                                    <div className="w-16 h-16 border-4 border-[#c0c1ff]/20 border-t-[#c0c1ff] rounded-full animate-spin"></div>
                                    <p className="font-serif italic text-slate-500 text-2xl animate-pulse">Syncing Library Data...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* --- Institutional Identity Categories --- */}
                <section className="py-40 bg-[#0b1326] border-y border-white/5">
                    <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-24 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-[1.5s] cursor-default">
                             {categories.map(cat => (
                                <div key={cat.name} className="flex flex-col items-center gap-6 group hover:scale-110 transition-all">
                                    <span className="material-symbols-outlined text-7xl text-[#c0c1ff] font-light">{cat.icon}</span>
                                    <span className="font-sans text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase group-hover:text-white transition-colors">{cat.name}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                </section>

                {/* --- Authoritative Vision / CTA Section --- */}
                <section className="py-64 relative bg-[#0b1326] overflow-hidden text-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(192,193,255,0.05)_0%,transparent_70%)]"></div>
                    <div className="max-w-4xl mx-auto relative z-10">
                        <h2 className="font-serif text-[ clamp(3rem,8vw,8rem) ] text-white italic font-bold leading-none mb-16 tracking-tighter">
                            Architect of <br/> <span className="text-[#c0c1ff] font-light text-glow">Identity.</span>
                        </h2>
                        <p className="font-serif text-2xl text-slate-400 mb-20 italic leading-relaxed">Join the next cohort of digital pioneers. Master the authoritative voice and technical depth required for singular professional impact.</p>
                        <div className="flex flex-col md:flex-row gap-8 justify-center">
                            <button 
                                onClick={() => navigate('/signup')}
                                className="bg-[#c0c1ff] text-[#1000a9] px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:scale-105 transition-all shadow-xl shadow-[#c0c1ff]/20 active:scale-95"
                            >
                                Start Today
                            </button>
                            <button 
                                onClick={() => navigate('/courses')}
                                className="border border-white/10 text-white px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:bg-white/5 transition-all backdrop-blur-md"
                            >
                                Archive Curriculum
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* --- Footer (Shared Style) --- */}
            <footer className="bg-[#060e20] border-t border-white/5 px-6 lg:px-12 py-32">
                <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
                    <div className="col-span-1 md:col-span-2 space-y-12">
                        <div className="text-3xl font-serif italic text-[#c0c1ff] font-bold tracking-tighter">Lumina Premiere</div>
                        <p className="text-slate-500 font-sans text-[10px] font-black uppercase tracking-[0.4em] leading-loose max-w-sm">
                            A dedicated institution for elite digital education. <br/> Built for practitioners, by practitioners. <br/> Excellence is our only metric.
                        </p>
                    </div>
                    {[
                        { title: 'The Institution', links: ['The Manifesto', 'Editorial Standards', 'Concierge'] },
                        { title: 'Identity', links: ['Curator Profile', 'Membership Terms', 'Mastery Tracking'] }
                    ].map(col => (
                        <div key={col.title}>
                            <h5 className="font-sans text-[10px] font-black tracking-[0.4em] text-white uppercase mb-12">{col.title}</h5>
                            <ul className="space-y-6 text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] italic">
                                {col.links.map(link => (
                                    <li key={link}><Link className="hover:text-[#c0c1ff] transition-all hover:translate-x-1 block" to="#">{link}</Link></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="max-w-screen-2xl mx-auto mt-32 pt-12 border-t border-white/5 flex justify-between items-center text-[9px] text-slate-700 tracking-[0.5em] uppercase font-black">
                    <span>© 2026 Lumina Premiere Institutional Office</span>
                    <div className="flex gap-12">
                        {['X', 'Linkedin', 'Journal'].map(s => <Link key={s} to="#" className="text-slate-500 hover:text-white transition-all">{s}</Link>)}
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes hero-zoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.1); }
                }
                .animate-hero-zoom {
                    animation: hero-zoom 30s linear infinite alternate;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1.2s ease-out forwards;
                }
                .text-glow {
                    text-shadow: 0 0 40px rgba(192, 193, 255, 0.4);
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default Home;
