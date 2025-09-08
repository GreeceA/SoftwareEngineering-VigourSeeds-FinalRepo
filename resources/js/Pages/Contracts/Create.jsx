import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import dayjs from 'dayjs';

export default function Create({ auth, partners, seeds }) {
    const fileInputRef = useRef();
    const [selectedSeeds, setSelectedSeeds] = useState([]);
    const [partnerSearch, setPartnerSearch] = useState('');
    const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        partner_id: '',
        contract_date: '',
        effective_date: '',
        expiration_date: '',
        notes: '',
        contract_file: null,
        seeds: [],
    });

    useEffect(() => {
        // When effective_date or expiration_date changes, update cycles for all seeds
        const updatedSeeds = selectedSeeds.map(seed => {
            const maxCycles = getMaxCycles(seed);
            let cycles = seed.cycles;
            if (cycles > maxCycles) cycles = maxCycles > 0 ? maxCycles : 1;
            return { ...seed, cycles };
        });
        setSelectedSeeds(updatedSeeds);
        updateFormSeeds(updatedSeeds);
        // eslint-disable-next-line
    }, [data.effective_date, data.expiration_date]);

    const filteredPartners = partners.filter(partner =>
        partner.name.toLowerCase().includes(partnerSearch.toLowerCase())
    );

    const handlePartnerSelect = (partner) => {
        setData('partner_id', partner.id);
        setPartnerSearch(partner.name);
        setShowPartnerDropdown(false);
    };

    const handleSeedSelection = (seed) => {
        if (selectedSeeds.length >= 3) {
            alert('Maximum 3 seed varieties allowed');
            return;
        }
        if (selectedSeeds.find(s => s.id === seed.id)) {
            return; // Already selected
        }
        const newSeed = {
            ...seed,
            growth_cycle: Number(seed.growth_cycle),
            quantity: 1,
            unit: 'kg',
            expected_harvest_date: '',
            cycles: 1,
        };
        const updatedSeeds = [...selectedSeeds, newSeed];
        setSelectedSeeds(updatedSeeds);
        updateFormSeeds(updatedSeeds);
    };

    const removeSeed = (seedId) => {
        const updatedSeeds = selectedSeeds.filter(s => s.id !== seedId);
        setSelectedSeeds(updatedSeeds);
        updateFormSeeds(updatedSeeds);
    };

    // --- Seed Rules Logic ---
    // Earliest allowed harvest: effective_date + growth_cycle
    const getHarvestMin = (seed, display = false) => {
        if (!data.effective_date || !seed.growth_cycle) return '';
        // Must be after both contract_date and effective_date + growth_cycle
        const minByGrowth = dayjs(data.effective_date).add(Number(seed.growth_cycle), 'day');
        const minByContract = data.contract_date ? dayjs(data.contract_date).add(1, 'day') : minByGrowth;
        const minDate = minByGrowth.isAfter(minByContract) ? minByGrowth : minByContract;
        return display ? minDate.format('DD/MM/YYYY') : minDate.format('YYYY-MM-DD');
    };

    const getHarvestMax = () => {
        if (!data.expiration_date) return '';
        // 7 days before expiration date
        return dayjs(data.expiration_date).subtract(7, 'day').format('YYYY-MM-DD');
    };

    // Cycles calculation: floor(numOfDays / growth_cycle), must be >= 1
    const getMaxCycles = (seed) => {
        const growthCycle = Number(seed.growth_cycle);
        if (
            !data.effective_date ||
            !seed.expected_harvest_date ||
            !growthCycle ||
            isNaN(growthCycle) ||
            growthCycle <= 0
        ) return 1;
        const numOfDays = dayjs(seed.expected_harvest_date).diff(dayjs(data.effective_date), 'day');
        const maxCycles = Math.floor(numOfDays / growthCycle);
            console.log('effective:', data.effective_date, 'harvest:', seed.expected_harvest_date, 'numOfDays:', numOfDays, 'growth:', growthCycle, 'maxCycles:', maxCycles);

        return maxCycles > 0 ? maxCycles : 1;
    };

    // Validation for each seed
    const validateSeed = (seed) => {
        const errors = [];
        if (!data.effective_date || !data.expiration_date || !seed.expected_harvest_date || !seed.growth_cycle) return errors;

        const harvestDate = dayjs(seed.expected_harvest_date);
        const effectiveDate = dayjs(data.effective_date);
        const expirationDate = dayjs(data.expiration_date);
        const growthCycle = Number(seed.growth_cycle);
        const numOfDays = harvestDate.diff(effectiveDate, 'day');
        const maxCycles = getMaxCycles(seed);

        if (numOfDays < growthCycle) {
            errors.push(`Expected harvest must be at least ${growthCycle} days after effective date.`);
        }
        if (harvestDate.isAfter(expirationDate)) {
            errors.push('Expected harvest cannot be after expiration date.');
        }
        if (maxCycles < 1) {
            errors.push('Configuration invalid: not enough time for one cycle.');
        }
        if (seed.cycles > maxCycles) {
            errors.push(`Cycles cannot exceed ${maxCycles}.`);
        }
        if (seed.cycles < 1) {
            errors.push('Cycles must be at least 1.');
        }
        return errors;
    };
    // --- End Seed Rules Logic ---

    const updateSeedData = (seedId, field, value) => {
        const updatedSeeds = selectedSeeds.map(seed => {
            if (seed.id === seedId) {
                let updatedSeed = { ...seed, [field]: value };
                if (
                    field === 'expected_harvest_date' ||
                    field === 'growth_cycle' ||
                    field === 'effective_date'
                ) {
                    const maxCycles = getMaxCycles({ ...updatedSeed, [field]: value });
                    // Always preset cycles to maxCycles when expected_harvest_date changes
                    updatedSeed.cycles = maxCycles;
                }
                if (field === 'cycles') {
                    // Clamp cycles to valid range
                    const maxCycles = getMaxCycles(updatedSeed);
                    if (value > maxCycles) updatedSeed.cycles = maxCycles;
                    if (value < 1 || isNaN(value)) updatedSeed.cycles = 1;
                }
                return updatedSeed;
            }
            return seed;
        });
        setSelectedSeeds(updatedSeeds);
        updateFormSeeds(updatedSeeds);
    };

    const updateFormSeeds = (seedsArray) => {
        setData('seeds', seedsArray.map(seed => ({
            seed_id: seed.id,
            quantity: seed.quantity,
            unit: seed.unit,
            expected_harvest_date: seed.expected_harvest_date,
            cycles: seed.cycles,
        })));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contracts.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create Contract
                    </h2>
                    <Link
                        href={route('contracts.index')}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
                    >
                        Back to Contracts
                    </Link>
                </div>
            }
        >
            <Head title="Create Contract" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contract Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                {/* Partner */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Partner *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={partnerSearch}
                                            onChange={(e) => {
                                                setPartnerSearch(e.target.value);
                                                setShowPartnerDropdown(true);
                                                if (!e.target.value) setData('partner_id', '');
                                            }}
                                            onFocus={() => setShowPartnerDropdown(true)}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Search by partner's name..."
                                            required
                                        />
                                    </div>
                                    {showPartnerDropdown && filteredPartners.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                            {filteredPartners.map((partner) => (
                                                <div
                                                    key={partner.id}
                                                    onClick={() => handlePartnerSelect(partner)}
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {partner.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.partner_id && <p className="text-red-500 text-xs mt-1">{errors.partner_id}</p>}
                                </div>

                                {/* Contract Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contract Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.contract_date}
                                        onChange={(e) => setData('contract_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        min={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // today - 7 days
                                        max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // today + 7 days
                                    />
                                    {errors.contract_date && <p className="text-red-500 text-xs mt-1">{errors.contract_date}</p>}
                                </div>

                                {/* Effective Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Effective Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.effective_date}
                                        onChange={(e) => setData('effective_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min={data.contract_date || undefined}
                                    />
                                    {errors.effective_date && <p className="text-red-500 text-xs mt-1">{errors.effective_date}</p>}
                                </div>

                                {/* Expiration Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expiration Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.expiration_date}
                                        onChange={(e) => setData('expiration_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min={
                                            [data.contract_date, data.effective_date]
                                                .filter(Boolean)
                                                .sort()
                                                .reverse()[0] || undefined
                                        }
                                    />
                                    {errors.expiration_date && <p className="text-red-500 text-xs mt-1">{errors.expiration_date}</p>}
                                </div>

                                {/* Contract File */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contract File
                                    </label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => setData('contract_file', e.target.files[0])}
                                        accept=".pdf,.doc,.docx"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.contract_file && <p className="text-red-500 text-xs mt-1">{errors.contract_file}</p>}
                                </div>

                                {/* Notes */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                                </div>
                            </div>

                            {/* Seeds Selection */}
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Seed Varieties (1-3 required)</h3>
                                
                                {/* Seed Selector */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Add Seed Variety
                                    </label>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                const seed = seeds.find(s => s.id == e.target.value);
                                                handleSeedSelection(seed);
                                                e.target.value = '';
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={selectedSeeds.length >= 3}
                                    >
                                        <option value="">Select a seed variety...</option>
                                        {seeds.filter(seed => !selectedSeeds.find(s => s.id === seed.id)).map((seed) => (
                                            <option key={seed.id} value={seed.id}>
                                                {seed.seed_variety} - ₱{seed.price_per_unit} (Growth: {seed.growth_cycle} days)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Selected Seeds */}
                                <div className="space-y-4">
                                    {selectedSeeds.map((seed, index) => (
                                        <div key={seed.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{seed.seed_variety}</h4>
                                                    <p className="text-xs text-gray-500">
                                                        Growth cycle: {seed.growth_cycle ? `${seed.growth_cycle} days` : 'N/A'} | Price: ₱{seed.price_per_unit}
                                                        {data.effective_date && seed.expected_harvest_date && (
                                                            <span> | Max cycles: {getMaxCycles(seed)}</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSeed(seed.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Quantity *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={seed.quantity}
                                                        onChange={(e) => updateSeedData(seed.id, 'quantity', parseInt(e.target.value) || 1)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Unit *
                                                    </label>
                                                    <select
                                                        value={seed.unit}
                                                        onChange={(e) => updateSeedData(seed.id, 'unit', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        required
                                                    >
                                                        <option value="kg">kg</option>
                                                        <option value="sack">sack</option>
                                                        <option value="ton">ton</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Expected Harvest *
                                                        {data.effective_date && seed.growth_cycle && (
                                                            <span className="block text-xs text-gray-500">
                                                                Min: {getHarvestMin(seed, true)}
                                                            </span>
                                                        )}
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={seed.expected_harvest_date}
                                                        min={getHarvestMin(seed)}
                                                        max={getHarvestMax()}
                                                        onChange={(e) => updateSeedData(seed.id, 'expected_harvest_date', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        required
                                                    />
                                                    {validateSeed(seed).map((err, idx) => (
                                                        <p key={idx} className="text-red-500 text-xs mt-1">{err}</p>
                                                    ))}
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Cycles *
                                                        {data.effective_date && seed.expected_harvest_date && seed.growth_cycle && (
                                                            <span className="block text-xs text-gray-500">
                                                                Max: {getMaxCycles(seed)}
                                                            </span>
                                                        )}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={getMaxCycles(seed)}
                                                        value={seed.cycles}
                                                        onChange={(e) => updateSeedData(seed.id, 'cycles', parseInt(e.target.value) || 1)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        required
                                                    />
                                                    {seed.cycles > getMaxCycles(seed) && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            Cycles cannot exceed {getMaxCycles(seed)}.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {errors.seeds && <p className="text-red-500 text-sm mt-2">{errors.seeds}</p>}
                                {selectedSeeds.length === 0 && (
                                    <p className="text-gray-500 text-sm mt-2">Please select at least one seed variety.</p>
                                )}
                                {selectedSeeds.length >= 3 && (
                                    <p className="text-amber-600 text-sm mt-2">Maximum of 3 seed varieties allowed.</p>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                                <Link
                                    href={route('contracts.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || selectedSeeds.length === 0}
                                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating...' : 'Create Contract'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}