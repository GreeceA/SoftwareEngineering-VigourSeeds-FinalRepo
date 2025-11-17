import React, { useState, useEffect } from 'react';
import { Filter, Download, Search, ArrowUpCircle, ArrowDownCircle, Edit3 } from 'lucide-react';
import { usePage, Link, router, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Breadcrumb from '@/Components/Breadcrumb';

const InventoryLedger = () => {
  const { auth, transactions, filters: serverFilters = {} } = usePage().props;
  const permissions = auth.user.can || [];
  
  const [filters, setFilters] = useState({
    product_type: serverFilters.product_type || '',
    transaction_type: serverFilters.transaction_type || '',
    date_from: serverFilters.date_from || '',
    date_to: serverFilters.date_to || '',
    search: serverFilters.search || ''
  });

  // Debounce search input
  const [searchTerm, setSearchTerm] = useState(serverFilters.search || '');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        applyFilters({ ...filters, search: searchTerm });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Apply filters and navigate
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    
    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== '' && v !== null)
    );
    
    router.get(route('inventory.ledger'), cleanFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    applyFilters(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      product_type: '',
      transaction_type: '',
      date_from: '',
      date_to: '',
      search: ''
    });
    router.get(route('inventory.ledger'), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Transaction icons/colors
  const getTransactionIcon = (type) => {
    switch(type) {
      case 'inbound': return <ArrowDownCircle className="text-green-600" size={20} />;
      case 'outbound': return <ArrowUpCircle className="text-blue-600" size={20} />;
      case 'adjustment': return <Edit3 className="text-yellow-600" size={20} />;
      default: return null;
    }
  };

  const getTransactionColor = (type) => {
    switch(type) {
      case 'inbound': return 'bg-green-100 text-green-800 border-green-200';
      case 'outbound': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'adjustment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const hasActiveFilters = filters.product_type || filters.transaction_type || 
                          filters.date_from || filters.date_to || filters.search;

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Inventory Ledger" />

      {/* Modern Page Header with Integrated Breadcrumb */}
      <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white border-b border-gray-200 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative px-6 py-6">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { 
                label: 'Home', 
                href: route('dashboard'),
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )
              },
              { label: 'Inventory', href: route('inventory.dashboard') },
              { label: 'Ledger' }
            ]}
          />

          {/* Header Content */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              
              {/* Title & Description */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Inventory Ledger</h1>
                <p className="text-gray-600">Complete transaction history and audit trail</p>
              </div>
            </div>

            {/* Export Button */}
            {permissions.includes('view inventory') && (
              <button 
                onClick={() => {
                  const params = new URLSearchParams({
                    product_type: filters.product_type || '',
                    transaction_type: filters.transaction_type || '',
                    date_from: filters.date_from || '',
                    date_to: filters.date_to || '',
                    search: filters.search || '',
                  });
                  window.location.href = route('inventory.ledger.export') + '?' + params.toString();
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#37692F] text-white font-medium rounded-lg hover:bg-[#2a5624] transition-all shadow-md hover:shadow-lg"
              >
                <Download size={20} />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Search */}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Search Product</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Product Type</label>
                <select
                  value={filters.product_type}
                  onChange={(e) => handleFilterChange('product_type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="Seed">Seeds</option>
                  <option value="item">Items</option>
                  <option value="CornProduct">Corn Products</option>
                </select>
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Transaction Type</label>
                <select
                  value={filters.transaction_type}
                  onChange={(e) => handleFilterChange('transaction_type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="inbound">Inbound</option>
                  <option value="outbound">Outbound</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  max={filters.date_to || undefined}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  min={filters.date_from || undefined}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#37692F] text-xs uppercase text-gray-600">
                <tr>
                  {['DATE & TIME', 'TRANSACTION', 'PRODUCT', 'QUANTITY', 'REFERENCE', 'USER', 'NOTES'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 font-poppins text-[14px] font-medium text-white"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                  {transactions.data.length > 0 ? (
                    transactions.data.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-poppins text-[13px] font-normal text-gray-900">
                            {formatDate(txn.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-poppins font-medium shadow-sm ${
                            txn.transaction_type === 'inbound' ? 'bg-green-100 text-green-700 border border-green-200' :
                            txn.transaction_type === 'outbound' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}>
                            {txn.transaction_type === 'inbound' && 'Inbound'}
                            {txn.transaction_type === 'outbound' && 'Outbound'}
                            {txn.transaction_type === 'adjustment' && 'Adjustment'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-poppins text-[13px] font-medium text-gray-900">
                            {txn.product_name || '-'}
                          </div>
                          <div className="font-poppins text-[12px] font-normal text-gray-500">
                            {txn.product_type}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`font-poppins text-[13px] font-semibold ${
                            txn.transaction_type === 'inbound' ? 'text-green-600' :
                            txn.transaction_type === 'outbound' ? 'text-red-600' :
                            txn.qty > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {txn.transaction_type === 'inbound' && `+${Math.abs(parseFloat(txn.qty)).toLocaleString()}`}
                            {txn.transaction_type === 'outbound' && `-${Math.abs(parseFloat(txn.qty)).toLocaleString()}`}
                            {txn.transaction_type === 'adjustment' && (
                              txn.qty > 0 ? `+${Math.abs(parseFloat(txn.qty)).toLocaleString()}` : `${parseFloat(txn.qty).toLocaleString()}`
                            )}
                            {' '}{txn.unit}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {txn.partner_order_id && (
                            <Link
                              href={route('partner-orders.show', txn.partner_order_id)}
                              className="font-poppins text-[13px] font-normal text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                              Order #{txn.partner_order_id}
                            </Link>
                          )}
                          {txn.contract_id && !txn.partner_order_id && (
                            <span className="font-poppins text-[13px] font-normal text-gray-600">
                              Contract #{txn.contract_id}
                            </span>
                          )}
                          {!txn.partner_order_id && !txn.contract_id && (
                            <span className="font-poppins text-[13px] font-normal text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-poppins text-[13px] font-normal text-gray-900">
                            {txn.user_name || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-poppins text-[13px] font-normal text-gray-600 max-w-xs truncate">
                            {txn.notes || '-'}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="font-poppins text-[14px] font-normal text-gray-500">
                          No transactions found{hasActiveFilters ? ' for the selected filters' : ''}.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>

            {/* Pagination */}
            {transactions.data.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="font-poppins text-[13px] font-normal text-gray-600">
                    Showing <span className="font-medium">{transactions.from || 0}</span> to{' '}
                    <span className="font-medium">{transactions.to || 0}</span> of{' '}
                    <span className="font-medium">{transactions.total || 0}</span> transactions
                  </div>
                  
                  {/* Pagination Links */}
                  <div className="flex gap-1">
                    {transactions.links?.map((link, index) => {
                      if (!link.url) {
                        return (
                          <span
                            key={index}
                            className="px-3 py-1 text-gray-400 cursor-not-allowed font-poppins text-[13px]"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        );
                      }

                      return (
                        <Link
                          key={index}
                          href={link.url}
                          preserveState
                          preserveScroll
                          className={`px-3 py-1 rounded transition font-poppins text-[13px] ${
                            link.active
                              ? 'bg-[#37692F] text-white font-medium'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default InventoryLedger;