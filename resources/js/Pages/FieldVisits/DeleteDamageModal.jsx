import React from 'react';

const DeleteDamageModal = ({ open, damageReport, onCancel, onConfirm }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                {/* Header with Icon */}
                <div className="mb-4 flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h3 className="mt-3 text-center font-poppins text-xl font-semibold text-gray-800">
                        Delete Damage Report
                    </h3>
                    <p className="mt-1 text-center font-poppins text-sm text-gray-500">
                        This action cannot be undone
                    </p>
                </div>

                {/* Report Details */}
                <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Type:</span>
                            <span className="text-sm font-semibold text-gray-900">{damageReport.type_damage || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Severity:</span>
                            <span className="text-sm font-semibold text-gray-900">{damageReport.severity_damage || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Stage:</span>
                            <span className="text-sm font-semibold text-gray-900">{damageReport.stage || 'N/A'}</span>
                        </div>
                        {damageReport.notes && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                <span className="text-sm font-medium text-gray-600">Notes:</span>
                                <p className="mt-1 text-sm text-gray-700 line-clamp-2">{damageReport.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Warning Message */}
                <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-3">
                    <p className="text-center font-poppins text-sm font-medium text-red-800">
                        ⚠️ Are you sure you want to delete this damage report? This action is permanent.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 font-poppins text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(damageReport.damage_ID)}
                        className="flex-1 rounded-lg bg-red-600 px-5 py-3 font-poppins text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                        Delete Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteDamageModal;