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

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-700',
            active: 'bg-green-100 text-green-700',
            suspended: 'bg-yellow-100 text-yellow-700',
            terminated: 'bg-red-100 text-red-700',
            cancelled: 'bg-red-100 text-red-700',
            archived: 'bg-gray-100 text-gray-500',
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

    const handleDelete = () => {
        if (confirm('Are you sure you want to archive this contract?')) {
            post(route('contracts.destroy', contract.id), {
                method: 'delete',
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
            <Head title={`Contract: ${contract.title}`} />

            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    /{" "}
                    <Link
                        href={route('contracts.index')}
                        className="text-[#37692F] hover:underline"
                    >
                        Contracts
                    </Link>{" "}
                    / <span>{contract.title}</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Contract Information</h1>
                    <div className="flex space-x-3">
                        {(contract.can_be_edited || contract.can_be_partially_edited) && (
                            <Link
                                href={route('contracts.edit', contract.id)}
                                className="bg-[#37692F] text-white px-4 py-2 rounded-md hover:bg-[#2a5624] flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Contract
                            </Link>
                        )}
                        <Link
                            href={route('contracts.index')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Title</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{contract.title}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contract ID</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">#{contract.id}</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-poppins font-normal ${getStatusColor(contract.status)}`}>
                                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Actions</h2>
                        
                        <div className="space-y-3">
                            {contract.available_transitions.includes('active') && (
                                <button
                                    onClick={() => setShowStatusModal(true)}
                                    className="w-full bg-[#37692F] hover:bg-[#2a5624] text-white px-4 py-2 rounded-md flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Activate Contract
                                </button>
                            )}
                            
                            {contract.status !== 'archived' && (
                                <button
                                    onClick={handleDelete}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4v4m4-4v4" />
                                    </svg>
                                    Archive Contract
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Partner Information Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Partner Information</h2>
                        
                        <div className="space-y-4">
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

                    {/* Dates Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contract Dates</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Date</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{contract.contract_date}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{contract.effective_date || 'Not set'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{contract.expiration_date || 'Not set'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contract File Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contract File</h2>
                        
                        <div className="space-y-4">
                                {contract.contract_file ? (
                                    <div className="flex flex-col space-y-3">
                                        <button
                                            type="button"
                                            onClick={handleOpenPreview}
                                            className="inline-flex items-center text-[#37692F] hover:text-[#2a5624] py-2 transition-colors"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            View Contract File
                                        </button>
                                        <div className="flex space-x-2 text-sm">
                                            <button className="text-gray-600 hover:text-[#37692F] px-3 py-1.5 rounded border border-gray-300 hover:border-[#37692F] transition-colors">
                                                Download PDF
                                            </button>
                                            <button className="text-gray-600 hover:text-[#37692F] px-3 py-1.5 rounded border border-gray-300 hover:border-[#37692F] transition-colors">
                                                Download Word
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 font-poppins">No file uploaded</p>
                                )}
                            </div>
                    </div>

                    {/* Notes Card */}
                    {contract.notes && (
                        <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Notes</h2>
                            <p className="text-sm text-gray-900 font-poppins font-normal whitespace-pre-wrap">{contract.notes}</p>
                        </div>
                    )}

                    {/* Seed Varieties Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-3">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Seed Varieties</h2>
                        
                        {contract.seed_items.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 font-poppins font-medium">Seed Variety</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Quantity</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Unit Price</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Cycles</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Expected Harvest</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {contract.seed_items.map((item) => (
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
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {item.quantity} {item.unit}
                                                </td>
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    ₱ {item.seed.price_per_unit}
                                                </td>
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {item.cycles}
                                                </td>
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {item.expected_harvest_date}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 font-poppins font-normal">
                                No seed varieties added to this contract.
                            </p>
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-6 text-sm text-gray-500 font-poppins font-normal">
                    <p>Created: {new Date(contract.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}</p>
                    <p>Last Updated: {new Date(contract.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}</p>
                </div>
            </div>
        
            {/* Modals */}
            {showStatusModal && (
                <DraftActiveModal
                    contract={contract}
                    onCancel={() => setShowStatusModal(false)}
                    onConfirm={() => {
                        setSelectedStatus('active');
                        handleStatusChange();
                    }}
                    processing={processing}
                />
            )}

            {showFilePreview && (
                <ContractFilePreviewModal
                    fileUrl={contract.contract_file ? `/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/storage/${contract.contract_file}` : null}
                    onClose={handleClosePreview}
                />
            )}

        </AuthenticatedLayout>
    );
}