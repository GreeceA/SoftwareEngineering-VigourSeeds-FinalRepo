import React from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function CompleteContractModal({
    open,
    onCancel,
    onConfirm,
    contract,
    processing
}) {
    if (!open) return null;

    // Check requirements
    const hasCompletedFieldVisit = contract.field_visits?.some(v => v.status === 'completed');
    const allOrdersFulfilled = contract.partner_orders?.length > 0 &&
        contract.partner_orders.every(o => o.status === 'fulfilled');

    const buybackFulfilled = contract.buyback_fulfillment_percentage >= 100;
    const canComplete = hasCompletedFieldVisit && allOrdersFulfilled && buybackFulfilled;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                {/* Success Icon */}
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircleIcon className="h-10 w-10 text-green-600" />
                </div>

                {/* Title */}
                <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
                    Complete Contract
                </h2>

                {/* Description */}
                <p className="mb-4 text-center font-poppins text-sm text-gray-600">
                    Complete contract for{' '}
                    <span className="font-bold text-[#37692F]">
                        {contract.contract_name}
                    </span>
                </p>

                <p className="mb-4 text-center text-sm text-gray-500">
                    The following requirements must be met to complete this contract:
                </p>

                {/* Requirements List */}
                <div className="mb-6 space-y-3">
                    <div className={`flex items-center gap-3 rounded-lg border p-3 ${hasCompletedFieldVisit
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}>
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${hasCompletedFieldVisit ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                            <span className="text-xs font-bold text-white">
                                {hasCompletedFieldVisit ? '✓' : '✗'}
                            </span>
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${hasCompletedFieldVisit ? 'text-green-800' : 'text-red-800'
                                }`}>
                                At least 1 field visit marked as <strong>completed</strong>
                            </p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 rounded-lg border p-3 ${allOrdersFulfilled
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}>
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${allOrdersFulfilled ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                            <span className="text-xs font-bold text-white">
                                {allOrdersFulfilled ? '✓' : '✗'}
                            </span>
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${allOrdersFulfilled ? 'text-green-800' : 'text-red-800'
                                }`}>
                                All partner orders are <strong>fulfilled</strong>
                            </p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 rounded-lg border p-3 ${buybackFulfilled
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}>
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${buybackFulfilled ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                            <span className="text-xs font-bold text-white">
                                {buybackFulfilled ? '✓' : '✗'}
                            </span>
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${buybackFulfilled ? 'text-green-800' : 'text-red-800'
                                }`}>
                                All buyback commitments are <strong>fulfilled</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                {!canComplete && (
                    <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-3">
                        <p className="text-center text-xs font-medium text-orange-800">
                            ⚠️ Please fulfill all requirements before completing the contract.
                        </p>
                    </div>
                )}

                {/* Buttons */}
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        className={`flex-1 rounded-lg px-5 py-3 text-sm font-medium font-poppins text-white transition-colors ${canComplete
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        onClick={() => canComplete && onConfirm('completed')}
                        disabled={!canComplete || processing}
                    >
                        {processing ? 'Completing...' : 'Complete Contract'}
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