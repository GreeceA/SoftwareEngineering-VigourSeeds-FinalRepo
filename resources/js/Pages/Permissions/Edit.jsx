import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';

export default function Edit() {
    const { permission } = usePage().props;
    
    const { data, setData, put, processing, errors } = useForm({
        name: permission.name || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('permissions.update', permission.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Permission
                    </h2>
                    <Link
                        href={route('permissions.index')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow hover:bg-green-700"
                    >
                        Back to Permissions
                    </Link>
                </div>
            }
        >
            <Head title="Edit Permission" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="name">
                                        Permission Name
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

                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                                        disabled={processing}
                                    >
                                        Update Permission
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
