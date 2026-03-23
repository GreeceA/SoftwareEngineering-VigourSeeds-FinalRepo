import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Plus, ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link } from '@inertiajs/react';
import { ArrowDownTrayIcon, FunnelIcon, ChevronDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

const InventoryDashboard = () => {
    const { auth, inventory, shortfalls } = usePage().props;
    const permissions = auth?.user?.can || [];

    const [filter, setFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dropdown states
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);

    // Refs for dropdown click outside detection
    const typeFilterRef = useRef(null);
    const statusFilterRef = useRef(null);
    const sortRef = useRef(null);
    const exportRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (typeFilterRef.current && !typeFilterRef.current.contains(event.target)) {
                setShowTypeDropdown(false);
            }
            if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
                setShowStatusDropdown(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
            if (exportRef.current && !exportRef.current.contains(event.target)) {
                setShowExportDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Deduplicate inventory by type-id (memoized)
    const dedupedInventory = useMemo(() => {
        return Array.from(
            new Map(inventory.map(item => [`${item.type}-${item.id}`, item])).values()
        );
    }, [inventory]);

    // Only allow 'all', 'Seed', 'fertilizer', 'pesticide' filters
    const filterOptions = ['all', 'Seed', 'fertilizer', 'pesticide'];
    const statusOptions = ['all', 'good', 'low', 'critical'];

    // Filtering and sorting logic (memoized)
    const { filteredInventory, paginatedInventory, totalPages, startIndex, endIndex } = useMemo(() => {
        // Filtering logic
        let filtered = dedupedInventory.filter(item => item.type.toLowerCase() !== 'corn');
        
        if (filter !== 'all') {
            filtered = filtered.filter(item => item.type.toLowerCase() === filter.toLowerCase());
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }
        if (search.trim() !== '') {
            const searchLower = search.trim().toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchLower)
            );
        }

        // Sorting logic
        filtered = filtered.sort((a, b) =>
            sortOrder === 'asc'
                ? (a.current_stock ?? 0) - (b.current_stock ?? 0)
                : (b.current_stock ?? 0) - (a.current_stock ?? 0)
        );

        // Pagination calculations
        const total = Math.ceil(filtered.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginated = filtered.slice(start, end);

        return {
            filteredInventory: filtered,
            paginatedInventory: paginated,
            totalPages: total,
            startIndex: start,
            endIndex: end
        };
    }, [dedupedInventory, filter, statusFilter, search, sortOrder, currentPage, itemsPerPage]);

    // Reset to page 1 when filter changes
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'good': return 'bg-green-100 text-green-700';
            case 'low': return 'bg-yellow-100 text-yellow-700';
            case 'critical': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeIcon = (type) => {
        if (type === 'Seed') return '🌱';
        if (type === 'fertilizer') return '🧪';
        if (type === 'pesticide') return '🛡️';
        return '📦';
    };

    // Label Helpers
    const getFilterLabel = () => {
        switch (filter) {
            case 'Seed': return 'Seeds Only';
            case 'fertilizer': return 'Fertilizers Only';
            case 'pesticide': return 'Pesticides Only';
            default: return 'All Types';
        }
    };

    const getStatusLabel = () => {
        switch (statusFilter) {
            case 'good': return 'Good Stock Only';
            case 'low': return 'Low Stock Only';
            case 'critical': return 'Critical Stock Only';
            default: return 'All Status';
        }
    };

    const getSortLabel = () => {
        return sortOrder === 'asc' ? 'Stock (Low to High)' : 'Stock (High to Low)';
    };

    const handleExport = (format) => {
        window.location.href = route('inventory.export.dashboard', { format });
        setShowExportDropdown(false);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Modern Page Header */}
            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white border-b border-gray-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative px-6 py-6">
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
                        <span className="text-[#37692F] font-medium">Inventory Dashboard</span>
                    </nav>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <Package className="text-white" size={32} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Inventory Dashboard</h1>
                                <p className="text-gray-600">Monitor and manage your stock levels</p>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
                            <Package className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-700">
                                {dedupedInventory.filter(i => i.type.toLowerCase() !== 'corn').length} Products
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Stock Shortfall Widget */}
                {shortfalls && shortfalls.length > 0 && (
                    <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-red-100 p-2 rounded-full">
                                    <AlertTriangle className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-red-800">Stock Shortfall Alert</h2>
                                    <p className="text-red-600 text-sm">Immediate action required for these items</p>
                                </div>
                                <div className="ml-auto bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {shortfalls.length} Item{shortfalls.length > 1 ? 's' : ''}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {shortfalls.map((item) => (
                                    <div key={`${item.type}-${item.id}`} className="bg-white rounded-lg border border-red-200 p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                                {item.type}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600">Shortfall:</span>
                                                <span className="font-bold text-red-700">{item.shortfall.toLocaleString()} {item.unit}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600">On Hand:</span>
                                                <span className="font-medium text-gray-700">{item.on_hand.toLocaleString()} {item.unit}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600">Committed:</span>
                                                <span className="font-medium text-gray-700">{item.committed.toLocaleString()} {item.unit}</span>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-red-600 font-medium">Action Required</span>
                                                <Link
                                                    href={route('inventory.inbound.create')}
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    Restock →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Products</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {dedupedInventory.filter(i => i.type.toLowerCase() !== 'corn').length}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Package className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Good Stock</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {dedupedInventory.filter(i => i.status === 'good' && i.type.toLowerCase() !== 'corn').length}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <TrendingUp className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Low Stock</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {dedupedInventory.filter(i => i.status === 'low' && i.type.toLowerCase() !== 'corn').length}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <TrendingDown className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Critical Stock</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {dedupedInventory.filter(i => i.status === 'critical' && i.type.toLowerCase() !== 'corn').length}
                                </p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions Section - Now below stats cards */}
                <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">         </h3>
                        
                        {/* Action Buttons - Right side */}
                        <div className="flex items-center space-x-3">
                            {permissions.includes('create inventory') && (
                                <>
                                    <Link
                                        href={route('inventory.inbound.create')}
                                        className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm transition-colors"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Stock In
                                    </Link>
                                    <Link
                                        href={route('inventory.outbound.create')}
                                        className="flex items-center rounded-md bg-[#37692F] px-4 py-2 text-white hover:bg-[#2a5624] text-sm transition-colors"
                                    >
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                        Stock Out
                                    </Link>
                                    <Link
                                        href={route('inventory.adjustment.create')}
                                        className="flex items-center rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 text-sm transition-colors"
                                    >
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        Adjust Stock
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Export Dropdown */}
                        <div className="relative" ref={exportRef}>
                            <button
                                onClick={() => { 
                                    setShowExportDropdown(!showExportDropdown); 
                                    setShowTypeDropdown(false); 
                                    setShowStatusDropdown(false);
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

                        {/* Type Filter Dropdown */}
                        <div className="relative" ref={typeFilterRef}>
                            <button
                                onClick={() => {
                                    setShowTypeDropdown(!showTypeDropdown);
                                    setShowStatusDropdown(false);
                                    setShowSortDropdown(false);
                                }}
                                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 focus:ring-[#37692F] focus:outline-none focus:ring-2"
                            >
                                <FunnelIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {getFilterLabel()}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                            </button>
                            {showTypeDropdown && (
                                <div className="absolute left-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                                    <div className="py-1">
                                        {filterOptions.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    handleFilterChange(type);
                                                    setShowTypeDropdown(false);
                                                }}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 capitalize ${filter === type ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {type === 'all' ? 'All Types' : type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status Filter Dropdown */}
                        <div className="relative" ref={statusFilterRef}>
                            <button
                                onClick={() => {
                                    setShowStatusDropdown(!showStatusDropdown);
                                    setShowTypeDropdown(false);
                                    setShowSortDropdown(false);
                                }}
                                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 focus:ring-[#37692F] focus:outline-none focus:ring-2"
                            >
                                <FunnelIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {getStatusLabel()}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                            </button>
                            {showStatusDropdown && (
                                <div className="absolute left-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                                    <div className="py-1">
                                        {statusOptions.map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setStatusFilter(status);
                                                    setCurrentPage(1);
                                                    setShowStatusDropdown(false);
                                                }}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 capitalize ${statusFilter === status ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {status === 'all' ? 'All Status' : status}
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
                                    setShowTypeDropdown(false);
                                    setShowStatusDropdown(false);
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
                                            onClick={() => {
                                                setSortOrder('desc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortOrder === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Stock (High to Low)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortOrder('asc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortOrder === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Stock (Low to High)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                            
                        {/* Search Input */}
                        <div className="flex-1">
                            <div className="relative max-w-2xl">
                                <input
                                    type="text"
                                    placeholder="Search by product name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:ring-[#37692F] focus:outline-none focus:ring-2"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#37692F] text-xs uppercase text-gray-600">
                            <tr>
                                {['PRODUCT', 'TYPE', 'CURRENT STOCK', 'STATUS', 'ACTIONS'].map((header) => (
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
                            {paginatedInventory.length > 0 ? (
                                paginatedInventory.map((item) => (
                                    <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">{getTypeIcon(item.type)}</span>
                                                <div>
                                                    <div className="font-poppins text-[13px] font-medium text-gray-900">
                                                        {item.name}
                                                    </div>
                                                    <div className="font-poppins text-[12px] font-normal text-gray-500">
                                                        ID: {item.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-full px-3 py-1 text-xs font-poppins font-medium shadow-sm bg-blue-100 text-blue-700 border border-blue-200">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-poppins text-[13px] font-semibold text-gray-900">
                                                {item.current_stock === null || item.current_stock === undefined
                                                    ? '-'
                                                    : `${item.current_stock.toLocaleString()} ${item.unit}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.status ? (
                                                <span className={`rounded-full px-3 py-1 text-xs font-poppins font-normal ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            ) : (
                                                <span className="rounded-full px-3 py-1 text-xs font-poppins font-normal bg-gray-100 text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={route('inventory.show', [
                                                    item.type === 'Seed' ? 'seed' : 'item',
                                                    item.id
                                                ])}
                                                className="font-poppins text-[13px] font-normal text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="font-poppins text-[14px] font-normal text-gray-500">
                                            No inventory items found for this filter.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {filteredInventory.length > 0 && (
                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="font-poppins text-[13px] font-normal text-gray-600">
                                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(endIndex, filteredInventory.length)}</span> of{' '}
                                    <span className="font-medium">{filteredInventory.length}</span> items
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded transition font-poppins text-[13px] flex items-center gap-1 ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                            }`}
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>

                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                            // Show first page, last page, current page, and pages around current
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-3 py-1 rounded transition font-poppins text-[13px] ${currentPage === page
                                                                ? 'bg-[#37692F] text-white font-medium'
                                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return (
                                                    <span key={page} className="px-2 py-1 text-gray-500 font-poppins text-[13px]">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded transition font-poppins text-[13px] flex items-center gap-1 ${currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                            }`}
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <Link
                        href={route('inventory.ledger')}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer block"
                    >
                        <h3 className="font-semibold text-gray-900 mb-2">View Ledger</h3>
                        <p className="text-gray-600 text-sm">See all inventory transactions</p>
                    </Link>
                    <Link
                        href={route('partner-orders.index')}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer block"
                    >
                        <h3 className="font-semibold text-gray-900 mb-2">Partner Orders</h3>
                        <p className="text-gray-600 text-sm">Manage outbound deliveries</p>
                    </Link>
                    <Link
                        href={route('buybacks.index')}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer block"
                    >
                        <h3 className="font-semibold text-gray-900 mb-2">Buyback Tracking</h3>
                        <p className="text-gray-600 text-sm">Monitor corn buyback progress</p>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default InventoryDashboard;