import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiDownload,
  FiCalendar,
  FiUser,
  FiFilter,
  FiSearch,
  FiEye,
  FiBarChart2,
  FiPieChart,
  FiTrendingUp
} from 'react-icons/fi';
import { recognitionAPI } from '../../api/recognition';
import { reportsAPI } from '../../api/reports';
import Card from '../../components/Common/Card';
import Loader from '../../components/Common/Loader';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Reports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recognitions, setRecognitions] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'week',
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
    status: '',
    search: ''
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [historyData, statsData] = await Promise.all([
        recognitionAPI.getHistory({ per_page: 50 }),
        recognitionAPI.getStats()
      ]);
      setRecognitions(historyData.items);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch reports data:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    const today = new Date();
    let startDate = new Date();
    
    switch(range) {
      case 'today':
        startDate = today;
        break;
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
    }
    
    setFilters({
      ...filters,
      dateRange: range,
      startDate,
      endDate: today
    });
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const response = await reportsAPI.generateCustomReport({
        type: 'recognition',
        date_from: filters.startDate.toISOString(),
        date_to: filters.endDate.toISOString()
      });
      
      // Create blob and download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `recognition_report_${filters.startDate.toISOString().split('T')[0]}_to_${filters.endDate.toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleViewReport = (id) => {
    navigate(`/reports/${id}`);
  };

  const handleDownloadRecognitionReport = async (id) => {
    try {
      const response = await reportsAPI.generateRecognitionReport(id);
      
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `recognition_${id}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const filteredRecognitions = recognitions.filter(rec => {
    if (filters.status && rec.match_status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        rec.person?.full_name?.toLowerCase().includes(searchLower) ||
        rec.id.toString().includes(searchLower)
      );
    }
    return true;
  });

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
      <div>
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="text-secondary-400 mt-1">
          Generate and manage recognition reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-400 text-sm">Total Recognitions</p>
              <p className="text-2xl font-bold text-white mt-1">{stats?.total_recognitions || 0}</p>
            </div>
            <FiBarChart2 className="text-3xl text-primary-500" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-400 text-sm">Match Rate</p>
              <p className="text-2xl font-bold text-white mt-1">{stats?.match_rate?.toFixed(1) || 0}%</p>
            </div>
            <FiTrendingUp className="text-3xl text-green-500" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-400 text-sm">Today's Count</p>
              <p className="text-2xl font-bold text-white mt-1">{stats?.today_count || 0}</p>
            </div>
            <FiCalendar className="text-3xl text-yellow-500" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-400 text-sm">Avg Confidence</p>
              <p className="text-2xl font-bold text-white mt-1">{stats?.average_confidence?.toFixed(1) || 0}%</p>
            </div>
            <FiPieChart className="text-3xl text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Report Generator */}
      <Card>
        <h2 className="text-xl font-semibold text-white mb-4">Generate Custom Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-secondary-300 text-sm font-medium mb-2">
                Date Range
              </label>
              <div className="flex space-x-2">
                {['today', 'week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => handleDateRangeChange(range)}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                      filters.dateRange === range
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-700 text-secondary-400 hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary-300 text-sm font-medium mb-2">
                  From
                </label>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => setFilters({ ...filters, startDate: date })}
                  className="w-full px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div>
                <label className="block text-secondary-300 text-sm font-medium mb-2">
                  To
                </label>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => setFilters({ ...filters, endDate: date })}
                  className="w-full px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-end justify-end">
            <button
              onClick={handleGenerateReport}
              disabled={generating}
              className="btn-primary flex items-center space-x-2 px-6 py-3"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FiFileText />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Card>

      {/* Recent Recognitions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Recognitions</h2>
          
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500" />
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 pr-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="matched">Matched</option>
              <option value="unmatched">Unmatched</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-3 text-left">Date/Time</th>
                <th className="px-6 py-3 text-left">Person</th>
                <th className="px-6 py-3 text-left">Confidence</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Source</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-700">
              {filteredRecognitions.map((rec) => (
                <motion.tr
                  key={rec.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="table-row"
                >
                  <td className="px-6 py-4 text-secondary-300">
                    {new Date(rec.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {rec.person ? (
                      <div className="flex items-center space-x-2">
                        <img
                          src={rec.person.photo_path}
                          alt={rec.person.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-white">{rec.person.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-secondary-500">Unknown</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rec.confidence_score >= 80 ? 'bg-green-500/20 text-green-400' :
                      rec.confidence_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {rec.confidence_score.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rec.match_status === 'matched'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {rec.match_status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-secondary-300 capitalize">
                    {rec.source_type}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewReport(rec.id)}
                        className="p-2 text-secondary-400 hover:text-white hover:bg-secondary-700 rounded-lg transition-colors"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownloadRecognitionReport(rec.id)}
                        className="p-2 text-secondary-400 hover:text-white hover:bg-secondary-700 rounded-lg transition-colors"
                      >
                        <FiDownload size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecognitions.length === 0 && (
          <div className="text-center py-12">
            <FiFileText className="text-5xl text-secondary-600 mx-auto mb-4" />
            <p className="text-secondary-400">No recognitions found</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;