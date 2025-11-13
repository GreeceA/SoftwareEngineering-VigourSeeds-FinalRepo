import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';

export default function Edit({ auth, report, reportType }) {
    const { flash } = usePage().props;
    const reportId = reportType === 'growth' ? report.growth_ID : report.damage_ID;

    const form = useForm({
        field_visit_ID: report.field_visit_ID || report.field_visit?.field_visit_ID || '',
        stage: report.stage || '',
        status: report.status || '',
        type_damage: report.type_damage || '',
        severity_damage: report.severity_damage || '',
        notes: report.notes || '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.put(route(`${reportType === 'growth' ? 'growth-reports.update' : 'damage-reports.update'}`, reportId), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Edit {reportType === 'growth' ? 'Growth' : 'Damage'} Report</span>
                </h2>
            }
        >
            <Head title={`Edit ${reportType === 'growth' ? 'Growth' : 'Damage'} Report`} />
            
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
                    /{" "}
                    <Link
                        href={route('field-visits.show', report.field_visit_ID || report.field_visit?.field_visit_ID)}
                        className="text-[#37692F] hover:underline"
                    >
                        Visit #{report.field_visit_ID || report.field_visit?.field_visit_ID}
                    </Link>{" "}
                    /{" "}
                    <Link
                        href={route(`${reportType === 'growth' ? 'growth-reports.show' : 'damage-reports.show'}`, reportId)}
                        className="text-[#37692F] hover:underline"
                    >
                        {reportType === 'growth' ? 'Growth' : 'Damage'} Report #{reportId}
                    </Link>{" "}
                    / <span>Edit</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Edit {reportType === 'growth' ? '🌱 Growth' : '⚠️ Damage'} Report #{reportId}
                        </h1>
                        <p className="mt-1 font-poppins text-sm text-gray-600">
                            Update the details of this {reportType === 'growth' ? 'growth progress' : 'damage incident'} report
                        </p>
                    </div>
                    <Link
                        href={route(`${reportType === 'growth' ? 'growth-reports.show' : 'damage-reports.show'}`, reportId)}
                        className="flex items-center rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                    >
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Cancel
                    </Link>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Edit Form */}
                <div className="rounded-lg bg-white p-6 shadow-lg">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Hidden Field */}
                        <input type="hidden" name="field_visit_ID" value={form.data.field_visit_ID} />

                        {/* Stage Selection */}
                        <div>
                            <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                                Growth Stage *
                            </label>
                            <select
                                value={form.data.stage}
                                onChange={e => form.setData('stage', e.target.value)}
                                className={`mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 font-poppins text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                    form.errors.stage ? 'border-red-500' : ''
                                }`}
                            >
                                <option value="">Select growth stage</option>
                                <option value="Emergence">🌱 Emergence</option>
                                <option value="Vegetative">🌿 Vegetative</option>
                                <option value="Tasseling">🌾 Tasseling</option>
                                <option value="Silking">🌸 Silking</option>
                                <option value="Maturity">🌽 Maturity</option>
                                <option value="Harvest">🏆 Harvest</option>
                            </select>
                            {form.errors.stage && (
                                <p className="mt-2 font-poppins text-sm text-red-600">{form.errors.stage}</p>
                            )}
                        </div>

                        {/* Conditional Fields based on Report Type */}
                        {reportType === 'growth' ? (
                            /* Growth Report Status */
                            <div>
                                <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                                    Plant Status *
                                </label>
                                <select
                                    value={form.data.status}
                                    onChange={e => form.setData('status', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 font-poppins text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                        form.errors.status ? 'border-red-500' : ''
                                    }`}
                                >
                                    <option value="">Select plant status</option>
                                    <option value="excellent">⭐ Excellent - Optimal growth</option>
                                    <option value="good">👍 Good - Healthy development</option>
                                    <option value="average">↔️ Average - Normal progress</option>
                                    <option value="poor">⚠️ Poor - Needs attention</option>
                                </select>
                                {form.errors.status && (
                                    <p className="mt-2 font-poppins text-sm text-red-600">{form.errors.status}</p>
                                )}
                            </div>
                        ) : (
                            /* Damage Report Fields */
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Damage Type */}
                                <div>
                                    <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                                        Damage Type *
                                    </label>
                                    <select
                                        value={form.data.type_damage}
                                        onChange={e => form.setData('type_damage', e.target.value)}
                                        className={`mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 font-poppins text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                            form.errors.type_damage ? 'border-red-500' : ''
                                        }`}
                                    >
                                        <option value="">Select damage type</option>
                                        <option value="pest">🐛 Pest - Insect or animal damage</option>
                                        <option value="disease">🦠 Disease - Fungal or bacterial</option>
                                        <option value="weather">🌪️ Weather - Storm, hail, drought</option>
                                        <option value="mechanical">🔧 Mechanical - Equipment or human</option>
                                        <option value="other">❓ Other - Unspecified damage</option>
                                    </select>
                                    {form.errors.type_damage && (
                                        <p className="mt-2 font-poppins text-sm text-red-600">{form.errors.type_damage}</p>
                                    )}
                                </div>

                                {/* Severity */}
                                <div>
                                    <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                                        Severity Level *
                                    </label>
                                    <select
                                        value={form.data.severity_damage}
                                        onChange={e => form.setData('severity_damage', e.target.value)}
                                        className={`mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 font-poppins text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                            form.errors.severity_damage ? 'border-red-500' : ''
                                        }`}
                                    >
                                        <option value="">Select severity level</option>
                                        <option value="low">🟢 Low - Minor, localized damage</option>
                                        <option value="medium">🟡 Medium - Moderate, scattered damage</option>
                                        <option value="high">🟠 High - Significant, widespread damage</option>
                                        <option value="critical">🔴 Critical - Severe, crop-threatening</option>
                                    </select>
                                    {form.errors.severity_damage && (
                                        <p className="mt-2 font-poppins text-sm text-red-600">{form.errors.severity_damage}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div>
                            <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                                {reportType === 'growth' ? 'Observations & Notes' : 'Damage Description & Notes'}
                            </label>
                            <textarea
                                value={form.data.notes}
                                onChange={e => form.setData('notes', e.target.value)}
                                rows="6"
                                className={`mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 font-poppins text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                    form.errors.notes ? 'border-red-500' : ''
                                }`}
                                placeholder={
                                    reportType === 'growth' 
                                        ? "Describe plant health, growth patterns, notable observations, or any concerns..."
                                        : "Describe the damage in detail, affected areas, potential causes, and recommended actions..."
                                }
                            />
                            {form.errors.notes && (
                                <p className="mt-2 font-poppins text-sm text-red-600">{form.errors.notes}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-6">
                            <Link
                                href={route(`${reportType === 'growth' ? 'growth-reports.show' : 'damage-reports.show'}`, reportId)}
                                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-poppins text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded-lg bg-[#37692F] px-6 py-3 font-poppins text-sm font-medium text-white transition-colors hover:bg-[#2a5624] disabled:opacity-50"
                            >
                                {form.processing ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Updating...
                                    </span>
                                ) : (
                                    'Update Report'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Field Visit Info */}
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                    <p className="font-poppins text-sm text-gray-600">
                        This report is associated with Field Visit #{report.field_visit_ID || report.field_visit?.field_visit_ID}
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}