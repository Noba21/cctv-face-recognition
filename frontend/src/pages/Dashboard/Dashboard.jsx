import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiCamera,
  FiAlertCircle,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiDownload
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { dashboardAPI } from '../../api/dashboard';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Common/Card';
import Loader from '../../components/Common/Loader';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [topMatches, setTopMatches] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, trendsData, topMatchesData, riskData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecognitionTrends(7),
        dashboardAPI.getTopMatches(),
        dashboardAPI.getRiskDistribution()
      ]);

      setStats(statsData);
      setTrends(trendsData);
      setTopMatches(topMatchesData);
      setRiskDistribution(riskData);
      setRecentActivities(statsData.recent_activities || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
    const fetchDashboardData = async () => {
  try {
    setLoading(true);
    
    // Fetch all data with error handling for each
    const statsData = await dashboardAPI.getStats();
    const trendsData = await dashboardAPI.getRecognitionTrends(7);
    const topMatchesData = await dashboardAPI.getTopMatches();
    const riskData = await dashboardAPI.getRiskDistribution();

    setStats(statsData);
    setTrends(Array.isArray(trendsData) ? trendsData : []);
    setTopMatches(Array.isArray(topMatchesData) ? topMatchesData : []);
    setRiskDistribution(riskData || {});
    setRecentActivities(statsData?.recent_activities || []);
    
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    toast.error('Failed to load some dashboard data');
  } finally {
    setLoading(false);
  }
};
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const StatCard = ({ icon: Icon, label, value, change, color }) => (
    <Card className="hover:border-primary-500/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-secondary-400 text-sm">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
          <Icon className={`text-${color}-500 text-2xl`} />
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-secondary-400 mt-1">
            Welcome back, {user?.full_name || 'Operator'}
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <FiDownload />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FiUsers}
          label="Total Persons"
          value={stats?.total_persons || 0}
          color="primary"
        />
        <StatCard
          icon={FiCamera}
          label="Today's Recognitions"
          value={stats?.today_recognitions || 0}
          change={12}
          color="green"
        />
        <StatCard
          icon={FiCheckCircle}
          label="Match Rate"
          value={`${stats?.match_rate?.toFixed(1) || 0}%`}
          color="blue"
        />
        <StatCard
          icon={FiActivity}
          label="Active Persons"
          value={stats?.active_persons || 0}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recognition Trends */}
        <Card className="hover:border-primary-500/50">
          <h2 className="text-xl font-semibold text-white mb-4">Recognition Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMatched" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  name="Total"
                />
                <Area 
                  type="monotone" 
                  dataKey="matched" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorMatched)" 
                  name="Matches"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk Distribution */}
        <Card className="hover:border-primary-500/50">
          <h2 className="text-xl font-semibold text-white mb-4">Risk Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(riskDistribution).map(([name, value]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    value
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(riskDistribution).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Matches */}
        <Card className="lg:col-span-2 hover:border-primary-500/50">
          <h2 className="text-xl font-semibold text-white mb-4">Top Matched Individuals</h2>
          <div className="space-y-4">
            {topMatches.map((match, index) => (
              <div key={match.id} className="flex items-center justify-between p-4 bg-secondary-700/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{match.full_name}</p>
                    <p className="text-sm text-secondary-400">{match.match_count} recognitions</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
                  {((match.match_count / stats?.total_recognitions) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="hover:border-primary-500/50">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  activity.action_type === 'recognition' ? 'bg-green-500' :
                  activity.action_type === 'login' ? 'bg-blue-500' :
                  activity.action_type === 'create' ? 'bg-yellow-500' : 'bg-secondary-500'
                }`} />
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.description}</p>
                  <p className="text-xs text-secondary-400 mt-1">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;