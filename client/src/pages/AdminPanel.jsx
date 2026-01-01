import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.scss';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: auth headers
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  // Fetch users (defined INSIDE useEffect to avoid ESLint issues)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}/api/admin/users`,
          getAuthHeaders()
        );
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Approve instructor
  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/approve/${id}`,
        {},
        getAuthHeaders()
      );

      // Update UI without refetching everything
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isApproved: true } : user
        )
      );
    } catch (error) {
      alert(
        'Approval failed: ' +
          (error.response?.data?.message || 'Server error')
      );
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/api/admin/user/${id}`,
        getAuthHeaders()
      );

      // Remove user from UI immediately
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      alert('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        Loading Management Console...
      </div>
    );
  }

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
              users.map((user) => (
                <tr key={user._id}>
                  <td className="font-bold">{user.username}</td>
                  <td className="text-muted">{user.email}</td>

                  <td>
                    <span
                      className={`badge ${
                        user.role === 'instructor'
                          ? 'badge-blue'
                          : 'badge-gray'
                      }`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </td>

                  <td>
                    {user.role === 'instructor' ? (
                      <span
                        className={
                          user.isApproved
                            ? 'status-approved'
                            : 'status-pending'
                        }
                      >
                        ● {user.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    ) : (
                      <span className="status-generic">● Active</span>
                    )}
                  </td>

                  <td className="actions">
                    {user.role === 'instructor' && !user.isApproved && (
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(user._id)}
                      >
                        Approve
                      </button>
                    )}

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
