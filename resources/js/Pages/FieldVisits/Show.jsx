import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ShowGrowthModal from '@/Pages/FieldVisits/showGrowthModal';
import ShowDamageModal from '@/Pages/FieldVisits/showDamageModal';
import HandleCompleteModal from './handleComplete';
import HandleCancelModal from './handleCancel';

export default function Show({ auth, fieldVisit }) {
    const { flash } = usePage().props;
    const [showGrowthModal, setShowGrowthModal] = useState(false);
    const [showDamageModal, setShowDamageModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    
    const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };


    const growthForm = useForm({
        field_visit_ID: fieldVisit.field_visit_ID, // <-- add this
        stage: '',
        status: '',
        notes: '',
    });

    const damageForm = useForm({
        field_visit_ID: fieldVisit.field_visit_ID, // <-- add this
        stage: '',
        type_damage: '',
        severity_damage: '',
        notes: '',
    });

    const handleComplete = () => setShowCompleteModal(true);
    const handleCancel = () => setShowCancelModal(true);

    const handleCompleteConfirm = (id) => {
    // Call your API or router.post to complete the visit
    // Example:
    router.post(route('field-visits.complete', id), {}, {
        onFinish: () => setShowCompleteModal(false)
    });
    };

    const handleCancelConfirm = (id) => {
    // Call your API or router.post to cancel the visit
    router.post(route('field-visits.cancel', id), {}, {
        onFinish: () => setShowCancelModal(false)
    });
    };

    const handleCompleteCancel = () => setShowCompleteModal(false);
    const handleCancelCancel = () => setShowCancelModal(false);

    const submitGrowthReport = () => {
        growthForm.post(route('field-visits.growth-reports.store', fieldVisit.field_visit_ID), {
            onSuccess: () => {
                setShowGrowthModal(false);
                growthForm.reset();
            },
        });
    };

    const submitDamageReport = () => {
        damageForm.post(route('field-visits.damage-reports.store', fieldVisit.field_visit_ID), {
            onSuccess: () => {
                setShowDamageModal(false);
                damageForm.reset();
            },
        });
    };

    const getStatusBadge = (status) => {
        const colors = {
            ongoing: 'bg-blue-100 text-blue-700',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return (
            <span className={`rounded-full px-3 py-1 text-xs font-poppins font-normal ${colors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const dateFormatter = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date) ? dateString : date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Field Visit Details</span>
                </h2>
            }
        >
            <Head title={`Field Visit #${fieldVisit.field_visit_ID}`} />
            
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
                        href={route('field-visits.index')}
                        className="text-[#37692F] hover:underline"
                    >
                        Field Visits
                    </Link>{" "}
                    / <span>Visit #{fieldVisit.field_visit_ID}</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Field Visit Information</h1>
                    <div className="flex space-x-3">
                        {fieldVisit.status !== 'completed' && fieldVisit.status !== 'cancelled' && (
                            <Link
                                href={route('field-visits.edit', fieldVisit.field_visit_ID)}
                                className="flex items-center rounded-md bg-[#37692F] px-4 py-2 text-white hover:bg-[#2a5624]"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Visit
                            </Link>
                        )}
                        <Link
                            href={route('field-visits.index')}
                            className="flex items-center rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to List
                        </Link>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                        {flash.error}
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Visit Details Card */}
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between border-b pb-2">
                            <h2 className="text-lg font-semibold text-gray-800">Visit Details</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Contract</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">
                                    {fieldVisit.contract?.contract_name || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Visit Date</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">
                                    {dateFormatter(fieldVisit.date_visit)}
                                </p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                                {getStatusBadge(fieldVisit.status)}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Assigned To</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">
                                    {((fieldVisit.assignee?.first_name || fieldVisit.assignee?.last_name)
                                        ? `${fieldVisit.assignee?.first_name || ''} ${fieldVisit.assignee?.last_name || ''}`.trim()
                                        : 'Not assigned')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Farm Information Card */}
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Farm Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Farm Name</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">
                                    {fieldVisit.farm?.location_name ||
                                    fieldVisit.contract?.farm?.location_name ||
                                    'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Farm Address</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">
                                    {fieldVisit.farm?.address ||
                                    fieldVisit.contract?.farm?.address ||
                                    fieldVisit.contract?.farm?.location ||
                                    'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contract Information Card */}
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between border-b pb-2">
                            <h2 className="text-lg font-semibold text-gray-800">Contract Information</h2>
                            {fieldVisit.contract && (
                                <Link
                                    href={route('contracts.show', fieldVisit.contract.id)}
                                    className="flex items-center rounded-md bg-[#37692F] px-3 py-1 text-sm text-white hover:bg-[#2a5624]"
                                >
                                    <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Contract
                                </Link>
                            )}
                        </div>
                        
                        {fieldVisit.contract ? (
                            <div className="space-y-6">
                                {/* Contract Header */}
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-poppins text-lg font-semibold text-gray-900">
                                                {fieldVisit.contract.contract_name}
                                            </h3>
                                            <p className="font-poppins text-sm text-gray-600">
                                                Contract #{fieldVisit.contract.id}
                                            </p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-poppins font-medium ${
                                            fieldVisit.contract.status === 'active' ? 'bg-green-100 text-green-700' :
                                            fieldVisit.contract.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                                            fieldVisit.contract.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                                            fieldVisit.contract.status === 'suspended' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {fieldVisit.contract.status ? fieldVisit.contract.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Contract Details Grid */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Dates Section */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                                                Signing Date
                                            </label>
                                            <p className="font-poppins text-sm font-normal text-gray-900">
                                                {fieldVisit.contract.signing_date ? dateFormatter(fieldVisit.contract.signing_date) : 'N/A'}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                                                Expiration Date
                                            </label>
                                            <p className="font-poppins text-sm font-normal text-gray-900">
                                                {fieldVisit.contract.expiration_date ? dateFormatter(fieldVisit.contract.expiration_date) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Financial Section */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                                                Buyback Price
                                            </label>
                                            <p className="font-poppins text-lg font-semibold text-[#37692F]">
                                                {fieldVisit.contract.buyback_price_per_unit ? 
                                                    `₱${parseFloat(fieldVisit.contract.buyback_price_per_unit).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : 
                                                    'N/A'
                                                }
                                                <span className="font-poppins text-sm font-normal text-gray-500 ml-1">per unit</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                {fieldVisit.contract.notes && (
                                    <div>
                                        <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                                            Contract Notes
                                        </label>
                                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <p className="font-poppins text-sm font-normal text-gray-700 whitespace-pre-wrap">
                                                {fieldVisit.contract.notes}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Contract File Section */}
                                <div>
                                    <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                                        Contract Document
                                    </label>
                                    {fieldVisit.contract.contract_file ? (
                                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-poppins text-sm font-medium text-gray-900">
                                                        {fieldVisit.contract.original_file_name || 'Contract Document'}
                                                    </p>
                                                    <p className="font-poppins text-xs text-gray-500">
                                                        Click to download
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={`/storage/${fieldVisit.contract.contract_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                            >
                                                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Download
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
                                            <div className="text-center">
                                                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                                </svg>
                                                <p className="mt-2 font-poppins text-sm text-gray-500">
                                                    No contract file uploaded
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="mt-4 font-poppins text-sm font-medium text-gray-900">
                                        No Contract Associated
                                    </p>
                                    <p className="mt-1 font-poppins text-sm text-gray-500">
                                        This field visit is not linked to any contract
                                    </p>
                                </div>
                            )}
                        </div>
                    {/* Remarks Card */}
                    {fieldVisit.remarks && (
                        <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Remarks</h2>
                            <p className="whitespace-pre-wrap font-poppins text-sm font-normal text-gray-900">
                                {fieldVisit.remarks}
                            </p>
                        </div>
                    )}

                    {/* Reports Section */}
                    <div className="lg:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Growth Reports Card */}
                        <div className="rounded-lg bg-white p-6 shadow-lg">
                            <div className="mb-4 flex items-center justify-between border-b pb-2">
                                <h2 className="text-lg font-semibold text-green-700">
                                    Growth Reports ({fieldVisit.growth_reports?.length || 0})
                                </h2>
                                {fieldVisit.status === 'ongoing' && (
                                    <button
                                        onClick={() => setShowGrowthModal(true)}
                                        className="flex items-center rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                                    >
                                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Report
                                    </button>
                                )}
                            </div>
                            
                            {fieldVisit.growth_reports && fieldVisit.growth_reports.length > 0 ? (
                                <div className="space-y-4">
                                    {fieldVisit.growth_reports.map(report => (
                                        <div key={report.growth_ID} className="rounded-lg border border-green-200 bg-green-50 p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="font-poppins text-sm font-medium text-gray-900">
                                                            Stage: {report.stage || 'N/A'}
                                                        </span>
                                                        <span className={`rounded-full px-2 py-1 text-xs font-poppins font-normal ${
                                                            report.status === 'excellent' ? 'bg-green-100 text-green-700' :
                                                            report.status === 'good' ? 'bg-blue-100 text-blue-700' :
                                                            report.status === 'average' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                            {report.status || 'N/A'}
                                                        </span>
                                                    </div>
                                                    {report.notes && (
                                                        <p className="font-poppins text-sm font-normal text-gray-600">
                                                            {report.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    <Link
                                                        href={route('growth-reports.show', report.growth_ID)}
                                                        className="text-blue-600 transition-colors duration-200 hover:text-blue-800"
                                                        title="View Details"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        href={route('growth-reports.edit', report.growth_ID)}
                                                        className={`text-green-600 transition-colors duration-200 hover:text-green-800 ${fieldVisit.status === 'completed' ? 'pointer-events-none opacity-50' : ''}`}
                                                        title="Edit Report"
                                                        tabIndex={fieldVisit.status === 'completed' ? -1 : 0}
                                                        aria-disabled={fieldVisit.status === 'completed'}
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center font-poppins text-sm font-normal text-gray-500 py-4">
                                    No growth reports yet
                                </p>
                            )}
                        </div>

                        {/* Damage Reports Card */}
                        <div className="rounded-lg bg-white p-6 shadow-lg">
                            <div className="mb-4 flex items-center justify-between border-b pb-2">
                                <h2 className="text-lg font-semibold text-red-700">
                                    Damage Reports ({fieldVisit.damage_reports?.length || 0})
                                </h2>
                                {fieldVisit.status === 'ongoing' && (
                                    <button
                                        onClick={() => setShowDamageModal(true)}
                                        className="flex items-center rounded-md bg-orange-600 px-3 py-1 text-sm text-white hover:bg-orange-700"
                                    >
                                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Report
                                    </button>
                                )}
                            </div>
                            
                            {fieldVisit.damage_reports && fieldVisit.damage_reports.length > 0 ? (
                                <div className="space-y-4">
                                    {fieldVisit.damage_reports.map(report => (
                                        <div key={report.damage_ID} className="rounded-lg border border-red-200 bg-red-50 p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-2">
                                                        <span className="font-poppins text-sm font-medium text-gray-900">
                                                            Type: {report.type_damage || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="font-poppins text-sm font-normal text-gray-600">
                                                            Stage: {report.stage || 'N/A'}
                                                        </span>
                                                        <span className={`rounded-full px-2 py-1 text-xs font-poppins font-normal ${
                                                            report.severity_damage === 'low' ? 'bg-green-100 text-green-700' :
                                                            report.severity_damage === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            report.severity_damage === 'high' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                            {report.severity_damage || 'N/A'}
                                                        </span>
                                                    </div>
                                                    {report.notes && (
                                                        <p className="font-poppins text-sm font-normal text-gray-600">
                                                            {report.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    <Link
                                                        href={route('damage-reports.show', report.damage_ID)}
                                                        className="text-blue-600 transition-colors duration-200 hover:text-blue-800"
                                                        title="View Details"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        href={route('damage-reports.edit', report.damage_ID)}
                                                        className={`text-green-600 transition-colors duration-200 hover:text-green-800 ${fieldVisit.status === 'completed' ? 'pointer-events-none opacity-50' : ''}`}
                                                        title="Edit Report"
                                                        tabIndex={fieldVisit.status === 'completed' ? -1 : 0}
                                                        aria-disabled={fieldVisit.status === 'completed'}
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center font-poppins text-sm font-normal text-gray-500 py-4">
                                    No damage reports yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {fieldVisit.status === 'ongoing' && (
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                    onClick={handleComplete}
                    className="flex items-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                    {/* ...icon... */}
                    Complete Visit
                    </button>
                    <button
                    onClick={handleCancel}
                    className="flex items-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                    {/* ...icon... */}
                    Cancel Visit
                    </button>
                </div>
                )}

                {/* Timestamps */}
                <div className="mt-6 font-poppins text-sm font-normal text-gray-500">
                    <p>Created: {dateFormatter(fieldVisit.created_at)}</p>
                    <p>Last Updated: {dateFormatter(fieldVisit.updated_at)}</p>
                </div>
            </div>

            {/* Modals */}
            <ShowGrowthModal
                open={showGrowthModal}
                form={growthForm}
                onSubmit={submitGrowthReport}
                onClose={() => setShowGrowthModal(false)}
            />
            <ShowDamageModal
                open={showDamageModal}
                form={damageForm}
                onSubmit={submitDamageReport}
                onClose={() => setShowDamageModal(false)}
            />

            {showCompleteModal && (
            <HandleCompleteModal
                fieldVisit={fieldVisit}
                onCancel={handleCompleteCancel}
                onConfirm={handleCompleteConfirm}
            />
            )}
            {showCancelModal && (
            <HandleCancelModal
                fieldVisit={fieldVisit}
                onCancel={handleCancelCancel}
                onConfirm={handleCancelConfirm}
            />
            )}
        </AuthenticatedLayout>
    );
}