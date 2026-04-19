import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [formData, setFormData] = useState({ name: '', goalCalories: '', startDate: '', endDate: '' });

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const res = await api.get('/api/challenges');
      setChallenges(res.data);
    } catch (err) {
      console.error('Challenges load error', err);
    }
  };

  const createChallenge = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/challenges', formData);
      loadChallenges();
      setFormData({ name: '', goalCalories: '', startDate: '', endDate: '' });
    } catch (err) {
      console.error(err);
      alert('Error creating challenge: ' + (err.response?.data?.error || err.response?.data?.msg || err.message));
    }
  };

  const joinChallenge = async (id) => {
    try {
      await api.post(`/api/challenges/${id}/join`);
      loadChallenges();
    } catch (err) {
      console.error(err);
      alert('Error joining challenge: ' + (err.response?.data?.error || err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Social Challenges
      </h1>

      {/* Create Challenge Form */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl mb-12">
        <h2 className="text-2xl font-semibold mb-8">Create New Challenge</h2>
        <form onSubmit={createChallenge} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <input
            type="text"
            placeholder="Challenge Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-fitness-primary"
            required
          />
          <input
            type="number"
            placeholder="Goal Calories"
            value={formData.goalCalories}
            onChange={(e) => setFormData({...formData, goalCalories: e.target.value})}
            className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-fitness-primary"
            required
          />
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-fitness-primary"
            required
          />
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-fitness-primary"
            required
          />
          <button 
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Create Challenge
          </button>
        </form>
      </div>

      {/* Active Challenges */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Active Challenges</h2>
        {challenges.map((challenge) => (
          <div key={challenge._id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{challenge.name}</h3>
                <p className="text-gray-600">Created by {challenge.creatorId?.username || 'Someone'}</p>
              </div>
              <div className="flex flex-col items-end space-y-2 mt-4 md:mt-0">
                <div className="text-2xl font-bold text-fitness-primary">{challenge.goalCalories} cal goal</div>
                <div className="text-sm text-gray-500">
                  {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Leaderboard</h4>
              <div className="space-y-2">
                {challenge.leaderboard && challenge.leaderboard.length > 0 ? (
                  challenge.leaderboard.map((entry, index) => (
                    <div key={entry.userId._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                          {index + 1}
                        </div>
                        <span>{entry.userId.username}</span>
                      </div>
                      <span className="font-semibold">{entry.totalCalories} cal</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-500">No participants yet.</div>
                )}
              </div>
            </div>

            {/* Participants & Join Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <span className="text-gray-600">
                {challenge.participants?.length || 0} participants
              </span>
              <button
                onClick={() => joinChallenge(challenge._id)}
                className="bg-fitness-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-fitness-secondary transition-all"
              >
                Join Challenge
              </button>
            </div>
          </div>
        ))}
      </div>

      {!challenges.length && (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold mb-4">No challenges yet</h3>
          <p className="text-gray-600 mb-8">Be the first to create one and challenge your friends!</p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-xl font-bold">
            Create Challenge
          </button>
        </div>
      )}
    </div>
  );
}

export default Challenges;

