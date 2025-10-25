import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import ArchiveModal from './ArchiveItemsModal';
import ActivateModal from './ActivateItemsModal';
import { ArchiveBoxIcon, ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

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
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Items Management</span>
                </h2>
            }
        >
            <Head title="Items Management" />

            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / <span>Items Management</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Items Management System</h1>
                    <div className="flex space-x-3">
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
                                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
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
                                <div className="absolute right-0 z-10 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg">
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