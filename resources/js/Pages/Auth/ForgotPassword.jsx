import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout title="Forgot Password">
            <Head title="Forgot Password" />

            <div className="mb-6 text-[16px] text-[#666666] text-center">
                Forgot your password? No problem. Just enter your email address and we'll send you a password reset link.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 text-center">
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
                        autoComplete="email"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <Link
                        href={route('login')}
                        className="text-[16px] text-[#666666] underline hover:text-[#37692F] transition-colors"
                    >
                        Back to login
                    </Link>

                    <button
                        type="submit"
                        className="bg-[#37692F] text-white py-3 px-6 rounded-md font-medium text-[16px] hover:bg-[#2a5624] transition-colors focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:ring-offset-2 disabled:opacity-50"
                        disabled={processing}
                    >
                        SEND RESET LINK
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}