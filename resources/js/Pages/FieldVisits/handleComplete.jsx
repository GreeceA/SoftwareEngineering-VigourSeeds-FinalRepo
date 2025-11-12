import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import React from 'react';

export default function handleComplete({ fieldVisit, onCancel, onConfirm }) {
    if (!fieldVisit) return null;

    // Check if there's at least one report
    const hasGrowthReports = fieldVisit.growth_reports && fieldVisit.growth_reports.length > 0;
    const hasDamageReports = fieldVisit.damage_reports && fieldVisit.damage_reports.length > 0;
    const hasReports = hasGrowthReports || hasDamageReports;
    const totalReports = (fieldVisit.growth_reports?.length || 0) + (fieldVisit.damage_reports?.length || 0);

    // Determine if completion is blocked (no reports)
    const isBlocked = !hasReports;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                {/* Icon - Changes based on validation */}
                <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full mx-auto ${
                    hasReports ? 'bg-green-100' : 'bg-red-100'
                }`}>
                    {hasReports ? (
                        <CheckCircleIcon className="h-10 w-10 text-green-600" />
                    ) : (
                        <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                    )}
                </div>

                {/* Title */}
                <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
                    {hasReports ? 'Complete Field Visit' : 'Cannot Complete Visit'}
                </h2>

                {/* Description */}
                <p className="mb-4 text-center font-poppins text-sm text-gray-600">
                    {hasReports ? (
                        <>
                            Are you sure you want to mark field visit{' '}
                            <span className="font-bold text-[#37692F]">
                                #{fieldVisit.field_visit_ID}
                            </span>{' '}
                            as completed?
                        </>
                    ) : (
                        <>
                            Field visit{' '}
                            <span className="font-bold text-red-600">
                                #{fieldVisit.field_visit_ID}
                            </span>{' '}
                            cannot be completed yet.
                        </>
                    )}
                </p>

                {hasReports && (
                    <p className="mb-2 text-center text-sm text-gray-500">
                        This will change the status to "completed" and no further reports can be added.
                    </p>
                )}

                {/* Warning Messages */}
                <div className="mb-6 space-y-2">
                    {isBlocked && (
                        <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                            <div className="flex items-start">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-red-800 mb-1">
                                        No Reports Found
                                    </h3>
                                    <p className="text-sm text-red-700">
                                        ⚠️ Cannot complete: At least <b>one Growth Report</b> or <b>one Damage Report</b> must be logged before completing this field visit.
                                    </p>
                                    <p className="text-xs text-red-600 mt-2">
                                        Please add at least one report to enable completion.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {hasReports && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                            <p className="text-center text-xs font-medium text-blue-800">
                                ✅ Completed visits can still be viewed but cannot be modified.
                            </p>
                        </div>
                    )}
                </div>

                {/* Visit Details */}
                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-center text-sm font-medium text-gray-700">
                        Contract: <span className="text-[#37692F]">{fieldVisit.contract?.contract_name}</span>
                    </p>
                    <p className="text-center text-xs text-gray-500 mt-1">
                        Visit Date: {new Date(fieldVisit.date_visit).toLocaleDateString()}
                    </p>
                    <div className="mt-2 pt-2 border-t border-gray-200 flex justify-center gap-4 text-xs text-gray-600">
                        <span>📊 Growth Reports: <strong className={hasGrowthReports ? 'text-green-600' : 'text-red-600'}>{fieldVisit.growth_reports?.length || 0}</strong></span>
                        <span>⚠️ Damage Reports: <strong className={hasDamageReports ? 'text-orange-600' : 'text-red-600'}>{fieldVisit.damage_reports?.length || 0}</strong></span>
                    </div>
                    <p className="text-center text-xs font-semibold text-gray-700 mt-2">
                        Total Reports: <span className={hasReports ? 'text-green-600' : 'text-red-600'}>{totalReports}</span>
                    </p>
                </div>

                {/* Action Required Box - Only show if blocked */}
                {isBlocked && (
                    <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                        <p className="text-center text-xs font-medium text-yellow-800">
                            💡 <strong>Next Steps:</strong> Add at least one Growth Report or Damage Report to enable completion.
                        </p>
                    </div>
                )}

                {/* Buttons */}
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        className={`flex-1 rounded-lg px-5 py-3 text-sm font-medium font-poppins text-white transition-colors ${
                            isBlocked
                                ? 'bg-gray-400 cursor-not-allowed opacity-60'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                        onClick={() => onConfirm(fieldVisit.field_visit_ID)}
                        disabled={isBlocked}
                        title={isBlocked ? 'Add at least one report to complete this visit' : 'Mark as completed'}
                    >
                        {isBlocked ? (
                            <span className="flex items-center justify-center">
                                Complete Visit
                                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                        ) : (
                            'Complete Visit'
                        )}
                    </button>

                    <button
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium font-poppins text-gray-700 transition-colors hover:bg-gray-50"
                        onClick={onCancel}
                    >
                        {isBlocked ? 'Close' : 'Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
}