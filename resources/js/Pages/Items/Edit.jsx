import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ItemForm from "@/Pages/Items/ItemForm.jsx";

export default function Edit({ auth, item }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Edit Item</span>
                </h2>
            }
        >
            <Head title={`Edit ${item.name}`} />
            
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
                        / <Link href={route('items.index')} className="text-[#37692F] hover:underline">Items</Link> / <span>Edit Item</span>
                    </nav>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        Edit Item
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Update the details for "{item.name}"
                    </p>

                    <ItemForm item={item} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}