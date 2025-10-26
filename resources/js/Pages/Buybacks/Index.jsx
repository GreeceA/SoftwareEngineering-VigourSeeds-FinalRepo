import React, { useState } from 'react';
import { Leaf, TrendingUp, AlertCircle, CheckCircle, Plus, Eye } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link } from '@inertiajs/react'; // Add this import

const BuybackOverview = () => {
  const { auth, contracts } = usePage().props;
  const permissions = auth.user.can || [];

  const totalExpected = contracts.reduce((sum, c) => sum + c.expected_buyback, 0);
  const totalActual = contracts.reduce((sum, c) => sum + c.actual_buyback, 0);
  const totalRemaining = totalExpected - totalActual;
  const overallFulfillment = (totalActual / totalExpected) * 100;

  const getFulfillmentStatus = (pct) => {
    if (pct >= 100) return { color: 'text-green-600', bg: 'bg-green-100', label: 'Complete' };
    if (pct >= 75) return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'On Track' };
    if (pct >= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'In Progress' };
    return { color: 'text-red-600', bg: 'bg-red-100', label: 'Behind' };
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
            <h1 className="text-3xl font-bold text-gray-900">Buyback Overview</h1>
            <p className="text-gray-600 mt-1">Track corn buyback commitments from partner farms</p>
          </div>
          {permissions.includes('create inventory') && (
            <Link
              href={route('buybacks.inbound.create')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} />
              Record Buyback
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Expected</p>
              <Leaf className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalExpected.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">kg</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Received</p>
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalActual.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">kg</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Remaining</p>
              <AlertCircle className="text-yellow-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalRemaining.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">kg</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Fulfillment Rate</p>
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{overallFulfillment.toFixed(1)}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(overallFulfillment, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Contract Buyback Status</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner & Farm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Received
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
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
                {contracts.map((contract) => {
                  const remaining = contract.expected_buyback - contract.actual_buyback;
                  const fulfillment = (contract.actual_buyback / contract.expected_buyback) * 100;
                  const status = getFulfillmentStatus(fulfillment);
                  const expectedValue = contract.expected_buyback * contract.buyback_price;

                  return (
                    <tr key={contract.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{contract.contract_number}</p>
                          <p className="text-xs text-gray-500">₱{contract.buyback_price}/kg</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{contract.partner_name}</p>
                          <p className="text-xs text-gray-500">{contract.farm_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-gray-900">
                          {contract.expected_buyback.toLocaleString()} {contract.unit}
                        </p>
                        <p className="text-xs text-gray-500">≈ ₱{expectedValue.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-green-600">
                          {contract.actual_buyback.toLocaleString()} {contract.unit}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className={`font-semibold ${remaining === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {remaining.toLocaleString()} {contract.unit}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-24">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                fulfillment >= 100 ? 'bg-green-600' : 
                                fulfillment >= 75 ? 'bg-blue-600' : 
                                fulfillment >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(fulfillment, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium w-12 text-right">
                            {fulfillment.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={route('buybacks.show', { contract: contract.id })}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                        >
                          <Eye size={16} />
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About Buyback Tracking</h3>
              <p className="text-sm text-blue-800">
                This dashboard tracks corn buyback commitments from partner farms based on seed distribution contracts. 
                Expected quantities are calculated from contract seed commitments and agreed-upon harvest cycles. 
                Use the "Record Buyback" button to log incoming corn deliveries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthenticatedLayout>
  );
};

export default BuybackOverview;