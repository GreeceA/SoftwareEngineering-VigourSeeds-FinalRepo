import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';

export default function ItemForm({ item = null, onCancel }) {
    const isEditing = !!item;
    
    const [formData, setFormData] = useState({
        name: item?.name || '',
        type: item?.type || '',
        description: item?.description || '',
        base_unit: item?.base_unit || '',
        price_per_unit: item?.price_per_unit || '',
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // Validation states
    const [nameUniqueError, setNameUniqueError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [checkingName, setCheckingName] = useState(false);

    // Touched state for required fields
    const [touched, setTouched] = useState({
        name: false,
        type: false,
        description: false,
        base_unit: false,
        price_per_unit: false,
    });

    // Helper Functions
    const formatPrice = (value) => {
        const raw = value.replace(/,/g, '');
        if (!raw) return '';
        const [whole, decimal] = raw.split('.');
        return Number(whole).toLocaleString() + (decimal !== undefined ? '.' + decimal : '');
    };

    const isFieldRequiredEmpty = (fieldName) => {
        const value = formData[fieldName];
        const rawValue = typeof value === 'string' ? value.replace(/,/g, '').trim() : value;
        return touched[fieldName] && (!rawValue || rawValue === 0);
    };

    const handleRequiredBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
    };

    const getRequiredError = (fieldName) => {
        if (isFieldRequiredEmpty(fieldName)) {
            const label = fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `The Item ${label} is required.`;
        }
        return null;
    };

    // Item Name Handlers
    const handleNameChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, name: value }));
        setNameUniqueError('');
        checkNameUnique(value);
    };

    const checkNameUnique = async (name) => {
        if (!name.trim()) {
            setNameUniqueError('');
            setCheckingName(false);
            return;
        }
        setCheckingName(true);
        try {
            await axios.post(route('items.checkName'), {
                name: name.trim(),
                itemId: item?.id || null,
            });
            setNameUniqueError('');
        } catch (err) {
            if (err.response?.status === 422) {
                setNameUniqueError(
                    "An item with this name already exists. Please enter a different item name."
                );
            }
        }
        setCheckingName(false);
    };

    // Price Handlers
    const handlePriceChange = (e) => {
        let raw = e.target.value.replace(/,/g, '');
        if (!/^(\d+(\.\d{0,2})?)?$/.test(raw)) return;

        if (raw && parseFloat(raw) > 99999.99) return;

        let formatted = raw;
        if (raw) {
            const [whole, decimal] = raw.split('.');
            formatted = Number(whole).toLocaleString() + (decimal !== undefined ? '.' + decimal : '');
        }

        setFormData(prev => ({ ...prev, price_per_unit: formatted }));

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

    // Type Change Handler
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setFormData(prev => ({
            ...prev,
            type: newType,
        }));
        if (newType) handleRequiredBlur('type');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setTouched({
            name: true,
            type: true,
            description: true,
            base_unit: true,
            price_per_unit: true,
        });

        if (isSubmitDisabled) {
            return;
        }

        // Prepare clean data for submission
        const cleanPrice = formData.price_per_unit.replace(/,/g, '');
        
        const submitData = {
            name: formData.name,
            type: formData.type,
            description: formData.description,
            base_unit: formData.base_unit,
            price_per_unit: parseFloat(cleanPrice),
            ...(isEditing && { status: item.status }),
        };

        setProcessing(true);

        const routeName = isEditing ? 'items.update' : 'items.store';
        const routeParams = isEditing ? item.id : undefined;

        router[isEditing ? 'put' : 'post'](route(routeName, routeParams), submitData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    const isAnyRequiredFieldEmpty = 
        isFieldRequiredEmpty('name') ||
        isFieldRequiredEmpty('type') ||
        isFieldRequiredEmpty('description') ||
        isFieldRequiredEmpty('base_unit') ||
        isFieldRequiredEmpty('price_per_unit');

    const isSubmitDisabled =
        processing ||
        checkingName ||
        !!nameUniqueError ||
        !!priceError ||
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
                    {/* Item Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Item Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleNameChange}
                            onBlur={(e) => { handleRequiredBlur('name'); checkNameUnique(e.target.value); }}
                            className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                (getRequiredError('name') || nameUniqueError || errors.name) ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter item name"
                            required
                        />
                        {getRequiredError('name') && (
                            <p className="mt-1 text-sm text-red-600">{getRequiredError('name')}</p>
                        )}
                        {(!getRequiredError('name') && nameUniqueError) && (
                            <p className="mt-1 text-sm text-red-600">{nameUniqueError}</p>
                        )}
                        {(!getRequiredError('name') && !nameUniqueError && errors.name) && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Item Type */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Item Type *
                        </label>
                        <select
                            value={formData.type}
                            onChange={handleTypeChange}
                            onBlur={() => handleRequiredBlur('type')}
                            className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                (getRequiredError('type') || errors.type) ? 'border-red-500' : ''
                            }`}
                            required
                        >
                            <option value="" disabled>Select type</option>
                            <option value="fertilizer">Fertilizer</option>
                            <option value="pesticide">Pesticide</option>
                        </select>
                        {getRequiredError('type') && (
                            <p className="mt-1 text-sm text-red-600">{getRequiredError('type')}</p>
                        )}
                        {(!getRequiredError('type') && errors.type) && (
                            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
                    Description
                </h2>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Item Description *
                    </label>
                    <textarea
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        onBlur={() => handleRequiredBlur('description')}
                        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                            (getRequiredError('description') || errors.description) ? 'border-red-500' : ''
                        }`}
                        placeholder="Enter item description"
                        required
                    />
                    {getRequiredError('description') && (
                        <p className="mt-1 text-sm text-red-600">{getRequiredError('description')}</p>
                    )}
                    {(!getRequiredError('description') && errors.description) && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                </div>
            </div>

            {/* Unit and Pricing */}
            <div>
                <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
                    Unit and Pricing
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Base Unit */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Base Unit *
                        </label>
                        <select
                            value={formData.base_unit}
                            onChange={(e) => { 
                                setFormData(prev => ({ ...prev, base_unit: e.target.value })); 
                                if (e.target.value) handleRequiredBlur('base_unit'); 
                            }}
                            onBlur={() => handleRequiredBlur('base_unit')}
                            className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                (getRequiredError('base_unit') || errors.base_unit) ? 'border-red-500' : ''
                            }`}
                            required
                        >
                            <option value="" disabled>Select base unit</option>
                            <option value="kg">Kilogram (kg)</option>
                            <option value="liter">Liter</option>
                            
                        </select>
                        {getRequiredError('base_unit') && (
                            <p className="mt-1 text-sm text-red-600">{getRequiredError('base_unit')}</p>
                        )}
                        {(!getRequiredError('base_unit') && errors.base_unit) && (
                            <p className="mt-1 text-sm text-red-600">{errors.base_unit}</p>
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
                                value={formData.price_per_unit}
                                onChange={handlePriceChange}
                                onBlur={() => handleRequiredBlur('price_per_unit')}
                                className={`mt-1 block w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                    (getRequiredError('price_per_unit') || priceError || errors.price_per_unit) ? 'border-red-500' : ''
                                }`}
                                placeholder="0.01"
                                required
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Valid range: ₱0.01–₱99,999.99</p>
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

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4">
                <Link
                    href={onCancel || route('items.index')}
                    className="rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-400"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="rounded-md bg-[#37692F] px-4 py-2 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#2a5624]"
                >
                    {processing ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Item' : 'Create Item')}
                </button>
            </div>
        </form>
    );
}