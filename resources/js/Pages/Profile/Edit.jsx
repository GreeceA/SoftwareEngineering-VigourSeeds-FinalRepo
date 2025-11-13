import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;

    const memberSince = user.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
        : '';

    const { data, setData, post, processing, errors, reset } = useForm({
        avatar: null,
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setData('avatar', file);
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setAvatarPreview(null);
        }
    };

    const handleAvatarSubmit = (e) => {
        e.preventDefault();
        post(route('profile.avatar.update'), {
            forceFormData: true,
            onSuccess: () => {
                setAvatarPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                reset('avatar');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Profile</span>
                </h2>
            }
        >
            <Head title="Profile" />

            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / <span>Profile</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Profile Header Card */}
                <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl border border-gray-100">
                    <div className="p-8">
                        <div className="flex items-start space-x-8">
                            {/* Avatar Section */}
                            <div className="flex-shrink-0">
                                <label className="block cursor-pointer group">
                                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 group-hover:border-[#37692F] group-hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={`${fullName}'s avatar`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#37692F] to-[#4a8a3f] flex items-center justify-center mx-auto mb-2 shadow-md">
                                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium text-gray-600 group-hover:text-[#37692F]">Upload Photo</span>
                                            </div>
                                        )}
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-full flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </label>

                                {/* Avatar Action Buttons */}
                                <div className="mt-4 space-y-2">
                                    {avatarPreview && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAvatarPreview(null);
                                                setData('avatar', null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Remove</span>
                                        </button>
                                    )}

                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                            className="flex-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#37692F] to-[#4a8a3f] text-white rounded-lg hover:from-[#2a5624] hover:to-[#37692F] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            <span>{avatarPreview ? 'Change' : 'Upload'}</span>
                                        </button>

                                        {avatarPreview && (
                                            <button
                                                type="submit"
                                                onClick={handleAvatarSubmit}
                                                className="flex-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                                                disabled={processing || !data.avatar}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Save</span>
                                            </button>
                                        )}
                                    </div>

                                    {errors.avatar && (
                                        <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                                            {errors.avatar}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* User Information */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-poppins mb-2">
                                            {fullName}
                                        </h1>

                                        <div className="flex items-center space-x-4 mb-4">
                                            {/* Role Badge */}
                                            <span className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#37692F] to-[#4a8a3f] text-white shadow-md">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                {user.role === 'admin' ? 'Administrator' : 'Employee'}
                                            </span>

                                            {/* Status Indicator */}
                                            <div className="flex items-center text-sm font-medium">
                                                <div className={`w-2 h-2 rounded-full mr-2 ${user.email_verified_at ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                                {user.email_verified_at ? 'Verified' : 'Unverified'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    {/* Email */}
                                    <div className="flex items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 font-medium">Email Address</div>
                                            <div className="text-gray-900 font-semibold">{user.email}</div>
                                        </div>
                                    </div>

                                    {/* Email Verification Status */}
                                    <div className={`flex items-center p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200 ${user.email_verified_at
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-yellow-50 border-yellow-200'
                                        }`}>
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${user.email_verified_at ? 'bg-green-100' : 'bg-yellow-100'
                                            }`}>
                                            <svg className={`w-5 h-5 ${user.email_verified_at ? 'text-green-600' : 'text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                {user.email_verified_at ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                )}
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">
                                                {user.email_verified_at ? 'Email Verified' : 'Email Not Verified'}
                                            </div>
                                            <div className={`text-xs ${user.email_verified_at ? 'text-green-700' : 'text-yellow-700'}`}>
                                                {user.email_verified_at ? 'Your email is verified' : 'Please verify your email'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Google Connection */}
                                    {user.google_id && (
                                        <div className="flex items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center mr-4">
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 font-medium">Google Account</div>
                                                <div className="text-gray-900 font-semibold">Connected</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Member Since */}
                            <div className="text-right">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-inner border border-gray-200">
                                    <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-2">Member since</div>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-[#37692F] to-[#4a8a3f] bg-clip-text text-transparent font-poppins">
                                        {memberSince}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2">
                                        {Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24))} days with us
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Forms */}
                <div className="space-y-6">
                    {/* Profile Information Form */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900 font-poppins">
                                Profile Information
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Update your account's profile information and email address.
                            </p>
                        </div>
                        <div className="p-6">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-2xl"
                            />
                        </div>
                    </div>

                    {/* Update Password Form */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900 font-poppins">
                                Update Password
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Ensure your account is using a long, random password to stay secure.
                            </p>
                        </div>
                        <div className="p-6">
                            <UpdatePasswordForm className="max-w-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}