import { Link } from '@inertiajs/react';

export default function NavLink({ href, active, children, className = '' }) {
    return (
        <Link
            href={href}
            className={
                (active
                    ? 'inline-flex items-center px-3 py-2 border-b-4 border-[#37692F] text-sm font-semibold leading-5 text-[#37692F] bg-gradient-to-b from-green-50 to-transparent shadow-sm'
                    : 'inline-flex items-center px-3 py-2 border-b-4 border-transparent text-sm font-medium leading-5 text-gray-600 hover:text-[#37692F] hover:border-[#37692F] hover:bg-gray-50 transition-all duration-200') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
