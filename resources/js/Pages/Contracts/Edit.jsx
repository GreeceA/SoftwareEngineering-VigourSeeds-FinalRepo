import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ContractForm from './ContractForm';

export default function Edit({ auth, partners, seeds, contract }) {
    const isFinalState = contract.status === 'terminated' || contract.status === 'cancelled' || contract.status === 'completed';
    const isEditable = contract.can_be_edited || contract.can_be_partially_edited;

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
            <Head title={`Edit Contract: ${contract.contract_name}`} />

            {isFinalState && !isEditable && (
                <div className="p-6">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                        <p className="font-bold">Contract is Closed</p>
                        <p>This contract is in **{contract.status.toUpperCase()}** status and cannot be modified. It is locked for historical purposes.</p>
                        <Link href={route('contracts.show', contract.id)} className="text-red-500 underline mt-2 block">View Details</Link>
                    </div>
                </div>
            )}

            {contract.can_be_partially_edited && !contract.can_be_edited && (
                <div className="p-6">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4" role="alert">
                        <p className="font-bold">Partial Editing Mode</p>
                        <p>
                            This contract is in <strong>{contract.status.toUpperCase()}</strong> status.<br />
                            You can only edit: Notes, Expiration Date, Buyback Price, Planting/Harvest Dates, and Expected Buyback Amount.
                        </p>
                    </div>
                </div>
            )}

            <ContractForm
                partners={partners}
                seeds={seeds}
                contract={contract}
            />
        </AuthenticatedLayout>
    );
}