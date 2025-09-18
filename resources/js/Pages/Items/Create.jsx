import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: '',
        description: '',
        base_unit: '',
        price_per_unit: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('items.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Create Item</span>
                </h2>
            }
        >
            <Head title="Create Item" />
            
            <div className="p-6">
                {/* Breadcrumb */}
                <div className="px-6 pt-6">
                    <nav className="text-sm text-gray-600">
                        <Link
                            href="http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/dashboard"
                            className="text-[#37692F] hover:underline"
                        >
                            Home
                        </Link>{" "}
                        / <Link href={route('items.index')} className="text-[#37692F] hover:underline">Items</Link> / <span>Create Item</span>
                    </nav>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                        Create New Item
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Add a new fertilizer or pesticide to your inventory
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                Basic Information
                            </h2>
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
                                        onChange={(e) => {
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
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                Description
                            </h2>
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
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                Unit and Pricing
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Base Unit *
                                    </label>
                                    <select
                                        value={data.base_unit}
                                        onChange={(e) => setData('base_unit', e.target.value)}
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

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-2 pt-4">
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
                                {processing ? 'Creating...' : 'Create Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}