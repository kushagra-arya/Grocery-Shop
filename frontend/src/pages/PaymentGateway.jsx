import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  CreditCardIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { verifyPayment, getOrder } from '../services/orderService';
import { clearCart } from '../store/slices/cartSlice';
import { getImageUrl } from '../utils';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const PAYMENT_ICONS = {
  CARD: '💳',
  UPI: '📱',
  NETBANKING: '🏦',
  COD: '💵',
};

const MOCK_BANKS = [
  { id: 'sbi', name: 'State Bank of India', logo: '🏛️' },
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
  { id: 'icici', name: 'ICICI Bank', logo: '🏧' },
  { id: 'axis', name: 'Axis Bank', logo: '💰' },
  { id: 'kotak', name: 'Kotak Mahindra', logo: '🏢' },
];

export default function PaymentGateway() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'failed'
  const [countdown, setCountdown] = useState(900); // 15 minutes in seconds

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Get transactionId from location state (passed from Checkout) or URL params (for fallback)
  const transactionId = location.state?.transactionId || searchParams.get('txn');
  const paymentMethod = location.state?.paymentMethod || 'CARD';
  const amount = location.state?.amount || 0;

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !paymentStatus) {
      const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && !paymentStatus) {
      handlePaymentTimeout();
    }
  }, [countdown, paymentStatus]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getOrder(orderId);
      setOrder(response.data.data || response.data);
    } catch (err) {
      toast.error('Failed to load order details');
      navigate('/cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentTimeout = () => {
    setPaymentStatus('failed');
    toast.error('Payment session expired');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const simulatePayment = async (shouldSucceed) => {
    setProcessingPayment(true);
    setPaymentStatus('processing');

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const response = await verifyPayment(orderId, {
        transactionId,
        status: shouldSucceed ? 'SUCCESS' : 'FAILED',
        paymentMethod,
      });

      if (shouldSucceed) {
        setPaymentStatus('success');
        toast.success('Payment successful!');
        dispatch(clearCart());
        
        // Redirect to order confirmation after a short delay
        setTimeout(() => {
          navigate(`/order-confirmation/${order.orderNumber}`, {
            state: { fromPayment: true },
          });
        }, 2000);
      } else {
        setPaymentStatus('failed');
        toast.error('Payment failed');
      }
    } catch (err) {
      setPaymentStatus('failed');
      toast.error(err.response?.data?.message || 'Payment verification failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (paymentMethod === 'CARD') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid card number');
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        toast.error('Please enter card expiry date');
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        toast.error('Please enter CVV');
        return;
      }
    } else if (paymentMethod === 'UPI') {
      if (!upiId || !upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID');
        return;
      }
    } else if (paymentMethod === 'NETBANKING') {
      if (!selectedBank) {
        toast.error('Please select a bank');
        return;
      }
    }

    // Simulate successful payment (90% success rate for demo)
    const shouldSucceed = Math.random() > 0.1;
    simulatePayment(shouldSucceed);
  };

  const handleCODConfirm = () => {
    simulatePayment(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  // Payment Processing Screen
  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#232F3E] to-[#131A22] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-[#FF9900] border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-gray-600 mb-4">Please wait while we process your payment...</p>
          <p className="text-sm text-gray-500">Do not close this window or press back button</p>
        </div>
      </div>
    );
  }

  // Payment Success Screen
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#232F3E] to-[#131A22] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">Transaction ID: {transactionId}</p>
          <p className="text-2xl font-bold text-green-600 mb-6">₹{order?.totalAmount?.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-500">Redirecting to order confirmation...</p>
        </div>
      </div>
    );
  }

  // Payment Failed Screen
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#232F3E] to-[#131A22] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircleIcon className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">
            Your payment could not be processed. Please try again or use a different payment method.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-medium rounded-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="w-full py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#232F3E] to-[#131A22]">
      {/* Header */}
      <div className="bg-[#131A22] border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-8 w-8 text-[#FF9900]" />
              <div>
                <h1 className="text-xl font-bold text-white">Secure Payment</h1>
                <p className="text-sm text-gray-400">256-bit SSL Encryption</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <ClockIcon className="h-5 w-5" />
              <span className={`font-mono ${countdown < 60 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(countdown)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Payment Method Header */}
              <div className="bg-gradient-to-r from-[#232F3E] to-[#37475A] px-6 py-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{PAYMENT_ICONS[paymentMethod]}</span>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {paymentMethod === 'CARD' && 'Credit/Debit Card'}
                      {paymentMethod === 'UPI' && 'UPI Payment'}
                      {paymentMethod === 'NETBANKING' && 'Net Banking'}
                      {paymentMethod === 'COD' && 'Cash on Delivery'}
                    </h2>
                    <p className="text-sm text-gray-300">Order #{order?.orderNumber}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitPayment} className="p-6">
                {/* Card Payment Form */}
                {paymentMethod === 'CARD' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                        />
                        <CreditCardIcon className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        placeholder="JOHN DOE"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          maxLength={4}
                          placeholder="•••"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                        />
                      </div>
                    </div>

                    {/* Test Card Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-blue-800 font-medium mb-1">🔧 Test Card Details</p>
                      <p className="text-xs text-blue-600">
                        Card: 4111 1111 1111 1111 | Expiry: 12/25 | CVV: 123
                      </p>
                    </div>
                  </div>
                )}

                {/* UPI Payment Form */}
                {paymentMethod === 'UPI' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                      />
                    </div>

                    {/* Popular UPI Apps */}
                    <div className="border rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Or pay using UPI Apps</p>
                      <div className="grid grid-cols-4 gap-3">
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                          <button
                            key={app}
                            type="button"
                            className="p-3 border rounded-lg hover:border-[#FF9900] hover:bg-orange-50 transition-colors text-center"
                          >
                            <span className="text-2xl mb-1 block">📱</span>
                            <span className="text-xs text-gray-600">{app}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Test UPI Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800 font-medium mb-1">🔧 Test UPI ID</p>
                      <p className="text-xs text-blue-600">Use: test@upi for testing</p>
                    </div>
                  </div>
                )}

                {/* Net Banking Form */}
                {paymentMethod === 'NETBANKING' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-3">Select your bank</p>
                    <div className="grid grid-cols-1 gap-2">
                      {MOCK_BANKS.map((bank) => (
                        <div
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedBank === bank.id
                              ? 'border-[#FF9900] bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                            selectedBank === bank.id ? 'border-[#FF9900]' : 'border-gray-300'
                          }`}>
                            {selectedBank === bank.id && (
                              <div className="w-3 h-3 rounded-full bg-[#FF9900]" />
                            )}
                          </div>
                          <span className="text-2xl">{bank.logo}</span>
                          <span className="ml-3 font-medium text-gray-900">{bank.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Test Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800 font-medium mb-1">🔧 Test Net Banking</p>
                      <p className="text-xs text-blue-600">Select any bank and click Pay to simulate</p>
                    </div>
                  </div>
                )}

                {/* COD Confirmation */}
                {paymentMethod === 'COD' && (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BanknotesIcon className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Cash on Delivery</h3>
                    <p className="text-gray-600 mb-4">
                      Pay ₹{order?.totalAmount?.toLocaleString('en-IN')} when your order arrives
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-800">
                          Please keep exact change ready. Our delivery partner may not carry change for large amounts.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                {paymentMethod === 'COD' ? (
                  <button
                    type="button"
                    onClick={handleCODConfirm}
                    disabled={processingPayment}
                    className="w-full mt-6 py-4 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                  >
                    Confirm Order
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={processingPayment}
                    className="w-full mt-6 py-4 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                  >
                    Pay ₹{order?.totalAmount?.toLocaleString('en-IN')}
                  </button>
                )}

                {/* Security Note */}
                <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                  <LockClosedIcon className="h-4 w-4 mr-1" />
                  <span>Your payment info is secure and encrypted</span>
                </div>
              </form>
            </div>

            {/* Demo Controls */}
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4">
              <p className="text-sm font-bold text-yellow-800 mb-2">🧪 Demo Payment Controls</p>
              <p className="text-xs text-yellow-700 mb-3">
                For testing purposes, you can simulate success or failure:
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => simulatePayment(true)}
                  disabled={processingPayment}
                  className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded disabled:opacity-50"
                >
                  ✓ Simulate Success
                </button>
                <button
                  onClick={() => simulatePayment(false)}
                  disabled={processingPayment}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded disabled:opacity-50"
                >
                  ✗ Simulate Failure
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b">Order Summary</h3>
              
              {/* Items Preview */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {order?.orderItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={getImageUrl(item.product?.images?.[0]?.imageUrl)}
                      alt={item.product?.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">₹{parseFloat(item.total).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 border-t border-b text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{order?.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{order?.tax?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={order?.shippingCharge === 0 ? 'text-green-600' : ''}>
                    {order?.shippingCharge === 0 ? 'FREE' : `₹${order?.shippingCharge}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-xl font-bold text-[#B12704]">
                  ₹{order?.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Transaction ID */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Transaction ID: <span className="font-mono">{transactionId}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
