import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, seed, associatedContracts }) {
    const { auth: authData } = usePage().props;
    const permissions = authData?.user?.can || [];

    const dateFormatter = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Adapted for seed status
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'archived': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Add this function for contract status colors
    const getContractStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'under_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'suspended': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'terminated': return 'bg-red-100 text-red-800 border-red-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Seed Details</span>
                </h2>
            }
        >
            <Head title={seed.seed_variety} />
            
            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline transition-colors duration-200"
                    >
                        Home
                    </Link>
                    <span className="text-gray-400">/</span>
                    <Link
                        href={route('seeds.index')}
                        className="text-[#37692F] hover:underline transition-colors duration-200"
                    >
                        Seeds
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-800 font-medium truncate max-w-xs">{seed.seed_variety}</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#37692F] to-[#4a8a3f] flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">
                                    {seed.seed_variety.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-poppins">
                                    {seed.seed_variety}
                                </h1>
                                <div className="flex items-center space-x-3 mt-2">
                                    {/* Seed Status Badge */}
                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(seed.status)}`}>
                                        <div className={`w-2 h-2 rounded-full mr-2 ${seed.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        {seed.status.charAt(0).toUpperCase() + seed.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => window.location.href = route('seeds.exportProfile', seed.id)}
                                className="flex items-center rounded-xl bg-gradient-to-r from-[#37692F] to-[#4a8a3f] px-5 py-3 text-white font-medium hover:from-[#2a5624] hover:to-[#37692F] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                title="Export Seed Profile PDF"
                            >
                                {/* Correct Download Icon */}
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export PDF
                            </button>
                            {permissions.includes('edit seeds') && seed.status !== 'archived' && (
                                <Link
                                    href={route('seeds.edit', seed.id)}
                                    className="flex items-center rounded-xl bg-gradient-to-r from-[#37692F] to-[#4a8a3f] px-5 py-3 text-white font-medium hover:from-[#2a5624] hover:to-[#37692F] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Seed
                                </Link>
                            )}
                            <Link
                                href={route('seeds.index')}
                                className="flex items-center rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 px-5 py-3 text-white font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to List
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    
                    {/* Basic Information */}
                    <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Seed Variety</label>
                                <p className="text-lg font-semibold text-gray-900">{seed.seed_variety}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Status</label>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(seed.status)}`}>
                                        {seed.status.charAt(0).toUpperCase() + seed.status.slice(1)}
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Price per Kg</label>
                                    <p className="text-gray-900 font-semibold">Php {Number(seed.price_per_unit).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Growth & Storage Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Growth & Storage</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Growth Cycle</label>
                                    <p className="text-gray-900 font-semibold">{seed.growth_cycle} days</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Soil Type</label>
                                    <p className="text-gray-900 font-semibold">{seed.soil_type.charAt(0).toUpperCase() + seed.soil_type.slice(1)}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Storage Requirements</label>
                                <p className="text-gray-900 whitespace-pre-wrap">{seed.storage_requirements}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes Card */}
                    {seed.notes && (
                        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Notes</h2>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{seed.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Associated Contracts Card */}
                    <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Associated Contracts ({associatedContracts.length})</h2>
                        </div>
                        
                        {associatedContracts.length > 0 ? (
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <tr>
                                            {['Contract Name', 'Partner', 'Status', 'Duration', 'Seed Amount', 'Expected Buyback'].map((header) => (
                                                <th key={header} className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {associatedContracts.map((contract) => (
                                            <tr key={contract.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <Link
                                                            href={route('contracts.show', contract.id)}
                                                            className="font-medium text-blue-700 hover:text-[#37692F] hover:underline"
                                                            title={`View contract: ${contract.contract_name}`}
                                                        >
                                                            {contract.contract_name}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                    {contract.partner_name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getContractStatusColor(contract.status)}`}>
                                                        <div className={`w-2 h-2 rounded-full mr-2 ${contract.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                                        {contract.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {dateFormatter(contract.start_date)} - {dateFormatter(contract.end_date)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-gray-800 text-sm">
                                                        {Number(contract.seed_amount).toLocaleString()} {contract.unit}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-gray-800 text-sm">
                                                        {Number(contract.expected_buyback_amount).toLocaleString()} {contract.buyback_unit}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">No contracts associated with this seed.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Created: <strong className="text-gray-700">{dateFormatter(seed.created_at)}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Last Updated: <strong className="text-gray-700">{dateFormatter(seed.updated_at)}</strong></span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}