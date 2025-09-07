import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, contract }) {
    const getStatusBadge = (status) => {
        const statusColors = {
            draft: 'bg-gray-100 text-gray-800',
            active: 'bg-green-100 text-green-800',
            archived: 'bg-red-100 text-red-800'
        };
        
        return (
            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${statusColors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const downloadContract = () => {
        if (contract.contract_file) {
            window.open(`/storage/${contract.contract_file}`, '_blank');
        }
    };

    const calculateDaysUntilHarvest = () => {
        const harvestDate = new Date(contract.expected_harvest_date);
        const today = new Date();
        const diffTime = harvestDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Contract Details: {contract.contract_title}
                    </h2>
                    <div className="flex space-x-2">
                        <Link
                            href={route('contracts.edit', contract.id)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Edit Contract
                        </Link>
                        <Link
                            href={route('contracts.index')}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Back to Contracts
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Contract: ${contract.contract_title}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Contract Overview */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {contract.contract_title}
                                    </h3>
                                    <p className="text-gray-600">
                                        Partner: <span className="font-semibold">{contract.partner?.name || 'N/A'}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    {getStatusBadge(contract.status)}
                                    <p className="text-sm text-gray-500 mt-2">
                                        Created: {formatDate(contract.created_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Contract Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2">Contract Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Contract Date:</span> {formatDate(contract.contract_date)}</p>
                                        <p><span className="font-medium">Effective Date:</span> {formatDate(contract.effective_date)}</p>
                                        <p><span className="font-medium">Expiration Date:</span> {formatDate(contract.expiration_date)}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2">Seed Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Seed Type:</span> {contract.seed}</p>
                                        <p><span className="font-medium">Quantity:</span> {contract.seed_quantity?.toLocaleString() || 0}</p>
                                        <p><span className="font-medium">Unit:</span> {contract.unit_of_measurement}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2">Harvest Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Expected Harvest:</span> {formatDate(contract.expected_harvest_date)}</p>
                                        <p><span className="font-medium">Days Until Harvest:</span> {calculateDaysUntilHarvest()} days</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contract File */}
                            {contract.contract_file && (
                                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2">Contract File</h4>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-600">
                                            {contract.contract_file.split('/').pop()}
                                        </span>
                                        <button
                                            onClick={downloadContract}
                                            className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
                                        >
                                            Download Contract
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {contract.notes && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-800 whitespace-pre-wrap">{contract.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monitoring Logs Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Monitoring Logs</h3>
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                    Add Monitoring Log
                                </button>
                            </div>

                            {/* Placeholder for monitoring logs */}
                            {contract.monitoring_logs && contract.monitoring_logs.length > 0 ? (
                                <div className="space-y-4">
                                    {contract.monitoring_logs.map((log) => (
                                        <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold">{log.title}</h4>
                                                    <p className="text-gray-600 text-sm">{log.description}</p>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(log.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 mb-4">No monitoring logs found for this contract.</p>
                                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                        Create First Monitoring Log
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contract Timeline */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Contract Timeline</h3>
                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                
                                <div className="relative space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">1</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Contract Signed</p>
                                            <p className="text-sm text-gray-500">{formatDate(contract.contract_date)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            new Date(contract.effective_date) <= new Date() ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                            <span className="text-white text-xs font-bold">2</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Contract Effective</p>
                                            <p className="text-sm text-gray-500">{formatDate(contract.effective_date)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            new Date(contract.expected_harvest_date) <= new Date() ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                            <span className="text-white text-xs font-bold">3</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Expected Harvest</p>
                                            <p className="text-sm text-gray-500">{formatDate(contract.expected_harvest_date)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            new Date(contract.expiration_date) <= new Date() ? 'bg-red-500' : 'bg-gray-300'
                                        }`}>
                                            <span className="text-white text-xs font-bold">4</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Contract Expiration</p>
                                            <p className="text-sm text-gray-500">{formatDate(contract.expiration_date)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}