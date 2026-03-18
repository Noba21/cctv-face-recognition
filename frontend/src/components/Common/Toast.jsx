import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'info', onClose }) => {
  const icons = {
    success: <FiCheckCircle className="text-green-500" size={20} />,
    error: <FiAlertCircle className="text-red-500" size={20} />,
    warning: <FiAlertCircle className="text-yellow-500" size={20} />,
    info: <FiInfo className="text-blue-500" size={20} />
  };

  const colors = {
    success: 'border-green-500 bg-green-500/10',
    error: 'border-red-500 bg-red-500/10',
    warning: 'border-yellow-500 bg-yellow-500/10',
    info: 'border-blue-500 bg-blue-500/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg border ${colors[type]} shadow-lg`}
    >
      {icons[type]}
      <p className="text-white">{message}</p>
      <button onClick={onClose} className="text-secondary-400 hover:text-white">
        <FiX size={18} />
      </button>
    </motion.div>
  );
};

export default Toast;