import React from 'react';
import { Head, Link } from '@inertiajs/react'; // Added Link just in case for better practice
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ContractForm from './ContractForm';

export default function Create({ auth, partners, seeds }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Create Contract</span>
                </h2>
            }
        >
            <Head title="Create Contract" />
            
            {/* The ContractForm component now handles the breadcrumb and content wrapper */}
            <ContractForm partners={partners} seeds={seeds} />
            
        </AuthenticatedLayout>
    );
}