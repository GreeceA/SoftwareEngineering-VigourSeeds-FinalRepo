import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import '../../../css/fonts.css';
import { UserMinusIcon, ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import DeactivateModal from './DeactivateModal';
import ReactivateModal from './ReactivateModal';
import UserInfoModal from './UserInfoModal';


export default function Index({ auth, users }) {
    const [search, setSearch] = useState("");
    const [modalUser, setModalUser] = useState(null);
    const [reactivateModalUser, setReactivateModalUser] = useState(null);
    const [userList, setUserList] = useState(users.data || []);
    const [modalUserInfo, setModalUserInfo] = useState(null);

    
    // Filter and Sort states
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'
    const [sort, setSort] = useState('default'); // 'default', 'role_asc', 'role_desc', 'date_asc', 'date_desc', 'name_asc', 'name_desc'
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    
    // Refs for dropdown management
    const filterRef = useRef(null);
    const sortRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounce input to avoid updating on every keystroke
    const debouncedSearch = debounce((value) => {
        setSearch(value);
    }, 300);

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    // Get role priority for sorting (higher number = higher role)
    const getRolePriority = (role) => {
        const priorities = {
            'Manager': 2,
            'Employee': 1
        };
        return priorities[role] || 0;
    };

    // Filter, sort, and search users
    const processedUsers = useMemo(() => {
        let result = [...userList];

        // 1. Apply search filter
        if (search) {
            result = result.filter((user) => {
                const name = user.name.toLowerCase();
                const email = user.email?.toLowerCase() || '';
                const role = user.role?.toLowerCase() || '';

                return (
                    name.includes(search.toLowerCase()) ||
                    email.includes(search.toLowerCase()) ||
                    role.includes(search.toLowerCase())
                );
            });
        }

        // 2. Apply status filter
        if (filter !== 'all') {
            result = result.filter(user => user.status === filter);
        }

        // 3. Apply sorting
        if (sort !== 'default') {
            switch (sort) {
                case 'role_asc':
                    result.sort((a, b) => getRolePriority(a.role) - getRolePriority(b.role));
                    break;
                case 'role_desc':
                    result.sort((a, b) => getRolePriority(b.role) - getRolePriority(a.role));
                    break;
                case 'date_asc':
                    result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    break;
                case 'date_desc':
                    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case 'name_asc':
                    result.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name_desc':
                    result.sort((a, b) => b.name.localeCompare(a.name));
                    break;
            }
        } else {
            // Default sorting: logged-in user first
            const currentUserIndex = result.findIndex(u => u.id === auth.user.id);
            if (currentUserIndex !== -1) {
                const currentUser = result.splice(currentUserIndex, 1)[0];
                result.unshift(currentUser);
            }
        }

        return result;
    }, [userList, search, filter, sort, auth.user.id]);


    const handleDeactivate = (id) => {
        router.post(route('users.deactivate', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setUserList(prev => prev.map(u =>
                    u.id === id ? { ...u, status: 'inactive' } : u
                ));
                setModalUser(null);
            },
            onError: (errors) => {
                console.error('Deactivation failed:', errors);
                setModalUser(null);
            }
        });
    };

    const handleReactivate = (id) => {
        router.post(route('users.reactivate', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setUserList(prev => prev.map(u =>
                    u.id === id ? { ...u, status: 'active' } : u
                ));
                setReactivateModalUser(null);
            },
            onError: (errors) => {
                console.error('Reactivation failed:', errors);
                setReactivateModalUser(null);
            }
        });
    };

    const getFilterLabel = () => {
        switch (filter) {
            case 'active': return 'Active Only';
            case 'inactive': return 'Inactive Only';
            default: return 'All Users';
        }
    };

    const getSortLabel = () => {
        switch (sort) {
            case 'role_asc': return 'Role (Low to High)';
            case 'role_desc': return 'Role (High to Low)';
            case 'date_asc': return 'Date (Oldest First)';
            case 'date_desc': return 'Date (Newest First)';
            case 'name_asc': return 'Name (A to Z)';
            case 'name_desc': return 'Name (Z to A)';
            default: return 'Default';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Manager':
                return 'bg-purple-600 text-white';
            case 'Employee':
                return 'bg-blue-600 text-white';
            default:
                return 'bg-gray-600 text-white';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Users</span>
                </h2>
            }
        >
            <Head title="Users" />

            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href="http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/dashboard"
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / <span>Users</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section with Search, Filter, Sort and Add Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Employee Information
                    </h1>

                    <div className="flex space-x-3">
                        {/* Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => {
                                    setShowFilterDropdown(!showFilterDropdown);
                                    setShowSortDropdown(false);
                                }}
                                className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-transparent bg-white"
                            >
                                <FunnelIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {getFilterLabel()}
                                <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setFilter('all');
                                                setShowFilterDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filter === 'all' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            All Users
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilter('active');
                                                setShowFilterDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filter === 'active' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Active Only
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilter('inactive');
                                                setShowFilterDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filter === 'inactive' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Inactive Only
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative" ref={sortRef}>
                            <button
                                onClick={() => {
                                    setShowSortDropdown(!showSortDropdown);
                                    setShowFilterDropdown(false);
                                }}
                                className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-transparent bg-white"
                            >
                                <ArrowsUpDownIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {getSortLabel()}
                                <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                            </button>
                            {showSortDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setSort('default');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'default' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Default
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSort('role_desc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'role_desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Role (High to Low)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSort('role_asc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'role_asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Role (Low to High)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSort('date_desc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'date_desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Date (Newest First)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSort('date_asc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'date_asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Date (Oldest First)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSort('name_asc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'name_asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Name (A to Z)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSort('name_desc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'name_desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Name (Z to A)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name, email, or role"
                                onChange={handleSearchChange}
                                className="w-[400px] pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        {/* Add User Button */}
                        <Link
                            href={route('users.create')}
                            className="bg-[#37692F] text-white px-4 py-2 rounded-md hover:bg-[#2a5624] transition-colors flex items-center"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            Add User
                        </Link>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#37692F] text-gray-600 uppercase text-xs">
                            <tr>
                                {['PROFILE', 'NAME', 'EMAIL', 'ROLE', 'STATUS', 'JOINED DATE', 'ACTIONS'].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-4 font-poppins font-medium text-[14px] text-white"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {processedUsers.map((user) => (
                                <tr key={user.id} className={`hover:bg-gray-50 ${user.id === auth.user.id ? 'bg-blue-50' : ''}`}>
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
                                            {user.id === auth.user.id && (
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
                                        <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium shadow-sm ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
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
                                    {/* EDIT AND DEACTIVATE BUTTONS */}
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            {/* Edit Button */}
                                            {user.status === 'active' ? (
                                                <Link
                                                    href={route('users.edit', user.id)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    title="Edit User"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
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
                                            )}

                                            {/* Deactivate/Reactivate Button */}
                                            {user.id === auth.user.id ? (
                                                <button
                                                    className="text-gray-400 cursor-not-allowed"
                                                    disabled
                                                    title="You cannot modify your own account status"
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
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <DeactivateModal
                user={modalUser}
                onCancel={() => setModalUser(null)}
                onConfirm={handleDeactivate}
            />
            
            <ReactivateModal
                user={reactivateModalUser}
                onCancel={() => setReactivateModalUser(null)}
                onConfirm={handleReactivate}
            />

            <UserInfoModal
                user={modalUserInfo}
                onClose={() => setModalUserInfo(null)}
            />

        </AuthenticatedLayout>
    );
}