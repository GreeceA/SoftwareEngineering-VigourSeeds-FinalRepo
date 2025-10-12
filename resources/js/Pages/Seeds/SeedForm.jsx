import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

export default function SeedForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel = 'Create Seed',
    cancelRoute,
    isEdit = false,
    seedId = null
}) {
    const soilTypes = ['clay', 'sandy', 'loam', 'silty'];

    // Validation states
    const [nameUniqueError, setNameUniqueError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [growthCycleError, setGrowthCycleError] = useState('');
    const [checkingName, setCheckingName] = useState(false);

    // Touched state for required fields
    const [touched, setTouched] = useState({
        seed_variety: false,
        price_per_unit: false,
        growth_cycle: false,
        soil_type: false,
        storage_requirements: false,
    });

    // Format price
    useEffect(() => {
        if (isEdit && data.price_per_unit) {
            const raw = String(data.price_per_unit).replace(/,/g, '');
            const [whole, decimal] = raw.split('.');
            const formatted = Number(whole).toLocaleString() + (decimal !== undefined ? '.' + decimal : '');
            setData('price_per_unit', formatted);
        }
    }, []);

    //  Validation Helpers

    // Empty input helper
    const isFieldRequiredEmpty = (fieldName) => {
        const value = data[fieldName];

        const rawValue = typeof value === 'string' ? value.replace(/,/g, '').trim() : value;
        return touched[fieldName] && (!rawValue || rawValue === 0);
    };

    // Blur handler for required fields
    const handleRequiredBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
    };

    // Helper to get error message
    const getRequiredError = (fieldName) => {
        if (isFieldRequiredEmpty(fieldName)) {
            const label = fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `The ${label} is required.`;
        }
        return null;
    };

    //  Seed Variety Handlers
    const handleSeedVarietyChange = (e) => {
        const value = e.target.value;
        setData('seed_variety', value);
        setNameUniqueError('');
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
                seedId: seedId,
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

    //  Price Handlers 
    const handlePriceChange = (e) => {
        let raw = e.target.value.replace(/,/g, '');
        if (!/^(\d+(\.\d{0,2})?)?$/.test(raw)) return;

        if (raw && parseFloat(raw) > 9999.99) return;

        let formatted = raw;
        if (raw) {
            const [whole, decimal] = raw.split('.');
            formatted = Number(whole).toLocaleString() + (decimal !== undefined ? '.' + decimal : '');
        }

        setData('price_per_unit', formatted);

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

    //  Growth Cycle Handlers 
    const handleGrowthCycleChange = (e) => {
        let value = e.target.value;

        if (!/^\d*$/.test(value)) return;

        value = value === '' ? '' : parseInt(value, 10);

        if (value === '' || value < 0) {
            setData('growth_cycle', '');
            setGrowthCycleError('');
            return;
        }
        if (value > 200) value = 200;

        setData('growth_cycle', value);

        if (value < 60) {
            setGrowthCycleError('The growth cycle must be at least 60 days.');
        } else {
            setGrowthCycleError('');
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        setTouched({
            seed_variety: true,
            price_per_unit: true,
            growth_cycle: true,
            soil_type: true,
            storage_requirements: true,
        });

        if (isSubmitDisabled) {
            return;
        }

        onSubmit(e);
    };

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
        Object.keys(errors).length > 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
                <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
                    Basic Information
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Seed Variety */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Seed Variety *
                        </label>
                        <input
                            type="text"
                            value={data.seed_variety}
                            onChange={handleSeedVarietyChange}
                            onBlur={(e) => { handleRequiredBlur('seed_variety'); checkSeedVarietyUnique(e.target.value); }}
                            className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
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
                        <label className="mb-2 block text-sm font-medium text-gray-700">
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
                                className={`mt-1 block w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                    (getRequiredError('price_per_unit') || priceError || errors.price_per_unit) ? 'border-red-500' : ''
                                }`}
                                placeholder="0.01"
                                required
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Valid range: ₱0.01–₱9,999.99</p>
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
                <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
                    Growing Information
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Growth Cycle */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Growth Cycle (days) *
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            value={data.growth_cycle}
                            onChange={handleGrowthCycleChange}
                            onBlur={() => handleRequiredBlur('growth_cycle')}
                            className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                (getRequiredError('growth_cycle') || growthCycleError || errors.growth_cycle) ? 'border-red-500' : ''
                            }`}
                            placeholder="e.g., 90"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">Valid range: 60–200 days</p>
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
                        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="soil_type">
                            Soil Type *
                        </label>
                        <select
                            id="soil_type"
                            value={data.soil_type}
                            onChange={(e) => { setData('soil_type', e.target.value); if (e.target.value) handleRequiredBlur('soil_type'); }}
                            onBlur={() => handleRequiredBlur('soil_type')}
                            className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
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
                        {getRequiredError('soil_type') && (
                            <p className="mt-1 text-sm text-red-600">{getRequiredError('soil_type')}</p>
                        )}
                        {(!getRequiredError('soil_type') && errors.soil_type) && (
                            <p className="mt-1 text-sm text-red-600">{errors.soil_type}</p>
                        )}
                    </div>

                    {/* Storage Requirements */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Storage Requirements *
                        </label>
                        <input
                            type="text"
                            value={data.storage_requirements}
                            onChange={(e) => setData('storage_requirements', e.target.value)}
                            onBlur={() => handleRequiredBlur('storage_requirements')}
                            className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                (getRequiredError('storage_requirements') || errors.storage_requirements) ? 'border-red-500' : ''
                            }`}
                            placeholder="e.g., Cool, dry place; Refrigerate; Room temperature"
                            required
                        />
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
                <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
                    Additional Information
                </h2>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Notes (Optional)
                    </label>
                    <textarea
                        rows="4"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                            errors.notes ? 'border-red-500' : ''
                        }`}
                        placeholder="Any additional notes about this seed variety..."
                    />
                    {errors.notes && (
                        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                    )}
                </div>
            </div>

            {/* Button Actions */}
            <div className="flex justify-end space-x-2 pt-4">
                <Link
                    href={cancelRoute}
                    className="rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-400"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="rounded-md bg-[#37692F] px-4 py-2 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#2a5624]"
                >
                    {processing ? `${isEdit ? 'Updating' : 'Creating'}...` : submitLabel}
                </button>
            </div>
        </form>
    );
}