import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function EmailSuccessModal({ open, onClose, partnerName, partnerEmail }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircleIcon className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="mb-4 text-center font-poppins text-xl font-semibold text-gray-800">
                    Email Sent Successfully!
                </h2>
                <p className="mb-3 text-center font-poppins text-sm text-gray-600">
                    The contract has been successfully sent to <span className="font-bold text-green-700">{partnerName}</span>.
                </p>
                <p className="text-center font-poppins text-sm text-gray-500">
                    Email delivered to: <span className="font-semibold text-green-600">{partnerEmail}</span>
                </p>

                <div className="mt-8 flex justify-center">
                    <button
                        className="w-full rounded-lg bg-green-500 px-5 py-3 font-poppins text-sm font-medium text-white transition-colors hover:bg-green-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
