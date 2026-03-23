import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import { useEffect } from 'react';

export default function DeleteRoleModal({ role, onCancel, onConfirm, processing }) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && !processing) {
                onCancel();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onCancel, processing]);

    if (!role) return null;

    return (
        <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget && !processing) {
                    onCancel();
                }
            }}
        >
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl animate-fadeIn">
                {/* Warning Icon */}
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mx-auto">
                    <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                </div>

                {/* Title */}
                <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
                    Delete Role
                </h2>

                {/* Description */}
                <p className="mb-4 text-center font-poppins text-sm text-gray-600">
                    Are you sure you want to delete the role{' '}
                    <span className="font-bold text-red-600">
                        "{role.name}"
                    </span>?
                </p>

                {/* Warning Message */}
                <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                    <div className="flex items-start">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-800 mb-1">
                                Warning: Permanent Action
                            </h3>
                            <p className="text-sm text-red-700">
                                ⚠️ This action <strong>cannot be undone</strong>. All users with this role will lose their assigned permissions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Role Details */}
                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-center text-sm font-medium text-gray-700">
                        Role ID: <span className="text-red-600">#{role.id}</span>
                    </p>
                    <p className="text-center text-xs text-gray-500 mt-1">
                        Permissions: {role.permissions?.length || 0}
                    </p>
                    <p className="text-center text-xs text-gray-500 mt-1">
                        Created: {dayjs(role.created_at).format("MMMM D, YYYY h:mm A")}
                    </p>
                </div>

                {/* Confirmation Note */}
                <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                    <p className="text-center text-xs font-medium text-yellow-800">
                        💡 <strong>Note:</strong> System roles (admin, manager, employee) and roles with assigned users cannot be deleted.
                    </p>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        type="button"
                        className="flex-1 rounded-lg bg-red-600 px-5 py-3 text-sm font-medium font-poppins text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onConfirm}
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </span>
                        ) : (
                            'Delete Role'
                        )}
                    </button>

                    <button
                        type="button"
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium font-poppins text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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