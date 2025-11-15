import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import '../../../css/fonts.css';
import { ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import Vlogo from '@/assets/vigour-logo.png';

export default function Index({ auth, contracts, filters }) {
    const { auth: authData } = usePage().props;
    const permissions = authData?.user?.can || [];
    
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'id');
    const [sortDir, setSortDir] = useState(filters.sort_dir || 'desc');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    const filterRef = useRef(null);
    const sortRef = useRef(null);

    // Filter and Sort Lists
    const statusOptions = ['all', 'draft', 'under_review', 'active', 'suspended', 'terminated', 'cancelled', 'completed'];
    const sortOptions = [
        { key: 'id', dir: 'desc', label: 'Default (Newest)' },
        { key: 'contract_name', dir: 'asc', label: 'Title (A to Z)' },
        { key: 'contract_name', dir: 'desc', label: 'Title (Z to A)' },
        { key: 'signing_date', dir: 'asc', label: 'Date (Oldest First)' },
        { key: 'signing_date', dir: 'desc', label: 'Date (Newest First)' },
    ];

    // --- EFFECTS AND DATA FETCHING ---
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

    // --- HELPER FUNCTIONS ---
    const getFilterLabel = () => {
        if (statusFilter === 'all') return 'All Statuses';
        // Capitalize and replace underscore for better display
        return statusFilter.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getSortLabel = () => {
        const option = sortOptions.find(o => o.key === sortBy && o.dir === sortDir);
        return option ? option.label : 'Default';
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-200 text-gray-800',
            under_review: 'bg-blue-100 text-blue-700',
            active: 'bg-green-100 text-green-700',
            suspended: 'bg-yellow-100 text-yellow-700',
            terminated: 'bg-red-100 text-red-700',
            cancelled: 'bg-pink-100 text-pink-700',
            completed: 'bg-[#37692F]/20 text-[#37692F]',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return dayjs(dateString).format('MMM D, YYYY');
    };

    // --- RENDER ---
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Contracts" />

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
                        <span className="text-[#37692F] font-medium">Contracts</span>
                    </nav>

                    {/* Header Content */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Title & Description */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Contract Management</h1>
                                <p className="text-gray-600">Manage partner contracts and agreements</p>
                            </div>
                        </div>

                        {/* Stats Badge */}
                        <div className="hidden lg:flex items-center space-x-2 bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-2">
                            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="text-sm font-medium text-cyan-700">{contracts?.data?.length || 0} Contracts</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Filters & Actions Section */}
                <div className="mb-6 flex items-center justify-end">
                    <div className="flex space-x-3">
                        <button
                            onClick={() => window.location.href = route('contracts.export.pdf', {
                                search,
                                status: statusFilter,
                                sort_by: sortBy,
                                sort_dir: sortDir,
                                per_page: perPage,
                            })}
                            className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] bg-white"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Export as PDF
                        </button>
                        
                        {/* Status Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => {
                                    setShowFilterDropdown(!showFilterDropdown);
                                    setShowSortDropdown(false);
                                }}
                                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                            >
                                <FunnelIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {getFilterLabel()}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
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
                                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                            >
                                <ArrowsUpDownIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {getSortLabel()}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                            </button>
                            {showSortDropdown && (
                                <div className="absolute right-0 z-10 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg">
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
                                className="w-[300px] rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        {/* Create Contract Button */}
                        {permissions.includes('create contracts') && (
                            <Link
                                href={route('contracts.create')}
                                className="flex items-center rounded-md bg-[#37692F] px-4 py-2 text-white hover:bg-[#2a5624]"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                New Contract
                            </Link>
                        )}
                    </div>
                </div>

                {/* Contracts Table */}
                <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#37692F] text-gray-600 uppercase text-xs">
                            <tr>
                                {/* UPDATED Headers for Clarity */}
                                {['CONTRACT NAME', 'PARTNER', 'SIGNING DATE', 'EXPIRATION DATE', 'SEEDS', 'STATUS', 'ACTIONS'].map((header) => (
                                    <th key={header} className="px-6 py-4 font-poppins text-[14px] font-medium text-white">
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
                                        <td className="px-6 py-4 font-poppins text-[13px] font-medium text-gray-900">
                                            <Link
                                                href={route('contracts.show', contract.id)}
                                                className="transition-colors duration-200 hover:text-[#37692F]"
                                                title="View Contract Details"
                                            >
                                                {contract.contract_name}
                                            </Link>
                                        </td>
                                        {/* Partner Name */}
                                        <td className="px-6 py-4 font-poppins text-[13px] font-normal text-gray-900">
                                            {contract.partner_name}
                                        </td>
                                        {/* Signing Date (was contract_date) */}
                                        <td className="px-6 py-4 font-poppins text-[13px] font-normal text-gray-900">
                                            {formatDate(contract.signing_date)}
                                        </td>
                                        {/* Expiration Date */}
                                        <td className="px-6 py-4 font-poppins text-[13px] font-normal text-gray-900">
                                            {formatDate(contract.expiration_date)}
                                        </td>
                                        {/* Seed Varieties */}
                                        <td className="px-6 py-4 font-poppins text-[13px] font-normal text-gray-900 max-w-xs truncate">
                                            {contract.seed_varieties || '-'}
                                        </td>
                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 font-poppins text-xs font-normal ${getStatusColor(contract.status)}`}
                                            >
                                                {contract.status.replace(/_/g, ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {permissions.includes('view contracts') && (
                                                    <Link
                                                        href={route('contracts.show', contract.id)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="View Details"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    </Link>
                                                )}
                                                {permissions.includes('edit contracts') && (
                                                    <Link
                                                        href={route('contracts.edit', contract.id)}
                                                        className={`text-blue-600 hover:text-blue-800 ${
                                                            ['cancelled', 'active', 'terminated', 'completed'].includes(contract.status)
                                                                ? 'pointer-events-none opacity-50 cursor-not-allowed'
                                                                : ''
                                                        }`}
                                                        title="Edit Contract"
                                                        tabIndex={['cancelled', 'active', 'terminated', 'completed'].includes(contract.status) ? -1 : 0}
                                                        aria-disabled={['cancelled', 'active', 'terminated', 'completed'].includes(contract.status)}
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </Link>
                                                )}
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
                <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Per Page Selector */}
                    <div className="relative flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Show</span>
                        <div className="relative">
                            <select
                                className="appearance-none rounded border border-gray-300 px-2 py-1 pr-6 text-sm focus:border-[#37692F] focus:ring-[#37692F]"
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
                        <div className="flex w-full justify-center md:w-auto">
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
                                                `border px-3 py-2 text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 border-[#37692F] bg-[#37692F] text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
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