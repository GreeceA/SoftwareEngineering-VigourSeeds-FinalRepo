import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import '../../../css/fonts.css';
import { ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterDropdown(false);
            if (sortRef.current && !sortRef.current.contains(event.target)) setShowSortDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch contracts from backend on search/filter/sort/perPage change
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
        return statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
    };

    const getSortLabel = () => {
        if (sortBy === 'title') return sortDir === 'asc' ? 'Title (A to Z)' : 'Title (Z to A)';
        if (sortBy === 'contract_date') return sortDir === 'asc' ? 'Date (Oldest First)' : 'Date (Newest First)';
        return 'Default';
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-700',
            active: 'bg-green-100 text-green-700',
            suspended: 'bg-yellow-100 text-yellow-700',
            terminated: 'bg-red-100 text-red-700',
            cancelled: 'bg-red-100 text-red-700',
            archived: 'bg-gray-100 text-gray-500',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
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
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Contracts</h1>
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
                                        {['all', 'draft', 'active', 'suspended', 'terminated', 'cancelled', 'archived'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setStatusFilter(status);
                                                    setShowFilterDropdown(false);
                                                    fetchContracts({ status: status !== 'all' ? status : '', page: 1 });
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${statusFilter === status ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
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
                                        <button
                                            onClick={() => {
                                                setSortBy('id');
                                                setSortDir('desc');
                                                setShowSortDropdown(false);
                                                fetchContracts({ sort_by: 'id', sort_dir: 'desc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'id' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Default
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('title');
                                                setSortDir('asc');
                                                setShowSortDropdown(false);
                                                fetchContracts({ sort_by: 'title', sort_dir: 'asc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'title' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Title (A to Z)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('title');
                                                setSortDir('desc');
                                                setShowSortDropdown(false);
                                                fetchContracts({ sort_by: 'title', sort_dir: 'desc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'title' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Title (Z to A)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('contract_date');
                                                setSortDir('asc');
                                                setShowSortDropdown(false);
                                                fetchContracts({ sort_by: 'contract_date', sort_dir: 'asc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'contract_date' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Date (Oldest First)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('contract_date');
                                                setSortDir('desc');
                                                setShowSortDropdown(false);
                                                fetchContracts({ sort_by: 'contract_date', sort_dir: 'desc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'contract_date' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Date (Newest First)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by title, partner, or seed varieties..."
                                defaultValue={search}
                                onChange={handleSearchChange}
                                className="w-[400px] pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37692F]"
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

                        {/* Create Contract Button */}
                        <Link
                            href={route('contracts.create')}
                            className="bg-[#37692F] text-white px-4 py-2 rounded-md hover:bg-[#2a5624] flex items-center"
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
                            Create Contract
                        </Link>
                    </div>
                </div>

                {/* Contracts Table */}
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#37692F] text-gray-600 uppercase text-xs">
                            <tr>
                                {['TITLE', 'PARTNER', 'CONTRACT DATE', 'EFFECTIVE DATE', 'EXPIRATION DATE', 'SEED VARIETIES', 'STATUS', 'ACTIONS'].map((header) => (
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
                            {contracts.data.length > 0 ? (
                                contracts.data.map((contract) => (
                                    <tr key={contract.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            <Link
                                                href={route('contracts.show', contract.id)}
                                                className="transition-colors duration-200 hover:text-[#37692F]"
                                                title="View Contract Details"
                                            >
                                                {contract.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            {contract.partner_name}
                                        </td>
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            {contract.contract_date}
                                        </td>
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            {contract.effective_date || '-'}
                                        </td>
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            {contract.expiration_date || '-'}
                                        </td>
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900 max-w-xs truncate">
                                            {contract.seed_varieties}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-poppins font-normal ${getStatusColor(contract.status)}`}
                                            >
                                                {contract.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route('contracts.show', contract.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="View Contract"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={route('contracts.edit', contract.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit Contract"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                        No contracts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination and Per Page Selector */}
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