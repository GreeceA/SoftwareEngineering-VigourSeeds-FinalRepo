import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link, router } from '@inertiajs/react'; 
import Select from 'react-select'; 

const StockOutboundForm = () => {
    const { auth, partnerOrders, errors: backendErrors, prefilledOrderId } = usePage().props;

    const [formData, setFormData] = useState({
        partner_order_id: '',
        partner_order_line_id: '',
        qty: '',
        notes: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedLine, setSelectedLine] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle prefilled order on component mount
    useEffect(() => {
        if (prefilledOrderId) {
            const order = partnerOrders.find(o => o.id === parseInt(prefilledOrderId));
            if (order) {
                setSelectedOrder(order);
                setFormData(prev => ({
                    ...prev,
                    partner_order_id: prefilledOrderId.toString()
                }));
            }
        }
    }, [prefilledOrderId, partnerOrders]);

    const convertToBaseUnit = (qty, unit) => {
        if (unit === 'ton') return qty * 1000;
        if (unit === 'sack') return qty * 50;
        return qty; // kg, liter
    };

    const convertFromBaseUnit = (qtyInBase, targetUnit, baseUnit) => {
        if (baseUnit === 'kg' || baseUnit === 'liter') {
            if (targetUnit === 'ton') return qtyInBase / 1000;
            if (targetUnit === 'sack') return qtyInBase / 50;
        }
        return qtyInBase; // Same unit
    };

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

    const getAvailableStockInOrderUnit = () => {
        if (!selectedLine) return 0;
        return convertFromBaseUnit(selectedLine.available_stock, selectedLine.unit, selectedLine.base_unit);
    };

    const getRemainingQty = () => {
        if (!selectedLine) return 0;
        return selectedLine.qty - selectedLine.delivered_qty;
    };

    const hasStockIssue = () => {
        if (!selectedLine || !formData.qty) return false;
        const qtyInBaseUnit = convertToBaseUnit(parseFloat(formData.qty), selectedLine.unit);
        return qtyInBaseUnit > selectedLine.available_stock;
    };

    const exceedsOrder = () => {
        if (!selectedLine || !formData.qty) return false;
        return parseFloat(formData.qty) > getRemainingQty();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');
        
        if (hasStockIssue()) {
            setErrorMessage('Insufficient stock available!');
            return;
        }
        if (exceedsOrder()) {
            setErrorMessage('Quantity exceeds remaining order amount!');
            return;
        }
        
        router.post(route('inventory.outbound.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                // Redirect happens automatically to dashboard
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
                const errorMsg = errors.qty || errors.error || errors.message || 'Failed to deliver stock. Please try again.';
                setErrorMessage(errorMsg);
            }
        });
    };

    const isFormValid = formData.partner_order_id && formData.partner_order_line_id && 
                        formData.qty > 0 && !hasStockIssue() && !exceedsOrder();

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white border-b border-gray-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
                <div className="relative px-6 py-6">
                    <nav className="flex items-center space-x-2 text-sm mb-4">
                        <a href={route('dashboard')} className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                            <HomeIcon className="w-4 h-4" />
                        </a>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        <a href={route('inventory.dashboard')} className="text-gray-600 hover:text-gray-900 transition-colors">
                            Inventory
                        </a>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-[#37692F] font-medium">Stock Outbound</span>
                    </nav>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl shadow-lg shadow-green-900/20 flex items-center justify-center">
                                <ArrowUpCircle className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Stock Outbound</h1>
                                <p className="text-gray-600">Deliver stock to fulfill partner orders</p>
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
                                <p className="font-medium text-green-900">Stock delivered successfully!</p>
                                <p className="text-sm text-green-700">Partner order has been updated.</p>
                            </div>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                            <AlertTriangle className="text-red-600" size={20} />
                            <div>
                                <p className="font-medium text-red-900">Delivery Failed</p>
                                <p className="text-sm text-red-700">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {backendErrors && Object.keys(backendErrors).length > 0 && !errorMessage && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="text-red-600" size={20} />
                                <p className="font-medium text-red-900">Validation Errors</p>
                            </div>
                            <ul className="list-disc list-inside text-sm text-red-700">
                                {Object.entries(backendErrors).map(([key, value]) => (
                                    <li key={key}>{value}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Show info banner if prefilled */}
                    {prefilledOrderId && selectedOrder && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                            <CheckCircle className="text-blue-600" size={20} />
                            <div>
                                <p className="font-medium text-blue-900">Order Pre-selected</p>
                                <p className="text-sm text-blue-700">
                                    Partner Order PO-{selectedOrder.contract_name}-{selectedOrder.id} has been automatically selected
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Partner Order <span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={partnerOrders.map(order => ({
                                    value: order.id,
                                    label: `PO-${order.contract_name}-${order.id} (${order.partner_name})`
                                }))}
                                value={
                                    formData.partner_order_id
                                        ? partnerOrders.map(order => ({
                                            value: order.id,
                                            label: `PO-${order.contract_name}-${order.id} (${order.partner_name})`
                                        })).find(opt => opt.value === parseInt(formData.partner_order_id))
                                        : null
                                }
                                onChange={opt => handleOrderChange(opt ? opt.value : '')}
                                placeholder="Search or select partner order..."
                                isClearable
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>

                        {selectedOrder && (
                            <div className="mb-6">
                                <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="mb-2">
                                        <span className="text-xs text-gray-500 font-semibold">Farm Location</span>
                                        <div className="font-medium text-gray-900">
                                            {selectedOrder.farm_name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {selectedOrder.farm_location}
                                        </div>
                                    </div>
                                    {selectedOrder.notes && (
                                        <div className="mt-2">
                                            <span className="text-xs text-gray-500 font-semibold">Order Notes:</span>
                                            <div className="text-sm text-gray-800">{selectedOrder.notes}</div>
                                        </div>
                                    )}
                                </div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Product Line <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                    {selectedOrder.lines.map((line) => {
                                        const remaining = line.qty - line.delivered_qty;
                                        const progress = (line.delivered_qty / line.qty) * 100;
                                        const availableInOrderUnit = convertFromBaseUnit(line.available_stock, line.unit, line.base_unit);
                                        
                                        return (
                                            <div
                                                key={line.id}
                                                onClick={() => handleLineChange(line.id)}
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition relative
                                                    ${formData.partner_order_line_id === String(line.id)
                                                        ? 'border-4 border-green-600 bg-green-50 shadow-lg ring-2 ring-green-300'
                                                        : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'}
                                                `}
                                                style={{
                                                    boxShadow: formData.partner_order_line_id === String(line.id)
                                                        ? '0 0 0 2px #22c55e, 0 2px 8px rgba(34,197,94,0.08)'
                                                        : undefined
                                                }}
                                            >
                                                {formData.partner_order_line_id === String(line.id) && (
                                                    <span className="absolute top-2 right-2 px-2 py-1 bg-green-600 text-white text-xs rounded font-bold shadow">
                                                        SELECTED
                                                    </span>
                                                )}
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
                                                        {remaining.toFixed(2)} {line.unit} remaining
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Available Stock: {availableInOrderUnit.toFixed(2)} {line.unit} ({line.available_stock} {line.base_unit})
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
                                        Delivery Quantity ({selectedLine.unit}) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max={Math.max(0.01, Math.min(getRemainingQty() || 0, getAvailableStockInOrderUnit()))}
                                            value={formData.qty}
                                            onChange={(e) => {
                                                let value = e.target.value;
                                                if (parseFloat(value) < 0) value = '';
                                                if (value && value.includes('.')) {
                                                    const [int, dec] = value.split('.');
                                                    if (dec.length > 2) value = int + '.' + dec.slice(0, 2);
                                                }
                                                setFormData({ ...formData, qty: value });
                                            }}
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
                                            <span>Insufficient stock! Only {getAvailableStockInOrderUnit().toFixed(2)} {selectedLine.unit} available</span>
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
                                            onClick={() => setFormData({...formData, qty: Math.min(getRemainingQty(), getAvailableStockInOrderUnit())})}
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