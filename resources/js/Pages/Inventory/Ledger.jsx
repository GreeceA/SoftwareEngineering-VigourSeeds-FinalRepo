import { ArrowDownCircle, Package, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link, router } from '@inertiajs/react';
import Select from 'react-select';
import React, { useState } from 'react';

const getToday = () => {
    return new Date().toISOString().split('T')[0];
}

const StockInboundForm = () => {
    const { errors: backendErrors } = usePage().props;
    const { auth, seeds, items } = usePage().props;

    const getMinExpirationDate = (manufactureDate) => {
        if (!manufactureDate) return '';
        const date = new Date(manufactureDate);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    // Initial state for a single product's errors
    const initialErrorState = {
        qty: '',
        receipt_date: '',
        manufacture_date: '',
        expiration_date: ''
    };

    // Array of products for this stock-in
    const [products, setProducts] = useState([
        { product_type: '', product_id: '', qty: '', unit: 'kg', notes: '', receipt_date: '', manufacture_date: '', expiration_date: '' }
    ]);

    // State to hold client-side validation errors
    const [fieldErrors, setFieldErrors] = useState([initialErrorState]);
    
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

    // Central validation function for a single product
    const validateProduct = (product) => {
        const errors = { ...initialErrorState };
        
        // 1. Stop if no product type is selected
        if (!product.product_type) {
            return errors;
        }

        // 2. Validate Product ID first.
        if (!product.product_id) {
            errors.product_id = 'Product is required.';
            // As requested: "only show the required error for the Select Product field"
            // By returning here, we don't validate qty or dates.
            return errors;
        }

        // --- Product ID is present, so we can validate the rest ---

        // 3. Quantity Validation (gt:0, lt:100000)
        const numQty = parseFloat(product.qty);
        if (!product.qty) errors.qty = 'Quantity is required.';
        else if (isNaN(numQty)) errors.qty = 'Must be a valid number.';
        else if (numQty <= 0) errors.qty = 'Quantity must be greater than 0.';
        else if (numQty >= 100000) errors.qty = 'Quantity must be less than 100,000.';
        
        // 4. Receipt Date Validation (required, before_or_equal:today)
        if (!product.receipt_date) errors.receipt_date = 'Receipt date is required.';
        else if (product.receipt_date > getToday()) {
            errors.receipt_date = 'Receipt date cannot be in the future.';
        }

        // 5. Manufacture Date Validation (required, before_or_equal:receipt_date)
        if (!product.manufacture_date) errors.manufacture_date = 'Manufacture date is required.';
        else if (product.receipt_date && product.manufacture_date > product.receipt_date) {
            errors.manufacture_date = 'Must be on or before the receipt date.';
        }

        // 6. Expiration Date Validation (required, after:manufacture_date)
        if (!product.expiration_date) errors.expiration_date = 'Expiration date is required.';
        else if (product.manufacture_date && product.expiration_date <= product.manufacture_date) {
            errors.expiration_date = 'Must be after the manufacture date.';
        }

        return errors;
    };

    const handleQuantityChange = (idx, e) => {
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

        // Allow up to 99,999.99
        if (numericValue > 99999.99) value = '99999.99';

        // Format with commas (even for 4 or 5 digits)
        if (value !== '') {
            const [integerPart, decimalPart] = value.split('.');
            // Pad with zeros if needed to allow typing up to 99999 before formatting
            const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            let formatted = formattedInteger;
            if (decimalPart !== undefined) {
                formatted += '.' + decimalPart;
            }
            value = formatted;
        }

        handleProductChange(idx, 'qty', value);
    };

    // Updated handler to manage state and trigger validation
    const handleProductChange = (idx, field, value) => {
        const newProducts = products.map((p, i) => {
            if (i !== idx) return p;

            let updatedProduct = { ...p, [field]: value };

            if (field === 'qty') {
                // STRIP COMMAS BEFORE VALIDATION
                const cleanValue = value.replace(/,/g, '');

                // Allow empty string (for clearing the field)
                if (cleanValue === '') {
                    updatedProduct.qty = '';
                } else {
                    // 1. Check for invalid characters
                    if (!/^\d*\.?\d*$/.test(cleanValue)) {
                        return p; // Revert to old state
                    }
                    
                    // 2. Check for more than 2 decimal places
                    const decimalParts = cleanValue.split('.');
                    if (decimalParts[1] && decimalParts[1].length > 2) {
                        return p; // Revert to old state
                    }

                    // 3. Check for max value (NOW WITH CLEAN VALUE)
                    const numValue = parseFloat(cleanValue);
                    if (numValue > 99999.99) {
                        return p; // Revert to old state
                    }
                    
                    // 4. Check for negatives
                    if (numValue < 0) {
                        return p; // Revert
                    }
                }
            }

            // Reset logic when product_type changes
            if (field === 'product_type') {
                updatedProduct = {
                    ...p,
                    product_type: value,
                    product_id: '',
                    qty: '',
                    unit: value === 'seed' ? 'kg' : '',
                    notes: '',
                    receipt_date: '',
                    manufacture_date: '',
                    expiration_date: ''
                };
            }

            // Auto-set unit when product_id changes
            if (field === 'product_id') {
                updatedProduct.unit = 
                    getCurrentProducts(p.product_type).find(prod => prod.id === parseInt(value))?.unit ||
                    (p.product_type === 'seed' ? 'kg' : '');
            }

            // Clear dependent dates if a parent date makes them invalid
            if (field === 'receipt_date' && updatedProduct.manufacture_date > value) {
                updatedProduct.manufacture_date = '';
                updatedProduct.expiration_date = '';
            }
            if (field === 'manufacture_date' && updatedProduct.expiration_date <= value) {
                updatedProduct.expiration_date = '';
            }

            return updatedProduct;
        });

        setProducts(newProducts);

        const newFieldErrors = newProducts.map(p => validateProduct(p));
        setFieldErrors(newFieldErrors);
    };

    const addProductRow = () => {
        setProducts([...products, { product_type: '', product_id: '', qty: '', unit: 'kg', notes: '', receipt_date: '', manufacture_date: '', expiration_date: '' }]);
        // Add a corresponding error object
        setFieldErrors([...fieldErrors, initialErrorState]);
        setFieldTouched(prev => [...prev, initialTouchedState]);
    };

    const removeProductRow = (idx) => {
        setProducts(products => products.filter((_, i) => i !== idx));
        // Remove the corresponding error object
        setFieldErrors(errors => errors.filter((_, i) => i !== idx));
        setFieldTouched(touched => touched.filter((_, i) => i !== idx));
    };

    // Check if all required fields are filled AND if all client-side error states are empty
    const isFormValid = products.every(
        (p, idx) =>
            p.product_type &&
            p.product_id &&
            p.qty &&
            p.receipt_date &&
            p.manufacture_date &&
            p.expiration_date &&
            fieldErrors[idx] &&
            Object.values(fieldErrors[idx]).every(err => err === '')
    );

    const initialTouchedState = {
        product_type: false,
        product_id: false,
        qty: false,
        unit: false,
        receipt_date: false,
        manufacture_date: false,
        expiration_date: false,
    };

    const handleBlur = (idx, field) => {
        setFieldTouched(prev => 
            prev.map((row, i) => 
                i === idx ? { ...row, [field]: true } : row
            )
        );
    };

    const [fieldTouched, setFieldTouched] = useState([initialTouchedState]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // NEW: Mark all fields as touched to show all errors on submit
        setFieldTouched(products.map(() => ({
            product_type: true,
            product_id: true,
            qty: true,
            unit: true,
            receipt_date: true,
            manufacture_date: true,
            expiration_date: true,
        })));
        
        // Final validation check (this is your existing logic)
        const finalErrors = products.map(p => validateProduct(p));
        setFieldErrors(finalErrors);
        
        const hasErrors = finalErrors.some(rowErrors => 
            Object.values(rowErrors).some(err => err !== '')
        );
        
        if (hasErrors || !isFormValid) {
            console.log("Form has errors, not submitting.");
            return;
        }

        const cleanedProducts = products.map(p => ({
            ...p,
            qty: p.qty ? parseFloat(String(p.qty).replace(/,/g, '')) : 0
        }));
        
        router.post(route('inventory.inbound.store'), { products: cleanedProducts }, {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    setProducts([{ product_type: '', product_id: '', qty: '', unit: 'kg', notes: '', receipt_date: '', manufacture_date: '', expiration_date: '' }]);
                    setFieldErrors([initialErrorState]);
                    setFieldTouched([initialTouchedState]); // Reset touched state
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
                                {backendErrors && backendErrors[`products.${idx}.product_type`] && (
                                    <div className="text-red-500 text-xs mb-1">
                                        {backendErrors[`products.${idx}.product_type`]}
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
                                                    handleProductChange(idx, 'product_id', '');
                                                    handleProductChange(idx, 'unit', product.product_type === 'seed' ? 'kg' : '');
                                                } else {
                                                    handleProductChange(idx, 'product_id', opt.value);
                                                }
                                            }}
                                            onBlur={() => handleBlur(idx, 'product_id')} // ADD THIS
                                            placeholder="Search or select product..."
                                            isClearable
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                        />
                                        { (fieldErrors[idx]?.product_id && fieldTouched[idx]?.product_id) && (
                                            <p className="text-red-500 text-xs mt-1">{fieldErrors[idx].product_id}</p>
                                        )}
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
                                                type="text"
                                                inputMode="decimal"
                                                value={product.qty}
                                                onBlur={() => handleBlur(idx, 'qty')}
                                                onChange={e => handleQuantityChange(idx, e)}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                                                    fieldTouched[idx]?.qty && fieldErrors[idx]?.qty
                                                        ? 'border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:ring-blue-500'
                                                }`}
                                                placeholder="Enter quantity"
                                                required
                                            />
                                            <span className="text-xs text-gray-500 block mt-1">Valid range: ₱0.01–₱99,999.99</span>
                                            {/* Error Display */}
                                            {fieldTouched[idx]?.qty && fieldErrors[idx]?.qty && (
                                                <p className="text-red-500 text-xs mt-1">{fieldErrors[idx].qty}</p>
                                            )}
                                            {/* Keep backend error display */}
                                            {backendErrors && backendErrors[`products.${idx}.qty`] && (
                                                <p className="text-red-500 text-xs mt-1">{backendErrors[`products.${idx}.qty`]}</p>
                                            )}
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
                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Receipt Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={product.receipt_date || ''}
                                            onBlur={() => handleBlur(idx, 'receipt_date')} // ADD THIS
                                            onChange={e => handleProductChange(idx, 'receipt_date', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg ${
                                                fieldTouched[idx]?.receipt_date && fieldErrors[idx]?.receipt_date
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                            required
                                            max={getToday()}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Actual day the stock was delivered and received.
                                        </p>
                                        {/* MODIFIED Error Display */}
                                        { (fieldErrors[idx]?.receipt_date && fieldTouched[idx]?.receipt_date) && (
                                            <p className="text-red-500 text-xs mt-1">{fieldErrors[idx].receipt_date}</p>
                                        )}
                                        {/* Keep backend error display */}
                                        {backendErrors && backendErrors[`products.${idx}.receipt_date`] && (
                                            <p className="text-red-500 text-xs mt-1">{backendErrors[`products.${idx}.receipt_date`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Manufacture Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={product.manufacture_date || ''}
                                            onBlur={() => handleBlur(idx, 'manufacture_date')}
                                            onChange={e => handleProductChange(idx, 'manufacture_date', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg ${
                                                fieldTouched[idx]?.manufacture_date && fieldErrors[idx]?.manufacture_date
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                            required
                                            max={product.receipt_date || getToday()}
                                            disabled={!product.receipt_date}
                                        />
                                        {!product.receipt_date && (
                                            <p className="text-xs text-amber-600 mt-1">
                                                Please enter receipt date first.
                                            </p>
                                        )}
                                        {/* Error Display */}
                                        { (fieldErrors[idx]?.manufacture_date && fieldTouched[idx]?.manufacture_date) && (
                                            <p className="text-red-500 text-xs mt-1">{fieldErrors[idx].manufacture_date}</p>
                                        )}
                                        {/* Keep backend error display */}
                                        {backendErrors && backendErrors[`products.${idx}.manufacture_date`] && (
                                            <p className="text-red-500 text-xs mt-1">{backendErrors[`products.${idx}.manufacture_date`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Expiration Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={product.expiration_date || ''}
                                            onBlur={() => handleBlur(idx, 'expiration_date')}
                                            onChange={e => handleProductChange(idx, 'expiration_date', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg ${
                                                fieldTouched[idx]?.expiration_date && fieldErrors[idx]?.expiration_date
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                            required
                                            min={getMinExpirationDate(product.manufacture_date)}
                                            disabled={!product.manufacture_date}
                                        />
                                        {!product.manufacture_date && (
                                            <p className="text-xs text-amber-600 mt-1">
                                                Please enter manufacture date first.
                                            </p>
                                        )}
                                        {/* Error Display */}
                                        { (fieldErrors[idx]?.expiration_date && fieldTouched[idx]?.expiration_date) && (
                                            <p className="text-red-500 text-xs mt-1">{fieldErrors[idx].expiration_date}</p>
                                        )}
                                        {/* Keep backend error display */}
                                        {backendErrors && backendErrors[`products.${idx}.expiration_date`] && (
                                            <p className="text-red-500 text-xs mt-1">{backendErrors[`products.${idx}.expiration_date`]}</p>
                                        )}
                                    </div>
                                </div>
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
                                            // Clear the product row
                                            setProducts(products => products.map((p, i) => 
                                                i === idx ? { product_type: '', product_id: '', qty: '', unit: 'kg', notes: '', receipt_date: '', manufacture_date: '', expiration_date: '' } : p
                                            ));
                                            // Clear the corresponding errors
                                            setFieldErrors(errors => errors.map((e, i) => 
                                                i === idx ? initialErrorState : e
                                            ));
                                            setFieldTouched(touched => touched.map((t, i) => 
                                                i === idx ? initialTouchedState : t
                                            ));
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