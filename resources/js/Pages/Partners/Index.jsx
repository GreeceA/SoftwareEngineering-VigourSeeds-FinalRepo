import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import '../../../css/fonts.css';
import { ArchiveBoxIcon, ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon, ArrowDownTrayIcon} from '@heroicons/react/24/outline';
import ArchivePartnerModal from '@/Pages/Partners/ArchivePartnerModal';
import ReactivatePartnerModal from '@/Pages/Partners/ReactivatePartnerModal';
import Vlogo from '@/assets/vigour-logo.png';


export default function Index({ auth, partners, filters }) {
    const { auth: authData } = usePage().props;
    const permissions = authData?.user?.can || [];

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
    const [showExportDropdown, setShowExportDropdown] = useState(false);

    const filterRef = useRef(null);
    const sortRef = useRef(null);
    const typeRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterDropdown(false);
            if (sortRef.current && !sortRef.current.contains(event.target)) setShowSortDropdown(false);
            if (typeRef.current && !typeRef.current.contains(event.target)) setShowTypeDropdown(false);
            if (exportRef.current && !exportRef.current.contains(event.target)) setShowExportDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
    const exportRef = useRef(null);
    
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

    const handleExport = (format) => {
        window.location.href = route('partners.export', { format });
        setShowExportDropdown(false);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Partners" />

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
                        <span className="text-[#37692F] font-medium">Partners</span>
                    </nav>

                    {/* Header Content */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Title & Description */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Partners</h1>
                                <p className="text-gray-600">Manage partner organizations and relationships</p>
                            </div>
                        </div>

                        {/* Stats Badge */}
                        <div className="hidden lg:flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium text-amber-700">{partners?.data?.length || 0} Partners</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Filters & Actions Section */}
                <div className="mb-6 flex items-center justify-end">
                    <div className="flex space-x-3">

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
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
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

                        {/* Status Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => {
                                    setShowFilterDropdown(!showFilterDropdown);
                                    setShowSortDropdown(false);
                                    setShowTypeDropdown(false);
                                }}
                                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 focus:ring-[#37692F] focus:outline-none focus:ring-2"
                            >
                                <FunnelIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {getFilterLabel()}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                                    <div className="py-1">
                                        {['all', 'active', 'inactive'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilter(status);
                                                    setShowFilterDropdown(false);
                                                    fetchPartners({ status: status !== 'all' ? status : '', page: 1 });
                                                }}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${filter === status ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {status === 'all' ? 'All Partners' : status.charAt(0).toUpperCase() + status.slice(1) + ' Only'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={typeRef}>
                            <button
                                onClick={() => {
                                    setShowTypeDropdown(!showTypeDropdown);
                                    setShowSortDropdown(false);
                                    setShowFilterDropdown(false);
                                }}
                                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 focus:ring-[#37692F] focus:outline-none focus:ring-2"
                            >
                                <FunnelIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {getTypeLabel()}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                            </button>
                            {showTypeDropdown && (
                                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                                    <div className="py-1">
                                        {['all', 'individual', 'organization'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    setPartnerTypeFilter(type);
                                                    setShowTypeDropdown(false);
                                                    fetchPartners({ partner_type: type !== 'all' ? type : '', page: 1 });
                                                }}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${partnerTypeFilter === type ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
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
                                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 focus:ring-[#37692F] focus:outline-none focus:ring-2"
                            >
                                <ArrowsUpDownIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {getSortLabel()}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                            </button>
                            {showSortDropdown && (
                                <div className="absolute right-0 z-10 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setSortBy('id');
                                                setSortDir('desc');
                                                setShowSortDropdown(false);
                                                fetchPartners({ sort_by: 'id', sort_dir: 'desc', page: 1 });
                                            }}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortBy === 'id' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
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
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortBy === 'name' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
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
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortBy === 'name' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
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
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortBy === 'email' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
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
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortBy === 'email' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
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
                                className="w-[400px] rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:ring-[#37692F] focus:outline-none focus:ring-2"
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

                        {/* Add Partner Button - Only show if user has 'create partners' permission */}
                        {permissions.includes('create partners') && (
                            <Link
                                href={route('partners.create')}
                                className="flex items-center rounded-md bg-[#37692F] px-4 py-2 text-white hover:bg-[#2a5624]"
                            >
                                <svg
                                    className="mr-2 h-5 w-5"
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
                        )}
                    </div>
                </div>

                {/* Partners Table */}
                <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#37692F] text-xs uppercase text-gray-600">
                            <tr>
                                {['NAME', 'TYPE', 'EMAIL', 'PHONE', 'STATUS', 'ACTIONS'].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-4 font-poppins text-[14px] font-medium text-white"
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
                                        <td className="px-6 py-4 font-poppins text-[13px] font-normal text-gray-900">
                                            <Link
                                                href={route('partners.show', partner.id)}
                                                className="transition-colors duration-200 hover:text-[#37692F]"
                                                title="View Partner Details"
                                            >
                                                {partner.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-poppins font-medium shadow-sm ${getTypeColor(partner.partner_type)}`}>
                                                {partner.partner_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-poppins text-[13px] font-normal text-gray-900">
                                            {partner.email}
                                        </td>
                                        <td className="px-6 py-4 font-poppins text-[13px] font-normal text-gray-900">
                                            {partner.phone}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-poppins font-normal ${getStatusColor(partner.status)}`}
                                            >
                                                {partner.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {/* Edit Button - Only show if user has 'edit partners' permission AND partner is active */}
                                                {partner.status === 'active' ? (
                                                    permissions.includes('edit partners') ? (
                                                        <Link
                                                            href={route('partners.edit', partner.id)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="Edit Partner"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                    ) : null
                                                ) : (
                                                    <span
                                                        className="cursor-not-allowed text-gray-400"
                                                        title="Cannot edit inactive partner"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </span>
                                                )}
                                                
                                                {/* Archive/Reactivate Button - Only show if user has 'deactivate partners' permission */}
                                                {permissions.includes('archive partners') && (
                                                    partner.status === 'active' ? (
                                                        <button
                                                            className="text-yellow-600 hover:text-yellow-800"
                                                            onClick={() => {
                                                                setSelectedPartner(partner);
                                                                setShowDeactivateModal(true);
                                                            }}
                                                            title="Archive Partner"
                                                        >
                                                            <ArchiveBoxIcon className="h-5 w-5" /> 
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
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                        </button>
                                                    )
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

                <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Per Page Selector */}
                    <div className="relative flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Show</span>
                        <div className="relative">
                            <select
                                className="appearance-none rounded border border-gray-300 px-2 py-1 pr-6 text-sm focus:ring-[#37692F] focus:border-[#37692F]"
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
                        <div className="flex w-full justify-center md:w-auto">
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

            {/* Modals */}
            {showDeactivateModal && (
                <ArchivePartnerModal
                    partner={selectedPartner}
                    onCancel={handleDeactivateCancel}
                    onConfirm={handleDeactivateConfirm}
                />
            )}

            {showReactivateModal && (
                <ReactivatePartnerModal
                    partner={reactivateModalPartner}
                    onCancel={handleReactivateCancel}
                    onConfirm={handleReactivateConfirm}
                />
            )}
        </AuthenticatedLayout>
    );
}