import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiCamera, FiUser, FiMapPin, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import Modal from '../../components/Common/Modal';
import { personsAPI } from '../../api/persons';
import toast from 'react-hot-toast';

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    national_id: '',
    age: '',
    gender: 'Other',
    address: '',
    crime_description: '',
    risk_level: 'medium',
    status: 'active'
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear photo error if any
      if (errors.photo) {
        setErrors(prev => ({ ...prev, photo: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!photo) {
      newErrors.photo = 'Photo is required';
    }
    
    if (formData.age && (formData.age < 0 || formData.age > 120)) {
      newErrors.age = 'Age must be between 0 and 120';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append photo
      if (photo) {
        formDataToSend.append('photo', photo);
      }
      
      console.log('Submitting form data...', Object.fromEntries(formDataToSend));
      
      const response = await personsAPI.create(formDataToSend);
      console.log('Response:', response);
      
      toast.success('Person added successfully');
      onSuccess();
      
      // Reset form
      setFormData({
        full_name: '',
        national_id: '',
        age: '',
        gender: 'Other',
        address: '',
        crime_description: '',
        risk_level: 'medium',
        status: 'active'
      });
      setPhoto(null);
      setPhotoPreview('');
      setErrors({});
      
    } catch (error) {
      console.error('Failed to add person:', error);
      toast.error(error.response?.data?.error || 'Failed to add person');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add New Person" 
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload Section - Always Visible */}
        <div className="flex flex-col items-center border-b border-secondary-700 pb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-secondary-700 border-2 border-secondary-600 overflow-hidden flex items-center justify-center">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <FiCamera className="text-secondary-500 text-4xl" />
              )}
            </div>
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors"
            >
              <FiUpload className="text-white text-sm" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
          {errors.photo && (
            <p className="mt-2 text-sm text-accent-red">{errors.photo}</p>
          )}
          <p className="text-secondary-400 text-sm mt-2">
            Upload a clear face photo (JPEG, PNG, max 5MB)
          </p>
        </div>

        {/* Form Fields - Scrollable Area */}
        <div className="max-h-[60vh] overflow-y-auto px-1 space-y-4">
          {/* Full Name */}
          <div id="full_name">
            <label className="block text-secondary-300 text-sm font-medium mb-2">
              Full Name <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-secondary-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                errors.full_name
                  ? 'border-accent-red focus:ring-accent-red/50'
                  : 'border-secondary-600 focus:border-primary-500 focus:ring-primary-500/50'
              }`}
              placeholder="Enter full name"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-accent-red">{errors.full_name}</p>
            )}
          </div>

          {/* National ID */}
          <div>
            <label className="block text-secondary-300 text-sm font-medium mb-2">
              National ID
            </label>
            <input
              type="text"
              name="national_id"
              value={formData.national_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              placeholder="Optional"
            />
          </div>

          {/* Age and Gender Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-secondary-300 text-sm font-medium mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="0"
                max="120"
                className={`w-full px-4 py-2 bg-secondary-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                  errors.age
                    ? 'border-accent-red focus:ring-accent-red/50'
                    : 'border-secondary-600 focus:border-primary-500 focus:ring-primary-500/50'
                }`}
                placeholder="Enter age"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-accent-red">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-secondary-300 text-sm font-medium mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Risk Level and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-secondary-300 text-sm font-medium mb-2">
                Risk Level
              </label>
              <select
                name="risk_level"
                value={formData.risk_level}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              >
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
                <option value="critical">Critical Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-secondary-300 text-sm font-medium mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-secondary-300 text-sm font-medium mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              placeholder="Enter address"
            />
          </div>

          {/* Crime Description */}
          <div>
            <label className="block text-secondary-300 text-sm font-medium mb-2">
              Crime Description
            </label>
            <textarea
              name="crime_description"
              value={formData.crime_description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              placeholder="Enter crime description or notes"
            />
          </div>
        </div>

        {/* Form Actions - Always Visible at Bottom */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-secondary-700 sticky bottom-0 bg-secondary-800">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-6 py-2"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-2 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <FiUser />
                <span>Add Person</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;