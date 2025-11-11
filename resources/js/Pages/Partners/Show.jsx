import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, partner }) {
    const { auth: authData } = usePage().props;
    const permissions = authData?.user?.can || [];

    // Static contract data for demonstration - SAMPLE TO BE REPLACED WITH DYNAMIC DATA
    const associatedContracts = partner.contracts || [];

    const dateFormatter = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPartnerTypeColor = (type) => {
        switch (type) {
            case 'individual': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'organization': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                        <span className="text-[#333333] font-[400]"> | Partner Details</span>
                    </h2>
                }
            >
        <Head title={partner.name} />
            
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
                        href={route('partners.index')}
                        className="text-[#37692F] hover:underline transition-colors duration-200"
                    >
                        Partners
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-800 font-medium truncate max-w-xs">{partner.name}</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#37692F] to-[#4a8a3f] flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">
                                    {partner.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-poppins">
                                    {partner.name}
                                </h1>
                                <div className="flex items-center space-x-3 mt-2">
                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getPartnerTypeColor(partner.partner_type)}`}>
                                        <div className={`w-2 h-2 rounded-full mr-2 ${partner.partner_type === 'individual' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                                        {partner.partner_type.charAt(0).toUpperCase() + partner.partner_type.slice(1)}
                                    </span>
                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(partner.status)}`}>
                                        <div className={`w-2 h-2 rounded-full mr-2 ${partner.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            {permissions.includes('edit partners') && partner.status !== 'inactive' && (
                                <Link
                                    href={route('partners.edit', partner.id)}
                                    className="flex items-center rounded-xl bg-gradient-to-r from-[#37692F] to-[#4a8a3f] px-5 py-3 text-white font-medium hover:from-[#2a5624] hover:to-[#37692F] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Partner
                                </Link>
                            )}
                            <Link
                                href={route('partners.index')}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Name</label>
                                <p className="text-lg font-semibold text-gray-900">{partner.name}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Partner Type</label>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getPartnerTypeColor(partner.partner_type)}`}>
                                        {partner.partner_type.charAt(0).toUpperCase() + partner.partner_type.slice(1)}
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Status</label>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(partner.status)}`}>
                                        {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Contact Information</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-900 font-medium">{partner.email || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</label>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <p className="text-gray-900 font-medium">{partner.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Address</label>
                                <div className="flex items-start space-x-2">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-gray-900 whitespace-pre-wrap">{partner.address || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Business Information Card */}
                    {(partner.registration_number || partner.tax_id) && (
                        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Business Information</h2>
                            </div>
                            
                            <div className="space-y-5">
                                {partner.registration_number && (
                                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Registration Number</label>
                                        <p className="text-gray-900 font-medium font-mono">{partner.registration_number}</p>
                                    </div>
                                )}

                                {partner.tax_id && (
                                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Tax ID</label>
                                        <p className="text-gray-900 font-medium font-mono">{partner.tax_id}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notes Card */}
                    {partner.notes && (
                        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Notes</h2>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{partner.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Contact Persons Card */}
                    {partner.partner_type === 'organization' && partner.contact_persons && partner.contact_persons.length > 0 && (
                        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Contact Persons</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {partner.contact_persons.map((person, idx) => (
                                    <div key={idx} className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-semibold text-gray-600">
                                                    {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">{person.name}</h3>
                                                <div className="mt-2 space-y-1">
                                                    {person.email && (
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="truncate">{person.email}</span>
                                                        </div>
                                                    )}
                                                    {person.phone_number && (
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            <span>{person.phone_number}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Farm Information Card */}
                    {partner.farms && partner.farms.length > 0 && (
                        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Farm Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {partner.farms.map((farm, idx) => (
                                    <div key={idx} className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-start space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-lg">{farm.location_name || 'Unnamed Farm'}</h3>
                                                {farm.address && (
                                                    <div className="flex items-center space-x-1 mt-1 text-sm text-gray-600">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        </svg>
                                                        <span className="truncate">{farm.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            {farm.area_size && (
                                                <div>
                                                    <span className="block text-xs text-gray-500 font-medium">Area Size</span>
                                                    <span className="text-gray-900 font-semibold">{farm.area_size} hectares</span>
                                                </div>
                                            )}
                                            {farm.soil_type && (
                                                <div>
                                                    <span className="block text-xs text-gray-500 font-medium">Soil Type</span>
                                                    <span className="text-gray-900 font-semibold">{farm.soil_type.charAt(0).toUpperCase() + farm.soil_type.slice(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
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
                            <h2 className="text-xl font-bold text-gray-800">Associated Contracts</h2>
                        </div>
                        
                        {associatedContracts.length > 0 ? (
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <tr>
                                            {['Contract Name', 'Status', 'Duration', 'Value'].map((header) => (
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
                                                            className="font-medium text-blue-700 hover:text-[#37692F]"
                                                            title={`View contract: ${contract.name}`}
                                                        >
                                                            {contract.name}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                                        contract.status === "active" 
                                                            ? "bg-green-100 text-green-800 border border-green-200" 
                                                            : "bg-red-100 text-red-800 border border-red-200"
                                                    }`}>
                                                        <div className={`w-2 h-2 rounded-full mr-2 ${contract.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                        {contract.status === "active" ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {dateFormatter(contract.start_date)} - {dateFormatter(contract.end_date)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
                                                        {Number(contract.value).toFixed(2)}
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
                                <p className="text-gray-500 font-medium">No contracts associated with this partner.</p>
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
                        <span>Created: <strong className="text-gray-700">{dateFormatter(partner.created_at)}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Last Updated: <strong className="text-gray-700">{dateFormatter(partner.updated_at)}</strong></span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}