import React, { useState } from 'react';
import { FileText, Leaf, TrendingUp, Calendar, MapPin, User, Download, ArrowLeft, Plus } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link } from '@inertiajs/react'; // Add this import

const BuybackContractDetails = () => {
  const { auth, partnerOrder } = usePage().props;

  const contract = {
    id: 1,
    contract_number: 'CNT-2024-001',
    partner_name: 'Partner Farm A',
    partner_contact: '+63 912 345 6789',
    farm_name: 'Main Farm - Plot 5A',
    farm_location: 'Brgy. San Miguel, Nueva Ecija',
    signing_date: '2024-03-15',
    effective_date: '2024-04-01',
    expiration_date: '2025-03-31',
    buyback_price: 25.50,
    status: 'active',
    seed_commitments: [
      {
        id: 1,
        seed_variety: 'White Corn Hybrid A',
        seed_quantity: 150,
        seed_unit: 'kg',
        seed_price: 180,
        planting_date: '2024-06-15',
        expected_first_harvest: '2024-10-15',
        agreed_cycles: 2,
        expected_buyback_amount: 5000,
        buyback_unit: 'kg'
      },
      {
        id: 2,
        seed_variety: 'Yellow Corn Premium',
        seed_quantity: 100,
        seed_unit: 'kg',
        seed_price: 200,
        planting_date: '2024-07-01',
        expected_first_harvest: '2024-11-01',
        agreed_cycles: 1,
        expected_buyback_amount: 3000,
        buyback_unit: 'kg'
      }
    ],
    buyback_transactions: [
      {
        id: 1,
        date: '2024-10-16',
        corn_product: 'White Corn',
        quantity: 1500,
        unit: 'kg',
        value: 38250,
        notes: 'First harvest - good quality',
        delivered_by: 'John Farmer'
      },
      {
        id: 2,
        date: '2024-10-20',
        corn_product: 'White Corn',
        quantity: 1200,
        unit: 'kg',
        value: 30600,
        notes: 'Second batch',
        delivered_by: 'John Farmer'
      },
      {
        id: 3,
        date: '2024-10-25',
        corn_product: 'White Corn',
        quantity: 500,
        unit: 'kg',
        value: 12750,
        notes: 'Final batch from first cycle',
        delivered_by: 'John Farmer'
      }
    ]
  };

  const totalExpected = contract.seed_commitments.reduce((sum, sc) => sum + sc.expected_buyback_amount, 0);
  const totalReceived = contract.buyback_transactions.reduce((sum, tx) => sum + tx.quantity, 0);
  const totalValue = contract.buyback_transactions.reduce((sum, tx) => sum + tx.value, 0);
  const remaining = totalExpected - totalReceived;
  const fulfillmentPct = (totalReceived / totalExpected) * 100;

  const getFulfillmentColor = () => {
    if (fulfillmentPct >= 100) return 'text-green-600';
    if (fulfillmentPct >= 75) return 'text-blue-600';
    if (fulfillmentPct >= 50) return 'text-yellow-600';
    return 'text-red-600';
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
        <Link
          href={route('partner-orders.index')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FileText className="text-purple-600" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{contract.contract_number}</h1>
                  <p className="text-gray-600">{contract.partner_name}</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                {contract.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Farm Location</p>
                  <p className="font-medium text-gray-900">{contract.farm_name}</p>
                  <p className="text-sm text-gray-600">{contract.farm_location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Partner Contact</p>
                  <p className="font-medium text-gray-900">{contract.partner_contact}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Contract Period</p>
                  <p className="font-medium text-gray-900">
                    {contract.effective_date} to {contract.expiration_date}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Leaf className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Buyback Price</p>
                  <p className="font-medium text-green-600 text-lg">₱{contract.buyback_price}/kg</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Buyback Fulfillment</span>
                <span className={`text-sm font-semibold ${getFulfillmentColor()}`}>
                  {fulfillmentPct.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    fulfillmentPct >= 100 ? 'bg-green-600' : 
                    fulfillmentPct >= 75 ? 'bg-blue-600' : 
                    fulfillmentPct >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${Math.min(fulfillmentPct, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Buyback Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Expected</span>
                <span className="font-semibold text-lg">{totalExpected.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Received</span>
                <span className="font-semibold text-lg text-green-600">{totalReceived.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Remaining</span>
                <span className={`font-semibold text-lg ${remaining === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {remaining.toLocaleString()} kg
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-900 font-medium">Total Value</span>
                <span className="font-bold text-xl text-green-600">₱{totalValue.toLocaleString()}</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition">
              <Plus size={20} />
              Record Delivery
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Seed Commitments</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seed Variety</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distributed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Planting Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Harvest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cycles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Buyback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contract.seed_commitments.map((sc) => (
                <tr key={sc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{sc.seed_variety}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-semibold">{sc.seed_quantity} {sc.seed_unit}</p>
                    <p className="text-xs text-gray-500">₱{sc.seed_price}/unit</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{sc.planting_date}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{sc.expected_first_harvest}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {sc.agreed_cycles} cycle{sc.agreed_cycles > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-semibold text-green-600">
                      {sc.expected_buyback_amount.toLocaleString()} {sc.buyback_unit}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Buyback Transaction History</h2>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition">
              <Download size={16} />
              Export Report
            </button>
          </div>

          {contract.buyback_transactions.length > 0 ? (
            <div className="space-y-3">
              {contract.buyback_transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Leaf className="text-green-600" size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-gray-900">{tx.corn_product}</p>
                        <span className="text-sm text-gray-500">•</span>
                        <p className="text-sm text-gray-600">{tx.date}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{tx.notes}</p>
                      <p className="text-xs text-gray-500 mt-1">Delivered by: {tx.delivered_by}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">+{tx.quantity.toLocaleString()} {tx.unit}</p>
                    <p className="text-sm text-gray-600">₱{tx.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Leaf className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-600">No buyback transactions recorded yet</p>
              <p className="text-sm text-gray-500 mt-1">Deliveries will appear here once recorded</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </AuthenticatedLayout>
  );
};

export default BuybackContractDetails;