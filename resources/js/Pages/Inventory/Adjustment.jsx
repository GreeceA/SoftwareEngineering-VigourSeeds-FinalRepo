import React, { useState } from 'react';
import { Edit3, AlertCircle, CheckCircle, Package, Plus, Minus } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, router } from '@inertiajs/react';
import Select from 'react-select';

const Adjustment = () => {
  console.log('Adjustment page loaded', { seeds, items });
  const { auth, seeds, items, errors } = usePage().props;

  const [formData, setFormData] = useState({
    product_type: '',
    product_id: '',
    qty: '',
    unit: 'kg',
    adjustment_type: '', // 'increase' or 'decrease'
    reason: '',
    notes: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const productTypes = [
    { value: 'seed', label: 'Seeds', icon: '🌱' },
    { value: 'item', label: 'Fertilizer/Pesticide', icon: '🧪' }
  ];

  const adjustmentReasons = {
    increase: [
      { value: 'count_correction_up', label: 'Physical count found more stock' },
      { value: 'return', label: 'Return from partner/customer' },
      { value: 'found', label: 'Previously lost items found' },
      { value: 'other_increase', label: 'Other (specify in notes)' }
    ],
    decrease: [
      { value: 'count_correction_down', label: 'Physical count found less stock' },
      { value: 'damaged', label: 'Damaged goods' },
      { value: 'expired', label: 'Expired/spoiled items' },
      { value: 'lost', label: 'Lost/stolen items' },
      { value: 'quality_issue', label: 'Quality issues - unusable' },
      { value: 'other_decrease', label: 'Other (specify in notes)' }
    ]
  };

  const getCurrentProducts = (type) => {
    if (type === 'seed') return seeds;
    if (type === 'item') return items;
    return [];
  };

  const handleProductTypeChange = (type) => {
    setFormData({
      ...formData,
      product_type: type,
      product_id: '',
      unit: type === 'seed' ? 'kg' : '',
      qty: '',
      reason: ''
    });
    setSelectedProduct(null);
  };

  const handleProductChange = (productId) => {
    const product = getCurrentProducts(formData.product_type).find(p => p.id === parseInt(productId));
    setSelectedProduct(product);
    
    setFormData({
      ...formData,
      product_id: productId,
      unit: product?.unit || (formData.product_type === 'seed' ? 'kg' : '')
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert qty to negative if it's a decrease
    const adjustedQty = formData.adjustment_type === 'decrease' 
      ? -Math.abs(parseFloat(formData.qty))
      : Math.abs(parseFloat(formData.qty));

    const submitData = {
      product_type: formData.product_type === 'seed' ? 'Seed' : formData.product_type,
      product_id: formData.product_id,
      qty: adjustedQty,
      unit: formData.unit,
      notes: `[${formData.reason}] ${formData.notes}`.trim()
    };

    router.post(route('inventory.adjustment.store'), submitData, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setFormData({
            product_type: '',
            product_id: '',
            qty: '',
            unit: 'kg',
            adjustment_type: '',
            reason: '',
            notes: ''
          });
          setSelectedProduct(null);
        }, 2000);
      }
    });
  };

  const isFormValid = formData.product_type && formData.product_id && 
                      formData.qty > 0 && formData.adjustment_type && formData.reason;

  const willResultInNegative = () => {
    if (!selectedProduct || !formData.qty || formData.adjustment_type !== 'decrease') return false;
    const currentStock = selectedProduct.getCurrentStock ? selectedProduct.getCurrentStock() : selectedProduct.current_stock || 0;
    return parseFloat(formData.qty) > currentStock;
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Edit3 className="text-yellow-600" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Stock Adjustment</h1>
            </div>
            <p className="text-gray-600">Correct inventory levels for damaged goods, count discrepancies, or other reasons</p>
          </div>

          {/* Warning Banner */}
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-amber-900">Important: Stock Adjustments Require Documentation</p>
              <p className="text-sm text-amber-700 mt-1">
                All adjustments must include a valid reason. This creates an audit trail for inventory changes.
              </p>
            </div>
          </div>

          {showSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <p className="font-medium text-green-900">Adjustment recorded successfully!</p>
                <p className="text-sm text-green-700">Inventory has been updated.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            {/* Product Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {productTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleProductTypeChange(type.value)}
                    className={`p-4 border-2 rounded-lg transition ${
                      formData.product_type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{type.label}</div>
                  </button>
                ))}
              </div>
              {errors?.product_type && (
                <p className="text-red-500 text-xs mt-1">{errors.product_type}</p>
              )}
            </div>

            {/* Product Selection */}
            {formData.product_type && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product <span className="text-red-500">*</span>
                </label>
                <Select
                  options={getCurrentProducts(formData.product_type).map(prod => ({
                    value: prod.id,
                    label: `${prod.name || prod.seed_variety} - Current: ${prod.current_stock || 0} ${prod.unit}`
                  }))}
                  value={
                    formData.product_id
                      ? getCurrentProducts(formData.product_type)
                          .map(prod => ({ 
                            value: prod.id, 
                            label: `${prod.name || prod.seed_variety} - Current: ${prod.current_stock || 0} ${prod.unit}`
                          }))
                          .find(opt => opt.value === parseInt(formData.product_id))
                      : null
                  }
                  onChange={opt => handleProductChange(opt ? opt.value : '')}
                  placeholder="Search or select product..."
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {errors?.product_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>
                )}
              </div>
            )}

            {/* Current Stock Info */}
            {selectedProduct && (
              <div className="mb-6 bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900">Current Stock Level</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">
                  {(selectedProduct.current_stock || 0).toLocaleString()} {selectedProduct.unit}
                </p>
              </div>
            )}

            {/* Adjustment Type */}
            {formData.product_id && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, adjustment_type: 'increase', reason: ''})}
                    className={`p-4 border-2 rounded-lg transition ${
                      formData.adjustment_type === 'increase'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Plus className={`mx-auto mb-2 ${formData.adjustment_type === 'increase' ? 'text-green-600' : 'text-gray-400'}`} size={24} />
                    <div className="text-sm font-medium text-gray-900">Increase Stock</div>
                    <div className="text-xs text-gray-500 mt-1">Add to inventory</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, adjustment_type: 'decrease', reason: ''})}
                    className={`p-4 border-2 rounded-lg transition ${
                      formData.adjustment_type === 'decrease'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Minus className={`mx-auto mb-2 ${formData.adjustment_type === 'decrease' ? 'text-red-600' : 'text-gray-400'}`} size={24} />
                    <div className="text-sm font-medium text-gray-900">Decrease Stock</div>
                    <div className="text-xs text-gray-500 mt-1">Remove from inventory</div>
                  </button>
                </div>
              </div>
            )}

            {/* Adjustment Reason */}
            {formData.adjustment_type && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Adjustment <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a reason...</option>
                  {adjustmentReasons[formData.adjustment_type].map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
                {errors?.notes && (
                  <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
                )}
              </div>
            )}

            {/* Quantity */}
            {formData.adjustment_type && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Quantity <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.qty}
                      onChange={(e) => setFormData({...formData, qty: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        willResultInNegative() ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter quantity"
                      required
                    />
                    {willResultInNegative() && (
                      <p className="text-red-500 text-xs mt-1">
                        Warning: This will result in negative stock!
                      </p>
                    )}
                    {errors?.qty && (
                      <p className="text-red-500 text-xs mt-1">{errors.qty}</p>
                    )}
                  </div>
                  <div>
                    {formData.product_type === 'seed' ? (
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="sack">Sack</option>
                        <option value="ton">Ton</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData.unit}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {formData.adjustment_type && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes {formData.reason?.includes('other') && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide detailed explanation for this adjustment..."
                  required={formData.reason?.includes('other')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific: include dates, circumstances, and who authorized this adjustment if applicable.
                </p>
              </div>
            )}

            {/* Preview */}
            {formData.adjustment_type && formData.qty && selectedProduct && (
              <div className="mb-6 bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm font-medium text-gray-700 mb-2">Adjustment Preview</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Stock:</span>
                    <span className="font-semibold">{(selectedProduct.current_stock || 0).toLocaleString()} {formData.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adjustment:</span>
                    <span className={`font-semibold ${formData.adjustment_type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.adjustment_type === 'increase' ? '+' : '-'}{parseFloat(formData.qty).toLocaleString()} {formData.unit}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-900 font-medium">New Stock Level:</span>
                    <span className={`font-bold ${
                      formData.adjustment_type === 'increase' 
                        ? 'text-green-600' 
                        : (parseFloat(formData.qty) > (selectedProduct.current_stock || 0) ? 'text-red-600' : 'text-blue-600')
                    }`}>
                      {(
                        (selectedProduct.current_stock || 0) + 
                        (formData.adjustment_type === 'increase' ? parseFloat(formData.qty) : -parseFloat(formData.qty))
                      ).toLocaleString()} {formData.unit}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!isFormValid}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
              >
                <Package size={20} />
                Record Adjustment
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    product_type: '',
                    product_id: '',
                    qty: '',
                    unit: 'kg',
                    adjustment_type: '',
                    reason: '',
                    notes: ''
                  });
                  setSelectedProduct(null);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Adjustment;