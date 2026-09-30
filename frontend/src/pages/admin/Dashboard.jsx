import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TagIcon,
  ArchiveBoxIcon,
  StarIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const StatCard = ({ title, value, icon: Icon, change, changeType, color }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 text-sm ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'increase' ? (
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            )}
            {change}% from last month
          </div>
        )}
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Fetch dashboard statistics
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: { stats: null } })),
        api.get('/admin/orders?limit=5').catch(() => ({ data: { orders: [] } })),
      ]);
      
      const statsData = statsRes.data?.data || statsRes.data;
      setStats(statsData?.stats || {
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        totalCategories: 0,
      });
      const ordersData = ordersRes.data?.data || ordersRes.data;
      setRecentOrders(ordersData?.orders || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={CubeIcon}
          change={12}
          changeType="increase"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingCartIcon}
          change={8}
          changeType="increase"
          color="bg-green-500"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={UsersIcon}
          change={5}
          changeType="increase"
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`}
          icon={CurrencyRupeeIcon}
          change={15}
          changeType="increase"
          color="bg-yellow-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Link
          to="/admin/products"
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow group text-center"
        >
          <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors inline-flex mb-2">
            <CubeIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">Products</h3>
          <p className="text-xs text-gray-500">Add, edit, delete</p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow group text-center"
        >
          <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors inline-flex mb-2">
            <ShoppingCartIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">Orders</h3>
          <p className="text-xs text-gray-500">View & update</p>
        </Link>

        <Link
          to="/admin/inventory"
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow group text-center"
        >
          <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors inline-flex mb-2">
            <ArchiveBoxIcon className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">Inventory</h3>
          <p className="text-xs text-gray-500">Stock levels</p>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow group text-center"
        >
          <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors inline-flex mb-2">
            <TagIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">Categories</h3>
          <p className="text-xs text-gray-500">Organize</p>
        </Link>

        <Link
          to="/admin/reviews"
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow group text-center"
        >
          <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-yellow-200 transition-colors inline-flex mb-2">
            <StarIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">Reviews</h3>
          <p className="text-xs text-gray-500">Moderate</p>
        </Link>

        <Link
          to="/admin/messages"
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow group text-center"
        >
          <div className="p-3 bg-teal-100 rounded-xl group-hover:bg-teal-200 transition-colors inline-flex mb-2">
            <EnvelopeIcon className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">Messages</h3>
          <p className="text-xs text-gray-500">Contact msgs</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-primary-600 text-sm hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.orderNumber || order.id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ''}` : order.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{parseFloat(order.totalAmount || order.total || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
