import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FunnelIcon, ChevronDownIcon, ArrowsUpDownIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import CompleteVisitModal from './handleComplete';
import CancelVisitModal from './handleCancel';

export default function Index({ auth, fieldVisits, filters, contracts }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [contractId, setContractId] = useState(filters.contract_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [processing, setProcessing] = useState({});
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);

    // Modal handlers
    const handleComplete = (id) => {
        setSelectedVisit(fieldVisits.data.find(visit => visit.field_visit_ID === id));
        setShowCompleteModal(true);
    };

    const handleCancel = (id) => {
        setSelectedVisit(fieldVisits.data.find(visit => visit.field_visit_ID === id));
        setShowCancelModal(true);
    };

    const handleCompleteConfirm = (id) => {
        setProcessing(prev => ({ ...prev, [`complete-${id}`]: true }));
        router.post(route('field-visits.complete', id), {}, {
            onFinish: () => {
                setProcessing(prev => ({ ...prev, [`complete-${id}`]: false }));
                setShowCompleteModal(false);
                setSelectedVisit(null);
            }
        });
    };

    const handleCancelConfirm = (id) => {
        setProcessing(prev => ({ ...prev, [`cancel-${id}`]: true }));
        router.post(route('field-visits.cancel', id), {}, {
            onFinish: () => {
                setProcessing(prev => ({ ...prev, [`cancel-${id}`]: false }));
                setShowCancelModal(false);
                setSelectedVisit(null);
            }
        });
    };

    const handleCompleteCancel = () => {
        setShowCompleteModal(false);
        setSelectedVisit(null);
    };

    const handleCancelCancel = () => {
        setShowCancelModal(false);
        setSelectedVisit(null);
    };

    // Filter dropdown logic
    const filterRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch logic
    const fetchFieldVisits = (params = {}) => {
        router.get(route('field-visits.index'), {
            search,
            status,
            contract_id: contractId,
            date_from: dateFrom,
            date_to: dateTo,
            per_page: perPage,
            ...params,
        }, { preserveState: true, replace: true });
    };

    const debouncedSearch = debounce((value) => {
        setSearch(value);
        fetchFieldVisits({ search: value, page: 1 });
    }, 300);

    const handleSearchChange = (e) => debouncedSearch(e.target.value);

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setContractId('');
        setDateFrom('');
        setDateTo('');
        router.get(route('field-visits.index'));
    };

    const getStatusBadge = (status) => {
        const colors = {
            ongoing: 'bg-blue-100 text-blue-700',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return (
            <span className={`rounded-full px-3 py-1 text-xs font-poppins font-normal ${colors[status] || ''}`}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : ''}
            </span>
        );
    };

    const getFilterLabel = () => {
        if (status) {
            return `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        }
        if (contractId) {
            const contract = contracts?.find(c => String(c.id) === String(contractId));
            return contract ? `Contract: ${contract.contract_name}` : 'Filtered';
        }
        if (dateFrom || dateTo) {
            return 'Date Filtered';
        }
        return 'All Field Visits';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Field Visit Management</span>
                </h2>
            }
        >
            <Head title="Field Visit Management" />
            
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / <span>Field Visit Management</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section and Controls */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Field Visit Management System</h1>
                    <div className="flex space-x-3">
                        {/* Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 focus:ring-[#37692F] focus:outline-none focus:ring-2"
                            >
                                <FunnelIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {getFilterLabel()}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute right-0 z-10 mt-2 w-80 rounded-md border border-gray-200 bg-white p-4 shadow-lg">
                                    <div className="space-y-4">
                                        {/* Status Filter */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Status
                                            </label>
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                            >
                                                <option value="">All Statuses</option>
                                                <option value="ongoing">Ongoing</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        {/* Contract Filter */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Contract
                                            </label>
                                            <select
                                                value={contractId}
                                                onChange={(e) => setContractId(e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                            >
                                                <option value="">All Contracts</option>
                                                {(contracts || []).map(contract => (
                                                    <option key={contract.id} value={contract.id}>
                                                        {contract.contract_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Date Range */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    From Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={dateFrom}
                                                    onChange={(e) => setDateFrom(e.target.value)}
                                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    To Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={dateTo}
                                                    onChange={(e) => setDateTo(e.target.value)}
                                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                                />
                                            </div>
                                        </div>

                                        {/* Filter Actions */}
                                        <div className="flex space-x-2 pt-2">
                                            <button
                                                onClick={() => {
                                                    fetchFieldVisits({ page: 1 });
                                                    setShowFilterDropdown(false);
                                                }}
                                                className="flex-1 rounded-md bg-[#37692F] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a5624]"
                                            >
                                                Apply Filters
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleReset();
                                                    setShowFilterDropdown(false);
                                                }}
                                                className="flex-1 rounded-md bg-gray-300 px-3 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-400"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search field visits..."
                                defaultValue={search}
                                onChange={handleSearchChange}
                                className="w-[300px] rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:ring-[#37692F] focus:outline-none focus:ring-2"
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

                        {/* Create Field Visit Button */}
                        <Link
                            href={route('field-visits.create')}
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
                            Create Visit
                        </Link>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                        {flash.error}
                    </div>
                )}

                {/* Field Visits Table */}
                <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#37692F] text-xs uppercase text-gray-600">
                            <tr>
                                {['ID', 'CONTRACT', 'DATE', 'STATUS', 'ASSIGNED TO', 'REPORTS', 'ACTIONS'].map((header) => (
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
                            {fieldVisits?.data?.length > 0 ? (
                                fieldVisits.data.map((visit) => (
                                    <tr key={visit.field_visit_ID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-poppins text-[13px] font-medium text-gray-900">
                                                #{visit.field_visit_ID}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={route('field-visits.show', visit.field_visit_ID)}
                                                className="font-poppins text-[13px] font-medium text-gray-900 transition-colors duration-200 hover:text-[#37692F] hover:no-underline"
                                                title={`View details for Visit #${visit.field_visit_ID}`}
                                            >
                                                {visit.contract?.contract_name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-poppins text-[13px] font-normal text-gray-900">
                                                {visit.date_visit
                                                    ? (function(d){
                                                          const dt = new Date(d);
                                                          return isNaN(dt) ? d : dt.toISOString().slice(0,10);
                                                      })(visit.date_visit)
                                                      : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(visit.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-poppins text-[13px] font-normal text-gray-900">
                                                {((visit.assignee?.first_name || visit.assignee?.last_name)
                                                    ? `${visit.assignee?.first_name || ''} ${visit.assignee?.last_name || ''}`.trim()
                                                    : 'N/A')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3 font-poppins text-[13px] font-normal">
                                                <span className="text-green-600">G: {visit.growth_reports_count ?? 0}</span>
                                                <span className="text-red-600">D: {visit.damage_reports_count ?? 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-3">
                                                <Link
                                                    href={route('field-visits.show', visit.field_visit_ID)}
                                                    className="text-blue-600 transition-colors duration-200 hover:text-blue-800"
                                                    title="View Details"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                     </svg>
                                                </Link>
                                                {visit.status === 'ongoing' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleComplete(visit.field_visit_ID)}
                                                            disabled={processing[`complete-${visit.field_visit_ID}`]}
                                                            className="text-green-600 transition-colors duration-200 hover:text-green-800 disabled:opacity-50"
                                                            title="Complete Visit"
                                                        >
                                                            {processing[`complete-${visit.field_visit_ID}`] ? (
                                                                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                            ) : (
                                                                <CheckCircleIcon className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(visit.field_visit_ID)}
                                                            disabled={processing[`cancel-${visit.field_visit_ID}`]}
                                                            className="text-red-600 transition-colors duration-200 hover:text-red-800 disabled:opacity-50"
                                                            title="Cancel Visit"
                                                        >
                                                            {processing[`cancel-${visit.field_visit_ID}`] ? (
                                                                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                            ) : (
                                                                <XCircleIcon className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        No field visits found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination and Per Page Selector */}
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
                                    fetchFieldVisits({ per_page: e.target.value, page: 1 });
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
                    {fieldVisits && fieldVisits.links && fieldVisits.links.length > 1 && (
                        <div className="flex w-full justify-center md:w-auto">
                            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                {fieldVisits.links.map((link, idx) => {
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
            {showCompleteModal && (
                <CompleteVisitModal
                    fieldVisit={selectedVisit}
                    onCancel={handleCompleteCancel}
                    onConfirm={() => handleCompleteConfirm(selectedVisit.field_visit_ID)}
                />
            )}

            {showCancelModal && (
                <CancelVisitModal
                    fieldVisit={selectedVisit}
                    onCancel={handleCancelCancel}
                    onConfirm={() => handleCancelConfirm(selectedVisit.field_visit_ID)}
                />
            )}
        </AuthenticatedLayout>
    );
}