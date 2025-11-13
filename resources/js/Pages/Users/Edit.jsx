import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import '../../../css/fonts.css';
import { router } from '@inertiajs/react';

export default function Edit({ auth, user, roles = [], userRoles = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        roles: userRoles.map(role => role.id) || [], 
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const letterOnly = (value) => value.replace(/[^A-Za-z\s]/g, '');
    const handleSubmit = (e) => {
        e.preventDefault();
        setData('first_name', letterOnly(data.first_name));
        setData('last_name', letterOnly(data.last_name));
        put(route('users.update', user.id), {
            onSuccess: () => {
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000);
                router.get(route('users.index'));
            },
        });
    };

    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Edit User</span>
                </h2>
            }
        >
            <Head title="Edit User" />

            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href="/dashboard"
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / {" "}
                    <Link
                        href={route('users.index')}
                        className="text-[#37692F] hover:underline"
                    >
                        Users
                    </Link>{" "}
                    / <span>Edit User</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Success Message */}
                {showSuccessMessage && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        User updated successfully!
                    </div>
                )}

                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Edit User Information
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Update user details and role information
                        </p>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* User Info Display */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                Current User Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-600">Email:</span>
                                    <span className="ml-2 text-gray-800">{user.email}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Status:</span>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                        user.status === 'active' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {user.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Joined:</span>
                                    <span className="ml-2 text-gray-800">
                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Editable Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', letterOnly(e.target.value))}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-transparent ${
                                        errors.first_name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter first name"
                                    required
                                />
                                {errors.first_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', letterOnly(e.target.value))}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-transparent ${
                                        errors.last_name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter last name"
                                    required
                                />
                                {errors.last_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="roles" className="block text-sm font-medium text-gray-700 mb-2">
                                Roles <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2 border border-gray-300 rounded-md p-3">
                                {roles.map((role) => (
                                    <label key={role.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.roles.includes(role.id)}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setData('roles', isChecked
                                                    ? [...data.roles, role.id]
                                                    : data.roles.filter(r => r !== role.id)
                                                );
                                            }}
                                            className="rounded border-gray-300 text-[#37692F] shadow-sm focus:border-[#37692F] focus:ring focus:ring-[#37692F] focus:ring-opacity-50"
                                        />
                                        <span className="ml-2 text-gray-700">{role.name}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.roles && (
                                <p className="mt-1 text-sm text-red-600">{errors.roles}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <Link
                                href={route('users.index')}
                                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-[#37692F] text-white rounded-md hover:bg-[#2a5624] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {processing && (
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {processing ? 'Updating...' : 'Update User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}