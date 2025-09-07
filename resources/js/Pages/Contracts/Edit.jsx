// resources/js/Pages/Contracts/Edit.jsx
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, contract, partners, seedOptions, statusOptions }) {
    const { data, setData, post, processing, errors } = useForm({
        contract_title: contract.contract_title || '',
        partner_id: contract.partner_id || '',
        contract_file: null, // File uploads are always null initially for edits
        contract_date: contract.contract_date || '',
        effective_date: contract.effective_date || '',
        expiration_date: contract.expiration_date || '',
        seed: contract.seed || '',
        seed_quantity: contract.seed_quantity || '',
        unit_of_measurement: contract.unit_of_measurement || 'kg',
        expected_harvest_date: contract.expected_harvest_date || '',
        notes: contract.notes || '',
        status: contract.status || 'draft',
        _method: 'PUT'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contracts.update', contract.id));
    };

    const handleFileChange = (e) => {
        setData('contract_file', e.target.files[0]);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Contract: {contract.contract_title}
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
            <Head title="Edit Contract" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Contract Title */}
                                    <div className="col-span-2">
                                        <label htmlFor="contract_title" className="block text-sm font-medium text-gray-700">
                                            Contract Title *
                                        </label>
                                        <input
                                            type="text"
                                            id="contract_title"
                                            value={data.contract_title}
                                            onChange={(e) => setData('contract_title', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.contract_title && <p className="mt-1 text-sm text-red-600">{errors.contract_title}</p>}
                                    </div>

                                    {/* Partner */}
                                    <div>
                                        <label htmlFor="partner_id" className="block text-sm font-medium text-gray-700">
                                            Partner *
                                        </label>
                                        <select
                                            id="partner_id"
                                            value={data.partner_id}
                                            onChange={(e) => setData('partner_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="">Select a Partner</option>
                                            {partners.map((partner) => (
                                                <option key={partner.id} value={partner.id}>
                                                    {partner.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.partner_id && <p className="mt-1 text-sm text-red-600">{errors.partner_id}</p>}
                                    </div>

                                    {/* Contract File */}
                                    <div>
                                        <label htmlFor="contract_file" className="block text-sm font-medium text-gray-700">
                                            Contract File
                                        </label>
                                        <div className="mt-1">
                                            <div className="mb-2 p-2 bg-gray-50 rounded">
                                                <p className="text-sm text-gray-600">
                                                    Current file: <span className="font-medium">{contract.contract_file?.split('/').pop()}</span>
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                id="contract_file"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <p className="mt-1 text-sm text-gray-500">Leave empty to keep current file. PDF, DOC, or DOCX files only. Max 10MB.</p>
                                        </div>
                                        {errors.contract_file && <p className="mt-1 text-sm text-red-600">{errors.contract_file}</p>}
                                    </div>

                                    {/* Contract Date */}
                                    <div>
                                        <label htmlFor="contract_date" className="block text-sm font-medium text-gray-700">
                                            Contract Date *
                                        </label>
                                        <input
                                            type="date"
                                            id="contract_date"
                                            value={data.contract_date}
                                            onChange={(e) => setData('contract_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.contract_date && <p className="mt-1 text-sm text-red-600">{errors.contract_date}</p>}
                                    </div>

                                    {/* Effective Date */}
                                    <div>
                                        <label htmlFor="effective_date" className="block text-sm font-medium text-gray-700">
                                            Effective Date *
                                        </label>
                                        <input
                                            type="date"
                                            id="effective_date"
                                            value={data.effective_date}
                                            onChange={(e) => setData('effective_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.effective_date && <p className="mt-1 text-sm text-red-600">{errors.effective_date}</p>}
                                    </div>

                                    {/* Expiration Date */}
                                    <div>
                                        <label htmlFor="expiration_date" className="block text-sm font-medium text-gray-700">
                                            Expiration Date *
                                        </label>
                                        <input
                                            type="date"
                                            id="expiration_date"
                                            value={data.expiration_date}
                                            onChange={(e) => setData('expiration_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.expiration_date && <p className="mt-1 text-sm text-red-600">{errors.expiration_date}</p>}
                                    </div>

                                    {/* Seed */}
                                    <div>
                                        <label htmlFor="seed" className="block text-sm font-medium text-gray-700">
                                            Seed Type *
                                        </label>
                                        <select
                                            id="seed"
                                            value={data.seed}
                                            onChange={(e) => setData('seed', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="">Select Seed Type</option>
                                            {seedOptions.map((seed) => (
                                                <option key={seed} value={seed}>
                                                    {seed}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.seed && <p className="mt-1 text-sm text-red-600">{errors.seed}</p>}
                                    </div>

                                    {/* Seed Quantity */}
                                    <div>
                                        <label htmlFor="seed_quantity" className="block text-sm font-medium text-gray-700">
                                            Seed Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            id="seed_quantity"
                                            value={data.seed_quantity}
                                            onChange={(e) => setData('seed_quantity', e.target.value)}
                                            min="1"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.seed_quantity && <p className="mt-1 text-sm text-red-600">{errors.seed_quantity}</p>}
                                    </div>

                                    {/* Unit of Measurement */}
                                    <div>
                                        <label htmlFor="unit_of_measurement" className="block text-sm font-medium text-gray-700">
                                            Unit of Measurement *
                                        </label>
                                        <select
                                            id="unit_of_measurement"
                                            value={data.unit_of_measurement}
                                            onChange={(e) => setData('unit_of_measurement', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="kg">Kilograms (kg)</option>
                                            <option value="tons">Tons</option>
                                            <option value="sacks">Sacks</option>
                                            <option value="lbs">Pounds (lbs)</option>
                                        </select>
                                        {errors.unit_of_measurement && <p className="mt-1 text-sm text-red-600">{errors.unit_of_measurement}</p>}
                                    </div>

                                    {/* Expected Harvest Date */}
                                    <div>
                                        <label htmlFor="expected_harvest_date" className="block text-sm font-medium text-gray-700">
                                            Expected Harvest Date *
                                        </label>
                                        <input
                                            type="date"
                                            id="expected_harvest_date"
                                            value={data.expected_harvest_date}
                                            onChange={(e) => setData('expected_harvest_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.expected_harvest_date && <p className="mt-1 text-sm text-red-600">{errors.expected_harvest_date}</p>}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            {Object.entries(statusOptions).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                    </div>

                                    {/* Notes */}
                                    <div className="col-span-2">
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                            Notes
                                        </label>
                                        <textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows="4"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Additional notes or comments about the contract..."
                                        />
                                        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="mt-6 flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('contracts.index')}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update Contract'}
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