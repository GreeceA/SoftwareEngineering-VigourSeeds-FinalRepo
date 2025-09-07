import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, partners }) {
    const { data, setData, post, processing, errors } = useForm({
        partner_id: '',
        contract_file: null,
        contract_date: '',
        effective_date: '',
        expiration_date: '',
        seeds: [{ seed_type: '', quantity: '', unit_of_measurement: 'kg' }],
        notes: '',
        status: 'draft'
    });

    const [partnerSearch, setPartnerSearch] = useState('');
    const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
    const [filteredPartners, setFilteredPartners] = useState(partners || []);
    const [selectedPartner, setSelectedPartner] = useState(null);

    const seedOptions = ["MAIZE D30", "MAISWERTE", "MAIS-TISA", "KK168", "TEOSINTE 200"];
    const unitOptions = [
        { value: 'ton', label: 'Ton' },
        { value: 'sack', label: 'Sack' },
        { value: 'kg', label: 'Kilogram (kg)' }
    ];

    // Filter partners based on search
    useEffect(() => {
        if (partnerSearch.trim() === '') {
            setFilteredPartners(partners || []);
        } else {
            const filtered = (partners || []).filter(partner =>
                partner.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
                (partner.email && partner.email.toLowerCase().includes(partnerSearch.toLowerCase()))
            );
            setFilteredPartners(filtered);
        }
    }, [partnerSearch, partners]);

    const handlePartnerSelect = (partner) => {
        setSelectedPartner(partner);
        setData('partner_id', partner.id);
        setPartnerSearch(partner.name);
        setShowPartnerDropdown(false);
    };

    const handlePartnerSearchChange = (e) => {
        const value = e.target.value;
        setPartnerSearch(value);
        setShowPartnerDropdown(true);
        
        if (value === '') {
            setSelectedPartner(null);
            setData('partner_id', '');
        }
    };

    const addSeedRow = () => {
        setData('seeds', [...data.seeds, { seed_type: '', quantity: '', unit_of_measurement: 'kg' }]);
    };

    const removeSeedRow = (index) => {
        if (data.seeds.length > 1) {
            const newSeeds = data.seeds.filter((_, i) => i !== index);
            setData('seeds', newSeeds);
        }
    };

    const updateSeed = (index, field, value) => {
        const newSeeds = [...data.seeds];
        newSeeds[index][field] = value;
        setData('seeds', newSeeds);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
            }
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                alert('Only PDF, DOC, and DOCX files are allowed');
                return;
            }
        }
        setData('contract_file', file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate seeds
        const validSeeds = data.seeds.filter(seed => 
            seed.seed_type && seed.quantity && seed.unit_of_measurement
        );
        
        if (validSeeds.length === 0) {
            alert('Please add at least one complete seed entry');
            return;
        }

        // Validate dates
        if (data.effective_date && data.expiration_date && 
            new Date(data.effective_date) >= new Date(data.expiration_date)) {
            alert('Expiration date must be after effective date');
            return;
        }

        const formData = {
            ...data,
            seeds: validSeeds
        };

        post(route('contracts.store'), formData);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create New Contract
                    </h2>
                    <Link
                        href={route('contracts.index')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
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
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                {/* Partner Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Partner *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={partnerSearch}
                                            onChange={handlePartnerSearchChange}
                                            onFocus={() => setShowPartnerDropdown(true)}
                                            placeholder="Search partner by name or email..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        
                                        {showPartnerDropdown && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                                {filteredPartners.length > 0 ? (
                                                    filteredPartners.map((partner) => (
                                                        <div
                                                            key={partner.id}
                                                            onClick={() => handlePartnerSelect(partner)}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                        >
                                                            <div className="font-medium text-gray-900">{partner.name}</div>
                                                            {partner.email && (
                                                                <div className="text-sm text-gray-600">{partner.email}</div>
                                                            )}
                                                            {partner.phone && (
                                                                <div className="text-sm text-gray-500">{partner.phone}</div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 text-gray-500 text-sm">
                                                        No partners found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {errors.partner_id && <p className="mt-1 text-sm text-red-600">{errors.partner_id}</p>}
                                </div>

                                {/* Selected Partner Display */}
                                {selectedPartner && (
                                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-medium text-blue-900 mb-2">Selected Partner:</h4>
                                        <div className="text-sm">
                                            <p className="font-medium">{selectedPartner.name}</p>
                                            {selectedPartner.email && <p>Email: {selectedPartner.email}</p>}
                                            {selectedPartner.phone && <p>Phone: {selectedPartner.phone}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* Contract File Upload */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contract File *
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Upload PDF, DOC, or DOCX files only. Maximum size: 2MB.
                                    </p>
                                    {errors.contract_file && <p className="mt-1 text-sm text-red-600">{errors.contract_file}</p>}
                                </div>

                                {/* Contract Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contract Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.contract_date}
                                            onChange={(e) => setData('contract_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.contract_date && <p className="mt-1 text-sm text-red-600">{errors.contract_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Effective Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.effective_date}
                                            onChange={(e) => setData('effective_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.effective_date && <p className="mt-1 text-sm text-red-600">{errors.effective_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Expiration Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.expiration_date}
                                            onChange={(e) => setData('expiration_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.expiration_date && <p className="mt-1 text-sm text-red-600">{errors.expiration_date}</p>}
                                    </div>
                                </div>

                                {/* Seeds Section */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Seeds Information *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addSeedRow}
                                            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                        >
                                            + Add Seed
                                        </button>
                                    </div>

                                    {data.seeds.map((seed, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-medium text-gray-700">Seed #{index + 1}</h4>
                                                {data.seeds.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSeedRow(index)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Seed Type *
                                                    </label>
                                                    <select
                                                        value={seed.seed_type}
                                                        onChange={(e) => updateSeed(index, 'seed_type', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    >
                                                        <option value="">Select seed type</option>
                                                        {seedOptions.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Quantity *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={seed.quantity}
                                                        onChange={(e) => updateSeed(index, 'quantity', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter quantity"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Unit *
                                                    </label>
                                                    <select
                                                        value={seed.unit_of_measurement}
                                                        onChange={(e) => updateSeed(index, 'unit_of_measurement', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    >
                                                        {unitOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {errors.seeds && <p className="mt-1 text-sm text-red-600">{errors.seeds}</p>}
                                </div>

                                {/* Notes */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add any additional notes or comments about the contract..."
                                    />
                                    {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                </div>

                                {/* Status Display (Read-only) */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contract Status
                                    </label>
                                    <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                            Draft
                                        </span>
                                        <span className="ml-2 text-sm text-gray-600">
                                            (New contracts are created as drafts by default)
                                        </span>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                                    <Link
                                        href={route('contracts.index')}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Creating Contract...' : 'Create Contract'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}