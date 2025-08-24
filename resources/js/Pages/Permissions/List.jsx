import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import dayjs from "dayjs";

export default function List() {
    const { flash, permissions } = usePage().props; 

    const handleDelete = (id) => {
        // Use the native confirm dialog
        if (confirm("Are you sure you want to delete this permission?")) {
            router.delete(route('permissions.destroy', id), {
                onSuccess: () => {
                    console.log('Permission deleted successfully');
                },
                onError: () => {
                    console.log('Failed to delete permission');
                },
            });
        }
    };

return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Permissions
                    </h2>
                    <Link
                        href={route('permissions.create')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Create
                    </Link>
                </div>
            }
        >
        <Head title="Permissions" />

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

                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr className="border-b">
                            <th className="px-6 py-3 text-left" width="60">#</th>
                            <th className="px-6 py-3 text-left">Permission Name</th>
                            <th className="px-6 py-3 text-left" width="240">Created At</th>
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {permissions?.data?.length > 0 ? (
                            permissions.data.map((permission) => (
                                <tr key={permission.id} className="border-b">
                                    <td className="px-6 py-3 text-left">{permission.id}</td>
                                    <td className="px-6 py-3 text-left">{permission.name}</td>
                                    <td className="px-6 py-3 text-left">
                                        {dayjs(permission.created_at).format("MMMM D, YYYY h:mm A")}
                                </td>
                                <td className="px-6 py-3 text-center">
            
                                    <Link
                                        href={route('permissions.edit', permission.id)}
                                        className="bg-slate-600 text-sm rounded-md text-white px-3 py-2 hover:bg-slate-700"
                                    >
                                        Edit
                                    </Link>
                                    {" "}
                                    <button
                                        onClick={() => handleDelete(permission.id)}
                                        className="bg-red-600 text-sm rounded-md text-white px-3 py-2 hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-3 text-center text-gray-500">
                                    No permissions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
