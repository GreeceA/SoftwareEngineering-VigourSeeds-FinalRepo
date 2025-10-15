import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function ActivateContractModal({ contract, onCancel, onConfirm, processing }) {
    if (!contract) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircleIcon className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
                    Activate Contract
                </h2>
                <p className="mb-4 text-center font-poppins text-sm text-gray-600">
                    Are you sure you want to <span className="font-bold text-green-700">activate</span> this contract?
                </p>
                <p className="mb-2 text-center font-poppins text-sm text-gray-500">
                    This action will move the contract to <span className="font-semibold text-green-600">Active</span> status. The contract will be considered officially in effect.
                </p>
                {!contract.contract_file && (
                    <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                        <p className="text-sm text-yellow-800">
                            A contract file is required to activate. Please upload a file first.
                        </p>
                    </div>
                )}
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        className="flex-1 rounded-lg bg-green-600 px-5 py-3 font-poppins text-sm font-medium text-white transition-colors hover:bg-green-700"
                        onClick={() => onConfirm('active')}
                        disabled={processing || !contract.contract_file}
                    >
                        {processing ? 'Activating...' : 'Activate Contract'}
                    </button>
                    <button
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 font-poppins text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        onClick={onCancel}
                        disabled={processing}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}