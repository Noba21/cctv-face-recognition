export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhone = (phone) => {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
  return re.test(phone);
};

export const validateNationalId = (id) => {
  // Basic validation - can be customized based on your country's format
  return id && id.length >= 6 && id.length <= 20;
};

export const validateAge = (age) => {
  const numAge = parseInt(age);
  return !isNaN(numAge) && numAge >= 0 && numAge <= 120;
};

export const validateRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== '';
};

export const validateFile = (file, type = 'image') => {
  const errors = [];
  
  if (!file) {
    errors.push('File is required');
    return { isValid: false, errors };
  }
  
  // Check file type
  const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const validVideoTypes = ['video/mp4', 'video/avi', 'video/quicktime'];
  
  const validTypes = type === 'image' ? validImageTypes : validVideoTypes;
  
  if (!validTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed: ${validTypes.map(t => t.split('/')[1]).join(', ')}`);
  }
  
  // Check file size
  const maxSize = type === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
  
  if (file.size > maxSize) {
    const sizeMB = maxSize / (1024 * 1024);
    errors.push(`File size exceeds ${sizeMB}MB limit`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};