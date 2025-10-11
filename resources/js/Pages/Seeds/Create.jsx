import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios'; // Import axios for uniqueness check

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        seed_variety: '',
        status: 'active',
        price_per_unit: '',
        growth_cycle: '',
        storage_requirements: '',
        soil_type: '', 
        notes: ''
    });

    const soilTypes = ['clay', 'sandy', 'loam', 'silty'];
    
    // New states for uniqueness check (similar to PartnerForm)
    const [nameUniqueError, setNameUniqueError] = useState('');
    const [checkingName, setCheckingName] = useState(false);
    const [nameTouched, setNameTouched] = useState(false);

    // --- Uniqueness Check Handler (Similar to handleNameBlur in PartnerForm) ---
    const checkSeedVarietyUnique = async (variety) => {
        if (!variety.trim()) {
            setNameUniqueError('');
            setCheckingName(false);
            return;
        }
        setCheckingName(true);
        try {
            await axios.post(route('seeds.checkVariety'), { 
                seed_variety: variety.trim(),
                seedId: null,
            });
            setNameUniqueError('');
        } catch (err) {
            if (err.response?.status === 422) {
                setNameUniqueError(
                    err.response.data.errors?.seed_variety?.[0] ||
                    'The seed variety is already registered.'
                );
            }
        }
        setCheckingName(false);
    };

    // -------------------------------------------------------------------------

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Final check before submitting. Stop if there are unique errors.
        if (nameUniqueError) {
            // Ensure the user sees the error if they haven't blurred yet
            setNameTouched(true); 
            return;
        }

        post(route('seeds.store'));
    };

    const isSubmitDisabled = processing || checkingName || !!nameUniqueError;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Create Seed</span>
                </h2>
            }
        >
            <Head title="Create Seed" />
            
            <div className="p-6">
                {/* Breadcrumb */}
                <div className="px-6 pt-6">
                    <nav className="text-sm text-gray-600">
                        <Link
                            href={route('dashboard')} 
                            className="text-[#37692F] hover:underline"
                        >
                            Home
                        </Link>{" "}
                        / <Link href={route('seeds.index')} className="text-[#37692F] hover:underline">Seeds</Link> / <span>Create Seed</span>
                    </nav>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                        Create New Seed
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Seed Variety *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.seed_variety}
                                        onChange={(e) => {
                                            setData('seed_variety', e.target.value);
                                            setNameUniqueError(''); // Clear unique error on change
                                            checkSeedVarietyUnique(e.target.value); // Check uniqueness on change
                                        }}
                                        onBlur={checkSeedVarietyUnique} // Added uniqueness check on blur
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                            (errors.seed_variety || nameUniqueError) ? 'border-red-500' : ''
                                        }`}
                                        placeholder="e.g., Cherry, Beefsteak"
                                        required
                                    />
                                    {/* Display unique error or Laravel validation error */}
                                    {(errors.seed_variety || nameUniqueError) && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {nameUniqueError || errors.seed_variety}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Per Unit *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">₱</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01" 
                                            value={data.price_per_unit}
                                            onChange={(e) => setData('price_per_unit', e.target.value)}
                                            className={`mt-1 block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                                errors.price_per_unit ? 'border-red-500' : ''
                                            }`}
                                            placeholder="0.01"
                                            required
                                        />
                                    </div>
                                    {errors.price_per_unit && (
                                        <p className="mt-1 text-sm text-red-600">{errors.price_per_unit}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Growing Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                Growing Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Growth Cycle (days) *
                                    </label>
                                    <input
                                        type="number"
                                        min="10" 
                                        value={data.growth_cycle}
                                        onChange={(e) => setData('growth_cycle', e.target.value)}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                            errors.growth_cycle ? 'border-red-500' : ''
                                        }`}
                                        placeholder="e.g., 90"
                                        required
                                    />
                                    {errors.growth_cycle && (
                                        <p className="mt-1 text-sm text-red-600">{errors.growth_cycle}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="soil_type">
                                        Soil Type *
                                    </label>
                                    <select
                                        id="soil_type"
                                        value={data.soil_type}
                                        onChange={(e) => setData('soil_type', e.target.value)}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                            errors.soil_type ? 'border-red-500' : ''
                                        }`}
                                        required
                                    >
                                        <option value="" disabled>Select a soil type</option>
                                        {soilTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.soil_type && (
                                        <p className="mt-1 text-sm text-red-600">{errors.soil_type}</p>
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
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                            errors.storage_requirements ? 'border-red-500' : ''
                                        }`}
                                        placeholder="e.g., Cool, dry place; Refrigerate; Room temperature"
                                        required
                                    />
                                    {errors.storage_requirements && (
                                        <p className="mt-1 text-sm text-red-600">{errors.storage_requirements}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                Additional Information
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    rows="4"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                        errors.notes ? 'border-red-500' : ''
                                    }`}
                                    placeholder="Any additional notes about this seed variety..."
                                />
                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-2 pt-4">
                            <Link
                                href={route('seeds.index')}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitDisabled} // Use the combined disabled state
                                className="bg-[#37692F] hover:bg-[#2a5624] text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Creating...' : 'Create Seed'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}