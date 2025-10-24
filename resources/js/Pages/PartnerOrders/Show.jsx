import React from 'react';
import { FileText, Leaf, TrendingUp, Calendar, MapPin, User, Download, ArrowLeft, Plus } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link } from '@inertiajs/react';

const BuybackContractDetails = () => {
  const { auth, partnerOrder } = usePage().props;

  const contract = partnerOrder.contract || {};
  const lines = partnerOrder.lines || [];
  const buybackTransactions = partnerOrder.buyback_transactions || [];

  // Seed commitments for buyback summary
  const seedCommitments = contract.seed_commitments || [];
  const totalExpected = seedCommitments.reduce((sum, sc) => sum + (sc.expected_buyback_amount || 0), 0);
  const totalReceived = buybackTransactions.reduce((sum, tx) => sum + (tx.quantity || 0), 0);
  const totalValue = buybackTransactions.reduce((sum, tx) => sum + (tx.value || 0), 0);
  const remaining = totalExpected - totalReceived;
  const fulfillmentPct = partnerOrder.fulfillment_percentage ?? 0;

  const getFulfillmentColor = () => {
    if (fulfillmentPct >= 100) return 'text-green-600';
    if (fulfillmentPct >= 75) return 'text-blue-600';
    if (fulfillmentPct >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  

  // Compute expected total delivery in kg
  const expectedTotalKg = lines.reduce((sum, line) => {
    let qty = Number(line.qty) || 0;
    switch (line.unit) {
      case 'sack':
        qty = qty * 50;
        break;
      case 'ton':
        qty = qty * 1000;
        break;
      // kg, liter, etc. use as is
    }
    return sum + qty;
  }, 0);

  // Compute total delivered in kg
  const deliveredTotalKg = lines.reduce((sum, line) => {
    let delivered = Number(line.delivered_qty) || 0;
    switch (line.unit) {
      case 'sack':
        delivered = delivered * 50;
        break;
      case 'ton':
        delivered = delivered * 1000;
        break;
      // kg, liter, etc. use as is
    }
    return sum + delivered;
  }, 0);

  const totalsByUnit = lines.reduce((acc, line) => {
    const qty = Number(line.qty) || 0;
    const unit = line.unit;
    acc[unit] = (acc[unit] || 0) + qty;
    return acc;
  }, {});
  // Remaining
  const remainingKg = expectedTotalKg - deliveredTotalKg;

  console.log('lines:', lines);
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
                    <h1 className="text-2xl font-bold text-gray-900">
                      {`PO-${contract.contract_name}-${partnerOrder.id}`}
                    </h1>
                    <p className="text-gray-600">{contract.partner_name || partnerOrder.partner?.name}</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                  {contract.status || partnerOrder.status}
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
                    <p className="font-medium text-gray-900">{contract.partner_contact || partnerOrder.partner?.contact}</p>
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
                    <p className="font-medium text-green-600 text-lg">
                      ₱{Number(contract.buyback_price_per_unit).toFixed(2)}/kg
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                {partnerOrder.notes && (
                  <div className="mb-8">
                    <span className="text-sm text-gray-600 font-semibold">Order Notes:</span>
                    <div className="text-sm text-gray-800 mt-1">{partnerOrder.notes}</div>
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Buyback Fulfillment</span>
                  <span className={`text-sm font-semibold ${getFulfillmentColor(fulfillmentPct)}`}>
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TrendingUp className="text-blue-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
              </div>

              <div className="space-y-4">
                {lines.length > 0 && lines[0].product_type === 'seed' ? (
                  <>
                    {/* Total Expected */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FileText className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Total Expected</p>
                          <p className="text-xs text-gray-500">Contract commitment</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {lines.reduce((sum, line) => {
                          let qty = Number(line.qty) || 0;
                          switch (line.unit) {
                            case 'sack':
                              qty = qty * 50;
                              break;
                            case 'ton':
                              qty = qty * 1000;
                              break;
                            default:
                              break;
                          }
                          return sum + qty;
                        }, 0).toLocaleString()} kg
                      </span>
                    </div>

                    {/* Total Delivery */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Leaf className="text-green-600" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Total Delivered</p>
                          <p className="text-xs text-gray-500">Actual received</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-700">
                        {lines.reduce((sum, line) => {
                          let delivered = Number(line.delivered_qty) || 0;
                          switch (line.unit) {
                            case 'sack':
                              delivered = delivered * 50;
                              break;
                            case 'ton':
                              delivered = delivered * 1000;
                              break;
                            default:
                              break;
                          }
                          return sum + delivered;
                        }, 0).toLocaleString()} kg
                      </span>
                    </div>

                    {/* Remaining */}
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <Calendar className="text-orange-600" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Remaining</p>
                          <p className="text-xs text-gray-500">Pending delivery</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-orange-700">
                        {(
                          lines.reduce((sum, line) => {
                            let qty = Number(line.qty) || 0;
                            switch (line.unit) {
                              case 'sack':
                                qty = qty * 50;
                                break;
                              case 'ton':
                                qty = qty * 1000;
                                break;
                              default:
                                break;
                            }
                            return sum + qty;
                          }, 0) -
                          lines.reduce((sum, line) => {
                            let delivered = Number(line.delivered_qty) || 0;
                            switch (line.unit) {
                              case 'sack':
                                delivered = delivered * 50;
                                break;
                              case 'ton':
                                delivered = delivered * 1000;
                                break;
                              default:
                                break;
                            }
                            return sum + delivered;
                          }, 0)
                        ).toLocaleString()} kg
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Total Expected - Multiple Units */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FileText className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Total Expected</p>
                          <p className="text-xs text-gray-500">Contract commitment</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {Object.entries(totalsByUnit).map(([unit, qty]) => (
                          <div key={unit} className="text-lg font-bold text-gray-900">
                            {qty.toLocaleString()} {unit}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Delivery - Multiple Units */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Leaf className="text-green-600" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Total Delivered</p>
                          <p className="text-xs text-gray-500">Actual received</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {Object.entries(totalsByUnit).map(([unit]) => {
                          const delivered = lines
                            .filter(line => line.unit === unit)
                            .reduce((sum, line) => sum + (Number(line.delivered_qty) || 0), 0);
                          return (
                            <div key={unit} className="text-lg font-bold text-green-700">
                              {delivered.toLocaleString()} {unit}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Remaining - Multiple Units */}
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <Calendar className="text-orange-600" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Remaining</p>
                          <p className="text-xs text-gray-500">Pending delivery</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {Object.entries(totalsByUnit).map(([unit, qty]) => {
                          const delivered = lines
                            .filter(line => line.unit === unit)
                            .reduce((sum, line) => sum + (Number(line.delivered_qty) || 0), 0);
                          const remaining = qty - delivered;
                          return (
                            <div key={unit} className="text-lg font-bold text-orange-700">
                              {remaining.toLocaleString()} {unit}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link
                href={route('inventory.outbound.create', { partner_order_id: partnerOrder.id })}
                className="w-full mt-6 bg-[#37692F] hover:bg-[#2a5624] text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Plus size={20} />
                Record New Delivery
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Order Line Items</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th> 
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty Ordered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lines.map((line) => {
                let remainingQtyKg = (Number(line.qty) || 0) - (Number(line.delivered_qty) || 0);
                switch (line.unit) {
                  case 'sack':
                    remainingQtyKg = remainingQtyKg * 50;
                    break;
                  case 'ton':
                    remainingQtyKg = remainingQtyKg * 1000;
                    break;
                  default:
                    break;
                }

                // Available stock is already in kg from backend
                const availableStockKg = Number(line.available_stock ?? 0);

                // Show warning only if remaining delivery > available stock
                const isBackordered = remainingQtyKg > availableStockKg;
                
                return (
                  <tr key={line.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {line.product_type}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {line.product_name}
                      {isBackordered && (
                        <span className="ml-2 text-orange-500" title="Ordered quantity exceeds available stock">
                          ⚠️
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {line.qty}
                      {isBackordered && (
                        <span className="ml-2 text-orange-500" title={`Available: ${availableStockKg} kg (${orderedQtyKg} kg ordered)`}>
                          ⚠️
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{line.unit}</td>
                    <td className="px-6 py-4">{line.delivered_qty}</td>
                    <td className="px-6 py-4">₱{Number(line.price_per_unit).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ₱{(() => {
                        let qty = Number(line.qty) || 0;
                        let price = Number(line.price_per_unit) || 0;
                        switch (line.unit) {
                          case 'sack':
                            qty = qty * 50;
                            break;
                          case 'ton':
                            qty = qty * 1000;
                            break;
                        }
                        return (qty * price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                      })()}
                    </td>
                  </tr>
                );
              })}
              </tbody>
              {lines.length > 1 && (
                <tfoot>
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-right font-bold text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 font-bold text-green-700">
                      ₱{lines.reduce((sum, line) => {
                        let qty = Number(line.qty) || 0;
                        let price = Number(line.price_per_unit) || 0;
                        switch (line.unit) {
                          case 'sack':
                            qty = qty * 50;
                            break;
                          case 'ton':
                            qty = qty * 1000;
                            break;
                          // kg, liter, etc. use as is
                        }
                        return sum + (qty * price);
                      }, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Delivery Transaction History</h2>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition">
                <Download size={16} />
                Export Report
              </button>
            </div>

            {partnerOrder.buyback_transactions.length > 0 ? (
              <div className="space-y-3">
                {partnerOrder.buyback_transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Leaf className="text-green-600" size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-gray-900">{tx.product_name}</p>
                          <span className="text-sm text-gray-500">•</span>
                          <p className="text-sm text-gray-600">{tx.date}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{tx.notes}</p>
                        <p className="text-xs text-gray-500 mt-1">Delivered by: {tx.delivered_by}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-lg">
                        {tx.transaction_type === 'outbound' ? '-' : '+'}
                        {tx.quantity.toLocaleString()} {tx.unit}
                      </p>
                      <p className="text-sm text-gray-600">₱{tx.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Leaf className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600">No delivery transactions recorded yet</p>
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