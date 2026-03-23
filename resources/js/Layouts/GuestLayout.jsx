import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import loginBg from '@/assets/login-register-bg.png'; 
import Vlogo from '@/assets/vigour-logo.png';

export default function GuestLayout({ children, title }) {
    return (
        <div
            className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${loginBg})` }}
        >
            <Link href="http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/">
                <img 
                    src={Vlogo}
                    alt="Vigour Logo"
                    className="w-24 h-auto mb-4 opacity-50"
                />
            </Link>

            <div className="mt-6 w-full max-w-[650px] overflow-hidden bg-white px-10 py-12 shadow-md rounded-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-[32px] font-poppins whitespace-nowrap overflow-hidden text-ellipsis px-4">
                        <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                        <span className="text-[#333333]"> | {title}</span>
                    </h1>
                </div>
                {children}
            </div>
        </div>
    );
}