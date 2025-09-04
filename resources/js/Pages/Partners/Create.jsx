import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PartnerForm from './PartnerForm';

export default function Create({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Create Partner</span>
                </h2>
            }
        >
            <Head title="Create Partner" />
            <PartnerForm auth={auth} />
        </AuthenticatedLayout>
    );
}