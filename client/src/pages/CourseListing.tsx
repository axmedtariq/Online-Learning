import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
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
}

const CourseListing = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const navigate = useNavigate();
    
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterVisible, setFilterVisible] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const response = await axios.get<Course[]>(`${API_URL}/api/courses`, {
                    params: { search: query, category: category }
                });
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [query, category]);

    return (
        <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] font-sans selection:bg-[#c0c1ff]/30">
            <Navbar />

            <main className="pt-32 pb-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
                {/* Header Section */}
                <header className="mb-16 border-b border-white/5 pb-16 animate-fade-in-up">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="h-px w-10 bg-[#c0c1ff] shadow-[0_0_12px_rgba(192,193,255,0.6)]"></div>
                        <span className="font-sans text-[#c0c1ff] tracking-[0.5em] uppercase text-[10px] font-black">Archive Directory</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter leading-tight font-bold">
                        {query ? `Results for "${query}"` : category ? `${category} Curations` : 'All Masterclasses'}
                    </h1>
                    <p className="text-xl text-slate-500 font-serif italic mt-4 max-w-2xl leading-relaxed">
                        Master your perception with authoritative instruction from the highest-rated practitioners in the global archive.
                    </p>
                </header>

                {/* Search Controls */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8 sticky top-20 bg-[#0b1326]/80 backdrop-blur-2xl z-40 py-6 border-y border-white/5 px-4 rounded-2xl shadow-3xl">
                    <div className="flex items-center gap-6">
                        <span className="text-2xl font-serif italic text-white font-bold">{courses.length.toLocaleString()} <span className="text-slate-500 text-sm tracking-widest font-sans font-black uppercase ml-2">Archives</span></span>
                        <div className="h-6 w-[1px] bg-white/10 mx-2 hidden md:block"></div>
                        <button 
                            onClick={() => setFilterVisible(!filterVisible)}
                            className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-sans font-black uppercase tracking-[0.2em] text-[9px] text-[#c0c1ff] active:scale-95 shadow-xl"
                        >
                            <span className="material-symbols-outlined text-base">filter_list</span>
                            Filter Matrix
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-none">
                            <select className="appearance-none w-full lg:w-72 bg-white/5 border border-white/10 rounded-full px-8 py-4 font-sans font-black uppercase tracking-[0.2em] text-[9px] text-slate-300 focus:bg-white/10 outline-none transition-all cursor-pointer shadow-xl">
                                <option>Most Relevant</option>
                                <option>Highest Rated</option>
                                <option>Newest Archive</option>
                                <option>Investment: Ascending</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">expand_more</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16">
                    {/* Sidebar Filters */}
                    <aside className={`space-y-12 transition-all duration-500 lg:opacity-100 ${filterVisible ? 'block opacity-100' : 'hidden lg:block'} animate-fade-in-right`}>
                        {/* Rating Filter */}
                        <div className="space-y-8">
                            <h3 className="font-sans font-black text-[10px] uppercase tracking-[0.4em] text-slate-100">Impact Rating</h3>
                            <div className="space-y-4">
                                {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                                    <label key={rating} className="flex items-center gap-5 cursor-pointer group">
                                         <div className="relative w-5 h-5 border border-white/10 rounded-full flex-none group-hover:border-[#c0c1ff] transition-all">
                                            <input type="radio" name="rating" className="absolute inset-0 opacity-0 cursor-pointer peer" />
                                            <div className="absolute inset-1 rounded-full bg-[#c0c1ff] scale-0 peer-checked:scale-100 transition-transform shadow-[0_0_8px_rgba(192,193,255,0.6)]"></div>
                                         </div>
                                        <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                            {[1,2,3,4].map(s => (
                                                <span key={s} className="material-symbols-outlined text-orange-400 text-base" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                            ))}
                                            <span className="material-symbols-outlined text-orange-400 text-base" style={{fontVariationSettings: rating > 4.2 ? "'FILL' 0.5" : "'FILL' 0"}}>star_half</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-100 ml-2">{rating} & Up</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Level Filter */}
                        <div className="space-y-8 pt-12 border-t border-white/5">
                            <h3 className="font-sans font-black text-[10px] uppercase tracking-[0.4em] text-slate-100">Institutional Level</h3>
                            <div className="space-y-5">
                                {['Introductory Theory', 'Intermediate Practice', 'Advanced Mastery', 'Specialized Research'].map((level) => (
                                    <label key={level} className="flex items-center gap-5 cursor-pointer group">
                                        <div className="relative w-5 h-5 border border-white/10 rounded-lg flex-none group-hover:border-[#c0c1ff] transition-all">
                                            <input type="checkbox" className="absolute inset-0 opacity-0 cursor-pointer peer" />
                                            <div className="absolute inset-1 rounded-sm bg-[#c0c1ff] scale-0 peer-checked:scale-100 transition-transform shadow-[0_0_8px_rgba(192,193,255,0.6)]"></div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-[#c0c1ff] transition-colors">{level}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Recommendation Quote */}
                        <div className="pt-20">
                            <div className="bg-[#131b2e] p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#c0c1ff]"></div>
                                <span className="material-symbols-outlined text-[#c0c1ff] text-2xl mb-6 font-light">format_quote</span>
                                <p className="font-serif italic text-slate-400 text-lg leading-relaxed">"Mastery is not a destination, but a state of perpetual refinement."</p>
                                <div className="mt-8 flex items-center gap-4">
                                    <div className="w-8 h-[1px] bg-white/20"></div>
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">The Institution</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Course Listings */}
                    <section className="space-y-12">
                        {loading ? (
                            <div className="space-y-12">
                                {[1,2,3].map(i => (
                                    <div key={i} className="h-80 bg-[#131b2e] rounded-3xl animate-pulse border border-white/5"></div>
                                ))}
                            </div>
                        ) : courses.length > 0 ? (
                            courses.map((course) => (
                                <div 
                                    key={course.id} 
                                    className="group flex flex-col md:flex-row bg-[#131b2e] rounded-[32px] overflow-hidden border border-white/5 hover:border-[#c0c1ff]/20 transition-all duration-700 shadow-2xl relative cursor-pointer"
                                    onClick={() => navigate(`/course/${course.id}`)}
                                >
                                    <div className="w-full md:w-[320px] lg:w-[450px] aspect-video md:aspect-auto overflow-hidden relative shrink-0">
                                        <img 
                                            className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 contrast-125" 
                                            src={course.thumbnail} 
                                            alt={course.title}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#131b2e] via-transparent to-transparent"></div>
                                    </div>
                                    
                                    <div className="flex-1 p-10 flex flex-col relative bg-gradient-to-br from-transparent to-[#0b1326]/30">
                                        <div className="flex justify-between items-start gap-8 mb-6">
                                            <h2 className="text-3xl font-serif italic font-bold text-white tracking-tight leading-tight group-hover:text-glow transition-all">
                                                {course.title}
                                            </h2>
                                            <div className="flex flex-col items-end">
                                                <span className="text-3xl font-serif italic font-bold text-[#c0c1ff] tracking-tighter">${course.price}</span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 line-through mt-1">${(course.price * 5).toFixed(0)}</span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-slate-400 font-serif italic text-lg leading-relaxed mb-10 max-w-2xl opacity-80">
                                            {course.description || "Advance your expert proficiency through an authoritative tutorial environment designed for the modern curatorial practitioner."}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center gap-8 mb-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <span className="text-[#c0c1ff] italic font-serif text-base normal-case font-bold">{course.instructor?.username || 'Curator Name'}</span>
                                            <div className="flex items-center gap-1.5 text-orange-400">
                                                <span className="material-symbols-outlined text-base" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                                <span className="text-white">{course.averageRating || '4.9'}</span>
                                            </div>
                                            <span className="opacity-40">({(course.numReviews || 1205).toLocaleString()} reviews)</span>
                                        </div>
                                        
                                        <div className="mt-auto flex flex-wrap items-center gap-8 border-t border-white/5 pt-8">
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-slate-200 transition-colors">
                                                <span className="material-symbols-outlined text-base text-[#c0c1ff]">play_circle</span> 
                                                {course.lessons?.length || '32'} Units
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-slate-200 transition-colors">
                                                <span className="material-symbols-outlined text-base text-[#c0c1ff]">schedule</span> 
                                                {course.duration || '18.5h'}
                                            </div>
                                            <span className="px-4 py-1.5 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] rounded-full text-slate-400">
                                                {course.level || 'Mastery Level'}
                                            </span>
                                            <button className="ml-auto w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c0c1ff] hover:bg-[#c0c1ff] hover:text-[#1000a9] transition-all group-hover:translate-x-1 shadow-2xl">
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-40 text-center flex flex-col items-center bg-[#131b2e] rounded-[40px] border border-dashed border-white/10">
                                <span className="material-symbols-outlined text-7xl text-slate-800 mb-8 font-light">search_off</span>
                                <h2 className="text-3xl font-serif italic font-bold text-white mb-4">No masterclasses matched your inquiry</h2>
                                <p className="text-slate-500 font-serif italic max-w-sm">Adjust your matrix filters or redefine your search to find the requested curations.</p>
                                <button onClick={() => navigate('/courses')} className="mt-12 px-12 py-4 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all">Reset Matrix</button>
                            </div>
                        )}

                        {/* Pagination */}
                        {courses.length > 0 && (
                            <div className="flex items-center justify-center gap-6 pt-24 animate-fade-in-up">
                                <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">
                                    <span className="material-symbols-outlined scale-125">chevron_left</span>
                                </button>
                                <button className="w-14 h-14 flex items-center justify-center rounded-full bg-[#c0c1ff] text-[#1000a9] font-black text-sm shadow-[0_0_30px_rgba(192,193,255,0.4)] scale-110">1</button>
                                <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-500 hover:text-white font-black text-sm transition-all">2</button>
                                <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-500 hover:text-white font-black text-sm transition-all">3</button>
                                <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all shadow-xl active:scale-95">
                                    <span className="material-symbols-outlined scale-125">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="px-6 lg:px-12 py-32 border-t border-white/5 bg-[#060e20]">
                <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
                    <div className="col-span-1 md:col-span-2 space-y-12">
                        <div className="text-3xl font-serif italic text-[#c0c1ff] font-bold tracking-tighter">Lumina Premiere</div>
                        <p className="text-slate-500 font-sans text-[10px] font-black uppercase tracking-[0.4em] leading-loose max-w-sm">
                            Curated excellence for the modern practitioner. <br/> The Archive is always expanding.
                        </p>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out forwards;
                }
                @keyframes fade-in-right {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-right {
                    animation: fade-in-right 1.2s ease-out forwards;
                }
                .text-glow {
                    text-shadow: 0 0 30px rgba(192, 193, 255, 0.4);
                }
                .shadow-3xl {
                    shadow: 0 40px 80px rgba(0,0,0,0.5);
                }
            `}</style>
        </div>
    );
};

export default CourseListing;
