import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, title }) {
    return (
        <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${window.location.origin}/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/images/login-register-bg.png)` }}
        >
            <div className="mt-6 w-full max-w-[650px] overflow-hidden bg-white px-10 py-12 shadow-md rounded-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-[40px] font-poppins ">
                        <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                        <span className="text-[#333333]"> | {title}</span>
                    </h1>
                </div>
                {children}
            </div>
        </div>
    );
}
