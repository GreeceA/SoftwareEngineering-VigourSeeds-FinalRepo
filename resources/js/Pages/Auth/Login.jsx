import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Gpic from '@/assets/google-logo.png'; 
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import '../../../css/fonts.css';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout title="Log In">
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel 
                        htmlFor="email" 
                        value="Email" 
                        className="text-[16px] text-[#666666] font-medium mb-1" 
                    />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-[#666666] border-opacity-35 rounded-md"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <InputLabel 
                        htmlFor="password" 
                        value="Password" 
                        className="text-[16px] text-[#666666] font-medium mb-1" 
                    />
                    <div className="relative">
                        <TextInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full pr-10 border-[#666666] border-opacity-35 rounded-md"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-[16px] text-[#666666]">Remember me</span>
                    </label>
                    
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-[16px] text-[#666666] underline hover:text-[#37692F]"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-[#37692F] text-white py-3 px-4 rounded-md font-medium text-[16px] hover:bg-[#2a5624] transition-colors focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:ring-offset-2"
                        disabled={processing}
                    >
                        LOG IN
                    </button>
                </div>

                {/* New User Register Link */}
                <div className="text-center">
                    <p className="text-[16px] text-[#666666]">
                        New user?{' '}
                        <Link
                            href={route('register')}
                            className="text-[#37692F] font-medium underline hover:text-[#2a5624]"
                        >
                            Register now
                        </Link>
                    </p>
                </div>

                <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-[16px] text-[#666666]">
                            OR
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <a
                        href={route('google.redirect')}
                        className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-[16px] font-medium text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                        <img 
                            src={Gpic}
                            alt="Google Logo" 
                            className="w-5 h-5 mr-2"
                        />
                        Continue with Google
                    </a>
                </div>
            </form>
        </GuestLayout>
    );
}
