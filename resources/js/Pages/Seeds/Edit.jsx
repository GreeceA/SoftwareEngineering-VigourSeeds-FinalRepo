import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ seed }) {
    const { data, setData, put, processing, errors } = useForm({
        seed_variety: seed.seed_variety || '',
        status: seed.status || 'active',
        price_per_unit: seed.price_per_unit || '',
        growth_cycle: seed.growth_cycle || '',
        storage_requirements: seed.storage_requirements || '',
        soil_type_preference: seed.soil_type_preference || '',
        notes: seed.notes || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('seeds.update', seed.id));
    };

    return (
        <>
            <Head title={`Edit ${seed.seed_variety}`} />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('seeds.index')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← Back to Seeds
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Seed</h1>
                        <p className="text-gray-600 mt-2">Update the details for {seed.seed_variety}</p>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Seed Variety *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.seed_variety}
                                            onChange={(e) => setData('seed_variety', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.seed_variety ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="e.g., Cherry, Beefsteak"
                                        />
                                        {errors.seed_variety && (
                                            <p className="text-red-500 text-sm mt-1">{errors.seed_variety}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status *
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.status ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="active">Active</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price Per Unit *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.price_per_unit}
                                                onChange={(e) => setData('price_per_unit', e.target.value)}
                                                className={`w-full border rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                    errors.price_per_unit ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.price_per_unit && (
                                            <p className="text-red-500 text-sm mt-1">{errors.price_per_unit}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Growing Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Growing Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Growth Cycle *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.growth_cycle}
                                            onChange={(e) => setData('growth_cycle', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.growth_cycle ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="e.g., 90 days, 3 months"
                                        />
                                        {errors.growth_cycle && (
                                            <p className="text-red-500 text-sm mt-1">{errors.growth_cycle}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Soil Type Preference *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.soil_type_preference}
                                            onChange={(e) => setData('soil_type_preference', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.soil_type_preference ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="e.g., Loamy, Sandy, Clay"
                                        />
                                        {errors.soil_type_preference && (
                                            <p className="text-red-500 text-sm mt-1">{errors.soil_type_preference}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Storage Requirements *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.storage_requirements}
                                            onChange={(e) => setData('storage_requirements', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.storage_requirements ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="e.g., Cool, dry place; Refrigerate; Room temperature"
                                        />
                                        {errors.storage_requirements && (
                                            <p className="text-red-500 text-sm mt-1">{errors.storage_requirements}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                            errors.notes ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Any additional notes about this seed variety..."
                                    />
                                    {errors.notes && (
                                        <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Updating...' : 'Update Seed'}
                                </button>
                                <Link
                                    href={route('seeds.index')}
                                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}