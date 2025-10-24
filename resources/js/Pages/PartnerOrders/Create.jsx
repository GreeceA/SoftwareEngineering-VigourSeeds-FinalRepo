import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link, router } from '@inertiajs/react';

// Helper for date validation
const getToday = () => {
  return new Date().toISOString().split('T')[0];
}

const CreatePartnerOrder = () => {
  const { auth, partners, contracts, fertilizers, pesticides } = usePage().props;
  const { errors: backendErrors = {} } = usePage().props; // Get backend errors

  // === HEADER STATE ===
  const [formData, setFormData] = useState({
    partner_id: '',
    contract_id: '',
    order_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const initialHeaderErrors = { partner_id: '', contract_id: '', order_date: '' };
  const [headerErrors, setHeaderErrors] = useState(initialHeaderErrors);
  const [headerTouched, setHeaderTouched] = useState({
    partner_id: false, contract_id: false, order_date: false
  });

  // === ORDER LINES STATE ===
  const [orderLines, setOrderLines] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showContractProducts, setShowContractProducts] = useState(false); // This seems unused, but I'll leave it

  // === CURRENT LINE STATE ===
  const initialLineState = {
    product_type: '',
    product_id: '',
    qty: '',
    unit: 'kg',
    price_per_unit: ''
  };
  const [currentLine, setCurrentLine] = useState(initialLineState);
  const [lineWarning, setLineWarning] = useState({ qty: '' });

  const initialLineErrors = { product_type: '', product_id: '', qty: '' };
  const [lineErrors, setLineErrors] = useState(initialLineErrors);
  const [lineTouched, setLineTouched] = useState({
    product_type: false, product_id: false, qty: false
  });

  // === PRODUCT DATA ===
  const products = {
    fertilizer: fertilizers || [],
    pesticide: pesticides || []
    // Note: 'seed' products seem to come from contracts, not this object
  };

  // === VALIDATION FUNCTIONS ===

  // Validates the main order info (header)
  const validateHeader = (data) => {
    const errors = { ...initialHeaderErrors };
    if (!data.partner_id) {
      errors.partner_id = 'Partner is required.';
    }
    // Only require contract if partner is selected
    if (data.partner_id && !data.contract_id) {
      errors.contract_id = 'Contract is required.';
    }
    if (!data.order_date) {
      errors.order_date = 'Order date is required.';
    } else if (data.order_date > getToday()) {
      errors.order_date = 'Order date cannot be in the future.';
    }
    return errors;
  };

  // Validates the "Add Order Line" form
  // Validates the "Add Order Line" form
  const validateLine = (line) => {
    const errors = { ...initialLineErrors };
    
    // Validate product type
    if (!line.product_type) {
      errors.product_type = 'Product type is required.';
    }
    
    // Validate product ID
    if (!line.product_id) {
      errors.product_id = 'Product is required.';
    }

    // Quantity validation - ALWAYS RUN (don't return early)
    const cleanQty = String(line.qty).replace(/,/g, '');
    const numQty = parseFloat(cleanQty);
    
    if (!line.qty || cleanQty === '') {
      errors.qty = 'Quantity is required.';
    } else if (isNaN(numQty)) {
      errors.qty = 'Must be a valid number.';
    } else if (numQty <= 0) {
      errors.qty = 'Quantity must be greater than 0.';
    } else if (numQty > 99999.99) {
      errors.qty = 'Quantity must be 99,999.99 or less.';
    }
    
    return errors;
  };

  // === EVENT HANDLERS (HEADER) ===

  const handleHeaderChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };

    // Reset contract if partner changes
    if (field === 'partner_id') {
      newFormData.contract_id = '';
      setHeaderTouched(prev => ({ ...prev, contract_id: false })); // Reset contract touched state
    }

    setFormData(newFormData);
    // Re-validate header on every change
    setHeaderErrors(validateHeader(newFormData));
  };

  const handleHeaderBlur = (field) => {
    setHeaderTouched(prev => ({ ...prev, [field]: true }));
    // Re-validate on blur
    setHeaderErrors(validateHeader(formData));
  };
  
  // === EVENT HANDLERS (LINE) ===

  
  const handleLineChange = (field, value) => {
  let newLine = { ...currentLine, [field]: value };

  // Reset product/qty if type changes
  if (field === 'product_type') {
    newLine = {
      ...initialLineState,
      product_type: value,
    };
    // Reset touched state for line
    setLineTouched({ product_type: true, product_id: false, qty: false });
    setLineWarning({ qty: '' }); // Clear warning
  }

  // Clear warning when product changes
  if (field === 'product_id') {
    setLineWarning({ qty: '' });
    const productList = products[newLine.product_type] || [];
    const selectedProduct = productList.find(p => p.id === parseInt(value));
    newLine.unit = selectedProduct?.unit || 'kg';
    newLine.price_per_unit = selectedProduct?.price || '';
  }

  // QTY validation block
  if (field === 'qty') {
    const cleanValue = value.replace(/,/g, '');

    if (cleanValue === '') {
      newLine.qty = '';
    } else {
      if (!/^\d*\.?\d*$/.test(cleanValue)) {
        return;
      }
      
      const decimalParts = cleanValue.split('.');
      if (decimalParts[1] && decimalParts[1].length > 2) {
        return;
      }

      const numValue = parseFloat(cleanValue);
      if (numValue > 99999.99) {
        return;
      }
      
      if (numValue < 0) {
        return;
      }
    }
  }
  
  setCurrentLine(newLine);
  setLineErrors(validateLine(newLine));
};


  const handleLineBlur = (field) => {
    setLineTouched(prev => ({ ...prev, [field]: true }));
    // Re-validate on blur
    setLineErrors(validateLine(currentLine));
  };

  // Special handler for Quantity input to FILTER invalid values
  // Add this handler in your CreatePartnerOrder component
  const handleQuantityChange = (e) => {
  let value = e.target.value.replace(/,/g, '');

  // Only allow numbers and dot
  value = value.replace(/[^0-9.]/g, '');

  // Only one dot
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  // Only two decimals
  if (parts[1]?.length > 2) {
    value = parts[0] + '.' + parts[1].slice(0, 2);
  }

  // Prevent negative
  let numericValue = parseFloat(value);
  if (numericValue < 0) value = '0';

  // Allow up to 99,999.99 (check AFTER removing commas)
  if (numericValue > 99999.99) {
    value = '99999.99';
  }

  // Format with commas (only if not empty)
  if (value !== '') {
    const [integerPart, decimalPart] = value.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let formatted = formattedInteger;
    if (decimalPart !== undefined) {
      formatted += '.' + decimalPart;
    }
    value = formatted;
  }

  // Check stock and set warning
  if (currentLine.product_id && value !== '') {
    const productList = products[currentLine.product_type] || [];
    const selectedProduct = productList.find(p => p.id === parseInt(currentLine.product_id));
    const availableStock = selectedProduct?.available_stock || 0;
    const cleanQty = parseFloat(value.replace(/,/g, ''));

    if (cleanQty > availableStock) {
      setLineWarning({ 
        qty: `Warning: Available stock is only ${availableStock.toLocaleString()} ${selectedProduct?.unit || ''}` 
      });
    } else {
      setLineWarning({ qty: '' });
    }
  } else {
    setLineWarning({ qty: '' });
  }

  handleLineChange('qty', value);
};


  // === DATA GETTERS ===

  const getAvailableContracts = () => {
    if (!formData.partner_id) return [];
    return contracts.filter(
      c => c.partner_id === parseInt(formData.partner_id) && c.status === 'active'
    );
  };

  const getSelectedContract = () => {
    if (!formData.contract_id) return null;
    return contracts.find(c => c.id === parseInt(formData.contract_id));
  };

  const getEligiblePartners = () => {
    return partners.filter(partner => {
      const hasContract = contracts.some(contract => contract.partner_id === partner.id);
      return partner.status === 'active' && hasContract;
    });
  };

  const getCurrentProducts = () => {
    if (!currentLine.product_type) return [];
    return products[currentLine.product_type] || [];
  };

  const getTotalValue = () => {
    return orderLines.reduce((sum, line) => sum + line.total, 0);
  };


  // === FORM ACTIONS ===

  const addOrderLine = () => {
  setLineTouched({ product_type: true, product_id: true, qty: true });

  const errors = validateLine(currentLine);
  setLineErrors(errors);

  const hasErrors = Object.values(errors).some(err => err !== '');
  if (hasErrors) {
    return;
  }

  const productList = products[currentLine.product_type] || [];
  const product = productList.find(p => p.id === parseInt(currentLine.product_id));
  const availableStock = product?.available_stock || 0;
  const cleanQty = parseFloat(String(currentLine.qty).replace(/,/g, ''));

  const newLine = {
    id: Date.now(),
    product_type: currentLine.product_type,
    product_id: currentLine.product_id,
    product_name: product?.name || '',
    qty: cleanQty,
    unit: currentLine.unit,
    price_per_unit: parseFloat(currentLine.price_per_unit || 0),
    total: cleanQty * parseFloat(currentLine.price_per_unit || 0),
    available_stock: availableStock,
    is_backordered: cleanQty > availableStock // Add backorder flag
  };

  setOrderLines([...orderLines, newLine]);
  
  setCurrentLine(initialLineState);
  setLineErrors(initialLineErrors);
  setLineTouched({ product_type: false, product_id: false, qty: false });
  setLineWarning({ qty: '' }); // Clear warning
};

  const removeOrderLine = (lineId) => {
    setOrderLines(orderLines.filter(line => line.id !== lineId));
  };

  // Note: This function adds seeds from a contract.
  // It bypasses the "currentLine" validation, which is correct.
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
      available_stock: products.seed?.find(s => s.id === commitment.seed_id)?.available_stock || 0
    };

    setOrderLines([...orderLines, newLine]);
  };

  // Check if header is valid
  const isHeaderValid = () => {
    const errors = validateHeader(formData);
    return Object.values(errors).every(err => err === '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Mark all header fields as touched
    setHeaderTouched({ partner_id: true, contract_id: true, order_date: true });

    // 2. Validate header
    const errors = validateHeader(formData);
    setHeaderErrors(errors);

    
    // 3. Check for errors or no lines
    const hasHeaderErrors = Object.values(errors).some(err => err !== '');
    if (hasHeaderErrors || orderLines.length === 0) {
      console.log("Form has header errors or no lines, not submitting.");
      return;
    }

    // 4. Prep data and submit
     const linesToSend = orderLines.map(line => ({
      ...line,
      qty: line.qty ? parseFloat(String(line.qty).replace(/,/g, '')) : 0
    }));

    router.post(route('partner-orders.store'), {
      ...formData,
      lines: linesToSend
    }, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          // Reset form completely
          setFormData({
            partner_id: '',
            contract_id: '',
            order_date: new Date().toISOString().split('T')[0],
            notes: ''
          });
          setOrderLines([]);
          setHeaderErrors(initialHeaderErrors);
          setHeaderTouched({ partner_id: false, contract_id: false, order_date: false });
          setCurrentLine(initialLineState);
          setLineErrors(initialLineErrors);
          setLineTouched({ product_type: false, product_id: false, qty: false });

        }, 2000);
      },
      onError: (errors) => {
        // Note: backendErrors prop will be auto-populated by Inertia
        console.error("Backend errors:", errors);
        alert('Failed to create order. Please check your inputs.');
      }
    });
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

        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <div>
              <p className="font-medium text-green-900">Order created successfully!</p>
              <p className="text-sm text-green-700">You can now fulfill this order from inventory.</p>
            </div>
          </div>
        )}

        {/* --- FORM START --- */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    onChange={(e) => handleHeaderChange('partner_id', e.target.value)}
                    onBlur={() => handleHeaderBlur('partner_id')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      (headerErrors.partner_id && headerTouched.partner_id) || backendErrors.partner_id
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Choose a partner...</option>
                    {getEligiblePartners().map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.name}
                      </option>
                    ))}
                  </select>
                  {/* Client Error */}
                  {(headerErrors.partner_id && headerTouched.partner_id) && (
                    <p className="text-red-500 text-xs mt-1">{headerErrors.partner_id}</p>
                  )}
                  {/* Backend Error */}
                  {backendErrors.partner_id && (
                     <p className="text-red-500 text-xs mt-1">{backendErrors.partner_id}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.order_date}
                    max={getToday()} // Prevent future dates
                    onChange={(e) => handleHeaderChange('order_date', e.target.value)}
                    onBlur={() => handleHeaderBlur('order_date')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      (headerErrors.order_date && headerTouched.order_date) || backendErrors.order_date
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                   {/* Client Error */}
                  {(headerErrors.order_date && headerTouched.order_date) && (
                    <p className="text-red-500 text-xs mt-1">{headerErrors.order_date}</p>
                  )}
                   {/* Backend Error */}
                  {backendErrors.order_date && (
                     <p className="text-red-500 text-xs mt-1">{backendErrors.order_date}</p>
                  )}
                </div>
              </div>

              {/* --- Contract Select --- */}
              {formData.partner_id && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link to Contract <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.contract_id}
                    onChange={(e) => handleHeaderChange('contract_id', e.target.value)}
                    onBlur={() => handleHeaderBlur('contract_id')}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      (headerErrors.contract_id && headerTouched.contract_id) || backendErrors.contract_id
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select a contract...</option>
                    {getAvailableContracts().map((contract) => (
                      <option key={contract.id} value={contract.id}>
                        {contract.contract_name}
                      </option>
                    ))}
                  </select>
                  {/* Client Error */}
                  {(headerErrors.contract_id && headerTouched.contract_id) && (
                    <p className="text-red-500 text-xs mt-1">{headerErrors.contract_id}</p>
                  )}
                   {/* Backend Error */}
                  {backendErrors.contract_id && (
                     <p className="text-red-500 text-xs mt-1">{backendErrors.contract_id}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleHeaderChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes about this order..."
                />
              </div>
            </div>

            {/* Add Order Line */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Order Line</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'fertilizer', label: 'Fertilizer', icon: '🧪' },
                    { value: 'pesticide', label: 'Pesticide', icon: '🧴' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleLineChange('product_type', type.value)}
                      className={`p-3 border-2 rounded-lg transition ${
                        currentLine.product_type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : (lineErrors.product_type && lineTouched.product_type)
                            ? 'border-red-500'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{type.label}</div>
                    </button>
                  ))}
                </div>
                {(lineErrors.product_type && lineTouched.product_type) && (
                  <p className="text-red-500 text-xs mt-1">{lineErrors.product_type}</p>
                )}
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
                        onChange={(e) => handleLineChange('product_id', e.target.value)}
                        onBlur={() => handleLineBlur('product_id')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                          (lineErrors.product_id && lineTouched.product_id)
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      >
                        <option value="">Choose a product...</option>
                        {getCurrentProducts().map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} (Stock: {product.available_stock} {product.unit})
                          </option>
                        ))}
                      </select>
                      {(lineErrors.product_id && lineTouched.product_id) && (
                        <p className="text-red-500 text-xs mt-1">{lineErrors.product_id}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                            type="text"
                            inputMode="decimal"
                            value={currentLine.qty}
                            onChange={handleQuantityChange}
                            onBlur={() => handleLineBlur('qty')}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                              (lineErrors.qty && lineTouched.qty)
                                ? 'border-red-500 focus:ring-red-500'
                                : lineWarning.qty
                                  ? 'border-amber-500 focus:ring-amber-500'
                                  : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="0.00"
                          />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {currentLine.unit}
                        </span>
                      </div>
                      {(lineErrors.qty && lineTouched.qty) && (
                        <p className="text-red-500 text-xs mt-1">{lineErrors.qty}</p>
                      )}
                      {/* Warning Display */}
                      {lineWarning.qty && !(lineErrors.qty && lineTouched.qty) && (
                        <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {lineWarning.qty}
                        </p>
                      )}
                      <span className="text-xs text-gray-500 block mt-1">Valid range: 0.01–99,999.99</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={currentLine.unit}
                        disabled
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="liter">Liter</option>
                        <option value="sack">Sack</option>
                        <option value="ton">Ton</option>
                        {currentLine.unit && !['kg', 'liter', 'sack', 'ton'].includes(currentLine.unit) && (
                          <option value={currentLine.unit}>{currentLine.unit.charAt(0).toUpperCase() + currentLine.unit.slice(1)}</option>
                        )}
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
                          readOnly
                          disabled
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
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

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentLine(initialLineState);
                        setLineErrors(initialLineErrors);
                        setLineTouched({ product_type: false, product_id: false, qty: false });
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={addOrderLine}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <Plus size={20} />
                      Add Line to Order
                    </button>
                  </div>
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
                            {line.is_backordered && (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-600 mt-1">
                                <AlertCircle size={12} />
                                Backordered
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold">{line.qty} {line.unit}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-gray-900">₱{line.price_per_unit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
                          {getSelectedContract()?.contract_name}
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
                    type="submit" // Change to type="submit"
                    // onClick={handleSubmit} // This is now redundant on a type="submit"
                    disabled={!isHeaderValid() || orderLines.length === 0} // Disable if header invalid OR no lines
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
        </form>
        {/* --- FORM END --- */}
      </div>
    </div>
    </AuthenticatedLayout>
  );
};

export default CreatePartnerOrder;