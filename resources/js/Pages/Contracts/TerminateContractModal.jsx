import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function TerminateContractModal({
    open,
    onCancel,
    onConfirm,
    contract,
    processing
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
            <div className="mx-4 my-8 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                {/* Warning Icon */}
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mx-auto">
                    <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                </div>

                {/* Title */}
                <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
                    Terminate Contract
                </h2>

                {/* Description */}
                <p className="mb-4 text-center font-poppins text-sm text-gray-600">
                    You are about to terminate the contract for{' '}
                    <span className="font-bold text-red-600">
                        {contract.contract_name}
                    </span>
                </p>

                {/* Warning Message */}
                <div className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 p-4">
                    <p className="text-center text-sm font-medium text-red-800 mb-2">
                        ⚠️ <strong>Warning: This action is permanent!</strong>
                    </p>
                    <p className="text-xs text-red-700 text-center">
                        Once terminated, this contract cannot be reactivated, edited, or completed.<br />
                        <strong>Terminated contracts are final and cannot be changed.</strong>
                    </p>
                </div>

                {/* Contract Details */}
                <div className="mb-6 space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <span className="text-sm font-medium text-gray-600">Partner:</span>
                        <span className="text-sm font-semibold text-gray-900">{contract.partner?.name}</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <span className="text-sm font-medium text-gray-600">Current Status:</span>
                        <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                            {contract.status.replace(/_/g, ' ').charAt(0).toUpperCase() + contract.status.replace(/_/g, ' ').slice(1)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <span className="text-sm font-medium text-gray-600">Total Expected Buyback:</span>
                        <span className="text-sm font-semibold text-gray-900">
                            {contract.total_expected_buyback?.toLocaleString() || 0} kg
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <span className="text-sm font-medium text-gray-600">Buyback Fulfillment:</span>
                        <span className={`text-sm font-semibold ${
                            contract.buyback_fulfillment_percentage >= 100 ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                            {contract.buyback_fulfillment_percentage?.toFixed(1) || 0}%
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <span className="text-sm font-medium text-gray-600">Partner Orders:</span>
                        <span className="text-sm font-semibold text-gray-900">
                            {contract.partner_orders?.length || 0} order(s)
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <span className="text-sm font-medium text-gray-600">Field Visits:</span>
                        <span className="text-sm font-semibold text-gray-900">
                            {contract.field_visits?.length || 0} visit(s)
                        </span>
                    </div>
                </div>

                {/* Info Message */}
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <p className="text-center text-xs font-medium text-blue-800">
                        ℹ️ After termination, you can still view all contract details, but no further actions are allowed.
                    </p>
                </div>
                
                {/* Buttons */}
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        className="flex-1 rounded-lg bg-red-600 px-5 py-3 text-sm font-medium font-poppins text-white transition-colors hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={() => onConfirm('terminated')}
                        disabled={processing}
                    >
                        {processing ? 'Terminating...' : 'Terminate Contract'}
                    </button>

                    <button
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium font-poppins text-gray-700 transition-colors hover:bg-gray-50"
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