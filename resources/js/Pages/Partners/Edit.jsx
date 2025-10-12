import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PartnerForm from './PartnerForm';

export default function Edit({ auth, partner }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Edit Partner</span>
                </h2>
            }
        >
            <Head title="Edit Partner" />
            <PartnerForm partner={partner} />
        </AuthenticatedLayout>
    );
}