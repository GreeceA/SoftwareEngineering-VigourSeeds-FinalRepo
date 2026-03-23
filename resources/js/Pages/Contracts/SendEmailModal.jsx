import React from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/solid';

export default function SendEmailModal({ open, onCancel, onConfirm, contract, processing }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
                    <EnvelopeIcon className="h-10 w-10 text-orange-600" />
                </div>
                <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
                    Send Contract Email
                </h2>
                <p className="mb-4 text-center font-poppins text-sm text-gray-600">
                    Send the finalized contract to <span className="font-bold text-orange-700">{contract.partner.name}</span>?
                </p>
                <p className="mb-2 text-center font-poppins text-sm text-gray-500">
                    This will send an email to <span className="font-semibold text-orange-600">{contract.partner.email}</span> using the official system email service.
                </p>
                
                {!contract.contract_file && (
                    <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                        <p className="text-sm text-yellow-800">
                            A contract file is required to send email. Please upload a file first.
                        </p>
                    </div>
                )}

                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        className="flex-1 rounded-lg bg-orange-500 px-5 py-3 font-poppins text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:bg-orange-400"
                        onClick={onConfirm}
                        disabled={processing || !contract.contract_file}
                    >
                        {processing ? 'Sending...' : 'Send Email'}
                    </button>
                    <button
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 font-poppins text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:bg-gray-100"
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