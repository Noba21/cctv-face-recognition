import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            className={`${sizes[size]} w-full bg-secondary-800 rounded-xl border border-secondary-700 shadow-2xl`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-700">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-secondary-400 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;