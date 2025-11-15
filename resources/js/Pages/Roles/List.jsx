import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import dayjs from "dayjs";

export default function List() {
    const { flash, roles, auth } = usePage().props;
    
    // Get user permissions (same way as in AuthenticatedLayout)
    const permissions = auth?.user?.can || [];

    // Core roles that cannot be deleted (removed 'manager')
    const protectedRoles = ['admin', 'employee'];

      const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(route('roles.destroy', id));
        }
    };

return (
        <AuthenticatedLayout>
        <Head title="Roles" />

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
                    <span className="text-[#37692F] font-medium">Roles</span>
                </nav>

                {/* Header Content */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Title & Description */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">User Roles</h1>
                            <p className="text-gray-600">Manage user roles and their permissions</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Stats Badge */}
                        <div className="hidden sm:flex items-center space-x-2 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="text-sm font-medium text-purple-700">{roles?.data?.length || 0} Roles</span>
                        </div>

                        {/* Create button */}
                        {permissions.includes('create roles') && (
                            <Link
                                href={route('roles.create')}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#37692F] to-[#4a8a3f] text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Role
                            </Link>
                        )}
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
                                <th className="px-6 py-4 text-left text-white">Role Name</th>
                                <th className="px-6 py-4 text-left text-white">Permissions</th>
                                <th className="px-6 py-4 text-left text-white">Created At</th>
                                <th className="px-6 py-4 text-center text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {roles?.data?.length > 0 ? (
                                roles.data.map((role) => (
                                    <tr key={role.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{role.id}</td>
                                        <td className="px-6 py-4">{role.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions?.map((permission) => (
                                                    <span
                                                        key={permission.id}
                                                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700"
                                                    >
                                                        {permission.name}
                                                    </span>
                                                ))}
                                                {role.permissions?.length === 0 && (
                                                    <span className="text-gray-400 text-sm">No permissions assigned</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {dayjs(role.created_at).format("MMMM D, YYYY h:mm A")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center space-x-2">
                                                {/* Edit button - only show if user has permission AND it's not a protected role */}
                                                {permissions.includes('edit roles') && !protectedRoles.includes(role.name) && (
                                                    <Link
                                                        href={route('roles.edit', role.id)}
                                                        className="inline-flex items-center justify-center bg-slate-600 text-sm rounded-md text-white px-4 py-2 min-w-[70px] hover:bg-slate-700"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                                {/* Delete button - only show if user has permission AND it's not a protected role */}
                                                {permissions.includes('delete roles') && !protectedRoles.includes(role.name) && (
                                                    <button
                                                        onClick={() => handleDelete(role.id)}
                                                        className="inline-flex items-center justify-center bg-red-600 text-sm rounded-md text-white px-4 py-2 min-w-[70px] hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                )}

                                                {/* Show "Core" label for protected roles */}
                                                {protectedRoles.includes(role.name) && (
                                                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-sm rounded-md px-4 py-2 min-w-[70px] font-medium">
                                                        Core
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No roles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            {roles.links && (
                <div className="mt-4 flex items-center justify-between px-4">
                    {/* Left side - Current page info */}
                    <div className="text-sm text-gray-500">
                        Page {roles.current_page} of {roles.last_page}
                    </div>
                    
                    {/* Right side - Navigation buttons */}
                    <div className="flex space-x-1">
                        {roles.links.map((link, index) => (
                            // Skip rendering the "middle" links that show page numbers
                            (index === 0 || index === roles.links.length - 1) && (
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
