import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link } from '@inertiajs/react'; // Add this import

const CreatePartnerOrder = () => {
  const { auth } = usePage().props;
  const [formData, setFormData] = useState({
    partner_id: '',
    contract_id: '',
    order_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [orderLines, setOrderLines] = useState([]);
  const [currentLine, setCurrentLine] = useState({
    product_type: '',
    product_id: '',
    qty: '',
    unit: 'kg',
    price_per_unit: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showContractProducts, setShowContractProducts] = useState(false);

  // Sample data
  const partners = [
    { id: 1, name: 'Partner Farm A', contact: '+63 912 345 6789' },
    { id: 2, name: 'Partner Farm B', contact: '+63 923 456 7890' },
    { id: 3, name: 'Partner Farm C', contact: '+63 934 567 8901' }
  ];

  const contracts = [
    {
      id: 1,
      contract_number: 'CNT-2024-001',
      partner_id: 1,
      partner_name: 'Partner Farm A',
      seed_commitments: [
        { seed_id: 1, seed_name: 'White Corn Seeds', quantity: 500, unit: 'kg', price: 150 },
        { seed_id: 2, seed_name: 'Yellow Corn Seeds', quantity: 300, unit: 'kg', price: 160 }
      ]
    },
    {
      id: 2,
      contract_number: 'CNT-2024-002',
      partner_id: 2,
      partner_name: 'Partner Farm B',
      seed_commitments: [
        { seed_id: 1, seed_name: 'White Corn Seeds', quantity: 400, unit: 'kg', price: 150 }
      ]
    }
  ];

  const products = {
    seed: [
      { id: 1, name: 'White Corn Seeds', unit: 'kg', price: 150, available_stock: 1250 },
      { id: 2, name: 'Yellow Corn Seeds', unit: 'kg', price: 160, available_stock: 850 }
    ],
    item: [
      { id: 1, name: 'NPK Fertilizer', unit: 'kg', price: 85, available_stock: 340 },
      { id: 2, name: 'Pesticide A', unit: 'liter', price: 320, available_stock: 125 }
    ]
  };

  const handlePartnerChange = (partnerId) => {
    setFormData({
      ...formData,
      partner_id: partnerId,
      contract_id: ''
    });
  };

  const handleContractChange = (contractId) => {
    setFormData({
      ...formData,
      contract_id: contractId
    });
    if (contractId) {
      setShowContractProducts(true);
    }
  };

  const getAvailableContracts = () => {
    if (!formData.partner_id) return [];
    return contracts.filter(c => c.partner_id === parseInt(formData.partner_id));
  };

  const getSelectedContract = () => {
    if (!formData.contract_id) return null;
    return contracts.find(c => c.id === parseInt(formData.contract_id));
  };

  const handleProductTypeChange = (type) => {
    setCurrentLine({
      ...currentLine,
      product_type: type,
      product_id: '',
      qty: '',
      unit: 'kg',
      price_per_unit: ''
    });
  };

  const handleProductChange = (productId) => {
    const productList = products[currentLine.product_type] || [];
    const selectedProduct = productList.find(p => p.id === parseInt(productId));
    
    setCurrentLine({
      ...currentLine,
      product_id: productId,
      unit: selectedProduct?.unit || 'kg',
      price_per_unit: selectedProduct?.price || ''
    });
  };

  const addOrderLine = () => {
    if (!currentLine.product_type || !currentLine.product_id || !currentLine.qty || !currentLine.price_per_unit) {
      alert('Please fill all line item fields');
      return;
    }

    const productList = products[currentLine.product_type] || [];
    const product = productList.find(p => p.id === parseInt(currentLine.product_id));

    const newLine = {
      id: Date.now(),
      product_type: currentLine.product_type,
      product_id: currentLine.product_id,
      product_name: product?.name || '',
      qty: parseFloat(currentLine.qty),
      unit: currentLine.unit,
      price_per_unit: parseFloat(currentLine.price_per_unit),
      total: parseFloat(currentLine.qty) * parseFloat(currentLine.price_per_unit),
      available_stock: product?.available_stock || 0
    };

    setOrderLines([...orderLines, newLine]);
    setCurrentLine({
      product_type: '',
      product_id: '',
      qty: '',
      unit: 'kg',
      price_per_unit: ''
    });
  };

  const removeOrderLine = (lineId) => {
    setOrderLines(orderLines.filter(line => line.id !== lineId));
  };

  const addContractProduct = (commitment) => {
    const existingLine = orderLines.find(
      line => line.product_type === 'seed' && line.product_id === commitment.seed_id
    );

    if (existingLine) {
      alert('This seed is already in the order');
      return;
    }

    const newLine = {
      id: Date.now(),
      product_type: 'seed',
      product_id: commitment.seed_id,
      product_name: commitment.seed_name,
      qty: commitment.quantity,
      unit: commitment.unit,
      price_per_unit: commitment.price,
      total: commitment.quantity * commitment.price,
      available_stock: products.seed.find(s => s.id === commitment.seed_id)?.available_stock || 0
    };

    setOrderLines([...orderLines, newLine]);
  };

  const getTotalValue = () => {
    return orderLines.reduce((sum, line) => sum + line.total, 0);
  };

  const handleSubmit = () => {
    if (!formData.partner_id || orderLines.length === 0) {
      alert('Please select a partner and add at least one order line');
      return;
    }

    console.log('Submitting order:', {
      ...formData,
      lines: orderLines
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form or redirect
    }, 2000);
  };

  const getCurrentProducts = () => {
    if (!currentLine.product_type) return [];
    return products[currentLine.product_type] || [];
  };

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
      <div className="max-w-6xl mx-auto">
        <Link
          href={route('partner-orders.index')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create Partner Order</h1>
          </div>
          <p className="text-gray-600">Create a new order for seed and item delivery to partners</p>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <div>
              <p className="font-medium text-green-900">Order created successfully!</p>
              <p className="text-sm text-green-700">You can now fulfill this order from inventory.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Partner <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.partner_id}
                    onChange={(e) => handlePartnerChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a partner...</option>
                    {partners.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.order_date}
                    onChange={(e) => setFormData({...formData, order_date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {formData.partner_id && getAvailableContracts().length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link to Contract (Optional)
                  </label>
                  <select
                    value={formData.contract_id}
                    onChange={(e) => handleContractChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No contract (general order)</option>
                    {getAvailableContracts().map((contract) => (
                      <option key={contract.id} value={contract.id}>
                        {contract.contract_number}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes about this order..."
                />
              </div>
            </div>

            {/* Contract Products Quick Add */}
            {showContractProducts && getSelectedContract() && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-3">
                  Contract Seed Commitments - Quick Add
                </h3>
                <div className="space-y-2">
                  {getSelectedContract().seed_commitments.map((commitment, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{commitment.seed_name}</p>
                        <p className="text-sm text-gray-600">
                          {commitment.quantity} {commitment.unit} @ ₱{commitment.price}/{commitment.unit}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addContractProduct(commitment)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition"
                      >
                        Add to Order
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Order Line */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Order Line</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'seed', label: 'Seeds', icon: '🌱' },
                    { value: 'item', label: 'Items', icon: '🧪' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleProductTypeChange(type.value)}
                      className={`p-3 border-2 rounded-lg transition ${
                        currentLine.product_type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {currentLine.product_type && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Product <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={currentLine.product_id}
                        onChange={(e) => handleProductChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Choose a product...</option>
                        {getCurrentProducts().map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} (Stock: {product.available_stock} {product.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={currentLine.qty}
                          onChange={(e) => setCurrentLine({...currentLine, qty: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter quantity"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {currentLine.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={currentLine.unit}
                        onChange={(e) => setCurrentLine({...currentLine, unit: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="liter">Liter</option>
                        <option value="sack">Sack</option>
                        <option value="ton">Ton</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price per Unit <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₱
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={currentLine.price_per_unit}
                          onChange={(e) => setCurrentLine({...currentLine, price_per_unit: e.target.value})}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {currentLine.qty && currentLine.price_per_unit && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">
                        Line Total: <strong>₱{(parseFloat(currentLine.qty) * parseFloat(currentLine.price_per_unit)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={addOrderLine}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <Plus size={20} />
                    Add Line to Order
                  </button>
                </>
              )}
            </div>

            {/* Order Lines List */}
            {orderLines.length > 0 && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Order Lines ({orderLines.length})</h2>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderLines.map((line) => (
                      <tr key={line.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{line.product_name}</p>
                            <p className="text-xs text-gray-500 capitalize">{line.product_type}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold">{line.qty} {line.unit}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-gray-900">₱{line.price_per_unit.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-green-600">
                            ₱{line.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => removeOrderLine(line.id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {formData.partner_id ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Partner</span>
                      <span className="font-medium text-gray-900">
                        {partners.find(p => p.id === parseInt(formData.partner_id))?.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Order Date</span>
                      <span className="font-medium text-gray-900">{formData.order_date}</span>
                    </div>
                    {formData.contract_id && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Contract</span>
                        <span className="font-medium text-purple-600">
                          {getSelectedContract()?.contract_number}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm pt-3 border-t">
                      <span className="text-gray-600">Total Items</span>
                      <span className="font-semibold">{orderLines.length}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-gray-900 font-medium">Total Value</span>
                      <span className="font-bold text-xl text-green-600">
                        ₱{getTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {orderLines.length === 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
                      <p className="text-xs text-yellow-800">Add at least one order line to continue</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={orderLines.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition"
                  >
                    Create Order
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600 text-sm">Select a partner to begin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthenticatedLayout>
  );
};

export default CreatePartnerOrder;