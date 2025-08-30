import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PartnerForm from './PartnerForm';

export default function Create({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Partner" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">Create New Partner</h1>
                            <PartnerForm />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}