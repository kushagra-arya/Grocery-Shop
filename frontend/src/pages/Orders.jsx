import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { getOrders, cancelOrder } from '../services/orderService';
import { getImageUrl } from '../utils';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  PENDING: { 
    color: 'yellow', 
    bgColor: 'bg-yellow-100', 
    textColor: 'text-yellow-700',
    icon: ClockIcon, 
    label: 'Order Placed',
    description: 'We have received your order',
  },
  CONFIRMED: { 
    color: 'blue', 
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-700',
    icon: CheckCircleIcon, 
    label: 'Confirmed',
    description: 'Your order has been confirmed',
  },
  PROCESSING: { 
    color: 'indigo', 
    bgColor: 'bg-indigo-100', 
    textColor: 'text-indigo-700',
    icon: ClockIcon, 
    label: 'Processing',
    description: 'Your order is being prepared',
  },
  SHIPPED: { 
    color: 'purple', 
    bgColor: 'bg-purple-100', 
    textColor: 'text-purple-700',
    icon: TruckIcon, 
    label: 'Shipped',
    description: 'On the way',
  },
  DELIVERED: { 
    color: 'green', 
    bgColor: 'bg-green-100', 
    textColor: 'text-green-700',
    icon: CheckCircleIcon, 
    label: 'Delivered',
    description: 'Delivered successfully',
  },
  CANCELLED: { 
    color: 'red', 
    bgColor: 'bg-red-100', 
    textColor: 'text-red-700',
    icon: XCircleIcon, 
    label: 'Cancelled',
    description: 'Order was cancelled',
  },
};

