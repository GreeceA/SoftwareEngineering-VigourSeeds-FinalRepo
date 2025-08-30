import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, partner }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={partner.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold">Partner Details</h1>
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('partners.edit', partner.id)}
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('partners.index')}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Back to List
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <p className="mt-1 text-sm text-gray-900">{partner.name}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Partner Type</label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                partner.partner_type === 'individual' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {partner.partner_type}
                                            </span>
                                        </div>

                                        {partner.contact_person && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                                                <p className="mt-1 text-sm text-gray-900">{partner.contact_person}</p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                partner.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {partner.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <p className="mt-1 text-sm text-gray-900">{partner.email}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                                            <p className="mt-1 text-sm text-gray-900">{partner.phone}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Address</label>
                                            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{partner.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {(partner.registration_number || partner.tax_id) && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h2 className="text-lg font-semibold mb-4">Business Information</h2>
                                        
                                        <div className="space-y-3">
                                            {partner.registration_number && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                                                    <p className="mt-1 text-sm text-gray-900">{partner.registration_number}</p>
                                                </div>
                                            )}

                                            {partner.tax_id && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Tax ID</label>
                                                    <p className="mt-1 text-sm text-gray-900">{partner.tax_id}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {partner.notes && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h2 className="text-lg font-semibold mb-4">Notes</h2>
                                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{partner.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 text-sm text-gray-500">
                                <p>Created: {new Date(partner.created_at).toLocaleDateString()}</p>
                                <p>Last Updated: {new Date(partner.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}