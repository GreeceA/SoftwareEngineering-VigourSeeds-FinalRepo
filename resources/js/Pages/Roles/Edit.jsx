import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';

export default function Edit() {
    const { role, permissions } = usePage().props;
    
    const { data, setData, put, processing, errors } = useForm({
        name: role.name || '',
        permissions: role.permissions?.map(p => p.name) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('roles.update', role.id));
    };

    const handlePermissionChange = (permissionName) => {
        const updatedPermissions = data.permissions.includes(permissionName)
            ? data.permissions.filter(p => p !== permissionName)
            : [...data.permissions, permissionName];
        
        setData('permissions', updatedPermissions);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Role
                    </h2>
                    <Link
                        href={route('roles.index')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow hover:bg-green-700"
                    >
                        Back to Roles
                    </Link>
                </div>
            }
        >
            <Head title="Edit Role" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="name">
                                        Role Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-700"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && (
                                        <div className="text-sm text-red-600">{errors.name}</div>
                                    )}
                                </div>

                                {/* Permissions Table */}
                                <div className="mb-6">
                                    <label className="block mb-4 text-sm font-bold text-gray-700">
                                        Permissions
                                    </label>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Category</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">View</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Create</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Edit</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Delete/Archive</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Users Row */}
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 font-medium bg-blue-50">Users</td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('view users')}
                                                            onChange={() => handlePermissionChange('view users')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('create users')}
                                                            onChange={() => handlePermissionChange('create users')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('edit users')}
                                                            onChange={() => handlePermissionChange('edit users')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('deactivate users')}
                                                            onChange={() => handlePermissionChange('deactivate users')}
                                                        />
                                                    </td>
                                                </tr>

                                                {/* Partners Row */}
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 font-medium bg-green-50">Partners</td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('view partners')}
                                                            onChange={() => handlePermissionChange('view partners')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('create partners')}
                                                            onChange={() => handlePermissionChange('create partners')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('edit partners')}
                                                            onChange={() => handlePermissionChange('edit partners')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('archive partners')}
                                                            onChange={() => handlePermissionChange('archive partners')}
                                                        />
                                                    </td>
                                                </tr>

                                                {/* Seeds Row */}
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 font-medium bg-yellow-50">Seeds</td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('view seeds')}
                                                            onChange={() => handlePermissionChange('view seeds')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('create seeds')}
                                                            onChange={() => handlePermissionChange('create seeds')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('edit seeds')}
                                                            onChange={() => handlePermissionChange('edit seeds')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('archive seeds')}
                                                            onChange={() => handlePermissionChange('archive seeds')}
                                                        />
                                                    </td>
                                                </tr>

                                                {/* Items Row */}
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 font-medium bg-purple-50">Items</td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('view items')}
                                                            onChange={() => handlePermissionChange('view items')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('create items')}
                                                            onChange={() => handlePermissionChange('create items')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('edit items')}
                                                            onChange={() => handlePermissionChange('edit items')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('archive items')}
                                                            onChange={() => handlePermissionChange('archive items')}
                                                        />
                                                    </td>
                                                </tr>

                                                {/* Contracts Row */}
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 font-medium bg-orange-50">Contracts</td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('view contracts')}
                                                            onChange={() => handlePermissionChange('view contracts')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('create contracts')}
                                                            onChange={() => handlePermissionChange('create contracts')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('edit contracts')}
                                                            onChange={() => handlePermissionChange('edit contracts')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('archive contracts')}
                                                            onChange={() => handlePermissionChange('archive contracts')}
                                                        />
                                                    </td>
                                                </tr>

                                                {/* System Management Row */}
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-50">Roles</td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('view roles')}
                                                            onChange={() => handlePermissionChange('view roles')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('create roles')}
                                                            onChange={() => handlePermissionChange('create roles')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('edit roles')}
                                                            onChange={() => handlePermissionChange('edit roles')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('delete roles')}
                                                            onChange={() => handlePermissionChange('delete roles')}
                                                        />
                                                    </td>
                                                </tr>

                                                {/* Permissions Row */}
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-50">Permissions</td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={data.permissions.includes('view permissions')}
                                                            onChange={() => handlePermissionChange('view permissions')}
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <span className="text-gray-400">N/A</span>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <span className="text-gray-400">N/A</span>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <span className="text-gray-400">N/A</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                                        disabled={processing}
                                    >
                                        Update Role
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}