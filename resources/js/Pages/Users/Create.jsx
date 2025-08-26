import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import '../../../css/fonts.css';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        role: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('users.store'), { // ✅ points to POST route
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Dashboard</span>
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="p-6 max-w-2xl mx-auto">
                <form onSubmit={submit} className="space-y-6">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <InputLabel 
                                htmlFor="first_name" 
                                value="First Name" 
                                className="text-[16px] text-[#666666] opacity-100 font-poppins font-medium" 
                            />
                            <TextInput
                                id="first_name"
                                name="first_name"
                                value={data.first_name}
                                className="mt-1 block w-full border-[#666666] text-[#111111] border-opacity-35"
                                autoComplete="given-name"
                                isFocused={true}
                                onChange={(e) => setData('first_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.first_name} className="mt-2" />
                        </div>

                        <div className="flex-1">
                            <InputLabel 
                                htmlFor="last_name" 
                                value="Last Name" 
                                className="text-[16px] text-[#666666] opacity-100 font-poppins font-medium" 
                            />
                            <TextInput
                                id="last_name"
                                name="last_name"
                                value={data.last_name}
                                className="mt-1 block w-full border-[#666666] text-[#111111] border-opacity-35"
                                autoComplete="family-name"
                                onChange={(e) => setData('last_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.last_name} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel 
                            htmlFor="role" 
                            value="Role" 
                            className="text-[16px] text-red opacity-100 font-poppins font-medium" 
                        />
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            className={`mt-1 block w-full border-[#666666] border-opacity-20 rounded-md py-2 px-3 focus:ring-[#37692F] focus:border-[#37692F] 
                            ${data.role === '' ? 'text-[#666666]' : 'text-[#111111]'}`}
                            onChange={(e) => setData('role', e.target.value)}
                            required
                        >
                            <option value="">Select role</option>
                            {['Employee', 'Manager'].map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                            ))}
                        </select>
                        <InputError message={errors.role} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel 
                            htmlFor="email" 
                            value="Email" 
                            className="text-[16px] text-[#666666] opacity-100 font-poppins font-medium" 
                        />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full border-[#666666] text-[#111111] border-opacity-50"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel 
                            htmlFor="password" 
                            value="Password" 
                            className="text-[16px] text-[#666666] opacity-100 font-poppins font-medium" 
                        />
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full pr-10 border-[#666666] text-[#111111] border-opacity-35"
                                autoComplete="new-password"
                                onChange={(e) => setData('a', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 mt-1"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                            className="text-[16px] text-[#666666] opacity-100 font-poppins font-medium" 
                        />
                        <div className="relative">
                            <TextInput
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full pr-10 border-[#666666] text-[#111111] border-opacity-35"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 mt-1"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            className="w-full bg-[#37692F] text-white py-3 px-4 rounded-md font-medium text-[16px] hover:bg-[#2a5624] transition-colors focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:ring-offset-2"
                            disabled={processing}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
