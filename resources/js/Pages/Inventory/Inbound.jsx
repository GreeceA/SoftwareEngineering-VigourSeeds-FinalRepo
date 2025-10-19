import React, { useState } from 'react';
import { ArrowDownCircle, Package, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link, router } from '@inertiajs/react';
import Select from 'react-select';

const StockInboundForm = () => {
  const { errors } = usePage().props;
  const { auth, seeds, items } = usePage().props;

  // Array of products for this stock-in
  const [products, setProducts] = useState([
    { product_type: '', product_id: '', qty: '', unit: 'kg', notes: '' }
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const productTypes = [
    { value: 'seed', label: 'Seeds', icon: '🌱' },
    { value: 'item', label: 'Fertilizer/Pesticide', icon: '🧪' }
  ];

  const getCurrentProducts = (type) => {
    if (type === 'seed') return seeds;
    if (type === 'item') return items;
    return [];
  };

  const handleProductChange = (idx, field, value) => {
    setProducts(products =>
      products.map((p, i) =>
        i === idx
          ? {
              ...p,
              [field]: value,
              // Reset product_id and unit if type changes
              ...(field === 'product_type'
                ? { product_id: '', unit: value === 'seed' ? 'kg' : '' }
                : {}),
              // Set unit if product_id changes
              ...(field === 'product_id'
                ? {
                    unit:
                      getCurrentProducts(p.product_type).find(prod => prod.id === parseInt(value))?.unit ||
                      (p.product_type === 'seed' ? 'kg' : '')
                  }
                : {})
            }
          : p
      )
    );
  };

  const addProductRow = () => {
    setProducts([...products, { product_type: '', product_id: '', qty: '', unit: 'kg', notes: '' }]);
  };

  const removeProductRow = (idx) => {
    setProducts(products => products.filter((_, i) => i !== idx));
  };

  const isFormValid = products.every(
    p => p.product_type && p.product_id && p.qty > 0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post(route('inventory.inbound.store'), { products }, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setProducts([{ product_type: '', product_id: '', qty: '', unit: 'kg', notes: '' }]);
        }, 2000);
      }
    });
  };

  return (
    <AuthenticatedLayout user={auth.user} header={
      <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
        <span className="text-[#333333] font-[400]"> | Inventory Management</span>
      </h2>
    }>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <ArrowDownCircle className="text-green-600" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Stock Inbound</h1>
            </div>
            <p className="text-gray-600">Record incoming inventory to increase stock levels</p>
          </div>

          {showSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <p className="font-medium text-green-900">Stock received successfully!</p>
                <p className="text-sm text-green-700">Inventory has been updated.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            {products.map((product, idx) => (
              <div key={idx} className="mb-6 border-b pb-4 relative">
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProductRow(idx)}
                    className="absolute right-0 top-0 text-red-500 hover:text-red-700"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                {/* Product Type */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {productTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleProductChange(idx, 'product_type', type.value)}
                        className={`p-4 border-2 rounded-lg transition ${
                          product.product_type === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="text-sm font-medium text-gray-900">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {errors && errors[`products.${idx}.product_type`] && (
                  <div className="text-red-500 text-xs mb-1">
                    {errors[`products.${idx}.product_type`]}
                  </div>
                )}
                {/* Product Selection */}
                {product.product_type && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Product <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={getCurrentProducts(product.product_type).map(prod => ({
                        value: prod.id,
                        label: prod.name
                      }))}
                      value={
                        product.product_id
                          ? getCurrentProducts(product.product_type)
                              .map(prod => ({ value: prod.id, label: prod.name }))
                              .find(opt => opt.value === parseInt(product.product_id))
                          : null
                      }
                      onChange={opt => {
                        if (!opt) {
                          // If cleared, reset product_id and unit to default for type
                          handleProductChange(idx, 'product_id', '');
                          handleProductChange(idx, 'unit', product.product_type === 'seed' ? 'kg' : '');
                        } else {
                          handleProductChange(idx, 'product_id', opt.value);
                        }
                      }}
                      placeholder="Search or select product..."
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                )}
                {/* Quantity and Unit */}
                {product.product_id && (
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={product.qty}
                        onChange={e => handleProductChange(idx, 'qty', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter quantity"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit <span className="text-red-500">*</span>
                      </label>
                      {product.product_type === 'seed' ? (
                        <select
                          value={product.unit}
                          onChange={e => handleProductChange(idx, 'unit', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="kg">Kilogram (kg)</option>
                          <option value="sack">Sack</option>
                          <option value="ton">Ton</option>
                        </select>
                      ) : (
                        // For item, prefill and lock the unit
                        <input
                          type="text"
                          value={
                            items.find(i => i.id === parseInt(product.product_id))?.unit || ''
                          }
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                        />
                      )}
                    </div>
                  </div>
                )}
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={product.notes}
                    onChange={e => handleProductChange(idx, 'notes', e.target.value)}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add any relevant notes about this product..."
                  />
                </div>
                {/* Row-level Clear/Remove buttons */}
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleProductChange(idx, 'product_type', '');
                      handleProductChange(idx, 'product_id', '');
                      handleProductChange(idx, 'qty', '');
                      handleProductChange(idx, 'unit', 'kg');
                      handleProductChange(idx, 'notes', '');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addProductRow}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6"
            >
              <Plus size={18} />
              Add Another Product
            </button>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!isFormValid}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
              >
                <Package size={20} />
                Receive Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default StockInboundForm;