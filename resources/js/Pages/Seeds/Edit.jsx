import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SeedForm from "@/Pages/Seeds/SeedForm.jsx";

export default function Edit({ auth, seed }) {
    const { data, setData, put, processing, errors } = useForm({
        seed_variety: seed.seed_variety || '',
        price_per_unit: seed.price_per_unit || '',
        growth_cycle: seed.growth_cycle || '',
        storage_requirements: seed.storage_requirements || '',
        soil_type: seed.soil_type || '',
        notes: seed.notes || '',
        status: seed.status || 'active' 
    });

    const handleSubmit = () => {
        put(route('seeds.update', seed.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Edit Seed</span>
                </h2>
            }
        >
            <Head title={`Edit ${seed.seed_variety}`} />
            
            <div className="p-6">
                <div className="px-6 pt-6">
                    <nav className="text-sm text-gray-600">
                        <Link
                            href={route('dashboard')}
                            className="text-[#37692F] hover:underline"
                        >
                            Home
                        </Link>{" "}
                        / <Link href={route('seeds.index')} className="text-[#37692F] hover:underline">Seeds</Link> / <span>Edit Seed</span>
                    </nav>
                </div>

                <div className="mt-4 rounded-lg bg-white p-6 shadow-lg">
                    <h1 className="mb-6 text-2xl font-semibold text-gray-800">
                        Edit Seed
                    </h1>

                    <SeedForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmit}
                        submitLabel="Update Seed"
                        cancelRoute={route('seeds.index')}
                        isEdit={true}
                        seedId={seed.id}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}