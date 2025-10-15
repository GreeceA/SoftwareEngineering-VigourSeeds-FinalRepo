import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import DraftActiveModal from './Draft-ActiveModal'; 
import ContractFilePreviewModal from './ContractFilePreviewModal';
import ActivateContractModal from './ActivateContractModal';


export default function Show({ auth, contract }) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusToTransition, setStatusToTransition] = useState('');
    const [showFilePreview, setShowFilePreview] = useState(false);

    const { post, processing } = useForm();

    const handleOpenPreview = () => setShowFilePreview(true);
    const handleClosePreview = () => setShowFilePreview(false);

    // Handler to open the modal for transition selection/confirmation
    const handleOpenStatusModal = (status) => {
        setStatusToTransition(status);
        setShowStatusModal(true);
    };

    // Handler executed AFTER user confirms the action in the modal
    const handleTransitionConfirm = (newStatus) => {
        // Use Inertia's post method to hit the dedicated changeStatus route
        // NOTE: The data is passed directly as the second argument, not nested inside 'data: {}'
        router.post(route('contracts.change-status', contract.id), { status: newStatus }, {
            onSuccess: () => {
                setShowStatusModal(false);
                setStatusToTransition('');
            },
            onError: (errors) => {
                setShowStatusModal(false);
                setStatusToTransition('');
                // The backend ensures the error is returned under the 'status' key or 'error' key
                const errorMsg = errors.status || errors.error || "An unknown error occurred.";
                alert(`Transition Failed: ${errorMsg}`);
            }
        });
    };

    // Handler for the direct 'Cancel Contract' button
    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this contract?')) {
            router.delete(route('contracts.destroy', contract.id), {
                onSuccess: () => {
                    // Page refresh handled by Inertia
                }
            });
        }
    };

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
        if (!dateString || dateString === '0000-00-00') return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // UPDATED Status Colors
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


    // Adjusting contract data access to new names
    const contractCommitments = contract.contract_commitments || [];
    const farmSoilType = contract.farm?.soil_type?.toUpperCase() || 'N/A';

    const handleSendEmail = () => {
        if (!contract.partner?.email) {
            alert("Cannot send email: Partner email address is missing.");
            return;
        }
        
        if (confirm(`Confirm sending the finalized contract to ${contract.partner.name}? This uses the official system email service.`)) {
            // Use the useForm post instance to hit the backend endpoint
            post(route('contracts.sendEmail', contract.id), {}, {
                onSuccess: () => {
                    // Show the success message handled by Inertia flash data (if you want an alert instead of flash: alert("Email sent successfully!");)
                    // The backend redirects back with flash messages which Inertia should display.
                },
                onError: (errors) => {
                    // The backend returns flash errors like 'Email service failed'
                    console.error("Email failed:", errors);
                },
                preserveState: true,
                preserveScroll: true
            });
        }
    };

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
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Contract Information</h1>
                    <div className="flex space-x-3">
                        {/* Edit Button */}
                        {(contract.can_be_edited || contract.can_be_partially_edited) && (
                            <Link
                                href={route('contracts.edit', contract.id)}
                                className="flex items-center rounded-md bg-[#37692F] px-4 py-2 text-white hover:bg-[#2a5624]"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Edit Contract
                            </Link>
                        )}
                        <Link
                            href={route('contracts.index')}
                            className="flex items-center rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to List
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Contract Details Card */}
                    <div className="rounded-lg bg-white p-6 shadow-lg md:col-span-2">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Contract Details</h2>
                        
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Contract Name</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{contract.contract_name}</p>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Contract ID</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">#{contract.id}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-flex rounded-full px-3 py-1 font-poppins text-xs font-normal ${getStatusColor(contract.status)}`}>
                                    {contract.status.replace(/_/g, ' ').charAt(0).toUpperCase() + contract.status.replace(/_/g, ' ').slice(1)}
                                </span>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Committed Buyback Price</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">
                                    {formatPrice(contract.buyback_price_per_unit, 4)} / kg
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions Card (THE TRANSITION HUB) */}
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Actions</h2>
                        <div className="space-y-3">
                            
                            {/* DRAFT -> UNDER REVIEW BUTTON */}
                            {contract.status === 'draft' && contract.available_transitions?.includes('under_review') && (
                                <button
                                    onClick={() => handleOpenStatusModal('under_review')}
                                    className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                    disabled={processing}
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    Submit for Review
                                </button>
                            )}

                            {/* DRAFT -> UNDER REVIEW BUTTON */}
                            {contract.status === 'under_review' && contract.available_transitions?.includes('active') && (
                                <button
                                    onClick={() => handleOpenStatusModal('active')}
                                    className="flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                                    disabled={processing}
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Activate Contract
                                </button>
                            )}

                            {/* GENERIC STATUS BUTTON (For Active -> Suspended, etc.) */}
                            {/* This button will be used for all other valid status changes */}
                            {/* {['draft', 'under_review'].includes(contract.status) && contract.status !== 'draft' && contract.available_transitions?.length > 0 && (
                                <button
                                    onClick={() => setShowStatusModal(true)} // Opens the generic modal
                                    className="flex w-full items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
                                    disabled={processing}
                                >
                                    Change Status
                                </button>
                            )} */}

                            

                            {/* CANCEL BUTTON (Visible if status allows cancellation) */}
                            {['draft', 'under_review'].includes(contract.status) && contract.available_transitions?.includes('cancelled') && (
                                <button
                                    onClick={handleCancel}
                                    className="flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                                    disabled={processing}
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel Contract
                                </button>
                            )}

                            {contract.contract_file && (contract.status === 'under_review') && (
                                <button
                                    type="button" // Change from <a> to <button>
                                    onClick={handleSendEmail} // Call the new JavaScript handler
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
                                    disabled={processing || !contract.contract_file}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Send Contract Email
                                </button>
                            )}
                            
                            {/* File Preview Button stays visible */}
                            {contract.contract_file && (
                                <button
                                    type="button"
                                    onClick={handleOpenPreview}
                                    className="flex w-full items-center justify-center py-2 text-[#37692F] transition-colors hover:text-[#2a5624]"
                                >
                                    <ArrowTopRightOnSquareIcon className="mr-2 h-5 w-5" />
                                    View Contract File
                                </button>
                            )}
                        </div>
                    </div>


                    {/* Partner Information Card */}
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Partner Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600">Partner Name</label>
                                <div className="flex items-center justify-between">
                                    <span className="font-poppins text-sm text-gray-900">{contract.partner.name}</span>
                                    <Link
                                        href={route('partners.show', contract.partner.id)}
                                        className="rounded px-2 py-1 text-xs text-[#37692F] transition-colors hover:bg-green-50"
                                    >
                                        View details
                                    </Link>
                                </div>
                            </div>
                            {contract.partner.email && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                                    <p className="font-poppins text-sm font-normal text-gray-900">{contract.partner.email}</p>
                                </div>
                            )}
                            {contract.partner.phone && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                                    <p className="font-poppins text-sm font-normal text-gray-900">{contract.partner.phone}</p>
                                </div>
                            )}
                            {contract.partner.address && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                                    <p className="font-poppins text-sm font-normal text-gray-900 whitespace-pre-wrap">{contract.partner.address}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FARM INFORMATION CARD */}
                    {contract.farm && (
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Farm Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Farm Name</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{contract.farm.location_name}</p>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Area Size (hectares)</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">
                                    {contract.farm.area_size ? contract.farm.area_size : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Soil Type</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{contract.farm.soil_type}</p>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">
                                    {contract.farm.address ? contract.farm.address : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                    )}
                    
                    {/* Dates Card */}
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Contract Dates</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Signing Date</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{formatDate(contract.signing_date)}</p>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Effective Date</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{formatDate(contract.effective_date)}</p>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Expiration Date</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{formatDate(contract.expiration_date)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes Card */}
                    {contract.notes && (
                        <div className="rounded-lg bg-white p-6 shadow-lg md:col-span-1">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Notes</h2>
                            <p className="font-poppins text-sm font-normal text-gray-900 whitespace-pre-wrap">{contract.notes}</p>
                        </div>
                    )}

                    {/* Seed Varieties Card (Commitments) */}
                    <div className="rounded-lg bg-white p-6 shadow-lg md:col-span-3">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Seed Buyback Commitments ({contractCommitments.length})</h2>
                        
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
                                                        <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
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
                            <p className="font-poppins text-sm font-normal text-gray-500">
                                No seed commitments found for this contract.
                            </p>
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-6 font-poppins text-sm font-normal text-gray-500">
                    <p>Created: {formatDate(contract.created_at)}</p>
                    <p>Last Updated: {formatDate(contract.updated_at)}</p>
                </div>
            </div>
        
            {/* Modals */}
            {showStatusModal && statusToTransition === 'active' ? (
                <ActivateContractModal
                    contract={contract}
                    onCancel={() => setShowStatusModal(false)}
                    onConfirm={handleTransitionConfirm}
                    processing={processing}
                />
            ) : showStatusModal ? (
                <DraftActiveModal
                    contract={contract}
                    availableTransitions={contract.available_transitions}
                    onCancel={() => setShowStatusModal(false)}
                    onConfirm={handleTransitionConfirm}
                    statusToTransition={statusToTransition}
                    processing={processing}
                />
            ) : null}

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