import React from 'react';
import { FileText, Leaf, Calendar, MapPin, User, Download, Plus } from 'lucide-react';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link } from '@inertiajs/react';

const PartnerOrderShow = () => {
    const { auth, partnerOrder } = usePage().props;
    const contract = partnerOrder.contract || {};
    const lines = partnerOrder.lines || [];
    const buybackTransactions = partnerOrder.buyback_transactions || [];
    const fulfillmentPct = partnerOrder.fulfillment_percentage ?? 0;

    // Calculate summary values
    const expectedTotalKg = lines.reduce((sum, line) => {
        let qty = Number(line.qty) || 0;
        switch (line.unit) {
            case 'sack': qty = qty * 50; break;
            case 'ton': qty = qty * 1000; break;
        }
        return sum + qty;
    }, 0);
    const deliveredTotalKg = lines.reduce((sum, line) => {
        let delivered = Number(line.delivered_qty) || 0;
        switch (line.unit) {
            case 'sack': delivered = delivered * 50; break;
            case 'ton': delivered = delivered * 1000; break;
        }
        return sum + delivered;
    }, 0);
    const remainingKg = expectedTotalKg - deliveredTotalKg;
    const totalValue = buybackTransactions.reduce((sum, tx) => sum + (tx.value || 0), 0);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white border-b border-gray-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
                <div className="relative px-6 py-6">
                    <nav className="flex items-center space-x-2 text-sm mb-4">
                        <a href={route('dashboard')} className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                            <HomeIcon className="w-4 h-4" />
                        </a>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        <a href={route('partner-orders.index')} className="text-gray-600 hover:text-gray-900 transition-colors">
                            Partner Orders
                        </a>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-[#37692F] font-medium">PO-{contract.contract_name}-{partnerOrder.id}</span>
                    </nav>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl shadow-lg shadow-green-900/20 flex items-center justify-center">
                                <FileText className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1 font-poppins">PO-{contract.contract_name}-{partnerOrder.id}</h1>
                                <p className="text-gray-600 font-poppins">{contract.partner_name || partnerOrder.partner?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize font-poppins ${
                                partnerOrder.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                                partnerOrder.status === 'partially_fulfilled' ? 'bg-blue-100 text-blue-800' :
                                partnerOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {partnerOrder.status?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Main Card */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 font-poppins">Farm Location</p>
                                        <p className="font-medium text-gray-900 font-poppins">{contract.farm_name}</p>
                                        <p className="text-sm text-gray-600 font-poppins">{contract.farm_location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <User className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 font-poppins">Partner Contact</p>
                                        <p className="font-medium text-gray-900 font-poppins">{contract.partner_contact || partnerOrder.partner?.contact}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 font-poppins">Contract Period</p>
                                        <p className="font-medium text-gray-900 font-poppins">{contract.effective_date} to {contract.expiration_date}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Leaf className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 font-poppins">Buyback Price</p>
                                        <p className="font-medium text-green-600 text-lg font-poppins">₱{Number(contract.buyback_price_per_unit).toFixed(2)}/kg</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                {partnerOrder.notes && (
                                    <div className="mb-8">
                                        <span className="text-sm text-gray-600 font-semibold font-poppins">Order Notes:</span>
                                        <div className="text-sm text-gray-800 mt-1 font-poppins">{partnerOrder.notes}</div>
                                    </div>
                                )}
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600 font-poppins">Order Fulfillment</span>
                                    <span className={`text-sm font-semibold font-poppins ${
                                        fulfillmentPct >= 100 ? 'text-green-600' :
                                        fulfillmentPct >= 75 ? 'text-blue-600' :
                                        fulfillmentPct >= 50 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
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
                        {/* Summary Card */}
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-poppins">Total Expected</span>
                                        <span className="font-bold text-gray-900 font-poppins">{expectedTotalKg.toLocaleString()} kg</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-poppins">Total Delivered</span>
                                        <span className="font-bold text-green-700 font-poppins">{deliveredTotalKg.toLocaleString()} kg</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-poppins">Remaining</span>
                                        <span className="font-bold text-orange-700 font-poppins">{remainingKg.toLocaleString()} kg</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t pt-4">
                                        <span className="text-gray-600 font-poppins">Total Value</span>
                                        <span className="font-bold text-green-700 font-poppins">₱{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href={route('inventory.outbound.create', { partner_order_id: partnerOrder.id })}
                                className="w-full mt-6 bg-[#37692F] hover:bg-[#2a5624] text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md font-poppins"
                            >
                                <Plus size={20} />
                                Record Delivery
                            </Link>
                        </div>
                    </div>
                    {/* Order Line Items Card - Segregated */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">Order Line Items</h2>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-[#37692F]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider font-poppins">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider font-poppins">Product Name</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider font-poppins">Qty Ordered</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider font-poppins">Unit</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider font-poppins">Delivered</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider font-poppins">Price/Unit</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider font-poppins">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {lines.map((line) => (
                                        <tr key={line.id} className="hover:bg-green-50">
                                            <td className="px-6 py-4 font-poppins text-gray-900 font-medium">{line.product_type}</td>
                                            <td className="px-6 py-4 font-poppins">{line.product_name}</td>
                                            <td className="px-6 py-4 text-right font-poppins">{line.qty}</td>
                                            <td className="px-6 py-4 text-center font-poppins">{line.unit}</td>
                                            <td className="px-6 py-4 text-center font-poppins">{line.delivered_qty}</td>
                                            <td className="px-6 py-4 text-right font-poppins">₱{Number(line.price_per_unit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-4 text-right font-semibold text-green-600 font-poppins">
                                                ₱{(() => {
                                                    let qty = Number(line.qty) || 0;
                                                    let price = Number(line.price_per_unit) || 0;
                                                    switch (line.unit) {
                                                        case 'sack': qty = qty * 50; break;
                                                        case 'ton': qty = qty * 1000; break;
                                                    }
                                                    return (qty * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                })()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {lines.length > 1 && (
                                    <tfoot>
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 text-right font-bold text-gray-900 font-poppins">Total</td>
                                            <td className="px-6 py-4 text-right font-bold text-green-700 font-poppins">
                                                ₱{lines.reduce((sum, line) => {
                                                    let qty = Number(line.qty) || 0;
                                                    let price = Number(line.price_per_unit) || 0;
                                                    switch (line.unit) {
                                                        case 'sack': qty = qty * 50; break;
                                                        case 'ton': qty = qty * 1000; break;
                                                    }
                                                    return sum + (qty * price);
                                                }, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>
                    {/* Transaction History Section */}
                    <div className="bg-white rounded-lg shadow p-6 mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 font-poppins">Delivery Transaction History</h2>
                            <button
                                onClick={() => window.location.href = route('partner-orders.exportDeliveryHistory', partnerOrder.id)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition font-poppins"
                            >
                                <Download size={16} />
                                Export Report
                            </button>
                        </div>
                        {buybackTransactions.length > 0 ? (
                            <div className="space-y-3">
                                {buybackTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-100 p-3 rounded-lg">
                                                <Leaf className="text-green-600" size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <p className="font-medium text-gray-900 font-poppins">{tx.product_name}</p>
                                                    <span className="text-sm text-gray-500">•</span>
                                                    <p className="text-sm text-gray-600 font-poppins">{tx.date}</p>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 font-poppins">{tx.notes}</p>
                                                <p className="text-xs text-gray-500 mt-1 font-poppins">Delivered by: {tx.delivered_by}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600 text-lg font-poppins">
                                                {tx.transaction_type === 'outbound' ? '-' : '+'}
                                                {tx.quantity.toLocaleString()} {tx.unit}
                                            </p>
                                            <p className="text-sm text-gray-600 font-poppins">₱{tx.value.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Leaf className="mx-auto text-gray-400 mb-3" size={48} />
                                <p className="text-gray-600 font-poppins">No delivery transactions recorded yet</p>
                                <p className="text-sm text-gray-500 mt-1 font-poppins">Deliveries will appear here once recorded</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default PartnerOrderShow;