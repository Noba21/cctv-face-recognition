import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className={`${sizes[size]} border-4 border-primary-500 border-t-transparent rounded-full`}
      />
      <p className="text-secondary-400">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;