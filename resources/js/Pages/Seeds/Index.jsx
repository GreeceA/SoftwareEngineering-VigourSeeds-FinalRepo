import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import '../../../css/fonts.css';
import { ArchiveBoxIcon, ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import ArchiveModal from '@/Pages/Seeds/ArchiveSeedsModal';
import RestoreModal from '@/Pages/Seeds/ReactivateSeedsModal';

export default function Index({ auth, seeds, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [filter, setFilter] = useState(filters.status || 'all');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'id');
    const [sortDir, setSortDir] = useState(filters.sort_dir || 'desc');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [selectedSeed, setSelectedSeed] = useState(null);
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
    const fetchSeeds = (params = {}) => {
        router.get(route('seeds.index'), {
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
        fetchSeeds({ search: value, page: 1 });
    }, 300);

    const handleSearchChange = (e) => debouncedSearch(e.target.value);

    const getFilterLabel = () => {
        switch(filter) {
            case 'active': return 'Active Only';
            case 'archived': return 'Archived Only';
            default: return 'All Seeds';
        }
    };

    const getSortLabel = () => {
        if (sortBy === 'seed_variety') return sortDir === 'asc' ? 'Variety (A to Z)' : 'Variety (Z to A)';
        if (sortBy === 'price_per_unit') return sortDir === 'asc' ? 'Price (Low to High)' : 'Price (High to Low)';
        if (sortBy === 'growth_cycle') return sortDir === 'asc' ? 'Growth Cycle (Shortest)' : 'Growth Cycle (Longest)';
        return 'Default';
    };

    const getStatusColor = (status) => 
        status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

    const handleArchiveConfirm = (id) => {
        router.patch(route('seeds.archive', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowArchiveModal(false);
                setSelectedSeed(null);
            }
        });
    };

    const handleRestoreConfirm = (id) => {
        router.patch(route('seeds.restore', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRestoreModal(false);
                setSelectedSeed(null);
            }
        });
    };

    const handleArchiveCancel = () => {
        setShowArchiveModal(false);
        setSelectedSeed(null);
    };

    const handleRestoreCancel = () => {
        setShowRestoreModal(false);
        setSelectedSeed(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Seed Management</span>
                </h2>
            }
        >
            <Head title="Seed Management" />

            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href={route('dashboard')}
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / <span>Seed Management</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Seed Management System</h1>
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
                                        {['all', 'active', 'archived'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilter(status);
                                                    setShowFilterDropdown(false);
                                                    fetchSeeds({ status: status !== 'all' ? status : '', page: 1 });
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filter === status ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {status === 'all' ? 'All Seeds' : status.charAt(0).toUpperCase() + status.slice(1) + ' Only'}
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
                                                fetchSeeds({ sort_by: 'id', sort_dir: 'desc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'id' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Default (Newest)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('seed_variety');
                                                setSortDir('asc');
                                                setShowSortDropdown(false);
                                                fetchSeeds({ sort_by: 'seed_variety', sort_dir: 'asc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'seed_variety' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Variety (A to Z)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('seed_variety');
                                                setSortDir('desc');
                                                setShowSortDropdown(false);
                                                fetchSeeds({ sort_by: 'seed_variety', sort_dir: 'desc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'seed_variety' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Variety (Z to A)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('price_per_unit');
                                                setSortDir('asc');
                                                setShowSortDropdown(false);
                                                fetchSeeds({ sort_by: 'price_per_unit', sort_dir: 'asc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'price_per_unit' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Price (Low to High)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('price_per_unit');
                                                setSortDir('desc');
                                                setShowSortDropdown(false);
                                                fetchSeeds({ sort_by: 'price_per_unit', sort_dir: 'desc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'price_per_unit' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Price (High to Low)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('growth_cycle');
                                                setSortDir('asc');
                                                setShowSortDropdown(false);
                                                fetchSeeds({ sort_by: 'growth_cycle', sort_dir: 'asc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'growth_cycle' && sortDir === 'asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Growth Cycle (Shortest)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy('growth_cycle');
                                                setSortDir('desc');
                                                setShowSortDropdown(false);
                                                fetchSeeds({ sort_by: 'growth_cycle', sort_dir: 'desc', page: 1 });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'growth_cycle' && sortDir === 'desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Growth Cycle (Longest)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by variety or soil type..."
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

                        {/* Add Seed Button */}
                        <Link
                            href={route('seeds.create')}
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
                            Add Seed
                        </Link>
                    </div>
                </div>

                {/* Seeds Table */}
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#37692F] text-gray-600 uppercase text-xs">
                            <tr>
                                {['SEED VARIETY', 'PRICE', 'GROWTH INFO', 'STATUS', 'ACTIONS'].map((header) => (
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
                            {seeds.data.length > 0 ? (
                                seeds.data.map((seed) => (
                                    <tr key={seed.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <Link
                                                    href={route('seeds.show', seed.id)}
                                                    className="font-poppins font-medium text-[13px] text-gray-900 hover:text-[#37692F] hover:no-underline cursor-pointer transition-colors"
                                                    title={`View details for ${seed.seed_variety}`}
                                                >
                                                    {seed.seed_variety}
                                                </Link>
                                                <div className="font-poppins font-normal text-[12px] text-gray-500">
                                                    Soil: {seed.soil_type_preference}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-poppins font-medium text-[13px] text-gray-900">
                                                ₱{seed.price_per_unit}
                                            </div>
                                            <div className="font-poppins font-normal text-[12px] text-gray-500">
                                                per unit
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-poppins font-normal text-[13px] text-gray-900">
                                                {seed.growth_cycle} days
                                            </div>
                                            <div className="font-poppins font-normal text-[12px] text-gray-500">
                                                Storage: {seed.storage_requirements}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-poppins font-normal ${getStatusColor(seed.status)}`}
                                            >
                                                {seed.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route('seeds.edit', seed.id)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                    title="Edit Seed"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                {seed.status === 'active' ? (
                                                    <button
                                                        className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200"
                                                        onClick={() => {
                                                            setSelectedSeed(seed);
                                                            setShowArchiveModal(true);
                                                        }}
                                                        title="Archive Seed"
                                                    >
                                                        <ArchiveBoxIcon className="w-5 h-5" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="text-green-600 hover:text-green-800 transition-colors duration-200"
                                                        onClick={() => {
                                                            setSelectedSeed(seed);
                                                            setShowRestoreModal(true);
                                                        }}
                                                        title="Reactivate Seed"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No seeds found.
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
                                    fetchSeeds({ per_page: e.target.value, page: 1 });
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
                    {seeds && seeds.links && seeds.links.length > 1 && (
                        <div className="flex justify-center w-full md:w-auto">
                            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                {seeds.links.map((link, idx) => {
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

            {/* Modals */}
            {showArchiveModal && (
                <ArchiveModal
                    seed={selectedSeed}
                    onCancel={handleArchiveCancel}
                    onConfirm={handleArchiveConfirm}
                />
            )}

            {showRestoreModal && (
                <RestoreModal
                    seed={selectedSeed}
                    onCancel={handleRestoreCancel}
                    onConfirm={handleRestoreConfirm}
                />
            )}
        </AuthenticatedLayout>
    );
}