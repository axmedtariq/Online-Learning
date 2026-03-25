import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import QuizComponent from '../components/QuizComponent';
import ReviewForm from '../components/ReviewForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface Lesson {
    id: string | number;
    title: string;
    videoUrl: string;
    description?: string;
    duration?: string;
    completed?: boolean;
}

interface Course {
    id: string | number;
    title: string;
    lessons: Lesson[];
    numQuizzes?: number;
}

const WatchCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeLesson, setActiveLesson] = useState(0);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('content');

    const fetchFullCourse = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<Course>(`${API_URL}/api/courses/watch/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourse(response.data);
        } catch (err) {
            console.error("Access denied or course not found");
            navigate(`/course/${courseId}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFullCourse();
    }, [courseId, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-[#0b1326] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-[#c0c1ff]/20 border-t-[#c0c1ff] rounded-full animate-spin"></div>
                <p className="font-serif italic text-2xl text-[#c0c1ff] animate-pulse">Syncing High-Bandwidth Stream...</p>
            </div>
        </div>
    );

    if (!course || !course.lessons.length) return (
        <div className="min-h-screen bg-[#0b1326] flex items-center justify-center text-white">
            <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-slate-700 mb-6">videocam_off</span>
                <p className="font-serif italic text-2xl">The requested curations are currently offline.</p>
                <button onClick={() => navigate(-1)} className="mt-8 px-10 py-3 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Back to Archive</button>
            </div>
        </div>
    );

    const currentLesson = course.lessons[activeLesson];

    return (
        <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] font-sans selection:bg-[#c0c1ff]/30">
            <Navbar />

            <main className="pt-24 lg:pt-28 pb-20 px-4 md:px-8 lg:px-12 max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* --- Primary Cinematic Player Area --- */}
                    <div className="lg:col-span-8 space-y-8 animate-fade-in-up">
                        {/* Video Frame */}
                        <div className="relative aspect-video rounded-[40px] overflow-hidden bg-black shadow-[0_40px_100px_rgba(0,0,0,0.7)] group border border-white/5">
                            <video
                                key={currentLesson.videoUrl}
                                controls
                                className="w-full h-full object-contain"
                                controlsList="nodownload"
                                poster={currentLesson.videoUrl + "#t=5"}
                            >
                                <source src={currentLesson.videoUrl} type="video/mp4" />
                            </video>

                            {/* Cinematic Overlay (Hidden when playing usually) */}
                            <div className="absolute top-8 left-8 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                <span className="px-4 py-1 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#c0c1ff] border border-white/10">Ultra HD 4K</span>
                                <span className="px-4 py-1 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white/60 border border-white/10">Singular Execution</span>
                            </div>
                        </div>

                        {/* Player Controls Under Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                            <div className="space-y-3">
                                <span className="text-[#c0c1ff] font-serif italic text-xl font-bold opacity-60">Sequence {activeLesson + 1} of {course.lessons.length}</span>
                                <h1 className="font-serif text-3xl md:text-5xl font-bold italic text-white tracking-tight leading-tight">{currentLesson.title}</h1>
                            </div>
                            <div className="flex gap-4">
                                <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#c0c1ff] hover:text-[#1000a9] transition-all shadow-xl active:scale-95">
                                    <span className="material-symbols-outlined">share</span>
                                </button>
                                <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#c0c1ff] hover:text-[#1000a9] transition-all shadow-xl active:scale-95">
                                    <span className="material-symbols-outlined italic">bookmark</span>
                                </button>
                            </div>
                        </div>

                        {/* Interactive Tabs Section */}
                        <div className="bg-[#131b2e] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
                            <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar whitespace-nowrap">
                                {[
                                    { id: 'content', label: 'Institutional Theory' },
                                    { id: 'quiz', label: 'Assessments' },
                                    { id: 'review', label: 'Editorial Review' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab.id ? 'text-white bg-white/5' : 'text-slate-500 hover:text-slate-200'
                                            }`}
                                    >
                                        {tab.id === 'quiz' && (
                                            <span className="absolute top-4 right-6 w-1.5 h-1.5 rounded-full bg-[#c0c1ff] animate-pulse"></span>
                                        )}
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c0c1ff]"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="p-10 min-h-[300px]">
                                {activeTab === 'content' && (
                                    <div className="space-y-8 animate-fade-in-up">
                                        <div className="flex items-center gap-6">
                                            <div className="h-px w-12 bg-[#c0c1ff]/30"></div>
                                            <span className="font-sans text-[10px] font-black text-[#c0c1ff] uppercase tracking-[0.4em]">Curator Insights</span>
                                        </div>
                                        <p className="font-serif italic text-2xl text-slate-300 leading-relaxed indent-12">
                                            {currentLesson.description || "The profound significance of this lesson lies in the singular execution of master-tier proficiency. Advance through this module with directed attention to technical precision and professional depth."}
                                        </p>
                                        <div className="flex flex-wrap gap-4 pt-4">
                                            {['Resource Archives', 'Technical Documentation', 'Sequence Notes'].map(r => (
                                                <button key={r} className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/5 bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-[#c0c1ff]/30 hover:bg-[#c0c1ff]/5 transition-all">
                                                    <span className="material-symbols-outlined text-base">download_for_offline</span>
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'quiz' && (
                                    <div className="animate-fade-in-up">
                                        <QuizComponent courseId={courseId!} />
                                    </div>
                                )}
                                {activeTab === 'review' && (
                                    <div className="animate-fade-in-up">
                                        <ReviewForm courseId={courseId} onReviewSuccess={fetchFullCourse} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- Curriculum Sidebar Layout --- */}
                    <aside className="lg:col-span-4 space-y-8 sticky top-28 animate-fade-in-right">
                        <div className="bg-[#131b2e] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-160px)]">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-br from-transparent to-white/5">
                                <div>
                                    <h2 className="font-serif text-2xl font-bold italic text-white mb-1">Catalog Order</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#c0c1ff]">Series I: Theoretical Foundation</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-serif italic font-bold text-white leading-none">{((activeLesson + 1) / course.lessons.length * 100).toFixed(0)}%</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-1">Mastery Gain</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar py-6">
                                {course.lessons.map((lesson, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveLesson(index)}
                                        className={`w-full flex items-center gap-6 px-8 py-6 transition-all group relative border-l-4 ${activeLesson === index
                                                ? 'bg-white/5 border-[#c0c1ff]'
                                                : 'border-transparent hover:bg-white/[0.02] text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        <div className="relative shrink-0 w-12 h-12 flex items-center justify-center rounded-full border border-white/10 shadow-lg bg-[#0b1326] transition-all group-hover:scale-110">
                                            {lesson.completed ? (
                                                <span className="material-symbols-outlined text-[#c0c1ff] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            ) : (
                                                <span className={`material-symbols-outlined text-lg ${activeLesson === index ? 'text-[#c0c1ff]' : 'text-slate-600 group-hover:text-slate-400'}`}>
                                                    {activeLesson === index ? 'play_arrow' : 'lock'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${activeLesson === index ? 'text-[#c0c1ff]' : 'text-slate-600'}`}>Unit {index + 1}</p>
                                            <p className={`font-serif italic font-bold text-lg leading-tight truncate px-0 transition-colors ${activeLesson === index ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                                {lesson.title}
                                            </p>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors mt-2 block">{lesson.duration || '12:45'} Exp.</span>
                                        </div>
                                        {activeLesson === index && (
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#c0c1ff] shadow-[0_0_10px_#c0c1ff]"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="p-8 bg-[#0b1326]/50 border-t border-white/5">
                                <button className="w-full py-5 bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#1000a9] rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all">
                                    Next Intelligence Unit
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                @keyframes fade-in-right {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-right {
                    animation: fade-in-right 1s ease-out forwards;
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default WatchCourse;