const TIME_FILTERS = [
  { id: 'all', label: 'All Time' },
  { id: '30', label: 'Last 30 days' },
  { id: '90', label: 'Last 3 months' },
  { id: '180', label: 'Last 6 months' },
  { id: '365', label: 'Last year' },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await getOrders();
      setOrders(response.data || response.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
    
    // Time filter
    if (timeFilter !== 'all') {
      const orderDate = new Date(order.createdAt);
      const daysAgo = parseInt(timeFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      if (orderDate < cutoffDate) return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesOrderNumber = order.orderNumber?.toLowerCase().includes(query);
      const matchesProduct = order.orderItems?.some(item => 
        item.product?.name?.toLowerCase().includes(query)
      );
      if (!matchesOrderNumber && !matchesProduct) return false;
    }
    
    return true;
  });

  const handleCancelOrder = async () => {
    if (!cancellingOrderId) return;
    setIsCancelling(true);
    try {
      await cancelOrder(cancellingOrderId);
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      setCancellingOrderId(null);
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusConfig = (status) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <nav className="flex items-center text-sm text-gray-500 mb-2">
            <Link to="/account" className="hover:text-[#C45500] hover:underline">Your Account</Link>
            <span className="mx-2">›</span>
            <span className="text-[#C45500]">Your Orders</span>
          </nav>
          <h1 className="text-[28px] font-normal text-[#0F1111]">Your Orders</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
            <div className="w-24 h-24 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-6">
              <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-[#0F1111] mb-2">No orders yet</h2>
            <p className="text-[#565959] mb-6 max-w-md mx-auto">
              Looks like you haven't placed any orders. Start shopping to see your orders here!
            </p>
            <Link to="/products">
              <Button className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] border-none">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search all orders"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm"
                  />
                </div>

                {/* Time Filter */}
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm bg-[#F0F2F2]"
                  >
                    {TIME_FILTERS.map(filter => (
                      <option key={filter.id} value={filter.id}>{filter.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => {
                  const config = STATUS_CONFIG[status];
                  const count = status === 'ALL' 
                    ? orders.length 
                    : orders.filter(o => o.status === status).length;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        statusFilter === status
                          ? 'bg-[#232F3E] text-white'
                          : 'bg-[#F0F2F2] text-[#0F1111] hover:bg-[#E3E6E6]'
                      }`}
                    >
                      {status === 'ALL' ? 'All Orders' : config?.label || status}
                      {count > 0 && (
                        <span className="ml-1 text-xs">({count})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                  <FunnelIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-[#565959]">No orders match your filters</p>
                  <button
                    onClick={() => {
                      setStatusFilter('ALL');
                      setTimeFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-4 text-[#007185] hover:text-[#C7511F] hover:underline text-sm"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg shadow-sm border overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="bg-[#F0F2F2] px-4 py-3 border-b flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                        <div>
                          <span className="text-[#565959]">ORDER PLACED</span>
                          <p className="font-medium text-[#0F1111]">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#565959]">TOTAL</span>
                          <p className="font-medium text-[#0F1111]">
                            ₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#565959]">SHIP TO</span>
                          <p className="font-medium text-[#007185]">
                            {order.address?.fullName || 'N/A'}
                          </p>
                        </div>
                        <div className="sm:ml-auto text-right">
                          <span className="text-[#565959]">ORDER # </span>
                          <span className="text-[#007185]">{order.orderNumber}</span>
                          <div className="mt-1">
                            <Link
                              to={`/orders/${order.id}`}
                              className="text-[#007185] hover:text-[#C7511F] hover:underline"
                            >
                              View order details
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Order Body */}
                      <div className="p-4">
                        {/* Status */}
                        <div className="flex items-center mb-4">
                          <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}>
                            <StatusIcon className={`h-4 w-4 mr-1.5 ${statusConfig.textColor}`} />
                            <span className={`text-sm font-medium ${statusConfig.textColor}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          {order.status === 'SHIPPED' && (
                            <span className="ml-3 text-sm text-[#007600]">
                              Arriving soon
                            </span>
                          )}
                          {order.status === 'DELIVERED' && order.updatedAt && (
                            <span className="ml-3 text-sm text-[#565959]">
                              Delivered on {new Date(order.updatedAt).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                          {order.orderItems?.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <Link to={`/products/${item.product?.slug}`}>
                                <img
                                  src={getImageUrl(item.product?.images?.[0]?.imageUrl || item.productImage)}
                                  alt={item.product?.name}
                                  className="w-20 h-20 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                                />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link
                                  to={`/products/${item.product?.slug}`}
                                  className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline line-clamp-2"
                                >
                                  {item.product?.name}
                                </Link>
                                <p className="text-sm text-[#565959] mt-1">
                                  Qty: {item.quantity} × ₹{parseFloat(item.unitPrice).toLocaleString('en-IN')}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Link
                                    to={`/products/${item.product?.slug}`}
                                    className="text-xs px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-50"
                                  >
                                    Buy it again
                                  </Link>
                                  <Link
                                    to={`/products/${item.product?.slug}`}
                                    className="text-xs px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-50"
                                  >
                                    View product
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {order.orderItems?.length > 3 && (
                            <Link
                              to={`/orders/${order.id}`}
                              className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
                            >
                              + {order.orderItems.length - 3} more items
                            </Link>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-4 pt-4 border-t flex flex-wrap gap-3">
                          <Link
                            to={`/orders/${order.id}`}
                            className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-sm font-medium rounded-lg"
                          >
                            Track package
                          </Link>
                          {order.status === 'DELIVERED' && (
                            <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-[#0F1111] text-sm font-medium rounded-lg">
                              Write a review
                            </button>
                          )}
                          {['PENDING', 'CONFIRMED'].includes(order.status) && (
                            <button
                              onClick={() => {
                                setCancellingOrderId(order.id);
                                setShowCancelModal(true);
                              }}
                              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-[#0F1111] text-sm font-medium rounded-lg"
                            >
                              Cancel order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => { setShowCancelModal(false); setCancellingOrderId(null); }}
        title="Cancel Order"
      >
        <div className="p-6">
          <div className="flex items-start mb-4">
            <XCircleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-[#0F1111] font-medium">Are you sure you want to cancel this order?</p>
              <p className="text-sm text-[#565959] mt-1">
                This action cannot be undone. Any payment made will be refunded to your original payment method.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setShowCancelModal(false); setCancellingOrderId(null); }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-[#0F1111] font-medium"
            >
              Keep Order
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
