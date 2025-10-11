import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, partner }) {
    // Static contract data for demonstration - SAMPLE MUNA TO BE REPLACED WITH DYNAMIC DATA HIHI
    const associatedContracts = [
        {
            id: 1,
            name: "Seed Distribution Agreement",
            status: "active",
            start_date: "2023-05-15",
            end_date: "2024-05-14",
            value: "₱250,000"
        },
        {
            id: 2,
            name: "Research Collaboration Contract",
            status: "inactive",
            start_date: "2022-01-10",
            end_date: "2022-12-31",
            value: "₱180,000"
        },
        {
            id: 3,
            name: "Supply Agreement - Organic Seeds",
            status: "active",
            start_date: "2023-08-01",
            end_date: "2024-07-31",
            value: "₱420,000"
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title={partner.name} />

            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    /{" "}
                    <Link
                        href={route('partners.index')}
                        className="text-[#37692F] hover:underline"
                    >
                        Partners
                    </Link>{" "}
                    / <span>{partner.name}</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Partner Information</h1>
                    <div className="flex space-x-3">
                        <Link
                            href={route('partners.edit', partner.id)}
                            className="bg-[#37692F] text-white px-4 py-2 rounded-md hover:bg-[#2a5624] flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Partner
                        </Link>
                        <Link
                            href={route('partners.index')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to List
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Basic Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{partner.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Partner Type</label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-poppins font-medium shadow-sm ${
                                    partner.partner_type === 'individual' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-purple-600 text-white'
                                }`}>
                                    {partner.partner_type.charAt(0).toUpperCase() + partner.partner_type.slice(1)}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-poppins font-normal ${
                                    partner.status === 'active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{partner.email || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{partner.phone || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal whitespace-pre-wrap">{partner.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Business Information Card */}
                    {(partner.registration_number || partner.tax_id) && (
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Business Information</h2>
                            
                            <div className="space-y-4">
                                {partner.registration_number && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                                        <p className="text-sm text-gray-900 font-poppins font-normal">{partner.registration_number}</p>
                                    </div>
                                )}

                                {partner.tax_id && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                                        <p className="text-sm text-gray-900 font-poppins font-normal">{partner.tax_id}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notes Card */}
                    {partner.notes && (
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Notes</h2>
                            <p className="text-sm text-gray-900 font-poppins font-normal whitespace-pre-wrap">{partner.notes}</p>
                        </div>
                    )}

                    {/* Contact Persons Card */}
                    {partner.partner_type === 'organization' && partner.contact_persons && partner.contact_persons.length > 0 && (
                        <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact Persons</h2>
                            <div className="space-y-4">
                                {partner.contact_persons.map((person, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <span className="block text-xs text-gray-500 mb-1">Name</span>
                                                <span className="font-medium text-gray-900 text-sm font-poppins font-normal">{person.name}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-gray-500 mb-1">Email</span>
                                                <span className="text-gray-900 text-sm font-poppins font-normal">{person.email || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-gray-500 mb-1">Phone</span>
                                                <span className="text-gray-900 text-sm font-poppins font-normal">{person.phone_number || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Farm Information Card */}
                    {partner.farms && partner.farms.length > 0 && (
                        <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Farm Information</h2>
                            <div className="space-y-4">
                                {partner.farms.map((farm, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-2">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <span className="block text-xs text-gray-500 mb-1">Farm Name</span>
                                                <span className="font-medium text-gray-900 text-sm">{farm.location_name || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-gray-500 mb-1">Area Size (hectares)</span>
                                                <span className="text-gray-900 text-sm">{farm.area_size || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-gray-500 mb-1">Soil Type</span>
                                                <span className="text-gray-900 text-sm">{farm.soil_type ? farm.soil_type.charAt(0).toUpperCase() + farm.soil_type.slice(1) : 'N/A'}</span>
                                            </div>
                                            <div className="md:col-span-1">
                                                <span className="block text-xs text-gray-500 mb-1">Address</span>
                                                <span className="text-gray-900 text-sm whitespace-pre-wrap">{farm.address || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Associated Contracts Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Associated Contracts</h2>
                        
                        {associatedContracts.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 font-poppins font-medium">Contract Name</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Status</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Duration</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {associatedContracts.map((contract) => (
                                            <tr key={contract.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {contract.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-poppins font-normal ${
                                                        contract.status === "active" 
                                                            ? "bg-green-100 text-green-700" 
                                                            : "bg-red-100 text-red-700"
                                                    }`}>
                                                        {contract.status === "active" ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-600">
                                                    {new Date(contract.start_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })} - {new Date(contract.end_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {contract.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 font-poppins font-normal">No contracts associated with this partner.</p>
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-6 text-sm text-gray-500 font-poppins font-normal">
                    <p>Created: {new Date(partner.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}</p>
                    <p>Last Updated: {new Date(partner.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}