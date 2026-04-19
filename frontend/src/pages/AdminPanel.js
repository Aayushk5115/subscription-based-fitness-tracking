import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Admin users load error', err);
    }
  };

  const updateSubscription = async (userId, subscription) => {
    try {
      await api.put(`/api/admin/users/${userId}/subscription`, { subscription });
      loadUsers();
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Admin Panel</h1>
      
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
          <h2 className="text-2xl font-bold">User Management ({users.length} users)</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left">Username</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Subscription</th>
                <th className="p-4 text-left">Admin</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.subscription === 'premium' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.subscription}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.isAdmin ? '✅ Yes' : '❌ No'}
                  </td>
                  <td className="p-4">
                    <select 
                      onChange={(e) => updateSubscription(user._id, e.target.value)}
                      defaultValue={user.subscription}
                      className="border rounded-lg p-2 focus:ring-2 focus:ring-fitness-primary"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center">
          <div className="text-4xl font-bold text-fitness-primary mb-2">{users.filter(u => u.subscription === 'premium').length}</div>
          <div className="text-gray-600">Premium Users</div>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{users.filter(u => u.isAdmin).length}</div>
          <div className="text-gray-600">Admins</div>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">{users.length}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

