import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiImage,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiMaximize2,
  FiMinimize2
} from 'react-icons/fi';
import Card from '../../components/Common/Card';
import { validateFile, formatFileSize } from '../../utils/helpers';

const ImageUpload = ({ onImageSelect, onCancel, maxSize = 10 }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError(`File size exceeds ${maxSize}MB limit`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Invalid file type. Please upload an image');
      }
      return;
    }

    // Handle accepted file
    const file = acceptedFiles[0];
    if (file) {
      const validation = validateFile(file, 'image');
      
      if (!validation.isValid) {
        setError(validation.errors[0]);
        return;
      }

      setFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Notify parent
      if (onImageSelect) {
        onImageSelect(file);
      }
    }
  }, [maxSize, onImageSelect]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
    noClick: true,
    noKeyboard: true
  });

  const handleRemove = () => {
    setFile(null);
    setPreview('');
    setError('');
    if (onImageSelect) {
      onImageSelect(null);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card className={`relative transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50 overflow-auto' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <FiImage className="text-primary-500" />
          <span>Upload Image</span>
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 text-secondary-400 hover:text-white hover:bg-secondary-700 rounded-lg transition-colors"
          >
            {isFullscreen ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 text-secondary-400 hover:text-white hover:bg-secondary-700 rounded-lg transition-colors"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl transition-all ${
          isDragging
            ? 'border-primary-500 bg-primary-500/10'
            : error
            ? 'border-accent-red bg-accent-red/5'
            : preview
            ? 'border-green-500/50'
            : 'border-secondary-700 hover:border-primary-500/50'
        }`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
      >
        <input {...getInputProps()} />

        {preview ? (
          // Preview Mode
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-4">
              <button
                onClick={open}
                className="p-3 bg-primary-600 rounded-full hover:bg-primary-700 transition-colors"
                title="Change image"
              >
                <FiUpload className="text-white" />
              </button>
              <button
                onClick={handleRemove}
                className="p-3 bg-accent-red rounded-full hover:bg-red-700 transition-colors"
                title="Remove image"
              >
                <FiX className="text-white" />
              </button>
            </div>

            {/* File Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-secondary-900/90 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span className="text-white text-sm truncate max-w-xs">
                    {file?.name}
                  </span>
                </div>
                <span className="text-secondary-400 text-xs">
                  {formatFileSize(file?.size)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Upload Prompt
          <div className="py-12 text-center cursor-pointer" onClick={open}>
            <div className="w-20 h-20 mx-auto bg-secondary-800 rounded-full flex items-center justify-center mb-4">
              <FiImage className="text-3xl text-primary-500" />
            </div>
            
            <p className="text-white text-lg mb-2">
              {isDragging ? 'Drop the image here' : 'Drag & drop an image'}
            </p>
            
            <p className="text-secondary-400 text-sm mb-4">
              or click to browse
            </p>
            
            <button
              type="button"
              onClick={open}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <FiUpload />
              <span>Select Image</span>
            </button>

            <p className="text-xs text-secondary-500 mt-4">
              Supported formats: JPEG, PNG, GIF, BMP (Max {maxSize}MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-accent-red/10 border border-accent-red/30 rounded-lg flex items-center space-x-2"
          >
            <FiAlertCircle className="text-accent-red flex-shrink-0" />
            <span className="text-sm text-accent-red">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Guidelines */}
      {!preview && !error && (
        <div className="mt-4 text-xs text-secondary-500">
          <p className="font-medium mb-2">📸 Image Guidelines:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Clear, front-facing face photo</li>
            <li>Good lighting and contrast</li>
            <li>Minimum resolution: 300x300 pixels</li>
            <li>Avoid sunglasses or face coverings</li>
          </ul>
        </div>
      )}
    </Card>
  );
};

export default ImageUpload;