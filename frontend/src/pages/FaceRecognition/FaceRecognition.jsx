import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiVideo,
  FiCamera,
  FiImage,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { recognitionAPI } from '../../api/recognition';
import Card from '../../components/Common/Card';
import Loader from '../../components/Common/Loader';
import RecognitionResults from './RecognitionResults';
import toast from 'react-hot-toast';

const FaceRecognition = () => {
  const [uploadType, setUploadType] = useState('image'); // 'image' or 'video'
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const validVideoTypes = ['video/mp4', 'video/avi', 'video/quicktime'];
      
      const isValid = uploadType === 'image' 
        ? validImageTypes.includes(file.type)
        : validVideoTypes.includes(file.type);
      
      if (!isValid) {
        toast.error(`Please upload a valid ${uploadType} file`);
        return;
      }
      
      // Validate file size
      const maxSize = uploadType === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
        return;
      }
      
      setFile(file);
      
      // Create preview
      if (uploadType === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        // For video, just show video icon
        setPreview('video');
      }
      
      // Reset results
      setResults(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: uploadType === 'image' 
      ? { 'image/*': [] }
      : { 'video/*': [] },
    maxFiles: 1
  });

  const handleProcess = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    
    setProcessing(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append(uploadType, file);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);
    
    try {
      let response;
      if (uploadType === 'image') {
        response = await recognitionAPI.recognizeImage(formData);
      } else {
        response = await recognitionAPI.recognizeVideo(formData);
      }
      
      clearInterval(interval);
      setProgress(100);
      setResults(response);
      toast.success('Recognition completed successfully');
      
    } catch (error) {
      clearInterval(interval);
      console.error('Recognition failed:', error);
      toast.error(error.response?.data?.error || 'Recognition failed');
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview('');
    setResults(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Face Recognition</h1>
        <p className="text-secondary-400 mt-1">
          Upload images or video to identify individuals
        </p>
      </div>

      {/* Upload Type Selector */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => {
            setUploadType('image');
            handleReset();
          }}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
            uploadType === 'image'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-800 text-secondary-400 hover:text-white'
          }`}
        >
          <FiImage />
          <span>Image</span>
        </button>
        <button
          onClick={() => {
            setUploadType('video');
            handleReset();
          }}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
            uploadType === 'video'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-800 text-secondary-400 hover:text-white'
          }`}
        >
          <FiVideo />
          <span>Video</span>
        </button>
      </div>

      {/* Upload Area */}
      {!results ? (
        <Card>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-secondary-700 hover:border-primary-500/50'
            }`}
          >
            <input {...getInputProps()} />
            
            {preview ? (
              <div className="space-y-4">
                {uploadType === 'image' ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto bg-secondary-700 rounded-lg flex items-center justify-center">
                    <FiVideo className="text-4xl text-primary-500" />
                  </div>
                )}
                <p className="text-white">{file?.name}</p>
                <p className="text-sm text-secondary-400">
                  Click or drag to replace
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-secondary-800 rounded-full flex items-center justify-center">
                  {uploadType === 'image' ? (
                    <FiImage className="text-3xl text-primary-500" />
                  ) : (
                    <FiVideo className="text-3xl text-primary-500" />
                  )}
                </div>
                <div>
                  <p className="text-white text-lg">
                    {isDragActive
                      ? 'Drop the file here'
                      : `Drag & drop ${uploadType} here`}
                  </p>
                  <p className="text-secondary-400 text-sm mt-1">
                    or click to browse
                  </p>
                </div>
                <p className="text-xs text-secondary-500">
                  {uploadType === 'image'
                    ? 'Supported: JPG, PNG (Max 10MB)'
                    : 'Supported: MP4, AVI, MOV (Max 100MB)'}
                </p>
              </div>
            )}
          </div>

          {/* Process Button */}
          {file && !processing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-end space-x-3"
            >
              <button
                onClick={handleReset}
                className="btn-secondary flex items-center space-x-2"
              >
                <FiRefreshCw />
                <span>Reset</span>
              </button>
              <button
                onClick={handleProcess}
                className="btn-primary flex items-center space-x-2"
              >
                <FiCamera />
                <span>Start Recognition</span>
              </button>
            </motion.div>
          )}

          {/* Progress Bar */}
          {processing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-400">Processing...</span>
                <span className="text-primary-500">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-secondary-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary-600"
                />
              </div>
            </motion.div>
          )}
        </Card>
      ) : (
        /* Recognition Results */
        <RecognitionResults
          results={results}
          onReset={handleReset}
          uploadType={uploadType}
        />
      )}
    </div>
  );
};

export default FaceRecognition;