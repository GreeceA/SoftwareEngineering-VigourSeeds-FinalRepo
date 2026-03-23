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

    const validateProduct = (product) => {
        const errors = { ...initialErrorState };

        if (!product.product_type) {
            return errors;
        }

        if (!product.product_id) {
            errors.product_id = 'Product is required.';
            return errors;
        }

        // --- Product ID is present, so we can validate the rest ---
        const numQty = parseFloat(product.qty);
        if (!product.qty) errors.qty = 'Quantity is required.';
        else if (isNaN(numQty)) errors.qty = 'Must be a valid number.';
        else if (numQty <= 0) errors.qty = 'Quantity must be greater than 0.';
        else if (numQty >= 100000) errors.qty = 'Quantity must be less than 100,000.';

        if (!product.receipt_date) errors.receipt_date = 'Receipt date is required.';
        else if (product.receipt_date > getToday()) {
            errors.receipt_date = 'Receipt date cannot be in the future.';
        }

        if (!product.manufacture_date) errors.manufacture_date = 'Manufacture date is required.';
        else if (product.receipt_date && product.manufacture_date > product.receipt_date) {
            errors.manufacture_date = 'Must be on or before the receipt date.';
        }

        if (!product.expiration_date) errors.expiration_date = 'Expiration date is required.';
        else if (product.manufacture_date && product.expiration_date <= product.manufacture_date) {
            errors.expiration_date = 'Must be after the manufacture date.';
        }

        return errors;
    };

    const handleQuantityChange = (idx, e) => {
        let value = e.target.value.replace(/,/g, '');

        value = value.replace(/[^0-9.]/g, '');

        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        if (parts[1]?.length > 2) {
            value = parts[0] + '.' + parts[1].slice(0, 2);
        }

        let numericValue = parseFloat(value);
        if (numericValue < 0) value = '0';

        if (numericValue > 99999.99) value = '99999.99';

        if (value !== '') {
            const [integerPart, decimalPart] = value.split('.');
            const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            let formatted = formattedInteger;
            if (decimalPart !== undefined) {
                formatted += '.' + decimalPart;
            }
            value = formatted;
        }

        handleProductChange(idx, 'qty', value);
    };

    const handleProductChange = (idx, field, value) => {
        const newProducts = products.map((p, i) => {
            if (i !== idx) return p;

            let updatedProduct = { ...p, [field]: value };

            if (field === 'qty') {
                const cleanValue = value.replace(/,/g, '');

                if (cleanValue === '') {
                    updatedProduct.qty = '';
                } else {
                    if (!/^\d*\.?\d*$/.test(cleanValue)) {
                        return p; 
                    }

                    const decimalParts = cleanValue.split('.');
                    if (decimalParts[1] && decimalParts[1].length > 2) {
                        return p; 
                    }

                    const numValue = parseFloat(cleanValue);
                    if (numValue > 99999.99) {
                        return p; 
                    }

                    if (numValue < 0) {
                        return p; 
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
        setFieldErrors([...fieldErrors, initialErrorState]);
        setFieldTouched(prev => [...prev, initialTouchedState]);
    };

    const removeProductRow = (idx) => {
        setProducts(products => products.filter((_, i) => i !== idx));
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
            preserveScroll: true,
            onSuccess: () => {
                // Redirect happens automatically to dashboard
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Modern Page Header */}
            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white border-b border-gray-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative px-6 py-6">
                    <nav className="flex items-center space-x-2 text-sm mb-4">
                        <a href={route('dashboard')} className="text-gray-500 hover:text-[#37692F] transition-colors duration-200 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </a>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <a href={route('inventory.dashboard')} className="text-gray-500 hover:text-[#37692F] transition-colors duration-200">
                            Inventory
                        </a>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#37692F] font-medium">Stock Inbound</span>
                    </nav>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <ArrowDownCircle className="text-white" size={32} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Stock Inbound</h1>
                                <p className="text-gray-600">Record incoming inventory to increase stock levels</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-3xl mx-auto">

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
                                                className={`p-4 border-2 rounded-lg transition ${product.product_type === type.value
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
                                            onBlur={() => handleBlur(idx, 'product_id')}
                                            placeholder="Search or select product..."
                                            isClearable
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                        />
                                        {(fieldErrors[idx]?.product_id && fieldTouched[idx]?.product_id) && (
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
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${fieldTouched[idx]?.qty && fieldErrors[idx]?.qty
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
                                            onBlur={() => handleBlur(idx, 'receipt_date')}
                                            onChange={e => handleProductChange(idx, 'receipt_date', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg ${fieldTouched[idx]?.receipt_date && fieldErrors[idx]?.receipt_date
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
                                        {(fieldErrors[idx]?.receipt_date && fieldTouched[idx]?.receipt_date) && (
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
                                            className={`w-full px-4 py-2 border rounded-lg ${fieldTouched[idx]?.manufacture_date && fieldErrors[idx]?.manufacture_date
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
                                        {(fieldErrors[idx]?.manufacture_date && fieldTouched[idx]?.manufacture_date) && (
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
                                            className={`w-full px-4 py-2 border rounded-lg ${fieldTouched[idx]?.expiration_date && fieldErrors[idx]?.expiration_date
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
                                        {(fieldErrors[idx]?.expiration_date && fieldTouched[idx]?.expiration_date) && (
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