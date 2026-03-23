import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ContractForm from './ContractForm';

export default function Edit({ auth, partners, seeds, contract }) {
    const isFinalState = contract.status === 'terminated' || contract.status === 'cancelled' || contract.status === 'completed';
    const isEditable = contract.can_be_edited || contract.can_be_partially_edited;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit Contract: ${contract.contract_name}`} />

            {/* Modern Page Header */}
            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white border-b border-gray-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative px-6 py-6">
                    <nav className="flex items-center space-x-2 text-sm mb-4">
                        <Link href={route('dashboard')} className="text-gray-500 hover:text-[#37692F] transition-colors duration-200 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href={route('contracts.index')} className="text-gray-500 hover:text-[#37692F] transition-colors duration-200">
                            Contracts
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#37692F] font-medium">Edit Contract</span>
                    </nav>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Edit Contract</h1>
                                <p className="text-gray-600">Update details for {contract.contract_name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isFinalState && !isEditable && (
                <div className="p-6">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                        <p className="font-bold">Contract is Closed</p>
                        <p>This contract is in **{contract.status.toUpperCase()}** status and cannot be modified. It is locked for historical purposes.</p>
                        <Link href={route('contracts.show', contract.id)} className="text-red-500 underline mt-2 block">View Details</Link>
                    </div>
                </div>
            )}

            {contract.can_be_partially_edited && !contract.can_be_edited && (
                <div className="p-6">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4" role="alert">
                        <p className="font-bold">Partial Editing Mode</p>
                        <p>
                            This contract is in <strong>{contract.status.toUpperCase()}</strong> status.<br />
                            You can only edit: Notes, Expiration Date, Buyback Price, Planting/Harvest Dates, and Expected Buyback Amount.
                        </p>
                    </div>
                </div>
            )}

            <ContractForm
                partners={partners}
                seeds={seeds}
                contract={contract}
            />
        </AuthenticatedLayout>
    );
}