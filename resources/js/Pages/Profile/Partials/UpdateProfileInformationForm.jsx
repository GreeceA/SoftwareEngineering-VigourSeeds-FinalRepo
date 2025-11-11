import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js'; // or '@inertiajs/react' if using Inertia's helper

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                {/* Name Fields - First Name & Last Name */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel 
                            htmlFor="first_name" 
                            value="First Name" 
                            className="text-[14px] text-[#666666] font-medium mb-1 font-poppins" 
                        />
                        <TextInput
                            id="first_name"
                            className="mt-1 block w-full border-[#666666] border-opacity-35 rounded-md focus:ring-[#37692F] focus:border-[#37692F]"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            required
                            isFocused
                            autoComplete="given-name"
                        />
                        <InputError className="mt-1" message={errors.first_name} />
                    </div>

                    <div>
                        <InputLabel 
                            htmlFor="last_name" 
                            value="Last Name" 
                            className="text-[14px] text-[#666666] font-medium mb-1 font-poppins" 
                        />
                        <TextInput
                            id="last_name"
                            className="mt-1 block w-full border-[#666666] border-opacity-35 rounded-md focus:ring-[#37692F] focus:border-[#37692F]"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            required
                            autoComplete="family-name"
                        />
                        <InputError className="mt-1" message={errors.last_name} />
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <InputLabel 
                        htmlFor="email" 
                        value="Email" 
                        className="text-[14px] text-[#666666] font-medium mb-1 font-poppins" 
                    />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full border-[#666666] border-opacity-35 rounded-md focus:ring-[#37692F] focus:border-[#37692F]"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <InputError className="mt-1" message={errors.email} />
                </div>

                {/* Email Verification Section */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    Email Not Verified
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>
                                        Your email address is unverified.
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="ml-1 rounded-md text-sm font-medium text-yellow-800 underline hover:text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-yellow-50"
                                        >
                                            Click here to re-send the verification email.
                                        </Link>
                                    </p>
                                </div>
                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-md bg-[#37692F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a5624] focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:ring-offset-2 disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </>
                            )}
                        </button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out duration-300"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in-out duration-300"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <div className="flex items-center text-sm font-medium text-green-600">
                                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Changes saved successfully
                            </div>
                        </Transition>
                    </div>

                    {/* Optional: Add a reset/cancel button if needed */}
                    <button
                        type="button"
                        onClick={() => {
                            setData({
                                first_name: user.first_name || '',
                                last_name: user.last_name || '',
                                email: user.email,
                            });
                        }}
                        className="text-sm text-gray-600 underline hover:text-gray-900 transition-colors"
                    >
                        Reset to original
                    </button>
                </div>
            </form>
        </section>
    );
}