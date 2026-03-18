import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, onClick }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`bg-secondary-800 rounded-xl border border-secondary-700 p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;