import React from 'react';
import { useForm } from '@inertiajs/react';
import { ArchiveBoxIcon } from '@heroicons/react/24/solid';

export default function ArchiveModal({ show, onClose, item }) {
    const { patch } = useForm();

    if (!show || !item) return null;

    // Check if item has current stock
    const currentStock = item.current_stock || 0;
    const hasStock = currentStock > 0;

    // Check if item has active partner orders
    const hasActiveOrders = item.partner_orders?.some(
        order => ['pending', 'confirmed', 'partially_fulfilled'].includes(order.status)
    );

    // Check if item has ongoing contracts
    const ongoingContractStatuses = ['draft', 'under_review', 'active', 'suspended'];
    const hasOngoingContracts = item.partner_orders?.some(
        order => order.contract_status && ongoingContractStatuses.includes(order.contract_status)
    );

    // Determine if archival is blocked
    const isBlocked = hasStock || hasActiveOrders || hasOngoingContracts;

    const handleArchive = () => {
        if (isBlocked) return;
        
        patch(route('items.archive', item.id), {
            onSuccess: () => {
                onClose();
            },
            onError: (errors) => {
                console.error('Archive failed:', errors);
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
                {/* Warning Icon */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto bg-orange-100 rounded-full mb-4">
                    <ArchiveBoxIcon className="w-10 h-10 text-orange-600" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-poppins font-semibold text-center text-gray-800 mb-2">
                    Archive Item
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-center mb-4 font-poppins text-sm">
                    Are you sure you want to archive{' '}
                    <span className="text-[#37692F] font-bold">
                        {item.name}
                    </span>
                    ?
                </p>

                <p className="text-sm text-gray-500 text-center mb-2">
                    This item will be archived and will no longer be available for new orders until reactivated.
                </p>

                {/* Warning Messages */}
                <div className="mb-6 space-y-2">
                    {hasStock && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="text-center text-xs font-medium text-red-800">
                                ⚠️ Cannot archive: This item has <b>{currentStock.toFixed(2)} {item.base_unit}</b> of stock on hand.<br />
                                Please remove or transfer all stock before archiving.
                            </p>
                        </div>
                    )}

                    {hasActiveOrders && (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                            <p className="text-center text-xs font-medium text-yellow-800">
                                ⚠️ Cannot archive: This item is used in active partner orders (<b>pending, confirmed, or partially fulfilled</b>).<br />
                                Please complete, cancel, or terminate all orders before archiving.
                            </p>
                        </div>
                    )}

                    {hasOngoingContracts && (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                            <p className="text-center text-xs font-medium text-yellow-800">
                                ⚠️ Cannot archive: This item is used in ongoing contracts (<b>draft, under review, active, or suspended</b>).<br />
                                Please terminate, cancel, or complete all contracts before archiving.
                            </p>
                        </div>
                    )}

                    {!isBlocked && (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                            <p className="text-center text-xs font-medium text-yellow-800">
                                ⚠️ Note: You can reactivate this item later if needed.
                            </p>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                    <button
                        className="flex-1 px-5 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-poppins text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleArchive}
                        disabled={isBlocked}
                    >
                        Archive Item
                    </button>

                    <button
                        className="flex-1 px-5 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-poppins text-sm hover:bg-gray-50 transition-colors font-medium"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}