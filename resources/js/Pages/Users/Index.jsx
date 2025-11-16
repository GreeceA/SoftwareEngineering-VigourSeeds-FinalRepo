import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import '../../../css/fonts.css';
import { UserMinusIcon, ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import DeactivateModal from './DeactivateModal';
import ReactivateModal from './ReactivateModal';
import UserInfoModal from './UserInfoModal';
import Vlogo from '@/assets/vigour-logo.png';

export default function Index({ auth, users, filters }) {
    const permissions = auth?.user?.can || [];

    const [search, setSearch] = useState(filters?.search || '');
    const [filter, setFilter] = useState(filters?.status || 'all');
    const [sortBy, setSortBy] = useState(filters?.sort_by || 'id');
    const [sortDir, setSortDir] = useState(filters?.sort_dir || 'desc');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);

    const [modalUser, setModalUser] = useState(null);
    const [reactivateModalUser, setReactivateModalUser] = useState(null);
    const [modalUserInfo, setModalUserInfo] = useState(null);

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);

    const filterRef = useRef(null);
    const sortRef = useRef(null);
    const exportRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterDropdown(false);
            if (sortRef.current && !sortRef.current.contains(event.target)) setShowSortDropdown(false);
            if (exportRef.current && !exportRef.current.contains(event.target)) setShowExportDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUsers = (params = {}) => {
        router.get(route('users.index'), {
            search: params.search !== undefined ? params.search : search,
            status: filter !== 'all' ? filter : '',
            sort_by: sortBy,
            sort_dir: sortDir,
            per_page: perPage,
            ...params,
        }, { preserveState: true, replace: true });
    };

    // Debounce only the fetchUsers call, not setSearch
    const debouncedFetchUsers = useRef(
        debounce((value) => {
            fetchUsers({ search: value, page: 1 });
        }, 400)
    ).current;

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        debouncedFetchUsers(e.target.value);
    };

    const handleExport = (format) => {
        window.location.href = route('users.export', { format });
        setShowExportDropdown(false);
    };

    const getFilterLabel = () => filter === 'active' ? 'Active Only' : filter === 'inactive' ? 'Inactive Only' : 'All Users';
    const getSortLabel = () => {
        if (sortBy === 'name') return sortDir === 'asc' ? 'Name (A to Z)' : 'Name (Z to A)';
        if (sortBy === 'email') return sortDir === 'asc' ? 'Email (A to Z)' : 'Email (Z to A)';
        if (sortBy === 'role') return sortDir === 'asc' ? 'Role (A to Z)' : 'Role (Z to A)';
        if (sortBy === 'created_at') return sortDir === 'asc' ? 'Date (Oldest First)' : 'Date (Newest First)';
        return 'Default';
    };
    const getRoleColor = (role) => {
        switch (role) {
            case 'Manager': return 'bg-purple-600 text-white';
            case 'Employee': return 'bg-blue-600 text-white';
            default: return 'bg-gray-600 text-white';
        }
    };

    const handleDeactivate = (id) => {
        router.post(route('users.deactivate', id), {}, {
            preserveScroll: true,
            onSuccess: () => setModalUser(null),
            onError: () => setModalUser(null)
        });
    };

    const handleReactivate = (id) => {
        router.post(route('users.reactivate', id), {}, {
            preserveScroll: true,
            onSuccess: () => setReactivateModalUser(null),
            onError: () => setReactivateModalUser(null)
        });
    };

    let displayUsers = [...users.data];


    if (sortBy === 'id' && sortDir === 'desc' && users.meta && users.meta.current_page === 1) {
        // Default sorting: id DESC, "me" at the top
        displayUsers.sort((a, b) => Number(b.id) - Number(a.id));
        const currentUserIndex = displayUsers.findIndex(u => String(u.id) === String(auth?.user?.id));
        if (currentUserIndex !== -1) {
            const [currentUser] = displayUsers.splice(currentUserIndex, 1);
            displayUsers = [currentUser, ...displayUsers];
        }
    } else if (sortBy === 'name') {
        // Name sorting
        displayUsers.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) return sortDir === 'asc' ? -1 : 1;
            if (nameA > nameB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    } else if (sortBy === 'email') {
        // Email sorting
        displayUsers.sort((a, b) => {
            const emailA = a.email.toUpperCase();
            const emailB = b.email.toUpperCase();
            if (emailA < emailB) return sortDir === 'asc' ? -1 : 1;
            if (emailA > emailB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    } else if (sortBy === 'role') {
        // Role sorting
        displayUsers.sort((a, b) => {
            const roleA = (a.roles && a.roles[0]?.name ? a.roles[0].name : '').toUpperCase();
            const roleB = (b.roles && b.roles[0]?.name ? b.roles[0].name : '').toUpperCase();
            if (roleA < roleB) return sortDir === 'asc' ? -1 : 1;
            if (roleA > roleB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    } else if (sortBy === 'created_at') {
        // Date sorting
        displayUsers.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortDir === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Users" />

            {/* Modern Page Header with Integrated Breadcrumb */}
            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white border-b border-gray-200 overflow-hidden">
                {/* Subtle decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative px-6 py-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm mb-4">
                        <a href={route('dashboard')} className="text-gray-500 hover:text-[#37692F] transition-colors duration-200 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </a>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#37692F] font-medium">Users</span>
                    </nav>

                    {/* Header Content */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Title & Description */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Employee Information</h1>
                                <p className="text-gray-600">Manage user accounts and permissions</p>
                            </div>
                        </div>

                        {/* Stats Badge */}
                        <div className="hidden lg:flex items-center space-x-2 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm font-medium text-indigo-700">{users?.data?.length || 0} Users</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Filters & Actions Section */}
                <div className="flex justify-end items-center gap-3 mb-6">
                    {/* Export Dropdown */}
                    <div className="relative" ref={exportRef}>
                            <button
                                onClick={() => { 
                                    setShowExportDropdown(!showExportDropdown); 
                                    setShowFilterDropdown(false); 
                                    setShowSortDropdown(false); 
                                }}
                                className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] bg-white"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4 mr-2 text-gray-500" />
                                Export
                                <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                            </button>
                            {showExportDropdown && (
                                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={() => handleExport('pdf')}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            Export as PDF
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => { setShowFilterDropdown(!showFilterDropdown); setShowSortDropdown(false); setShowExportDropdown(false); }}
                                className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] bg-white"
                            >
                                <FunnelIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {getFilterLabel()}
                                <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        {['all', 'active', 'inactive'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilter(status);
                                                    setShowFilterDropdown(false);
                                                    fetchUsers({ status: status !== 'all' ? status : '', page: 1 });
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filter === status ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {status === 'all' ? 'All Users' : status.charAt(0).toUpperCase() + status.slice(1) + ' Only'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Sort Dropdown */}
                        <div className="relative" ref={sortRef}>
                            <button
                                onClick={() => { setShowSortDropdown(!showSortDropdown); setShowFilterDropdown(false); setShowExportDropdown(false); }}
                                className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] bg-white"
                            >
                                <ArrowsUpDownIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {getSortLabel()}
                                <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                            </button>
                            {showSortDropdown && (
                                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        <button onClick={() => { setSortBy('id'); setSortDir('desc'); setShowSortDropdown(false); fetchUsers({ sort_by: 'id', sort_dir: 'desc', page: 1 }); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'id' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}>Default</button>
                                        <button onClick={() => { setSortBy('name'); setSortDir('asc'); setShowSortDropdown(false); fetchUsers({ sort_by: 'name', sort_dir: 'asc', page: 1 }); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'name' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}>Name (A to Z)</button>
                                        <button onClick={() => { setSortBy('name'); setSortDir('desc'); setShowSortDropdown(false); fetchUsers({ sort_by: 'name', sort_dir: 'desc', page: 1 }); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'name' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}>Name (Z to A)</button>
                                        <button onClick={() => { setSortBy('email'); setSortDir('asc'); setShowSortDropdown(false); fetchUsers({ sort_by: 'email', sort_dir: 'asc', page: 1 }); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'email' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}>Email (A to Z)</button>
                                        <button onClick={() => { setSortBy('email'); setSortDir('desc'); setShowSortDropdown(false); fetchUsers({ sort_by: 'email', sort_dir: 'desc', page: 1 }); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'email' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}>Email (Z to A)</button>
                                        <button onClick={() => { setSortBy('role'); setSortDir('asc'); setShowSortDropdown(false); fetchUsers({ sort_by: 'role', sort_dir: 'asc', page: 1 }); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'role' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}>Role (A to Z)</button>
                                        <button onClick={() => { setSortBy('role'); setSortDir('desc'); setShowSortDropdown(false); fetchUsers({ sort_by: 'role', sort_dir: 'desc', page: 1 }); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'role' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}>Role (Z to A)</button>
                                        <button onClick={() => { setSortBy('created_at'); setSortDir('asc'); setShowSortDropdown(false); fetchUsers({ sort_by: 'created_at', sort_dir: 'asc', page: 1 }); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'created_at' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}>Date (Oldest First)</button>
                                        <button onClick={() => { setSortBy('created_at'); setSortDir('desc'); setShowSortDropdown(false); fetchUsers({ sort_by: 'created_at', sort_dir: 'desc', page: 1 }); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'created_at' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}>Date (Newest First)</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name, email, or role"
                                value={search}
                                onChange={handleSearchChange}
                                className="w-[400px] pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {/* Add User Button - only show if user has 'create users' permission */}
                        {permissions.includes('create users') && (
                            <Link
                                href={route('users.create')}
                                className="bg-[#37692F] text-white px-4 py-2 rounded-md hover:bg-[#2a5624] flex items-center whitespace-nowrap"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add User
                            </Link>
                        )}
                </div>
                {/* Users Table */}
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#37692F] text-gray-600 uppercase text-xs">
                            <tr>
                                {['PROFILE', 'NAME', 'EMAIL', 'ROLE', 'STATUS', 'JOINED DATE', 'ACTIONS'].map((header) => (
                                    <th key={header} className="px-6 py-4 font-poppins font-medium text-[14px] text-white">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {displayUsers.length > 0 ? displayUsers.map((user) => (
                                <tr key={user.id} className={`hover:bg-gray-50 ${user.id === auth?.user?.id ? 'bg-blue-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={`${user.name}'s avatar`}
                                                className="h-10 w-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`h-10 w-10 rounded-full bg-[#37692F] flex items-center justify-center text-white text-sm font-bold ${user.avatar ? 'hidden' : ''}`}
                                        >
                                            {user.name[0].toUpperCase()}
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900 cursor-pointer hover:text-[#37692F]"
                                        onClick={() => setModalUserInfo(user)}
                                    >
                                        <div className="flex items-center">
                                            {user.name}
                                            {user.id === auth?.user?.id && (
                                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    You
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.roles && user.roles.map((role, index) => (
                                            <span key={role.id || index} className={`px-3 py-1 rounded-full text-xs font-poppins font-medium shadow-sm ${getRoleColor(role.name)} ${index > 0 ? 'ml-2' : ''}`}>
                                                {role.name}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-poppins font-normal ${
                                                user.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {user.status === "active" ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-600">
                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            {/* Edit Button - only show if user has 'edit users' permission */}
                                            {permissions.includes('edit users') && (
                                                user.status === 'active' ? (
                                                    user.email === 'admin@vigourseeds.com' ? (
                                                        <button
                                                            className="text-gray-400 cursor-not-allowed"
                                                            disabled
                                                            title="Cannot edit admin account"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            href={route('users.edit', user.id)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                                            title="Edit User"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                    )
                                                ) : (
                                                    <button
                                                        className="text-gray-400 cursor-not-allowed"
                                                        disabled
                                                        title="Cannot edit deactivated accounts"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                )
                                            )}

                                            {/* Deactivate/Reactivate Button - only show if user has 'deactivate users' permission */}
                                            {permissions.includes('deactivate users') && (
                                                user.id === auth?.user?.id || user.email === 'admin@vigourseeds.com' ? (
                                                    <button
                                                        className="text-gray-400 cursor-not-allowed"
                                                        disabled
                                                        title={
                                                            user.id === auth?.user?.id 
                                                                ? "You cannot modify your own account status"
                                                                : "Cannot modify admin account"
                                                        }
                                                    >
                                                        {user.status === 'active' ? (
                                                            <UserMinusIcon className="w-5 h-5" />
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                ) : user.status === 'active' ? (
                                                    <button
                                                        className="text-red-600 hover:text-red-800 transition-colors"
                                                        onClick={() => setModalUser(user)}
                                                        title="Deactivate User"
                                                    >
                                                        <UserMinusIcon className="w-5 h-5" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="text-green-600 hover:text-green-800 transition-colors"
                                                        onClick={() => setReactivateModalUser(user)}
                                                        title="Reactivate User"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                    </button>
                                                )
                                            )}  
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination & Per Page */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-4">
                    <div className="flex items-center space-x-2 relative">
                        <span className="text-sm text-gray-700">Show</span>
                        <div className="relative">
                            <select
                                className="appearance-none border border-gray-300 rounded px-2 py-1 pr-6 text-sm focus:ring-[#37692F] focus:border-[#37692F]"
                                value={perPage}
                                onChange={e => {
                                    setPerPage(Number(e.target.value));
                                    fetchUsers({ per_page: e.target.value, page: 1 });
                                }}
                            >
                                {[10, 25, 50, 100].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <span className="text-sm text-gray-700">entries</span>
                    </div>
                    {users && users.links && users.links.length > 1 && (
                        <div className="flex justify-center w-full md:w-auto">
                            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                {users.links.map((link, idx) => {
                                    const href = link.url ? link.url.replace(/&amp;/g, '&') : null;
                                    return (
                                        <Link
                                            key={idx}
                                            href={href || ''}
                                            preserveScroll
                                            preserveState
                                            className={
                                                `px-3 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-[#37692F] border-[#37692F] text-white'
                                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`
                                            }
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
            <DeactivateModal user={modalUser} onCancel={() => setModalUser(null)} onConfirm={handleDeactivate} />
            <ReactivateModal user={reactivateModalUser} onCancel={() => setReactivateModalUser(null)} onConfirm={handleReactivate} />
            <UserInfoModal user={modalUserInfo} onClose={() => setModalUserInfo(null)} />
        </AuthenticatedLayout>
    );
}