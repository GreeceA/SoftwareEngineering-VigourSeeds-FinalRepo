import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import DraftActiveModal from './Draft-ActiveModal'; 
import ContractFilePreviewModal from './ContractFilePreviewModal';


export default function Show({ auth, contract }) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    const [showFilePreview, setShowFilePreview] = useState(false);
    const handleOpenPreview = () => setShowFilePreview(true);
    const handleClosePreview = () => setShowFilePreview(false);

    const { post, processing } = useForm();

    
    // Helper to format currency for display
    const formatPrice = (price, decimals = 2) => {
        if (price === null || price === undefined) return '-';
        return parseFloat(price).toLocaleString('en-PH', { 
            style: 'currency', 
            currency: 'PHP', 
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    };

    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // UPDATED Status Colors to include new states
    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-200 text-gray-800',
            under_review: 'bg-blue-100 text-blue-700',
            active: 'bg-green-100 text-green-700',
            suspended: 'bg-yellow-100 text-yellow-700',
            terminated: 'bg-red-100 text-red-700',
            cancelled: 'bg-pink-100 text-pink-700',
            completed: 'bg-[#37692F]/20 text-[#37692F]',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const handleStatusChange = () => {
        if (selectedStatus) {
            post(route('contracts.change-status', contract.id), {
                data: { status: selectedStatus },
                onSuccess: () => {
                    setShowStatusModal(false);
                    setSelectedStatus('');
                }
            });
        }
    };

    // UPDATED: Changed destroy to status transition ('cancelled' or 'terminated' is better than 'archived')
    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this contract?')) {
            post(route('contracts.cancel', contract.id), {
                onSuccess: () => {
                    // Optionally redirect or show a message
                }
            });
        }
    };


    // Adjusting contract data access to new names
    const contractCommitments = contract.contract_commitments || []; // Renamed relation

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Contract Details</span>
                </h2>
            }
        >
            {/* CHANGED: title to contract_name */}
            <Head title={`Contract: ${contract.contract_name}`} />

            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link href={route('dashboard')} className="text-[#37692F] hover:underline">
                        Home
                    </Link>{" "}
                    /{" "}
                    <Link href={route('contracts.index')} className="text-[#37692F] hover:underline">
                        Contracts
                    </Link>{" "}
                    / <span>{contract.contract_name}</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Contract Information</h1>
                    <div className="flex space-x-3">
                        {/* Edit Button */}
                        {(contract.can_be_edited || contract.can_be_partially_edited) && (
                            <Link
                                href={route('contracts.edit', contract.id)}
                                className="bg-[#37692F] text-white px-4 py-2 rounded-md hover:bg-[#2a5624] flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Edit Contract
                            </Link>
                        )}
                        <Link
                            href={route('contracts.index')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to List
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Contract Details Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contract Details</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                {/* CHANGED: title to contract_name */}
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Name</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{contract.contract_name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contract ID</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">#{contract.id}</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-poppins font-normal ${getStatusColor(contract.status)}`}>
                                    {contract.status.replace(/_/g, ' ').charAt(0).toUpperCase() + contract.status.replace(/_/g, ' ').slice(1)}
                                </span>
                            </div>

                             {/* ADDED: Buyback Price Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Committed Buyback Price</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">
                                    {formatPrice(contract.buyback_price_per_unit, 4)} / kg
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Actions</h2>
                        <div className="space-y-3">
                            {/* Only show Change Status and Cancel if NOT cancelled, completed, or terminated */}
                            {(contract.status !== 'cancelled' && contract.status !== 'completed' && contract.status !== 'terminated') && (
                                <>
                                    {contract.available_transitions?.length > 0 && (
                                        <button
                                            onClick={() => setShowStatusModal(true)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
                                        >
                                            Change Status
                                        </button>
                                    )}
                                    <button
                                        onClick={handleCancel}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
                                        disabled={processing}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        Cancel Contract
                                    </button>
                                </>
                            )}
                            {/* File Preview Button stays visible */}
                            {contract.contract_file && (
                                <button
                                    type="button"
                                    onClick={handleOpenPreview}
                                    className="w-full inline-flex items-center text-[#37692F] hover:text-[#2a5624] py-2 transition-colors justify-center"
                                >
                                    <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                                    View Contract File
                                </button>
                            )}
                        </div>
                    </div>


                    {/* Partner Information Card (Kept the same) */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Partner Information</h2>
                        
                        <div className="space-y-4">
                             {/* ... partner data display logic ... */}
                             <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Partner Name</label>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-900 font-poppins">{contract.partner.name}</span>
                                    <Link
                                        href={route('partners.show', contract.partner.id)}
                                        className="text-[#37692F] text-xs px-2 py-1 rounded hover:bg-green-50 transition-colors"
                                    >
                                        View details
                                    </Link>
                                </div>
                            </div>
                            {contract.partner.email && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <p className="text-sm text-gray-900 font-poppins font-normal">{contract.partner.email}</p>
                                </div>
                            )}
                            {contract.partner.phone && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <p className="text-sm text-gray-900 font-poppins font-normal">{contract.partner.phone}</p>
                                </div>
                            )}
                            {contract.partner.address && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <p className="text-sm text-gray-900 font-poppins font-normal whitespace-pre-wrap">{contract.partner.address}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FARM INFORMATION CARD */}
                    {contract.farm && (
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Farm Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{contract.farm.location_name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Area Size (hectares)</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">
                                    {contract.farm.area_size ? contract.farm.area_size : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{contract.farm.soil_type}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">
                                    {contract.farm.address ? contract.farm.address : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                    {/* Dates Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contract Dates</h2>
                        
                        <div className="space-y-4">
                             {/* CHANGED: contract_date to signing_date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Signing Date</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{formatDate(contract.signing_date)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{formatDate(contract.effective_date)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{formatDate(contract.expiration_date)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes Card (Moved and kept the same) */}
                    {contract.notes && (
                        <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-1">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Notes</h2>
                            <p className="text-sm text-gray-900 font-poppins font-normal whitespace-pre-wrap">{contract.notes}</p>
                        </div>
                    )}

                    {/* Seed Varieties Card (Commitments) */}
                    <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-3">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Seed Buyback Commitments ({contractCommitments.length})</h2>
                        
                        {contractCommitments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 font-poppins font-medium">Seed Variety</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Seed Qty (Sold)</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Price Locked</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Planting Date</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Agreed Cycles</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Expected Buyback</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {contractCommitments.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    <a
                                                        href={route('seeds.show', item.seed.id)}
                                                        className="inline-flex items-center text-[#37692F] hover:underline"
                                                        title="View Seed Details"
                                                    >
                                                        {item.seed.seed_variety}
                                                        <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
                                                    </a>
                                                </td>
                                                {/* Seed Quantity Sold */}
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {item.seed_quantity} {item.unit}
                                                </td>
                                                {/* Price Locked for Seed Sale */}
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {formatPrice(item.seed_price_at_contract)} / {item.unit}
                                                </td>
                                                {/* Planting Date (NEW FIELD) */}
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {formatDate(item.planting_date)}
                                                </td>
                                                {/* Agreed Cycles (renamed) */}
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {item.agreed_cycles}
                                                </td>
                                                {/* Expected Buyback Amount (renamed) */}
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {item.expected_buyback_amount} {item.buyback_unit}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 font-poppins font-normal">
                                No seed commitments found for this contract.
                            </p>
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-6 text-sm text-gray-500 font-poppins font-normal">
                    <p>Created: {formatDate(contract.created_at)}</p>
                    <p>Last Updated: {formatDate(contract.updated_at)}</p>
                </div>
            </div>
        
            {/* Modals */}
            {showStatusModal && (
                <DraftActiveModal
                    contract={contract}
                    availableTransitions={contract.available_transitions}
                    onCancel={() => setShowStatusModal(false)}
                    onConfirm={(newStatus) => {
                        setSelectedStatus(newStatus); // Use the status selected in the modal
                        // If it's a direct transition, handle it immediately
                        post(route('contracts.change-status', contract.id), {
                            data: { status: newStatus },
                            onSuccess: () => {
                                setShowStatusModal(false);
                                setSelectedStatus('');
                            }
                        });
                    }}
                    processing={processing}
                />
            )}

            {showFilePreview && (
                <ContractFilePreviewModal
                    // Construct the URL using the storage path
                    fileUrl={contract.contract_file ? `/storage/${contract.contract_file}` : null}
                    onClose={handleClosePreview}
                />
            )}

        </AuthenticatedLayout>
    );
}