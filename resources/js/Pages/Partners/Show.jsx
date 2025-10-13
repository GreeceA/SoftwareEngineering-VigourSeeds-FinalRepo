import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, partner }) {
    // Static contract data for demonstration - SAMPLE TO BE REPLACED WITH DYNAMIC DATA
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

    const dateFormatter = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title={partner.name} />
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
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Partner Information</h1>
                    <div className="flex space-x-3">
                        {partner.status !== 'inactive' && (
                            <Link
                                href={route('partners.edit', partner.id)}
                                className="flex items-center rounded-md bg-[#37692F] px-4 py-2 text-white hover:bg-[#2a5624]"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Partner
                            </Link>
                        )}
                        <Link
                            href={route('partners.index')}
                            className="flex items-center rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to List
                        </Link>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Basic Information */}
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Basic Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{partner.name}</p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Partner Type</label>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-poppins font-medium shadow-sm ${
                                    partner.partner_type === 'individual' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-purple-600 text-white'
                                }`}>
                                    {partner.partner_type.charAt(0).toUpperCase() + partner.partner_type.slice(1)}
                                </span>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-poppins font-normal ${
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
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Contact Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{partner.email || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{partner.phone || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                                <p className="whitespace-pre-wrap font-poppins text-sm font-normal text-gray-900">{partner.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Business Information Card */}
                    {(partner.registration_number || partner.tax_id) && (
                        <div className="rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Business Information</h2>
                            
                            <div className="space-y-4">
                                {partner.registration_number && (
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Registration Number</label>
                                        <p className="font-poppins text-sm font-normal text-gray-900">{partner.registration_number}</p>
                                    </div>
                                )}

                                {partner.tax_id && (
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Tax ID</label>
                                        <p className="font-poppins text-sm font-normal text-gray-900">{partner.tax_id}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notes Card */}
                    {partner.notes && (
                        <div className="rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Notes</h2>
                            <p className="whitespace-pre-wrap font-poppins text-sm font-normal text-gray-900">{partner.notes}</p>
                        </div>
                    )}

                    {/* Contact Persons Card */}
                    {partner.partner_type === 'organization' && partner.contact_persons && partner.contact_persons.length > 0 && (
                        <div className="md:col-span-2 rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Contact Persons</h2>
                            <div className="space-y-4">
                                {partner.contact_persons.map((person, idx) => (
                                    <div key={idx} className="rounded-lg border border-gray-200 p-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <div>
                                                <span className="mb-1 block text-xs text-gray-500">Name</span>
                                                <span className="font-poppins text-sm font-normal font-medium text-gray-900">{person.name}</span>
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-xs text-gray-500">Email</span>
                                                <span className="font-poppins text-sm font-normal text-gray-900">{person.email || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-xs text-gray-500">Phone</span>
                                                <span className="font-poppins text-sm font-normal text-gray-900">{person.phone_number || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Farm Information Card */}
                    {partner.farms && partner.farms.length > 0 && (
                        <div className="md:col-span-2 rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Farm Information</h2>
                            <div className="space-y-4">
                                {partner.farms.map((farm, idx) => (
                                    <div key={idx} className="mb-2 rounded-lg border border-gray-200 p-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                            <div>
                                                <span className="mb-1 block text-xs text-gray-500">Farm Name</span>
                                                <span className="text-sm font-medium text-gray-900">{farm.location_name || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-xs text-gray-500">Area Size (hectares)</span>
                                                <span className="text-sm text-gray-900">{farm.area_size || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-xs text-gray-500">Soil Type</span>
                                                <span className="text-sm text-gray-900">{farm.soil_type ? farm.soil_type.charAt(0).toUpperCase() + farm.soil_type.slice(1) : 'N/A'}</span>
                                            </div>
                                            <div className="md:col-span-1">
                                                <span className="mb-1 block text-xs text-gray-500">Address</span>
                                                <span className="whitespace-pre-wrap text-sm text-gray-900">{farm.address || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Associated Contracts Card */}
                    <div className="md:col-span-2 rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Associated Contracts</h2>
                        
                        {associatedContracts.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-xs uppercase bg-gray-100 text-gray-700">
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
                                                    <span className={`rounded-full px-3 py-1 text-xs font-poppins font-normal ${
                                                        contract.status === "active" 
                                                            ? "bg-green-100 text-green-700" 
                                                            : "bg-red-100 text-red-700"
                                                    }`}>
                                                        {contract.status === "active" ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-600">
                                                    {dateFormatter(contract.start_date)} - {dateFormatter(contract.end_date)}
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
                            <p className="font-poppins text-sm font-normal text-gray-500">No contracts associated with this partner.</p>
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-6 font-poppins text-sm font-normal text-gray-500">
                    <p>Created: {dateFormatter(partner.created_at)}</p>
                    <p>Last Updated: {dateFormatter(partner.updated_at)}</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}