import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, seed }) {
    const { auth: authData } = usePage().props;
    const permissions = authData?.user?.can || [];

    // Static contract data for demonstration
    const associatedContracts = [
        {
            id: 1,
            contract_name: "Premium Seed Supply Agreement",
            status: "active",
            start_date: "2023-06-10",
            end_date: "2024-06-09",
            seed_amount: 500,
            unit: "kg"
        },
        {
            id: 2,
            contract_name: "Organic Seed Distribution",
            status: "inactive",
            start_date: "2022-03-15",
            end_date: "2023-03-14",
            seed_amount: 1200,
            unit: "sack"
        },
        {
            id: 3,
            contract_name: "Hybrid Seed Partnership",
            status: "active",
            start_date: "2023-09-01",
            end_date: "2024-08-31",
            seed_amount: 3.5,
            unit: "ton"
        }
    ];

    const dateFormatter = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Seed Details</span>
                </h2>
            }
        >
            <Head title={`Seed: ${seed.seed_variety}`} />
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    /{" "}
                    <Link
                        href={route('seeds.index')}
                        className="text-[#37692F] hover:underline"
                    >
                        Seeds
                    </Link>{" "}
                    / <span>{seed.seed_variety}</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Seed Information</h1>
                    <div className="flex space-x-3">
                        {permissions.includes('edit seeds') && seed.status !== 'archived' && (
                            <Link
                                href={route('seeds.edit', seed.id)}
                                className="flex items-center rounded-md bg-[#37692F] px-4 py-2 text-white hover:bg-[#2a5624]"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Seed
                            </Link>
                        )}
                        <Link
                            href={route('seeds.index')}
                            className="flex items-center rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to List
                        </Link>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Basic Information Card */}
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Basic Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Seed Variety</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{seed.seed_variety}</p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-poppins font-normal ${
                                    seed.status === 'active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {seed.status.charAt(0).toUpperCase() + seed.status.slice(1)}
                                </span>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Price per Kg</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">₱{seed.price_per_unit}</p>
                            </div>
                        </div>
                    </div>

                    {/* Growth Information Card */}
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Growth Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Growth Cycle</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{seed.growth_cycle} days</p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Soil Type Preference</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{seed.soil_type}</p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Storage Requirements</label>
                                <p className="font-poppins text-sm font-normal text-gray-900">{seed.storage_requirements}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes Card */}
                    {seed.notes && (
                        <div className="md:col-span-2 rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Notes</h2>
                            <p className="whitespace-pre-wrap font-poppins text-sm font-normal text-gray-900">{seed.notes}</p>
                        </div>
                    )}

                    {/* Associated Contracts Card */}
                    <div className="md:col-span-2 rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Associated Contracts</h2>
                        
                        {associatedContracts.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 font-poppins font-medium">Contract Name</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Status</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Duration</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Seed Amount</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {associatedContracts.map((contract) => (
                                            <tr key={contract.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {contract.contract_name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-poppins font-normal ${
                                                        contract.status === "active" 
                                                            ? "bg-green-100 text-green-700" 
                                                            : "bg-red-100 text-red-700"
                                                    }`}>
                                                        {contract.status === "active" ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-600">
                                                    {dateFormatter(contract.start_date)} - {dateFormatter(contract.end_date)}
                                                </td>
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {contract.seed_amount}
                                                </td>
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {contract.unit}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="font-poppins text-sm font-normal text-gray-500">No contracts associated with this partner.</p>
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-6 font-poppins text-sm font-normal text-gray-500">
                    <p>Created: {dateFormatter(seed.created_at)}</p>
                    <p>Last Updated: {dateFormatter(seed.updated_at)}</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}