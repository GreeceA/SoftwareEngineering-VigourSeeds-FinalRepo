import React, { useState } from 'react';
import { Filter, Download, Search, ArrowUpCircle, ArrowDownCircle, Edit3 } from 'lucide-react';
import { usePage, Link } from '@inertiajs/react'; // Add this import
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const InventoryLedger = () => {
  const { auth } = usePage().props;
  const [filters, setFilters] = useState({
    product_type: '',
    transaction_type: '',
    date_from: '',
    date_to: '',
    search: ''
  });

  // Sample transactions data
  const [transactions] = useState([
    {
      id: 1,
      product_name: 'White Corn Seeds',
      product_type: 'Seed',
      transaction_type: 'inbound',
      qty: 500,
      unit: 'kg',
      contract: 'CNT-2024-001',
      notes: 'Received from supplier',
      created_by: 'John Doe',
      created_at: '2024-10-15 14:30'
    },
    {
      id: 2,
      product_name: 'NPK Fertilizer',
      product_type: 'Item',
      transaction_type: 'outbound',
      qty: 150,
      unit: 'kg',
      partner_order: 'PO-2024-045',
      notes: 'Delivered to Partner Farm A',
      created_by: 'Jane Smith',
      created_at: '2024-10-14 10:15'
    },
    {
      id: 3,
      product_name: 'Yellow Corn',
      product_type: 'Corn',
      transaction_type: 'inbound',
      qty: 2500,
      unit: 'kg',
      contract: 'CNT-2024-002',
      notes: 'Buyback from Partner Farm B',
      created_by: 'Mike Johnson',
      created_at: '2024-10-13 16:45'
    },
    {
      id: 4,
      product_name: 'White Corn Seeds',
      product_type: 'Seed',
      transaction_type: 'adjustment',
      qty: -10,
      unit: 'kg',
      notes: 'Damaged stock write-off',
      created_by: 'Admin',
      created_at: '2024-10-12 09:00'
    }
  ]);

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

  const filteredTransactions = transactions.filter(t => {
    if (filters.product_type && t.product_type !== filters.product_type) return false;
    if (filters.transaction_type && t.transaction_type !== filters.transaction_type) return false;
    if (filters.search && !t.product_name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

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
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Product Type */}
            <select
              value={filters.product_type}
              onChange={(e) => setFilters({...filters, product_type: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Product Types</option>
              <option value="Seed">Seeds</option>
              <option value="Item">Items</option>
              <option value="Corn">Corn Products</option>
            </select>

            {/* Transaction Type */}
            <select
              value={filters.transaction_type}
              onChange={(e) => setFilters({...filters, transaction_type: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Transactions</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
              <option value="adjustment">Adjustment</option>
            </select>

            {/* Date From */}
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters({...filters, date_from: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Date To */}
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters({...filters, date_to: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Clear Filters */}
          {(filters.search || filters.product_type || filters.transaction_type || filters.date_from || filters.date_to) && (
            <button
              onClick={() => setFilters({ product_type: '', transaction_type: '', date_from: '', date_to: '', search: '' })}
              className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{txn.created_at}</div>
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
                    <div className="text-sm font-medium text-gray-900">{txn.product_name}</div>
                    <div className="text-xs text-gray-500">{txn.product_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${txn.qty > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.qty > 0 ? '+' : ''}{txn.qty} {txn.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {txn.contract && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {txn.contract}
                      </span>
                    )}
                    {txn.partner_order && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {txn.partner_order}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {txn.created_by}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {txn.notes}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-600">
              Showing {filteredTransactions.length} transactions
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthenticatedLayout>
  );
};

export default InventoryLedger;