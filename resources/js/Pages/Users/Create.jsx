import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
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
        <AuthenticatedLayout
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Create User Account</span>
                </h2>
            }
        >
            <Head title="Create User" />
            
            <div className="p-6 mx-auto max-w-4xl">
                <div className="flex items-start space-x-8">
                    {/* Left column: Profile Picture */}
                    <div className="flex-shrink-0 mt-8">
                        <label className="block cursor-pointer">
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 hover:border-[#37692F] transition-colors overflow-hidden">
                                {data.avatar ? (
                                    <img 
                                        src={URL.createObjectURL(data.avatar)} 
                                        alt="Avatar preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <svg className="w-10 h-10 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span className="text-sm">Upload Photo</span>
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
                                    if (fileInputRef.current) fileInputRef.current.value = ''; // reset file input
                                }}
                                className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    {/* Right column: Form */}
                    <div className="flex-1 mt-20">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <InputLabel 
                                        htmlFor="first_name" 
                                        value="First Name" 
                                        className="text-[16px] text-[#666666] font-poppins font-medium" 
                                    />
                                    <TextInput
                                        id="first_name"
                                        name="first_name"
                                        value={data.first_name}
                                        className="mt-1 block w-full border-[#666666] text-[#111111] border-opacity-35"
                                        autoComplete="given-name"
                                        isFocused={true}
                                        onChange={(e) => {
                                            const validValue = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                                            setData('first_name', validValue);
                                        }}
                                        required
                                    />
                                    <InputError message={errors.first_name} className="mt-2" />
                                </div>

                                <div className="flex-1">
                                    <InputLabel 
                                        htmlFor="last_name" 
                                        value="Last Name" 
                                        className="text-[16px] text-[#666666] font-poppins font-medium" 
                                    />
                                    <TextInput
                                        id="last_name"
                                        name="last_name"
                                        value={data.last_name}
                                        className="mt-1 block w-full border-[#666666] text-[#111111] border-opacity-35"
                                        autoComplete="family-name"
                                        onChange={(e) => {
                                            const validValue = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                                            setData('last_name', validValue);
                                        }}
                                        required
                                    />
                                    <InputError message={errors.last_name} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel 
                                    htmlFor="role" 
                                    value="Role" 
                                    className="text-[16px] text-[#666666] font-poppins font-medium" 
                                />
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    className={`mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#37692F] focus:border-[#37692F] 
                                    ${data.role === '' ? 'text-gray-400' : 'text-gray-800'}`}
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="" className="text-gray-400">Select role</option>
                                    {['Employee', 'Manager'].map((role) => (
                                        <option key={role} value={role} className="text-gray-800">{role}</option>
                                    ))}
                                </select>
                                <InputError message={errors.role} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel 
                                    htmlFor="email" 
                                    value="Email" 
                                    className="text-[16px] text-[#666666] font-poppins font-medium" 
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

                            {/* Password */}
                            <div>
                                <InputLabel 
                                    htmlFor="password" 
                                    value="Password" 
                                    className="text-[16px] text-[#666666] font-poppins font-medium" 
                                />
                                <div className="relative w-full">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full pr-10 border-[#666666] text-[#111111] border-opacity-35"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 mt-1"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                    className="text-[16px] text-[#666666] font-poppins font-medium" 
                                />
                                <div className="relative w-full">
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
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-[#37692F] text-white py-3 px-4 rounded-md font-medium text-[16px] hover:bg-[#2a5624] transition-colors focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:ring-offset-2"
                                    disabled={processing}
                                >
                                    {processing ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
