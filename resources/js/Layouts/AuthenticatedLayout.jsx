import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Vlogo from '@/assets/vigour-logo.png';
import { route } from 'ziggy-js';
import usePermissionRefresh from '@/hooks/usePermissionRefresh';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const permissions = user?.can || [];
    const { notifications } = usePage().props;
    const [showNotifications, setShowNotifications] = useState(false);

    // Get full name from first_name and last_name
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;

    // Auto-refresh permissions when needed
    usePermissionRefresh();
    const [openUsersDropdown, setOpenUsersDropdown] = useState(false);
    const [openInventoryDropdown, setOpenInventoryDropdown] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const handleNotificationClick = (notification) => {
        // Mark as read and navigate to URL
        router.post(
            route('notifications.mark-as-read', notification.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Navigate to the notification URL after marking as read
                    router.visit(notification.data.url);
                }
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/dashboard">
                                    <img
                                        src={Vlogo}
                                        alt="Vigour Seeds Logo"
                                        className="block h-9 w-auto"
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

                                {/* Users Section - Only show if user has any user-related permissions */}
                                {(permissions.includes('view users') ||
                                    permissions.includes('create users') ||
                                    permissions.includes('edit users') ||
                                    permissions.includes('deactivate users') ||
                                    permissions.includes('view permissions') ||
                                    permissions.includes('view roles')) && (
                                        <div className="relative hidden sm:-my-px sm:ms-10 sm:flex">
                                            {/* Show main Users nav link */}
                                            <NavLink
                                                href={route("users.index")}
                                                active={route().current("users.index")}
                                                className="inline-flex items-center"
                                            >
                                                Users
                                            </NavLink>

                                            {/* Dropdown toggle button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setOpenUsersDropdown(!openUsersDropdown);
                                                }}
                                                className="ml-2 focus:outline-none"
                                            >
                                                <svg
                                                    className={`h-4 w-4 transition-transform duration-200 ${openUsersDropdown ? "rotate-180" : "rotate-0"
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
                                            {openUsersDropdown && (
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
                                    )}
                                {/* PARTNERS - Only show if user has 'view partners' permission */}
                                {permissions.includes('view partners') && (
                                    <NavLink
                                        href={route('partners.index')}
                                        active={route().current('partners.index')}
                                    >
                                        Partners
                                    </NavLink>
                                )}
                                {/* SEEDS */}
                                {permissions.includes('view seeds') && (
                                    <NavLink
                                        href={route('seeds.index')}
                                        active={route().current('seeds.index')}
                                    >
                                        Seeds
                                    </NavLink>
                                )}
                                {/* ITEMS */}
                                {permissions.includes('view items') && (
                                    <NavLink
                                        href={route('items.index')}
                                        active={route().current('items.index')}
                                    >
                                        Items
                                    </NavLink>
                                )}
                                {/* CONTRACTS - Only show if user has 'view contracts' permission */}
                                {permissions.includes('view contracts') && (
                                    <NavLink
                                        href={route('contracts.index')}
                                        active={route().current('contracts.index')}
                                    >
                                        Contracts
                                    </NavLink>
                                )}
                                {/* INVENTORY */}
                                {permissions.includes('view inventory') && (
                                    <div className="relative hidden sm:-my-px sm:ms-10 sm:flex">
                                        {/* Show main Inventory nav link */}
                                        <NavLink
                                            href={route('inventory.dashboard')}
                                            active={route().current('inventory.dashboard')}
                                            className="inline-flex items-center"
                                        >
                                            Inventory
                                        </NavLink>
                                        {/* Dropdown toggle button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setOpenInventoryDropdown(!openInventoryDropdown);
                                            }}
                                            className="ml-2 focus:outline-none"
                                        >
                                            <svg
                                                className={`h-4 w-4 transition-transform duration-200 ${openInventoryDropdown ? "rotate-180" : "rotate-0"
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
                                        {openInventoryDropdown && (
                                            <div className="absolute top-5 left-0 mt-10 w-48 rounded-md bg-gray-50 shadow-lg text-sans text-[14px]">
                                                {/* Inventory Ledger - only if user has 'view inventory' */}
                                                {permissions.includes('view inventory') && (
                                                    <Link
                                                        href={route('inventory.ledger')}
                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200 font-regular"
                                                    >
                                                        Inventory Ledger
                                                    </Link>
                                                )}

                                                {/* Partner Orders - only if user has 'view inventory' */}
                                                {permissions.includes('view inventory') && (
                                                    <Link
                                                        href={route('partner-orders.index')}
                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200 font-regular"
                                                    >
                                                        Partner Orders
                                                    </Link>
                                                )}

                                                {/* Buyback Tracking - only if user has 'view inventory' */}
                                                {permissions.includes('view inventory') && (
                                                    <Link
                                                        href={route('buybacks.index')}
                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200 font-regular"
                                                    >
                                                        Buyback Tracking
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* FIELD VISITATION */}
                                {permissions.includes('view field visit') && (
                                    <NavLink
                                        href={route('field-visits.index')}
                                        active={route().current('field-visits.index')}
                                    >
                                        Field Visit
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* ✅ RIGHT SIDE - Desktop View */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center gap-4">
                            {/* 🔔 NOTIFICATION BELL - Desktop */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {notifications?.length > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white animate-pulse">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {showNotifications && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowNotifications(false)}
                                        ></div>

                                        {/* Dropdown Panel */}
                                        <div className="absolute right-0 mt-2 w-96 rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#37692F] to-[#4a8a3f]">
                                                <h3 className="font-semibold text-white">Notifications</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications?.length > 0 ? (
                                                    notifications.map((notification) => (
                                                        <div
                                                            key={notification.id}
                                                            onClick={() => handleNotificationClick(notification)}
                                                            className="block border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="flex-shrink-0">
                                                                    {notification.data.type === 'today' && (
                                                                        <div className="rounded-full bg-red-100 p-2">
                                                                            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                    {notification.data.type === 'reminder' && (
                                                                        <div className="rounded-full bg-blue-100 p-2">
                                                                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                    {notification.data.type === 'overdue' && (
                                                                        <div className="rounded-full bg-orange-100 p-2">
                                                                            <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                        {notification.data.title}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                                        {notification.data.message}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 mt-1">
                                                                        {new Date(notification.created_at).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-8 text-center text-gray-500">
                                                        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                        </svg>
                                                        <p className="mt-2 font-medium">No new notifications</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ✅ USER DROPDOWN - Desktop */}
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

                        {/* ✅ MOBILE HAMBURGER */}
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

                {/* ✅ MOBILE NAVIGATION DROPDOWN */}
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
                                        alt={`${fullName}'s avatars`}
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
                {children}
            </main>
        </div>
    );
}