import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AlertCircle, Plus, Minus, Package } from 'lucide-react';

const Adjustment = ({ auth, seeds, items }) => {
    const [selectedProductType, setSelectedProductType] = useState('seed');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [adjustmentType, setAdjustmentType] = useState('add');
    const [qtyError, setQtyError] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        product_type: 'seed',
        product_id: '',
        qty: '',
        unit: 'kg',
        notes: '',
    });

    const products = selectedProductType === 'seed' ? seeds : items;

    const handleQtyChange = (e) => {
        let value = e.target.value;

        // Block negative input for "Add Stock"
        if (adjustmentType === 'add') {
            if (value.startsWith('-')) {
                value = value.substring(1);
            }
        }

        // Block positive input for "Subtract Stock"  
        if (adjustmentType === 'subtract') {
            if (value && !value.startsWith('-') && value !== '0') {
                value = '-' + value;
            }
        }

        // Limit to 2 decimals
        if (value && value.includes('.')) {
            const parts = value.split('.');
            const int = parts[0];
            const dec = parts[1];
            if (dec && dec.length > 2) {
                value = int + '.' + dec.slice(0, 2);
            }
        }

        // Validation for error display
        let error = '';
        if (adjustmentType === 'add') {
            if (value === '' || parseFloat(value) <= 0) {
                error = 'Enter a positive quantity to add stock.';
            }
        } else {
            if (value === '' || parseFloat(value) >= 0) {
                error = 'Enter a negative quantity to subtract stock.';
            } else if (selectedProduct) {
                // Check if subtraction will cause negative stock
                const adjustmentAmount = Math.abs(parseFloat(value));
                const currentStock = selectedProduct.current_stock || 0;
                if (adjustmentAmount > currentStock) {
                    error = `Cannot subtract ${adjustmentAmount} ${data.unit}. Only ${currentStock} ${data.unit} available in stock.`;
                }
            }
        }

        setQtyError(error);
        setData('qty', value);
    };

    const calculateNewStock = () => {
        if (!selectedProduct || !data.qty) return null;
        const adjustment = adjustmentType === 'subtract' ? -Math.abs(parseFloat(data.qty)) : Math.abs(parseFloat(data.qty));
        return (selectedProduct.current_stock || 0) + adjustment;
    };

    // Suggested reasons based on adjustment type
    const suggestedReasons = {
        add: [
            'Physical count correction - found extra stock',
            'Previously unrecorded inventory',
            'Supplier bonus/free goods',
            'Returned goods from partner',
            'Correction of data entry error',
        ],
        subtract: [
            'Physical count correction - shortage found',
            'Damaged/spoiled stock',
            'Lost/stolen inventory',
            'Expired products disposal',
            'Quality control rejection',
            'Correction of data entry error',
        ],
    };

    const handleProductChange = (productId) => {
        const product = products.find(p => p.id === parseInt(productId));
        setSelectedProduct(product);
        setData({
            ...data,
            product_id: productId,
            product_type: selectedProductType === 'seed' ? 'Seed' : 'item',
            unit: product?.unit || 'kg',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const finalQty = adjustmentType === 'subtract' ? -Math.abs(parseFloat(data.qty)) : Math.abs(parseFloat(data.qty));
        
        post(route('inventory.adjustment.store'), {
            data: {
                ...data,
                qty: finalQty,
            },
            onSuccess: () => {
                reset();
                setSelectedProduct(null);
            },
        });
    };

    const handleReasonClick = (reason) => {
        setData('notes', reason);
    };

    const newStock = calculateNewStock();

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
                        <span className="text-[#37692F] font-medium">Stock Adjustment</span>
                    </nav>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <Package className="text-white" size={32} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Stock Adjustment</h1>
                                <p className="text-gray-600">Manually adjust inventory levels for physical count corrections</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                            <div>
                                <h3 className="font-medium text-blue-900">About Stock Adjustments</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    Use this form to correct inventory discrepancies after physical counts, account for damaged/lost stock, 
                                    or add previously unrecorded inventory. All adjustments are logged for audit purposes.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Type
                            </label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedProductType('seed');
                                        setSelectedProduct(null);
                                        setData({ ...data, product_type: 'Seed', product_id: '', unit: 'kg' });
                                    }}
                                    className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition ${
                                        selectedProductType === 'seed'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    🌱 Seeds
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedProductType('item');
                                        setSelectedProduct(null);
                                        setData({ ...data, product_type: 'item', product_id: '', unit: 'kg' });
                                    }}
                                    className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition ${
                                        selectedProductType === 'item'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    🧪 Items (Fertilizer/Pesticide)
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Product
                            </label>
                            <select
                                value={data.product_id}
                                onChange={(e) => handleProductChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            >
                                <option value="">-- Select a product --</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name || product.seed_variety} 
                                        {product.current_stock !== null && ` (Current: ${product.current_stock} ${product.unit})`}
                                    </option>
                                ))}
                            </select>
                            {errors.product_id && <p className="text-red-600 text-sm mt-1">{errors.product_id}</p>}
                        </div>

                        {selectedProduct && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Package className="text-gray-600" size={24} />
                                        <div>
                                            <p className="text-sm text-gray-600">Current Stock</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {selectedProduct.current_stock?.toLocaleString() || 0} {selectedProduct.unit}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Adjustment Type
                            </label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAdjustmentType('add');
                                        setData('qty', ''); // Clear quantity
                                        setQtyError(''); // Clear error
                                    }}
                                    className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition flex items-center justify-center gap-2 ${
                                        adjustmentType === 'add'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Plus size={20} />
                                    Add Stock
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setAdjustmentType('subtract');
                                        setData('qty', ''); // Clear quantity
                                        setQtyError(''); // Clear error
                                    }}
                                    className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition flex items-center justify-center gap-2 ${
                                        adjustmentType === 'subtract'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Minus size={20} />
                                    Subtract Stock
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Adjustment Quantity
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.qty}
                                    onChange={handleQtyChange}
                                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${qtyError ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder={adjustmentType === 'add' ? "e.g., 100" : "e.g., -50"}
                                    required
                                />
                                <input
                                    type="text"
                                    value={data.unit}
                                    disabled
                                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                                />
                            </div>
                            {(qtyError || errors.qty) && (
                                <p className="text-red-600 text-sm mt-1">{qtyError || errors.qty}</p>
                            )}
                        </div>

                        {newStock !== null && selectedProduct && (
                            <div className={`rounded-lg p-4 border-2 ${
                                newStock < 0 
                                    ? 'bg-red-50 border-red-300' 
                                    : adjustmentType === 'add' 
                                        ? 'bg-green-50 border-green-300' 
                                        : 'bg-yellow-50 border-yellow-300'
                            }`}>
                                <p className="text-sm font-medium text-gray-700 mb-1">New Stock Level (After Adjustment)</p>
                                <p className={`text-3xl font-bold ${
                                    newStock < 0 ? 'text-red-700' : 'text-gray-900'
                                }`}>
                                    {newStock.toLocaleString()} {data.unit}
                                </p>
                                {newStock < 0 && (
                                    <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        ⚠️ Error: Cannot subtract more than available stock!
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Adjustment <span className="text-red-500">*</span>
                            </label>
                            
                            <div className="mb-3">
                                <p className="text-xs text-gray-600 mb-2">Quick select a common reason:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedReasons[adjustmentType].map((reason, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleReasonClick(reason)}
                                            className={`px-3 py-1.5 text-xs rounded-full border transition ${
                                                data.notes === reason
                                                    ? 'bg-green-100 border-green-500 text-green-800 font-medium'
                                                    : 'bg-white border-gray-300 text-gray-700 hover:border-green-400 hover:bg-green-50'
                                            }`}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Click a suggestion above or type your own reason..."
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Provide a clear reason for audit purposes
                            </p>
                            {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes}</p>}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={processing || !selectedProduct || !!qtyError}
                                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition"
                            >
                                {processing ? 'Recording...' : 'Record Adjustment'}
                            </button>
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Adjustment;