import { Link } from '@inertiajs/react';

export default function SidebarNavLink({ href, active, children, className = '', title = '' }) {
    return (
        <Link
            href={href}
            title={title}
            className={
                (active
                    ? 'flex items-center px-4 py-3 text-sm font-semibold text-[#37692F] bg-gradient-to-r from-green-50 to-transparent border-l-4 border-[#37692F] shadow-sm'
                    : 'flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#37692F] hover:bg-gray-50 hover:border-l-4 hover:border-[#37692F] border-l-4 border-transparent transition-all duration-500 ease-in-out') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
