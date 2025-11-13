import React, { useState } from 'react';
import { Leaf, TrendingUp, AlertCircle, CheckCircle, Plus, Eye } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link, router } from '@inertiajs/react';

const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'terminated', label: 'Terminated' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'completed', label: 'Completed' },
];

const sortOptions = [
    { value: 'contract_number', label: 'Contract No.' },
    { value: 'partner_name', label: 'Partner' },
    { value: 'expected_kg', label: 'Expected Buyback' },
    { value: 'actual_kg', label: 'Received Buyback' },
    { value: 'fulfillment_percentage', label: 'Fulfillment %' },
];

const getFulfillmentStatus = (pct) => {
    if (pct >= 100) return { color: 'text-green-600', bg: 'bg-green-100', label: 'Complete' };
    if (pct >= 75) return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'On Track' };
    if (pct >= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'In Progress' };
    return { color: 'text-red-600', bg: 'bg-red-100', label: 'Behind' };
};

const BuybackOverview = () => {
    const { auth, contracts } = usePage().props;
    const permissions = auth?.user?.can || [];
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('contract_number');
    const [sortAsc, setSortAsc] = useState(true);

    // contracts is now a paginated object
    const filteredContracts = statusFilter === 'all'
        ? contracts.data
        : contracts.data.filter(c => c.status === statusFilter);

    const sortedContracts = [...filteredContracts].sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortAsc ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortAsc ? 1 : -1;
        return 0;
    });

    const totalExpected = sortedContracts.reduce((sum, c) => sum + (c.expected_kg ?? 0), 0);
    const totalActual = sortedContracts.reduce((sum, c) => sum + (c.actual_kg ?? 0), 0);
    const totalRemaining = totalExpected - totalActual;
    const overallFulfillment = totalExpected > 0 ? (totalActual / totalExpected) * 100 : 0;

    // Pagination handler
    const handlePageChange = (url) => {
        router.get(url, {}, { preserveState: true, preserveScroll: true });
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
                        <button
                            type="button"
                            onClick={() => {
                                window.open(
                                    route('buybacks.export', {
                                        partner_id: '', // Replace with selected partner_id if you have a filter
                                        contract_id: '', // Replace with selected contract_id if you have a filter
                                        date_from: '', // Replace with selected date_from if you have a filter
                                        date_to: '', // Replace with selected date_to if you have a filter
                                    }),
                                    '_blank'
                                );
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                            title="Export Buyback Transactions PDF"
                        >
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export PDF
                        </button>
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

                    {/* Filter and Sort Controls */}
                    <div className="mb-4 flex gap-2 flex-wrap">
                        {statusOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setStatusFilter(opt.value)}
                                className={`px-4 py-2 rounded-lg font-medium border transition ${statusFilter === opt.value
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                        <div className="ml-auto flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="px-2 py-1 rounded border border-gray-300"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => setSortAsc(!sortAsc)}
                                className="px-2 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                                title={sortAsc ? 'Ascending' : 'Descending'}
                            >
                                {sortAsc ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Total Expected</p>
                                <Leaf className="text-blue-600" size={20} />
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{totalExpected ? totalExpected.toLocaleString() : '0'}</p>
                            <p className="text-xs text-gray-500 mt-1">kg</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Total Received</p>
                                <CheckCircle className="text-green-600" size={20} />
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{totalActual ? totalActual.toLocaleString() : '0'}</p>
                            <p className="text-xs text-gray-500 mt-1">kg</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Remaining</p>
                                <AlertCircle className="text-yellow-600" size={20} />
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{totalRemaining ? totalRemaining.toLocaleString() : '0'}</p>
                            <p className="text-xs text-gray-500 mt-1">kg</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Fulfillment Rate</p>
                                <TrendingUp className="text-purple-600" size={20} />
                            </div>
                            <p className="text-3xl font-bold text-gray-900">
                                {totalExpected > 0 ? `${overallFulfillment.toFixed(1)}%` : '-'}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-purple-600 h-2 rounded-full transition-all"
                                    style={{ width: `${totalExpected > 0 ? Math.min(overallFulfillment, 100) : 0}%` }}
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
                                    {sortedContracts.map((contract) => {
                                        const expectedValue = contract.expected_kg * contract.buyback_price;
                                        const fulfillment = contract.expected_kg > 0 ? (contract.actual_kg / contract.expected_kg) * 100 : 0;
                                        const status = getFulfillmentStatus(fulfillment);

                                        return (
                                            <tr key={contract.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{contract.contract_number}-{contract.id}</p>
                                                        <p className="text-xs text-gray-500">₱{Number(contract.buyback_price).toFixed(2)}/kg</p>
                                                        <span
                                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${contract.status === 'active'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : contract.status === 'terminated'
                                                                        ? 'bg-red-100 text-red-700'
                                                                        : contract.status === 'suspended'
                                                                            ? 'bg-yellow-100 text-yellow-700'
                                                                            : contract.status === 'completed'
                                                                                ? 'bg-blue-100 text-blue-700'
                                                                                : 'bg-gray-100 text-gray-700'
                                                                }`}
                                                        >
                                                            {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                                                        </span>
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
                                                        {contract.expected_buyback_amount.toLocaleString()} {contract.buyback_unit}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        ≈ {contract.expected_kg.toLocaleString()} kg
                                                    </p>
                                                    <p className="text-xs text-gray-500">≈ ₱{expectedValue.toLocaleString()}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <p className="font-semibold text-green-600">
                                                        {contract.actual_kg.toLocaleString()} kg
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <p className={`font-semibold ${contract.remaining_kg === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {contract.remaining_kg.toLocaleString()} kg
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-24">
                                                            <div
                                                                className={`h-2 rounded-full transition-all ${fulfillment >= 100 ? 'bg-green-600' :
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
                            {sortedContracts.length === 0 && (
                                <div className="p-8 text-center text-gray-500 text-lg">
                                    No Contracts Found
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center mt-6 gap-2">
                        {contracts.links.map((link, idx) => (
                            <button
                                key={idx}
                                disabled={link.active || !link.url}
                                onClick={() => link.url && handlePageChange(link.url)}
                                className={`px-3 py-1 rounded border text-sm font-medium ${link.active
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
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