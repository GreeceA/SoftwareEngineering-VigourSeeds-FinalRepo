import { UserMinusIcon } from '@heroicons/react/24/solid';
import React from 'react';

export default function DeactivateModal({ user, onCancel, onConfirm }) {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
                {/* Warning Icon */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto bg-red-100 rounded-full mb-4">
                    <UserMinusIcon className="w-10 h-10 text-red-600" />
                </div>

                {/* Title */}
                <h2 className="mt-8 text-xl font-poppins font-semibold text-center text-gray-800 mb-2">
                    Deactivate User Account
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-center mb-4 font-poppins text-sm">
                    Are you sure you want to deactivate <span className="text-[#37692F] font-bold">{user.name}</span>'s account?
                </p>

                <p className="text-sm text-gray-500 text-center mb-6">
                    This account will be deactivated until reactivated by an administrator.
                </p>

                {/* Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                    <button
                        className="flex-1 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-poppins text-sm"
                        onClick={() => onConfirm(user.id)}
                    >
                        Deactivate
                    </button>

                    <button
                        className="flex-1 px-5 py-3 bg-white text-black border border-gray-400 rounded-lg font-poppins text-sm hover:bg-gray-400 transition-colors"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}