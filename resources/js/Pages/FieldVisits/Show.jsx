import React, { useState, useEffect } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ShowGrowthModal from '@/Pages/FieldVisits/showGrowthModal';
import ShowDamageModal from '@/Pages/FieldVisits/showDamageModal';
import EditGrowthModal from '@/Pages/Reports/EditGrowthModal';
import EditDamageModal from '@/Pages/Reports/EditDamageModal';
import DeleteGrowthModal from '@/Pages/FieldVisits/DeleteGrowthModal';
import DeleteDamageModal from '@/Pages/FieldVisits/DeleteDamageModal';
import HandleCompleteModal from './handleComplete';
import HandleCancelModal from './handleCancel';

export default function Show({ auth, fieldVisit }) {
    const { flash } = usePage().props;
    const permissions = auth?.user?.can || [];
    const [showGrowthModal, setShowGrowthModal] = useState(false);
    const [showDamageModal, setShowDamageModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    
    // Delete modals state
    const [showDeleteGrowthModal, setShowDeleteGrowthModal] = useState(false);
    const [showDeleteDamageModal, setShowDeleteDamageModal] = useState(false);
    const [selectedGrowthReport, setSelectedGrowthReport] = useState(null);
    const [selectedDamageReport, setSelectedDamageReport] = useState(null);

    // Edit modals state
    const [showEditGrowthModal, setShowEditGrowthModal] = useState(false);
    const [showEditDamageModal, setShowEditDamageModal] = useState(false);


    // Edit handlers
    const handleEditGrowth = (report) => {
        setSelectedGrowthReport(report);
        editGrowthForm.setData({
            stage: report.stage || '',
            status: report.status || '',
            notes: report.notes || '',
        });
        setShowEditGrowthModal(true);
    };

    const handleEditDamage = (report) => {
        setSelectedDamageReport(report);
        editDamageForm.setData({
            stage: report.stage || '',
            type_damage: report.type_damage || '',
            severity_damage: report.severity_damage || '',
            notes: report.notes || '',
        });
        setShowEditDamageModal(true);
    };

    // Delete handlers
    const handleDeleteGrowth = (report) => {
        setSelectedGrowthReport(report);
        setShowDeleteGrowthModal(true);
    };

    const handleDeleteDamage = (report) => {
        setSelectedDamageReport(report);
        setShowDeleteDamageModal(true);
    };

    const confirmDeleteGrowth = (id) => {
        router.delete(route('growth-reports.destroy', id), {
            onSuccess: () => {
                setShowDeleteGrowthModal(false);
                setSelectedGrowthReport(null);
            },
        });
    };

    const confirmDeleteDamage = (id) => {
        router.delete(route('damage-reports.destroy', id), {
            onSuccess: () => {
                setShowDeleteDamageModal(false);
                setSelectedDamageReport(null);
            },
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const growthForm = useForm({
        field_visit_ID: fieldVisit.field_visit_ID,
        stage: '',
        status: '',
        notes: '',
    });

    const damageForm = useForm({
        field_visit_ID: fieldVisit.field_visit_ID,
        stage: '',
        type_damage: '',
        severity_damage: '',
        notes: '',
    });

    // Edit forms
    const editGrowthForm = useForm({
        stage: '',
        status: '',
        notes: '',
    });

    const editDamageForm = useForm({
        stage: '',
        type_damage: '',
        severity_damage: '',
        notes: '',
    });

    const handleComplete = () => setShowCompleteModal(true);
    const handleCancel = () => setShowCancelModal(true);

    const handleCompleteConfirm = (id) => {
        router.post(route('field-visits.complete', id), {}, {
            onFinish: () => setShowCompleteModal(false)
        });
    };

    const handleCancelConfirm = (id) => {
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

    const submitEditGrowthReport = () => {
        editGrowthForm.put(route('growth-reports.update', selectedGrowthReport.growth_ID), {
            onSuccess: () => {
                setShowEditGrowthModal(false);
                setSelectedGrowthReport(null);
                editGrowthForm.reset();
            },
        });
    };

    const submitEditDamageReport = () => {
        editDamageForm.put(route('damage-reports.update', selectedDamageReport.damage_ID), {
            onSuccess: () => {
                setShowEditDamageModal(false);
                setSelectedDamageReport(null);
                editDamageForm.reset();
            },
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getGrowthStatusColor = (status) => {
        switch (status) {
            case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
            case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'average': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'poor': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
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
            
            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline transition-colors duration-200"
                    >
                        Home
                    </Link>
                    <span className="text-gray-400">/</span>
                    <Link
                        href={route('field-visits.index')}
                        className="text-[#37692F] hover:underline transition-colors duration-200"
                    >
                        Field Visits
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-800 font-medium truncate max-w-xs">Visit #{fieldVisit.field_visit_ID}</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#37692F] to-[#4a8a3f] flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">
                                    V
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-poppins">
                                    Field Visit #{fieldVisit.field_visit_ID}
                                </h1>
                                <div className="flex items-center space-x-3 mt-2">
                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(fieldVisit.status)}`}>
                                        <div className={`w-2 h-2 rounded-full mr-2 ${
                                            fieldVisit.status === 'ongoing' ? 'bg-blue-500' : 
                                            fieldVisit.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                        {fieldVisit.status.charAt(0).toUpperCase() + fieldVisit.status.slice(1)}
                                    </span>
                                    {fieldVisit.contract && (
                                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                            Contract: {fieldVisit.contract.contract_name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => window.location.href = route('field-visits.exportProfile', fieldVisit.field_visit_ID)}
                                className="flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                title="Export Field Visit Report PDF"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export PDF
                            </button>
                            {permissions.includes('edit field visit') && fieldVisit.status !== 'completed' && fieldVisit.status !== 'cancelled' && (
                                <Link
                                    href={route('field-visits.edit', fieldVisit.field_visit_ID)}
                                    className="flex items-center rounded-xl bg-gradient-to-r from-[#37692F] to-[#4a8a3f] px-5 py-3 text-white font-medium hover:from-[#2a5624] hover:to-[#37692F] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Visit
                                </Link>
                            )}
                            <Link
                                href={route('field-visits.index')}
                                className="flex items-center rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 px-5 py-3 text-white font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to List
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 rounded-xl bg-green-100 border border-green-200 p-4 text-green-700">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 rounded-xl bg-red-100 border border-red-200 p-4 text-red-700">
                        {flash.error}
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    
                    {/* Visit Details */}
                    <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Visit Details</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Visit ID</label>
                                <p className="text-lg font-semibold text-gray-900">#{fieldVisit.field_visit_ID}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Status</label>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(fieldVisit.status)}`}>
                                        {fieldVisit.status.charAt(0).toUpperCase() + fieldVisit.status.slice(1)}
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Visit Date</label>
                                    <p className="text-gray-900 font-semibold">{dateFormatter(fieldVisit.date_visit)}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Assigned To</label>
                                <p className="text-gray-900 font-medium">
                                    {((fieldVisit.assignee?.first_name || fieldVisit.assignee?.last_name)
                                        ? `${fieldVisit.assignee?.first_name || ''} ${fieldVisit.assignee?.last_name || ''}`.trim()
                                        : 'Not assigned')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Farm Information Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Farm Information</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Farm Name</label>
                                <p className="text-gray-900 font-semibold">
                                    {fieldVisit.farm?.location_name ||
                                    fieldVisit.contract?.farm?.location_name ||
                                    'N/A'}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Farm Address</label>
                                <p className="text-gray-900 whitespace-pre-wrap">
                                    {fieldVisit.farm?.address ||
                                    fieldVisit.contract?.farm?.address ||
                                    fieldVisit.contract?.farm?.location ||
                                    'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contract Information Card */}
                    <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Contract Information</h2>
                            {fieldVisit.contract && (
                                <Link
                                    href={route('contracts.show', fieldVisit.contract.id)}
                                    className="ml-auto flex items-center rounded-xl bg-gradient-to-r from-[#37692F] to-[#4a8a3f] px-4 py-2 text-white font-medium hover:from-[#2a5624] hover:to-[#37692F] transition-all duration-200"
                                >
                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Contract
                                </Link>
                            )}
                        </div>
                        
                        {fieldVisit.contract ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Contract Name</label>
                                        <p className="text-lg font-semibold text-gray-900">{fieldVisit.contract.contract_name}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Contract Status</label>
                                        <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${
                                            fieldVisit.contract.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                                            fieldVisit.contract.status === 'draft' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                                            fieldVisit.contract.status === 'under_review' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                            'bg-red-100 text-red-800 border-red-200'
                                        }`}>
                                            {fieldVisit.contract.status ? fieldVisit.contract.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Signing Date</label>
                                        <p className="text-gray-900 font-semibold">
                                            {fieldVisit.contract.signing_date ? dateFormatter(fieldVisit.contract.signing_date) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Expiration Date</label>
                                        <p className="text-gray-900 font-semibold">
                                            {fieldVisit.contract.expiration_date ? dateFormatter(fieldVisit.contract.expiration_date) : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Buyback Price</label>
                                    <p className="text-2xl font-bold text-[#37692F]">
                                        {fieldVisit.contract.buyback_price_per_unit ? 
                                            `Php ${parseFloat(fieldVisit.contract.buyback_price_per_unit).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : 
                                            'N/A'
                                        }
                                        <span className="text-sm font-normal text-gray-500 ml-1">per unit</span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">No contract associated with this field visit</p>
                            </div>
                        )}
                    </div>

                    {/* Reports Section */}
                    <div className="lg:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Growth Reports Card */}
                        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Growth Reports ({fieldVisit.growth_reports?.length || 0})</h2>
                                {permissions.includes('edit field visit') && fieldVisit.status === 'ongoing' && (
                                    <button
                                        onClick={() => setShowGrowthModal(true)}
                                        className="ml-auto flex items-center rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-white font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Report
                                    </button>
                                )}
                            </div>
                            
                            {fieldVisit.growth_reports && fieldVisit.growth_reports.length > 0 ? (
                                <div className="space-y-4">
                                    {fieldVisit.growth_reports.map(report => (
                                        <div key={report.growth_ID} className="rounded-xl border border-green-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <span className="font-semibold text-gray-900">
                                                            {report.stage || 'N/A'}
                                                        </span>
                                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getGrowthStatusColor(report.status)}`}>
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                                                report.status === 'excellent' ? 'bg-green-500' :
                                                                report.status === 'good' ? 'bg-blue-500' :
                                                                report.status === 'average' ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}></div>
                                                            {report.status || 'N/A'}
                                                        </span>
                                                    </div>
                                                    {report.notes && (
                                                        <p className="text-gray-600 text-sm leading-relaxed">
                                                            {report.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                {/* Growth Reports */}
                                                <div className="flex space-x-2 ml-4">
                                                    <Link
                                                        href={route('growth-reports.show', report.growth_ID)}
                                                        className="text-blue-600 transition-colors duration-200 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                                                        title="View Details"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    {permissions.includes('edit field visit') && fieldVisit.status === 'ongoing' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditGrowth(report)}
                                                                className="text-green-600 transition-colors duration-200 hover:text-green-800 p-2 rounded-lg hover:bg-green-50"
                                                                title="Edit Report"
                                                            >
                                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteGrowth(report)}
                                                                className="text-red-600 transition-colors duration-200 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                                                                title="Delete Report"
                                                            >
                                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No growth reports yet</p>
                                </div>
                            )}
                        </div>

                        {/* Damage Reports Card */}
                        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Damage Reports ({fieldVisit.damage_reports?.length || 0})</h2>
                                {permissions.includes('edit field visit') && fieldVisit.status === 'ongoing' && (
                                    <button
                                        onClick={() => setShowDamageModal(true)}
                                        className="ml-auto flex items-center rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-2 text-white font-medium hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Report
                                    </button>
                                )}
                            </div>
                            
                            {fieldVisit.damage_reports && fieldVisit.damage_reports.length > 0 ? (
                                <div className="space-y-4">
                                    {fieldVisit.damage_reports.map(report => (
                                        <div key={report.damage_ID} className="rounded-xl border border-orange-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-3">
                                                        <span className="font-semibold text-gray-900">
                                                            {report.type_damage || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <span className="text-sm text-gray-600">
                                                            Stage: {report.stage || 'N/A'}
                                                        </span>
                                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getSeverityColor(report.severity_damage)}`}>
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                                                report.severity_damage === 'low' ? 'bg-green-500' :
                                                                report.severity_damage === 'medium' ? 'bg-yellow-500' :
                                                                report.severity_damage === 'high' ? 'bg-orange-500' : 'bg-red-500'
                                                            }`}></div>
                                                            {report.severity_damage || 'N/A'}
                                                        </span>
                                                    </div>
                                                    {report.notes && (
                                                        <p className="text-gray-600 text-sm leading-relaxed">
                                                            {report.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                {/* Damage Reports - UPDATE THE EDIT BUTTON */}
                                                <div className="flex space-x-2 ml-4">
                                                    <Link
                                                        href={route('damage-reports.show', report.damage_ID)}
                                                        className="text-blue-600 transition-colors duration-200 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                                                        title="View Details"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    {permissions.includes('edit field visit') && fieldVisit.status === 'ongoing' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditDamage(report)}
                                                                className="text-green-600 transition-colors duration-200 hover:text-green-800 p-2 rounded-lg hover:bg-green-50"
                                                                title="Edit Report"
                                                            >
                                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteDamage(report)}
                                                                className="text-red-600 transition-colors duration-200 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                                                                title="Delete Report"
                                                            >
                                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No damage reports yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Remarks Card */}
                    {fieldVisit.remarks && (
                        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Remarks</h2>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{fieldVisit.remarks}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {fieldVisit.status === 'ongoing' && (permissions.includes('complete field visit') || permissions.includes('cancel field visit')) && (
                    <div className="mt-8 flex justify-end space-x-4">
                        {permissions.includes('complete field visit') && (
                            <button
                                onClick={handleComplete}
                                className="flex items-center rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-white font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Complete Visit
                            </button>
                        )}
                        {permissions.includes('cancel field visit') && (
                            <button
                                onClick={handleCancel}
                                className="flex items-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-white font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel Visit
                            </button>
                        )}
                    </div>
                )}

                {/* Timestamps */}
                <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Created: <strong className="text-gray-700">{dateFormatter(fieldVisit.created_at)}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Last Updated: <strong className="text-gray-700">{dateFormatter(fieldVisit.updated_at)}</strong></span>
                    </div>
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

            {/* Edit Modals */}
            {showEditGrowthModal && selectedGrowthReport && (
                <EditGrowthModal
                    open={showEditGrowthModal}
                    form={editGrowthForm}
                    onSubmit={submitEditGrowthReport}
                    onClose={() => {
                        setShowEditGrowthModal(false);
                        setSelectedGrowthReport(null);
                        editGrowthForm.reset();
                    }}
                />
            )}

            {showEditDamageModal && selectedDamageReport && (
                <EditDamageModal
                    open={showEditDamageModal}
                    form={editDamageForm}
                    onSubmit={submitEditDamageReport}
                    onClose={() => {
                        setShowEditDamageModal(false);
                        setSelectedDamageReport(null);
                        editDamageForm.reset();
                    }}
                />
            )}

            {/* Delete Modals */}
            {showDeleteGrowthModal && selectedGrowthReport && (
                <DeleteGrowthModal
                    open={showDeleteGrowthModal}
                    growthReport={selectedGrowthReport}
                    onCancel={() => {
                        setShowDeleteGrowthModal(false);
                        setSelectedGrowthReport(null);
                    }}
                    onConfirm={confirmDeleteGrowth}
                />
            )}

            {showDeleteDamageModal && selectedDamageReport && (
                <DeleteDamageModal
                    open={showDeleteDamageModal}
                    damageReport={selectedDamageReport}
                    onCancel={() => {
                        setShowDeleteDamageModal(false);
                        setSelectedDamageReport(null);
                    }}
                    onConfirm={confirmDeleteDamage}
                />
            )}

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