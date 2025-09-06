import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Trash2, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: Trash2,
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-400',
          confirmBg: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
          glowColor: 'shadow-red-500/20',
          borderColor: 'border-red-500/30'
        };
      case 'info':
        return {
          icon: Shield,
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-400',
          confirmBg: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
          glowColor: 'shadow-blue-500/20',
          borderColor: 'border-blue-500/30'
        };
      default: // warning
        return {
          icon: AlertTriangle,
          iconBg: 'bg-amber-500/20',
          iconColor: 'text-amber-400',
          confirmBg: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
          glowColor: 'shadow-amber-500/20',
          borderColor: 'border-amber-500/30'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
          className={`luxury-card p-8 max-w-md w-full shadow-2xl ${config.glowColor} border ${config.borderColor} relative overflow-hidden`}
        >
          {/* Background Glow Effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-2xl opacity-50"></div>
          
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-200 rounded-full hover:bg-dark-700/50 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </motion.button>

          <div className="relative z-10">
            {/* Icon and Title */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`mx-auto w-16 h-16 ${config.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
              >
                <Icon className={`h-8 w-8 ${config.iconColor}`} />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {title}
              </motion.h3>
            </div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <p className="text-gray-300 leading-relaxed text-lg">
                {message}
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-dark-700/50 text-gray-300 rounded-xl hover:bg-dark-600/50 transition-all duration-300 border border-dark-600 hover:border-gray-500 font-semibold disabled:opacity-50"
              >
                {cancelText}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${config.glowColor.replace('shadow-', 'rgba(').replace('/20', ', 0.3)')}` }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 py-3 px-6 ${config.confirmBg} text-white rounded-xl transition-all duration-300 font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  confirmText
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Decorative Border */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Hook for easier usage
export const useConfirmation = () => {
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info';
    confirmText: string;
    onConfirm: () => void;
    loading: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Confirm',
    onConfirm: () => {},
    loading: false
  });

  const showConfirmation = (config: {
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info';
    confirmText?: string;
    onConfirm: () => void | Promise<void>;
  }) => {
    setDialogState({
      isOpen: true,
      title: config.title,
      message: config.message,
      type: config.type || 'warning',
      confirmText: config.confirmText || 'Confirm',
      onConfirm: async () => {
        setDialogState(prev => ({ ...prev, loading: true }));
        try {
          await config.onConfirm();
          hideConfirmation();
        } catch (error) {
          console.error('Confirmation action failed:', error);
          setDialogState(prev => ({ ...prev, loading: false }));
        }
      },
      loading: false
    });
  };

  const hideConfirmation = () => {
    setDialogState(prev => ({ ...prev, isOpen: false, loading: false }));
  };

  const ConfirmationComponent = () => (
    <ConfirmationDialog
      isOpen={dialogState.isOpen}
      onClose={hideConfirmation}
      onConfirm={dialogState.onConfirm}
      title={dialogState.title}
      message={dialogState.message}
      type={dialogState.type}
      confirmText={dialogState.confirmText}
      loading={dialogState.loading}
    />
  );

  return {
    showConfirmation,
    hideConfirmation,
    ConfirmationComponent
  };
};
