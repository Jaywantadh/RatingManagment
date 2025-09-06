import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer } from 'recharts';
import { LucideIcon } from 'lucide-react';

interface LuxuryChartProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactElement;
  className?: string;
  height?: number;
  loading?: boolean;
  description?: string;
}

export const LuxuryChart: React.FC<LuxuryChartProps> = ({
  title,
  icon: Icon,
  children,
  className = '',
  height = 300,
  loading = false,
  description
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`luxury-card p-6 relative overflow-hidden group ${className}`}
    >
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="p-2 bg-primary-500/20 rounded-xl">
                  <Icon className="h-5 w-5 text-primary-400" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                {description && (
                  <p className="text-gray-400 text-sm mt-1">{description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center" style={{ height }}>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400 font-medium">Loading analytics...</span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={height}>
              {children}
            </ResponsiveContainer>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </motion.div>
  );
};

// Luxury color palettes for charts
export const LUXURY_CHART_COLORS = {
  primary: ['#FF6B35', '#F7931E', '#FFD700', '#FFA500'],
  secondary: ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'],
  success: ['#059669', '#10B981', '#34D399', '#6EE7B7'],
  warning: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D'],
  error: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5'],
  luxury: ['#8B5A3C', '#D4AF37', '#FFD700', '#B8860B'],
  gradient: {
    blue: ['#3B82F6', '#60A5FA'],
    green: ['#10B981', '#34D399'],
    orange: ['#F59E0B', '#FBBF24'],
    purple: ['#8B5CF6', '#A78BFA'],
    red: ['#EF4444', '#F87171']
  }
};

// Common chart styling options
export const LUXURY_CHART_CONFIG = {
  cartesianGrid: {
    strokeDasharray: "3 3",
    stroke: "#374151",
    opacity: 0.3
  },
  axis: {
    axisLine: false,
    tickLine: false,
    tick: { 
      fill: '#9CA3AF', 
      fontSize: 12,
      fontWeight: 500
    }
  },
  tooltip: {
    contentStyle: {
      backgroundColor: '#1f2937',
      border: '1px solid #374151',
      borderRadius: '12px',
      color: '#fff',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    cursor: {
      fill: 'rgba(59, 130, 246, 0.1)'
    }
  },
  legend: {
    wrapperStyle: {
      paddingTop: '20px',
      fontSize: '14px',
      fontWeight: '500'
    }
  }
};
