import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Area, Line
} from 'recharts';
import { 
  Users, Store, Star, TrendingUp, Store as StoreIcon, 
  LogOut, Crown, Sparkles, Globe, DollarSign, Award, Diamond, Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usersApi, storesApi, ratingsApi } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { UserManagement } from '../components/admin/UserManagement';
import { StoreManagement } from '../components/admin/StoreManagement';
import { RatingManagement } from '../components/admin/RatingManagement';
import { useConfirmation } from '../components/common/ConfirmationDialog';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
  averageRating: number;
  totalRevenue: number;
  growthRate: number;
  activeUsers: number;
  topRatedStores: number;
  userRoleDistribution: { role: string; count: number; color: string }[];
  ratingDistribution: { rating: string; count: number; percentage: number }[];
  monthlyGrowth: { month: string; users: number; stores: number; ratings: number; revenue: number }[];
  topPerformingStores: { name: string; rating: number; reviews: number; revenue: number }[];
  userActivityHeatmap: { day: string; hour: number; activity: number }[];
  revenueByCategory: { category: string; revenue: number; growth: number }[];
  geographicDistribution: { region: string; users: number; stores: number }[];
}

const LUXURY_COLORS = {
  primary: ['#FF6B35', '#F7931E', '#FFD700', '#FFA500'],
  secondary: ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'],
  success: ['#059669', '#10B981', '#34D399', '#6EE7B7'],
  warning: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D'],
  error: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5'],
  luxury: ['#8B5A3C', '#D4AF37', '#FFD700', '#B8860B'],
  gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #FFD700 75%, #FFA500 100%)'
};

const SystemAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showConfirmation, ConfirmationComponent } = useConfirmation();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [userStats, storeStats, ratingStats] = await Promise.all([
        usersApi.getUserStats(),
        storesApi.getStoreStats(),
        ratingsApi.getOverallRatingStats(),
      ]);

      // Enhanced mock data for luxury admin dashboard
      const mockData: DashboardStats = {
        totalUsers: userStats.data.total,
        totalStores: storeStats.data.total,
        totalRatings: ratingStats.data.totalRatings,
        averageRating: ratingStats.data.averageRating,
        totalRevenue: 2847650,
        growthRate: 23.5,
        activeUsers: Math.floor(userStats.data.total * 0.78),
        topRatedStores: Math.floor(storeStats.data.total * 0.15),
        userRoleDistribution: [
          { role: 'Premium Users', count: userStats.data.byRole.NORMAL_USER || 0, color: LUXURY_COLORS.primary[0] },
          { role: 'Elite Owners', count: userStats.data.byRole.STORE_OWNER || 0, color: LUXURY_COLORS.secondary[1] },
          { role: 'System Admins', count: userStats.data.byRole.SYSTEM_ADMIN || 0, color: LUXURY_COLORS.luxury[1] },
        ],
        ratingDistribution: [
          { rating: '5★ Exceptional', count: 456, percentage: 42.3 },
          { rating: '4★ Excellent', count: 321, percentage: 29.8 },
          { rating: '3★ Good', count: 178, percentage: 16.5 },
          { rating: '2★ Fair', count: 89, percentage: 8.3 },
          { rating: '1★ Poor', count: 34, percentage: 3.1 },
        ],
        monthlyGrowth: [
          { month: 'Jan', users: 120, stores: 45, ratings: 89, revenue: 245800 },
          { month: 'Feb', users: 145, stores: 52, ratings: 112, revenue: 298450 },
          { month: 'Mar', users: 168, stores: 58, ratings: 134, revenue: 356200 },
          { month: 'Apr', users: 189, stores: 64, ratings: 156, revenue: 412750 },
          { month: 'May', users: 210, stores: 71, ratings: 178, revenue: 478900 },
          { month: 'Jun', users: 234, stores: 78, ratings: 201, revenue: 542300 },
        ],
        topPerformingStores: [
          { name: 'Luxury Boutique Plaza', rating: 4.9, reviews: 342, revenue: 125600 },
          { name: 'Elite Dining Experience', rating: 4.8, reviews: 298, revenue: 98750 },
          { name: 'Premium Tech Hub', rating: 4.7, reviews: 267, revenue: 87300 },
          { name: 'Exclusive Fashion House', rating: 4.6, reviews: 234, revenue: 76800 },
          { name: 'Royal Wellness Spa', rating: 4.5, reviews: 189, revenue: 65400 },
        ],
        userActivityHeatmap: [
          { day: 'Mon', hour: 9, activity: 45 },
          { day: 'Mon', hour: 12, activity: 78 },
          { day: 'Mon', hour: 15, activity: 92 },
          { day: 'Mon', hour: 18, activity: 134 },
          { day: 'Tue', hour: 9, activity: 52 },
          { day: 'Tue', hour: 12, activity: 89 },
          { day: 'Wed', hour: 9, activity: 48 },
          { day: 'Thu', hour: 12, activity: 95 },
          { day: 'Fri', hour: 18, activity: 156 },
          { day: 'Sat', hour: 15, activity: 178 },
          { day: 'Sun', hour: 12, activity: 123 },
        ],
        revenueByCategory: [
          { category: 'Premium Dining', revenue: 847650, growth: 15.2 },
          { category: 'Luxury Retail', revenue: 645320, growth: 22.1 },
          { category: 'Elite Services', revenue: 532180, growth: 18.7 },
          { category: 'Exclusive Events', revenue: 423900, growth: 28.3 },
          { category: 'Premium Tech', revenue: 398600, growth: 31.5 },
        ],
        geographicDistribution: [
          { region: 'Metropolitan Core', users: 342, stores: 89 },
          { region: 'Business District', users: 298, stores: 67 },
          { region: 'Luxury Quarter', users: 234, stores: 45 },
          { region: 'Innovation Hub', users: 189, stores: 34 },
          { region: 'Cultural Zone', users: 156, stores: 28 },
        ],
      };

      setStats(mockData);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    showConfirmation({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout from the admin panel? You will need to login again to access the system.',
      type: 'warning',
      confirmText: 'Yes, Logout',
      onConfirm: logout
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const isActiveRoute = (path: string) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gradient-luxury relative overflow-hidden">
      {/* Luxury Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/10 via-luxury-400/10 to-secondary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-secondary-600/10 via-primary-400/10 to-luxury-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-luxury-400/5 to-primary-500/5 rounded-full blur-2xl animate-pulse-slow" style={{animationDelay: '3s'}}></div>
      </div>
      
      {/* Header */}
      <header className="relative z-20 luxury-card border-b border-primary-500/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-6"
            >
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-luxury-400 via-primary-500 to-secondary-600 rounded-3xl shadow-glow">
                  <Crown className="h-12 w-12 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-luxury-400 animate-pulse" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold luxury-gradient-text">RateIN Command Center</h1>
                <p className="text-gray-300 font-medium text-lg">Elite System Administration</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Diamond className="h-4 w-4 text-luxury-400" />
                  <span className="text-sm text-luxury-400 font-medium">Premium Analytics Suite</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-6"
            >
              <div className="text-right">
                <p className="text-lg font-bold text-gray-200">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Award className="h-4 w-4 text-luxury-400" />
                  <span className="text-xs text-luxury-400 font-semibold">System Administrator</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-4 bg-dark-700/50 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300 border border-dark-600 hover:border-red-500/30 shadow-soft"
                title="Logout"
              >
                <LogOut className="h-6 w-6" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Luxury Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="luxury-card p-6">
            <div className="flex flex-wrap gap-4">
              {[
                { path: 'overview', label: 'Executive Overview', icon: Eye, color: 'primary' },
                { path: 'users', label: 'User Analytics', icon: Users, color: 'secondary' },
                { path: 'stores', label: 'Store Intelligence', icon: StoreIcon, color: 'success' },
                { path: 'ratings', label: 'Rating Insights', icon: Star, color: 'luxury' },
              ].map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`group flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                      isActiveRoute(item.path)
                        ? `bg-gradient-to-r from-${item.color}-500/20 to-${item.color}-600/20 text-${item.color}-300 shadow-glow border border-${item.color}-500/30`
                        : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/30 border border-dark-600 hover:border-gray-600/50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                      isActiveRoute(item.path)
                        ? `bg-${item.color}-500/20`
                        : 'bg-dark-700/50 group-hover:bg-gray-600/20'
                    }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">{item.label}</span>
                    {isActiveRoute(item.path) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-2 h-2 bg-luxury-400 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.nav>

        {/* Routes */}
        <Routes>
          <Route path="overview" element={<DashboardOverview stats={stats} />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="stores" element={<StoreManagement />} />
          <Route path="ratings" element={<RatingManagement />} />
          <Route path="*" element={<DashboardOverview stats={stats} />} />
        </Routes>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationComponent />
    </div>
  );
};

const DashboardOverview: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => {
  if (!stats) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-10"
    >
      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Elite Users', 
            value: formatNumber(stats.totalUsers), 
            subtitle: `+${stats.growthRate}% growth`, 
            icon: Users, 
            gradient: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-500/20',
            glowColor: 'shadow-blue-500/20'
          },
          { 
            title: 'Premium Stores', 
            value: formatNumber(stats.totalStores), 
            subtitle: `${stats.topRatedStores} top-rated`, 
            icon: Store, 
            gradient: 'from-emerald-500 to-emerald-600',
            iconBg: 'bg-emerald-500/20',
            glowColor: 'shadow-emerald-500/20'
          },
          { 
            title: 'Total Reviews', 
            value: formatNumber(stats.totalRatings), 
            subtitle: `${stats.averageRating}/5 avg rating`, 
            icon: Star, 
            gradient: 'from-amber-500 to-amber-600',
            iconBg: 'bg-amber-500/20',
            glowColor: 'shadow-amber-500/20'
          },
          { 
            title: 'Platform Revenue', 
            value: formatCurrency(stats.totalRevenue), 
            subtitle: 'Premium tier active', 
            icon: DollarSign, 
            gradient: 'from-purple-500 to-purple-600',
            iconBg: 'bg-purple-500/20',
            glowColor: 'shadow-purple-500/20'
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`luxury-card p-8 hover:shadow-2xl ${stat.glowColor} transition-all duration-500 group relative overflow-hidden`}
          >
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 font-medium">{stat.subtitle}</p>
                </div>
                <div className={`p-4 ${stat.iconBg} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="w-full bg-dark-700/50 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                ></motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Executive Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Elite User Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="luxury-card p-8 group"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Elite User Roles</h3>
              <p className="text-gray-400">Premium membership distribution</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={stats.userRoleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ role, percent }) => `${role} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="count"
                stroke="none"
              >
                {stats.userRoleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151', 
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Premium Rating Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="luxury-card p-8 group"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Quality Ratings</h3>
              <p className="text-gray-400">Excellence distribution metrics</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-2xl">
              <Star className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stats.ratingDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="rating" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151', 
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {stats.ratingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={LUXURY_COLORS.primary[index % LUXURY_COLORS.primary.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Revenue & Growth Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="luxury-card p-8 group"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">Enterprise Growth Analytics</h3>
            <p className="text-gray-400 text-lg">Premium platform performance & revenue trends</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-emerald-500/20 rounded-2xl">
              <TrendingUp className="h-10 w-10 text-emerald-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-400">+{stats.growthRate}%</p>
              <p className="text-gray-400 text-sm">YoY Growth</p>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={stats.monthlyGrowth} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 14 }}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151', 
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Legend />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="revenue" 
              fill="url(#revenueGradient)"
              stroke="#F59E0B"
              strokeWidth={3}
              fillOpacity={0.3}
            />
            <Bar yAxisId="right" dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="stores" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="ratings" 
              stroke="#EF4444" 
              strokeWidth={4}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Elite Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performing Stores */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="lg:col-span-2 luxury-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Elite Performance Leaderboard</h3>
              <p className="text-gray-400">Top-tier premium establishments</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-2xl">
              <Award className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="space-y-4">
            {stats.topPerformingStores.map((store, index) => (
              <motion.div
                key={store.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-dark-700/30 rounded-2xl border border-gray-600/30 hover:border-purple-500/40 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-bold text-lg ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold group-hover:text-purple-300 transition-colors">{store.name}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 font-medium">{store.rating}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{store.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-lg">{formatCurrency(store.revenue)}</p>
                  <p className="text-gray-400 text-sm">Revenue</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Revenue by Category */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="luxury-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Revenue Streams</h3>
              <p className="text-gray-400 text-sm">Category performance</p>
            </div>
            <DollarSign className="h-6 w-6 text-emerald-400" />
          </div>
          <div className="space-y-4">
            {stats.revenueByCategory.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium text-sm">{category.category}</span>
                  <div className="text-right">
                    <span className="text-white font-bold">{formatCurrency(category.revenue)}</span>
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                      category.growth > 25 ? 'bg-emerald-500/20 text-emerald-400' :
                      category.growth > 15 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      +{category.growth}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-dark-700/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (category.revenue / stats.revenueByCategory[0].revenue) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Geographic Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="luxury-card p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">Geographic Excellence Map</h3>
            <p className="text-gray-400 text-lg">Premium market penetration analytics</p>
          </div>
          <div className="p-4 bg-cyan-500/20 rounded-2xl">
            <Globe className="h-10 w-10 text-cyan-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.geographicDistribution.map((region, index) => (
            <motion.div
              key={region.region}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-dark-700/40 p-6 rounded-2xl border border-gray-600/30 hover:border-cyan-500/40 transition-all duration-300 group text-center"
            >
              <div className="mb-4">
                <h4 className="text-white font-bold text-lg mb-1 group-hover:text-cyan-300 transition-colors">{region.region}</h4>
                <div className="w-full bg-dark-600/50 rounded-full h-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (region.users / stats.geographicDistribution[0].users) * 100)}%` }}
                    transition={{ duration: 1, delay: 1 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                  ></motion.div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Users</span>
                  <span className="text-cyan-400 font-bold">{region.users}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Stores</span>
                  <span className="text-emerald-400 font-bold">{region.stores}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SystemAdminDashboard;
