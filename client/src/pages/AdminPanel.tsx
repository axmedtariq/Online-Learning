import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminPanel = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Helper: auth headers
    const getAuthHeaders = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await axios.get<any[]>(
                    `${API_URL}/api/admin/users`,
                    getAuthHeaders()
                );
                setUsers(res.data);
            } catch (error: any) {
                console.error('Error fetching users:', error.message || 'Access denied');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await axios.put(
                `${API_URL}/api/admin/approve/${id}`,
                {},
                getAuthHeaders()
            );

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === id ? { ...user, isApproved: true } : user
                )
            );
        } catch (error: any) {
            alert('Approval failed: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
        if (!confirmed) return;

        try {
            await axios.delete(
                `${API_URL}/api/admin/user/${id}`,
                getAuthHeaders()
            );
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
            alert('Delete failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b1326] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#c0c1ff] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#c0c1ff] font-serif italic text-xl animate-pulse">Initializing Management Console...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans selection:bg-[#c0c1ff]/30">
            {/* SideNavBar Shell */}
            <aside className="fixed left-0 top-0 flex flex-col h-full z-40 w-72 border-r border-indigo-500/10 bg-slate-900/70 backdrop-blur-3xl shadow-[0_20px_40px_rgba(6,14,32,0.4)] transition-all">
                <div className="px-8 py-10">
                    <h1 className="font-serif text-2xl italic font-bold text-indigo-400">The Premiere</h1>
                    <p className="font-serif text-lg font-medium tracking-tight text-slate-400 mt-1">Editorial Admin</p>
                </div>
                <nav className="flex-1 mt-4">
                    <div className="space-y-1">
                        <button className="w-full flex items-center text-slate-400 hover:text-slate-200 px-6 py-3 transition-all duration-300 hover:bg-indigo-500/5 group" onClick={() => navigate('/admin')}>
                            <span className="material-symbols-outlined mr-4 group-hover:text-indigo-400 transition-colors">dashboard</span>
                            <span className="font-serif text-lg tracking-tight">Overview</span>
                        </button>
                        <button className="w-full flex items-center text-indigo-400 font-semibold border-r-2 border-indigo-500 px-6 py-3 bg-indigo-500/5">
                            <span className="material-symbols-outlined mr-4">group_add</span>
                            <span className="font-serif text-lg tracking-tight">Users</span>
                        </button>
                        <button className="w-full flex items-center text-slate-400 hover:text-slate-200 px-6 py-3 transition-all duration-300 hover:bg-indigo-500/5 group" onClick={() => navigate('/instructor/dashboard')}>
                            <span className="material-symbols-outlined mr-4 group-hover:text-indigo-400 transition-colors">auto_stories</span>
                            <span className="font-serif text-lg tracking-tight">Courses</span>
                        </button>
                        <button className="w-full flex items-center text-slate-400 hover:text-slate-200 px-6 py-3 transition-all duration-300 hover:bg-indigo-500/5 group">
                            <span className="material-symbols-outlined mr-4 group-hover:text-indigo-400 transition-colors">payments</span>
                            <span className="font-serif text-lg tracking-tight">Revenue</span>
                        </button>
                        <button className="w-full flex items-center text-slate-400 hover:text-slate-200 px-6 py-3 transition-all duration-300 hover:bg-indigo-500/5 group">
                            <span className="material-symbols-outlined mr-4 group-hover:text-indigo-400 transition-colors">settings</span>
                            <span className="font-serif text-lg tracking-tight">Settings</span>
                        </button>
                    </div>
                </nav>
                <div className="p-8 border-t border-indigo-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-indigo-500/30 flex items-center justify-center bg-indigo-500/10 shadow-lg overflow-hidden">
                            <span className="material-symbols-outlined text-indigo-400">admin_panel_settings</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-200">Admin Console</p>
                            <p className="text-xs text-slate-500">Super User</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* TopNavBar Shell */}
            <header className="fixed top-0 right-0 left-0 flex justify-between items-center w-full pl-80 pr-12 z-30 h-20 bg-slate-900/50 backdrop-blur-2xl">
                <div className="flex items-center flex-1 max-w-xl">
                    <div className="relative w-full">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input className="w-full bg-[#131b2e] border-none focus:ring-1 focus:ring-[#c0c1ff]/40 rounded-full py-2.5 pl-12 pr-4 text-sm text-slate-300 placeholder:text-slate-500 outline-none transition-all" placeholder="Search curators, mentors, or reports..." type="text" />
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-6">
                        <button className="text-slate-400 hover:text-indigo-300 transition-colors duration-200 scale-100 hover:scale-110">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="text-slate-400 hover:text-indigo-300 transition-colors duration-200 scale-100 hover:scale-110">
                            <span className="material-symbols-outlined">bookmark</span>
                        </button>
                        <button className="text-slate-400 hover:text-indigo-300 transition-colors duration-200 scale-100 hover:scale-110" onClick={() => navigate('/')}>
                            <span className="material-symbols-outlined">home</span>
                        </button>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-700 opacity-20"></div>
                    <div className="font-serif text-xl font-bold text-slate-100 italic">Premiere Admin</div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="pl-80 pt-28 pr-12 pb-16 min-h-screen">
                {/* Header Section */}
                <section className="mb-12">
                    <div className="flex justify-between items-end">
                        <div className="animate-fade-in">
                            <h2 className="font-serif text-5xl font-bold tracking-tight text-white mb-2">User Management</h2>
                            <p className="text-slate-400 font-light tracking-wide max-w-lg">
                                Oversee and moderate the Lumina Premiere ecosystem. Currently managing 
                                <span className="text-[#c0c1ff] font-medium mx-1">{users.length} active members</span>.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 rounded-full border border-slate-700/30 text-sm font-medium hover:bg-white/5 transition-all active:scale-95 shadow-lg">
                                Export User Log
                            </button>
                            <button className="px-6 py-3 rounded-full bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#1000a9] font-bold text-sm shadow-xl shadow-[#c0c1ff]/10 hover:opacity-90 transition-all active:scale-95">
                                Pending Approvals
                            </button>
                        </div>
                    </div>
                </section>

                {/* Metrics for Context */}
                <section className="grid grid-cols-12 gap-6 mb-12">
                    <div className="col-span-12 md:col-span-4 p-8 rounded-2xl bg-[#131b2e] relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c0c1ff] to-[#ffdcc5] opacity-40"></div>
                        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">Instructor Approvals</p>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="font-serif text-4xl font-bold text-white">
                                {users.filter(u => u.role === 'instructor' && !u.isApproved).length}
                            </span>
                            <span className="text-[#c0c1ff] text-sm font-medium">Pending Review</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#c0c1ff] rounded-full shadow-[0_0_8px_rgba(192,193,255,0.6)]" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                    
                    <div className="col-span-12 md:col-span-4 p-8 rounded-2xl bg-[#131b2e] group border border-white/5">
                        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">Total Active Students</p>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="font-serif text-4xl font-bold text-white">
                                {users.filter(u => u.role === 'student').length}
                            </span>
                            <span className="text-emerald-400 text-sm font-medium">+12.4%</span>
                        </div>
                        <div className="flex -space-x-3 overflow-hidden">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#131b2e] bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                            <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-[#131b2e] bg-[#2d3449] text-[10px] font-bold text-slate-400">+{Math.max(0, users.length - 4)}</div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-4 p-8 rounded-2xl bg-[#131b2e] group border border-white/5">
                        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">System Engagement</p>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="font-serif text-4xl font-bold text-white">92%</span>
                            <span className="text-[#ffb783] text-sm font-medium">Optimal</span>
                        </div>
                        <div className="flex items-end gap-1 h-8">
                            <div className="flex-1 bg-slate-700 h-[40%] rounded-t-sm group-hover:bg-[#c0c1ff]/40 transition-all"></div>
                            <div className="flex-1 bg-slate-700 h-[60%] rounded-t-sm group-hover:bg-[#c0c1ff]/40 transition-all"></div>
                            <div className="flex-1 bg-slate-700 h-[90%] rounded-t-sm group-hover:bg-[#c0c1ff]/40 transition-all"></div>
                            <div className="flex-1 bg-[#c0c1ff] h-full rounded-t-sm"></div>
                        </div>
                    </div>
                </section>

                {/* User Table Section */}
                <div className="bg-[#171f33] rounded-2xl p-1 shadow-2xl border border-white/5 overflow-hidden">
                    <div className="bg-[#131b2e] rounded-[15px] overflow-hidden">
                        <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-serif text-2xl font-bold text-white italic">Curator & Student Directory</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-medium text-slate-500">Filter by:</span>
                                <select className="bg-transparent border-none text-xs font-bold text-[#c0c1ff] outline-none cursor-pointer uppercase tracking-widest">
                                    <option>All Users</option>
                                    <option>Instructors</option>
                                    <option>Students</option>
                                    <option>Pending</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[#c7c4d7] text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
                                        <th className="px-10 py-6">Member Name</th>
                                        <th className="px-6 py-6">Identity</th>
                                        <th className="px-6 py-6">Professional Profile</th>
                                        <th className="px-6 py-6 text-center">Authorization</th>
                                        <th className="px-10 py-6 text-right">Administrative</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-indigo-500/5 transition-colors group">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-[#2d3449] flex items-center justify-center text-indigo-300 font-bold border border-white/10 group-hover:border-indigo-400/30 transition-all shadow-inner">
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-200 group-hover:text-white transition-colors capitalize">{user.username}</p>
                                                            <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors uppercase tracking-tight">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className={`px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${
                                                        user.role === 'instructor' 
                                                            ? 'bg-indigo-500/20 text-indigo-300' 
                                                            : 'bg-slate-700/30 text-slate-400'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                        <span className="text-xs font-semibold text-slate-400">Verified Expert</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    {user.role === 'instructor' ? (
                                                        <span className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
                                                            user.isApproved ? 'text-emerald-400' : 'text-amber-400'
                                                        }`}>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                            {user.isApproved ? 'Approved' : 'Awaiting Review'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Permanent Member</span>
                                                    )}
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                        {user.role === 'instructor' && !user.isApproved && (
                                                            <button 
                                                                onClick={() => handleApprove(user.id)}
                                                                className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-lg"
                                                                title="Approve Curator"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">check</span>
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleDelete(user.id)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                                                            title="Revoke Membership"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-32 text-center">
                                                <span className="material-symbols-outlined text-6xl text-slate-800 mb-4 block">group_off</span>
                                                <p className="text-slate-600 font-serif italic text-lg">Your editorial ranks are currently quiet.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-10 right-10 z-50">
                <button className="flex items-center gap-3 px-6 py-4 rounded-full bg-[#c0c1ff] text-[#1000a9] shadow-2xl shadow-[#c0c1ff]/40 hover:scale-105 transition-transform font-bold group active:scale-95">
                    <span className="material-symbols-outlined">add</span>
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">Invite Expert Curator</span>
                </button>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AdminPanel;
