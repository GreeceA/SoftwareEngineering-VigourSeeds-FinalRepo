import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, item, recentInventoryLogs, partnerOrders }) {
    const { auth: authData } = usePage().props;
    const permissions = authData?.user?.can || [];

    // Helper to format currency for display
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(price);
    };

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Helper to style log type
    const getTransactionColor = (type) => {
        switch (type) {
            case 'inbound':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'outbound':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'adjustment':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Status badge colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'archived': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Type badge colors
    const getTypeColor = (type) => {
        switch (type) {
            case 'fertilizer': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pesticide': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'equipment': return 'bg-amber-100 text-amber-800 border-amber-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={item.name} />
            
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
                        <Link href={route('items.index')} className="text-gray-500 hover:text-[#37692F] transition-colors duration-200">
                            Items
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#37692F] font-medium truncate max-w-xs">{item.name}</span>
                    </nav>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <span className="text-2xl font-bold text-white">
                                        {item.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">{item.name}</h1>
                                <p className="text-gray-600">View complete item details and inventory information</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Action Buttons and Status Badges */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            {/* Item Status Badge */}
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(item.status)}`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${item.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                            {/* Item Type Badge */}
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getTypeColor(item.type)}`}>
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => window.location.href = route('items.exportProfile', item.id)}
                                className="flex items-center rounded-xl bg-gradient-to-r from-[#37692F] to-[#4a8a3f] px-5 py-3 text-white font-medium hover:from-[#2a5624] hover:to-[#37692F] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                title="Export Item Profile PDF"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export PDF
                            </button>
                            {permissions.includes('edit items') && item.status !== 'archived' && (
                                <Link
                                    href={route('items.edit', item.id)}
                                    className="flex items-center rounded-xl bg-gradient-to-r from-[#37692F] to-[#4a8a3f] px-5 py-3 text-white font-medium hover:from-[#2a5624] hover:to-[#37692F] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Item
                                </Link>
                            )}
                            <Link
                                href={route('items.index')}
                                className="flex items-center rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 px-5 py-3 text-white font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to List
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    
                    {/* Basic Information */}
                    <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Item Name</label>
                                <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Status</label>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(item.status)}`}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Item Type</label>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getTypeColor(item.type)}`}>
                                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Price per Unit</label>
                                <p className="text-gray-900 font-semibold">Php {Number(item.price_per_unit).toFixed(2)} / {item.base_unit}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stock Information Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Stock Information</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Current Stock</label>
                                <p className="text-2xl font-bold text-gray-900">
                                    {Number(item.stock_on_hand || 0).toLocaleString()} {item.base_unit}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Total Stock Value</label>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatPrice(item.total_stock_value || 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description Card */}
                    {item.description && (
                        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Description</h2>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Partner Orders Card */}
                    <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Partner Orders ({partnerOrders?.length || 0})</h2>
                        </div>
                        
                        {partnerOrders && partnerOrders.length > 0 ? (
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                            <tr>
                                                {['Order ID', 'Partner', 'Farm', 'Date', 'Status', 'Qty Ordered', 'Qty Delivered', 'Price', 'Total Value'].map((header) => (
                                                    <th key={header} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700 whitespace-nowrap">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {partnerOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="px-4 py-3">
                                                        <Link
                                                            href={route('partner-orders.show', order.id)}
                                                            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                                        >
                                                            #{order.id}
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-medium text-gray-900">{order.partner_name}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-sm text-gray-600">{order.farm_name}</span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">{formatDate(order.order_date)}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            order.status === 'fulfilled' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                            order.status === 'partially_fulfilled' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                            order.status === 'pending' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                            order.status === 'confirmed' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                                            'bg-gray-100 text-gray-800 border border-gray-200'
                                                        }`}>
                                                            {order.status === 'partially_fulfilled' ? 'Partial' : 
                                                            order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className="font-semibold text-gray-900">
                                                            {Number(order.qty_ordered).toLocaleString()} {order.unit}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`font-semibold ${
                                                            order.qty_delivered >= order.qty_ordered ? 'text-green-600' : 'text-orange-600'
                                                        }`}>
                                                            {Number(order.qty_delivered).toLocaleString()} {order.unit}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">
                                                            {formatPrice(order.price)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className="font-semibold text-gray-900">
                                                            {formatPrice(order.total_value)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Summary Stats */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Total Orders</div>
                                            <div className="text-xl font-bold text-gray-900">{partnerOrders.length}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Total Ordered</div>
                                            <div className="text-lg font-bold text-blue-600">
                                                {partnerOrders.reduce((sum, order) => sum + Number(order.qty_ordered || 0), 0).toLocaleString()} {item.base_unit}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Total Delivered</div>
                                            <div className="text-lg font-bold text-green-600">
                                                {partnerOrders.reduce((sum, order) => sum + Number(order.qty_delivered || 0), 0).toLocaleString()} {item.base_unit}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Total Value</div>
                                            <div className="text-lg font-bold text-gray-900">
                                                {formatPrice(partnerOrders.reduce((sum, order) => sum + Number(order.total_value || 0), 0))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">No partner orders found for this item.</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Inventory Logs Card */}
                    <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Recent Inventory Logs ({recentInventoryLogs?.length || 0})</h2>
                        </div>
                        
                        {recentInventoryLogs && recentInventoryLogs.length > 0 ? (
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <tr>
                                            {['Date', 'Transaction Type', 'Quantity', 'Recorded By'].map((header) => (
                                                <th key={header} className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentInventoryLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <span className="font-medium text-gray-900">
                                                            {formatDate(log.date)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getTransactionColor(log.transaction_type)}`}>
                                                        <div className={`w-2 h-2 rounded-full mr-2 ${
                                                            log.transaction_type === 'inbound' ? 'bg-green-500' : 
                                                            log.transaction_type === 'outbound' ? 'bg-orange-500' : 'bg-yellow-500'
                                                        }`}></div>
                                                        {log.transaction_type.charAt(0).toUpperCase() + log.transaction_type.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-semibold text-sm ${
                                                        log.transaction_type === 'inbound' ? 'text-green-700' : 
                                                        log.transaction_type === 'outbound' ? 'text-orange-700' : 'text-yellow-700'
                                                    }`}>
                                                        {log.transaction_type === 'inbound' && '+'}
                                                        {log.transaction_type === 'outbound' && '-'}
                                                        {Number(log.quantity).toLocaleString()} {log.unit}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                    {log.user}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">No inventory logs found for this item.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Created: <strong className="text-gray-700">{formatDate(item.created_at)}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Last Updated: <strong className="text-gray-700">{formatDate(item.updated_at)}</strong></span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}