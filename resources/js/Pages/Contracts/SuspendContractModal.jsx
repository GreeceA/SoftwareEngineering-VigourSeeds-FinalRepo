import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function SuspendContractModal({ contract, onCancel, onConfirm, processing }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                {/* Warning Icon */}
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 mx-auto">
                    <ExclamationTriangleIcon className="h-10 w-10 text-yellow-600" />
                </div>

                {/* Title */}
                <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
                    Suspend Contract
                </h2>

                {/* Description */}
                <p className="mb-4 text-center font-poppins text-sm text-gray-600">
                    You are about to suspend the contract for{' '}
                    <span className="font-bold text-yellow-600">
                        {contract.contract_name}
                    </span>
                </p>

                {/* Warning Message */}
                <div className="mb-6 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-4">
                    <p className="text-center text-sm font-medium text-yellow-800 mb-2">
                        ⚠️ <strong>This will temporarily halt all contract activities!</strong>
                    </p>
                    <p className="text-xs text-yellow-700 text-center">
                        While suspended, no new orders, field visits, or buyback transactions can be processed.<br />
                        <strong>You can reactivate the contract at any time.</strong>
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
                        ℹ️ After suspension, you can view all contract details, edit several contract fields, and reactivate it when ready.
                    </p>
                </div>
                
                {/* Buttons */}
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        className="flex-1 rounded-lg bg-yellow-600 px-5 py-3 text-sm font-medium font-poppins text-white transition-colors hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={() => onConfirm('suspended')}
                        disabled={processing}
                    >
                        {processing ? 'Suspending...' : 'Suspend Contract'}
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