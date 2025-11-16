import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import ArchiveModal from './ArchiveItemsModal';
import ActivateModal from './ActivateItemsModal';
import { ArchiveBoxIcon, ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Vlogo from '@/assets/vigour-logo.png';

export default function Index({ auth, items, filters }) {
    const { auth: authData } = usePage().props;
    const permissions = authData?.user?.can || [];

    const [search, setSearch] = useState(filters.search || '');
    const [filter, setFilter] = useState(filters.status || 'all');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'id');
    const [sortDir, setSortDir] = useState(filters.sort_dir || 'desc');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    
    const exportRef = useRef(null);
    const filterRef = useRef(null);
    const sortRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterDropdown(false);
            if (sortRef.current && !sortRef.current.contains(event.target)) setShowSortDropdown(false);
            if (exportRef.current && !exportRef.current.contains(event.target)) setShowExportDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = (format) => {
        window.location.href = route('items.export', { format });
        setShowExportDropdown(false);
    };
    // Always fetch from backend on search/filter/sort/perPage change
    const fetchItems = (params = {}) => {
        router.get(route('items.index'), {
            search,
            status: filter !== 'all' ? filter : '',
            sort_by: sortBy,
            sort_dir: sortDir,
            per_page: perPage,
            ...params,
        }, { preserveState: true, replace: true });
    };

    const debouncedSearch = debounce((value) => {
        setSearch(value);
        fetchItems({ search: value, page: 1 });
    }, 300);

    const handleSearchChange = (e) => debouncedSearch(e.target.value);

    // Label Helpers
    const getFilterLabel = () => {
        switch (filter) {
            case 'active': return 'Active Only';
            case 'archived': return 'Archived Only';
            default: return 'All Items';
        }
    };

    const getSortLabel = () => {
        if (sortBy === 'name') return sortDir === 'asc' ? 'Name (A to Z)' : 'Name (Z to A)';
        if (sortBy === 'price_per_unit') return sortDir === 'asc' ? 'Price (Low to High)' : 'Price (High to Low)';
        return 'Default';
    };

    // Style Helpers
    const getStatusColor = (status) =>
        status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

    const getTypeColor = (type) =>
        type === 'fertilizer' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700";

    // Action Handlers
    const handleArchiveConfirm = (id) => {
        router.patch(route('items.archive', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowArchiveModal(false);
                setSelectedItem(null);
            }
        });
    };

    const handleActivateConfirm = (id) => {
        router.patch(route('items.activate', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowActivateModal(false);
                setSelectedItem(null);
            }
        });
    };

    const handleArchiveCancel = () => {
        setShowArchiveModal(false);
        setSelectedItem(null);
    };

    const handleActivateCancel = () => {
        setShowActivateModal(false);
        setSelectedItem(null);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Items Management" />

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
                        <span className="text-[#37692F] font-medium">Items Management</span>
                    </nav>

                    {/* Header Content */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Title & Description */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Items Management System</h1>
                                <p className="text-gray-600">Track and manage inventory items and supplies</p>
                            </div>
                        </div>

                        {/* Stats Badge */}
                        <div className="hidden lg:flex items-center space-x-2 bg-teal-50 border border-teal-200 rounded-lg px-4 py-2">
                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <span className="text-sm font-medium text-teal-700">{items?.data?.length || 0} Items</span>
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
                                onClick={() => {
                                    setShowFilterDropdown(!showFilterDropdown);
                                    setShowSortDropdown(false);
                                }}
                                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 focus:ring-[#37692F] focus:outline-none focus:ring-2"
                            >
                                <FunnelIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {getFilterLabel()}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute left-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                                    <div className="py-1">
                                        {['all', 'active', 'archived'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilter(status);
                                                    setShowFilterDropdown(false);
                                                    fetchItems({ status: status !== 'all' ? status : '', page: 1 });
                                                }}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${filter === status ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {status === 'all' ? 'All Items' : status.charAt(0).toUpperCase() + status.slice(1) + ' Only'}
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
                                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 focus:ring-[#37692F] focus:outline-none focus:ring-2"
                            >
                                <ArrowsUpDownIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {getSortLabel()}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                            </button>
                            {showSortDropdown && (
                                <div className="absolute left-0 z-10 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg">
                                    <div className="py-1">
                                        <button
                                            onClick={() => { setSortBy('id'); setSortDir('desc'); setShowSortDropdown(false); fetchItems({ sort_by: 'id', sort_dir: 'desc', page: 1 }); }}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortBy === 'id' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Default (Newest)
                                        </button>
                                        <button
                                            onClick={() => { setSortBy('name'); setSortDir('asc'); setShowSortDropdown(false); fetchItems({ sort_by: 'name', sort_dir: 'asc', page: 1 }); }}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortBy === 'name' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Name (A to Z)
                                        </button>
                                        <button
                                            onClick={() => { setSortBy('name'); setSortDir('desc'); setShowSortDropdown(false); fetchItems({ sort_by: 'name', sort_dir: 'desc', page: 1 }); }}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortBy === 'name' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Name (Z to A)
                                        </button>
                                        <button
                                            onClick={() => { setSortBy('price_per_unit'); setSortDir('asc'); setShowSortDropdown(false); fetchItems({ sort_by: 'price_per_unit', sort_dir: 'asc', page: 1 }); }}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortBy === 'price_per_unit' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Price (Low to High)
                                        </button>
                                        <button
                                            onClick={() => { setSortBy('price_per_unit'); setSortDir('desc'); setShowSortDropdown(false); fetchItems({ sort_by: 'price_per_unit', sort_dir: 'desc', page: 1 }); }}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortBy === 'price_per_unit' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Price (High to Low)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name or description..."
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

                        {/* Add Item Button - Only show if user has 'create items' permission */}
                        {permissions.includes('create items') && (
                            <Link
                                href={route('items.create')}
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
                                Add Item
                            </Link>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#37692F] text-xs uppercase text-gray-600">
                            <tr>
                                {['NAME', 'TYPE', 'BASE UNIT', 'PRICE', 'STATUS', 'ACTIONS'].map((header) => (
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
                            {items.data.length > 0 ? (
                                items.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <Link
                                                    href={route('items.show', item.id)}
                                                    className="font-poppins text-[13px] font-medium text-gray-900 transition-colors duration-200 hover:text-[#37692F]"
                                                >
                                                    {item.name}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-poppins font-normal ${getTypeColor(item.type)}`}
                                            >
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-poppins text-[13px] font-normal text-gray-900">
                                                {item.base_unit}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-poppins text-[13px] font-medium text-gray-900">
                                                {new Intl.NumberFormat('en-PH', { 
                                                    style: 'currency',
                                                    currency: 'PHP',
                                                    minimumFractionDigits: 2,
                                                }).format(item.price_per_unit)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-poppins font-normal ${getStatusColor(item.status)}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {/* Edit Button - Only show if user has 'edit items' permission AND item is active */}
                                                {item.status === 'active' ? (
                                                    permissions.includes('edit items') ? (
                                                        <Link
                                                            href={route('items.edit', item.id)}
                                                            className="text-blue-600 transition-colors duration-200 hover:text-blue-800"
                                                            title="Edit Item"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                    ) : null
                                                ) : (
                                                    <span
                                                        className="cursor-not-allowed text-gray-400"
                                                        title="Cannot edit archived item"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </span>
                                                )}

                                                {/* Archive/Activate Button - Only show if user has 'archive items' permission */}
                                                {permissions.includes('archive items') && (
                                                    item.status === 'active' ? (
                                                        <button
                                                            className="text-yellow-600 transition-colors duration-200 hover:text-yellow-800"
                                                            onClick={() => {
                                                                setSelectedItem(item);
                                                                setShowArchiveModal(true);
                                                            }}
                                                            title="Archive Item"
                                                        >
                                                            <ArchiveBoxIcon className="h-5 w-5" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="text-green-600 transition-colors duration-200 hover:text-green-800"
                                                            onClick={() => {
                                                                setSelectedItem(item);
                                                                setShowActivateModal(true);
                                                            }}
                                                            title="Activate Item"
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
                                        No items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Show</span>
                        <div className="relative">
                            <select
                                className="appearance-none rounded border border-gray-300 px-2 py-1 pr-6 text-sm focus:border-[#37692F] focus:ring-[#37692F]"
                                value={perPage}
                                onChange={e => {
                                    setPerPage(Number(e.target.value));
                                    fetchItems({ per_page: e.target.value, page: 1 });
                                }}
                            >
                                {[10, 25, 50, 100].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <span className="text-sm text-gray-700">entries</span>
                    </div>

                    {items && items.links && items.links.length > 1 && (
                        <div className="flex w-full justify-center md:w-auto">
                            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                {items.links.map((link, idx) => {
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
            {showArchiveModal && (
                <ArchiveModal
                    show={showArchiveModal}
                    onClose={handleArchiveCancel}
                    item={selectedItem}
                />
            )}

            {showActivateModal && (
                <ActivateModal
                    show={showActivateModal}
                    onClose={handleActivateCancel}
                    item={selectedItem}
                />
            )}
        </AuthenticatedLayout>
    );
}