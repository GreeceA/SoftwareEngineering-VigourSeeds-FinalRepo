import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ permissions }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('roles.store'));
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
                        Roles / Create
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
            <Head title="Create Role" />

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

                                <div className="flex flex-wrap gap-4 mb-3">
                                {permissions
                                    ?.slice() 
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((permission) => (
                                        <div className="flex items-center" key={permission.id}>
                                            <input
                                                type="checkbox"
                                                id={`permission-${permission.id}`}
                                                className="rounded"
                                                checked={data.permissions.includes(permission.name)}
                                                onChange={() => handlePermissionChange(permission.name)}
                                            />
                                            <label
                                                htmlFor={`permission-${permission.id}`}
                                                className="ml-2 text-sm text-gray-700"
                                            >
                                                {permission.name}
                                            </label>
                                        </div>
                                    ))}
                            </div>

                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                                        disabled={processing}
                                    >
                                        Create Role
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