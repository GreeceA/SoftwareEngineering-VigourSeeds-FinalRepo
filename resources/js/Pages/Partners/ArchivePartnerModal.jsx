import { ArchiveBoxIcon } from '@heroicons/react/24/solid';
import React from 'react';

export default function ArchivePartnerModal({ partner, onCancel, onConfirm }) {
    if (!partner) return null;

    // Contracts that block archiving
    const blockStatuses = ['draft', 'under_review', 'active', 'suspended'];
    const hasBlockingContract = partner.contracts?.some(
        contract => blockStatuses.includes(contract.status)
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
                    <ArchiveBoxIcon className="h-10 w-10 text-orange-600" />
                </div>
                <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
                    Archive Partner Account
                </h2>
                <p className="mb-4 text-center font-poppins text-sm text-gray-600">
                    Are you sure you want to archive Partner{' '}
                    <span className="font-bold text-[#37692F]">
                        {partner.name}
                    </span>
                    ?
                </p>
                <p className="mb-2 text-center text-sm text-gray-500">
                    This {partner.partner_type === 'organization' ? 'organization' : 'individual'} partner will be archived and will no longer be available for new contracts.
                </p>
                <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                    {hasBlockingContract ? (
                        <p className="text-center text-xs font-medium text-yellow-800">
                            ⚠️ Cannot archive: This partner has ongoing contracts (<b>draft, under review, active, or suspended</b>).<br />
                            Please terminate, cancel, or complete all contracts before archiving.
                        </p>
                    ) : (
                        <p className="text-center text-xs font-medium text-yellow-800">
                            ⚠️ Note: Partners with ongoing contracts cannot be archived.
                        </p>
                    )}
                </div>
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        className="flex-1 rounded-lg bg-orange-600 px-5 py-3 text-sm font-medium font-poppins text-white transition-colors hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => onConfirm(partner.id)}
                        disabled={hasBlockingContract}
                    >
                        Archive Partner
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