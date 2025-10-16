import { XCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

export default function handleCancel({ fieldVisit, onCancel, onConfirm }) {
    if (!fieldVisit) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                {/* Warning Icon */}
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mx-auto">
                    <XCircleIcon className="h-10 w-10 text-red-600" />
                </div>

                {/* Title */}
                <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
                    Cancel Field Visit
                </h2>

                {/* Description */}
                <p className="mb-4 text-center font-poppins text-sm text-gray-600">
                    Are you sure you want to cancel{' '}
                    <span className="font-bold text-[#37692F]">
                        #{fieldVisit.field_visit_ID}
                    </span>
                    ?
                </p>

                <p className="mb-2 text-center text-sm text-gray-500">
                    This will change the status to "cancelled" and no further actions can be taken on this visit.
                </p>

                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-center text-xs font-medium text-red-800">
                        ⚠️ Warning: This action cannot be undone. All associated reports will be preserved but marked as cancelled.
                    </p>
                </div>

                {/* Visit Details */}
                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-center text-sm font-medium text-gray-700">
                        Contract: <span className="text-[#37692F]">{fieldVisit.contract?.contract_name}</span>
                    </p>
                    <p className="text-center text-xs text-gray-500 mt-1">
                        Visit Date: {new Date(fieldVisit.date_visit).toLocaleDateString()}
                    </p>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        className="flex-1 rounded-lg bg-red-600 px-5 py-3 text-sm font-medium font-poppins text-white transition-colors hover:bg-red-700"
                        onClick={() => onConfirm(fieldVisit.field_visit_ID)}
                    >
                        Cancel Visit
                    </button>

                    <button
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium font-poppins text-gray-700 transition-colors hover:bg-gray-50"
                        onClick={onCancel}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}