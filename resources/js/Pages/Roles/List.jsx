import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import dayjs from "dayjs";

export default function List() {
    const { flash, roles } = usePage().props;

      const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(route('roles.destroy', id));
        }
    };

return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Roles
                    </h2>
                    <Link
                        href={route('roles.create')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Create
                    </Link>
                </div>
            }
        >
        <Head title="Roles" />

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
                            <th className="px-6 py-3 text-left" width="180">Role Name</th>
                            <th className="px-6 py-3 text-left">Permissions</th>
                            <th className="px-6 py-3 text-left" width="240">Created At</th>
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {roles?.data?.length > 0 ? (
                            roles.data.map((role) => (
                                <tr key={role.id} className="border-b">
                                    <td className="px-6 py-3 text-left">{role.id}</td>
                                    <td className="px-6 py-3 text-left">{role.name}</td>
                                    <td className="px-6 py-3 text-left">
                                        <div className="flex flex-wrap gap-1 ">
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
                                    <td className="px-6 py-3 text-left">
                                        {dayjs(role.created_at).format("MMMM D, YYYY h:mm A")}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <Link
                                            href={route('roles.edit', role.id)}
                                            className="bg-slate-600 text-sm rounded-md text-white px-3 py-2 hover:bg-slate-700"
                                        >
                                            Edit
                                        </Link>
                                        {" "}
                                        <button
                                            onClick={() => handleDelete(role.id)}
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
                                    No roles found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
