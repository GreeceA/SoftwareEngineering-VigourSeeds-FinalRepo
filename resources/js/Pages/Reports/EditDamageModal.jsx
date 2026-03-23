import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const EditDamageModal = ({ open, form, onSubmit, onClose }) => {
    if (!open) return null;

    const isFormValid = form.data.stage && form.data.type_damage && form.data.severity_damage && form.data.notes?.trim();

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                {/* Header with Icon */}
                <div className="mb-4 flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                    </div>
                    <h3 className="mt-3 text-center font-poppins text-xl font-semibold text-gray-800">
                        Edit Damage Report
                    </h3>
                    <p className="mt-1 text-center font-poppins text-sm text-gray-500">
                        Update damage documentation and issues
                    </p>
                </div>

                <div className="space-y-5">
                    {/* Stage Selection */}
                    <div>
                        <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                            Growth Stage *
                        </label>
                        <select
                            value={form.data.stage}
                            onChange={(e) => form.setData('stage', e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 font-poppins text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
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

                    {/* Damage Type */}
                    <div>
                        <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                            Damage Type *
                        </label>
                        <select
                            value={form.data.type_damage}
                            onChange={(e) => form.setData('type_damage', e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 font-poppins text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
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
                            onChange={(e) => form.setData('severity_damage', e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 font-poppins text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
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

                    {/* Notes */}
                    <div>
                        <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                            Damage Description & Notes *
                        </label>
                        <textarea
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            required
                            rows="4"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 font-poppins text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                            placeholder="Describe the damage in detail, affected areas, potential causes, and recommended actions..."
                        />
                        {form.errors.notes && (
                            <p className="mt-2 font-poppins text-sm text-red-600">{form.errors.notes}</p>
                        )}
                    </div>

                    {/* Warning Box */}
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                        <p className="text-center font-poppins text-xs font-medium text-orange-800">
                            ⚠️ Important: Accurate damage reporting helps in timely intervention and crop protection
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex justify-center space-x-4">
                        <button
                            onClick={onSubmit}
                            disabled={form.processing || !isFormValid}
                            className="flex-1 rounded-lg bg-orange-600 px-5 py-3 font-poppins text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                                'Update Damage Report'
                            )}
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 font-poppins text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditDamageModal;