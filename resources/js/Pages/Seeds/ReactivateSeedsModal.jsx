import { ArrowPathIcon } from '@heroicons/react/24/solid';
import React from 'react';

export default function ReactivateSeedsModal({ seed, onCancel, onConfirm }) {
    if (!seed) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                {/* Success Icon */}
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto">
                    <ArrowPathIcon className="h-10 w-10 text-green-600" />
                </div>

                {/* Title */}
                <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
                    Reactivate Seed
                </h2>

                {/* Description */}
                <p className="mb-4 text-center font-poppins text-sm text-gray-600">
                    Are you sure you want to reactivate{' '}
                    <span className="font-bold text-[#37692F]">
                        {seed.seed_variety}
                    </span>
                    ?
                </p>

                <p className="mb-2 text-center text-sm text-gray-500">
                    This seed will be reactivated and available for new contracts.
                </p>

                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-3">
                    <p className="text-center text-xs font-medium text-green-800">
                        ✅ This seed will be restored to active status immediately.
                    </p>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        className="flex-1 rounded-lg bg-green-600 px-5 py-3 text-sm font-medium font-poppins text-white transition-colors hover:bg-green-700"
                        onClick={() => onConfirm(seed.id)}
                    >
                        Reactivate Seed
                    </button>

                    <button
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium font-poppins text-gray-700 transition-colors hover:bg-gray-50"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}