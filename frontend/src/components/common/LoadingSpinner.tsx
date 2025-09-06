import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading premium experience...' 
}) => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-28 w-28',
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-luxury relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-luxury-400/10 rounded-full blur-lg animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary-500/10 rounded-full blur-lg animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        {/* Premium Spinner */}
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses[size]} border-4 border-transparent bg-gradient-to-r from-primary-500 via-luxury-400 to-secondary-500 rounded-full p-1 mx-auto`}
          >
            <div className="w-full h-full bg-gradient-luxury rounded-full"></div>
          </motion.div>
          
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Star className={`${iconSizes[size]} text-primary-400`} />
          </motion.div>
          
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="h-6 w-6 text-luxury-400" />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold luxury-gradient-text mb-2">RateIN</h3>
          <p className={`text-gray-300 font-medium ${textSizes[size]}`}>
            {text}<span className="loading-dots"></span>
          </p>
        </motion.div>
        
        {/* Luxury Dots Animation */}
        <motion.div className="flex justify-center space-x-2 mt-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity, 
                delay: index * 0.15,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-gradient-to-r from-primary-500 to-luxury-400 rounded-full shadow-glow"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
