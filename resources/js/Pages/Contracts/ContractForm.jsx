import React, { useState, useRef, useEffect } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import axios from 'axios';

export default function ContractForm({ partners, seeds, contract = null }) {

    // --- PRIMARY STATE & REFS ---

    const fileInputRef = useRef();

    const initialSeeds = contract?.contractSeedCommitments
        ? contract.contractSeedCommitments.map(item => ({
            seed_id: item.seed_id, // always use commitment's seed_id
            seed_variety: item.seed.seed_variety,
            growth_cycle: item.seed.growth_cycle,
            price_per_unit: item.seed.price_per_unit,
            seed_quantity: item.seed_quantity,
            unit: item.unit,
            seed_price_at_contract: item.seed_price_at_contract,
            planting_date: item.planting_date,
            expected_first_harvest_date: item.expected_first_harvest_date,
            agreed_cycles: item.agreed_cycles,
            expected_buyback_amount: item.expected_buyback_amount,
            buyback_unit: item.buyback_unit,
            id: item.id,
        }))
        : [];

    const { data, setData, post, put, processing, errors } = useForm({
        contract_name: contract?.contract_name || '',
        partner_id: contract?.partner_id || '',
        farm_id: contract?.farm_id || '',
        signing_date: contract?.signing_date || dayjs().format('YYYY-MM-DD'),
        effective_date: contract?.effective_date || '',
        expiration_date: contract?.expiration_date || '',
        buyback_price_per_unit: contract?.buyback_price_per_unit || '',
        notes: contract?.notes || '',
        contract_file: null,
        seeds: initialSeeds,
    });

    

    const toKg = (amount, unit) => {
        if (unit === 'kg') return Number(amount);
        if (unit === 'sack') return Number(amount) * 50;
        if (unit === 'ton') return Number(amount) * 1000;
        return Number(amount);
    };

    const totalReceivedBuyback = contract?.buyback_transactions
        ? contract.buyback_transactions.reduce((sum, tx) => sum + toKg(tx.qty, tx.unit), 0)
        : 0;

    // --- UI STATE (useState) ---

    const [selectedSeeds, setSelectedSeeds] = useState(initialSeeds);
    const [partnerSearch, setPartnerSearch] = useState(contract?.partner?.name || '');
    const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
    const [seedSearch, setSeedSearch] = useState('');
    const [showSeedDropdown, setShowSeedDropdown] = useState(false);

    const [checkingContractName, setCheckingContractName] = useState(false);
    const [contractNameUniqueError, setContractNameUniqueError] = useState('');

    const [fieldErrors, setFieldErrors] = useState({
        contract_name: '',
        partner_id: '',
        farm_id: '',
        signing_date: '',
        effective_date: '',
        expiration_date: '',
        contract_file: '',
    });

    const [seedSelectionError, setSeedSelectionError] = useState('');
    const [seedQuantityErrors, setSeedQuantityErrors] = useState({});
    const [expectedBuybackErrors, setExpectedBuybackErrors] = useState({});
    const [buybackPriceError, setBuybackPriceError] = useState('');

    // --- DERIVED STATE & MEMOS ---

    const isEditing = !!contract;

    const selectedFarm = React.useMemo(() => {
        const partner = partners.find(p => p.id === Number(data.partner_id));
        return partner?.farms?.find(f => f.id === Number(data.farm_id));
    }, [partners, data.partner_id, data.farm_id]);

    const filteredPartners = partners.filter(partner =>
        partner.name.toLowerCase().includes(partnerSearch.toLowerCase())
    );

    const filteredSeeds = seeds.filter(seed =>
        selectedFarm &&
        seed.soil_type === selectedFarm.soil_type &&
        seed.status?.toLowerCase() === 'active' &&
        seed.seed_variety.toLowerCase().includes(seedSearch.toLowerCase())
    );

    // Date Limits
    const today = dayjs().format('YYYY-MM-DD');
    const oneWeekAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    let effectiveMin = data.signing_date || '';
    
    // Edit Permissions
    const isDraft = isEditing && contract?.status === 'draft';
    const isFullyEditable = !isEditing || isDraft || contract?.can_be_edited;
    const isPartiallyEditable = isEditing && ['under_review', 'suspended'].includes(contract?.status) && contract?.can_be_partially_edited;

    let expirationMin = '';
    if (isPartiallyEditable && contract?.status === 'suspended') {
        expirationMin = contract.expiration_date; // Prevent shortening
    } else if (data.effective_date) {
        expirationMin = dayjs(data.effective_date).add(1, 'day').format('YYYY-MM-DD');
    }

    // Form State Booleans
    const requiredContractFieldsFilled =
        data.contract_name.trim() &&
        data.partner_id &&
        data.farm_id &&
        data.signing_date &&
        data.effective_date &&
        data.expiration_date &&
        data.buyback_price_per_unit &&
        (isEditing || data.contract_file);

    const canAddSeeds = requiredContractFieldsFilled;

    // --- EFFECTS (useEffect) ---

    useEffect(() => {
        const updatedSeeds = selectedSeeds.map(seed => {
            const maxCycles = getMaxCycles(seed);
            let cycles = Number(seed.agreed_cycles) || 1;
            if (cycles > maxCycles) cycles = maxCycles > 0 ? maxCycles : 1;

            return {
                ...seed,
                agreed_cycles: cycles,
            };
        });
        setSelectedSeeds(updatedSeeds);
        updateFormSeeds(updatedSeeds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.effective_date, data.expiration_date]);

    
    // --- HELPER/UTILITY FUNCTIONS ---

    const formatPrice = (price) => {
        if (!price) return '0.00';
        return parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const getHarvestMin = (seed) => {
        if (!seed.planting_date || !seed.growth_cycle) return '';
        const minDate = dayjs(seed.planting_date).add(Number(seed.growth_cycle), 'day');
        return minDate.format('YYYY-MM-DD');
    };

    const getHarvestMax = () => {
        if (!data.expiration_date) return '';
        return dayjs(data.expiration_date).format('YYYY-MM-DD');
    };

    const getHarvestMaxForSeed = (seed) => {
        if (!seed.planting_date || !seed.growth_cycle) return '';
        const minDate = dayjs(seed.planting_date).add(Number(seed.growth_cycle), 'day');
        const maxDate = minDate.add(14, 'day'); // 2 weeks after earliest possible
        return maxDate.format('YYYY-MM-DD');
    };

    const getMaxCycles = (seed) => {
        const growthCycle = Number(seed.growth_cycle);
        if (!seed.planting_date || !seed.expected_first_harvest_date || !growthCycle || growthCycle <= 0) return 1;

        const plantingDate = dayjs(seed.planting_date);
        const expirationDate = dayjs(data.expiration_date);

        if (expirationDate.isBefore(plantingDate)) return 1;

        const totalDays = expirationDate.diff(plantingDate, 'day');
        const maxCycles = Math.floor(totalDays / growthCycle);

        return maxCycles > 0 ? maxCycles : 1;
    };

    const validateSeed = (seed) => {
        const errors = [];
        if (!seed.planting_date || !seed.expected_first_harvest_date || !seed.growth_cycle) return errors;

        const plantingDate = dayjs(seed.planting_date);
        const harvestDate = dayjs(seed.expected_first_harvest_date);
        const growthCycle = Number(seed.growth_cycle);
        const maxCycles = getMaxCycles(seed);

        if (harvestDate.diff(plantingDate, 'day') < growthCycle) {
            errors.push(`Harvest date must be at least ${growthCycle} days after planting.`);
        }
        if (harvestDate.isAfter(dayjs(data.expiration_date))) {
            errors.push('Expected harvest cannot be after the contract expiration date.');
        }
        if (seed.agreed_cycles > maxCycles) {
            errors.push(`Agreed cycles cannot exceed ${maxCycles} based on contract duration.`);
        }
        if (seed.agreed_cycles < 1) {
            errors.push('Agreed cycles must be at least 1.');
        }
        return errors;
    };

    const isLocked = (field) => {
        // Always lock core fields in under_review or suspended
        if (isEditing && ['under_review', 'suspended'].includes(contract?.status)) {
            const lockedFields = [
                'contract_name',
                'partner_id',
                'farm_id',
                'signing_date',
                'seed_variety'
            ];
            if (lockedFields.includes(field)) return true;
        }
        if (!isPartiallyEditable) return false;
        const editableFields = [
            'effective_date',
            'expiration_date',
            'buyback_price_per_unit',
            'contract_file',
            'notes',
            'planting_date',
            'expected_first_harvest_date',
            'expected_buyback_amount',
            'agreed_cycles',
            'seed_quantity',
            'buyback_unit',
        ];
        return !editableFields.includes(field);
    };

    // --- EVENT HANDLERS & ASYNC FUNCTIONS ---

    const checkContractNameUnique = async (name) => {
        if (!name.trim()) {
            setContractNameUniqueError('');
            setCheckingContractName(false);
            return;
        }
        setCheckingContractName(true);
        try {
            await axios.post(route('contracts.checkNameUnique'), {
                contract_name: name.trim(),
                contractId: contract?.id,
            });
            setContractNameUniqueError('');
        } catch (err) {
            if (err.response?.status === 422) {
                setContractNameUniqueError(
                    "A contract with this name already exists. Please enter a different contract name."
                );
            }
        }
        setCheckingContractName(false);
    };

    const handleBlur = (field, value) => {
        setFieldErrors(prev => ({
            ...prev,
            [field]: !value || value === '' ? 'This field is required.' : ''
        }));
    };

    const handlePartnerSelect = (partner) => {
        setData('partner_id', partner.id);
        setPartnerSearch(partner.name);
        setShowPartnerDropdown(false);
        setFieldErrors(prev => ({
            ...prev,
            partner_id: '', // Clear required error immediately
        }));
    };

    const handleSeedSelection = (seed) => {
        setSeedSelectionError('');

        if (selectedSeeds.length >= 1) return;

        if (!data.effective_date || !data.expiration_date) {
            setSeedSelectionError("Please select both Effective Date and Expiration Date before choosing a seed.");
            return;
        }
        
        const earliestPlantingDate = dayjs(data.effective_date).add(1, 'day');
        const expirationDate = dayjs(data.expiration_date);
        const availableGrowthDays = expirationDate.diff(earliestPlantingDate, 'day');
        const growthCycle = Number(seed.growth_cycle);

        if (availableGrowthDays < growthCycle) {
            setSeedSelectionError(
                `${growthCycle}-day growth cycle exceeds ${availableGrowthDays} available days. Please adjust dates or select another seed.`
            );
            return;
        }

        // Prefill planting date and expected harvest date
        const plantingDate = earliestPlantingDate.format('YYYY-MM-DD');
        const expectedHarvestDate = earliestPlantingDate.add(growthCycle, 'day').format('YYYY-MM-DD');

        const newSeed = {
            seed_id: seed.id,
            seed_variety: seed.seed_variety,
            growth_cycle: seed.growth_cycle,
            price_per_unit: seed.price_per_unit,
            seed_quantity: '',
            unit: 'kg',
            seed_price_at_contract: seed.price_per_unit,
            planting_date: plantingDate,
            expected_first_harvest_date: expectedHarvestDate,
            agreed_cycles: 1,
            expected_buyback_amount: '',
            buyback_unit: 'kg',
        };

        const updatedSeeds = [newSeed];
        setSelectedSeeds(updatedSeeds);
        updateFormSeeds(updatedSeeds);
    };

    const removeSeed = () => {
        setSelectedSeeds([]);
        updateFormSeeds([]);
    };

    const updateFormSeeds = (seedsArray) => {
        setData('seeds', seedsArray.map(seed => ({
            id: seed.id,
            seed_id: seed.seed_id, 
            seed_quantity: Number(String(seed.seed_quantity).replace(/,/g, '')),
            unit: seed.unit,
            seed_price_at_contract: seed.seed_price_at_contract,
            planting_date: seed.planting_date,
            expected_first_harvest_date: seed.expected_first_harvest_date,
            agreed_cycles: seed.agreed_cycles,
            expected_buyback_amount: Number(String(seed.expected_buyback_amount).replace(/,/g, '')),
            buyback_unit: seed.buyback_unit,
        })));
    };

    const updateSeedData = (seedId, field, value) => {
        const updatedSeeds = selectedSeeds.map(seed => {
            if (seed.id === seedId) {
                let updatedSeed = { ...seed, [field]: value };

                // Prefill expected harvest date if planting date changes
                if (field === 'planting_date' && value && seed.growth_cycle) {
                    const minHarvestDate = dayjs(value).add(Number(seed.growth_cycle), 'day');
                    const maxHarvestDate = minHarvestDate.add(14, 'day');
                    // If not set or out of range, prefill to min
                    if (
                        !seed.expected_first_harvest_date ||
                        dayjs(seed.expected_first_harvest_date).isBefore(minHarvestDate) ||
                        dayjs(seed.expected_first_harvest_date).isAfter(maxHarvestDate)
                    ) {
                        updatedSeed.expected_first_harvest_date = minHarvestDate.format('YYYY-MM-DD');
                    }
                }

                // Agreed cycles logic
                if (field === 'planting_date' || field === 'expected_first_harvest_date' || field === 'agreed_cycles') {
                    const maxCycles = getMaxCycles(updatedSeed);
                    if (field !== 'agreed_cycles') {
                        updatedSeed.agreed_cycles = maxCycles;
                    } else {
                        const intValue = parseInt(value) || 1;
                        if (intValue > maxCycles) updatedSeed.agreed_cycles = maxCycles;
                        else if (intValue < 1 || isNaN(intValue)) updatedSeed.agreed_cycles = 1;
                        else updatedSeed.agreed_cycles = intValue;
                    }
                }

                return updatedSeed;
            }
            return seed;
        });
        setSelectedSeeds(updatedSeeds);
        updateFormSeeds(updatedSeeds);
    };

    const handleSeedQuantityChange = (seedId, value) => {
        let raw = value.replace(/,/g, '');

        if (raw === '.') raw = '0.';
        raw = raw.replace(/[^0-9.]/g, '');

        const parts = raw.split('.');
        if (parts.length > 2) {
            raw = parts[0] + '.' + parts.slice(1).join('');
        }
        if (parts[1]?.length > 2) {
            raw = parts[0] + '.' + parts[1].slice(0, 2);
        }

        let numericValue = parseFloat(raw);
        if (numericValue > 999999.99) {
            raw = '999999.99';
        }

        // Comma formatting
        const [integerPart, decimalPart] = raw.split('.');
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        let formatted = formattedInteger;
        if (decimalPart !== undefined) {
            formatted += '.' + decimalPart;
        }

        updateSeedData(seedId, 'seed_quantity', formatted);

        // Real-time validation
        setSeedQuantityErrors(prev => ({
            ...prev,
            [seedId]: raw === ''
                ? 'Seed quantity is required.'
                : (isNaN(numericValue) || numericValue <= 0)
                    ? 'Seed quantity must be greater than 0.'
                    : ''
        }));
    };

    const handleSeedQuantityBlur = (seedId, value) => {
        let raw = value.replace(/,/g, '');

        if (!raw || raw.trim() === '') {
            setSeedQuantityErrors(prev => ({
                ...prev,
                [seedId]: 'Seed quantity is required.'
            }));
            updateSeedData(seedId, 'seed_quantity', '');
            return;
        }

        let numericValue = parseFloat(raw);

        if (isNaN(numericValue) || numericValue <= 0) {
            setSeedQuantityErrors(prev => ({
                ...prev,
                [seedId]: 'Seed quantity must be greater than 0.'
            }));
            updateSeedData(seedId, 'seed_quantity', '');
            return;
        }

        if (numericValue > 999999.99) {
            numericValue = 999999.99;
        }

        let formatted = numericValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        updateSeedData(seedId, 'seed_quantity', formatted);
        setSeedQuantityErrors(prev => ({
            ...prev,
            [seedId]: ''
        }));
    };

    const handleExpectedBuybackAmountChange = (seedId, value) => {
        // Remove non-digits
        let raw = value.replace(/[^0-9]/g, '');

        // Remove leading zeros
        raw = raw.replace(/^0+/, '');

        let numericValue = raw === '' ? NaN : parseInt(raw, 10);

        // Enforce valid range
        if (numericValue > 999999) {
            raw = '999999';
            numericValue = 999999;
        }

        // Comma formatting
        const formatted = raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';

        // Always store/display formatted value
        updateSeedData(seedId, 'expected_buyback_amount', formatted);

        setExpectedBuybackErrors(prev => ({
            ...prev,
            [seedId]: raw === ''
                ? 'Expected buyback quantity is required.'
                : (isNaN(numericValue) || numericValue < 1)
                    ? 'Valid range: 1–999,999'
                    : ''
        }));
    };

    const handleExpectedBuybackAmountBlur = (seedId, value) => {
        let raw = value.replace(/[^0-9]/g, '');

        if (!raw || raw.trim() === '') {
            setExpectedBuybackErrors(prev => ({
                ...prev,
                [seedId]: 'Expected buyback quantity is required.'
            }));
            updateSeedData(seedId, 'expected_buyback_amount', '');
            return;
        }

        let numericValue = parseInt(raw, 10);

        if (isNaN(numericValue) || numericValue < 1) {
            setExpectedBuybackErrors(prev => ({
                ...prev,
                [seedId]: 'Valid range: 1–999,999'
            }));
            updateSeedData(seedId, 'expected_buyback_amount', '');
            return;
        }

        if (numericValue > 999999) {
            numericValue = 999999;
        }

        // Format with commas for display
        let formatted = numericValue.toLocaleString('en-US');

        updateSeedData(seedId, 'expected_buyback_amount', formatted);
        setExpectedBuybackErrors(prev => ({
            ...prev,
            [seedId]: ''
        }));
    };

    const handleBuybackPriceChange = (e) => {
        let value = e.target.value.replace(/,/g, '');

        if (value === '.') value = '0.';
        value = value.replace(/[^0-9.]/g, '');

        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        if (parts[1]?.length > 2) {
            value = parts[0] + '.' + parts[1].slice(0, 2);
        }

        let numericValue = parseFloat(value);
        if (numericValue > 999999.99) {
            value = '999999.99';
        }

        const [integerPart, decimalPart] = value.split('.');
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        let formatted = formattedInteger;
        if (decimalPart !== undefined) {
            formatted += '.' + decimalPart;
        }

        setData('buyback_price_per_unit', formatted);

        // Real-time validation
        if (value === '') {
            setBuybackPriceError('Buyback price is required.');
        } else if (isNaN(numericValue) || numericValue <= 0) {
            setBuybackPriceError('Price must be greater than 0.');
        } else {
            setBuybackPriceError('');
        }
    };

    const handleBuybackPriceBlur = (e) => {
        let value = e.target.value.replace(/,/g, '');

        if (!value || value.trim() === '') {
            setBuybackPriceError('Buyback price is required.');
            setData('buyback_price_per_unit', '');
            return;
        }

        let numericValue = parseFloat(value);

        if (isNaN(numericValue) || numericValue <= 0) {
            setBuybackPriceError('Price must be greater than 0.');
            setData('buyback_price_per_unit', '');
            return;
        }

        if (numericValue > 999999.99) {
            numericValue = 999999.99;
        }

        let formatted = numericValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        setData('buyback_price_per_unit', formatted);
        setBuybackPriceError('');
    };

    const getTotalExpectedBuyback = () => {
        return selectedSeeds.reduce((sum, seed) => sum + toKg(seed.expected_buyback_amount, seed.buyback_unit), 0);
    };

    const submit = (e) => {
    e.preventDefault();

    if (selectedSeeds.length === 0) {
        setSeedSelectionError('Selecting a seed variety is required.');
        return;
    }

    // --- VALIDATE BUYBACK BEFORE SUBMIT ---
    if (isEditing && contract?.status === 'suspended') {
        const totalExpectedKg = getTotalExpectedBuyback(); // already in kg
        if (totalExpectedKg < totalReceivedBuyback) {
            setExpectedBuybackErrors(prev => ({
                ...prev,
                form: `Expected buyback amount (${totalExpectedKg} kg) cannot be less than total received (${totalReceivedBuyback} kg).`
            }));
            return; // STOP SUBMIT
        } else {
            setExpectedBuybackErrors(prev => ({
                ...prev,
                form: ''
            }));
        }
    }

    let cleanBuybackPrice = String(data.buyback_price_per_unit)
        .replace(/,/g, '')
        .trim();
    let buybackPriceValue = cleanBuybackPrice === '' ? 0 : parseFloat(cleanBuybackPrice);

    const submissionData = {
        ...data,
        buyback_price_per_unit: buybackPriceValue,
        _method: isEditing ? 'put' : 'post',
    };

    if (isEditing && !(data.contract_file instanceof File)) {
        delete submissionData.contract_file;
    }

    if (isEditing) {
        router.post(route('contracts.update', contract.id), submissionData, {
            onSuccess: () => router.visit(route('contracts.show', contract.id)),
            onError: (e) => console.error(e)
        });
    } else {
        router.post(route('contracts.store'), submissionData, {
            onSuccess: () => router.visit(route('contracts.index')),
            onError: (e) => console.error(e)
        });
    }
};

    // --- RENDER ---

    return (
        <div className="p-6">
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / <Link href={route('contracts.index')} className="text-[#37692F] hover:underline">Contracts</Link> / <span>{isEditing ? 'Edit' : 'Create'} Contract</span>
                </nav>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    {isEditing ? 'Edit Contract' : 'Create New Contract'}
                </h1>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Contract Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contract Name *</label>
                            <input
                                type="text"
                                value={data.contract_name}
                                onChange={(e) => {
                                    setData('contract_name', e.target.value);
                                    checkContractNameUnique(e.target.value);
                                    setFieldErrors(prev => ({
                                        ...prev,
                                        contract_name: '', // Clear required error immediately
                                    }));
                                }}
                                onBlur={e => handleBlur('contract_name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                required
                                disabled={isLocked('contract_name')}

                            />
                            {fieldErrors.contract_name && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.contract_name}</p>
                            )}
                            {contractNameUniqueError && (
                                <p className="mt-1 text-sm text-red-600">{contractNameUniqueError}</p>
                            )}
                            {errors.contract_name && <p className="mt-1 text-sm text-red-600">{errors.contract_name}</p>}
                        </div>

                        {/* 2. Partner */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Partner *</label>
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
                                    onBlur={e => {
                                        setTimeout(() => setShowPartnerDropdown(false), 200);
                                        handleBlur('partner_id', data.partner_id);
                                    }}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                    placeholder="Search by partner's name..."
                                    required
                                    disabled={isLocked('partner_id')}
                                />
                                {fieldErrors.partner_id && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.partner_id}</p>
                                )}
                                {showPartnerDropdown && filteredPartners.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {filteredPartners.map(partner => (
                                            <div
                                                key={partner.id}
                                                onClick={() => handlePartnerSelect(partner)}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="font-medium text-gray-900">{partner.name}</div>
                                                <div className="text-xs text-gray-500">{partner.email}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.partner_id && <p className="mt-1 text-sm text-red-600">{errors.partner_id}</p>}
                        </div>

                        {/* 2b. Farm Selection */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Farm *</label>
                            <select
                                value={data.farm_id}
                                onChange={e => {
                                    setData('farm_id', e.target.value);
                                    setSelectedSeeds([]);
                                    updateFormSeeds([]);
                                    setFieldErrors(prev => ({
                                        ...prev,
                                        farm_id: '', // Clear required error immediately
                                    }));
                                }}
                                onBlur={e => handleBlur('farm_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                required
                                disabled={!data.partner_id || isLocked('farm_id')}
                            >
                                <option value="" disabled>Select a farm...</option>
                                {partners
                                    .find(p => p.id === Number(data.partner_id))
                                    ?.farms?.map(farm => (
                                        <option key={farm.id} value={farm.id}>
                                            {farm.location_name} ({farm.soil_type})
                                        </option>
                                    ))}
                            </select>
                            {fieldErrors.farm_id && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.farm_id}</p>
                            )}
                            {errors.farm_id && <p className="mt-1 text-sm text-red-600">{errors.farm_id}</p>}
                        </div>

                        {/* 3. Signing Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Signing Date *</label>
                            <input
                                type="date"
                                value={data.signing_date}
                                onChange={(e) => {
                                    setData('signing_date', e.target.value);
                                    setData('effective_date', '');
                                    setData('expiration_date', '');
                                }}
                                onBlur={e => handleBlur('signing_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                required
                                max={today}
                                min={oneWeekAgo}
                                disabled={isLocked('signing_date')}
                            />
                            {fieldErrors.signing_date && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.signing_date}</p>
                            )}
                            {errors.signing_date && <p className="mt-1 text-sm text-red-600">{errors.signing_date}</p>}
                        </div>

                        {/* 4. Effective Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date *</label>
                            <input
                                type="date"
                                value={data.effective_date}
                                onChange={(e) => {
                                    setData('effective_date', e.target.value);
                                    setData('expiration_date', '');
                                }}
                                onBlur={e => handleBlur('effective_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                min={effectiveMin}
                                disabled={!data.signing_date || !isFullyEditable}
                            />
                            {fieldErrors.effective_date && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.effective_date}</p>
                            )}
                            {!data.signing_date && (<span className="text-xs text-gray-500 block">Select Signing Date first.</span>)}
                            {errors.effective_date && <p className="mt-1 text-sm text-red-600">{errors.effective_date}</p>}
                        </div>

                        {/* 5. Expiration Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                            <input
                                type="date"
                                value={data.expiration_date}
                                onChange={(e) => setData('expiration_date', e.target.value)}
                                onBlur={e => handleBlur('expiration_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                min={expirationMin}
                                disabled={!data.effective_date || isLocked('expiration_date')}
                            />
                            {fieldErrors.expiration_date && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.expiration_date}</p>
                            )}
                            {!data.effective_date && (<span className="text-xs text-gray-500 block">Select Effective Date first.</span>)}
                            {errors.expiration_date && <p className="mt-1 text-sm text-red-600">{errors.expiration_date}</p>}
                        </div>

                        {/* 6. Buyback Price Per Unit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Buyback Price (₱/kg) *</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">₱</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={data.buyback_price_per_unit}
                                    onChange={handleBuybackPriceChange}
                                    onBlur={handleBuybackPriceBlur}
                                    className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                    placeholder="0.00"
                                    required
                                    disabled={isLocked('buyback_price_per_unit') || totalReceivedBuyback > 0}
                                />
                                <span className="text-xs text-gray-500 block mt-1">Valid range: ₱0.01–₱999,999.99</span>
                                {buybackPriceError && (
                                    <p className="mt-1 text-sm text-red-600">{buybackPriceError}</p>
                                )}
                            </div>
                            {errors.buyback_price_per_unit && <p className="mt-1 text-sm text-red-600">{errors.buyback_price_per_unit}</p>}
                        </div>

                        {/* 7. Contract File */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contract File {isEditing && contract.contract_file ? '' : '*'}
                            </label>

                            {/* --- ADD THIS BLOCK --- */}
                            {isEditing && contract.original_file_name && (
                                <div className="mb-2 p-3 bg-gray-100 border border-gray-300 rounded-lg">
                                    <p className="text-sm font-medium text-gray-800">
                                        Current File: 
                                        <span className="font-bold ml-1">{contract.original_file_name}</span>
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        To replace this file, choose a new one below.
                                    </p>
                                </div>
                            )}
                            {/* --- END OF ADDED BLOCK --- */}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    setData('contract_file', e.target.files[0]);
                                    setFieldErrors(prev => ({
                                        ...prev,
                                        contract_file: '', // Clear required error immediately
                                    }));
                                }}
                                onBlur={e => handleBlur('contract_file', data.contract_file)}
                                accept=".pdf,.doc,.docx"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                required={!isEditing || !contract.contract_file} // This logic seems correct
                                disabled={isLocked('contract_file')}
                            />

                            {fieldErrors.contract_file && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.contract_file}</p>
                            )}

                            {errors.contract_file && <p className="mt-1 text-sm text-red-600">{errors.contract_file}</p>}
                        </div>

                        {/* 8. Notes (Optional) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                disabled={isLocked('notes')}
                            />
                            {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                        </div>
                    </div>

                    {/* Seeds Selection */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Seed Variety Commitment</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">1 required</span>
                        </div>
                        {seedSelectionError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{seedSelectionError}</p>
                            </div>
                        )}

                        {/* Seed Selector */}
                        <div className="mb-6 relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={seedSearch}
                                    onChange={e => setSeedSearch(e.target.value)}
                                    onFocus={() => setShowSeedDropdown(true)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                    placeholder="Search or select a seed variety..."
                                    disabled={!canAddSeeds || selectedSeeds.length >= 1}
                                />
                                {showSeedDropdown && filteredSeeds.length > 0 && canAddSeeds && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {filteredSeeds.map(seed => (
                                            <div
                                                key={seed.id}
                                                onClick={() => {
                                                    handleSeedSelection(seed);
                                                    setSeedSearch('');
                                                    setShowSeedDropdown(false);
                                                }}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="font-medium text-gray-900">{seed.seed_variety}</div>
                                                <div className="text-sm text-gray-500">
                                                    ₱{formatPrice(seed.price_per_unit)} • Growth: {seed.growth_cycle} days
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {!canAddSeeds && (
                                <p className="text-amber-600 text-sm mt-2 px-1">
                                    Please complete all required contract details above before adding a seed.
                                </p>
                            )}
                            {selectedSeeds.length >= 1 && (
                                <p className="text-amber-600 text-sm mt-2 px-1">
                                    Only one seed variety allowed per contract.
                                </p>
                            )}
                        </div>

                        {/* Selected Seeds Commitment Details */}
                        <div className="space-y-6">
                            {selectedSeeds.map((seed, index) => {
                                const minHarvest = getHarvestMin(seed);
                                const maxHarvest = data.expiration_date ? dayjs(data.expiration_date).format('YYYY-MM-DD') : '';
                                const minHarvestDayjs = minHarvest ? dayjs(minHarvest) : null;
                                const maxHarvestDayjs = maxHarvest ? dayjs(maxHarvest) : null;

                                const impossible = minHarvest && maxHarvest && minHarvestDayjs.isAfter(maxHarvestDayjs);

                                return (
                                    <div key={seed.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                                        {/* Seed Header */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-semibold text-gray-900 text-lg">{seed.seed_variety}</h4>
                                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                        Selected
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <span>Growth cycle: <strong>{seed.growth_cycle ? `${seed.growth_cycle} days` : 'N/A'}</strong></span>
                                                    <span>Base Price: <strong>₱{formatPrice(seed.price_per_unit)}</strong></span>
                                                </div>
                                            </div>
                                            {!isLocked('seed_variety') && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSeed()}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            )}
                                        </div>

                                        {/* Commitment Fields */}
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Seed Quantity *</label>
                                                    <input
                                                        type="text"
                                                        inputMode="decimal"
                                                        value={seed.seed_quantity}
                                                        onChange={e => handleSeedQuantityChange(seed.id, e.target.value)}
                                                        onBlur={e => handleSeedQuantityBlur(seed.id, e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                                        required
                                                        disabled={!isFullyEditable}
                                                        placeholder="Enter seed quantity"
                                                    />
                                                    <span className="text-xs text-gray-500 block mt-1">Valid range: 0.01–999,999.99</span>
                                                    {seedQuantityErrors[seed.id] && (
                                                        <p className="text-red-500 text-xs mt-1">{seedQuantityErrors[seed.id]}</p>
                                                    )}
                                                    {errors[`seeds.${index}.seed_quantity`] && <p className="text-red-500 text-xs mt-1">{errors[`seeds.${index}.seed_quantity`]}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Seed Unit *</label>
                                                    <select
                                                        value={seed.unit}
                                                        onChange={(e) => updateSeedData(seed.id, 'unit', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                                        required
                                                        disabled={!isFullyEditable}
                                                    >
                                                        <option value="kg">kg</option>
                                                        <option value="sack">sack</option>
                                                        <option value="ton">ton</option>
                                                    </select>
                                                    {errors[`seeds.${index}.unit`] && <p className="text-red-500 text-xs mt-1">{errors[`seeds.${index}.unit`]}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Seed Price Locked</label>
                                                    <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-600">
                                                        ₱{formatPrice(seed.seed_price_at_contract)} / kg
                                                    </div>
                                                    <input type="hidden" name={`seeds.${index}.seed_price_at_contract`} value={seed.seed_price_at_contract} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Planting Date *</label>
                                                    <input
                                                        type="date"
                                                        value={seed.planting_date}
                                                        min={data.effective_date ? dayjs(data.effective_date).add(1, 'day').format('YYYY-MM-DD') : ''}
                                                        max={maxHarvest}
                                                        onChange={(e) => updateSeedData(seed.id, 'planting_date', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                                        required
                                                        disabled={!data.effective_date || isLocked('planting_date')}
                                                    />
                                                    {!data.effective_date && (<p className="text-xs text-gray-500 mt-1">Select Effective Date first.</p>)}
                                                    {errors[`seeds.${index}.planting_date`] && <p className="text-red-500 text-xs mt-1">{errors[`seeds.${index}.planting_date`]}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Expected Harvest Date *
                                                        {seed.planting_date && seed.growth_cycle && (
                                                            <span className="block text-xs text-gray-500 font-normal mt-1">
                                                                Earliest possible: {getHarvestMin(seed)}
                                                            </span>
                                                        )}
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={seed.expected_first_harvest_date || ''}
                                                        min={getHarvestMin(seed)}
                                                        max={getHarvestMaxForSeed(seed)}
                                                        onChange={e => updateSeedData(seed.id, 'expected_first_harvest_date', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                                        required
                                                        disabled={impossible || !seed.planting_date || isLocked('expected_first_harvest_date') || !data.effective_date}
                                                    />
                                                    {impossible && (<p className="text-red-500 text-xs mt-1">Adjust dates or contract duration.</p>)}
                                                    {errors[`seeds.${index}.expected_first_harvest_date`] && <p className="text-red-500 text-xs mt-1">{errors[`seeds.${index}.expected_first_harvest_date`]}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Agreed Cycles *
                                                        {seed.expected_first_harvest_date && (
                                                            <span className="block text-xs text-gray-500 font-normal mt-1">
                                                                Maximum: {getMaxCycles(seed)} cycles
                                                            </span>
                                                        )}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={getMaxCycles(seed)}
                                                        value={seed.expected_first_harvest_date ? seed.agreed_cycles : ''}
                                                        onChange={(e) => updateSeedData(seed.id, 'agreed_cycles', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                                        required
                                                        disabled={isLocked('agreed_cycles')}
                                                        placeholder={seed.expected_first_harvest_date ? undefined : 'Set harvest date first'}
                                                    />
                                                    {errors[`seeds.${index}.agreed_cycles`] && <p className="text-red-500 text-xs mt-1">{errors[`seeds.${index}.agreed_cycles`]}</p>}
                                                </div>

                                                <div>
                                                    {/* Expected Buyback Amount */}
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Buyback Quantity *</label>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={seed.expected_buyback_amount}
                                                        onChange={e => handleExpectedBuybackAmountChange(seed.id, e.target.value)}
                                                        onBlur={e => handleExpectedBuybackAmountBlur(seed.id, e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                                        required
                                                        disabled={isLocked('expected_buyback_amount')}
                                                        placeholder="Enter Buyback quantity"
                                                    />
                                                    <span className="text-xs text-gray-500 block mt-1">Valid range: 1–999,999</span>
                                                    {expectedBuybackErrors[seed.id] && (
                                                        <p className="text-red-500 text-xs mt-1">{expectedBuybackErrors[seed.id]}</p>
                                                    )}
                                                    {seedQuantityErrors[`expected_buyback_amount_${seed.id}`] && (
                                                        <p className="text-red-500 text-xs mt-1">{seedQuantityErrors[`expected_buyback_amount_${seed.id}`]}</p>
                                                    )}
                                                    {errors[`seeds.${index}.expected_buyback_amount`] && <p className="text-red-500 text-xs mt-1">{errors[`seeds.${index}.expected_buyback_amount`]}</p>}
                                                </div>

                                                <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Buyback Unit *</label>
    <select
        value={seed.buyback_unit}
        onChange={(e) => updateSeedData(seed.id, 'buyback_unit', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
        required
        disabled={isLocked('buyback_unit')}
    >
        <option value="kg">kg</option>
        <option value="sack">sack</option>
        <option value="ton">ton</option>
    </select>
    {/* Add this hidden input when disabled */}
    {isLocked('buyback_unit') && (
        <input type="hidden" name={`seeds.${index}.buyback_unit`} value={seed.buyback_unit} />
    )}
    {errors[`seeds.${index}.buyback_unit`] && <p className="text-red-500 text-xs mt-1">{errors[`seeds.${index}.buyback_unit`]}</p>}
</div>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            {validateSeed(seed).map((err, idx) => (
                                                <p key={idx} className="text-red-500 text-sm mt-1 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                                    {err}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {errors.seeds && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{errors.seeds}</p>
                            </div>
                        )}
                        {selectedSeeds.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                <p className="text-gray-500 text-sm">Please select one seed variety to continue</p>
                            </div>
                        )}
                    </div>

                    {/* Place the error block here, before the buttons */}
                    {expectedBuybackErrors.form && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{expectedBuybackErrors.form}</p>
                        </div>
                    )}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Link
                            href={route('contracts.index')}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={
                                processing ||
                                selectedSeeds.length === 0 ||
                                validateSeed(selectedSeeds[0] || {}).length > 0 ||
                                !!contractNameUniqueError ||
                                !!buybackPriceError ||
                                !data.buyback_price_per_unit ||
                                Object.values(fieldErrors).some(err => !!err) ||
                                Object.values(seedQuantityErrors).some(err => !!err) ||
                                Object.values(expectedBuybackErrors).some(err => !!err)
                            }
                            className="bg-[#37692F] hover:bg-[#2a5624] text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Contract')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}