import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import '../../../css/fonts.css';
import { UserMinusIcon, ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import DeactivateModal from '@/Pages/Users/DeactivateModal';
import ReactivateModal from '@/Pages/Users/ReactivateModal';

export default function Index({ auth, partners, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [filter, setFilter] = useState(filters.status || 'all');
    const [partnerTypeFilter, setPartnerTypeFilter] = useState(filters.partner_type || 'all');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'id');
    const [sortDir, setSortDir] = useState(filters.sort_dir || 'desc');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [showReactivateModal, setShowReactivateModal] = useState(false);
    const [reactivateModalPartner, setReactivateModalPartner] = useState(null);
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    const filterRef = useRef(null);
    const sortRef = useRef(null);
    const typeRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterDropdown(false);
            if (sortRef.current && !sortRef.current.contains(event.target)) setShowSortDropdown(false);
            if (typeRef.current && !typeRef.current.contains(event.target)) setShowTypeDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Always fetch from backend on search/filter/sort/perPage change
    const fetchPartners = (params = {}) => {
        router.get(route('partners.index'), {
            search,
            status: filter !== 'all' ? filter : '',
            partner_type: partnerTypeFilter !== 'all' ? partnerTypeFilter : '',
            sort_by: sortBy,
            sort_dir: sortDir,
            per_page: perPage,
            ...params,
        }, { preserveState: true, replace: true });
    };

    const debouncedSearch = debounce((value) => {
        setSearch(value);
        fetchPartners({ search: value, page: 1 });
    }, 300);

    const handleSearchChange = (e) => debouncedSearch(e.target.value);

    const getFilterLabel = () => filter === 'active' ? 'Active Only' : filter === 'inactive' ? 'Inactive Only' : 'All Partners';
    const getTypeLabel = () => partnerTypeFilter === 'individual' ? 'Individual' : partnerTypeFilter === 'organization' ? 'Organization' : 'All Types';
    const getSortLabel = () => {
        if (sortBy === 'name') return sortDir === 'asc' ? 'Name (A to Z)' : 'Name (Z to A)';
        if (sortBy === 'email') return sortDir === 'asc' ? 'Email (A to Z)' : 'Email (Z to A)';
        return 'Default';
    };
    const getStatusColor = (status) => status === 'active' ? "bg-green-100 text-green-700" : status === 'inactive' ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700";
    const getTypeColor = (type) => type === 'organization' ? "bg-purple-600 text-white" : type === 'individual' ? "bg-blue-600 text-white" : "bg-gray-600 text-white";

    const handleDeactivateConfirm = (id) => {
        router.post(route('partners.deactivate', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeactivateModal(false);
                setSelectedPartner(null);
            }
        });
    };

    const handleDeactivateCancel = () => {
        setShowDeactivateModal(false);
        setSelectedPartner(null);
    };

    const handleReactivateConfirm = (id) => {
        router.post(route('partners.reactivate', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowReactivateModal(false);
                setReactivateModalPartner(null);
            }
        });
    };
    
    const handleReactivateCancel = () => {
        setShowReactivateModal(false);
        setReactivateModalPartner(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Partners</span>
                </h2>
            }
        >
            <Head title="Partners" />

            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / <span>Partners</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Partners</h1>
                    <div className="flex space-x-3">
                        {/* Status Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => {
                                    setShowFilterDropdown(!showFilterDropdown);
                                    setShowSortDropdown(false);
                                    setShowTypeDropdown(false);
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
                                        {['all', 'active', 'inactive'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilter(status);
                                                    setShowFilterDropdown(false);
                                                    fetchPartners({ status: status !== 'all' ? status : '', page: 1 });
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filter === status ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {status === 'all' ? 'All Partners' : status.charAt(0).toUpperCase() + status.slice(1) + ' Only'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Type Filter Dropdown */}
                        <div className="relative" ref={typeRef}>
                            <button
                                onClick={() => {
                                    setShowTypeDropdown(!showTypeDropdown);
                                    setShowSortDropdown(false);
                                    setShowFilterDropdown(false);
                                }}
                                className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] bg-white"
                            >
                                <FunnelIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {getTypeLabel()}
                                <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                            </button>
                            {showTypeDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        {['all', 'individual', 'organization'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    setPartnerTypeFilter(type);
                                                    setShowTypeDropdown(false);
                                                    fetchPartners({ partner_type: type !== 'all' ? type : '', page: 1 });
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${partnerTypeFilter === type ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
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
                                    setShowTypeDropdown(false);
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
                                                fetchPartners({ sort_by: 'id', sort_dir: 'desc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'id' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Default
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('name');
                                                setSortDir('asc');
                                                setShowSortDropdown(false);
                                                fetchPartners({ sort_by: 'name', sort_dir: 'asc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'name' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Name (A to Z)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('name');
                                                setSortDir('desc');
                                                setShowSortDropdown(false);
                                                fetchPartners({ sort_by: 'name', sort_dir: 'desc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'name' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Name (Z to A)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('email');
                                                setSortDir('asc');
                                                setShowSortDropdown(false);
                                                fetchPartners({ sort_by: 'email', sort_dir: 'asc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'email' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Email (A to Z)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('email');
                                                setSortDir('desc');
                                                setShowSortDropdown(false);
                                                fetchPartners({ sort_by: 'email', sort_dir: 'desc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'email' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Email (Z to A)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
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

                        {/* Add Partner Button */}
                        <Link
                            href={route('partners.create')}
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
                            Add Partner
                        </Link>
                    </div>
                </div>

                {/* Partners Table */}
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#37692F] text-gray-600 uppercase text-xs">
                            <tr>
                                {['NAME', 'TYPE', 'EMAIL', 'PHONE', 'STATUS', 'ACTIONS'].map((header) => (
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
                            {partners.data.length > 0 ? (
                                partners.data.map((partner) => (
                                    <tr key={partner.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            <Link
                                                href={route('partners.show', partner.id)}
                                                className="transition-colors duration-200 hover:text-[#37692F]"
                                                title="View Partner Details"
                                            >
                                                {partner.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium shadow-sm ${getTypeColor(partner.partner_type)}`}>
                                                {partner.partner_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            {partner.email}
                                        </td>
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            {partner.phone}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-poppins font-normal ${getStatusColor(partner.status)}`}
                                            >
                                                {partner.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route('partners.edit', partner.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit Partner"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                {partner.status === 'active' ? (
                                                    <button
                                                        className="text-red-600 hover:text-red-800"
                                                        onClick={() => {
                                                            setSelectedPartner(partner);
                                                            setShowDeactivateModal(true);
                                                        }}
                                                        title="Deactivate Partner"
                                                    >
                                                        <UserMinusIcon className="w-5 h-5" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="text-green-600 hover:text-green-800"
                                                        onClick={() => {
                                                            setReactivateModalPartner(partner);
                                                            setShowReactivateModal(true);
                                                        }}
                                                        title="Reactivate Partner"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No partners found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
                                    fetchPartners({ per_page: e.target.value, page: 1 });
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
                    {partners && partners.links && partners.links.length > 1 && (
                        <div className="flex justify-center w-full md:w-auto">
                            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                {partners.links.map((link, idx) => {
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

            {showDeactivateModal && (
                <DeactivateModal
                    user={selectedPartner}
                    onCancel={handleDeactivateCancel}
                    onConfirm={handleDeactivateConfirm}
                />
            )}

            {showReactivateModal && (
                <ReactivateModal
                    user={reactivateModalPartner}
                    onCancel={handleReactivateCancel}
                    onConfirm={handleReactivateConfirm}
                />
            )}
        </AuthenticatedLayout>
    );
}