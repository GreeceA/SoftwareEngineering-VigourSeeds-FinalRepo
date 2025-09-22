import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Vlogo from '@/assets/vigour-logo.png';
import { route } from 'ziggy-js'; 
import usePermissionRefresh from '@/hooks/usePermissionRefresh';

// import DashLogo from '@/assets/dashboard-bg-logo.png';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    // Use the permissions from HandleInertiaRequests middleware
    const permissions = user?.can || [];
    
    // Get full name from first_name and last_name
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;

    // Auto-refresh permissions when needed
    usePermissionRefresh();

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [open, setOpen] = useState(false);
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/dashboard">
                                    <img
                                        src={Vlogo}   alt="Vigour Seeds Logo"  className="block h-9 w-auto"
                                    />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {/* DASHBOARD */}
                                <NavLink 
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                            </div>

                            {/* Users Section - Always visible */}
                            <div className="relative hidden sm:-my-px sm:ms-10 sm:flex">
                                {/* Show main Users nav link - always visible */}
                                <NavLink
                                    href={route("users.index")}
                                    active={route().current("users.index")}
                                    className="inline-flex items-center"
                                >
                                    Users
                                </NavLink>

                                {/* Dropdown toggle button - TEMPORARILY ALWAYS SHOW */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setOpen(!open);
                                    }}
                                    className="ml-2 focus:outline-none"
                                >
                                    <svg
                                        className={`h-4 w-4 transition-transform duration-200 ${
                                            open ? "rotate-180" : "rotate-0"
                                        }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="#111827"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown menu - show items based on specific permissions */}
                                {open && (
                                    <div className="absolute top-5 left-0 mt-10 w-48 rounded-md bg-gray-50 shadow-lg text-sans text-[14px]">
                                        {/* All Users - only if user has 'view users' */}
                                        {permissions.includes('view users') && (
                                            <Link
                                                href={route("users.index")}
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-200 font-regular"
                                            >
                                                All Users
                                            </Link>
                                        )}
                                        
                                        {/* Add User - only if user has 'create users' */}
                                        {permissions.includes('create users') && permissions.includes('view users') && (
                                            <Link
                                                href={route("users.create")}
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-200 font-regular"
                                            >
                                                Add User
                                            </Link>
                                        )}
                                        
                                        {/* User Permissions - only if user has 'view permissions' */}
                                        {permissions.includes('view permissions') && (
                                            <Link
                                                href={route("permissions.index")}
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-200 font-regular"
                                            >
                                                User Permissions 
                                            </Link>
                                        )}
                                        
                                        {/* User Roles - only if user has 'view roles' */}
                                        {permissions.includes('view roles') && (
                                            <Link
                                                href={route("roles.index")}
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-200 font-regular"
                                            >
                                                User Roles
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {/* PARTNERS */}
                                <NavLink
                                    href={route('partners.index')}
                                    active={route().current('partners.index')}
                                >
                                    Partners
                                </NavLink>
                                {/* SEEDS */}
                                <NavLink
                                    href={route('seeds.index')}
                                    active={route().current('seeds.index')}
                                >
                                    Seeds
                                </NavLink>
                                {/* ITEMS */}
                                <NavLink
                                    href={route('items.index')}
                                    active={route().current('items.index')}
                                >
                                    Items
                                </NavLink>
                                {/* CONTRACTS */}
                                <NavLink
                                    href={route('contracts.index')}
                                    active={route().current('contracts.index')}
                                >
                                    Contracts
                                </NavLink>
                                <NavLink
                                    // href={route('dashboard')}
                                    // active={route().current('dashboard')}
                                >
                                    Inventory
                                </NavLink>
                                <NavLink
                                    // href={route('dashboard')}
                                    // active={route().current('dashboard')}
                                >
                                    Field Visit
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {/* Avatar */}
                                                <div className="mr-3">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={`${fullName}'s avatar`}
                                                            className="h-8 w-8 rounded-full border border-gray-300 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-[#37692F] flex items-center justify-center text-white text-sm font-bold">
                                                            {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Full Name */}
                                                {fullName}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="#111827"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="flex items-center space-x-3">
                                {/* Mobile Avatar */}
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={`${fullName}'s avatar`}
                                        className="h-10 w-10 rounded-full border border-gray-300 object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-[#37692F] flex items-center justify-center text-white text-sm font-bold">
                                        {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                                    </div>
                                )}
                                
                                <div>
                                    <div className="text-base font-medium text-gray-800">
                                        {fullName}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>
                {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img src= {DashLogo}    alt="Background Logo"   className="w-[400px] h-auto"/>
                </div> */}
                {children}
            </main>
        </div>
    );
}
