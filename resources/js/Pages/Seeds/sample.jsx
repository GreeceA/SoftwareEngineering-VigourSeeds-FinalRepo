import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

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

    // Validation states
    const [nameUniqueError, setNameUniqueError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [growthCycleError, setGrowthCycleError] = useState('');
    const [checkingName, setCheckingName] = useState(false);

    // NEW: Touched state for required fields
    const [touched, setTouched] = useState({
        seed_variety: false,
        price_per_unit: false,
        growth_cycle: false,
        soil_type: false,
        storage_requirements: false,
    });

    // Helper to check if a required field is touched and empty
    const isFieldRequiredEmpty = (fieldName) => {
        const value = data[fieldName];
        // Handle number/string consistency: remove formatting for true emptiness check
        const rawValue = typeof value === 'string' ? value.replace(/,/g, '').trim() : value;
        
        return touched[fieldName] && (!rawValue || rawValue === 0);
    };

    // Generic blur handler for required fields
    const handleRequiredBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
    };

    // --- Seed Variety Handlers ---
    const handleSeedVarietyChange = (e) => {
        const value = e.target.value;
        setData('seed_variety', value);
        setNameUniqueError('');
        // Remove required error border immediately on change if touched
        if (touched.seed_variety && value.trim()) {
            // (No need to update state, isFieldRequiredEmpty handles display)
        }
        checkSeedVarietyUnique(value);
    };

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
                    "A seed variety with this name already exists. Please enter a different variety name."
                );
            }
        }
        setCheckingName(false);
    };
    // -------------------------------------------------------------------------

    // --- Price Handlers ---
    const handlePriceChange = (e) => {
        let raw = e.target.value.replace(/,/g, '');
        if (!/^(\d+(\.\d{0,2})?)?$/.test(raw)) return;

        // Prevent input above 9999.99
        if (raw && parseFloat(raw) > 9999.99) return;

        let formatted = raw;
        if (raw) {
            const [whole, decimal] = raw.split('.');
            formatted = Number(whole).toLocaleString() + (decimal !== undefined ? '.' + decimal : '');
        }

        setData('price_per_unit', formatted);

        // Range Validation
        if (!raw || raw === '') {
            setPriceError('');
            return;
        }
        const value = parseFloat(raw);
        if (value < 0.01) {
            setPriceError('The price must be greater than zero.');
        } else {
            setPriceError('');
        }
    };

    // --- Growth Cycle Handlers ---
    const handleGrowthCycleChange = (e) => {
        let value = e.target.value;

        // Prevent non-numeric input
        if (!/^\d*$/.test(value)) return;

        // Convert to integer if not empty
        value = value === '' ? '' : parseInt(value, 10);

        // Prevent negative and values above 200
        if (value === '' || value < 0) {
            setData('growth_cycle', '');
            setGrowthCycleError('');
            return;
        }
        if (value > 200) value = 200;

        setData('growth_cycle', value);

        // Validation for below 60
        if (value < 60) {
            setGrowthCycleError('The growth cycle must be at least 60 days.');
        } else {
            setGrowthCycleError('');
        }
    };
        
    // --- Submit Handler ---
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Mark all required fields as touched on submit attempt
        setTouched({
            seed_variety: true,
            price_per_unit: true,
            growth_cycle: true,
            soil_type: true,
            storage_requirements: true,
        });

        // Check if any required field is empty or has a custom error
        if (isSubmitDisabled) {
            return;
        }

        post(route('seeds.store'));
    };

    // --- Button Disabled Logic ---
    const isAnyRequiredFieldEmpty = 
        isFieldRequiredEmpty('seed_variety') ||
        isFieldRequiredEmpty('price_per_unit') ||
        isFieldRequiredEmpty('growth_cycle') ||
        isFieldRequiredEmpty('soil_type') ||
        isFieldRequiredEmpty('storage_requirements');

    const isSubmitDisabled =
        processing ||
        checkingName ||
        !!nameUniqueError ||
        !!priceError ||
        !!growthCycleError ||
        isAnyRequiredFieldEmpty ||
        Object.keys(errors).length > 0; // Disable if server validation errors exist

    // Helper to get the required error message
    const getRequiredError = (fieldName) => {
        if (isFieldRequiredEmpty(fieldName)) {
            const label = fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `The ${label} is required.`;
        }
        return null;
    };
    
    // -------------------------------------------------------------------------

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Create Corn Seed</span>
                </h2>
            }
        >
            <Head title="Create Corn Seed" />

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
                                {/* Seed Variety */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Seed Variety *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.seed_variety}
                                        onChange={handleSeedVarietyChange}
                                        onBlur={(e) => { handleRequiredBlur('seed_variety'); checkSeedVarietyUnique(e.target.value); }}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                            (getRequiredError('seed_variety') || nameUniqueError || errors.seed_variety) ? 'border-red-500' : ''
                                        }`}
                                        placeholder="e.g., Cherry, Beefsteak"
                                        required
                                    />
                                    {getRequiredError('seed_variety') && (
                                        <p className="mt-1 text-sm text-red-600">{getRequiredError('seed_variety')}</p>
                                    )}
                                    {(!getRequiredError('seed_variety') && nameUniqueError) && (
                                        <p className="mt-1 text-sm text-red-600">{nameUniqueError}</p>
                                    )}
                                    {(!getRequiredError('seed_variety') && !nameUniqueError && errors.seed_variety) && (
                                        <p className="mt-1 text-sm text-red-600">{errors.seed_variety}</p>
                                    )}
                                </div>

                                {/* Price Per Unit */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Per Unit *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">₱</span>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={data.price_per_unit}
                                            onChange={handlePriceChange}
                                            onBlur={() => handleRequiredBlur('price_per_unit')}
                                            className={`mt-1 block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                                (getRequiredError('price_per_unit') || priceError || errors.price_per_unit) ? 'border-red-500' : ''
                                            }`}
                                            placeholder="0.01"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Valid range: ₱0.01–₱9,999.99</p>
                                    
                                    {/* Display errors prioritized: Required > Custom Range > Laravel */}
                                    {getRequiredError('price_per_unit') && (
                                        <p className="mt-1 text-sm text-red-600">{getRequiredError('price_per_unit')}</p>
                                    )}
                                    {(!getRequiredError('price_per_unit') && priceError) && (
                                        <p className="mt-1 text-sm text-red-600">{priceError}</p>
                                    )}
                                    {(!getRequiredError('price_per_unit') && !priceError && errors.price_per_unit) && (
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
                                {/* Growth Cycle */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Growth Cycle (days) *
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        value={data.growth_cycle}
                                        onChange={handleGrowthCycleChange}
                                        onBlur={() => handleRequiredBlur('growth_cycle')}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                                (getRequiredError('growth_cycle') || growthCycleError || errors.growth_cycle) ? 'border-red-500' : ''
                                            }`}
                                        placeholder="e.g., 90"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Valid range: 60–200 days</p>
                                    
                                    {/* Display errors prioritized: Required > Custom Range > Laravel */}
                                    {getRequiredError('growth_cycle') && (
                                        <p className="mt-1 text-sm text-red-600">{getRequiredError('growth_cycle')}</p>
                                    )}
                                    {(!getRequiredError('growth_cycle') && growthCycleError) && (
                                        <p className="mt-1 text-sm text-red-600">{growthCycleError}</p>
                                    )}
                                    {(!getRequiredError('growth_cycle') && !growthCycleError && errors.growth_cycle) && (
                                        <p className="mt-1 text-sm text-red-600">{errors.growth_cycle}</p>
                                    )}
                                </div>

                                {/* Soil Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="soil_type">
                                        Soil Type *
                                    </label>
                                    <select
                                        id="soil_type"
                                        value={data.soil_type}
                                        onChange={(e) => { setData('soil_type', e.target.value); if (e.target.value) setTouched(t => ({ ...t, soil_type: true })); }}
                                        onBlur={() => handleRequiredBlur('soil_type')}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                            (getRequiredError('soil_type') || errors.soil_type) ? 'border-red-500' : ''
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
                                    
                                    {/* Display errors prioritized: Required > Laravel */}
                                    {getRequiredError('soil_type') && (
                                        <p className="mt-1 text-sm text-red-600">{getRequiredError('soil_type')}</p>
                                    )}
                                    {(!getRequiredError('soil_type') && errors.soil_type) && (
                                        <p className="mt-1 text-sm text-red-600">{errors.soil_type}</p>
                                    )}
                                </div>

                                {/* Storage Requirements */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Storage Requirements *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.storage_requirements}
                                        onChange={(e) => setData('storage_requirements', e.target.value)}
                                        onBlur={() => handleRequiredBlur('storage_requirements')}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                            (getRequiredError('storage_requirements') || errors.storage_requirements) ? 'border-red-500' : ''
                                        }`}
                                        placeholder="e.g., Cool, dry place; Refrigerate; Room temperature"
                                        required
                                    />
                                    
                                    {/* Display errors prioritized: Required > Laravel */}
                                    {getRequiredError('storage_requirements') && (
                                        <p className="mt-1 text-sm text-red-600">{getRequiredError('storage_requirements')}</p>
                                    )}
                                    {(!getRequiredError('storage_requirements') && errors.storage_requirements) && (
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
                                disabled={isSubmitDisabled}
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
