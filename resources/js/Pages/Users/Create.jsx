import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import '../../../css/fonts.css';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Create({ roles = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        roles: [],
        email: '',
        password: '',
        password_confirmation: '',
        avatar: null,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const fileInputRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            forceFormData: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create User" />
            
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
                        <span className="text-[#37692F] font-medium">Create</span>
                    </nav>

                    {/* Header Content */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Title & Description */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Create New User</h1>
                                <p className="text-gray-600">Add a new user account with roles and permissions</p>
                            </div>
                        </div>

                        {/* Action Badge */}
                        <div className="hidden sm:flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700">Form Active</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-8 mx-auto max-w-7xl">
                <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="grid grid-cols-2 gap-10">
                        {/* Left Column */}
                        <div className="space-y-5">
                            {/* Profile Picture */}
                            <div>
                                <InputLabel 
                                    value="Profile Picture" 
                                    className="text-sm font-semibold text-gray-700 mb-3" 
                                />
                                <div className="flex flex-col items-center gap-3">
                                    <label className="cursor-pointer">
                                        <div className="w-44 h-44 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 hover:border-[#37692F] hover:shadow-md transition-all overflow-hidden">
                                            {data.avatar ? (
                                                <img 
                                                    src={URL.createObjectURL(data.avatar)} 
                                                    alt="Avatar preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Upload</span>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => setData('avatar', e.target.files[0])}
                                        />
                                    </label>
                                    {data.avatar && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData('avatar', null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors hover:bg-red-50 px-3 py-1.5 rounded-md"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* First Name */}
                            <div>
                                <InputLabel 
                                    htmlFor="first_name" 
                                    value="First Name" 
                                    className="text-sm font-semibold text-gray-700 mb-2" 
                                />
                                <TextInput
                                    id="first_name"
                                    name="first_name"
                                    value={data.first_name}
                                    className="block w-full border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] transition-all"
                                    autoComplete="given-name"
                                    isFocused={true}
                                    onChange={(e) => {
                                        const validValue = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                                        setData('first_name', validValue);
                                    }}
                                    required
                                />
                                <InputError message={errors.first_name} className="mt-1.5" />
                            </div>

                            {/* Last Name */}
                            <div>
                                <InputLabel 
                                    htmlFor="last_name" 
                                    value="Last Name" 
                                    className="text-sm font-semibold text-gray-700 mb-2" 
                                />
                                <TextInput
                                    id="last_name"
                                    name="last_name"
                                    value={data.last_name}
                                    className="block w-full border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] transition-all"
                                    autoComplete="family-name"
                                    onChange={(e) => {
                                        const validValue = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                                        setData('last_name', validValue);
                                    }}
                                    required
                                />
                                <InputError message={errors.last_name} className="mt-1.5" />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel 
                                    htmlFor="email" 
                                    value="Email" 
                                    className="text-sm font-semibold text-gray-700 mb-2" 
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] transition-all"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-1.5" />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                            {/* Roles */}
                            <div>
                                <InputLabel 
                                    htmlFor="roles" 
                                    value="Roles" 
                                    className="text-sm font-semibold text-gray-700 mb-3" 
                                />
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[280px] overflow-y-auto">
                                    <div className="space-y-3">
                                        {roles.map((role) => (
                                            <label key={role.id} className="flex items-center px-2 py-2 hover:bg-white rounded-md transition-colors cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={data.roles.includes(role.name)}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        setData('roles', isChecked
                                                            ? [...data.roles, role.name]
                                                            : data.roles.filter(r => r !== role.name)
                                                        );
                                                    }}
                                                    className="rounded border-gray-300 text-[#37692F] shadow-sm focus:border-[#37692F] focus:ring focus:ring-[#37692F] focus:ring-opacity-50 transition-all"
                                                />
                                                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 font-medium">{role.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <InputError message={errors.roles} className="mt-1.5" />
                            </div>

                            {/* Password */}
                            <div>
                                <InputLabel 
                                    htmlFor="password" 
                                    value="Password" 
                                    className="text-sm font-semibold text-gray-700 mb-2" 
                                />
                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="block w-full pr-10 border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] transition-all"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1/2 -translate-y-1/2 right-0 pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1.5" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                    className="text-sm font-semibold text-gray-700 mb-2" 
                                />
                                <div className="relative">
                                    <TextInput
                                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="block w-full pr-10 border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F] transition-all"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1/2 -translate-y-1/2 right-0 pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1.5" />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button - Full Width at Bottom */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            className="w-full bg-[#37692F] text-white py-3.5 px-6 rounded-lg font-semibold text-base hover:bg-[#2a5624] hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating User...
                                </span>
                            ) : (
                                'Create User'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
