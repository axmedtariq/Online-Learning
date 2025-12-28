import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.scss';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchData(); // Refresh the list after approval
    } catch (err) {
      alert("Approval failed");
    }
  };

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
            {users.map(u => (
              <tr key={u._id}>
                <td className="font-bold">{u.username}</td>
                <td className="text-muted">{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'instructor' ? 'badge-blue' : 'badge-gray'}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td>
                  {u.role === 'instructor' && (
                    <span className={u.isApproved ? 'status-approved' : 'status-pending'}>
                      {u.isApproved ? '● Approved' : '● Pending'}
                    </span>
                  )}
                </td>
                <td className="actions">
                  {u.role === 'instructor' && !u.isApproved && (
                    <button onClick={() => handleApprove(u._id)} className="btn-approve">
                      Approve
                    </button>
                  )}
                  <button className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;