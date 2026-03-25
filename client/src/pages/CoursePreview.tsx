import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CoursePreview = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/courses/${courseId}`);
                setCourse(response.data);
            } catch (error) {
                console.error("Error fetching course data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) return (
        <div className="min-h-screen bg-[#0b1326] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#c0c1ff] border-t-transparent rounded-full animate-spin"></div>
                <p className="font-serif italic text-xl text-[#c0c1ff] animate-pulse">Curating course excellence...</p>
            </div>
        </div>
    );
    
    if (!course) return (
        <div className="min-h-screen bg-[#0b1326] flex flex-col items-center justify-center p-6 text-center">
            <span className="material-symbols-outlined text-6xl text-red-400 mb-4 font-light">error</span>
            <h1 className="text-4xl font-serif italic font-bold mb-2 text-white tracking-tighter">Course not found</h1>
            <p className="text-slate-400 mb-8 font-medium max-w-sm">The course you are looking for might have been moved, archived, or exists in a different dimension.</p>
            <button 
                onClick={() => navigate('/courses')}
                className="bg-[#c0c1ff] text-[#1000a9] px-10 py-3.5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-all"
            >
                Return to Academy
            </button>
        </div>
    );

    return (
        <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] font-sans selection:bg-[#c0c1ff]/30">
            <Navbar />
            
            <main className="relative pt-20">
                {/* Cinematic Hero Section */}
                <section className="relative min-h-[850px] flex flex-col justify-center px-6 lg:px-12 overflow-hidden border-b border-indigo-500/10">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1326] via-[#0b1326]/80 to-transparent z-10"></div>
                        <img 
                            className="w-full h-full object-cover grayscale opacity-40 brightness-75 scale-105 transition-transform duration-[20s] animate-gentle-zoom" 
                            src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000"} 
                            alt={course.title}
                        />
                    </div>
                    
                    <div className="relative z-20 max-w-5xl animate-fade-in-up">
                        <span className="font-sans text-[#c0c1ff] tracking-[0.4em] uppercase text-xs font-bold mb-6 block">Masterclass Series 0{Math.floor(Math.random() * 9) + 1}</span>
                        <h1 className="font-serif text-6xl md:text-8xl text-white leading-tight mb-8 italic font-light tracking-tight">
                            {course.title.split(':').length > 1 ? (
                                <>
                                    {course.title.split(':')[0]} <br/>
                                    <span className="font-bold text-glow">{course.title.split(':')[1]}</span>
                                </>
                            ) : course.title}
                        </h1>
                        <p className="font-serif text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed italic mb-12">
                            {course.description || "An immersive journey into the technical mastery and poetic sensibility of refined professional practice."}
                        </p>
                        
                        <div className="flex flex-wrap gap-6 items-center">
                            <button 
                                onClick={() => navigate(`/checkout/${course.id}`)}
                                className="bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#1000a9] px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all shadow-2xl active:scale-95"
                            >
                                Join the Masterclass
                            </button>
                            <button className="flex items-center gap-3 text-white group py-5 px-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all">
                                <span className="material-symbols-outlined text-[#c0c1ff] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                                <span className="text-[10px] font-black tracking-widest uppercase">Watch Preview</span>
                            </button>
                        </div>
                    </div>

                    {/* Decorative ProgressIndicator */}
                    <div className="absolute bottom-12 right-12 hidden md:flex flex-col items-end gap-4 animate-fade-in-right">
                        <div className="w-32 h-[3px] bg-white/5 rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-[#c0c1ff] shadow-[0_0_12px_rgba(192,193,255,0.8)] transition-all duration-1000"></div>
                        </div>
                        <span className="font-sans text-[10px] tracking-[0.4em] text-slate-500 uppercase font-black">Curated Insight</span>
                    </div>
                </section>

                {/* Bento Grid: Mentor & Stats */}
                <section className="px-6 lg:px-12 py-32 bg-[#0b1326]">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-screen-2xl mx-auto">
                        {/* Instructor Profile */}
                        <div className="md:col-span-8 bg-[#131b2e] rounded-3xl p-12 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center border border-white/5 shadow-2xl">
                            <div className="relative w-64 h-80 flex-shrink-0 group">
                                <img 
                                    className="w-full h-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-700 contrast-125 hover:scale-105 cursor-pointer" 
                                    src={course.instructor?.profilePic || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800"} 
                                    alt={course.instructor?.username}
                                />
                                <div className="absolute -bottom-4 -right-4 bg-[#c0c1ff] text-[#1000a9] p-4 rounded-full shadow-2xl scale-90">
                                    <span className="material-symbols-outlined text-2xl font-bold">verified</span>
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h2 className="font-serif text-4xl text-white mb-2 italic font-bold">{course.instructor?.username || 'Academy Expert'}</h2>
                                <span className="font-sans text-[#c0c1ff] uppercase tracking-[0.4em] text-[10px] mb-8 block font-black">Lead Instructor & Curator</span>
                                <p className="text-slate-400 leading-relaxed mb-10 text-lg font-serif italic">
                                    {course.instructor?.bio || "A dedicated professional bringing technical precision matched only by a singular poetic sensibility to the craft of digital execution."}
                                </p>
                                <div className="flex gap-12">
                                    <div className="flex flex-col">
                                        <div className="font-serif text-4xl text-white italic font-bold">4.9</div>
                                        <div className="font-sans text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">Instructor Rating</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="font-serif text-4xl text-white italic font-bold">24k+</div>
                                        <div className="font-sans text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">Learners Mentored</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tuition Card */}
                        <div className="md:col-span-4 bg-[#c0c1ff]/5 border border-[#c0c1ff]/20 rounded-3xl p-12 flex flex-col justify-between shadow-2xl">
                            <div>
                                <span className="material-symbols-outlined text-[#c0c1ff] text-5xl mb-8 font-light">local_library</span>
                                <h3 className="font-serif text-3xl text-white mb-4 italic font-bold">Enrollment Period</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                                    Join an exclusive cohort designed for direct critique sessions and high-bandwidth mentorship with industry masters.
                                </p>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/5">
                                <div className="flex justify-between items-end mb-8">
                                    <span className="font-sans text-[10px] text-slate-500 uppercase tracking-widest font-black">Full Tuition</span>
                                    <span className="font-serif text-5xl text-[#c0c1ff] font-bold italic">${course.price || '99.99'} <span className="text-sm line-through text-slate-600 block text-right">${(course.price * 5).toFixed(0)}</span></span>
                                </div>
                                <button 
                                    onClick={() => navigate(`/checkout/${course.id}`)}
                                    className="w-full py-5 rounded-full bg-[#c0c1ff] text-[#1000a9] font-black uppercase tracking-[0.2em] text-[10px] hover:brightness-110 hover:scale-[1.02] transition-all shadow-xl active:scale-95"
                                >
                                    Reserve Enrollment
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Curriculum Architecture */}
                <section className="px-6 lg:px-12 py-32 bg-[#060e20]">
                    <div className="max-w-screen-2xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
                            <div className="max-w-xl">
                                <h2 className="font-serif text-6xl text-white italic leading-tight mb-8 font-bold">The Curriculum <br/> Architecture</h2>
                                <p className="text-slate-400 text-xl font-serif italic">A meticulous breakdown of the masterclass journey, transitioning from abstract theory to the technical mastery of singular execution.</p>
                            </div>
                            <div className="hidden md:block h-32 w-[1px] bg-gradient-to-b from-[#c0c1ff] to-transparent"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {course.lessons && course.lessons.length > 0 ? (
                                course.lessons.slice(0, 9).map((lesson: any, i: number) => (
                                    <div key={lesson.id} className="group border-b border-white/5 pb-12 hover:border-[#c0c1ff]/30 transition-all">
                                        <div className="font-sans text-[#c0c1ff]/30 text-5xl font-extralight mb-8 group-hover:text-[#c0c1ff] transition-colors">0{i + 1}</div>
                                        <h4 className="font-serif text-2xl text-white mb-4 italic font-bold group-hover:text-[#c0c1ff] transition-colors">{lesson.title}</h4>
                                        <p className="text-slate-500 text-sm mb-8 leading-relaxed font-serif italic line-clamp-3">
                                            Exploring the nuances of {lesson.title.toLowerCase()} and its critical application within the broader tapestry of professional excellence.
                                        </p>
                                        <ul className="space-y-4">
                                            <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-slate-300 transition-colors">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>
                                                {lesson.duration || '12:00'} Duration
                                            </li>
                                            <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-slate-300 transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-base text-[#c0c1ff]">play_circle</span>
                                                Archive Preview
                                            </li>
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center text-slate-500 font-serif italic text-xl border border-dashed border-white/10 rounded-3xl">
                                    The syllabus is currently being archived for the new cohort.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Video Preview Action */}
                <section className="px-6 lg:px-12 py-32 bg-[#0b1326]">
                    <div className="max-w-7xl mx-auto relative group cursor-pointer" onClick={() => navigate(`/checkout/${course.id}`)}>
                        <div className="aspect-video rounded-[40px] overflow-hidden border border-white/5 shadow-2xl relative">
                            <img 
                                className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-75 group-hover:grayscale-0 transition-all duration-[2s] scale-105" 
                                src={course.thumbnail} 
                                alt="Lesson Preview" 
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-40 h-40 rounded-full bg-slate-950/40 backdrop-blur-3xl border border-[#c0c1ff]/20 flex items-center justify-center group-hover:scale-110 transition-all duration-700 shadow-2xl group-hover:bg-[#c0c1ff] group-hover:text-[#1000a9] text-[#c0c1ff]">
                                    <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-6 bg-slate-950/80 backdrop-blur-3xl p-10 rounded-3xl border border-white/5 shadow-2xl">
                            <div>
                                <span className="font-sans text-[10px] tracking-[0.4em] text-[#c0c1ff] uppercase font-black block mb-3">Exclusive Insight</span>
                                <h3 className="font-serif text-4xl text-white italic font-bold">Watch the Introductory Session</h3>
                            </div>
                            <div className="text-slate-500 font-sans text-xs font-black uppercase tracking-widest hidden md:block">Runtime: 12:45</div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="px-6 lg:px-12 py-64 text-center bg-[#060e20] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(192,193,255,0.05)_0%,transparent_70%)]"></div>
                    <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up">
                        <h2 className="font-serif text-7xl md:text-9xl text-white italic mb-12 font-bold leading-tight">Master your <br/> <span className="text-[#c0c1ff] font-light text-glow">Practice.</span></h2>
                        <p className="text-slate-400 font-serif text-2xl mb-20 italic">Join the next cohort and redefine how you perceive technical excellence within your field.</p>
                        <div className="flex flex-col md:flex-row gap-8 justify-center">
                            <button 
                                onClick={() => navigate(`/checkout/${course.id}`)}
                                className="bg-[#c0c1ff] text-[#1000a9] px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:shadow-[0_0_50px_rgba(192,193,255,0.4)] transition-all hover:scale-105 active:scale-95"
                            >
                                Enroll Now
                            </button>
                            <button className="border border-white/10 text-white px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:bg-white/5 transition-all backdrop-blur-md">
                                Archive Syllabus
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="px-6 lg:px-12 py-32 border-t border-white/5 bg-[#0b1326]">
                <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
                    <div className="col-span-1 md:col-span-2">
                        <div className="text-3xl font-serif italic tracking-tight text-[#c0c1ff] mb-10 font-bold">Lumina Premiere</div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-sans uppercase tracking-widest font-black">
                            A dedicated institution for elite visual and technical education. <br/> Curated by masters for the next generation of digital artists.
                        </p>
                    </div>
                    {[
                        { title: 'The Institution', links: ['The Manifesto', 'Editorial Standards', 'Lighting Lab'] },
                        { title: 'Legal', links: ['Privacy Policy', 'Terms of Excellence', 'Copyright'] }
                    ].map(col => (
                        <div key={col.title}>
                            <h5 className="font-sans text-[10px] font-black tracking-[0.4em] text-white uppercase mb-10">{col.title}</h5>
                            <ul className="space-y-6 text-[10px] text-slate-500 font-black uppercase tracking-widest italic">
                                {col.links.map(link => (
                                    <li key={link}><button className="hover:text-[#c0c1ff] transition-all hover:translate-x-1 block text-left">{link}</button></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="max-w-screen-2xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] text-slate-700 tracking-[0.5em] uppercase font-black gap-6">
                    <span>© 2026 Lumina Premiere Institution</span>
                    <span>All Rights Reserved</span>
                </div>
            </footer>

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
                @keyframes fade-in-right {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-right {
                    animation: fade-in-right 1s ease-out forwards;
                }
                .text-glow {
                    text-shadow: 0 0 30px rgba(192, 193, 255, 0.4);
                }
            `}</style>
        </div>
    );
};

export default CoursePreview;