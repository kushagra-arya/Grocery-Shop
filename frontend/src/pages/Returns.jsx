import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ArrowPathIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { getOrders } from '../services/orderService';
import { getImageUrl } from '../utils';
import Loader from '../components/common/Loader';

const returnableItems = [
  'Packaged food items in original sealed condition',
  'Household products in original packaging',
  'Personal care products (unopened)',
  'Dairy products (if delivered in poor condition)',
  'Fruits & vegetables (if quality issues reported within 24 hours)'
];

const nonReturnableItems = [
  'Perishable items once opened or used',
  'Items damaged due to mishandling after delivery',
  'Products with tampered packaging',
  'Items returned after the return window',
  'Gift cards and promotional items'
];

const returnSteps = [
  {
    step: 1,
    title: 'Report the Issue',
    description: 'Go to "My Orders" and select the item you want to return. Choose the reason for return.'
  },
  {
    step: 2,
    title: 'Schedule Pickup',
    description: 'Select a convenient time slot for our delivery partner to pick up the item from your address.'
  },
  {
    step: 3,
    title: 'Pack the Item',
    description: 'Keep the item in its original packaging. Our delivery partner will verify and collect it.'
  },
  {
    step: 4,
    title: 'Get Refund',
    description: 'Once we receive the item, your refund will be processed within 3-5 business days.'
  }
];

export default function Returns() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await getOrders();
      const allOrders = response.data || response.orders || [];
      setOrders(allOrders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' },
      PROCESSING: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Processing' },
      SHIPPED: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Shipped' },
      DELIVERED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
    };
    const c = config[status] || config.PENDING;
    return (
      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ArrowPathIcon className="h-16 w-16 mx-auto mb-6 text-amazon-orange" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns & Refunds</h1>
          <p className="text-xl text-gray-300">
            Easy returns, no questions asked
          </p>
        </div>
      </div>

      {/* Return Window */}
      <div className="max-w-6xl mx-auto px-4 -mt-4 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <ClockIcon className="h-12 w-12 text-amazon-orange mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">24 Hours</h3>
              <p className="text-gray-600">Return window for perishables</p>
            </div>
            <div>
              <TruckIcon className="h-12 w-12 text-amazon-orange mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">Free Pickup</h3>
              <p className="text-gray-600">We'll collect from your doorstep</p>
            </div>
            <div>
              <ArrowPathIcon className="h-12 w-12 text-amazon-orange mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">3-5 Days</h3>
              <p className="text-gray-600">Refund processing time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Orders Section */}
      {user && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
            <Link
              to="/orders"
              className="text-sm font-medium text-amazon-orange hover:underline flex items-center gap-1"
            >
              View All Orders <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader size="medium" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders yet</p>
              <Link
                to="/products"
                className="inline-block mt-4 bg-amazon-orange text-white px-6 py-2 rounded-lg font-medium hover:bg-amazon-orange-dark transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Order header */}
                  <div className="bg-gray-50 px-6 py-3 flex flex-wrap items-center justify-between gap-4 border-b">
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div>
                        <span className="text-gray-500 uppercase text-xs">Order Placed</span>
                        <p className="text-gray-900 font-medium">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase text-xs">Total</span>
                        <p className="text-gray-900 font-medium">
                          ₹{parseFloat(order.totalAmount || order.total || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase text-xs">Order #</span>
                        <p className="text-gray-900 font-medium">{order.orderNumber || order.id?.slice(-8)}</p>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Order items */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {(order.orderItems || order.items)?.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img
                            src={getImageUrl(item.product?.images?.[0]?.imageUrl || item.product?.images?.[0]?.url)}
                            alt={item.product?.name}
                            className="w-14 h-14 rounded-lg object-cover border"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.product?.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            ₹{parseFloat(item.unitPrice || item.price || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                      {(order.orderItems || order.items)?.length > 3 && (
                        <p className="text-sm text-gray-500">
                          + {(order.orderItems || order.items).length - 3} more item(s)
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap gap-3 border-t pt-4">
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-sm font-medium text-amazon-orange hover:underline"
                      >
                        View Order Details
                      </Link>
                      {order.status === 'DELIVERED' && (
                        <span className="text-sm font-medium text-green-600">
                          ✓ Eligible for Return
                        </span>
                      )}
                      {order.status === 'CANCELLED' && (
                        <span className="text-sm text-gray-400">
                          Order Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Return Process */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How to Return an Item</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amazon-orange/20"></div>
          
          <div className="space-y-8">
            {returnSteps.map((item, index) => (
              <div key={item.step} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`bg-white p-6 rounded-xl shadow-lg ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} max-w-sm`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-amazon-orange rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                  {item.step}
                </div>
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Returnable vs Non-returnable */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Returnable */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                <h3 className="text-xl font-bold text-gray-900">Returnable Items</h3>
              </div>
              <ul className="space-y-3">
                {returnableItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Non-returnable */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircleIcon className="h-8 w-8 text-red-500" />
                <h3 className="text-xl font-bold text-gray-900">Non-Returnable Items</h3>
              </div>
              <ul className="space-y-3">
                {nonReturnableItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Policy */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Refund Policy</h2>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-amazon-navy text-white">
              <tr>
                <th className="px-6 py-4 text-left">Payment Method</th>
                <th className="px-6 py-4 text-left">Refund Time</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-6 py-4">UPI (Google Pay, PhonePe, Paytm)</td>
                <td className="px-6 py-4">1-3 business days</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4">Credit Card</td>
                <td className="px-6 py-4">5-7 business days</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Debit Card</td>
                <td className="px-6 py-4">5-7 business days</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4">Net Banking</td>
                <td className="px-6 py-4">3-5 business days</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Cash on Delivery</td>
                <td className="px-6 py-4">NEFT to bank account (7-10 business days)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Note */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-amazon-orange/10 border border-amazon-orange/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-amazon-orange flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Important Note</h3>
              <p className="text-gray-600">
                For perishable items (fruits, vegetables, dairy, meat), please inspect 
                the products at the time of delivery. Any quality issues must be reported 
                immediately to the delivery partner or within 24 hours through the app.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-amazon-navy text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help with a Return?</h3>
          <p className="text-gray-300 mb-4">Our support team is here to assist you.</p>
          <Link 
            to="/contact" 
            className="inline-block bg-amazon-orange text-white px-8 py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
