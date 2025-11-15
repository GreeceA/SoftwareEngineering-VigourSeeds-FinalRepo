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
        <AuthenticatedLayout>
            <Head title="Create Role" />

            {/* Modern Page Header */}
            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white border-b border-gray-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative px-6 py-6">
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
                        <Link href={route('roles.index')} className="text-gray-500 hover:text-[#37692F] transition-colors duration-200">
                            Roles
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#37692F] font-medium">Create Role</span>
                    </nav>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Create New Role</h1>
                                <p className="text-gray-600">Define a new role and assign permissions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

                                <div className="mb-6">
                                    <label className="block mb-3 text-sm font-bold text-gray-700">
                                        Permissions
                                    </label>
                                    
                                    {/* Group permissions by resource */}
                                    {['users', 'roles', 'permissions', 'partners', 'seeds', 'items', 'contracts', 'inventory', 'field visit'].map((resource) => {
                                        const resourcePermissions = permissions?.filter(p => 
                                            p.name.includes(resource)
                                        ).sort((a, b) => {
                                            const order = ['view', 'create', 'edit', 'archive', 'deactivate', 'delete'];
                                            const aAction = a.name.split(' ')[0];
                                            const bAction = b.name.split(' ')[0];
                                            return order.indexOf(aAction) - order.indexOf(bAction);
                                        });

                                        if (!resourcePermissions || resourcePermissions.length === 0) return null;

                                        return (
                                            <div key={resource} className="mb-4 border rounded-lg p-4 bg-gray-50">
                                                <h3 className="text-sm font-semibold text-gray-800 mb-3 capitalize">
                                                    {resource} Management
                                                </h3>
                                                <div className="grid grid-cols-4 gap-3">
                                                    {resourcePermissions.map((permission) => (
                                                        <div className="flex items-center" key={permission.id}>
                                                            <input
                                                                type="checkbox"
                                                                id={`permission-${permission.id}`}
                                                                className="rounded text-green-600 focus:ring-green-500"
                                                                checked={data.permissions.includes(permission.name)}
                                                                onChange={() => handlePermissionChange(permission.name)}
                                                            />
                                                            <label
                                                                htmlFor={`permission-${permission.id}`}
                                                                className="ml-2 text-sm text-gray-700 cursor-pointer"
                                                            >
                                                                {permission.name.split(' ')[0]}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
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