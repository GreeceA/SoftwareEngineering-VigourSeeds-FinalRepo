import { Link } from '@inertiajs/react';

export default function NavLink({ href, active, children, className = '' }) {
    return (
        <Link
            href={href}
            className={
                (active
                    ? 'inline-flex items-center px-1 pt-1 border-b-2 border-[#37692F] text-sm font-medium leading-5 text-[#37692F]'
                    : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-[#111827] hover:text-[#37692F] hover:border-[#37692F]') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
