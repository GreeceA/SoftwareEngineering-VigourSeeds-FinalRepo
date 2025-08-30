import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function PartnerForm({ partner = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        partner_type: partner?.partner_type || 'individual',
        name: partner?.name || '',
        contact_person: partner?.contact_person || '',
        email: partner?.email || '',
        phone: partner?.phone || '',
        address: partner?.address || '',
        registration_number: partner?.registration_number || '',
        tax_id: partner?.tax_id || '',
        notes: partner?.notes || '',
        status: partner?.status || 'active',
    });

    const submit = (e) => {
        e.preventDefault();

        if (partner) {
            put(route('partners.update', partner.id));
        } else {
            post(route('partners.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="partner_type" className="block text-sm font-medium text-gray-700">
                        Partner Type *
                    </label>
                    <select
                        id="partner_type"
                        value={data.partner_type}
                        onChange={(e) => setData('partner_type', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="individual">Individual</option>
                        <option value="organization">Organization</option>
                    </select>
                    {errors.partner_type && <p className="mt-1 text-sm text-red-600">{errors.partner_type}</p>}
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status *
                    </label>
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name *
                </label>
                <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {data.partner_type === 'organization' && (
                <div>
                    <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700">
                        Contact Person
                    </label>
                    <input
                        type="text"
                        id="contact_person"
                        value={data.contact_person}
                        onChange={(e) => setData('contact_person', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.contact_person && <p className="mt-1 text-sm text-red-600">{errors.contact_person}</p>}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address *
                </label>
                <textarea
                    id="address"
                    rows={3}
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700">
                        Registration Number
                    </label>
                    <input
                        type="text"
                        id="registration_number"
                        value={data.registration_number}
                        onChange={(e) => setData('registration_number', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="SEC/DTI/BIR Number"
                    />
                    {errors.registration_number && <p className="mt-1 text-sm text-red-600">{errors.registration_number}</p>}
                </div>

                <div>
                    <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700">
                        Tax ID
                    </label>
                    <input
                        type="text"
                        id="tax_id"
                        value={data.tax_id}
                        onChange={(e) => setData('tax_id', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.tax_id && <p className="mt-1 text-sm text-red-600">{errors.tax_id}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                </label>
                <textarea
                    id="notes"
                    rows={4}
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes about this partner..."
                />
                {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
            </div>

            <div className="flex justify-end space-x-2">
                <Link
                    href={route('partners.index')}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    {processing ? 'Saving...' : (partner ? 'Update Partner' : 'Create Partner')}
                </button>
            </div>
        </form>
    );
}