import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { HiPlus, HiBookOpen, HiUsers, HiStar, HiChartBar, HiChatAlt2, HiTrendingUp, HiWrench, HiQuestionMarkCircle } from 'react-icons/hi';
import '../styles/InstructorDashboard.scss';

const InstructorDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ totalStudents: 0, totalEarnings: 0, avgRating: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5000/api/courses/instructor/my-courses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(data);

                // Calculate basic stats
                const totalStudents = data.reduce((acc, c) => acc + (c.studentsEnrolled?.length || 0), 0);
                const totalRating = data.reduce((acc, c) => acc + (c.averageRating || 0), 0);
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

    if (loading) return <div className="loader">Loading Dashboard...</div>;

    const navItems = [
        { name: 'Courses', icon: <HiBookOpen />, path: '/instructor/dashboard' },
        { name: 'Communication', icon: <HiChatAlt2 />, path: '/instructor/communication' },
        { name: 'Performance', icon: <HiTrendingUp />, path: '/instructor/performance' },
        { name: 'Tools', icon: <HiWrench />, path: '/instructor/tools' },
        { name: 'Resources', icon: <HiQuestionMarkCircle />, path: '/instructor/resources' },
    ];

    return (
        <div className="instructor-dashboard-wrapper">
            <aside className="instructor-sidebar">
                <div className="sidebar-logo" onClick={() => navigate('/')}>E-LEARN</div>
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="icon">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className="instructor-content">
                <header className="dashboard-header">
                    <h1>Courses</h1>
                    <button className="btn-create" onClick={() => navigate('/instructor/create-course')}>
                        New course
                    </button>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="label">Total Revenue</div>
                        <div className="value">${stats.totalEarnings.toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                        <div className="label">Total Enrollments</div>
                        <div className="value">{stats.totalStudents}</div>
                    </div>
                    <div className="stat-card">
                        <div className="label">Instructor Rating</div>
                        <div className="value">{stats.avgRating.toFixed(1)} ★</div>
                    </div>
                    <div className="stat-card">
                        <div className="label">Course Finished</div>
                        <div className="value">0</div>
                    </div>
                </div>

                <section className="courses-section">
                    <div className="course-list">
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <div key={course._id} className="instructor-course-card">
                                    <img src={course.thumbnail} alt={course.title} />
                                    <div className="card-details">
                                        <div className="info">
                                            <h3>{course.title}</h3>
                                            <div className="meta">
                                                <span><strong>PUBLIC</strong></span>
                                                <span>{course.studentsEnrolled?.length || 0} Students</span>
                                                <span>{course.lessons?.length || 0} Lessons</span>
                                            </div>
                                        </div>
                                        <div className="actions">
                                            <button onClick={() => navigate(`/instructor/edit/${course._id}`)}>Edit / manage course</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>Jump into course creation</p>
                                <button className="btn-create" onClick={() => navigate('/instructor/create-course')}>Create your course</button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default InstructorDashboard;
