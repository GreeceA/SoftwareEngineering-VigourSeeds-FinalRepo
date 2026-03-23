import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import '../../../css/fonts.css';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Gpic from '@/assets/google-logo.png';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'employee',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    return (
        <GuestLayout title="Register">
            <Head title="Register" />
            
            <form onSubmit={submit} className="space-y-4">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <InputLabel 
                            htmlFor="first_name" 
                            value="First Name" 
                            className="text-[16px] text-[#666666] font-medium mb-1" 
                        />
                        <TextInput
                            id="first_name"
                            name="first_name"
                            value={data.first_name}
                            className="mt-1 block w-full border-[#666666] border-opacity-35 rounded-md"
                            autoComplete="given-name"
                            isFocused={true}
                            onChange={(e) => {
                                const validValue = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                                setData('first_name', validValue);
                            }}
                            required
                        />
                        <InputError message={errors.first_name} className="mt-1" />
                    </div>

                    <div className="flex-1">
                        <InputLabel 
                            htmlFor="last_name" 
                            value="Last Name" 
                            className="text-[16px] text-[#666666] font-medium mb-1" 
                        />
                        <TextInput
                            id="last_name"
                            name="last_name"
                            value={data.last_name}
                            className="mt-1 block w-full border-[#666666] border-opacity-35 rounded-md"
                            autoComplete="family-name"
                            onChange={(e) => {
                                const validValue = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                                setData('last_name', validValue);
                            }}
                            required
                        />
                        <InputError message={errors.last_name} className="mt-1" />
                    </div>
                </div>

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
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
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

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-[16px] text-[#666666] font-medium mb-1" 
                    />
                    <div className="relative">
                        <TextInput
                            id="password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full pr-10 border-[#666666] border-opacity-35 rounded-md"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            {showConfirmPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-[#37692F] text-white py-3 px-4 rounded-md font-medium text-[16px] hover:bg-[#2a5624] transition-colors focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:ring-offset-2"
                        disabled={processing}
                    >
                        REGISTER
                    </button>
                </div>

                {/* Existing User Login Link */}
                <div className="text-center">
                    <p className="text-[16px] text-[#666666]">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="text-[#37692F] font-medium underline hover:text-[#2a5624]"
                        >
                            Login here
                        </Link>
                    </p>
                </div>

                <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-[16px] text-[#666666]">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <a
                        href={route('google.redirect')}
                        className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-[16px] font-medium text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                        <img 
                            src={Gpic}
                            alt="Google Logo" 
                            className="w-5 h-5 mr-2"
                        />
                        Register with Google
                    </a>
                </div>
            </form>
        </GuestLayout>
    );
}