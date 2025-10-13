import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ItemForm from "@/Pages/Items/ItemForm.jsx";


export default function Create({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Create Item</span>
                </h2>
            }
        >
            <Head title="Create Item" />
            
            <div className="p-6">
                {/* Breadcrumb */}
                <div className="px-6 pt-6">
                    <nav className="text-sm text-gray-600">
                        <Link
                            href={route('dashboard')}
                            className="text-[#37692F] hover:underline"
                        >
                            Home
                        </Link>{" "}
                        / <Link href={route('items.index')} className="text-[#37692F] hover:underline">Items</Link> / <span>Create Item</span>
                    </nav>
                </div>

                <div className="mt-4 rounded-lg bg-white p-6 shadow-lg">
                    <h1 className="mb-6 text-2xl font-semibold text-gray-800">
                        Create New Item
                    </h1>
                    <p className="mb-6 text-sm text-gray-600">
                        Add a new fertilizer or pesticide to your inventory
                    </p>

                    <ItemForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}