import React, { useState } from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Plus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link } from '@inertiajs/react';

const InventoryDashboard = () => {
  const { auth, inventory, shortfalls } = usePage().props;

  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Deduplicate inventory by type-id
  const dedupedInventory = Array.from(
    new Map(inventory.map(item => [`${item.type}-${item.id}`, item])).values()
  );

  // Only allow 'all', 'Seed', 'fertilizer', 'pesticide' filters
  const filterOptions = ['all', 'Seed', 'fertilizer', 'pesticide'];
  const statusOptions = ['all', 'good', 'low', 'critical'];

  // Filtering logic
  let filteredInventory = dedupedInventory.filter(item => item.type.toLowerCase() !== 'corn');
  if (filter !== 'all') {
    filteredInventory = filteredInventory.filter(item => item.type.toLowerCase() === filter.toLowerCase());
  }
  if (statusFilter !== 'all') {
    filteredInventory = filteredInventory.filter(item => item.status === statusFilter);
  }
  if (search.trim() !== '') {
    filteredInventory = filteredInventory.filter(item =>
      item.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }

  // Sorting logic
  filteredInventory = filteredInventory.sort((a, b) =>
    sortOrder === 'asc'
      ? (a.current_stock ?? 0) - (b.current_stock ?? 0)
      : (b.current_stock ?? 0) - (a.current_stock ?? 0)
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'Seed') return '🌱';
    if (type === 'fertilizer') return '🧪';
    if (type === 'pesticide') return '🛡️';
    return '📦';
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and manage your stock levels</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={route('inventory.inbound.create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <Plus size={20} />
                Stock In
              </Link>
              <Link
                href={route('inventory.outbound.create')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <ArrowRight size={20} />
                Stock Out
              </Link>
            </div>
          </div>

          {/* Stock Shortfall Widget - Redesigned */}
          {shortfalls && shortfalls.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-red-800">Stock Shortfall Alert</h2>
                    <p className="text-red-600 text-sm">Immediate action required for these items</p>
                  </div>
                  <div className="ml-auto bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {shortfalls.length} Item{shortfalls.length > 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shortfalls.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="bg-white rounded-lg border border-red-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                          {item.type}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Shortfall:</span>
                          <span className="font-bold text-red-700">{item.shortfall.toLocaleString()} {item.unit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">On Hand:</span>
                          <span className="font-medium text-gray-700">{item.on_hand.toLocaleString()} {item.unit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Committed:</span>
                          <span className="font-medium text-gray-700">{item.committed.toLocaleString()} {item.unit}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-red-600 font-medium">Action Required</span>
                          <Link
                            href={route('inventory.inbound.create')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Restock →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dedupedInventory.filter(i => i.type.toLowerCase() !== 'corn').length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Package className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Good Stock</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dedupedInventory.filter(i => i.status === 'good' && i.type.toLowerCase() !== 'corn').length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Low Stock</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dedupedInventory.filter(i => i.status === 'low' && i.type.toLowerCase() !== 'corn').length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <TrendingDown className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Critical Stock</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dedupedInventory.filter(i => i.status === 'critical' && i.type.toLowerCase() !== 'corn').length}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the component remains exactly the same */}
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-4 items-center">
            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Type:</label>
              {filterOptions.map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`px-3 py-1 rounded-lg font-medium capitalize transition mr-1 ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                  className={`px-3 py-1 rounded-lg font-medium capitalize transition mr-1 ${
                    statusFilter === s
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {/* Name Search */}
            <div>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search product name..."
                className="px-3 py-1 rounded-lg border border-gray-300"
              />
            </div>
            {/* Sort Order */}
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Sort by Stock:</label>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1 rounded-lg font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {sortOrder === 'asc' ? 'Lowest First' : 'Highest First'}
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedInventory.length > 0 ? (
                  paginatedInventory.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getTypeIcon(item.type)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">ID: {item.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {item.current_stock === null || item.current_stock === undefined
                            ? '-' 
                            : `${item.current_stock.toLocaleString()} ${item.unit}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status ? (
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-400 border-gray-200">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                            href={route('inventory.show', [
                                item.type === 'Seed' ? 'seed' : 'item',
                                item.id
                            ])}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                            View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No inventory items found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {filteredInventory.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredInventory.length)}</span> of{' '}
                  <span className="font-medium">{filteredInventory.length}</span> items
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md flex items-center gap-1 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 py-1 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md flex items-center gap-1 ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link
              href={route('inventory.ledger')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer block"
            >
              <h3 className="font-semibold text-gray-900 mb-2">View Ledger</h3>
              <p className="text-gray-600 text-sm">See all inventory transactions</p>
            </Link>
            <Link
              href={route('partner-orders.index')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer block"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Partner Orders</h3>
              <p className="text-gray-600 text-sm">Manage outbound deliveries</p>
            </Link>
            <Link
              href={route('buybacks.index')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer block"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Buyback Tracking</h3>
              <p className="text-gray-600 text-sm">Monitor corn buyback progress</p>
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default InventoryDashboard;