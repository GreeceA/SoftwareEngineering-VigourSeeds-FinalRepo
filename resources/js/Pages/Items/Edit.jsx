import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, item }) {
    const { data, setData, put, processing, errors } = useForm({
        name: item.name || '',
        type: item.type || '',
        description: item.description || '',
        base_unit: item.base_unit || '',
        price_per_unit: item.price_per_unit || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('items.update', item.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Edit Item</span>
                </h2>
            }
        >
            <Head title={`Edit ${item.name}`} />
            
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
                        / <Link href={route('items.index')} className="text-[#37692F] hover:underline">Items</Link> / <span>Edit Item</span>
                    </nav>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        Edit Item
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Update the details for "{item.name}"
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Item Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                            errors.name ? 'border-red-500' : ''
                                        }`}
                                        placeholder="Enter item name"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Item Type *
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={e => {
                                            setData('type', e.target.value);
                                            setData('base_unit', ''); // reset base unit when type changes
                                        }}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                            errors.type ? 'border-red-500' : ''
                                        }`}
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="fertilizer">Fertilizer</option>
                                        <option value="pesticide">Pesticide</option>
                                    </select>
                                    {errors.type && (
                                        <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Item Description *
                                </label>
                                <textarea
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                        errors.description ? 'border-red-500' : ''
                                    }`}
                                    placeholder="Enter item description"
                                    required
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Unit and Pricing */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Unit and Pricing</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Base Unit *
                                    </label>
                                    <select
                                        value={data.base_unit}
                                        onChange={e => setData('base_unit', e.target.value)}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                            errors.base_unit ? 'border-red-500' : ''
                                        }`}
                                        required
                                        disabled={!data.type}
                                    >
                                        <option value="">Select base unit</option>
                                        <option value="kg">Kilogram (kg)</option>
                                        {data.type === "pesticide" && (
                                            <option value="liter">Liter</option>
                                        )}
                                    </select>
                                    {errors.base_unit && (
                                        <p className="mt-1 text-sm text-red-600">{errors.base_unit}</p>
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
                                            min="0"
                                            value={data.price_per_unit}
                                            onChange={(e) => setData('price_per_unit', e.target.value)}
                                            className={`mt-1 block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] ${
                                                errors.price_per_unit ? 'border-red-500' : ''
                                            }`}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    {errors.price_per_unit && (
                                        <p className="mt-1 text-sm text-red-600">{errors.price_per_unit}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Item Status Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h2>
                            <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            item.status === 'active' 
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-700 font-medium">
                                            Current status: <span className="capitalize">{item.status}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Use the Archive/Activate buttons in the items list to change status.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-2 pt-6 border-t border-gray-200">
                            <Link
                                href={route('items.index')}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#37692F] hover:bg-[#2a5624] text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}