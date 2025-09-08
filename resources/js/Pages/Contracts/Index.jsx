import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, contracts }) {
    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800',
            active: 'bg-green-100 text-green-800',
            suspended: 'bg-yellow-100 text-yellow-800',
            terminated: 'bg-red-100 text-red-800',
            cancelled: 'bg-red-100 text-red-800',
            archived: 'bg-gray-100 text-gray-500',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Contracts
                    </h2>
                    <Link
                        href={route('contracts.create')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
                    >
                        Create Contract
                    </Link>
                </div>
            }
        >
            <Head title="Contracts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {contracts.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">No contracts found</p>
                                    <Link
                                        href={route('contracts.create')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
                                    >
                                        Create Your First Contract
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Contract Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Partner
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Contract Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Effective Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Expiration Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Seed Varieties
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
                                            {contracts.data.map((contract) => (
                                                <tr key={contract.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">
                                                            {contract.title}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {contract.partner_name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {contract.contract_date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {contract.effective_date || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {contract.expiration_date || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                                            {contract.seed_varieties}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                                                            {contract.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('contracts.show', contract.id)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                View
                                                            </Link>
                                                            <Link
                                                                href={route('contracts.edit', contract.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Edit
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {/* Pagination */}
                                    {(contracts.prev_page_url || contracts.next_page_url) && (
                                        <div className="mt-6 flex justify-between items-center">
                                            <div className="text-sm text-gray-700">
                                                Showing {contracts.from} to {contracts.to} of {contracts.total} results
                                            </div>
                                            <div className="flex space-x-2">
                                                {contracts.prev_page_url && (
                                                    <Link
                                                        href={contracts.prev_page_url}
                                                        className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50"
                                                    >
                                                        Previous
                                                    </Link>
                                                )}
                                                {contracts.next_page_url && (
                                                    <Link
                                                        href={contracts.next_page_url}
                                                        className="ml-3 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50"
                                                    >
                                                        Next
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}