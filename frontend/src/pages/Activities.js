import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

function Activities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState({ runnings: [], cyclings: [], strengths: [] });
  const [formType, setFormType] = useState('running');
  const [formData, setFormData] = useState({});
  const [exercise, setExercise] = useState({ name: '', sets: '', reps: '' });

  const loadActivities = async () => {
    try {
      const res = await api.get('/api/activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Load activities error', err);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (formType === 'strength') {
        dataToSubmit.exercises = [{
          name: exercise.name,
          sets: Number(exercise.sets),
          reps: Number(exercise.reps)
        }];
      }
      await api.post(`/api/activities/${formType}`, dataToSubmit);
      loadActivities();
      setFormData({});
      setExercise({ name: '', sets: '', reps: '' });
    } catch (err) {
      console.error(err);
      alert('Error adding activity: ' + (err.response?.data?.error || err.response?.data?.msg || err.message));
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await api.delete(`/api/activities/${type}/${id}`);
      loadActivities();
    } catch (err) {
      alert('Error deleting activity: ' + (err.response?.data?.error || err.response?.data?.msg || err.message));
    }
  };

  const renderForm = () => {
    if (formType === 'running') {
      return (
        <>
          <input
            type="number"
            placeholder="Duration (min)"
            value={formData.duration || ''}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            className="w-full p-3 border rounded-xl mb-4"
            required
          />
          <input
            type="number"
            placeholder="Distance (km)"
            value={formData.distance || ''}
            onChange={(e) => setFormData({...formData, distance: e.target.value})}
            className="w-full p-3 border rounded-xl mb-4"
            required
          />
          <input
            type="number"
            placeholder="Calories burned"
            value={formData.caloriesBurned || ''}
            onChange={(e) => setFormData({...formData, caloriesBurned: e.target.value})}
            className="w-full p-3 border rounded-xl mb-4"
            required
          />
        </>
      );
    } else if (formType === 'cycling') {
      return (
        <>
          <input
            type="number"
            placeholder="Duration (min)"
            value={formData.duration || ''}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            className="w-full p-3 border rounded-xl mb-4"
            required
          />
          <input
            type="number"
            placeholder="Distance (km)"
            value={formData.distance || ''}
            onChange={(e) => setFormData({...formData, distance: e.target.value})}
            className="w-full p-3 border rounded-xl mb-4"
            required
          />
          <input
            type="number"
            placeholder="Calories burned"
            value={formData.caloriesBurned || ''}
            onChange={(e) => setFormData({...formData, caloriesBurned: e.target.value})}
            className="w-full p-3 border rounded-xl mb-4"
            required
          />
        </>
      );
    } else {
      return (
        <>
          <input
            type="number"
            placeholder="Duration (min)"
            value={formData.duration || ''}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            className="w-full p-3 border rounded-xl mb-4"
            required
          />
          <input
            type="number"
            placeholder="Calories burned"
            value={formData.caloriesBurned || ''}
            onChange={(e) => setFormData({...formData, caloriesBurned: e.target.value})}
            className="w-full p-3 border rounded-xl mb-4"
            required
          />
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Exercise name"
              value={exercise.name}
              onChange={(e) => setExercise({...exercise, name: e.target.value})}
              className="p-3 border rounded-xl"
              required
            />
            <input
              type="number"
              placeholder="Sets"
              value={exercise.sets}
              onChange={(e) => setExercise({...exercise, sets: e.target.value})}
              className="p-3 border rounded-xl"
              required
            />
            <input
              type="number"
              placeholder="Reps"
              value={exercise.reps}
              onChange={(e) => setExercise({...exercise, reps: e.target.value})}
              className="p-3 border rounded-xl"
              required
            />
          </div>
        </>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
        My Activities
      </h1>

      {/* Add Activity Form */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl mb-12">
        <h2 className="text-2xl font-semibold mb-6">Add New Activity</h2>
        <div className="flex mb-6">
          <button 
            className={`px-6 py-2 rounded-xl mr-2 ${formType === 'running' ? 'bg-fitness-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setFormType('running')}
          >
            🏃 Running
          </button>
          <button 
            className={`px-6 py-2 rounded-xl mr-2 ${formType === 'cycling' ? 'bg-fitness-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setFormType('cycling')}
          >
            🚴 Cycling
          </button>
          <button 
            className={`px-6 py-2 rounded-xl ${formType === 'strength' ? 'bg-fitness-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setFormType('strength')}
          >
            💪 Strength
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
          <button 
            type="submit" 
            className="w-full bg-fitness-primary text-white py-4 px-8 rounded-xl font-semibold hover:bg-fitness-secondary transition-all"
          >
            Add Activity
          </button>
        </form>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.runnings?.map((activity) => (
          <div key={activity._id} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl relative">
            <button onClick={() => handleDelete('running', activity._id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">🗑️</button>
            <div className="text-2xl mb-2">🏃 Running</div>
            <div className="text-lg font-semibold">{activity.distance}km</div>
            <div>{activity.duration}min • {activity.caloriesBurned}cal</div>
            <div className="text-sm text-gray-500 mt-2">{new Date(activity.date).toLocaleDateString()}</div>
          </div>
        ))}
        {activities.cyclings?.map((activity) => (
          <div key={activity._id} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl relative">
            <button onClick={() => handleDelete('cycling', activity._id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">🗑️</button>
            <div className="text-2xl mb-2">🚴 Cycling</div>
            <div className="text-lg font-semibold">{activity.distance}km</div>
            <div>{activity.duration}min • {activity.caloriesBurned}cal</div>
            <div className="text-sm text-gray-500 mt-2">{new Date(activity.date).toLocaleDateString()}</div>
          </div>
        ))}
        {activities.strengths?.map((activity) => (
          <div key={activity._id} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl relative">
            <button onClick={() => handleDelete('strength', activity._id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">🗑️</button>
            <div className="text-2xl mb-2">💪 Strength</div>
            <div className="text-lg font-semibold">{activity.exercises?.length || 0} exercises</div>
            <div>{activity.duration}min • {activity.caloriesBurned}cal</div>
            <div className="text-sm text-gray-500 mt-2">{new Date(activity.date).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activities;

