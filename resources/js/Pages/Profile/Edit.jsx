import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Get full name from first_name and last_name
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Profile Header with Avatar */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <div className="flex items-center space-x-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={`${fullName}'s avatar`}
                                        className="h-24 w-24 rounded-full border-4 border-[#37692F] object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#37692F] to-[#2d5426] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                        {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            
                            {/* User Information */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    {fullName}
                                </h1>
                                <div className="mt-2 space-y-1">
                                    <p className="text-lg text-gray-600">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#37692F] text-white">
                                            {user.role === 'admin' ? 'Administrator' : 'Employee'}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 flex items-center">
                                        <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {user.email}
                                    </p>
                                    {user.email_verified_at && (
                                        <p className="text-sm text-green-600 flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Email verified
                                        </p>
                                    )}
                                    {user.google_id && (
                                        <p className="text-sm text-blue-600 flex items-center">
                                            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                            Connected to Google
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Profile Stats */}
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Member since</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {new Date(user.created_at).toLocaleDateString('en-US', { 
                                        month: 'long', 
                                        year: 'numeric' 
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Forms */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
