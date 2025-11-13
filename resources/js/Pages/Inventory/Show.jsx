import React, { useState } from 'react';
import { Package, TrendingUp, TrendingDown, Calendar, User, FileText, ArrowLeft, Filter, Download } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link } from '@inertiajs/react';

const Show = () => {
    const { auth, product, transactions } = usePage().props;
    const permissions = auth?.user?.can || [];
    
    const [filterType, setFilterType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // Filter transactions by type
    const filteredTransactions = filterType === 'all' 
        ? transactions.data 
        : transactions.data.filter(t => t.transaction_type === filterType);

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    const handleFilterChange = (type) => {
        setFilterType(type);
        setCurrentPage(1);
    };

    const totalInbound = transactions.data
        .filter(t => t.transaction_type === 'inbound')
        .reduce((sum, t) => sum + parseFloat(t.qty_converted ?? t.qty), 0);

    const totalOutbound = transactions.data
        .filter(t => t.transaction_type === 'outbound')
        .reduce((sum, t) => sum + parseFloat(t.qty_converted ?? t.qty), 0);

    const totalAdjustments = transactions.data
        .filter(t => t.transaction_type === 'adjustment')
        .reduce((sum, t) => sum + parseFloat(t.qty_converted ?? t.qty), 0);

    const getTransactionIcon = (type) => {
        switch(type) {
            case 'inbound': return <TrendingUp className="text-green-600" size={20} />;
            case 'outbound': return <TrendingDown className="text-red-600" size={20} />;
            case 'adjustment': return <FileText className="text-blue-600" size={20} />;
            default: return <Package className="text-gray-600" size={20} />;
        }
    };

    const getTransactionColor = (type) => {
        switch(type) {
            case 'inbound': return 'bg-green-50 text-green-700 border-green-200';
            case 'outbound': return 'bg-red-50 text-red-700 border-red-200';
            case 'adjustment': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'good': return 'bg-green-100 text-green-800';
            case 'low': return 'bg-yellow-100 text-yellow-800';
            case 'critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Product Transactions</span>
                </h2>
            }
        >
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link
                        href={route('inventory.dashboard')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </Link>

                    {/* Product Header */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-4 rounded-full">
                                    <Package className="text-blue-600" size={32} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                                            {product.type}
                                        </span>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Current Stock</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {product.current_stock.toLocaleString()} <span className="text-lg text-gray-600">{product.unit}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Total Transactions</p>
                                <FileText className="text-gray-400" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{transactions.data.length}</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Total Inbound</p>
                                <TrendingUp className="text-green-600" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                +{totalInbound.toLocaleString()} {product.unit}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Total Outbound</p>
                                <TrendingDown className="text-red-600" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                -{totalOutbound.toLocaleString()} {product.unit}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Adjustments</p>
                                <FileText className="text-blue-600" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {totalAdjustments >= 0 ? '+' : ''}{totalAdjustments.toLocaleString()} {product.unit}
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-2">
                                <Filter size={20} className="text-gray-600" />
                                <h3 className="font-semibold text-gray-900">Filter Transactions</h3>
                            </div>
                            {permissions.includes('view inventory') && (
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                    <Download size={16} />
                                    Export
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2 p-4">
                            {['all', 'inbound', 'outbound', 'adjustment'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleFilterChange(type)}
                                    className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                                        filterType === type
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Running Balance</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedTransactions.length > 0 ? (
                                        paginatedTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {getTransactionIcon(transaction.transaction_type)}
                                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${getTransactionColor(transaction.transaction_type)}`}>
                                                            {transaction.transaction_type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm font-bold ${
                                                        transaction.transaction_type === 'inbound' ? 'text-green-600' :
                                                        transaction.transaction_type === 'outbound' ? 'text-red-600' :
                                                        'text-blue-600'
                                                    }`}>
                                                        {transaction.transaction_type === 'inbound' ? '+' : 
                                                        transaction.transaction_type === 'outbound' ? '-' : ''}
                                                        {parseFloat(transaction.qty_converted ?? transaction.qty).toLocaleString()} {transaction.unit_converted ?? product.unit}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {parseFloat(transaction.running_balance).toLocaleString()} {transaction.unit_converted ?? product.unit}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {formatDate(transaction.created_at)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <User size={14} />
                                                        {transaction.user_name || 'System'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-600 max-w-xs truncate">
                                                        {transaction.notes || '-'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {transaction.partner_order_id && (
                                                        <Link
                                                            href={route('partner-orders.show', transaction.partner_order_id)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            Order #{transaction.partner_order_id}
                                                        </Link>
                                                    )}
                                                    {transaction.contract_id && !transaction.partner_order_id && (
                                                        <span className="text-gray-600">Contract #{transaction.contract_id}</span>
                                                    )}
                                                    {!transaction.partner_order_id && !transaction.contract_id && (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                No transactions found for this filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredTransactions.length > 0 && totalPages > 1 && (
                            <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 rounded ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;