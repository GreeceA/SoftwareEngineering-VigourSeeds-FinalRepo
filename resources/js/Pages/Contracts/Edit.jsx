import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, contract }) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    const { post, processing } = useForm();

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

    const handleStatusChange = () => {
        if (selectedStatus) {
            post(route('contracts.change-status', contract.id), {
                data: { status: selectedStatus },
                onSuccess: () => {
                    setShowStatusModal(false);
                    setSelectedStatus('');
                }
            });
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to archive this contract?')) {
            post(route('contracts.destroy', contract.id), {
                method: 'delete',
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Contract: {contract.title}
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route('contracts.index')}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
                        >
                            Back to Contracts
                        </Link>
                        {(contract.can_be_edited || contract.can_be_partially_edited) && (
                            <Link
                                href={route('contracts.edit', contract.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
                            >
                                Edit Contract
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Contract: ${contract.title}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Contract Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
                                    <p className="text-gray-600 mt-1">Contract ID: #{contract.id}</p>
                                </div>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                                    {contract.status}
                                </span>
                            </div>

                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contract Details</h3>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Partner</dt>
                                            <dd className="text-sm text-gray-900">{contract.partner.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Contract Date</dt>
                                            <dd className="text-sm text-gray-900">{contract.contract_date}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Effective Date</dt>
                                            <dd className="text-sm text-gray-900">{contract.effective_date || 'Not set'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Expiration Date</dt>
                                            <dd className="text-sm text-gray-900">{contract.expiration_date || 'Not set'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Contract File</dt>
                                            <dd className="text-sm text-gray-900">
                                                {contract.contract_file ? (
                                                    <a
                                                        href={`/storage/${contract.contract_file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                    >
                                                        Download File
                                                    </a>
                                                ) : (
                                                    'No file uploaded'
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                                    <div className="space-y-3">
                                        {contract.available_transitions.length > 0 && (
                                            <button
                                                onClick={() => setShowStatusModal(true)}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
                                            >
                                                Change Status
                                            </button>
                                        )}
                                        
                                        {contract.status !== 'archived' && (
                                            <button
                                                onClick={handleDelete}
                                                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
                                            >
                                                Archive Contract
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {contract.notes && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 whitespace-pre-wrap">{contract.notes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Seed Items */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Seed Varieties</h3>
                                <div className="space-y-4">
                                    {contract.seed_items.map((item, index) => (
                                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-medium text-gray-900">{item.seed.seed_variety}</h4>
                                                <span className="text-sm text-gray-500">#{index + 1}</span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                <div>
                                                    <dt className="text-xs font-medium text-gray-500">Quantity</dt>
                                                    <dd className="text-sm font-medium text-gray-900">{item.quantity} {item.unit}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs font-medium text-gray-500">Unit Price</dt>
                                                    <dd className="text-sm font-medium text-gray-900">${item.seed.price_per_unit}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs font-medium text-gray-500">Cycles</dt>
                                                    <dd className="text-sm font-medium text-gray-900">{item.cycles}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs font-medium text-gray-500">Expected Harvest</dt>
                                                    <dd className="text-sm font-medium text-gray-900">{item.expected_harvest_date}</dd>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Change Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Contract Status</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Current status: <span className="font-medium">{contract.status}</span>
                            </p>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select new status:
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Choose status...</option>
                                    {contract.available_transitions.map((status) => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedStatus === 'active' && !contract.contract_file && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <p className="text-sm text-yellow-800">
                                        A contract file is required to activate the contract. Please upload a file first.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setSelectedStatus('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStatusChange}
                                    disabled={!selectedStatus || processing || (selectedStatus === 'active' && !contract.contract_file)}
                                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Changing...' : 'Change Status'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}