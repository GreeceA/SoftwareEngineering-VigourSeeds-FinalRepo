import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function FieldVisitForm({ auth, contracts, users, fieldVisit = null }) {
    // Determine if the form is for editing an existing record
    const isEdit = !!fieldVisit;
    const pageTitle = isEdit ? `Edit Field Visit #${fieldVisit.field_visit_ID}` : 'Create Field Visit';

    // State for Farm Details Display (derived from selected Contract)
    const [selectedFarmName, setSelectedFarmName] = useState('');
    const [selectedFarmAddress, setSelectedFarmAddress] = useState('');

    // State for User Search/Selection
    const initialUserName = isEdit 
        ? (users.find(u => u.id === fieldVisit.user_ID)?.first_name + ' ' + users.find(u => u.id === fieldVisit.user_ID)?.last_name) || '' 
        : '';
    const [userSearch, setUserSearch] = useState(initialUserName.trim());
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        contract_ID: fieldVisit?.contract_ID ?? '',
        farm_ID: fieldVisit?.farm_ID ?? '', // <-- add this line
        user_ID: fieldVisit?.user_ID ?? '',
        date_visit: fieldVisit?.date_visit ? fieldVisit.date_visit.split('T')[0] : '',
        status: fieldVisit?.status ?? 'ongoing',
        remarks: fieldVisit?.remarks ?? '',
    });

    // --- Helper Functions ---

    // Function to update Farm Details based on contract selection
    const updateFarmDetails = (contractId) => {
        const c = (contracts || []).find(x => String(x.id) === String(contractId));
        const farm = c?.farm || {};
        
        // Assuming your contract relationship loads a 'farm' object with 'location_name'/'location'
        const name = farm.location_name || farm.farm_id || farm.farmID || '';
        setSelectedFarmName(name);
        const address = farm.location || farm.address || '';
        setSelectedFarmAddress(address);
    }
    
    // Initial load for Edit forms
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

        // Find the selected contract and set farm_ID
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
        const routeName = isEdit ? 'field-visits.update' : 'field-visits.store';
        const params = isEdit ? fieldVisit.field_visit_ID : undefined;

        if (isEdit) {
            put(route(routeName, params));
        } else {
            post(route(routeName));
        }
    };

    // --- Render ---

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | {pageTitle}</span>
                </h2>
            }
        >
            <Head title={pageTitle} />

            <div className="p-6">
                <div className="px-6 pt-6">
                    <nav className="text-sm text-gray-600">
                        <Link href={route('dashboard')} className="text-[#37692F] hover:underline">Home</Link> / 
                        <Link href={route('field-visits.index')} className="text-[#37692F] hover:underline"> Field Visits</Link> / 
                        <span> {isEdit ? `Edit #${fieldVisit.field_visit_ID}` : 'Create'}</span>
                    </nav>
                </div>

                <div className="mt-4 rounded-lg bg-white p-6 shadow-lg">
                    <h1 className="mb-6 text-2xl font-semibold text-gray-800">
                        {isEdit ? 'Update Field Visit' : 'Create New Field Visit'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Contract Information */}
                        <div>
                            <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
                                Contract Information
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                {/* Contract Selection */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Contract *</label>
                                    <select
                                        value={data.contract_ID}
                                        onChange={handleContractChange}
                                        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                            errors.contract_ID ? 'border-red-500' : ''
                                        }`}
                                    >
                                        <option value="">Select a contract</option>
                                        {contracts.map(contract => (
                                            <option key={contract.id} value={contract.id}>{contract.contract_name}</option>
                                        ))}
                                    </select>
                                    {errors.contract_ID && <p className="mt-1 text-sm text-red-600">{errors.contract_ID}</p>}
                                </div>

                                {/* Farm Details Display */}
                                {selectedFarmName && (
                                    <div className="rounded-md bg-gray-50 p-4 border border-gray-200">
                                        <p className="text-sm font-medium text-gray-500">Farm Details (Read-only)</p>
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
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Assign To</label>
                                    <input
                                        type="text"
                                        value={userSearch}
                                        onChange={(e) => {
                                            setUserSearch(e.target.value);
                                            setShowUserDropdown(true);
                                            if (!e.target.value) setData('user_ID', '');
                                        }}
                                        onFocus={() => setShowUserDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowUserDropdown(false), 150)}
                                        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                            errors.user_ID ? 'border-red-500' : ''
                                        }`}
                                        placeholder="Search by user's name..."
                                    />
                                    {showUserDropdown && filteredUsers.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {filteredUsers.map(user => (
                                                <div
                                                    key={user.id}
                                                    // Use onMouseDown to prevent onBlur from firing before the click registers
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
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Visit Date *</label>
                                    <input
                                        type="date"
                                        value={data.date_visit}
                                        onChange={(e) => setData('date_visit', e.target.value)}
                                        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                            errors.date_visit ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.date_visit && <p className="mt-1 text-sm text-red-600">{errors.date_visit}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div>
                            <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
                                Additional Information
                            </h2>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Remarks</label>
                                <textarea
                                    value={data.remarks}
                                    onChange={(e) => setData('remarks', e.target.value)}
                                    rows="4"
                                    className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${
                                        errors.remarks ? 'border-red-500' : ''
                                    }`}
                                    placeholder="Additional notes or remarks about the field visit..."
                                />
                                {errors.remarks && (
                                    <p className="mt-1 text-sm text-red-600">{errors.remarks}</p>
                                )}
                            </div>
                        </div>

                        {/* Button Actions */}
                        <div className="flex justify-end space-x-2 pt-4">
                            <Link
                                href={route('field-visits.index')}
                                className="rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-400"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-[#37692F] px-4 py-2 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#2a5624]"
                            >
                                {processing ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Field Visit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}