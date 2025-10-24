import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function CancelContractModal({ contract, onCancel, onConfirm, processing }) {
    if (!contract) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
                    Cancel Contract
                </h2>
                <p className="mb-4 text-center font-poppins text-sm text-gray-600">
                    Are you sure you want to <span className="font-bold text-red-700">cancel</span> this contract?
                </p>
                <p className="mb-2 text-center font-poppins text-sm text-gray-500">
                    This action will move the contract to <span className="font-semibold text-red-600">Cancelled</span> status. This action cannot be undone.
                </p>
                
                {/* Warning message for active contracts */}
                {contract.status === 'active' && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
                        <p className="text-sm text-red-800">
                            <strong>Warning:</strong> This contract is currently active. Cancelling it may have legal and financial implications.
                        </p>
                    </div>
                )}

                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        className="flex-1 rounded-lg bg-red-600 px-5 py-3 font-poppins text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-400"
                        onClick={onConfirm}
                        disabled={processing}
                    >
                        {processing ? 'Cancelling...' : 'Cancel Contract'}
                    </button>
                    <button
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 font-poppins text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:bg-gray-100"
                        onClick={onCancel}
                        disabled={processing}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}