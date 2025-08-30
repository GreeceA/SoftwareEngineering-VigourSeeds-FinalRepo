import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PartnerForm from './PartnerForm';

export default function Edit({ auth, partner }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit ${partner.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">Edit Partner: {partner.name}</h1>
                            <PartnerForm partner={partner} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}