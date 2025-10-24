import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowTopRightOnSquareIcon, DocumentTextIcon, CalendarIcon, UserIcon, MapPinIcon, CubeIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import DraftActiveModal from './Draft-ActiveModal'; 
import ContractFilePreviewModal from './ContractFilePreviewModal';
import ActivateContractModal from './ActivateContractModal';
import CancelContractModal from './CancelContractModal';
import SendEmailModal from './SendEmailModal'; 
import CompleteContractModal from './CompleteContractModal';

export default function Show({ auth, contract }) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusToTransition, setStatusToTransition] = useState('');
    const [showFilePreview, setShowFilePreview] = useState(false);
    const [showSendEmailModal, setShowSendEmailModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);

    const { post, processing } = useForm();

    const handleOpenPreview = () => setShowFilePreview(true);
    const handleClosePreview = () => setShowFilePreview(false);

    const handleOpenStatusModal = (status) => {
        setStatusToTransition(status);
        setShowStatusModal(true);
    };

    const handleCancelConfirm = () => {
        router.delete(route('contracts.destroy', contract.id), {
            onSuccess: () => {
                setShowCancelModal(false);
            }
        });
    };

    const handleCancelClose = () => {
        setShowCancelModal(false);
    };

    const handleTransitionConfirm = (newStatus) => {
        router.post(route('contracts.change-status', contract.id), { status: newStatus }, {
            onSuccess: () => {
                setShowStatusModal(false);
                setStatusToTransition('');
                setShowCompleteModal(false); // <-- Always close CompleteContractModal
            },
            onError: (errors) => {
                setShowStatusModal(false);
                setStatusToTransition('');
                const errorMsg = errors.status || errors.error || "An unknown error occurred.";
                alert(`Transition Failed: ${errorMsg}`);
            }
        });
    };

    const handleSendEmail = () => {
        setShowSendEmailModal(true);
    };

    const handleSendEmailConfirm = () => {
        post(route('contracts.sendEmail', contract.id), {}, {
            onSuccess: () => setShowSendEmailModal(false),
            onError: () => setShowSendEmailModal(false),
            preserveState: true,
            preserveScroll: true
        });
    };

    

    const formatPrice = (price, decimals = 2) => {
        if (price === null || price === undefined) return '-';
        return parseFloat(price).toLocaleString('en-PH', { 
            style: 'currency', 
            currency: 'PHP', 
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString === '0000-00-00') return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-700 border-gray-300',
            under_review: 'bg-blue-50 text-blue-700 border-blue-200',
            active: 'bg-green-50 text-green-700 border-green-200',
            suspended: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            terminated: 'bg-red-50 text-red-700 border-red-200',
            cancelled: 'bg-pink-50 text-pink-700 border-pink-200',
            completed: 'bg-[#37692F]/10 text-[#37692F] border-[#37692F]/20',
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
    };

    const contractCommitments = contract.contract_commitments || [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Contract Details</h1>
                        <p className="mt-1 text-sm text-gray-600">View and manage contract information</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {(contract.can_be_edited || contract.can_be_partially_edited) && (
                            <Link
                                href={route('contracts.edit', contract.id)}
                                className={`inline-flex items-center rounded-lg bg-[#37692F] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a5624] ${
                                    ['cancelled', 'active'].includes(contract.status)
                                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                                tabIndex={['cancelled', 'active'].includes(contract.status) ? -1 : 0}
                                aria-disabled={['cancelled', 'active'].includes(contract.status)}
                            >
                                <DocumentTextIcon className="mr-2 h-4 w-4" />
                                Edit Contract
                            </Link>
                        )}
                        <Link
                            href={route('contracts.index')}
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            ← Back to List
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Contract: ${contract.contract_name}`} />

            <div className="space-y-6 p-6">
                {/* Header Card - Improved */}
                <div className="rounded-xl bg-gradient-to-r from-[#37692F] to-[#2a5624] p-6 text-white shadow-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <DocumentTextIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{contract.contract_name}</h1>
                                <div className="mt-2 flex items-center space-x-4">
                                    <span className="text-white/80">ID: #{contract.id}</span>
                                    <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                                        {contract.status.replace(/_/g, ' ').charAt(0).toUpperCase() + contract.status.replace(/_/g, ' ').slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white/80 text-sm font-medium">Buyback Price</p>
                            <p className="text-2xl font-bold">
                                {formatPrice(contract.buyback_price_per_unit, 2)} / kg
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Quick Actions Card - around line 193 */}
                        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Submit for Review - Draft status */}
                                {contract.status === 'draft' && contract.available_transitions?.includes('under_review') && (
                                    <button
                                        onClick={() => handleOpenStatusModal('under_review')}
                                        className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-4 text-center transition-all hover:bg-blue-100 hover:shadow-md border border-blue-200"
                                        disabled={processing}
                                    >
                                        <CheckCircleIcon className="h-6 w-6 text-blue-600 mb-2" />
                                        <span className="text-sm font-medium text-blue-900">Submit for Review</span>
                                    </button>
                                )}

                                {/* Activate Contract - Under Review status */}
                                {contract.status === 'under_review' && contract.available_transitions?.includes('active') && (
                                    <button
                                        onClick={() => handleOpenStatusModal('active')}
                                        className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-4 text-center transition-all hover:bg-green-100 hover:shadow-md border border-green-200"
                                        disabled={processing}
                                    >
                                        <CheckCircleIcon className="h-6 w-6 text-green-600 mb-2" />
                                        <span className="text-sm font-medium text-green-900">Activate Contract</span>
                                    </button>
                                )}

                                {/* Complete Contract - Active status */}
                                {contract.status === 'active' && contract.available_transitions?.includes('completed') && (
                                    <button
                                        onClick={() => setShowCompleteModal(true)}
                                        className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-4 text-center transition-all hover:bg-green-100 hover:shadow-md border border-green-200"
                                        disabled={processing}
                                    >
                                        <CheckCircleIcon className="h-6 w-6 text-green-600 mb-2" />
                                        <span className="text-sm font-medium text-green-900">Complete Contract</span>
                                    </button>
                                )}

                                {/* Suspend Contract - Active status */}
                                {contract.status === 'active' && contract.available_transitions?.includes('suspended') && (
                                    <button
                                        onClick={() => handleOpenStatusModal('suspended')}
                                        className="flex flex-col items-center justify-center rounded-lg bg-yellow-50 p-4 text-center transition-all hover:bg-yellow-100 hover:shadow-md border border-yellow-200"
                                        disabled={processing}
                                    >
                                        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mb-2" />
                                        <span className="text-sm font-medium text-yellow-900">Suspend Contract</span>
                                    </button>
                                )}

                                {/* Terminate Contract - Suspended status */}
                                {contract.status === 'suspended' && contract.available_transitions?.includes('terminated') && (
                                    <button
                                        onClick={() => handleOpenStatusModal('terminated')}
                                        className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-4 text-center transition-all hover:bg-red-100 hover:shadow-md border border-red-200"
                                        disabled={processing}
                                    >
                                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mb-2" />
                                        <span className="text-sm font-medium text-red-900">Terminate Contract</span>
                                    </button>
                                )}

                                {/* Reactivate Contract - Suspended status */}
                                {contract.status === 'suspended' && contract.available_transitions?.includes('active') && (
                                    <button
                                        onClick={() => handleOpenStatusModal('active')}
                                        className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-4 text-center transition-all hover:bg-green-100 hover:shadow-md border border-green-200"
                                        disabled={processing}
                                    >
                                        <CheckCircleIcon className="h-6 w-6 text-green-600 mb-2" />
                                        <span className="text-sm font-medium text-green-900">Reactivate Contract</span>
                                    </button>
                                )}

                                {/* Cancel Contract - Draft and Under Review only */}
                                {['draft', 'under_review'].includes(contract.status) && contract.available_transitions?.includes('cancelled') && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-4 text-center transition-all hover:bg-red-100 hover:shadow-md border border-red-200"
                                        disabled={processing}
                                    >
                                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mb-2" />
                                        <span className="text-sm font-medium text-red-900">Cancel Contract</span>
                                    </button>
                                )}

                                {/* Send Email - Under Review only */}
                                {contract.contract_file && contract.status === 'under_review' && (
                                    <button
                                        onClick={handleSendEmail}
                                        className="flex flex-col items-center justify-center rounded-lg bg-orange-50 p-4 text-center transition-all hover:bg-orange-100 hover:shadow-md border border-orange-200"
                                        disabled={processing || !contract.contract_file}
                                    >
                                        <EnvelopeIcon className="h-6 w-6 text-orange-600 mb-2" />
                                        <span className="text-sm font-medium text-orange-900">Send Email</span>
                                    </button>
                                )}

                                {/* View File - Always available if file exists */}
                                {contract.contract_file && (
                                    <button
                                        onClick={handleOpenPreview}
                                        className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 text-center transition-all hover:bg-gray-100 hover:shadow-md border border-gray-200"
                                    >
                                        <ArrowTopRightOnSquareIcon className="h-6 w-6 text-gray-600 mb-2" />
                                        <span className="text-sm font-medium text-gray-900">View File</span>
                                        {contract.original_file_name && (
                                            <span className="text-xs text-gray-500 mt-1 truncate w-full">
                                                {contract.original_file_name}
                                            </span>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Seed Commitments Card - Improved */}
                        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Seed Buyback Commitments</h2>
                                    <p className="text-sm text-gray-600 mt-1">Seed varieties and their buyback details</p>
                                </div>
                                <span className="rounded-full bg-[#37692F] px-3 py-1 text-sm font-medium text-white">
                                    {contractCommitments.length} item{contractCommitments.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {contractCommitments.length > 0 ? (
                                <div className="overflow-hidden rounded-xl border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                        {contractCommitments.map((item) => (
                                            <div key={item.id} className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all bg-white">
                                                <div className="flex items-start justify-between mb-3">
                                                    <Link
                                                        href={route('seeds.show', item.seed.id)}
                                                        className="font-semibold text-[#37692F] hover:underline text-sm flex items-center gap-1"
                                                    >
                                                        {item.seed.seed_variety}
                                                        <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                                                    </Link>
                                                </div>
                                                
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Quantity:</span>
                                                        <span className="font-medium">{item.seed_quantity} {item.unit}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Price:</span>
                                                        <span className="font-medium">{formatPrice(item.seed_price_at_contract)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Planting:</span>
                                                        <span className="font-medium">{formatDate(item.planting_date)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Cycles:</span>
                                                        <span className="font-medium">{item.agreed_cycles}</span>
                                                    </div>
                                                    <div className="flex justify-between border-t border-gray-100 pt-2">
                                                        <span className="text-gray-600 font-medium">Expected Buyback:</span>
                                                        <span className="font-bold text-[#37692F]">{item.expected_buyback_amount} {item.buyback_unit}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                                    <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No seed commitments</h3>
                                    <p className="mt-1 text-sm text-gray-500">No seed commitments found for this contract.</p>
                                </div>
                            )}
                        </div>

                        {/* Partner Orders Card - Improved */}
                        {contract.partner_orders && contract.partner_orders.length > 0 && (
                            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Partner Orders</h2>
                                        <p className="text-sm text-gray-600 mt-1">Order history and fulfillment status</p>
                                    </div>
                                    <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                                        {contract.partner_orders.length} order{contract.partner_orders.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {contract.partner_orders.map((order) => {
                                        const getStatusColor = (status) => {
                                            const colors = {
                                                pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                                                partially_fulfilled: 'bg-blue-100 text-blue-800 border-blue-200',
                                                fulfilled: 'bg-green-100 text-green-800 border-green-200',
                                            };
                                            return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
                                        };

                                        return (
                                            <div key={order.id} className="rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all bg-white">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <Link
                                                            href={route('partner-orders.show', order.id)}
                                                            className="text-lg font-semibold text-[#37692F] hover:underline block"
                                                        >
                                                            {order.order_number}
                                                        </Link>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {new Date(order.order_date).toLocaleDateString('en-GB')} • {order.lines.length} line item{order.lines.length !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                            {order.status.replace(/_/g, ' ').charAt(0).toUpperCase() + order.status.replace(/_/g, ' ').slice(1)}
                                                        </span>
                                                        <div className="mt-2">
                                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                                <div 
                                                                    className="bg-green-600 h-2 rounded-full" 
                                                                    style={{ width: `${order.fulfillment_percentage}%` }}
                                                                ></div>
                                                            </div>
                                                            <p className="text-xs text-gray-600 mt-1">{order.fulfillment_percentage.toFixed(0)}% fulfilled</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order Lines */}
                                                <div className="space-y-2 mb-4">
                                                    {order.lines.map((line) => (
                                                        <div key={line.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                                                            <span className="font-medium text-gray-700">
                                                                {line.product_name}
                                                            </span>
                                                            <span className="text-gray-600">
                                                                <span className="text-green-600 font-semibold">{line.delivered_qty}</span>
                                                                <span className="text-gray-400 mx-1">/</span>
                                                                <span>{line.qty} {line.unit}</span>
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Total Value */}
                                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                    <span className="text-sm font-medium text-gray-600">Total Value:</span>
                                                    <span className="text-lg font-bold text-[#37692F]">
                                                        {formatPrice(order.total_value)}
                                                    </span>
                                                </div>

                                                {/* Notes */}
                                                {order.notes && (
                                                    <div className="mt-3 text-xs text-gray-500 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                                        <strong className="text-yellow-800">Notes:</strong> {order.notes}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Field Visits Card - Improved */}
                        {contract.field_visits && contract.field_visits.length > 0 && (
                            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Field Visits</h2>
                                        <p className="text-sm text-gray-600 mt-1">Site inspections and progress reports</p>
                                    </div>
                                    <span className="rounded-full bg-purple-500 px-3 py-1 text-sm font-medium text-white">
                                        {contract.field_visits.length} visit{contract.field_visits.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {contract.field_visits.map((visit) => {
                                        const getStatusColor = (status) => {
                                            const colors = {
                                                ongoing: 'bg-blue-100 text-blue-800 border-blue-200',
                                                completed: 'bg-green-100 text-green-800 border-green-200',
                                            };
                                            return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
                                        };

                                        return (
                                            <div key={visit.id} className="rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all bg-white">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <Link
                                                            href={route('field-visits.show', visit.id)}
                                                            className="text-lg font-semibold text-[#37692F] hover:underline block"
                                                        >
                                                            Field Visit #{visit.id}
                                                        </Link>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {new Date(visit.date_visit).toLocaleDateString('en-GB')}
                                                            {visit.assignee && ` • ${visit.assignee.name}`}
                                                        </p>
                                                    </div>
                                                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(visit.status)}`}>
                                                        {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                                                    </span>
                                                </div>

                                                {/* Reports Summary */}
                                                <div className="flex items-center gap-6 text-sm mb-3">
                                                    <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                                                        <span className="text-blue-700 font-medium">Growth Reports:</span>
                                                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                                            {visit.growth_reports_count}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2">
                                                        <span className="text-red-700 font-medium">Damage Reports:</span>
                                                        <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                                            {visit.damage_reports_count}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Remarks */}
                                                {visit.remarks && (
                                                    <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                        <strong className="text-gray-700">Remarks:</strong> {visit.remarks}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Partner Information - Improved */}
                        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                    <UserIcon className="h-5 w-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Partner Information</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Name</p>
                                        <p className="text-sm font-semibold text-gray-900">{contract.partner.name}</p>
                                    </div>
                                    <Link
                                        href={route('partners.show', contract.partner.id)}
                                        className="text-sm text-[#37692F] hover:underline font-medium"
                                    >
                                        View →
                                    </Link>
                                </div>
                                {contract.partner.email && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-600">Email</p>
                                        <p className="text-sm text-gray-900 mt-1">{contract.partner.email}</p>
                                    </div>
                                )}
                                {contract.partner.phone && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-600">Phone</p>
                                        <p className="text-sm text-gray-900 mt-1">{contract.partner.phone}</p>
                                    </div>
                                )}
                                {contract.partner.address && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-600">Address</p>
                                        <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{contract.partner.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Farm Information - Improved */}
                        {contract.farm && (
                            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                                        <MapPinIcon className="h-5 w-5 text-green-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Farm Information</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-600">Farm Name</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{contract.farm.location_name}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-600">Area Size</p>
                                        <p className="text-sm text-gray-900 mt-1">
                                            {contract.farm.area_size ? `${contract.farm.area_size} hectares` : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-600">Soil Type</p>
                                        <p className="text-sm text-gray-900 mt-1 capitalize">{contract.farm.soil_type}</p>
                                    </div>
                                    {contract.farm.address && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-600">Address</p>
                                            <p className="text-sm text-gray-900 mt-1">{contract.farm.address}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Contract Dates - Improved */}
                        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Contract Dates</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600">Signing Date</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(contract.signing_date)}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600">Effective Date</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(contract.effective_date)}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600">Expiration Date</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(contract.expiration_date)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Notes - Improved */}
                        {contract.notes && (
                            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Notes</h2>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-sm text-yellow-800 whitespace-pre-wrap">
                                        {contract.notes}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timestamps - Improved */}
                <div className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-6 border border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-2 sm:mb-0">
                            <span className="font-medium">Created:</span>
                            <span className="font-semibold text-gray-900">{formatDate(contract.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Last Updated:</span>
                            <span className="font-semibold text-gray-900">{formatDate(contract.updated_at)}</span>
                        </div>
                    </div>
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
                    fileUrl={contract.contract_file 
                        ? `http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/storage/app/public/contracts/${contract.contract_file.split('/').pop()}` 
                        : null}
                    onClose={handleClosePreview}
                    contract={contract}
                />
            )}

            {showCancelModal && (
                <CancelContractModal
                    contract={contract}
                    onCancel={handleCancelClose}
                    onConfirm={handleCancelConfirm}
                    processing={processing}
                />
            )}

            <SendEmailModal
                open={showSendEmailModal}
                onCancel={() => setShowSendEmailModal(false)}
                onConfirm={handleSendEmailConfirm}
                contract={contract}
                processing={processing}
            />

            <CompleteContractModal
                open={showCompleteModal}
                onCancel={() => setShowCompleteModal(false)}
                onConfirm={handleTransitionConfirm}
                contract={contract}
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}