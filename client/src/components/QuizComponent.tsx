import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface Question {
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

interface Quiz {
    id: string | number;
    title: string;
    questions: Question[];
    passingScore: number;
}

const QuizComponent = ({ courseId }: { courseId: string | number }) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get<Quiz[]>(`${API_URL}/api/courses/${courseId}/quizzes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuizzes(data);
            } catch (err) {
                console.error("Failed to load quizzes");
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [courseId]);

    const handleAnswer = (questionIndex: number, answerIndex: number) => {
        setUserAnswers({ ...userAnswers, [questionIndex]: answerIndex });
    };

    const submitQuiz = () => {
        const quiz = quizzes[currentQuizIndex];
        let correctCount = 0;
        quiz.questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctAnswerIndex) {
                correctCount++;
            }
        });
        const finalScore = (correctCount / quiz.questions.length) * 100;
        setScore(finalScore);
        setShowResults(true);
    };

    if (loading) return (
        <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-10 h-10 border-2 border-[#c0c1ff]/20 border-t-[#c0c1ff] rounded-full animate-spin"></div>
            <p className="font-serif italic text-slate-500">Retrieving intelligence assessments...</p>
        </div>
    );

    if (quizzes.length === 0) return (
        <div className="py-20 text-center border border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
            <span className="material-symbols-outlined text-5xl text-slate-700 mb-6 font-light">assignment_late</span>
            <p className="font-serif italic text-xl text-slate-500">No assessments found for this sequence.</p>
        </div>
    );

    const quiz = quizzes[currentQuizIndex];

    return (
        <div className="max-w-4xl mx-auto py-8">
            {!showResults ? (
                <div className="space-y-12 animate-fade-in-up">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-12">
                        <div className="max-w-xl">
                            <span className="text-[#c0c1ff] font-serif italic text-lg mb-2 block">Institutional Assessment</span>
                            <h3 className="font-serif text-4xl font-bold text-white italic tracking-tight">Intelligence Verification</h3>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#c0c1ff]">Target Proficiency:</span>
                            <span className="text-white text-xs font-bold font-sans italic">{quiz.passingScore}%</span>
                        </div>
                    </header>

                    <div className="space-y-16">
                        {quiz.questions.map((q, idx) => (
                            <div key={idx} className="space-y-8 group">
                                <div className="flex items-start gap-6">
                                    <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-[#c0c1ff] text-[#1000a9] text-xs font-black shadow-lg shadow-[#c0c1ff]/20">{idx + 1}</span>
                                    <p className="font-serif text-2xl text-slate-100 italic leading-relaxed pt-1">{q.question}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-16">
                                    {q.options.map((opt, optIdx) => (
                                        <label 
                                            key={optIdx} 
                                            className={`relative flex items-center gap-4 p-6 rounded-2xl border transition-all cursor-pointer group/opt ${
                                                userAnswers[idx] === optIdx 
                                                ? 'bg-[#c0c1ff] border-[#c0c1ff] text-[#1000a9]' 
                                                : 'bg-white/5 border-white/5 hover:border-[#c0c1ff]/30 text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${idx}`}
                                                className="hidden"
                                                checked={userAnswers[idx] === optIdx}
                                                onChange={() => handleAnswer(idx, optIdx)}
                                            />
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                                userAnswers[idx] === optIdx ? 'border-[#1000a9]' : 'border-slate-700'
                                            }`}>
                                                {userAnswers[idx] === optIdx && <div className="w-2.5 h-2.5 rounded-full bg-[#1000a9]"></div>}
                                            </div>
                                            <span className="font-sans text-xs font-black uppercase tracking-widest">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-12 border-t border-white/5 flex justify-center">
                        <button 
                            onClick={submitQuiz} 
                            disabled={Object.keys(userAnswers).length < quiz.questions.length}
                            className="px-16 py-6 bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#1000a9] rounded-full text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-[#c0c1ff]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100"
                        >
                            Finalize Assessment
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center py-20 animate-fade-in-up">
                    <div className="relative w-64 h-64 mb-16">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="128" cy="128" r="120" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                            <circle 
                                cx="128" 
                                cy="128" 
                                r="120" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="8" 
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={2 * Math.PI * 120 * (1 - score / 100)}
                                className={score >= quiz.passingScore ? 'text-emerald-400' : 'text-rose-400'}
                                style={{ transition: 'stroke-dashoffset 2s ease-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-serif text-6xl font-bold text-white leading-none">{score.toFixed(0)}%</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Intelligence Rank</span>
                        </div>
                    </div>

                    <h3 className="font-serif text-4xl font-bold text-white mb-6 italic">{score >= quiz.passingScore ? 'Manifest Proficiency' : 'Growth Required'}</h3>
                    <p className="font-serif italic text-2xl text-slate-500 text-center max-w-lg leading-relaxed mb-16">
                        {score >= quiz.passingScore
                            ? "Congratulations. Your execution of technical proficiency meets the institutional standards of Lumina Premiere."
                            : "Your current sequence data shows areas for further intellectual refinement. Return to the curriculum modules to deepen your perception."}
                    </p>
                    
                    <div className="flex gap-8">
                        <button onClick={() => { setShowResults(false); setUserAnswers({}); }} className="px-12 py-4 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95">Re-Verify Sequence</button>
                        {score >= quiz.passingScore && (
                            <button className="px-12 py-4 bg-white/5 border border-[#c0c1ff]/30 text-[#c0c1ff] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#c0c1ff]/10 transition-all active:scale-95">Print Certification</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizComponent;
