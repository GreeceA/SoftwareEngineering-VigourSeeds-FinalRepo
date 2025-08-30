import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import '../../../css/fonts.css';
import { ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, partners, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [partnerList, setPartnerList] = useState(partners.data || []);
    
    // Filter and Sort states
    const [filter, setFilter] = useState(filters.status || 'all'); // 'all', 'active', 'inactive'
    const [partnerTypeFilter, setPartnerTypeFilter] = useState(filters.partner_type || 'all'); // 'all', 'individual', 'organization'
    const [sort, setSort] = useState('default'); // 'default', 'name_asc', 'name_desc', 'type_asc', 'type_desc'
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    
    // Refs for dropdown management
    const filterRef = useRef(null);
    const sortRef = useRef(null);
    const typeRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
            if (typeRef.current && !typeRef.current.contains(event.target)) {
                setShowTypeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounce input to avoid updating on every keystroke
    const debouncedSearch = debounce((value) => {
        setSearch(value);
        router.get(route('partners.index'), {
            search: value,
            status: filter !== 'all' ? filter : '',
            partner_type: partnerTypeFilter !== 'all' ? partnerTypeFilter : '',
        }, {
            preserveState: true,
            replace: true,
        });
    }, 300);

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    // Filter, sort, and search partners
    const processedPartners = useMemo(() => {
        let result = [...partnerList];

        // 1. Apply search filter
        if (search) {
            result = result.filter((partner) => {
                const name = partner.name?.toLowerCase() || '';
                const email = partner.email?.toLowerCase() || '';
                const phone = partner.phone?.toLowerCase() || '';

                return (
                    name.includes(search.toLowerCase()) ||
                    email.includes(search.toLowerCase()) ||
                    phone.includes(search.toLowerCase())
                );
            });
        }

        // 2. Apply status filter
        if (filter !== 'all') {
            result = result.filter(partner => partner.status === filter);
        }

        // 3. Apply type filter
        if (partnerTypeFilter !== 'all') {
            result = result.filter(partner => partner.partner_type === partnerTypeFilter);
        }

        // 4. Apply sorting
        if (sort !== 'default') {
            switch (sort) {
                case 'name_asc':
                    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                    break;
                case 'name_desc':
                    result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                    break;
                case 'type_asc':
                    result.sort((a, b) => (a.partner_type || '').localeCompare(b.partner_type || ''));
                    break;
                case 'type_desc':
                    result.sort((a, b) => (b.partner_type || '').localeCompare(a.partner_type || ''));
                    break;
            }
        }

        return result;
    }, [partnerList, search, filter, partnerTypeFilter, sort]);

    const getFilterLabel = () => {
        switch (filter) {
            case 'active': return 'Active Only';
            case 'inactive': return 'Inactive Only';
            default: return 'All Statuses';
        }
    };

    const getTypeLabel = () => {
        switch (partnerTypeFilter) {
            case 'individual': return 'Individual';
            case 'organization': return 'Organization';
            default: return 'All Types';
        }
    };

    const getSortLabel = () => {
        switch (sort) {
            case 'name_asc': return 'Name (A to Z)';
            case 'name_desc': return 'Name (Z to A)';
            case 'type_asc': return 'Type (A to Z)';
            case 'type_desc': return 'Type (Z to A)';
            default: return 'Default';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return "bg-green-100 text-green-700";
            case 'inactive':
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'organization':
                return "bg-purple-600 text-white";
            case 'individual':
                return "bg-blue-600 text-white";
            default:
                return "bg-gray-600 text-white";
        }
    };

    const deletePartner = (partner) => {
        if (confirm(`Are you sure you want to delete ${partner.name}?`)) {
            router.delete(route('partners.destroy', partner.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setPartnerList(prev => prev.filter(p => p.id !== partner.id));
                }
            });
        }
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
                        href="http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/dashboard"
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / <span>Partners</span>
                </nav>
            </div>

            <div className="p-6">
                {/* Header Section with Search, Filter, Sort and Add Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Partners
                    </h1>

                    <div className="flex space-x-3">
                        {/* Status Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => {
                                    setShowFilterDropdown(!showFilterDropdown);
                                    setShowSortDropdown(false);
                                    setShowTypeDropdown(false);
                                }}
                                className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-transparent bg-white"
                            >
                                <FunnelIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {getFilterLabel()}
                                <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setFilter('all');
                                                setShowFilterDropdown(false);
                                                router.get(route('partners.index'), {
                                                    search,
                                                    status: '',
                                                    partner_type: partnerTypeFilter !== 'all' ? partnerTypeFilter : '',
                                                }, {
                                                    preserveState: true,
                                                    replace: true,
                                                });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filter === 'all' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            All Statuses
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilter('active');
                                                setShowFilterDropdown(false);
                                                router.get(route('partners.index'), {
                                                    search,
                                                    status: 'active',
                                                    partner_type: partnerTypeFilter !== 'all' ? partnerTypeFilter : '',
                                                }, {
                                                    preserveState: true,
                                                    replace: true,
                                                });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filter === 'active' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Active Only
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilter('inactive');
                                                setShowFilterDropdown(false);
                                                router.get(route('partners.index'), {
                                                    search,
                                                    status: 'inactive',
                                                    partner_type: partnerTypeFilter !== 'all' ? partnerTypeFilter : '',
                                                }, {
                                                    preserveState: true,
                                                    replace: true,
                                                });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filter === 'inactive' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Inactive Only
                                        </button>
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
                                className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-transparent bg-white"
                            >
                                <FunnelIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {getTypeLabel()}
                                <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                            </button>
                            {showTypeDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setPartnerTypeFilter('all');
                                                setShowTypeDropdown(false);
                                                router.get(route('partners.index'), {
                                                    search,
                                                    status: filter !== 'all' ? filter : '',
                                                    partner_type: '',
                                                }, {
                                                    preserveState: true,
                                                    replace: true,
                                                });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${partnerTypeFilter === 'all' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            All Types
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPartnerTypeFilter('individual');
                                                setShowTypeDropdown(false);
                                                router.get(route('partners.index'), {
                                                    search,
                                                    status: filter !== 'all' ? filter : '',
                                                    partner_type: 'individual',
                                                }, {
                                                    preserveState: true,
                                                    replace: true,
                                                });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${partnerTypeFilter === 'individual' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Individual
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPartnerTypeFilter('organization');
                                                setShowTypeDropdown(false);
                                                router.get(route('partners.index'), {
                                                    search,
                                                    status: filter !== 'all' ? filter : '',
                                                    partner_type: 'organization',
                                                }, {
                                                    preserveState: true,
                                                    replace: true,
                                                });
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${partnerTypeFilter === 'organization' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Organization
                                        </button>
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
                                className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-transparent bg-white"
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
                                                setSort('default');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'default' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Default
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSort('name_asc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'name_asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Name (A to Z)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSort('name_desc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'name_desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Name (Z to A)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSort('type_asc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'type_asc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Type (A to Z)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSort('type_desc');
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === 'type_desc' ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                        >
                                            Type (Z to A)
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
                                className="w-[400px] pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-transparent"
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
                            className="bg-[#37692F] text-white px-4 py-2 rounded-md hover:bg-[#2a5624] transition-colors flex items-center"
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
                            {processedPartners.length > 0 ? (
                                processedPartners.map((partner) => (
                                    <tr key={partner.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-poppins font-normal text-[13px] text-gray-900">
                                            {partner.name}
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
                                                {/* Edit Button */}
                                                <Link
                                                    href={route('partners.edit', partner.id)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    title="Edit Partner"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>

                                                {/* Delete Button */}
                                                <button
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                    onClick={() => deletePartner(partner)}
                                                    title="Delete Partner"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
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
            </div>
        </AuthenticatedLayout>
    );
}