import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MinusIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { getImageUrl } from '../../utils';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const RESTOCK_REASONS = [
  { value: 'RESTOCK', label: 'Regular Restock' },
  { value: 'ADJUSTMENT', label: 'Stock Adjustment' },
  { value: 'RETURNED', label: 'Customer Return' },
  { value: 'DAMAGED', label: 'Damaged/Write-off' },
];

export default function ManageInventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockData, setRestockData] = useState({ quantity: 0, reason: 'RESTOCK', notes: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [summary, setSummary] = useState({ totalProducts: 0, lowStockCount: 0, outOfStockCount: 0 });

  useEffect(() => {
    loadInventory();
    loadCategories();
  }, []);

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/inventory?limit=50');
      const data = response.data.data || response.data;
      setProducts(Array.isArray(data) ? data : []);
      
      // Calculate summary
      const prods = Array.isArray(data) ? data : [];
      setSummary({
        totalProducts: prods.length,
        lowStockCount: prods.filter(p => p.stockQuantity <= p.lowStockAlert && p.stockQuantity > 0).length,
        outOfStockCount: prods.filter(p => p.stockQuantity === 0).length,
      });
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data.categories || []);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const openRestockModal = (product) => {
    setSelectedProduct(product);
    setRestockData({ quantity: 0, reason: 'RESTOCK', notes: '' });
    setShowRestockModal(true);
  };

  const handleRestock = async () => {
    if (restockData.quantity === 0) {
      toast.error('Please enter a quantity');
      return;
    }

    setIsUpdating(true);
    try {
      const endpoint = restockData.quantity > 0 ? '/inventory/restock' : '/inventory/adjust';
      await api.post(endpoint, {
        productId: selectedProduct.id,
        quantity: restockData.quantity,
        reason: restockData.reason,
        notes: restockData.notes,
      });

      toast.success(`Stock updated for ${selectedProduct.name}`);
      setShowRestockModal(false);
      loadInventory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickAdjust = async (product, delta) => {
    const newQty = Math.max(0, product.stockQuantity + delta);
    try {
      const endpoint = delta > 0 ? '/inventory/restock' : '/inventory/adjust';
      await api.post(endpoint, {
        productId: product.id,
        quantity: delta,
        reason: delta > 0 ? 'RESTOCK' : 'ADJUSTMENT',
        notes: `Quick adjustment: ${delta > 0 ? '+' : ''}${delta}`,
      });
      
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, stockQuantity: newQty } : p
      ));
      toast.success('Stock updated');
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

  const loadProductLogs = async (product) => {
    setSelectedProduct(product);
    try {
      const response = await api.get(`/inventory/logs/${product.id}`);
      setInventoryLogs(response.data.data?.history || response.data.data || []);
      setShowLogsModal(true);
    } catch (err) {
      toast.error('Failed to load inventory logs');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || product.category?.name === filterCategory;
    const matchesLowStock = !showLowStockOnly || product.stockQuantity <= (product.lowStockAlert || 10);
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const getStockStatus = (product) => {
    if (product.stockQuantity === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-700', icon: '🔴' };
    } else if (product.stockQuantity <= (product.lowStockAlert || 10)) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' };
    }
    return { label: 'In Stock', color: 'bg-green-100 text-green-700', icon: '🟢' };
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 mb-2"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage product stock levels</p>
        </div>
        <Button onClick={loadInventory} variant="outline">
          <ArrowPathIcon className="w-5 h-5 mr-1" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.lowStockCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{summary.outOfStockCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm text-gray-700">Low Stock Only</span>
          </label>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alert Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const status = getStockStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={getImageUrl(product.image || product.images?.[0]?.imageUrl)}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{parseFloat(product.price).toLocaleString('en-IN')} / {product.unit}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.sku || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuickAdjust(product, -1)}
                            disabled={product.stockQuantity === 0}
                            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="font-semibold text-gray-900 min-w-[40px] text-center">
                            {product.stockQuantity}
                          </span>
                          <button
                            onClick={() => handleQuickAdjust(product, 1)}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.lowStockAlert || 10}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openRestockModal(product)}
                            className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => loadProductLogs(product)}
                            className="px-3 py-1.5 border text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                          >
                            History
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      <Modal
        isOpen={showRestockModal}
        onClose={() => setShowRestockModal(false)}
        title={`Restock: ${selectedProduct?.name}`}
      >
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Current Stock</p>
            <p className="text-2xl font-bold text-gray-900">
              {selectedProduct?.stockQuantity} {selectedProduct?.unit}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity to Add/Remove
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRestockData(d => ({ ...d, quantity: d.quantity - 10 }))}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                -10
              </button>
              <button
                onClick={() => setRestockData(d => ({ ...d, quantity: d.quantity - 1 }))}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                -1
              </button>
              <input
                type="number"
                value={restockData.quantity}
                onChange={(e) => setRestockData({ ...restockData, quantity: parseInt(e.target.value) || 0 })}
                className="w-24 px-3 py-2 border rounded-lg text-center font-medium"
              />
              <button
                onClick={() => setRestockData(d => ({ ...d, quantity: d.quantity + 1 }))}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                +1
              </button>
              <button
                onClick={() => setRestockData(d => ({ ...d, quantity: d.quantity + 10 }))}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                +10
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              New stock: <span className="font-medium text-gray-900">
                {Math.max(0, (selectedProduct?.stockQuantity || 0) + restockData.quantity)}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <select
              value={restockData.reason}
              onChange={(e) => setRestockData({ ...restockData, reason: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {RESTOCK_REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={restockData.notes}
              onChange={(e) => setRestockData({ ...restockData, notes: e.target.value })}
              rows={2}
              placeholder="Add any notes about this stock change..."
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowRestockModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRestock}
              isLoading={isUpdating}
              className="flex-1"
            >
              Update Stock
            </Button>
          </div>
        </div>
      </Modal>

      {/* Inventory Logs Modal */}
      <Modal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        title={`Stock History: ${selectedProduct?.name}`}
        size="lg"
      >
        <div className="p-6">
          {inventoryLogs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No history available</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {inventoryLogs.map((log, index) => (
                <div key={log.id || index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${log.changeQty > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {log.changeQty > 0 ? (
                      <PlusIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <MinusIcon className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        {log.changeQty > 0 ? '+' : ''}{log.changeQty} units
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {log.reason?.replace(/_/g, ' ')} • {log.prevQty} → {log.newQty}
                    </p>
                    {log.notes && (
                      <p className="text-sm text-gray-500 mt-1">{log.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
