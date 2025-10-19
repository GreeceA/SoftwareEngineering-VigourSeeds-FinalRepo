import React, { useState } from 'react';
import { ArrowUpCircle, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link } from '@inertiajs/react'; // Add this import


const StockOutboundForm = () => {
  const { auth } = usePage().props;
  const [formData, setFormData] = useState({
    partner_order_id: '',
    partner_order_line_id: '',
    qty: '',
    notes: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);

  // Sample data
  const partnerOrders = [
    {
      id: 1,
      order_number: 'PO-2024-001',
      partner_name: 'Partner Farm A',
      status: 'pending',
      lines: [
        { id: 1, product_name: 'White Corn Seeds', qty: 500, delivered_qty: 200, unit: 'kg', available_stock: 1250 },
        { id: 2, product_name: 'NPK Fertilizer', qty: 300, delivered_qty: 0, unit: 'kg', available_stock: 340 }
      ]
    },
    {
      id: 2,
      order_number: 'PO-2024-002',
      partner_name: 'Partner Farm B',
      status: 'partially_fulfilled',
      lines: [
        { id: 3, product_name: 'Yellow Corn Seeds', qty: 400, delivered_qty: 150, unit: 'kg', available_stock: 850 }
      ]
    }
  ];

  const handleOrderChange = (orderId) => {
    const order = partnerOrders.find(o => o.id === parseInt(orderId));
    setSelectedOrder(order);
    setSelectedLine(null);
    setFormData({
      ...formData,
      partner_order_id: orderId,
      partner_order_line_id: '',
      qty: ''
    });
  };

  const handleLineChange = (lineId) => {
    const line = selectedOrder?.lines.find(l => l.id === parseInt(lineId));
    setSelectedLine(line);
    setFormData({
      ...formData,
      partner_order_line_id: lineId,
      qty: ''
    });
  };

  const getRemainingQty = () => {
    if (!selectedLine) return 0;
    return selectedLine.qty - selectedLine.delivered_qty;
  };

  const hasStockIssue = () => {
    if (!selectedLine || !formData.qty) return false;
    return parseFloat(formData.qty) > selectedLine.available_stock;
  };

  const exceedsOrder = () => {
    if (!selectedLine || !formData.qty) return false;
    return parseFloat(formData.qty) > getRemainingQty();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasStockIssue()) {
      alert('Insufficient stock available!');
      return;
    }
    if (exceedsOrder()) {
      alert('Quantity exceeds remaining order amount!');
      return;
    }
    
    console.log('Submitting:', formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        partner_order_id: '',
        partner_order_line_id: '',
        qty: '',
        notes: ''
      });
      setSelectedOrder(null);
      setSelectedLine(null);
    }, 2000);
  };

  const isFormValid = formData.partner_order_id && formData.partner_order_line_id && 
                      formData.qty > 0 && !hasStockIssue() && !exceedsOrder();

  return (
    <AuthenticatedLayout
        user={auth.user}
        header={
            <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                <span className="text-[#333333] font-[400]"> | Inventory Management</span>
            </h2>
        }
    >
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ArrowUpCircle className="text-blue-600" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Stock Outbound</h1>
          </div>
          <p className="text-gray-600">Deliver stock to fulfill partner orders</p>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <div>
              <p className="font-medium text-green-900">Stock delivered successfully!</p>
              <p className="text-sm text-green-700">Partner order has been updated.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Partner Order <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.partner_order_id}
              onChange={(e) => handleOrderChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose an order...</option>
              {partnerOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.order_number} - {order.partner_name} ({order.status})
                </option>
              ))}
            </select>
          </div>

          {selectedOrder && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product Line <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {selectedOrder.lines.map((line) => {
                  const remaining = line.qty - line.delivered_qty;
                  const progress = (line.delivered_qty / line.qty) * 100;
                  
                  return (
                    <div
                      key={line.id}
                      onClick={() => handleLineChange(line.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.partner_order_line_id === String(line.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{line.product_name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Ordered: {line.qty} {line.unit} | Delivered: {line.delivered_qty} {line.unit}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          remaining === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {remaining} {line.unit} remaining
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Available Stock: {line.available_stock} {line.unit}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedLine && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Quantity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={Math.min(getRemainingQty(), selectedLine.available_stock)}
                    value={formData.qty}
                    onChange={(e) => setFormData({...formData, qty: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      hasStockIssue() || exceedsOrder() ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter quantity to deliver"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {selectedLine.unit}
                  </span>
                </div>
                
                {hasStockIssue() && (
                  <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle size={16} />
                    <span>Insufficient stock! Only {selectedLine.available_stock} {selectedLine.unit} available</span>
                  </div>
                )}
                {exceedsOrder() && (
                  <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle size={16} />
                    <span>Exceeds remaining order quantity! Max: {getRemainingQty()} {selectedLine.unit}</span>
                  </div>
                )}
                
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, qty: Math.min(getRemainingQty(), selectedLine.available_stock)})}
                    className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                  >
                    Fill Max Available
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, qty: getRemainingQty() / 2})}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                  >
                    Fill 50%
                  </button>
                </div>
              </div>

              <div className="mb-6 bg-gray-50 rounded-lg p-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Ordered</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedLine.qty} {selectedLine.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Already Delivered</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {selectedLine.delivered_qty} {selectedLine.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Remaining</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {getRemainingQty()} {selectedLine.unit}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes about this delivery..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
            >
              <Package size={20} />
              Deliver Stock
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  partner_order_id: '',
                  partner_order_line_id: '',
                  qty: '',
                  notes: ''
                });
                setSelectedOrder(null);
                setSelectedLine(null);
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
    </AuthenticatedLayout>
  );
};

export default StockOutboundForm;