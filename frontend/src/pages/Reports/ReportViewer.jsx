import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiDownload,
  FiUser,
  FiCalendar,
  FiClock,
  FiCamera,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiMapPin,
  FiFileText
} from 'react-icons/fi';
import { recognitionAPI } from '../../api/recognition';
import { reportsAPI } from '../../api/reports';
import Card from '../../components/Common/Card';
import Loader from '../../components/Common/Loader';
import toast from 'react-hot-toast';

const ReportViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recognition, setRecognition] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchRecognitionDetails();
  }, [id]);

  const fetchRecognitionDetails = async () => {
    try {
      const data = await recognitionAPI.getRecognitionDetail(id);
      setRecognition(data);
    } catch (error) {
      console.error('Failed to fetch recognition details:', error);
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await reportsAPI.generateRecognitionReport(id);
      
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `recognition_report_${id}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Failed to download report:', error);
      toast.error('Failed to download report');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!recognition) {
    return (
      <div className="text-center py-20">
        <p className="text-secondary-400">Report not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center space-x-2 text-secondary-400 hover:text-white transition-colors"
        >
          <FiArrowLeft />
          <span>Back to Reports</span>
        </button>
        
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="btn-primary flex items-center space-x-2"
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <FiDownload />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Report Header */}
      <Card>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">CCTV Face Recognition Report</h1>
          <p className="text-secondary-400 mt-2">Report ID: REC-{recognition.id}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-secondary-400 text-sm">Date</p>
            <p className="text-white font-medium">
              {new Date(recognition.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-secondary-400 text-sm">Time</p>
            <p className="text-white font-medium">
              {new Date(recognition.created_at).toLocaleTimeString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-secondary-400 text-sm">Source</p>
            <p className="text-white font-medium capitalize">{recognition.source_type}</p>
          </div>
          <div className="text-center">
            <p className="text-secondary-400 text-sm">Processing Time</p>
            <p className="text-white font-medium">{recognition.processing_time_ms}ms</p>
          </div>
        </div>
      </Card>

      {/* Recognition Result */}
      <Card>
        <h2 className="text-xl font-semibold text-white mb-6">Recognition Result</h2>
        
        {recognition.match_status === 'matched' && recognition.person ? (
          <div className="space-y-6">
            {/* Images Comparison */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-secondary-400 text-sm mb-2">Detected Face</p>
                <img
                  src={recognition.detected_image_path}
                  alt="Detected face"
                  className="w-48 h-48 object-cover rounded-lg border-2 border-primary-500/30 mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-secondary-400 text-sm mb-2">Database Record</p>
                <img
                  src={recognition.person.photo_path}
                  alt={recognition.person.full_name}
                  className="w-48 h-48 object-cover rounded-lg border-2 border-green-500/30 mx-auto"
                />
              </div>
            </div>

            {/* Match Info */}
            <div className="bg-secondary-700/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{recognition.person.full_name}</h3>
                <div className={`px-4 py-2 rounded-full ${
                  recognition.confidence_score >= 80 ? 'bg-green-500/20' :
                  recognition.confidence_score >= 60 ? 'bg-yellow-500/20' :
                  'bg-red-500/20'
                }`}>
                  <span className={`font-semibold ${
                    recognition.confidence_score >= 80 ? 'text-green-400' :
                    recognition.confidence_score >= 60 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {recognition.confidence_score.toFixed(1)}% Match
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <FiUser className="text-primary-500" />
                  <span className="text-secondary-300">
                    {recognition.person.age || '?'} years • {recognition.person.gender}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <FiMapPin className="text-primary-500" />
                  <span className="text-secondary-300">
                    {recognition.person.address || 'No address'}
                  </span>
                </div>

                {recognition.person.national_id && (
                  <div className="flex items-center space-x-2">
                    <FiFileText className="text-primary-500" />
                    <span className="text-secondary-300">ID: {recognition.person.national_id}</span>
                  </div>
                )}

                {recognition.person.risk_level && (
                  <div className="flex items-center space-x-2">
                    <FiAlertCircle className="text-primary-500" />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      recognition.person.risk_level === 'critical' ? 'bg-red-500/20 text-red-400' :
                      recognition.person.risk_level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      recognition.person.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {recognition.person.risk_level.toUpperCase()} RISK
                    </span>
                  </div>
                )}
              </div>

              {recognition.person.crime_description && (
                <div className="mt-4 p-4 bg-secondary-800/50 rounded-lg">
                  <p className="text-secondary-300">
                    <span className="text-primary-500 font-medium">Crime Description: </span>
                    {recognition.person.crime_description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiXCircle className="text-6xl text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Match Found</h3>
            <p className="text-secondary-400">
              The detected face does not match any person in the database
            </p>
            
            {recognition.detected_image_path && (
              <div className="mt-8">
                <p className="text-secondary-400 text-sm mb-2">Detected Face</p>
                <img
                  src={recognition.detected_image_path}
                  alt="Detected face"
                  className="w-48 h-48 object-cover rounded-lg border-2 border-primary-500/30 mx-auto"
                />
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Additional Details */}
      <Card>
        <h2 className="text-xl font-semibold text-white mb-4">Additional Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-secondary-400 text-sm">Source File</p>
            <p className="text-white font-mono text-sm mt-1">
              {recognition.source_file_path || 'N/A'}
            </p>
          </div>
          
          <div>
            <p className="text-secondary-400 text-sm">Operator</p>
            <p className="text-white mt-1">{recognition.created_by || 'System'}</p>
          </div>
          
          {recognition.notes && (
            <div className="col-span-2">
              <p className="text-secondary-400 text-sm">Notes</p>
              <p className="text-white mt-1">{recognition.notes}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center text-secondary-500 text-sm">
        <p>Report generated by CCTV Face Recognition System</p>
        <p className="mt-1">This is an official system report</p>
      </div>
    </div>
  );
};

export default ReportViewer;