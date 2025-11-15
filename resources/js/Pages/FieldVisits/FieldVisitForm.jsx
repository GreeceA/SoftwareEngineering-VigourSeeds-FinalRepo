import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function FieldVisitForm({ auth, contracts, users, fieldVisit = null }) {
    const isEdit = !!fieldVisit;
    const pageTitle = isEdit ? `Edit Field Visit #${fieldVisit.field_visit_ID}` : 'Create Field Visit';

    // Check if the visit is closed (completed or cancelled)
    const isClosed = isEdit && (fieldVisit.status === 'completed' || fieldVisit.status === 'cancelled');

    const [selectedFarmName, setSelectedFarmName] = useState('');
    const [selectedFarmAddress, setSelectedFarmAddress] = useState('');
    
    const initialUserName = isEdit 
        ? (users.find(u => u.id === fieldVisit.user_ID)?.first_name + ' ' + users.find(u => u.id === fieldVisit.user_ID)?.last_name) || '' 
        : '';
    const [userSearch, setUserSearch] = useState(initialUserName.trim());
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        contract_ID: fieldVisit?.contract_ID ?? '',
        farm_ID: fieldVisit?.farm_ID ?? '',
        user_ID: fieldVisit?.user_ID ?? '',
        date_visit: fieldVisit?.date_visit
            ? fieldVisit.date_visit.slice(0, 10) 
            : '',
        status: fieldVisit?.status ?? 'ongoing',
        remarks: fieldVisit?.remarks ?? '',
    });

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0];

    // Check if date is valid (not in the past)
    const isDateValid = !data.date_visit || data.date_visit >= today;

    // Check if form is valid for submission
    const isFormValid = data.contract_ID && data.user_ID && data.date_visit && isDateValid && !isClosed;

    const updateFarmDetails = (contractId) => {
        const c = (contracts || []).find(x => String(x.id) === String(contractId));
        const farm = c?.farm || {};
        
        const name = farm.location_name || farm.farm_id || farm.farmID || '';
        setSelectedFarmName(name);
        const address = farm.location || farm.address || '';
        setSelectedFarmAddress(address);
    }
    
    useEffect(() => {
        if (isEdit) {
            updateFarmDetails(fieldVisit.contract_ID);
            const selectedContract = contracts.find(c => String(c.id) === String(fieldVisit.contract_ID));
            setData('farm_ID', selectedContract?.farm?.id || '');
        }
    }, [isEdit]);

    const filteredUsers = users.filter(user =>
        (`${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearch.toLowerCase()))
    );

    const handleContractChange = (e) => {
        const contractId = e.target.value;
        setData('contract_ID', contractId);

        const selectedContract = contracts.find(c => String(c.id) === String(contractId));
        setData('farm_ID', selectedContract?.farm?.id || '');

        updateFarmDetails(contractId);
    };

    const handleUserSelect = (user) => {
        setData('user_ID', user.id);
        setUserSearch(`${user.first_name} ${user.last_name}`);
        setShowUserDropdown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Block submission if visit is closed
        if (isClosed) {
            return;
        }

        // Additional frontend validation
        if (!isFormValid) {
            return;
        }

        const routeName = isEdit ? 'field-visits.update' : 'field-visits.store';
        const params = isEdit ? fieldVisit.field_visit_ID : undefined;

        if (isEdit) {
            put(route(routeName, params));
        } else {
            post(route(routeName));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={pageTitle} />

            {/* Modern Page Header */}
            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white border-b border-gray-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative px-6 py-6">
                    <nav className="flex items-center space-x-2 text-sm mb-4">
                        <Link href={route('dashboard')} className="text-gray-500 hover:text-[#37692F] transition-colors duration-200 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href={route('field-visits.index')} className="text-gray-500 hover:text-[#37692F] transition-colors duration-200">
                            Field Visits
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#37692F] font-medium">
                            {isEdit ? `Edit #${fieldVisit.field_visit_ID}` : 'Create Field Visit'}
                        </span>
                    </nav>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                    {isEdit ? 'Edit Field Visit' : 'Create New Field Visit'}
                                </h1>
                                <p className="text-gray-600">
                                    {isEdit 
                                        ? `Update field visit #${fieldVisit.field_visit_ID}` 
                                        : 'Schedule a new field visit for a contract'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="mt-4 rounded-lg bg-white p-6 shadow-lg">
                    {/* Warning Banner for Closed Visits */}
                    {isClosed && (
                        <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                            <div className="flex items-center">
                                <svg className="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-red-800">
                                        {fieldVisit.status === 'completed' ? '🔒 Visit Completed' : '🚫 Visit Cancelled'}
                                    </h3>
                                    <p className="text-sm text-red-700 mt-1">
                                        {fieldVisit.status === 'completed' 
                                            ? 'This field visit is completed and locked as a historical record. All fields are read-only.'
                                            : 'This field visit has been cancelled and cannot be modified. All fields are read-only.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <h1 className="mb-6 text-2xl font-semibold text-gray-800">
                        {isClosed 
                            ? `View Field Visit #${fieldVisit.field_visit_ID}` 
                            : (isEdit ? 'Update Field Visit' : 'Create New Field Visit')}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Contract Information */}
                        <div>
                            <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
                                Contract Information
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Contract * {(isEdit || isClosed) && <span className="text-xs text-gray-500">(Locked)</span>}
                                    </label>
                                    <select
                                        value={data.contract_ID}
                                        onChange={handleContractChange}
                                        disabled={isEdit || isClosed}
                                        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                            errors.contract_ID ? 'border-red-500' : ''
                                        } ${(isEdit || isClosed) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">Select a contract</option>
                                        {contracts.map(contract => (
                                            <option key={contract.id} value={contract.id}>{contract.contract_name}</option>
                                        ))}
                                    </select>
                                    {errors.contract_ID && <p className="mt-1 text-sm text-red-600">{errors.contract_ID}</p>}
                                    {(isEdit || isClosed) && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            ℹ️ Contract cannot be changed after creation.
                                        </p>
                                    )}
                                </div>

                                {selectedFarmName && (
                                    <div className="rounded-md bg-gray-50 p-4 border border-gray-200">
                                        <p className="text-sm font-medium text-gray-500">
                                            Farm Details (Read-only)
                                        </p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">{selectedFarmName}</p>
                                        {selectedFarmAddress && (
                                            <p className="mt-1 text-sm text-gray-600">{selectedFarmAddress}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Visit Details */}
                        <div>
                            <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
                                Visit Details
                            </h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Assigned User */}
                                <div className="relative">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Assign To * {isClosed && <span className="text-xs text-gray-500">(Locked)</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={userSearch}
                                        onChange={(e) => {
                                            if (!isClosed) {
                                                setUserSearch(e.target.value);
                                                setShowUserDropdown(true);
                                                if (!e.target.value) setData('user_ID', '');
                                            }
                                        }}
                                        onFocus={() => !isClosed && setShowUserDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowUserDropdown(false), 150)}
                                        disabled={isClosed}
                                        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                            errors.user_ID ? 'border-red-500' : ''
                                        } ${isClosed ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        placeholder={isClosed ? '' : "Search by user's name..."}
                                    />
                                    {showUserDropdown && filteredUsers.length > 0 && !isClosed && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {filteredUsers.map(user => (
                                                <div
                                                    key={user.id}
                                                    onMouseDown={() => handleUserSelect(user)} 
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                >
                                                    <div className="font-medium text-gray-900">{`${user.first_name} ${user.last_name}`}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.user_ID && <p className="mt-1 text-sm text-red-600">{errors.user_ID}</p>}
                                </div>

                                {/* Visit Date */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Visit Date * {isClosed && <span className="text-xs text-gray-500">(Locked)</span>}
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date_visit}
                                        min={!isClosed ? today : undefined}
                                        onChange={(e) => !isClosed && setData('date_visit', e.target.value)}
                                        disabled={isClosed}
                                        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                            errors.date_visit || !isDateValid ? 'border-red-500' : ''
                                        } ${isClosed ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    />
                                    {errors.date_visit && <p className="mt-1 text-sm text-red-600">{errors.date_visit}</p>}
                                    {!isDateValid && !errors.date_visit && !isClosed && (
                                        <p className="mt-1 text-sm text-red-600">
                                            Visit date cannot be in the past. Please select today or a future date.
                                        </p>
                                    )}
                                    {!isClosed && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            ℹ️ You can only schedule visits for today or future dates.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div>
                            <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
                                Additional Information
                            </h2>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Remarks {isClosed && <span className="text-xs text-gray-500">(Read-only)</span>}
                                </label>
                                <textarea
                                    value={data.remarks}
                                    onChange={(e) => !isClosed && setData('remarks', e.target.value)}
                                    disabled={isClosed}
                                    rows="4"
                                    className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                        errors.remarks ? 'border-red-500' : ''
                                    } ${isClosed ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder={isClosed ? '' : "Additional notes or remarks about the field visit..."}
                                />
                                {errors.remarks && (
                                    <p className="mt-1 text-sm text-red-600">{errors.remarks}</p>
                                )}
                            </div>
                        </div>

                        {/* Button Actions */}
                        <div className="flex justify-end space-x-2 pt-4">
                            <Link
                                href={isClosed 
                                    ? route('field-visits.show', fieldVisit.field_visit_ID)
                                    : isEdit 
                                        ? route('field-visits.show', fieldVisit.field_visit_ID)
                                        : route('field-visits.index')
                                }
                                className="rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-400"
                            >
                                {isClosed ? 'Back to Details' : 'Cancel'}
                            </Link>
                            {!isClosed && (
                                <button
                                    type="submit"
                                    disabled={processing || !isFormValid}
                                    className="rounded-md bg-[#37692F] px-4 py-2 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#2a5624]"
                                >
                                    {processing ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Field Visit')}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}