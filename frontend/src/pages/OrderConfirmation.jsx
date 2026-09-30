import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  CheckCircleIcon,
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  PrinterIcon,
  ShoppingBagIcon,
  HomeIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { getOrderByNumber } from '../services/orderService';
import { getImageUrl } from '../utils';
import Loader from '../components/common/Loader';
import confetti from 'canvas-confetti';

export default function OrderConfirmation() {
  const { orderId: orderNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderNumber]);

  // Confetti effect on success
  useEffect(() => {
    if (order && location.state?.fromPayment) {
      // Fire confetti
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF9900', '#146EB4', '#232F3E'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FF9900', '#146EB4', '#232F3E'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [order, location.state]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const response = await getOrderByNumber(orderNumber);
      setOrder(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to load order:', err);
      navigate('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const generateInvoiceHTML = () => {
    const items = order.orderItems || [];
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const addr = order.address;
    const pmLabels = { COD: 'Cash on Delivery', CARD: 'Credit/Debit Card', UPI: 'UPI', NETBANKING: 'Net Banking' };
    const pm = pmLabels[order.payment?.method] || order.payment?.method || 'N/A';
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
      alert('Please allow popups to download invoice');
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

  return (
    <div className="min-h-screen bg-[#EAEDED] print:bg-white">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-[#232F3E] to-[#37475A] text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircleIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-center text-gray-300 text-lg">
            Thank you for shopping with us
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Order Info Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
          <div className="bg-[#F0F2F2] px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#565959]">Order Number</p>
              <p className="text-lg font-bold text-[#0F1111]">{order.orderNumber}</p>
            </div>
            <div className="mt-2 sm:mt-0 sm:text-right">
              <p className="text-sm text-[#565959]">Order Date</p>
              <p className="font-medium text-[#0F1111]">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="p-6">
            {/* Confirmation Message */}
            <div className="bg-[#F0FFF4] border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <CheckBadgeIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">Order Confirmed</p>
                  <p className="text-sm text-green-700 mt-1">
                    A confirmation email has been sent to <span className="font-medium">{order.user?.email}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="bg-[#FFF8E7] border border-[#FF9900]/30 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <TruckIcon className="h-8 w-8 text-[#FF9900] mr-4" />
                <div>
                  <p className="text-sm text-[#565959]">Estimated Delivery</p>
                  <p className="text-lg font-bold text-[#0F1111]">{getDeliveryDate()}</p>
                </div>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Address */}
              <div>
                <h3 className="font-bold text-[#0F1111] mb-3 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-[#565959]" />
                  Delivery Address
                </h3>
                <div className="bg-[#F7F8F8] rounded-lg p-4 text-sm">
                  <p className="font-medium text-[#0F1111]">{order.address?.fullName}</p>
                  <p className="text-[#565959]">{order.address?.street}</p>
                  {order.address?.landmark && (
                    <p className="text-[#565959]">{order.address?.landmark}</p>
                  )}
                  <p className="text-[#565959]">
                    {order.address?.city}, {order.address?.state} {order.address?.postalCode}
                  </p>
                  <p className="text-[#565959] mt-2 flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {order.address?.phone}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="font-bold text-[#0F1111] mb-3 flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-[#565959]" />
                  Payment Information
                </h3>
                <div className="bg-[#F7F8F8] rounded-lg p-4 text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-[#565959]">Payment Method</span>
                    <span className="font-medium text-[#0F1111]">
                      {order.payment?.method === 'COD' && 'Cash on Delivery'}
                      {order.payment?.method === 'CARD' && 'Credit/Debit Card'}
                      {order.payment?.method === 'UPI' && 'UPI'}
                      {order.payment?.method === 'NETBANKING' && 'Net Banking'}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[#565959]">Payment Status</span>
                    <span className={`font-medium ${
                      order.payment?.status === 'COMPLETED' 
                        ? 'text-green-600' 
                        : order.payment?.status === 'PENDING'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {order.payment?.status === 'COMPLETED' && '✓ Paid'}
                      {order.payment?.status === 'PENDING' && order.payment?.method === 'COD' ? '💵 Pay on Delivery' : order.payment?.status === 'PENDING' ? '⏳ Pending' : ''}
                      {order.payment?.status === 'FAILED' && '✗ Failed'}
                    </span>
                  </div>
                  {order.payment?.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-[#565959]">Transaction ID</span>
                      <span className="font-mono text-xs text-[#0F1111]">
                        {order.payment.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="px-6 py-4 border-b">
            <h3 className="font-bold text-[#0F1111]">
              Order Items ({order.orderItems?.length})
            </h3>
          </div>
          <div className="divide-y">
            {order.orderItems?.map((item) => (
              <div key={item.id} className="p-4 flex gap-4">
                <img
                  src={getImageUrl(item.product?.images?.[0]?.imageUrl || item.productImage)}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product?.slug}`}
                    className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline line-clamp-2"
                  >
                    {item.product?.name}
                  </Link>
                  <p className="text-sm text-[#565959] mt-1">Qty: {item.quantity}</p>
                  <p className="text-lg font-bold text-[#B12704] mt-1">
                    ₹{parseFloat(item.total).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="px-6 py-4 border-b">
            <h3 className="font-bold text-[#0F1111]">Order Summary</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#565959]">Subtotal</span>
                <span className="text-[#0F1111]">₹{parseFloat(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565959]">Tax (GST)</span>
                <span className="text-[#0F1111]">₹{parseFloat(order.tax).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565959]">Shipping</span>
                <span className={parseFloat(order.shippingCharge) === 0 ? 'text-green-600 font-medium' : 'text-[#0F1111]'}>
                  {parseFloat(order.shippingCharge) === 0 ? 'FREE' : `₹${parseFloat(order.shippingCharge).toLocaleString('en-IN')}`}
                </span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#565959]">Discount</span>
                  <span className="text-green-600">-₹{parseFloat(order.discount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-[#0F1111]">Order Total</span>
                <span className="text-xl font-bold text-[#B12704]">
                  ₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <Link
            to="/orders"
            className="flex-1 flex items-center justify-center px-6 py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-medium rounded-lg transition-colors"
          >
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            View All Orders
          </Link>
          <Link
            to="/products"
            className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-[#0F1111] font-medium rounded-lg transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
          <button
            onClick={handleDownloadInvoice}
            className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-[#232F3E] hover:bg-[#37475A] text-white font-medium rounded-lg transition-colors"
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Download Invoice
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6 print:hidden">
          <h3 className="font-bold text-[#0F1111] mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start">
              <PhoneIcon className="h-5 w-5 text-[#565959] mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#0F1111]">Customer Support</p>
                <p className="text-[#565959]">1800-XXX-XXXX</p>
                <p className="text-[#565959] text-xs">Mon-Sat, 9am-9pm</p>
              </div>
            </div>
            <div className="flex items-start">
              <EnvelopeIcon className="h-5 w-5 text-[#565959] mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#0F1111]">Email Us</p>
                <p className="text-[#007185]">support@freshmart.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <ClockIcon className="h-5 w-5 text-[#565959] mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#0F1111]">Track Order</p>
                <Link to={`/orders/${order.id}`} className="text-[#007185] hover:text-[#C7511F] hover:underline">
                  View order details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
