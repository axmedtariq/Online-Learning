import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Quiz.scss';

const QuizComponent = ({ courseId }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`http://localhost:5000/api/courses/${courseId}/quizzes`, {
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

    const handleAnswer = (questionIndex, answerIndex) => {
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

    if (loading) return <div>Loading Assessment...</div>;
    if (quizzes.length === 0) return <div>No assessments available for this course yet.</div>;

    const quiz = quizzes[currentQuizIndex];

    return (
        <div className="quiz-container">
            {!showResults ? (
                <div className="quiz-content">
                    <h3>Course Assessment</h3>
                    {quiz.questions.map((q, idx) => (
                        <div key={idx} className="question-block">
                            <p className="question-text">{idx + 1}. {q.question}</p>
                            <div className="options-list">
                                {q.options.map((opt, optIdx) => (
                                    <label key={optIdx} className="option-label">
                                        <input
                                            type="radio"
                                            name={`question-${idx}`}
                                            checked={userAnswers[idx] === optIdx}
                                            onChange={() => handleAnswer(idx, optIdx)}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button onClick={submitQuiz} className="btn-submit-quiz">Submit Quiz</button>
                </div>
            ) : (
                <div className="quiz-results">
                    <h3>Quiz Finished!</h3>
                    <div className="score-display">
                        <div className="score-circle" style={{ borderColor: score >= quiz.passingScore ? '#22c55e' : '#ef4444' }}>
                            <span className="score-value">{score.toFixed(0)}%</span>
                        </div>
                    </div>
                    <p className="result-msg">
                        {score >= quiz.passingScore
                            ? "Congratulations! You passed this assessment."
                            : "Keep studying and try again to improve your score."}
                    </p>
                    <button onClick={() => { setShowResults(false); setUserAnswers({}); }} className="btn-retry">Try Again</button>
                </div>
            )}
        </div>
    );
};

export default QuizComponent;
