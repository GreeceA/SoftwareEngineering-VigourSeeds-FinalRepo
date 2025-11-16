import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import SidebarNavLink from '@/Components/SidebarNavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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
    
    // Initialize sidebar state from localStorage, default to collapsed (true)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Save sidebar state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    // Auto-open dropdowns when on related pages
    useEffect(() => {
        if (route().current("inventory.*") || route().current("partner-orders.*") || route().current("buybacks.*")) {
            setOpenInventoryDropdown(true);
        }
        if (route().current("users.*") || route().current("permissions.*") || route().current("roles.*")) {
            setOpenUsersDropdown(true);
        }
    }, []);

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
            <nav className="bg-white shadow-md sticky top-0 z-50">
                {/* MAIN HEADER - Logo and Title */}
                <div className="relative border-b border-[#2d5526] bg-gradient-to-r from-[#37692F] to-[#4a8a3f] shadow-lg">
                    {/* Elegant geometric pattern overlay */}
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `
                            radial-gradient(circle at 20% 50%, transparent 0%, rgba(255,255,255,0.1) 2px, transparent 2px),
                            radial-gradient(circle at 80% 50%, transparent 0%, rgba(255,255,255,0.1) 2px, transparent 2px),
                            linear-gradient(90deg, transparent 49.5%, rgba(255,255,255,0.05) 49.5%, rgba(255,255,255,0.05) 50.5%, transparent 50.5%)
                        `,
                        backgroundSize: '40px 40px, 40px 40px, 60px 100%'
                    }}></div>
                    
                    <div className="relative mx-auto max-w-full px-4">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo and Title */}
                            <div className="flex items-center gap-3">
                                <Link href={route('dashboard')} className="transition-transform duration-300 hover:scale-110">
                                    <img
                                        src={Vlogo}
                                        alt="Vigour Seeds Logo"
                                        className="block h-8 w-auto drop-shadow-lg"
                                    />
                                </Link>
                                <h1 className="text-[20px] font-[600] hidden sm:block tracking-wide"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    <span className="text-white font-[800] drop-shadow-sm">VIGOUR SEEDS</span>
                                    {/* <span className="text-[#333333] font-[400]"> | Seed Management</span> */}
                                </h1>
                            </div>

                            {/* Right Side - Notification Bell and User Dropdown */}
                            <div className="flex items-center gap-4">
                                {/* NOTIFICATION BELL */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative rounded-full p-2 text-white hover:bg-white/20 hover:shadow-lg hover:scale-110 transition-all duration-300"
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
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setShowNotifications(false)}
                                            ></div>
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

                                {/* USER DROPDOWN */}
                                <div className="relative z-[60]">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium leading-4 text-white transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-lg hover:scale-105 focus:outline-none"
                                                >
                                                    <div className="mr-3">
                                                        {user.avatar ? (
                                                            <img
                                                                src={user.avatar}
                                                                alt={`${fullName}'s avatar`}
                                                                className="h-8 w-8 rounded-full border border-white/50 object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-8 w-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white text-sm font-bold">
                                                                {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {fullName}
                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
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
                                            <Dropdown.Link href={route('profile.edit')}>
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

                            {/* Mobile Hamburger */}
                            <div className="flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
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
                </div>

            </nav>

            {/* LAYOUT WITH SIDEBAR */}
            <div className="flex">
                {/* SIDEBAR - Navigation Items */}
                <aside className={`hidden sm:block bg-white shadow-lg border-r border-gray-200 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
                    {/* Toggle Button */}
                    <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'justify-end'} p-3 border-b border-gray-200 transition-all duration-500 ease-in-out`}>
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#37692F] transition-all duration-300 ease-in-out hover:scale-110"
                            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            <svg className="w-5 h-5 transition-transform duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {sidebarCollapsed ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                )}
                            </svg>
                        </button>
                    </div>
                    <nav className={`${sidebarCollapsed ? 'py-2' : 'py-4'} transition-all duration-500 ease-in-out`}>
                        <div className={`${sidebarCollapsed ? 'space-y-0' : 'space-y-1'} transition-all duration-500 ease-in-out`}>
                            {/* DASHBOARD */}
                            <SidebarNavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                                title={sidebarCollapsed ? "Dashboard" : ""}
                            >
                                <div className={`flex items-center transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                                    <svg className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    {!sidebarCollapsed && <span className="transition-opacity duration-300 ease-in-out">Dashboard</span>}
                                </div>
                            </SidebarNavLink>

                            {/* Users Section - Only show if user has any user-related permissions */}
                                {(permissions.includes('view users') ||
                                    permissions.includes('create users') ||
                                    permissions.includes('edit users') ||
                                    permissions.includes('deactivate users') ||
                                    permissions.includes('view permissions') ||
                                    permissions.includes('view roles')) && (
                                    <div>
                                        {/* Show main Users nav link */}
                                        <div className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
                                            route().current("users.*") ? "text-[#37692F] bg-green-50 border-l-4 border-[#37692F]" : "border-l-4 border-transparent"
                                        }`}>
                                            <Link
                                                href={route("users.index")}
                                                className={`flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#37692F] hover:bg-gray-50 transition-all duration-500 ease-in-out flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}
                                                title={sidebarCollapsed ? "Users" : ""}
                                            >
                                                <svg className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                {!sidebarCollapsed && <span className="transition-opacity duration-300 ease-in-out">Users</span>}
                                            </Link>
                                            {!sidebarCollapsed && (
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenUsersDropdown(!openUsersDropdown)}
                                                    className="px-3 py-3 text-gray-700 hover:text-[#37692F] focus:outline-none transition-all duration-300 ease-in-out"
                                                >
                                                    <svg
                                                        className={`h-4 w-4 transition-transform duration-300 ease-in-out ${openUsersDropdown ? "rotate-180" : "rotate-0"}`}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                            )}
                                        </div>                                        {/* Submenu - show items based on specific permissions */}
                                        {openUsersDropdown && !sidebarCollapsed && (
                                            <div className="bg-gray-50 border-l-4 border-gray-200 transition-all duration-300 ease-in-out">
                                                {/* Add User */}
                                                {permissions.includes('create users') && permissions.includes('view users') && (
                                                    <Link
                                                        href={route("users.create")}
                                                        className="flex items-center gap-2 pl-8 pr-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-[#37692F]"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                        Add User
                                                    </Link>
                                                )}

                                                {/* User Permissions */}
                                                {permissions.includes('view permissions') && (
                                                    <Link
                                                        href={route("permissions.index")}
                                                        className="flex items-center gap-2 pl-8 pr-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-[#37692F]"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                        User Permissions
                                                    </Link>
                                                )}

                                                {/* User Roles */}
                                                {permissions.includes('view roles') && (
                                                    <Link
                                                        href={route("roles.index")}
                                                        className="flex items-center gap-2 pl-8 pr-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-[#37692F]"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                        User Roles
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            {/* PARTNERS */}
                            {permissions.includes('view partners') && (
                                <SidebarNavLink
                                    href={route('partners.index')}
                                    active={route().current('partners.index')}
                                    title={sidebarCollapsed ? "Partners" : ""}
                                >
                                    <div className={`flex items-center transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                                        <svg className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {!sidebarCollapsed && <span className="transition-opacity duration-300 ease-in-out">Partners</span>}
                                    </div>
                                </SidebarNavLink>
                            )}
                            
                            {/* SEEDS */}
                            {permissions.includes('view seeds') && (
                                <SidebarNavLink
                                    href={route('seeds.index')}
                                    active={route().current('seeds.index')}
                                    title={sidebarCollapsed ? "Seeds" : ""}
                                >
                                    <div className={`flex items-center transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                                        <svg className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {!sidebarCollapsed && <span className="transition-opacity duration-300 ease-in-out">Seeds</span>}
                                    </div>
                                </SidebarNavLink>
                            )}
                            
                            {/* ITEMS */}
                            {permissions.includes('view items') && (
                                <SidebarNavLink
                                    href={route('items.index')}
                                    active={route().current('items.index')}
                                    title={sidebarCollapsed ? "Items" : ""}
                                >
                                    <div className={`flex items-center transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                                        <svg className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        {!sidebarCollapsed && <span className="transition-opacity duration-300 ease-in-out">Items</span>}
                                    </div>
                                </SidebarNavLink>
                            )}
                            
                            {/* CONTRACTS */}
                            {permissions.includes('view contracts') && (
                                <SidebarNavLink
                                    href={route('contracts.index')}
                                    active={route().current('contracts.index')}
                                    title={sidebarCollapsed ? "Contracts" : ""}
                                >
                                    <div className={`flex items-center transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                                        <svg className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {!sidebarCollapsed && <span className="transition-opacity duration-300 ease-in-out">Contracts</span>}
                                    </div>
                                </SidebarNavLink>
                            )}
                            {/* INVENTORY */}
                            {permissions.includes('view inventory') && (
                                <div>
                                    {/* Show main Inventory nav link */}
                                    <div className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
                                        route().current("inventory.*") || route().current("partner-orders.*") || route().current("buybacks.*") 
                                            ? "text-[#37692F] bg-green-50 border-l-4 border-[#37692F]" 
                                            : "border-l-4 border-transparent"
                                    }`}>
                                        <Link
                                            href={route('inventory.dashboard')}
                                            className={`flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#37692F] hover:bg-gray-50 transition-all duration-500 ease-in-out flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}
                                            title={sidebarCollapsed ? "Inventory" : ""}
                                        >
                                            <svg className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                            </svg>
                                            {!sidebarCollapsed && <span className="transition-opacity duration-300 ease-in-out">Inventory</span>}
                                        </Link>
                                        {!sidebarCollapsed && (
                                            <button
                                                type="button"
                                                onClick={() => setOpenInventoryDropdown(!openInventoryDropdown)}
                                                className="px-3 py-3 text-gray-700 hover:text-[#37692F] focus:outline-none transition-all duration-300 ease-in-out"
                                            >
                                                <svg
                                                    className={`h-4 w-4 transition-transform duration-300 ease-in-out ${openInventoryDropdown ? "rotate-180" : "rotate-0"}`}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Submenu */}
                                    {openInventoryDropdown && !sidebarCollapsed && (
                                        <div className="bg-gray-50 border-l-4 border-gray-200 transition-all duration-300 ease-in-out">
                                            {/* Inventory Ledger */}
                                            {permissions.includes('view inventory') && (
                                                <Link
                                                    href={route('inventory.ledger')}
                                                    className="flex items-center gap-2 pl-8 pr-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-[#37692F]"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                    Inventory Ledger
                                                </Link>
                                            )}

                                            {/* Partner Orders */}
                                            {permissions.includes('view inventory') && (
                                                <Link
                                                    href={route('partner-orders.index')}
                                                    className="flex items-center gap-2 pl-8 pr-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-[#37692F]"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                    Partner Orders
                                                </Link>
                                            )}

                                            {/* Buyback Tracking */}
                                            {permissions.includes('view inventory') && (
                                                <Link
                                                    href={route('buybacks.index')}
                                                    className="flex items-center gap-2 pl-8 pr-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-[#37692F]"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                    Buyback Tracking
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* FIELD VISIT */}
                            {permissions.includes('view field visit') && (
                                <SidebarNavLink
                                    href={route('field-visits.index')}
                                    active={route().current('field-visits.index')}
                                    title={sidebarCollapsed ? "Field Visit" : ""}
                                >
                                    <div className={`flex items-center transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                                        <svg className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                        {!sidebarCollapsed && <span className="transition-opacity duration-300 ease-in-out">Field Visit</span>}
                                    </div>
                                </SidebarNavLink>
                            )}
                        </div>
                    </nav>
                </aside>

                {/* MOBILE NAVIGATION DROPDOWN */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
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
                                    <div className="text-base font-medium text-gray-800">{fullName}</div>
                                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1">
                    {header && (
                        <header className="bg-white shadow-md">
                            <div className="mx-auto max-w-full px-6 py-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}