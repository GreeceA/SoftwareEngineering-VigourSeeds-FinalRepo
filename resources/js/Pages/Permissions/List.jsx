import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import dayjs from "dayjs";

export default function List() {
    const { flash, permissions, auth } = usePage().props;
    
    // Get user permissions (same way as in other components)
    const userPermissions = auth?.user?.can || [];

    return (
        <AuthenticatedLayout>
            <Head title="Permissions" />

            {/* Modern Page Header with Integrated Breadcrumb */}
            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white border-b border-gray-200 overflow-hidden">
                {/* Subtle decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative px-6 py-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm mb-4">
                        <a href={route('dashboard')} className="text-gray-500 hover:text-[#37692F] transition-colors duration-200 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </a>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <a href={route('users.index')} className="text-gray-500 hover:text-[#37692F] transition-colors duration-200">
                            Users
                        </a>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#37692F] font-medium">Permissions</span>
                    </nav>

                    {/* Header Content */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Title & Description */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">User Permissions</h1>
                                <p className="text-gray-600">Manage system permissions and access controls</p>
                            </div>
                        </div>

                        {/* Stats Badge */}
                        <div className="hidden sm:flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-blue-700">{permissions?.data?.length || 0} Permissions</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="bg-green-200 border-l-4 border-green-600 p-4 mb-3 rounded-sm shadow-sm">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="bg-red-200 border-l-4 border-red-600 p-4 mb-3 rounded-sm shadow-sm">
                            {flash.error}
                        </div>
                    )}

                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                        <table className="w-full">
                            <thead className="bg-[#37692F]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-white">#</th>
                                    <th className="px-6 py-4 text-left text-white">Permission Name</th>
                                    <th className="px-6 py-4 text-left text-white">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {permissions?.data?.length > 0 ? (
                                    permissions.data.map((permission) => (
                                        <tr key={permission.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">{permission.id}</td>
                                            <td className="px-6 py-4">{permission.name}</td>
                                            <td className="px-6 py-4">
                                                {dayjs(permission.created_at).format("MMMM D, YYYY h:mm A")}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                            No permissions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {permissions.links && (
                        <div className="mt-4 flex items-center justify-between px-4">
                            {/* Left side - Current page info */}
                            <div className="text-sm text-gray-500">
                                Page {permissions.current_page} of {permissions.last_page}
                            </div>
                            
                            {/* Right side - Navigation buttons */}
                            <div className="flex space-x-1">
                                {permissions.links.map((link, index) => (
                                    // Skip rendering the "middle" links that show page numbers
                                    (index === 0 || index === permissions.links.length - 1) && (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                link.active
                                                    ? 'bg-gray-200 text-gray-700'
                                                    : link.url 
                                                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                            }`}
                                            preserveScroll
                                        >
                                            {index === 0 ? 'Previous' : 'Next'}
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
