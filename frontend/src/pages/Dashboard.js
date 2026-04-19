import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalCalories: 0, activitiesCount: 0, subscription: 'free' });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [activitiesRes, subRes] = await Promise.all([
        api.get('/api/activities'),
        api.get('/api/subscriptions')
      ]);
      
      const { runnings = [], cyclings = [], strengths = [] } = activitiesRes.data;
      const allActivities = [...runnings, ...cyclings, ...strengths];
      
      // Calculate total stats
      let totalCals = 0;
      allActivities.forEach(a => totalCals += (a.caloriesBurned || 0));
      
      // Group for chart data
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: d.toDateString(),
          calories: 0
        };
      });

      allActivities.forEach(a => {
        const actDate = new Date(a.date).toDateString();
        const day = last7Days.find(d => d.fullDate === actDate);
        if (day) day.calories += a.caloriesBurned;
      });

      setChartData(last7Days);
      
      setStats({
        totalCalories: totalCals,
        activitiesCount: allActivities.length,
        subscription: subRes.data.type || 'free',
        runningCount: runnings.length,
        cyclingCount: cyclings.length,
        strengthCount: strengths.length
      });
    } catch (err) {
      console.error('Dashboard stats error', err);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {user?.username}!</h1>
        <p className="text-xl text-gray-600">Your fitness journey dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl text-center">
          <div className="text-3xl font-bold text-fitness-primary">{stats.totalCalories.toLocaleString()}</div>
          <div className="text-gray-600">Total Calories Burned</div>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl text-center">
          <div className="text-3xl font-bold text-fitness-secondary">{stats.activitiesCount}</div>
          <div className="text-gray-600">Activities Completed</div>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl text-center">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            stats.subscription === 'premium' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {stats.subscription.toUpperCase()}
          </span>
          <div className="text-gray-600 mt-2">Subscription</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Calories Chart */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-semibold mb-6">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Type Breakdown */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-semibold mb-6">Activity Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Running', value: stats.runningCount || 0 },
                  { name: 'Cycling', value: stats.cyclingCount || 0 },
                  { name: 'Strength', value: stats.strengthCount || 0 }
                ].filter(d => d.value > 0)}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {COLORS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Premium Features Teaser */}
{stats.subscription !== 'premium' && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-400 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-4">🚀 Unlock Premium</h3>
              <ul className="space-y-2 text-lg">
                <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>Advanced analytics & trainer workouts</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>Priority challenge leaderboards</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>Premium badges & insights</li>
              </ul>
            </div>
            <button 
              onClick={() => window.location.href = '/profile'}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl hover:from-emerald-600 hover:to-green-700 transform hover:-translate-y-1 transition-all whitespace-nowrap"
            >
              Upgrade Now - $9.99/mo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

