import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiAlertCircle,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiCamera
} from 'react-icons/fi';
import { personsAPI } from '../../api/persons';
import { reportsAPI } from '../../api/reports';
import Card from '../../components/Common/Card';
import Loader from '../../components/Common/Loader';
import Modal from '../../components/Common/Modal';
import toast from 'react-hot-toast';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState(null);
  const [recognitions, setRecognitions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const [personData, recognitionsData] = await Promise.all([
        personsAPI.getById(id),
        personsAPI.getRecognitions(id)
      ]);
      setPerson(personData);
      setRecognitions(recognitionsData.recognitions || []);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await personsAPI.delete(id);
      toast.success('User archived successfully');
      navigate('/users');
    } catch (error) {
      toast.error('Failed to archive user');
    }
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const response = await reportsAPI.generatePersonReport(id);
      
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `person_report_${person.full_name}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Failed to download report:', error);
      toast.error('Failed to generate report');
    } finally {
      setDownloading(false);
    }
  };

  const getRiskBadgeColor = (risk) => {
    const colors = {
      low: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-orange-500/20 text-orange-400',
      critical: 'bg-red-500/20 text-red-400'
    };
    return colors[risk] || 'bg-secondary-500/20 text-secondary-400';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="text-center py-20">
        <p className="text-secondary-400">Person not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/users')}
            className="flex items-center space-x-2 text-secondary-400 hover:text-white transition-colors"
          >
            <FiArrowLeft />
            <span>Back to Users</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadReport}
              disabled={downloading}
              className="btn-secondary flex items-center space-x-2"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-secondary-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FiDownload />
                  <span>Download Report</span>
                </>
              )}
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <FiEdit2 />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-danger flex items-center space-x-2"
            >
              <FiTrash2 />
              <span>Archive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-6 pr-1">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={person.photo_path || '/default-avatar.png'}
                    alt={person.full_name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-500/30 mx-auto"
                  />
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${
                    person.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                </div>
                
                <h2 className="text-2xl font-bold text-white mt-4">{person.full_name}</h2>
                <p className="text-secondary-400">{person.national_id || 'No ID'}</p>
                
                <div className="mt-4 flex justify-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRiskBadgeColor(person.risk_level)}`}>
                    {person.risk_level?.toUpperCase()} RISK
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3 text-secondary-300">
                  <FiUser className="text-primary-500 flex-shrink-0" />
                  <span className="truncate">{person.age || '?'} years old • {person.gender}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-secondary-300">
                  <FiMapPin className="text-primary-500 flex-shrink-0" />
                  <span className="truncate">{person.address || 'No address provided'}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-secondary-300">
                  <FiCalendar className="text-primary-500 flex-shrink-0" />
                  <span>Added: {new Date(person.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            {/* Details Card */}
            <Card className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-secondary-400 text-sm">Full Name</p>
                  <p className="text-white break-words">{person.full_name}</p>
                </div>
                
                <div>
                  <p className="text-secondary-400 text-sm">National ID</p>
                  <p className="text-white break-words">{person.national_id || 'Not provided'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-secondary-400 text-sm">Age</p>
                    <p className="text-white">{person.age || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-secondary-400 text-sm">Gender</p>
                    <p className="text-white">{person.gender}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-secondary-400 text-sm">Address</p>
                  <p className="text-white break-words">{person.address || 'Not provided'}</p>
                </div>
                
                <div>
                  <p className="text-secondary-400 text-sm">Crime Description</p>
                  <p className="text-white whitespace-pre-wrap break-words">
                    {person.crime_description || 'No crime description provided'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Recognition History */}
            <Card className="lg:col-span-3">
              <h3 className="text-xl font-semibold text-white mb-4">Recognition History</h3>
              
              {recognitions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="table-header">
                        <th className="px-6 py-3 text-left">Date/Time</th>
                        <th className="px-6 py-3 text-left">Confidence</th>
                        <th className="px-6 py-3 text-left">Source</th>
                        <th className="px-6 py-3 text-left">Location</th>
                        <th className="px-6 py-3 text-left">Operator</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-700">
                      {recognitions.map((rec) => (
                        <tr key={rec.id} className="table-row">
                          <td className="px-6 py-4 text-secondary-300 whitespace-nowrap">
                            {new Date(rec.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              rec.confidence_score >= 80
                                ? 'bg-green-500/20 text-green-400'
                                : rec.confidence_score >= 60
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {rec.confidence_score?.toFixed(1) || '0'}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-secondary-300 capitalize whitespace-nowrap">
                            {rec.source_type || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-secondary-300 whitespace-nowrap">
                            {rec.location || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-secondary-300 whitespace-nowrap">
                            {rec.operator || 'System'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => {/* View recognition details */}}
                              className="text-primary-500 hover:text-primary-400"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiCamera className="text-5xl text-secondary-600 mx-auto mb-4" />
                  <p className="text-secondary-400">No recognition history available</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Archive Person"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <FiAlertCircle className="text-yellow-500 text-2xl flex-shrink-0" />
            <p className="text-white">
              Are you sure you want to archive <span className="font-semibold">{person?.full_name}</span>?
              This person will be moved to archived status and won't appear in active searches.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger"
            >
              Archive Person
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserDetails;