import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [subscription, setSubscription] = useState('free');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/api/auth/profile');
      setProfile(res.data);
      const subRes = await api.get('/api/subscriptions');
      setSubscription(subRes.data.type || 'free');
    } catch (err) {
      console.error('Profile load error', err);
    }
  };

  const upgradeSubscription = async () => {
    setLoading(true);
    try {
      await api.post('/api/subscriptions/upgrade');
      setSubscription('premium');
      alert('Upgraded to Premium! 🎉');
    } catch (err) {
      alert('Upgrade failed');
    }
    setLoading(false);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-12 text-center mb-12">
        <div className="w-32 h-32 bg-gradient-to-r from-fitness-primary to-fitness-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">👤</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{profile.username}</h1>
        <p className="text-xl text-gray-600 mb-8">{profile.email}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="text-3xl font-bold text-fitness-primary">{profile.age || 'N/A'}</div>
            <div className="text-gray-600">Age</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-fitness-primary">{profile.weight || 'N/A'}kg</div>
            <div className="text-gray-600">Weight</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{profile.goals || 'Set your goals!'}</div>
            <div className="text-gray-600">Goals</div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Subscription Status</h2>
        <div className={`inline-flex items-center px-6 py-4 rounded-xl font-semibold text-lg ${
          subscription === 'premium' 
            ? 'bg-green-100 text-green-800 border-2 border-green-300' 
            : 'bg-gray-100 text-gray-800 border-2 border-gray-300'
        }`}>
          <div className={`w-4 h-4 rounded-full mr-3 ${
            subscription === 'premium' ? 'bg-green-500' : 'bg-yellow-500'
          }`} />
          {subscription.toUpperCase()} Plan
        </div>
        
        {subscription !== 'premium' && (
          <button
            onClick={upgradeSubscription}
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Upgrading...' : '💳 Upgrade to Premium - $9.99/mo'}
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-4">This Week</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Total Workouts:</span><span>7</span></div>
            <div className="flex justify-between"><span>Calories Burned:</span><span>2,450</span></div>
            <div className="flex justify-between"><span>Avg Duration:</span><span>45min</span></div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-4">Achievements</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-green-600"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>7-day streak</div>
            <div className="flex items-center text-blue-600"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>100km running milestone</div>
            <div className="flex items-center text-yellow-600"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>First strength workout</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

