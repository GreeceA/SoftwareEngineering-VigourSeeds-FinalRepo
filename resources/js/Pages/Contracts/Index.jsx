import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import '../../../css/fonts.css';
import { ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

export default function Index({ auth, contracts, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'id');
    const [sortDir, setSortDir] = useState(filters.sort_dir || 'desc');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    const filterRef = useRef(null);
    const sortRef = useRef(null);

    // Filter and Sort Lists (UPDATED to match new ENUM and sortable fields)
    const statusOptions = ['all', 'draft', 'under_review', 'active', 'suspended', 'terminated', 'cancelled', 'completed'];
    const sortOptions = [
        { key: 'id', dir: 'desc', label: 'Default (Newest)' },
        { key: 'contract_name', dir: 'asc', label: 'Title (A to Z)' },
        { key: 'contract_name', dir: 'desc', label: 'Title (Z to A)' },
        { key: 'signing_date', dir: 'asc', label: 'Date (Oldest First)' }, // Renamed from contract_date
        { key: 'signing_date', dir: 'desc', label: 'Date (Newest First)' }, // Renamed from contract_date
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterDropdown(false);
            if (sortRef.current && !sortRef.current.contains(event.target)) setShowSortDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchContracts = (params = {}) => {
        router.get(route('contracts.index'), {
            search,
            status: statusFilter !== 'all' ? statusFilter : '',
            sort_by: sortBy,
            sort_dir: sortDir,
            per_page: perPage,
            ...params,
        }, { preserveState: true, replace: true });
    };

    const debouncedSearch = debounce((value) => {
        setSearch(value);
        fetchContracts({ search: value, page: 1 });
    }, 300);

    const handleSearchChange = (e) => debouncedSearch(e.target.value);

    const getFilterLabel = () => {
        if (statusFilter === 'all') return 'All Statuses';
        // Capitalize and replace underscore for better display (if applicable)
        return statusFilter.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getSortLabel = () => {
        const option = sortOptions.find(o => o.key === sortBy && o.dir === sortDir);
        return option ? option.label : 'Default';
    };

    // UPDATED: Status Colors to match new ENUM values
    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-200 text-gray-800',
            under_review: 'bg-blue-100 text-blue-700', // NEW
            active: 'bg-green-100 text-green-700',
            suspended: 'bg-yellow-100 text-yellow-700',
            terminated: 'bg-red-100 text-red-700',
            cancelled: 'bg-pink-100 text-pink-700',
            completed: 'bg-[#37692F]/20 text-[#37692F]', // NEW (Completed/Success)
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    // Helper for Date Formatting
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return dayjs(dateString).format('MMM D, YYYY');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Contracts</span>
                </h2>
            }
        >
            <Head title="Contracts" />

            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / <span>Contracts</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section and Controls */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Contract Management</h1>
                    <div className="flex space-x-3">
                        {/* Status Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => {
                                    setShowFilterDropdown(!showFilterDropdown);
                                    setShowSortDropdown(false);
                                }}
                                className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] bg-white"
                            >
                                <FunnelIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {getFilterLabel()}
                                <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        {statusOptions.map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setStatusFilter(status);
                                                    setShowFilterDropdown(false);
                                                    fetchContracts({ status: status !== 'all' ? status : '', page: 1 });
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${statusFilter === status ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {status === 'all' ? 'All Statuses' : status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </button>
                                        ))}
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
                                className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] bg-white"
                            >
                                <ArrowsUpDownIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {getSortLabel()}
                                <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                            </button>
                            {showSortDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option.key + option.dir}
                                                onClick={() => {
                                                    setSortBy(option.key);
                                                    setSortDir(option.dir);
                                                    setShowSortDropdown(false);
                                                    fetchContracts({ sort_by: option.key, sort_dir: option.dir, page: 1 });
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === option.key && sortDir === option.dir ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name, partner, or seed..."
                                defaultValue={search}
                                onChange={handleSearchChange}
                                className="w-[300px] pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        {/* Create Contract Button */}
                        <Link
                            href={route('contracts.create')}
                            className="bg-[#37692F] text-white px-4 py-2 rounded-md hover:bg-[#2a5624] flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            New Contract
                        </Link>
                    </div>
                </div>

                {/* Contracts Table */}
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#37692F] text-gray-600 uppercase text-xs">
                            <tr>
                                {/* UPDATED Headers for Clarity */}
                                {['CONTRACT NAME', 'PARTNER', 'SIGNING DATE', 'EXPIRATION DATE', 'SEEDS', 'STATUS', 'ACTIONS'].map((header) => (
                                    <th key={header} className="px-6 py-4 font-poppins font-medium text-[14px] text-white">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {contracts.data.length > 0 ? (
                                contracts.data.map((contract) => (
                                    <tr key={contract.id} className="hover:bg-gray-50">
                                        {/* Contract Name (was title) */}
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            <Link
                                                href={route('contracts.show', contract.id)}
                                                className="transition-colors duration-200 hover:text-[#37692F] font-medium"
                                                title="View Contract Details"
                                            >
                                                {contract.contract_name}
                                            </Link>
                                        </td>
                                        {/* Partner Name */}
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            {contract.partner_name}
                                        </td>
                                        {/* Signing Date (was contract_date) */}
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            {formatDate(contract.signing_date)}
                                        </td>
                                        {/* Expiration Date */}
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            {formatDate(contract.expiration_date)}
                                        </td>
                                        {/* Seed Varieties */}
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900 max-w-xs truncate">
                                            {contract.seed_varieties || '-'}
                                        </td>
                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-poppins font-normal ${getStatusColor(contract.status)}`}
                                            >
                                                {contract.status.replace(/_/g, ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route('contracts.show', contract.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="View Details"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </Link>
                                                <Link
                                                    href={route('contracts.edit', contract.id)}
                                                    className={`text-blue-600 hover:text-blue-800 ${contract.status === 'cancelled' ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}
                                                    title="Edit Contract"
                                                    tabIndex={contract.status === 'cancelled' ? -1 : 0}
                                                    aria-disabled={contract.status === 'cancelled'}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        No contracts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination and Per Page Selector (Unchanged) */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-4">
                    {/* Per Page Selector */}
                    <div className="flex items-center space-x-2 relative">
                        <span className="text-sm text-gray-700">Show</span>
                        <div className="relative">
                            <select
                                className="appearance-none border border-gray-300 rounded px-2 py-1 pr-6 text-sm focus:ring-[#37692F] focus:border-[#37692F]"
                                value={perPage}
                                onChange={e => {
                                    setPerPage(Number(e.target.value));
                                    fetchContracts({ per_page: e.target.value, page: 1 });
                                }}
                            >
                                {[10, 25, 50, 100].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <span className="text-sm text-gray-700">entries</span>
                    </div>

                    {/* Pagination Controls */}
                    {contracts && contracts.links && contracts.links.length > 1 && (
                        <div className="flex justify-center w-full md:w-auto">
                            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                {contracts.links.map((link, idx) => {
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
        </AuthenticatedLayout>
    );
}