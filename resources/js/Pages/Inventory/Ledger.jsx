import React, { useState, useEffect } from 'react';
import { Filter, Download, Search, ArrowUpCircle, ArrowDownCircle, Edit3 } from 'lucide-react';
import { usePage, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const InventoryLedger = () => {
  const { auth, transactions, filters: serverFilters = {} } = usePage().props;
  
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Ledger</h1>
              <p className="text-gray-600 mt-1">Complete transaction history</p>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
              <Download size={20} />
              Export
            </button>
          </div>

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
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.data.length > 0 ? (
                    transactions.data.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(txn.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getTransactionIcon(txn.transaction_type)}
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${getTransactionColor(txn.transaction_type)}`}>
                              {txn.transaction_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {txn.product_name || '-'}
                          </div>
                          <div className="text-xs text-gray-500">{txn.product_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-semibold ${
                            txn.qty > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {txn.qty > 0 ? '+' : ''}{parseFloat(txn.qty).toLocaleString()} {txn.unit}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {txn.partner_order_id && (
                            <Link
                              href={route('partner-orders.show', txn.partner_order_id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Order #{txn.partner_order_id}
                            </Link>
                          )}
                          {txn.contract_id && !txn.partner_order_id && (
                            <span className="text-gray-600">Contract #{txn.contract_id}</span>
                          )}
                          {!txn.partner_order_id && !txn.contract_id && (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {txn.user_name || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {txn.notes || '-'}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        No transactions found{hasActiveFilters ? ' for the selected filters' : ''}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {transactions.data.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                <div className="text-sm text-gray-600">
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
                          className="px-3 py-1 text-gray-400 cursor-not-allowed"
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
                        className={`px-3 py-1 rounded transition ${
                          link.active
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    );
                  })}
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