import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star, Search, MapPin, Plus, Edit3, LogOut, Lock,
  RefreshCw, Store, Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storesApi, ratingsApi } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useConfirmation } from '../components/common/ConfirmationDialog';
import toast from 'react-hot-toast';

interface StoreData {
  id: number;
  name: string;
  address: string;
  owner_name: string;
  average_rating: number;
  total_ratings: number;
  user_rating?: {
    id: number;
    rating_value: string;
    comment: string;
  };
}

interface RatingModalProps {
  store: StoreData;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: string, comment: string) => void;
  loading: boolean;
}

const RatingModal: React.FC<RatingModalProps> = ({
  store, isOpen, onClose, onSubmit, loading
}) => {
  const [rating, setRating] = useState(store.user_rating?.rating_value || '5');
  const [comment, setComment] = useState(store.user_rating?.comment || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-strong p-6 max-w-md w-full"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {store.user_rating ? 'Update Rating' : 'Rate Store'}
        </h3>
        <p className="text-gray-600 mb-4">{store.name}</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5 stars)
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star.toString())}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 ${parseInt(rating) >= star
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Share your experience..."
              maxLength={500}
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : (store.user_rating ? 'Update' : 'Submit')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const NormalUserDashboard: React.FC = () => {
  const { user, logout, updatePassword } = useAuth();
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const { showConfirmation, ConfirmationComponent } = useConfirmation();

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      console.log('Fetching stores...');

      // First try to get stores
      let storesData = [];
      try {
        const storesResponse = await storesApi.getStores(1, 50, searchTerm);
        console.log('Stores API response:', storesResponse);
        storesData = storesResponse.data?.stores || [];
      } catch (storesError) {
        console.error('Error fetching stores:', storesError);
        toast.error('Stores not loaded - API error');
        setStores([]);
        return;
      }

      // Then try to get user ratings
      let userRatings: any[] = [];
      try {
        const ratingsResponse = await ratingsApi.getMyRatings();
        userRatings = ratingsResponse.data?.ratings || [];
      } catch (ratingsError) {
        console.warn('Could not load user ratings:', ratingsError);
        // Continue without user ratings
      }

      const storesWithRatings = storesData.map((store: any) => {
        const userRating = userRatings.find((r: any) => r.store_id === store.id);
        return {
          id: store.id,
          name: store.name || 'Unknown Store',
          address: store.address || 'No address',
          owner_name: store.owner?.name || 'Unknown Owner',
          average_rating: store.average_rating || 0,
          total_ratings: store.total_ratings || 0,
          user_rating: userRating
        };
      });

      console.log('Processed stores:', storesWithRatings);
      setStores(storesWithRatings);
    } catch (error) {
      console.error('General error fetching stores:', error);
      toast.error('Failed to load stores');
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRateStore = (store: StoreData) => {
    setSelectedStore(store);
    setRatingModalOpen(true);
  };

  const handleRatingSubmit = async (rating: string, comment: string) => {
    if (!selectedStore) return;

    try {
      setRatingLoading(true);

      if (selectedStore.user_rating) {
        // Update existing rating
        await ratingsApi.updateRating(selectedStore.user_rating.id, {
          rating_value: rating,
          comment: comment
        });
        toast.success('Rating updated successfully!');
      } else {
        // Create new rating
        await ratingsApi.createRating({
          store_id: selectedStore.id,
          rating_value: rating,
          comment: comment
        });
        toast.success('Rating submitted successfully!');
      }

      setRatingModalOpen(false);
      fetchStores(); // Refresh stores
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save rating');
    } finally {
      setRatingLoading(false);
    }
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

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-luxury relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary-500/5 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary-400/5 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-luxury-500/5 rounded-full blur-lg animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
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
                <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl shadow-glow-blue">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-luxury-400 to-luxury-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold luxury-gradient-text">RateIN Explorer</h1>
                <p className="text-gray-300 font-medium">Premium Store Discovery Platform</p>
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
                <p className="text-xs text-secondary-400 font-medium">Explorer Member</p>
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
                    message: 'Are you sure you want to logout from your premium account? You will need to login again to access elite features.',
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
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="luxury-card p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-200 mb-2">Discover Premium Stores</h2>
              <p className="text-gray-400">Explore and rate exceptional businesses</p>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-secondary-400 transition-colors" />
              <input
                type="text"
                placeholder="Search premium stores by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="elite-input pl-14 pr-16 h-16 text-lg"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchStores}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl hover:shadow-glow-blue transition-all duration-300"
              >
                <RefreshCw className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
              className="luxury-card p-6 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Background Glow Effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-100 line-clamp-2 group-hover:text-primary-300 transition-colors">{store.name}</h3>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-amber-400/20 rounded-full border border-amber-400/30">
                    <Star className="h-4 w-4 text-amber-400 fill-current" />
                    <span className="text-sm font-bold text-amber-300">
                      {store.average_rating ? store.average_rating.toFixed(1) : 'New'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 mb-6">
                  <div className="p-1 bg-gradient-to-r from-secondary-500/20 to-secondary-400/20 rounded-lg">
                    <MapPin className="h-4 w-4 text-secondary-400" />
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">{store.address}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"></div>
                    <span className="text-xs text-gray-400 font-medium">
                      {store.total_ratings} review{store.total_ratings !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {store.user_rating ? (
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-amber-500/20 to-amber-400/20 rounded-full">
                        <Star className="h-3 w-3 text-amber-400 fill-current" />
                        <span className="text-xs font-bold text-amber-300">
                          {store.user_rating.rating_value}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRateStore(store)}
                        className="flex items-center space-x-1 px-3 py-1 text-xs bg-gradient-to-r from-primary-500/20 to-primary-400/20 text-primary-300 rounded-full hover:from-primary-500/30 hover:to-primary-400/30 transition-all duration-300 border border-primary-500/30 hover:border-primary-400/50"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Update</span>
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRateStore(store)}
                      className="flex items-center space-x-1 px-3 py-1 text-xs bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 text-emerald-300 rounded-full hover:from-emerald-500/30 hover:to-emerald-400/30 transition-all duration-300 border border-emerald-500/30 hover:border-emerald-400/50"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Rate Now</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {selectedStore && (
        <RatingModal
          store={selectedStore}
          isOpen={ratingModalOpen}
          onClose={() => {
            setRatingModalOpen(false);
            setSelectedStore(null);
          }}
          onSubmit={handleRatingSubmit}
          loading={ratingLoading}
        />
      )}

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
