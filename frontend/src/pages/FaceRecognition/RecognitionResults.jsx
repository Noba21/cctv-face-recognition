import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMapPin,
  FiAlertCircle,
  FiDownload,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiCamera,
  FiCalendar
} from 'react-icons/fi';
import Card from '../../components/Common/Card';
import { reportsAPI } from '../../api/reports';
import toast from 'react-hot-toast';

const RecognitionResults = ({ results, onReset, uploadType }) => {
  const [downloading, setDownloading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleDownloadReport = async (recognitionId) => {
    setDownloading(true);
    try {
      const response = await reportsAPI.generateRecognitionReport(recognitionId);
      
      // Create blob and download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `recognition_report_${new Date().toISOString().split('T')[0]}.pdf`;
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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-500';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConfidenceBg = (confidence) => {
    if (confidence >= 80) return 'bg-green-500/20';
    if (confidence >= 60) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Recognition Results</h2>
          <p className="text-secondary-400 mt-1">
            Found {results.faces_detected} face{results.faces_detected !== 1 ? 's' : ''} in {results.processing_time_ms}ms
          </p>
        </div>
        <button
          onClick={onReset}
          className="btn-secondary flex items-center space-x-2"
        >
          <FiRefreshCw />
          <span>New Recognition</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-secondary-400 text-sm">Faces Detected</p>
          <p className="text-3xl font-bold text-white mt-1">{results.faces_detected}</p>
        </Card>
        <Card className="text-center">
          <p className="text-secondary-400 text-sm">Matches Found</p>
          <p className="text-3xl font-bold text-white mt-1">
            {results.matches?.filter(m => m.matched).length || 0}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-secondary-400 text-sm">Processing Time</p>
          <p className="text-3xl font-bold text-white mt-1">{results.processing_time_ms}ms</p>
        </Card>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.matches?.map((match, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden ${
              match.matched ? 'border-green-500/30' : 'border-yellow-500/30'
            }`}>
              {/* Status Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                match.matched
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {match.matched ? 'MATCHED' : 'UNKNOWN'}
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Detected Face */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={match.detected_face}
                      alt="Detected face"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-primary-500/30"
                    />
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>

                {/* Match Details */}
                <div className="flex-1">
                  {match.matched ? (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {match.person.full_name}
                          </h3>
                          <p className="text-secondary-400 text-sm mt-1">
                            {match.person.national_id || 'No ID'}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceBg(match.confidence)}`}>
                          <span className={getConfidenceColor(match.confidence)}>
                            {match.confidence.toFixed(1)}% Match
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <FiUser className="text-primary-500" />
                          <span className="text-secondary-300">
                            {match.person.age || '?'} years • {match.person.gender}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <FiMapPin className="text-primary-500" />
                          <span className="text-secondary-300">
                            {match.person.address || 'No address'}
                          </span>
                        </div>

                        {match.person.risk_level && (
                          <div className="flex items-center space-x-2 text-sm">
                            <FiAlertCircle className="text-primary-500" />
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              match.person.risk_level === 'critical' ? 'bg-red-500/20 text-red-400' :
                              match.person.risk_level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              match.person.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {match.person.risk_level.toUpperCase()} RISK
                            </span>
                          </div>
                        )}
                      </div>

                      {match.person.crime_description && (
                        <div className="mt-4 p-3 bg-secondary-700/50 rounded-lg">
                          <p className="text-sm text-secondary-300">
                            <span className="text-primary-500 font-medium">Note: </span>
                            {match.person.crime_description}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex items-center space-x-3">
                        <button
                          onClick={() => handleDownloadReport(results.id)}
                          disabled={downloading}
                          className="flex items-center space-x-2 text-sm text-primary-500 hover:text-primary-400 transition-colors"
                        >
                          {downloading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <FiDownload />
                              <span>Download Report</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedMatch(match)}
                          className="flex items-center space-x-2 text-sm text-secondary-400 hover:text-white transition-colors"
                        >
                          <FiFileText />
                          <span>View Details</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8">
                      <FiXCircle className="text-4xl text-yellow-500 mb-3" />
                      <p className="text-white font-medium">No Match Found</p>
                      <p className="text-secondary-400 text-sm text-center mt-1">
                        This face does not match any person in the database
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Face Location Info */}
              {match.location && (
                <div className="mt-4 pt-4 border-t border-secondary-700 text-xs text-secondary-500">
                  Face detected at position: {match.location.top}, {match.location.right}, {match.location.bottom}, {match.location.left}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No Faces Message */}
      {results.faces_detected === 0 && (
        <Card className="text-center py-12">
          <FiCamera className="text-5xl text-secondary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Faces Detected</h3>
          <p className="text-secondary-400">
            The {uploadType} you uploaded doesn't contain any detectable faces.
            Please try another {uploadType} with clear face images.
          </p>
        </Card>
      )}

      {/* Selected Match Modal - Would be implemented with Modal component */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          {/* Modal content would go here */}
        </div>
      )}
    </div>
  );
};

export default RecognitionResults;