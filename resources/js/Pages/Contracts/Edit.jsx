import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ContractForm from './ContractForm';

export default function Edit({ auth, partners, seeds, contract }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Edit Contract</span>
                </h2>
            }
        >
            <Head title="Edit Contract" />
            <ContractForm partners={partners} seeds={seeds} contract={contract} />
        </AuthenticatedLayout>
    );
}