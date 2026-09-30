import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  MapPinIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  PlusIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { getCart, clearCart } from '../store/slices/cartSlice';
import { getAddresses, createAddress } from '../services/addressService';
import { createOrder, initiatePayment } from '../services/orderService';
import { getImageUrl } from '../utils';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'COD', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive your order' },
  { id: 'CARD', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
  { id: 'UPI', name: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, Paytm' },
  { id: 'NETBANKING', name: 'Net Banking', icon: '🏦', description: 'All major banks supported' },
];

// Indian states list for dropdown
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isGift = location.state?.isGift || false;
  const { items, subtotal: total, itemCount, isLoading: cartLoading } = useSelector((state) => state.cart);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    dispatch(getCart());
    loadAddresses();
  }, [dispatch]);

  const loadAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const response = await getAddresses();
      const addressList = Array.isArray(response.data) ? response.data : response.data.addresses || [];
      setAddresses(addressList);
      
      // Auto-select default address
      const defaultAddress = addressList?.find(a => a.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (addressList?.length > 0) {
        setSelectedAddressId(addressList[0].id);
      }
    } catch (err) {
      toast.error('Failed to load addresses');
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleAddAddress = async (data) => {
    try {
      const response = await createAddress(data);
      const newAddress = response.data;
      setAddresses([...addresses, newAddress]);
      setSelectedAddressId(newAddress.id);
      setShowAddressModal(false);
      reset();
      toast.success('Address added successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add address');
    }
  };

  // New: Handle order placement and redirect to payment gateway
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      setStep(1);
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Step 1: Create the order (reserves stock)
      const orderData = {
        addressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod,
      };

      const orderResponse = await createOrder(orderData);
      const order = orderResponse.data;

      // Step 2: Initiate payment session
      const paymentResponse = await initiatePayment(order.id, selectedPaymentMethod);
      const paymentData = paymentResponse.data;

      // Redirect to payment gateway (cart will be cleared after successful payment)
      toast.success('Redirecting to payment gateway...');
      navigate(`/payment/${order.id}`, {
        state: {
          paymentMethod: selectedPaymentMethod,
          amount: paymentData.amount,
          transactionId: paymentData.transactionId,
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartLoading || isLoadingAddresses) {
    return (
      <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    navigate('/cart');
    return null;
  }

  const deliveryCharge = total >= 500 ? 0 : 40;
  const giftPackagingCharge = isGift ? 25 : 0;
  const grandTotal = total + deliveryCharge + giftPackagingCharge;
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  // Calculate estimated delivery date (3-5 days from now)
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      {/* Amazon-style Checkout Header */}
      <div className="bg-gradient-to-b from-[#232F3E] to-[#394857] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              FreshMart
            </Link>
            <h1 className="text-xl font-medium">Checkout ({itemCount} items)</h1>
            <LockClosedIcon className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Progress Bar - Amazon Style */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            {[
              { num: 1, label: 'Delivery Address' },
              { num: 2, label: 'Payment Method' },
              { num: 3, label: 'Review & Place Order' },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => s.num < step && setStep(s.num)}
                  disabled={s.num > step}
                  className={`flex items-center text-sm ${
                    step >= s.num ? 'text-[#C45500]' : 'text-gray-400'
                  } ${s.num < step ? 'cursor-pointer hover:underline' : ''}`}
                >
                  <span className={`font-medium ${step === s.num ? 'font-bold' : ''}`}>
                    {s.num}. {s.label}
                  </span>
                </button>
                {index < 2 && (
                  <ChevronRightIcon className="h-4 w-4 mx-3 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Step 1: Select Address */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-bold text-[#0F1111]">
                    1. Select a delivery address
                  </h2>
                </div>

                <div className="p-6">
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
                        <MapPinIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-[#565959] mb-4">No addresses saved</p>
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium"
                      >
                        Add a new address
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Your Addresses Section */}
                      <div className="border rounded-lg overflow-hidden mb-4">
                        <div className="bg-[#F0F2F2] px-4 py-3 border-b">
                          <h3 className="font-bold text-sm text-[#0F1111]">Your addresses</h3>
                        </div>
                        <div className="divide-y">
                          {addresses.map((address) => (
                            <label
                              key={address.id}
                              className={`flex items-start p-4 cursor-pointer hover:bg-[#F7FAFA] transition-colors ${
                                selectedAddressId === address.id ? 'bg-[#FCF5EE]' : ''
                              }`}
                            >
                              <input
                                type="radio"
                                name="address"
                                value={address.id}
                                checked={selectedAddressId === address.id}
                                onChange={() => setSelectedAddressId(address.id)}
                                className="mt-1 h-4 w-4 text-[#E77600] border-gray-300 focus:ring-[#E77600]"
                              />
                              <div className="ml-3 flex-1">
                                <div className="flex items-center flex-wrap gap-2">
                                  <span className="font-bold text-sm text-[#0F1111]">
                                    {address.fullName}
                                  </span>
                                  {address.isDefault && (
                                    <span className="inline-flex items-center px-2 py-0.5 bg-[#F0F2F2] text-[#565959] text-xs rounded border">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-[#565959] mt-1">
                                  {address.street}
                                  {address.landmark && `, ${address.landmark}`}
                                </p>
                                <p className="text-sm text-[#565959]">
                                  {address.city}, {address.state} {address.postalCode}
                                </p>
                                <p className="text-sm text-[#565959]">
                                  {address.country || 'India'}
                                </p>
                                <p className="text-sm text-[#565959]">
                                  Phone: {address.phone}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Add New Address Button */}
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="flex items-center text-sm text-[#007185] hover:text-[#C7511F] hover:underline mb-4"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add a new address
                      </button>
                    </>
                  )}

                  {/* Continue Button */}
                  {addresses.length > 0 && (
                    <div className="pt-4 border-t">
                      <button
                        onClick={() => setStep(2)}
                        disabled={!selectedAddressId}
                        className="w-full sm:w-auto px-10 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-sm font-medium rounded-lg border border-[#FCD200] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Use this address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-bold text-[#0F1111]">
                    2. Select a payment method
                  </h2>
                </div>

                <div className="p-6">
                  {/* Selected Address Summary */}
                  {selectedAddress && (
                    <div className="bg-[#F7FAFA] border rounded-lg p-4 mb-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#0F1111]">
                            Delivering to: <span className="font-bold">{selectedAddress.fullName}</span>
                          </p>
                          <p className="text-sm text-[#565959] mt-1">
                            {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                          </p>
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment Methods */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-[#F0F2F2] px-4 py-3 border-b">
                      <h3 className="font-bold text-sm text-[#0F1111]">Payment methods</h3>
                    </div>
                    <div className="divide-y">
                      {PAYMENT_METHODS.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center p-4 cursor-pointer hover:bg-[#F7FAFA] transition-colors ${
                            selectedPaymentMethod === method.id ? 'bg-[#FCF5EE]' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={() => setSelectedPaymentMethod(method.id)}
                            className="h-4 w-4 text-[#E77600] border-gray-300 focus:ring-[#E77600]"
                          />
                          <span className="text-2xl ml-4">{method.icon}</span>
                          <div className="ml-3">
                            <span className="font-medium text-sm text-[#0F1111]">{method.name}</span>
                            <p className="text-xs text-[#565959]">{method.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setStep(3)}
                      className="px-10 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-sm font-medium rounded-lg border border-[#FCD200] shadow-sm"
                    >
                      Use this payment method
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
                    >
                      Back to address
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Place Order */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Address & Payment Summary */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-[#0F1111]">
                      3. Review items and delivery
                    </h2>
                  </div>

                  <div className="p-6">
                    {/* Delivery Info */}
                    <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
                      {/* Shipping Address */}
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-[#0F1111] mb-2">Shipping address</h3>
                        {selectedAddress && (
                          <div className="text-sm text-[#565959]">
                            <p className="text-[#0F1111] font-medium">{selectedAddress.fullName}</p>
                            <p>{selectedAddress.street}</p>
                            {selectedAddress.landmark && <p>{selectedAddress.landmark}</p>}
                            <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}</p>
                            <p>Phone: {selectedAddress.phone}</p>
                          </div>
                        )}
                        <button
                          onClick={() => setStep(1)}
                          className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-2"
                        >
                          Change
                        </button>
                      </div>

                      {/* Payment Method */}
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-[#0F1111] mb-2">Payment method</h3>
                        <div className="text-sm text-[#565959]">
                          <p>{PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name}</p>
                        </div>
                        <button
                          onClick={() => setStep(2)}
                          className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-2"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-lg font-bold text-[#007600]">
                            Estimated delivery: {getDeliveryDate()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                            <img
                              src={getImageUrl(item.product.images?.[0]?.url)}
                              alt={item.product.name}
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/products/${item.product.slug || item.product.id}`}
                                className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline line-clamp-2"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-lg font-bold text-[#B12704] mt-1">
                                ₹{parseFloat(item.product.price).toLocaleString('en-IN')}
                              </p>
                              <p className="text-sm text-[#565959]">Qty: {item.quantity}</p>
                              {item.product.stock > 0 && (
                                <p className="text-sm text-[#007600]">In Stock</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              {/* Place Order Button (Show on Step 3) */}
              {step === 3 && (
                <div className="mb-6">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-sm font-medium rounded-lg border border-[#FCD200] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlacingOrder ? 'Placing Order...' : 'Place your order'}
                  </button>
                  <p className="text-xs text-[#565959] mt-3 text-center">
                    By placing your order, you agree to our{' '}
                    <a href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline">
                      Terms of Use
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              )}

              {/* Order Summary */}
              <h2 className="text-lg font-bold text-[#0F1111] pb-4 border-b">Order Summary</h2>

              <div className="py-4 space-y-3 text-sm border-b">
                <div className="flex justify-between">
                  <span className="text-[#565959]">Items ({itemCount}):</span>
                  <span className="text-[#0F1111]">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#565959]">Delivery:</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-[#007600]">FREE</span>
                  ) : (
                    <span className="text-[#0F1111]">₹{deliveryCharge}</span>
                  )}
                </div>
                {isGift && (
                  <div className="flex justify-between">
                    <span className="text-[#565959]">Gift Packaging:</span>
                    <span className="text-[#0F1111]">₹{giftPackagingCharge}</span>
                  </div>
                )}
              </div>

              {/* Order Total */}
              <div className="py-4 border-b">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#B12704]">Order Total:</span>
                  <span className="text-lg font-bold text-[#B12704]">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Free Delivery Message */}
              {total < 500 && (
                <div className="py-4 text-sm">
                  <p className="text-[#565959]">
                    Add{' '}
                    <span className="font-bold text-[#0F1111]">
                      ₹{(500 - total).toLocaleString('en-IN')}
                    </span>{' '}
                    more to qualify for{' '}
                    <span className="text-[#007600] font-medium">FREE Delivery</span>
                  </p>
                </div>
              )}

              {total >= 500 && (
                <div className="py-4">
                  <div className="flex items-center text-sm text-[#007600]">
                    <TruckIcon className="h-5 w-5 mr-2" />
                    <span>Your order qualifies for FREE Delivery</span>
                  </div>
                </div>
              )}

              {/* Security Badge */}
              <div className="pt-4 flex items-center justify-center text-xs text-[#565959]">
                <LockClosedIcon className="h-4 w-4 mr-1" />
                <span>Secure transaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal - Amazon Style */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Add a new address"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleAddAddress)} className="p-6">
          <div className="space-y-4">
            {/* Country */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Country/Region
              </label>
              <select
                {...register('country')}
                defaultValue="India"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm bg-[#F0F2F2]"
              >
                <option value="India">India</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Full name (First and Last name)
              </label>
              <input
                {...register('fullName', { required: 'Full name is required' })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm ${
                  errors.fullName ? 'border-[#CC0C39]' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p className="text-[#CC0C39] text-xs mt-1">⚠ {errors.fullName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Mobile number
              </label>
              <input
                {...register('phone', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Please enter a valid 10-digit mobile number',
                  },
                })}
                placeholder="10-digit mobile number"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm ${
                  errors.phone ? 'border-[#CC0C39]' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="text-[#CC0C39] text-xs mt-1">⚠ {errors.phone.message}</p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Pincode
              </label>
              <input
                {...register('postalCode', {
                  required: 'Pincode is required',
                  pattern: {
                    value: /^[1-9][0-9]{5}$/,
                    message: 'Please enter a valid 6-digit pincode',
                  },
                })}
                placeholder="6 digits [0-9] PIN code"
                maxLength={6}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm ${
                  errors.postalCode ? 'border-[#CC0C39]' : 'border-gray-300'
                }`}
              />
              {errors.postalCode && (
                <p className="text-[#CC0C39] text-xs mt-1">⚠ {errors.postalCode.message}</p>
              )}
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Flat, House no., Building, Company, Apartment
              </label>
              <input
                {...register('street', { required: 'Address is required' })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm ${
                  errors.street ? 'border-[#CC0C39]' : 'border-gray-300'
                }`}
              />
              {errors.street && (
                <p className="text-[#CC0C39] text-xs mt-1">⚠ {errors.street.message}</p>
              )}
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Area, Street, Sector, Village
              </label>
              <input
                {...register('landmark')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm"
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#0F1111] mb-1">
                  Town/City
                </label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm ${
                    errors.city ? 'border-[#CC0C39]' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-[#CC0C39] text-xs mt-1">⚠ {errors.city.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0F1111] mb-1">
                  State
                </label>
                <select
                  {...register('state', { required: 'State is required' })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm bg-[#F0F2F2] ${
                    errors.state ? 'border-[#CC0C39]' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-[#CC0C39] text-xs mt-1">⚠ {errors.state.message}</p>
                )}
              </div>
            </div>

            {/* Default Address */}
            <div className="flex items-start pt-2">
              <input
                {...register('isDefault')}
                type="checkbox"
                id="isDefault"
                className="h-4 w-4 text-[#E77600] border-gray-300 rounded focus:ring-[#E77600] mt-0.5"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-[#0F1111]">
                Make this my default address
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-sm font-medium rounded-lg border border-[#FCD200] shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add address'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddressModal(false)}
              className="w-full text-sm text-[#007185] hover:text-[#C7511F] hover:underline py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
