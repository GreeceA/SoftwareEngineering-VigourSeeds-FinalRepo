import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react'; // Import router instead of Inertia
import { useState, useMemo } from 'react';
import { debounce } from 'lodash';
import '../../../css/fonts.css';
import { UserMinusIcon } from '@heroicons/react/24/outline'; 
import DeactivateModal from './DeactivateModal';
import ReactivateModal from './ReactivateModal'; 

export default function Index({ auth, users }) {
    const [search, setSearch] = useState("");
    const [modalUser, setModalUser] = useState(null);
    const [reactivateModalUser, setReactivateModalUser] = useState(null);
    const [userList, setUserList] = useState(users);

    // Debounce input to avoid updating on every keystroke
    const debouncedSearch = debounce((value) => {
        setSearch(value);
    }, 300);

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    // Filter users by full name, email, or role
    const filteredUsers = useMemo(() => {
        if (!search) return userList;

        return userList.filter((user) => {
            const name = user.name.toLowerCase();
            const email = user.email?.toLowerCase() || '';
            const role = user.role?.toLowerCase() || '';

            return (
                name.includes(search.toLowerCase()) ||
                email.includes(search.toLowerCase()) ||
                role.includes(search.toLowerCase())
            );
        });
    }, [userList, search]);

    const handleDeactivate = (id) => {
        // Use router.post with preserveState to keep the current data and just refresh
        router.post(route('users.deactivate', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Update local state after successful response
                setUserList(prev => prev.map(u =>
                    u.id === id ? { ...u, status: 'inactive' } : u
                ));
                setModalUser(null);
            },
            onError: (errors) => {
                console.error('Deactivation failed:', errors);
                setModalUser(null); // Close modal even on error
            }
        });
    };

    const handleReactivate = (id) => {
        // Use router.post for reactivation
        router.post(route('users.reactivate', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Update local state after successful response
                setUserList(prev => prev.map(u =>
                    u.id === id ? { ...u, status: 'active' } : u
                ));
                setReactivateModalUser(null);
            },
            onError: (errors) => {
                console.error('Reactivation failed:', errors);
                setReactivateModalUser(null); // Close modal even on error
            }
        });
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
                    <a
                        href="/dashboard"
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </a>{" "}
                    / <span>Users</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section with Search and Add Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Employee Information
                    </h1>

                    <div className="flex space-x-5">
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
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={`${user.first_name || user.email}'s avatar`}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-[#37692F] flex items-center justify-center text-white text-sm font-bold">
                                                {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
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
                                        <span className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-poppins font-medium shadow-md">
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

                                    <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-60">
                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    {/* EDIT AND DEACTIVATE BUTTONS */}
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            {/* Edit */}
                                            <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                                <svg className="w-8 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>

                                            {/* Deactivate/Reactivate Button */}
                                            {user.id === auth.user.id ? (
                                                // Show disabled button for current user
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
        </AuthenticatedLayout>
    );
}