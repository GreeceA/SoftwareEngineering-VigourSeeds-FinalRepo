import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/solid';

const ShowGrowthModal = ({ open, form, onSubmit, onClose }) => {
    if (!open) return null;

    // Check if all required fields are filled
    const isFormValid = form.data.stage && form.data.status && form.data.notes?.trim();

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                {/* Header with Icon */}
                <div className="mb-4 flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <ChartBarIcon className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="mt-3 text-center font-poppins text-xl font-semibold text-gray-800">
                        Add Growth Report
                    </h3>
                    <p className="mt-1 text-center font-poppins text-sm text-gray-500">
                        Track plant development progress
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

                    {/* Status Selection */}
                    <div>
                        <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                            Plant Status *
                        </label>
                        <select
                            value={form.data.status}
                            onChange={(e) => form.setData('status', e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 font-poppins text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
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

                    {/* Notes */}
                    <div>
                        <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
                            Observations & Notes *
                        </label>
                        <textarea
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            required
                            rows="4"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 font-poppins text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                            placeholder="Describe plant health, growth patterns, notable observations, or any concerns..."
                        />
                        {form.errors.notes && (
                            <p className="mt-2 font-poppins text-sm text-red-600">{form.errors.notes}</p>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <p className="text-center font-poppins text-xs font-medium text-blue-800">
                            💡 Tip: Provide detailed observations to track growth patterns effectively
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex justify-center space-x-4">
                        <button
                            onClick={onSubmit}
                            disabled={form.processing || !isFormValid}
                            className="flex-1 rounded-lg bg-[#37692F] px-5 py-3 font-poppins text-sm font-medium text-white transition-colors hover:bg-[#2a5624] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {form.processing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                'Save Growth Report'
                            )}
                        </button>

                        <button
                            onClick={() => {
                                onClose();
                                form.reset();
                            }}
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

export default ShowGrowthModal;