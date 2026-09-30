import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PhoneIcon,
  PrinterIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { getOrder, cancelOrder } from '../services/orderService';
import { getImageUrl } from '../utils';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const ORDER_STATUSES = [
  { key: 'PENDING', label: 'Order Placed', description: 'We have received your order', icon: ClockIcon },
  { key: 'CONFIRMED', label: 'Confirmed', description: 'Seller has confirmed', icon: CheckCircleIcon },
  { key: 'PROCESSING', label: 'Processing', description: 'Being prepared', icon: ClockIcon },
  { key: 'SHIPPED', label: 'Shipped', description: 'On the way', icon: TruckIcon },
  { key: 'DELIVERED', label: 'Delivered', description: 'Delivered successfully', icon: CheckBadgeIcon },
];

const PAYMENT_METHOD_LABELS = {
  COD: 'Cash on Delivery',
  CARD: 'Credit/Debit Card',
  UPI: 'UPI',
  NETBANKING: 'Net Banking',
};

export default function OrderDetail() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const response = await getOrder(orderId);
      setOrder(response.data.data || response.data);
    } catch (err) {
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      loadOrder();
      setShowCancelModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusIndex = (status) => {
    if (status === 'CANCELLED') return -1;
    return ORDER_STATUSES.findIndex(s => s.key === status);
  };

  const handlePrint = () => {
    window.print();
  };

  const generateInvoiceHTML = () => {
    const items = order.orderItems || [];
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const addr = order.address;
    const pm = PAYMENT_METHOD_LABELS[order.payment?.method] || order.payment?.method || 'N/A';
    const ps = order.payment?.status === 'COMPLETED' ? '✓ Paid' : order.payment?.status === 'PENDING' && order.payment?.method === 'COD' ? 'COD' : order.payment?.status || 'Pending';
    const psColor = order.payment?.status === 'COMPLETED' ? '#007600' : '#C45500';
    const stColor = { PENDING: '#C45500', CONFIRMED: '#007600', PROCESSING: '#0066C0', SHIPPED: '#C45500', DELIVERED: '#007600', CANCELLED: '#D13212' };
    const addressLine = addr ? `${addr.fullName || ''}<br>${addr.street || ''}${addr.landmark ? ', ' + addr.landmark : ''}<br>${addr.city || ''}, ${addr.state || ''} – ${addr.postalCode || ''}, ${addr.country || 'India'}<br>Ph: ${addr.phone || 'N/A'}` : 'N/A';
    const rows = items.map((item, i) => `<tr><td style="padding:5px 6px;border-bottom:1px solid #eee;color:#555;">${i+1}</td><td style="padding:5px 6px;border-bottom:1px solid #eee;font-weight:600;">${item.product?.name || 'Product'}</td><td style="padding:5px 6px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td><td style="padding:5px 6px;border-bottom:1px solid #eee;text-align:right;">₹${parseFloat(item.unitPrice).toLocaleString('en-IN')}</td><td style="padding:5px 6px;border-bottom:1px solid #eee;text-align:right;font-weight:700;color:#B12704;">₹${parseFloat(item.total).toLocaleString('en-IN')}</td></tr>`).join('');

    return `<!DOCTYPE html><html><head><title>Invoice – ${order.orderNumber}</title><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}@page{size:A4;margin:8mm 10mm}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#0F1111;background:#fff;font-size:11px;line-height:1.35}.inv{max-width:190mm;margin:0 auto}.hdr{display:flex;justify-content:space-between;align-items:center;padding-bottom:6px;border-bottom:2px solid #232F3E;margin-bottom:10px}.g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}.box{background:#F7F8FA;border:1px solid #E3E6E8;border-radius:4px;padding:6px 8px}.lbl{font-size:9px;color:#888;text-transform:uppercase;font-weight:700;letter-spacing:.5px;margin-bottom:3px}.row{display:flex;justify-content:space-between;padding:2px 0;font-size:10.5px}table{width:100%;border-collapse:collapse;margin-bottom:8px}th{background:#232F3E;color:#fff;padding:5px 6px;font-size:10px;font-weight:700;text-align:left}td{font-size:10.5px}.sum{max-width:240px;margin-left:auto;background:#F7F8FA;border:1px solid #E3E6E8;border-radius:4px;padding:8px}.sr{display:flex;justify-content:space-between;padding:3px 0;font-size:11px;border-bottom:1px solid #E3E6E8}.ft{text-align:center;margin-top:10px;padding-top:6px;border-top:1px solid #D5D9D9;font-size:9px;color:#888}@media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.no-print{display:none!important}}</style></head><body><div class="inv">
<div class="hdr"><div style="display:flex;align-items:center"><div style="background:#FF9900;width:28px;height:28px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:16px;margin-right:6px">🛒</div><div><div style="font-size:18px;color:#232F3E;font-weight:700">GroceryShop</div><div style="color:#888;font-size:9px">Fresh groceries delivered to your door</div></div></div><div style="text-align:right"><div style="font-size:16px;color:#FF9900;font-weight:700">TAX INVOICE</div><div style="font-size:9px;color:#565959">Date: ${orderDate}</div></div></div>
<div class="g2"><div class="box"><div class="lbl">Order Information</div><div class="row"><span style="color:#565959">Order #</span><span style="font-weight:700;font-family:monospace;font-size:9.5px">${order.orderNumber}</span></div><div class="row"><span style="color:#565959">Date</span><span style="font-weight:600">${orderDate}</span></div><div class="row"><span style="color:#565959">Status</span><span style="font-weight:700;color:${stColor[order.status] || '#555'}">${order.status}</span></div></div><div class="box"><div class="lbl">Payment Information</div><div class="row"><span style="color:#565959">Method</span><span style="font-weight:600">${pm}</span></div><div class="row"><span style="color:#565959">Status</span><span style="font-weight:700;color:${psColor}">${ps}</span></div>${order.payment?.transactionId ? `<div class="row"><span style="color:#565959">Txn ID</span><span style="font-weight:600;font-family:monospace;font-size:8.5px">${order.payment.transactionId}</span></div>` : ''}</div></div>
<div class="box" style="margin-bottom:8px"><div class="lbl">Delivery Address</div><div style="font-size:10.5px;line-height:1.45;color:#333">${addressLine}</div></div>
<table><thead><tr><th style="width:24px">#</th><th>Product</th><th style="width:40px;text-align:center">Qty</th><th style="width:75px;text-align:right">Price</th><th style="width:75px;text-align:right">Total</th></tr></thead><tbody>${rows}</tbody></table>
<div class="sum"><div class="sr"><span style="color:#565959">Subtotal</span><span style="font-weight:600">₹${parseFloat(order.subtotal).toLocaleString('en-IN')}</span></div><div class="sr"><span style="color:#565959">Tax (GST)</span><span style="font-weight:600">₹${parseFloat(order.tax).toLocaleString('en-IN')}</span></div><div class="sr"><span style="color:#565959">Shipping</span><span style="font-weight:600;color:${parseFloat(order.shippingCharge)===0?'#007600':'#0F1111'}">${parseFloat(order.shippingCharge)===0?'FREE':'₹'+parseFloat(order.shippingCharge).toLocaleString('en-IN')}</span></div>${parseFloat(order.discount)>0?`<div class="sr"><span style="color:#007600">Discount</span><span style="font-weight:700;color:#007600">-₹${parseFloat(order.discount).toLocaleString('en-IN')}</span></div>`:''}<div style="display:flex;justify-content:space-between;padding:5px 0;margin-top:4px;border-top:2px solid #232F3E;font-weight:700"><span style="font-size:13px">Grand Total</span><span style="font-size:15px;color:#B12704">₹${parseFloat(order.totalAmount).toLocaleString('en-IN')}</span></div></div>
<div class="ft"><p>Thank you for shopping with GroceryShop! This is a computer-generated invoice and requires no signature.</p><p style="margin-top:3px">Conditions of Use · Privacy Notice · Interest-Based Ads</p><p style="margin-top:3px;color:#aaa">© 2026 GroceryShop. All rights reserved.</p></div>
<div class="no-print" style="text-align:center;margin-top:14px"><button onclick="window.print()" style="padding:8px 28px;background:#FF9900;color:#fff;border:none;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer">🖨️ Print Invoice</button></div>
</div></body></html>`;
  };

  const handleDownloadInvoice = () => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) {
      toast.error('Please allow popups to download invoice');
      return;
    }
    invoiceWindow.document.write(generateInvoiceHTML());
    invoiceWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const currentStatusIndex = getStatusIndex(order.status);
  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

  // Calculate delivery date
  const getDeliveryDate = () => {
    const date = new Date(order.createdAt);
    date.setDate(date.getDate() + 4);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="min-h-screen bg-[#EAEDED] print:bg-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/orders')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-[#0F1111]" />
              </button>
              <div>
                <nav className="flex items-center text-sm text-gray-500 mb-1">
                  <Link to="/orders" className="hover:text-[#C45500] hover:underline">Your Orders</Link>
                  <span className="mx-2">›</span>
                  <span className="text-[#C45500]">Order Details</span>
                </nav>
                <h1 className="text-xl font-bold text-[#0F1111]">
                  Order #{order.orderNumber}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center px-3 py-2 text-sm text-white bg-[#FF9900] hover:bg-[#e68a00] rounded-lg font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2 rotate-[225deg]" />
                Download Invoice
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-3 py-2 text-sm text-[#0F1111] border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </button>
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Order Status Timeline */}
        {order.status !== 'CANCELLED' ? (
          <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
            <div className="p-6">
              {/* Expected Delivery */}
              {order.status !== 'DELIVERED' && (
                <div className="mb-6 p-4 bg-[#FFF8E7] border border-[#FF9900]/30 rounded-lg">
                  <div className="flex items-center">
                    <TruckIcon className="h-6 w-6 text-[#FF9900] mr-3" />
                    <div>
                      <p className="text-sm text-[#565959]">Expected delivery</p>
                      <p className="font-bold text-[#0F1111]">{getDeliveryDate()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Progress */}
              <div className="relative">
                {/* Progress Line Background */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 mx-10" />
                {/* Progress Line Active */}
                <div 
                  className="absolute top-5 left-0 h-1 bg-[#007600] mx-10 transition-all duration-500"
                  style={{ width: `${(currentStatusIndex / (ORDER_STATUSES.length - 1)) * (100 - 10)}%` }}
                />

                {/* Status Points */}
                <div className="relative flex justify-between">
                  {ORDER_STATUSES.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const StatusIcon = status.icon;

                    return (
                      <div key={status.key} className="flex flex-col items-center z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted 
                            ? 'bg-[#007600] text-white' 
                            : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div className="mt-3 text-center">
                          <p className={`text-sm font-medium ${
                            isCompleted ? 'text-[#007600]' : 'text-gray-400'
                          }`}>
                            {status.label}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-[#565959] mt-0.5">{status.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Status Message */}
            {order.status === 'DELIVERED' && (
              <div className="bg-green-50 border-t border-green-200 px-6 py-4">
                <div className="flex items-center">
                  <CheckBadgeIcon className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-800">Delivered successfully!</p>
                    <p className="text-sm text-green-700">
                      On {new Date(order.updatedAt).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-500 mr-4" />
              <div>
                <h2 className="text-lg font-bold text-red-700">Order Cancelled</h2>
                <p className="text-sm text-red-600">
                  This order was cancelled on {new Date(order.updatedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b bg-[#F0F2F2]">
                <h3 className="font-bold text-[#0F1111]">
                  Items in your order ({order.orderItems?.length})
                </h3>
              </div>
              <div className="divide-y">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <Link to={`/products/${item.product?.slug}`}>
                      <img
                        src={getImageUrl(item.product?.images?.[0]?.imageUrl || item.productImage)}
                        alt={item.product?.name}
                        className="w-24 h-24 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product?.slug}`}
                        className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium line-clamp-2"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-lg font-bold text-[#B12704] mt-1">
                        ₹{parseFloat(item.unitPrice).toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-[#565959]">Qty: {item.quantity}</p>
                      
                      {/* Item Actions */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                          to={`/products/${item.product?.slug}`}
                          className="text-xs px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50 text-[#0F1111]"
                        >
                          Buy it again
                        </Link>
                        {order.status === 'DELIVERED' && (
                          <button className="text-xs px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50 text-[#0F1111]">
                            Write a review
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0F1111]">
                        ₹{parseFloat(item.total).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b bg-[#F0F2F2]">
                <h3 className="font-bold text-[#0F1111] flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-[#565959]" />
                  Delivery Address
                </h3>
              </div>
              <div className="p-6">
                {order.address ? (
                  <div className="text-sm">
                    <p className="font-bold text-[#0F1111]">{order.address.fullName}</p>
                    <p className="text-[#565959]">{order.address.street}</p>
                    {order.address.landmark && (
                      <p className="text-[#565959]">{order.address.landmark}</p>
                    )}
                    <p className="text-[#565959]">
                      {order.address.city}, {order.address.state} {order.address.postalCode}
                    </p>
                    <p className="text-[#565959]">{order.address.country || 'India'}</p>
                    <p className="text-[#565959] mt-2 flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {order.address.phone}
                    </p>
                  </div>
                ) : (
                  <p className="text-[#565959]">Address not available</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b bg-[#F0F2F2]">
                <h3 className="font-bold text-[#0F1111]">Order Summary</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#565959]">Items Subtotal:</span>
                    <span className="text-[#0F1111]">₹{parseFloat(order.subtotal).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#565959]">Tax (GST):</span>
                    <span className="text-[#0F1111]">₹{parseFloat(order.tax).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#565959]">Shipping:</span>
                    <span className={parseFloat(order.shippingCharge) === 0 ? 'text-[#007600]' : 'text-[#0F1111]'}>
                      {parseFloat(order.shippingCharge) === 0 ? 'FREE' : `₹${parseFloat(order.shippingCharge)}`}
                    </span>
                  </div>
                  {parseFloat(order.discount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#565959]">Discount:</span>
                      <span className="text-[#007600]">-₹{parseFloat(order.discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-[#B12704]">Order Total:</span>
                    <span className="text-lg font-bold text-[#B12704]">
                      ₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b bg-[#F0F2F2]">
                <h3 className="font-bold text-[#0F1111] flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-[#565959]" />
                  Payment Information
                </h3>
              </div>
              <div className="p-6 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-[#565959]">Payment Method:</span>
                  <span className="text-[#0F1111] font-medium">
                    {PAYMENT_METHOD_LABELS[order.payment?.method] || order.payment?.method}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#565959]">Payment Status:</span>
                  <span className={`font-medium ${
                    order.payment?.status === 'COMPLETED' 
                      ? 'text-[#007600]' 
                      : order.payment?.status === 'PENDING'
                      ? 'text-[#C7511F]'
                      : 'text-red-600'
                  }`}>
                    {order.payment?.status === 'COMPLETED' && '✓ Paid'}
                    {order.payment?.status === 'PENDING' && order.payment?.method === 'COD' && '💵 Pay on Delivery'}
                    {order.payment?.status === 'PENDING' && order.payment?.method !== 'COD' && '⏳ Pending'}
                    {order.payment?.status === 'FAILED' && '✗ Failed'}
                    {order.payment?.status === 'REFUNDED' && '↩ Refunded'}
                  </span>
                </div>
                {order.payment?.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-[#565959]">Transaction ID:</span>
                    <span className="font-mono text-xs text-[#0F1111]">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b bg-[#F0F2F2]">
                <h3 className="font-bold text-[#0F1111]">Order Information</h3>
              </div>
              <div className="p-6 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#565959]">Order Number:</span>
                  <span className="text-[#0F1111] font-mono">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#565959]">Order Date:</span>
                  <span className="text-[#0F1111]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-[#F7F8F8] rounded-lg p-6 print:hidden">
              <h3 className="font-bold text-[#0F1111] mb-3">Need Help?</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 text-sm">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Contact Support
                </button>
                {canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full flex items-center justify-center px-4 py-2 text-red-600 text-sm hover:underline"
                  >
                    Cancel this order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
      >
        <div className="p-6">
          <div className="flex items-start mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-[#0F1111] font-medium">Are you sure you want to cancel this order?</p>
              <p className="text-sm text-[#565959] mt-1">
                This action cannot be undone. Any payment made will be refunded to your original payment method.
              </p>
            </div>
          </div>
          
          <div className="bg-[#F7F8F8] rounded-lg p-4 mb-6">
            <p className="text-sm text-[#565959]">Order: <span className="font-medium text-[#0F1111]">{order.orderNumber}</span></p>
            <p className="text-sm text-[#565959]">Total: <span className="font-medium text-[#0F1111]">₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}</span></p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCancelModal(false)}
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
