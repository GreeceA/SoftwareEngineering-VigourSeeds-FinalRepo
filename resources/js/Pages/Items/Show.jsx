import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, item }) {
    const { auth: authData } = usePage().props;
    const permissions = authData?.user?.can || [];

    // Static contract data for demonstration
    const recentInventoryLogs = [
        {
            id: 1,
            date: "2024-10-10",
            transaction_type: "inbound",
            quantity: 500.00,
            unit: "kg",
            user: "Jane Doe"
        },
        {
            id: 2,
            date: "2024-10-05",
            transaction_type: "outbound",
            quantity: 120.50,
            unit: "kg",
            user: "John Smith"
        },
        {
            id: 3,
            date: "2024-09-28",
            transaction_type: "adjustment",
            quantity: -5.00,
            unit: "kg",
            user: "Admin User"
        }
    ];

    // Helper to format currency for display
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(price);
    };

    // Helper to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Helper to style log type
    const getTransactionColor = (type) => {
        switch (type) {
            case 'inbound':
                return 'bg-blue-100 text-blue-700';
            case 'outbound':
                return 'bg-orange-100 text-orange-700';
            case 'adjustment':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Item Details</span>
                </h2>
            }
        >
            <Head title={`Item: ${item.name}`} />

            {/* Breadcrumb */}
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
                        href={route('items.index')}
                        className="text-[#37692F] hover:underline"
                    >
                        Items
                    </Link>{" "}
                    / <span>{item.name}</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Item Information</h1>
                    <div className="flex space-x-3">
                        {permissions.includes('edit items') && item.status === 'active' && (
                            <Link
                                href={route('items.edit', item.id)}
                                className="bg-[#37692F] text-white px-4 py-2 rounded-md hover:bg-[#2a5624] flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Item
                            </Link>
                        )}
                        <Link
                            href={route('items.index')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to List
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Basic Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{item.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-poppins font-normal ${
                                    item.status === 'active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">₱{item.price_per_unit} / {item.base_unit}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                                <p className="text-sm text-gray-900 font-poppins font-normal">{item.type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Empty column to maintain grid layout */}
                    <div></div>

                    {/* Description Card */}
                    {item.description && (
                        <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Description</h2>
                            <p className="text-sm text-gray-900 font-poppins font-normal whitespace-pre-wrap">{item.description}</p>
                        </div>
                    )}

                    {/* 👇 RENAMED AND MODIFIED: Recent Inventory Logs Card */}
                    <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Recent Inventory Logs</h2>
                        
                        {recentInventoryLogs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 font-poppins font-medium">Date</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Type</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Quantity</th>
                                            <th className="px-4 py-3 font-poppins font-medium">Recorded By</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {recentInventoryLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {formatDate(log.date)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-poppins font-normal ${getTransactionColor(log.transaction_type)}`}>
                                                        {log.transaction_type.charAt(0).toUpperCase() + log.transaction_type.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-900">
                                                    {/* Display quantity with its unit */}
                                                    <span className="font-semibold">{log.quantity}</span> {log.unit}
                                                </td>
                                                <td className="px-4 py-3 font-poppins font-normal text-gray-600">
                                                    {log.user}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 font-poppins font-normal">No inventory logs found for this item.</p>
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-6 text-sm text-gray-500 font-poppins font-normal">
                    <p>Created: {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}</p>
                    <p>Last Updated: {new Date(item.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}