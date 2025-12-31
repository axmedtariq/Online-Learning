import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.scss';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get authorized headers
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/users', getAuthHeaders());
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${id}`, {}, getAuthHeaders());
      // Re-fetch to see the status change from "Pending" to "Approved"
      fetchData(); 
    } catch (err) {
      alert("Approval failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/user/${id}`, getAuthHeaders());
        // Update state locally so the user disappears immediately without a full refresh
        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  if (loading) return <div className="admin-loading">Loading Management Console...</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Management Console</h1>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(u => (
                <tr key={u._id}>
                  <td className="font-bold">{u.username}</td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'instructor' ? 'badge-blue' : 'badge-gray'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {u.role === 'instructor' ? (
                      <span className={u.isApproved ? 'status-approved' : 'status-pending'}>
                        {u.isApproved ? '● Approved' : '● Pending'}
                      </span>
                    ) : (
                      <span className="status-generic">● Active</span>
                    )}
                  </td>
                  <td className="actions">
                    {u.role === 'instructor' && !u.isApproved && (
                      <button onClick={() => handleApprove(u._id)} className="btn-approve">
                        Approve
                      </button>
                    )}
                    <button onClick={() => handleDelete(u._id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;