import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import '../../../css/fonts.css';
import { UserMinusIcon, ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import DeactivateModal from '@/Pages/Users/DeactivateModal';
import ReactivateModal from '@/Pages/Users/ReactivateModal';

export default function Index({ auth, partners, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [partnerList, setPartnerList] = useState(partners.data || []);
    const [filter, setFilter] = useState(filters.status || 'all');
    const [partnerTypeFilter, setPartnerTypeFilter] = useState(filters.partner_type || 'all');
    const [sort, setSort] = useState('default');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [showReactivateModal, setShowReactivateModal] = useState(false);
    const [reactivateModalPartner, setReactivateModalPartner] = useState(null);

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

    const debouncedSearch = debounce((value) => {
        setSearch(value);
        router.get(route('partners.index'), {
            search: value,
            status: filter !== 'all' ? filter : '',
            partner_type: partnerTypeFilter !== 'all' ? partnerTypeFilter : '',
        }, { preserveState: true, replace: true });
    }, 300);

    const handleSearchChange = (e) => debouncedSearch(e.target.value);

    const processedPartners = useMemo(() => {
        let result = [...partnerList];
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
        if (filter !== 'all') result = result.filter(partner => partner.status === filter);
        if (partnerTypeFilter !== 'all') result = result.filter(partner => partner.partner_type === partnerTypeFilter);
        if (sort !== 'default') {
            switch (sort) {
                case 'name_asc': result.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
                case 'name_desc': result.sort((a, b) => (b.name || '').localeCompare(a.name || '')); break;
                case 'type_asc': result.sort((a, b) => (a.partner_type || '').localeCompare(b.partner_type || '')); break;
                case 'type_desc': result.sort((a, b) => (b.partner_type || '').localeCompare(a.partner_type || '')); break;
            }
        }
        return result;
    }, [partnerList, search, filter, partnerTypeFilter, sort]);

    const getFilterLabel = () => filter === 'active' ? 'Active Only' : filter === 'inactive' ? 'Inactive Only' : 'All Partners';
    const getTypeLabel = () => partnerTypeFilter === 'individual' ? 'Individual' : partnerTypeFilter === 'organization' ? 'Organization' : 'All Types';
    const getSortLabel = () => {
        switch (sort) {
            case 'name_asc': return 'Name (A to Z)';
            case 'name_desc': return 'Name (Z to A)';
            case 'type_asc': return 'Type (A to Z)';
            case 'type_desc': return 'Type (Z to A)';
            default: return 'Default';
        }
    };
    const getStatusColor = (status) => status === 'active' ? "bg-green-100 text-green-700" : status === 'inactive' ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700";
    const getTypeColor = (type) => type === 'organization' ? "bg-purple-600 text-white" : type === 'individual' ? "bg-blue-600 text-white" : "bg-gray-600 text-white";

    const handleDeactivateConfirm = (id) => {
        router.post(route('partners.deactivate', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setPartnerList(prev =>
                    prev.map(p => p.id === id ? { ...p, status: 'inactive' } : p)
                );
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
                setPartnerList(prev =>
                    prev.map(p => p.id === id ? { ...p, status: 'active' } : p)
                );
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
                                                    router.get(route('partners.index'), {
                                                        search,
                                                        status: status !== 'all' ? status : '',
                                                        partner_type: partnerTypeFilter !== 'all' ? partnerTypeFilter : '',
                                                    }, { preserveState: true, replace: true });
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
                                                    router.get(route('partners.index'), {
                                                        search,
                                                        status: filter !== 'all' ? filter : '',
                                                        partner_type: type !== 'all' ? type : '',
                                                    }, { preserveState: true, replace: true });
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
                                        {[
                                            { value: 'default', label: 'Default' },
                                            { value: 'name_asc', label: 'Name (A to Z)' },
                                            { value: 'name_desc', label: 'Name (Z to A)' },
                                            { value: 'type_asc', label: 'Type (A to Z)' },
                                            { value: 'type_desc', label: 'Type (Z to A)' }
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    setSort(opt.value);
                                                    setShowSortDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sort === opt.value ? 'bg-[#37692F] text-white' : 'text-gray-700'}`}
                                            >
                                                {opt.label}
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