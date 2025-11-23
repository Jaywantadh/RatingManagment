import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Users, Crown, Store, TrendingUp, UserPlus,
  Activity, Calendar, BarChart3, Sparkles
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { usersApi } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { LuxuryChart, LUXURY_CHART_COLORS, LUXURY_CHART_CONFIG } from '../analytics/LuxuryChart';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  growthRate: number;
  userGrowthTrend: { month: string; users: number; newUsers: number }[];
  roleDistribution: { role: string; count: number; percentage: number; color: string }[];
  activityData: { day: string; activeUsers: number; registrations: number }[];
  monthlyStats: { month: string; total: number; normal: number; owners: number; admins: number }[];
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(true);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getUsers(currentPage, 10, searchTerm);
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.total / 10));

      // Generate analytics data
      generateAnalytics(response.data.users, response.data.total);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const generateAnalytics = (userData: User[], total: number) => {
    // Calculate role distribution
    const roleCount = userData.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const roleDistribution = [
      { role: 'Premium Users', count: roleCount.NORMAL_USER || 0, percentage: 0, color: LUXURY_CHART_COLORS.primary[0] },
      { role: 'Elite Owners', count: roleCount.STORE_OWNER || 0, percentage: 0, color: LUXURY_CHART_COLORS.secondary[1] },
      { role: 'System Admins', count: roleCount.SYSTEM_ADMIN || 0, percentage: 0, color: LUXURY_CHART_COLORS.luxury[1] }
    ].map(item => ({
      ...item,
      percentage: total > 0 ? (item.count / total) * 100 : 0
    }));

    setAnalytics({
      totalUsers: total,
      activeUsers: Math.floor(total * 0.75), // 75% active
      newUsersThisMonth: Math.floor(total * 0.12), // 12% new this month
      growthRate: 15.3,
      roleDistribution,
      userGrowthTrend: [
        { month: 'Jan', users: 120, newUsers: 15 },
        { month: 'Feb', users: 142, newUsers: 22 },
        { month: 'Mar', users: 165, newUsers: 23 },
        { month: 'Apr', users: 189, newUsers: 24 },
        { month: 'May', users: 218, newUsers: 29 },
        { month: 'Jun', users: 245, newUsers: 27 },
      ],
      activityData: [
        { day: 'Mon', activeUsers: 78, registrations: 5 },
        { day: 'Tue', activeUsers: 85, registrations: 8 },
        { day: 'Wed', activeUsers: 92, registrations: 6 },
        { day: 'Thu', activeUsers: 88, registrations: 7 },
        { day: 'Fri', activeUsers: 95, registrations: 12 },
        { day: 'Sat', activeUsers: 65, registrations: 4 },
        { day: 'Sun', activeUsers: 58, registrations: 3 },
      ],
      monthlyStats: [
        { month: 'Jan', total: 120, normal: 95, owners: 20, admins: 5 },
        { month: 'Feb', total: 142, normal: 112, owners: 25, admins: 5 },
        { month: 'Mar', total: 165, normal: 130, owners: 30, admins: 5 },
        { month: 'Apr', total: 189, normal: 149, owners: 35, admins: 5 },
        { month: 'May', total: 218, normal: 172, owners: 41, admins: 5 },
        { month: 'Jun', total: 245, normal: 194, owners: 46, admins: 5 },
      ]
    });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return <Crown className="h-4 w-4 text-luxury-400" />;
      case 'STORE_OWNER':
        return <Store className="h-4 w-4 text-secondary-400" />;
      default:
        return <Users className="h-4 w-4 text-primary-400" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const configs = {
      SYSTEM_ADMIN: {
        bg: 'bg-gradient-to-r from-luxury-500/20 to-luxury-600/20',
        text: 'text-luxury-300',
        border: 'border-luxury-400/30',
        glow: 'shadow-luxury-500/20'
      },
      STORE_OWNER: {
        bg: 'bg-gradient-to-r from-secondary-500/20 to-secondary-600/20',
        text: 'text-secondary-300',
        border: 'border-secondary-400/30',
        glow: 'shadow-secondary-500/20'
      },
      NORMAL_USER: {
        bg: 'bg-gradient-to-r from-primary-500/20 to-primary-600/20',
        text: 'text-primary-300',
        border: 'border-primary-400/30',
        glow: 'shadow-primary-500/20'
      }
    };

    const config = configs[role as keyof typeof configs] || configs.NORMAL_USER;

    return (
      <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.text} ${config.border} ${config.glow} border backdrop-blur-sm`}>
        {getRoleIcon(role)}
        <span>{role.replace('_', ' ')}</span>
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Luxury Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 via-luxury-400 to-secondary-600 rounded-2xl shadow-glow">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold luxury-gradient-text">Elite User Management</h2>
            <p className="text-gray-300 font-medium">Premium member administration & analytics</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-secondary-500/20 to-secondary-600/20 text-secondary-300 rounded-xl hover:from-secondary-500/30 hover:to-secondary-600/30 transition-all duration-300 border border-secondary-400/30"
        >
          <BarChart3 className="h-5 w-5" />
          <span className="font-semibold">{showAnalytics ? 'Hide' : 'Show'} Analytics</span>
        </motion.button>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && analytics && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Analytics Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Elite Users',
                value: analytics.totalUsers.toLocaleString(),
                subtitle: 'Premium members',
                icon: Users,
                gradient: 'from-blue-500 to-blue-600',
                iconBg: 'bg-blue-500/20',
                glowColor: 'shadow-blue-500/20'
              },
              {
                title: 'Active Members',
                value: analytics.activeUsers.toLocaleString(),
                subtitle: `${Math.round((analytics.activeUsers / analytics.totalUsers) * 100)}% engagement`,
                icon: Activity,
                gradient: 'from-emerald-500 to-emerald-600',
                iconBg: 'bg-emerald-500/20',
                glowColor: 'shadow-emerald-500/20'
              },
              {
                title: 'New This Month',
                value: analytics.newUsersThisMonth.toLocaleString(),
                subtitle: `+${analytics.growthRate}% growth`,
                icon: UserPlus,
                gradient: 'from-purple-500 to-purple-600',
                iconBg: 'bg-purple-500/20',
                glowColor: 'shadow-purple-500/20'
              },
              {
                title: 'Growth Rate',
                value: `+${analytics.growthRate}%`,
                subtitle: 'Monthly increase',
                icon: TrendingUp,
                gradient: 'from-amber-500 to-amber-600',
                iconBg: 'bg-amber-500/20',
                glowColor: 'shadow-amber-500/20'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`luxury-card p-6 hover:shadow-2xl ${stat.glowColor} transition-all duration-500 group relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                      <p className="text-sm text-gray-500 font-medium">{stat.subtitle}</p>
                    </div>
                    <div className={`p-3 ${stat.iconBg} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Role Distribution */}
            <LuxuryChart title="Elite Role Distribution" icon={Crown} height={300}>
              <PieChart>
                <Pie
                  data={analytics.roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {analytics.roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...LUXURY_CHART_CONFIG.tooltip} />
              </PieChart>
            </LuxuryChart>

            {/* User Growth Trend */}
            <LuxuryChart title="Premium Growth Analytics" icon={TrendingUp} height={300}>
              <AreaChart data={analytics.userGrowthTrend}>
                <CartesianGrid {...LUXURY_CHART_CONFIG.cartesianGrid} />
                <XAxis dataKey="month" {...LUXURY_CHART_CONFIG.axis} />
                <YAxis {...LUXURY_CHART_CONFIG.axis} />
                <Tooltip {...LUXURY_CHART_CONFIG.tooltip} />
                <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={3} />
                <Area type="monotone" dataKey="newUsers" stroke="#10B981" fill="#10B981" fillOpacity={0.3} strokeWidth={3} />
              </AreaChart>
            </LuxuryChart>
          </div>

          {/* Activity Analytics */}
          <LuxuryChart title="Elite Member Activity" icon={Activity} height={300}>
            <AreaChart data={analytics.activityData}>
              <CartesianGrid {...LUXURY_CHART_CONFIG.cartesianGrid} />
              <XAxis dataKey="day" {...LUXURY_CHART_CONFIG.axis} />
              <YAxis {...LUXURY_CHART_CONFIG.axis} />
              <Tooltip {...LUXURY_CHART_CONFIG.tooltip} />
              <Area type="monotone" dataKey="activeUsers" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={3} name="Active Users" />
              <Area type="monotone" dataKey="registrations" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} strokeWidth={3} name="New Registrations" />
            </AreaChart>
          </LuxuryChart>
        </motion.div>
      )}

      {/* Luxury Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="luxury-card p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-secondary-500/20 to-secondary-600/20 rounded-xl">
            <Search className="h-5 w-5 text-secondary-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-200">Elite Member Search</h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Premium Search */}
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-secondary-400 transition-colors" />
              <input
                type="text"
                placeholder="Search elite members by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="elite-input pl-12 pr-4 h-12"
              />
            </div>
          </div>

          {/* Luxury Role Filter */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-luxury-500/20 to-luxury-600/20 rounded-xl">
              <Filter className="h-5 w-5 text-luxury-400" />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="elite-input px-4 py-3 min-w-[160px]"
            >
              <option value="all">All Elite Roles</option>
              <option value="SYSTEM_ADMIN">Crown Admins</option>
              <option value="STORE_OWNER">Elite Owners</option>
              <option value="NORMAL_USER">Premium Users</option>
            </select>
          </div>

          {/* Premium Search Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="premium-button px-6 py-3 text-sm font-bold"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Elite
          </motion.button>
        </div>
      </motion.div>

      {/* Elite Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="luxury-card overflow-hidden"
      >
        <div className="p-6 border-b border-gray-600/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-xl">
              <Users className="h-5 w-5 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-200">Elite Member Directory</h3>
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-luxury-500/20 to-luxury-600/20 rounded-full border border-luxury-400/30">
              <Sparkles className="h-4 w-4 text-luxury-400" />
              <span className="text-sm font-bold text-luxury-300">{filteredUsers.length} Members</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-dark-800/50 to-dark-700/50 border-b border-gray-600/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Elite Member
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Premium Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Member Since
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600/20">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.1)' }}
                  className="hover:bg-dark-700/20 transition-all duration-300 group"
                >
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500/20 via-luxury-400/20 to-secondary-600/20 flex items-center justify-center border border-primary-400/30 group-hover:scale-110 transition-transform duration-300">
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-dark-800"></div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-100 group-hover:text-primary-300 transition-colors">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                          ID: #{user.id.toString().padStart(6, '0')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-200">{user.email}</div>
                    <div className="text-xs text-gray-500">Premium Contact</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300 font-medium">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-gray-300 font-medium">
                        {new Date(user.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Luxury Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-600/30 bg-gradient-to-r from-dark-800/30 to-dark-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-300 font-medium">
                  <span className="text-primary-400 font-bold">{currentPage}</span> of{' '}
                  <span className="text-primary-400 font-bold">{totalPages}</span> pages
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="text-xs text-gray-500">
                  Elite Member Directory
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gradient-to-r from-secondary-500/20 to-secondary-600/20 text-secondary-300 rounded-xl hover:from-secondary-500/30 hover:to-secondary-600/30 transition-all duration-300 border border-secondary-400/30 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Previous
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-300 rounded-xl hover:from-primary-500/30 hover:to-primary-600/30 transition-all duration-300 border border-primary-400/30 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Next
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="luxury-card p-16 text-center relative overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-secondary-500/5 rounded-full blur-xl animate-float"></div>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <Users className="h-12 w-12 text-gray-300" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-gray-200 mb-4">No Elite Members Found</h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
                Adjust your search criteria or filters to discover premium members in our elite directory
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 flex items-center justify-center space-x-4"
            >
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-luxury-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
