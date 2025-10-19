import React, { useState } from 'react';
import { ShoppingCart, Plus, Filter, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link } from '@inertiajs/react'; // Add this import


const PartnerOrdersList = () => {
  const { auth } = usePage().props;

  const [filters, setFilters] = useState({
    status: '',
    partner_id: ''
  });

  const orders = [
    {
      id: 1,
      order_number: 'PO-2024-001',
      partner_name: 'Partner Farm A',
      contract: 'CNT-2024-001',
      order_date: '2024-10-15',
      status: 'pending',
      total_value: 125000,
      fulfillment: 0,
      lines_count: 3
    },
    {
      id: 2,
      order_number: 'PO-2024-002',
      partner_name: 'Partner Farm B',
      contract: 'CNT-2024-002',
      order_date: '2024-10-12',
      status: 'partially_fulfilled',
      total_value: 85000,
      fulfillment: 45,
      lines_count: 2
    },
    {
      id: 3,
      order_number: 'PO-2024-003',
      partner_name: 'Partner Farm C',
      contract: null,
      order_date: '2024-10-10',
      status: 'fulfilled',
      total_value: 65000,
      fulfillment: 100,
      lines_count: 1
    },
    {
      id: 4,
      order_number: 'PO-2024-004',
      partner_name: 'Partner Farm A',
      contract: 'CNT-2024-001',
      order_date: '2024-10-08',
      status: 'cancelled',
      total_value: 45000,
      fulfillment: 0,
      lines_count: 2
    }
  ];

  const partners = [
    { id: 1, name: 'Partner Farm A' },
    { id: 2, name: 'Partner Farm B' },
    { id: 3, name: 'Partner Farm C' }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Pending'
      },
      partially_fulfilled: {
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Partially Fulfilled'
      },
      fulfilled: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Fulfilled'
      },
      cancelled: {
        icon: XCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Cancelled'
      }
    };
    return configs[status] || configs.pending;
  };

  const filteredOrders = orders.filter(o => {
    if (filters.status && o.status !== filters.status) return false;
    if (filters.partner_id && o.partner_name !== partners.find(p => p.id === parseInt(filters.partner_id))?.name) return false;
    return true;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    partially: orders.filter(o => o.status === 'partially_fulfilled').length,
    fulfilled: orders.filter(o => o.status === 'fulfilled').length
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partner Orders</h1>
            <p className="text-gray-600 mt-1">Manage seed and item deliveries to partners</p>
          </div>
          <Link
            href={route('partner-orders.create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={20} />
            New Order
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Partially Fulfilled</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.partially}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Fulfilled</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.fulfilled}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="partially_fulfilled">Partially Fulfilled</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.partner_id}
              onChange={(e) => setFilters({...filters, partner_id: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Partners</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fulfillment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded">
                          <ShoppingCart className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.order_number}</p>
                          <p className="text-sm text-gray-500">{order.order_date}</p>
                          {order.contract && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded mt-1 inline-block">
                              {order.contract}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{order.partner_name}</p>
                      <p className="text-xs text-gray-500">{order.lines_count} line items</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <StatusIcon size={16} />
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              order.fulfillment === 100 ? 'bg-green-600' : 
                              order.fulfillment > 0 ? 'bg-blue-600' : 'bg-gray-400'
                            }`}
                            style={{ width: `${order.fulfillment}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">
                          {order.fulfillment}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        ₱{order.total_value.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={route('partner-orders.show', { partnerOrder: order.id })}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AuthenticatedLayout>
  );
};

export default PartnerOrdersList;