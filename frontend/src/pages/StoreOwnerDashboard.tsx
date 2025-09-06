import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell
} from 'recharts';
import { 
  Store, Star, TrendingUp, Plus, Edit3, Trash2, LogOut, 
  BarChart3, Award, Crown, Activity, MessageCircle, Lock, MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storesApi } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useConfirmation } from '../components/common/ConfirmationDialog';
import toast from 'react-hot-toast';

interface StoreData {
  id: number;
  name: string;
  address: string;
  average_rating: number;
  total_ratings: number;
  ratings: Rating[];
}

interface Rating {
  id: number;
  rating_value: string;
  comment: string;
  created_at: string;
  user?: {
    name: string;
  };
}

interface StoreAnalytics {
  ratingTrend: { month: string; rating: number; reviews: number }[];
  ratingDistribution: { rating: string; count: number; percentage: number }[];
  monthlyPerformance: { month: string; reviews: number; avgRating: number; revenue: number }[];
  customerInsights: { totalReviews: number; averageRating: number; responseRate: number; sentiment: string };
  topReviewers: { name: string; reviews: number; avgRating: number }[];
}

interface StoreModalProps {
  store?: StoreData | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, address: string) => void;
  loading: boolean;
}

const StoreModal: React.FC<StoreModalProps> = ({ 
  store, isOpen, onClose, onSubmit, loading 
}) => {
  const [name, setName] = useState(store?.name || '');
  const [address, setAddress] = useState(store?.address || '');

  useEffect(() => {
    if (store) {
      setName(store.name);
      setAddress(store.address);
    } else {
      setName('');
      setAddress('');
    }
  }, [store]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 4 || name.trim().length > 60) {
      toast.error('Store name must be 4-60 characters');
      return;
    }
    if (address.trim().length > 400) {
      toast.error('Address cannot exceed 400 characters');
      return;
    }
    onSubmit(name.trim(), address.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="luxury-card p-8 max-w-lg w-full shadow-luxury"
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-premium rounded-xl flex items-center justify-center">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-100">
              {store ? 'Update Store' : 'Launch New Store'}
            </h3>
            <p className="text-gray-400 text-sm">Configure your premium location</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Store Name <span className="text-primary-400">*</span>
              <span className="text-xs text-gray-500 ml-2">(4-60 characters)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="elite-input h-12"
              placeholder="Enter premium store name"
              required
              minLength={4}
              maxLength={60}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Location Address <span className="text-primary-400">*</span>
              <span className="text-xs text-gray-500 ml-2">(max 400 characters)</span>
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              className="elite-input resize-none"
              placeholder="Enter complete store address"
              required
              maxLength={400}
            />
            <div className="mt-1 text-xs text-gray-500 text-right">
              {address.length}/400 characters
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-dark-700/50 text-gray-300 rounded-xl hover:bg-dark-600/50 transition-all duration-300 border border-dark-600 hover:border-gray-500"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(249, 115, 22, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 premium-button py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                store ? 'Update Store' : 'Launch Store'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const StoreOwnerDashboard: React.FC = () => {
  const { user, logout, updatePassword } = useAuth();
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [storeLoading, setStoreLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const { showConfirmation, ConfirmationComponent } = useConfirmation();

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    try {
      setLoading(true);
      const response = await storesApi.getMyStores();
      console.log('Store Owner: Fetched my stores:', response.data);
      
      // The API response should already include ratings data
      // Transform the response to match our interface
      const transformedStores = (response.data.stores || response.data || []).map((store: any) => ({
        id: store.id,
        name: store.name,
        address: store.address,
        ratings: store.ratings || [],
        average_rating: store.average_rating || 0,
        total_ratings: store.total_ratings || 0,
        created_at: store.created_at,
        updated_at: store.updated_at
      }));
      
      setStores(transformedStores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load stores');
      // Set empty stores array on error so UI doesn't break
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = () => {
    setSelectedStore(null);
    setStoreModalOpen(true);
  };

  const handleEditStore = (store: StoreData) => {
    setSelectedStore(store);
    setStoreModalOpen(true);
  };

  const handleStoreSubmit = async (name: string, address: string) => {
    try {
      setStoreLoading(true);
      
      if (selectedStore) {
        // Update existing store
        await storesApi.updateStore(selectedStore.id, { name, address });
        toast.success('Store updated successfully!');
      } else {
        // Create new store
        await storesApi.createStore({ name, address });
        toast.success('Store created successfully!');
      }
      
      setStoreModalOpen(false);
      fetchMyStores();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save store');
    } finally {
      setStoreLoading(false);
    }
  };

  const handleDeleteStore = (storeId: number) => {
    const store = stores.find(s => s.id === storeId);
    showConfirmation({
      title: 'Delete Premium Store',
      message: `Are you sure you want to permanently delete "${store?.name || 'this store'}"? This action cannot be undone and will remove all associated data.`,
      type: 'danger',
      confirmText: 'Yes, Delete Store',
      onConfirm: async () => {
        try {
          await storesApi.deleteStore(storeId);
          toast.success('Store deleted successfully!');
          fetchMyStores();
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to delete store');
          throw error; // Re-throw to prevent dialog from closing on error
        }
      }
    });
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password updated successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    }
  };

  const getTotalStats = () => {
    const totalStores = stores.length;
    const totalRatings = stores.reduce((sum, store) => sum + (store.total_ratings || 0), 0);
    const averageRating = totalRatings > 0 
      ? stores.reduce((sum, store) => sum + ((store.average_rating || 0) * (store.total_ratings || 0)), 0) / totalRatings
      : 0;
    const activeStores = stores.filter(store => (store.total_ratings || 0) > 0).length;
    const highRatedStores = stores.filter(store => (store.average_rating || 0) >= 4.0).length;
    
    return { totalStores, totalRatings, averageRating, activeStores, highRatedStores };
  };

  const getStoreAnalytics = (store: StoreData): StoreAnalytics => {
    // Mock data for demonstration - in real app this would come from backend
    return {
      ratingTrend: [
        { month: 'Jan', rating: 4.2, reviews: 12 },
        { month: 'Feb', rating: 4.4, reviews: 18 },
        { month: 'Mar', rating: 4.1, reviews: 15 },
        { month: 'Apr', rating: 4.6, reviews: 22 },
        { month: 'May', rating: 4.5, reviews: 19 },
        { month: 'Jun', rating: 4.7, reviews: 25 },
      ],
      ratingDistribution: [
        { rating: '5★', count: 45, percentage: 42.3 },
        { rating: '4★', count: 32, percentage: 30.2 },
        { rating: '3★', count: 18, percentage: 17.0 },
        { rating: '2★', count: 8, percentage: 7.5 },
        { rating: '1★', count: 3, percentage: 2.8 },
      ],
      monthlyPerformance: [
        { month: 'Jan', reviews: 12, avgRating: 4.2, revenue: 8500 },
        { month: 'Feb', reviews: 18, avgRating: 4.4, revenue: 12300 },
        { month: 'Mar', reviews: 15, avgRating: 4.1, revenue: 9800 },
        { month: 'Apr', reviews: 22, avgRating: 4.6, revenue: 15600 },
        { month: 'May', reviews: 19, avgRating: 4.5, revenue: 13400 },
        { month: 'Jun', reviews: 25, avgRating: 4.7, revenue: 18200 },
      ],
      customerInsights: {
        totalReviews: store.total_ratings || 0,
        averageRating: store.average_rating || 0,
        responseRate: 85.5,
        sentiment: 'Positive'
      },
      topReviewers: [
        { name: 'Sarah Johnson', reviews: 8, avgRating: 4.8 },
        { name: 'Mike Chen', reviews: 6, avgRating: 4.6 },
        { name: 'Emma Davis', reviews: 5, avgRating: 4.9 },
      ]
    };
  };

  const { totalStores, totalRatings, averageRating, activeStores, highRatedStores } = getTotalStats();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-luxury relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary-500/5 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-luxury-400/5 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-secondary-500/5 rounded-full blur-lg animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 luxury-card border-b border-primary-500/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="relative">
                <div className="p-3 bg-gradient-premium rounded-2xl shadow-glow">
                  <Store className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-luxury-400 to-luxury-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold luxury-gradient-text">RateIN Business</h1>
                <p className="text-gray-300 font-medium">Premium Store Management Suite</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-6"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-200">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
                <p className="text-xs text-primary-400 font-medium">Business Owner</p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPasswordModal(true)}
                  className="p-3 bg-dark-700/50 text-gray-300 hover:text-primary-400 hover:bg-primary-500/10 rounded-xl transition-all duration-300 border border-dark-600 hover:border-primary-500/30"
                  title="Update Password"
                >
                  <Lock className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => showConfirmation({
                    title: 'Confirm Logout',
                    message: 'Are you sure you want to logout from your business dashboard? You will need to login again to manage your stores.',
                    type: 'warning',
                    confirmText: 'Yes, Logout',
                    onConfirm: logout
                  })}
                  className="p-3 bg-dark-700/50 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-dark-600 hover:border-red-500/30"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
        {[
          { 
            title: 'Elite Locations', 
            value: totalStores, 
            icon: Store, 
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-500/20 to-blue-600/10',
            suffix: '',
            description: `${activeStores} active stores`,
            glowColor: 'shadow-blue-500/20'
          },
          { 
            title: 'Premium Reviews', 
            value: totalRatings, 
            icon: MessageCircle, 
            gradient: 'from-emerald-500 to-emerald-600',
            bgGradient: 'from-emerald-500/20 to-emerald-600/10',
            suffix: '',
            description: 'Customer feedback',
            glowColor: 'shadow-emerald-500/20'
          },
          { 
            title: 'Excellence Score', 
            value: averageRating.toFixed(1), 
            icon: Award, 
            gradient: 'from-amber-500 to-amber-600',
            bgGradient: 'from-amber-500/20 to-amber-600/10',
            suffix: '/5',
            description: 'Overall rating',
            glowColor: 'shadow-amber-500/20'
          },
          { 
            title: 'High Performers', 
            value: highRatedStores, 
            icon: Crown, 
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-500/20 to-purple-600/10',
            suffix: '',
            description: '4+ star locations',
            glowColor: 'shadow-purple-500/20'
          }
        ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            className={`luxury-card p-6 hover:shadow-2xl ${stat.glowColor} transition-all duration-500 group cursor-pointer relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">{stat.title}</p>
                  <div className="flex items-end space-x-2">
                    <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </p>
                    <span className="text-lg text-gray-400 font-medium mb-1">{stat.suffix}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-4 bg-gradient-to-br ${stat.bgGradient} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-8 w-8 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Store Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(249, 115, 22, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateStore}
            className="premium-button flex items-center space-x-3 px-8 py-4 text-lg font-bold"
          >
            <Plus className="h-6 w-6" />
            <span>Launch New Store</span>
            <div className="w-2 h-2 bg-luxury-400 rounded-full animate-pulse"></div>
          </motion.button>
        </motion.div>

        {/* Stores List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-8"
        >
          {stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.15, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="luxury-card p-8 group hover:shadow-luxury transition-all duration-500"
            >
              {/* Store Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-gray-100">{store.name}</h3>
                      <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-luxury-400 transition-all duration-500 mt-1"></div>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-luxury-500/20 to-luxury-400/20 rounded-full border border-luxury-400/30">
                      <Star className="h-5 w-5 text-luxury-400 fill-current" />
                      <span className="font-bold text-luxury-400">
                        {(store.average_rating || 0).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({store.total_ratings || 0} review{(store.total_ratings || 0) !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-lg flex items-center"><span className="w-2 h-2 bg-primary-400 rounded-full mr-2"></span>{store.address}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditStore(store)}
                    className="p-3 bg-dark-700/50 text-gray-300 hover:text-primary-400 hover:bg-primary-500/10 rounded-xl transition-all duration-300 border border-dark-600 hover:border-primary-500/30"
                    title="Edit Store"
                  >
                    <Edit3 className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteStore(store.id)}
                    className="p-3 bg-dark-700/50 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-dark-600 hover:border-red-500/30"
                    title="Delete Store"
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Store Analytics Dashboard */}
              {store.ratings && store.ratings.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-2xl font-bold text-gray-200 mb-8 flex items-center">
                    <BarChart3 className="h-6 w-6 text-primary-400 mr-3" />
                    Performance Analytics
                  </h4>
                  
                  {/* Analytics Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Rating Trend Chart */}
                    <div className="bg-dark-800/40 p-6 rounded-2xl border border-gray-600/30">
                      <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 text-emerald-400 mr-2" />
                        Rating Trend
                      </h5>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={getStoreAnalytics(store).ratingTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={[0, 5]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151', 
                              borderRadius: '12px',
                              color: '#fff'
                            }} 
                          />
                          <Area type="monotone" dataKey="rating" stroke="#10B981" fill="#10B981" fillOpacity={0.3} strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Rating Distribution */}
                    <div className="bg-dark-800/40 p-6 rounded-2xl border border-gray-600/30">
                      <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Star className="h-5 w-5 text-amber-400 mr-2" />
                        Rating Distribution
                      </h5>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={getStoreAnalytics(store).ratingDistribution}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151', 
                              borderRadius: '12px',
                              color: '#fff'
                            }} 
                          />
                          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                            {getStoreAnalytics(store).ratingDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#F59E0B' : index === 1 ? '#10B981' : '#6B7280'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="bg-dark-800/40 p-6 rounded-2xl border border-gray-600/30 mb-8">
                    <h5 className="text-lg font-semibold text-white mb-6 flex items-center">
                      <Activity className="h-5 w-5 text-cyan-400 mr-2" />
                      Monthly Performance
                    </h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getStoreAnalytics(store).monthlyPerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151', 
                            borderRadius: '12px',
                            color: '#fff'
                          }} 
                        />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="avgRating" stroke="#F59E0B" strokeWidth={3} name="Avg Rating" />
                        <Line yAxisId="right" type="monotone" dataKey="reviews" stroke="#3B82F6" strokeWidth={3} name="Reviews" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              
              {/* Premium Ratings Section */}
              {store.ratings && store.ratings.length > 0 ? (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-300 mb-6 flex items-center">
                    <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-luxury-400 rounded-full mr-3"></span>
                    Customer Reviews
                  </h4>
                  <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                    {(store.ratings || []).slice(0, 5).map((rating, idx) => (
                      <motion.div
                        key={rating.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-r from-dark-800/60 to-dark-700/60 rounded-xl p-5 border border-primary-500/10 hover:border-primary-500/20 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-luxury-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {(rating.user?.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-200">{rating.user?.name || 'Anonymous User'}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < parseInt(rating.rating_value)
                                          ? 'text-luxury-400 fill-current'
                                          : 'text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-400">{rating.rating_value}/5</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {rating.comment && (
                          <p className="text-gray-300 text-sm leading-relaxed pl-13">
                            "{rating.comment}"
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  {store.ratings && store.ratings.length > 5 && (
                    <div className="text-center mt-6">
                      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500/20 to-luxury-500/20 rounded-full border border-primary-400/30">
                        <span className="text-sm text-gray-300 font-medium">
                          Showing 5 of {store.ratings.length} premium reviews
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 mt-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-300 mb-2">Awaiting First Review</h4>
                  <p className="text-gray-500">This premium location is ready for customer feedback</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {stores.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-dark-700 to-dark-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-luxury">
              <Store className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-200 mb-4">Launch Your First Premium Store</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Transform your business with our premium store management platform. 
              Start building your empire today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(249, 115, 22, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateStore}
              className="premium-button flex items-center space-x-3 px-8 py-4 text-lg font-bold mx-auto"
            >
              <Plus className="h-6 w-6" />
              <span>Launch First Store</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Store Modal */}
      <StoreModal
        store={selectedStore}
        isOpen={storeModalOpen}
        onClose={() => {
          setStoreModalOpen(false);
          setSelectedStore(null);
        }}
        onSubmit={handleStoreSubmit}
        loading={storeLoading}
      />

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-strong p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Password</h3>
            
            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                    minLength={8}
                    maxLength={16}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    8-16 characters, must include uppercase and special character
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      <ConfirmationComponent />
    </div>
  );
};
