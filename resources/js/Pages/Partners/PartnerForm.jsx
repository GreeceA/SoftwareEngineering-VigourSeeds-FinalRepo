import React, { useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function PartnerForm({ partner = null }) {
    const regInputRef = useRef(null);
    const [showErrors, setShowErrors] = useState(false);
    const [localErrors, setLocalErrors] = useState({});
    const [contactWarning, setContactWarning] = useState('');

   const { data, setData, post, put, processing, errors } = useForm({
        partner_type: partner?.partner_type || 'individual',
        name: partner?.name || '',
        contact_persons:
            partner?.partner_type === 'organization'
                ? (partner?.contact_persons?.length
                    ? partner.contact_persons
                    : [{ name: '', email: '', phone_number: '' }])
                : [],
        email: partner?.email || '',
        phone: partner?.phone || '',
        address: partner?.address || '',
        registration_number: partner?.registration_number
            ? partner.registration_number.replace(/^BN-/, '').replace(/REG$/, '')
            : '',
        tax_id: partner?.tax_id || '',
        notes: partner?.notes || '',
        status: partner?.status || 'active',
    });

    // Phone: Only 11 digits, must start with 08 or 09, format XXXX-XXX-XXXX
    const formatPhone = (input) => {
        let value = input.replace(/\D/g, '');
        if (value.length > 0) {
            if (value[0] !== '0') value = '0' + value;
            if (value.length > 1 && value[1] !== '8' && value[1] !== '9') value = value[0];
        }
        value = value.slice(0, 11);

        let formatted = '';
        if (value.length > 0) formatted += value.slice(0, 4);
        if (value.length > 4) formatted += '-' + value.slice(4, 7);
        if (value.length > 7) formatted += '-' + value.slice(7, 11);
        return formatted;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setData('phone', formatted);

        if (showErrors) {
            validateFields({ ...data, phone: formatted, tax_id: data.tax_id, registration_number: data.registration_number, contact_persons: data.contact_persons });
        }
    };

    // DTI Registration: auto-prefix BN- and suffix REG, only allow digits in between
    const handleRegFocus = () => {
        if (regInputRef.current) {
            regInputRef.current.setSelectionRange(0, regInputRef.current.value.length);
        }
    };

    const handleRegChange = (e) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11); // up to 11 digits
        setData('registration_number', value);

        if (showErrors) {
            validateFields({ ...data, registration_number: value, phone: data.phone, tax_id: data.tax_id, contact_persons: data.contact_persons });
        }
    };

    // TIN: Only 12 digits, format 123-456-789-000
    const formatTin = (input) => {
        let value = input.replace(/\D/g, '').slice(0, 12);
        let formatted = '';
        if (value.length > 0) formatted += value.slice(0, 3);
        if (value.length > 3) formatted += '-' + value.slice(3, 6);
        if (value.length > 6) formatted += '-' + value.slice(6, 9);
        if (value.length > 9) formatted += '-' + value.slice(9, 12);
        return formatted;
    };

    const handleTinChange = (e) => {
        const formatted = formatTin(e.target.value);
        setData('tax_id', formatted);

        if (showErrors) {
            validateFields({ ...data, tax_id: formatted, phone: data.phone, registration_number: data.registration_number, contact_persons: data.contact_persons });
        }
    };

    // Contact Person Validation
    const validateContactPersons = (persons) => {
        return persons.map((person) => {
            let errors = {};
            if (!person.name?.trim()) errors.name = 'Name is required.';
            if (!person.email?.trim()) errors.email = 'Email is required.';
            const phoneRaw = person.phone_number.replace(/-/g, '');
            if (!phoneRaw) {
                errors.phone_number = 'Phone number is required.';
            } else if (phoneRaw.length !== 11) {
                errors.phone_number = 'Phone number must be exactly 11 digits.';
            } else if (!/^0[89]\d{9}$/.test(phoneRaw)) {
                errors.phone_number = 'Phone number must start with 08 or 09.';
            }
            return errors;
        });
    };

    // Validation function
    const validateFields = (fields) => {
        const phoneRaw = fields.phone.replace(/-/g, '');
        const tinRaw = fields.tax_id.replace(/-/g, '');
        const regRaw = fields.registration_number.replace(/\D/g, '');

        let newErrors = {};

        if (phoneRaw.length !== 11) {
            newErrors.phone = 'Phone number must be exactly 11 digits.';
        }
        // Always require TIN and registration number for both types
        if (tinRaw.length !== 12) {
            newErrors.tax_id = 'TIN must be exactly 12 digits.';
        }
        if (regRaw.length !== 11) {
            newErrors.registration_number = 'DTI Registration must be exactly 11 digits.';
        }

        // Contact Persons validation only for organizations
        if (fields.partner_type === 'organization') {
            const contactErrors = validateContactPersons(fields.contact_persons);
            newErrors.contact_persons = contactErrors;
        }

        setLocalErrors(newErrors);
        const hasContactErrors = newErrors.contact_persons?.some(e => Object.keys(e).length > 0);
        return Object.keys(newErrors).filter(k => k !== 'contact_persons').length === 0 && !hasContactErrors;
    };

    const submit = (e) => {
        e.preventDefault();
        setShowErrors(true);

        const isValid = validateFields(data);

        if (!isValid) {
            return;
        }

        const regRaw = data.registration_number.replace(/\D/g, '');
        const regNum = regRaw ? `BN-${regRaw}REG` : '';

        // Prepare payload
        const payload = {
            ...data,
            registration_number: regNum,
        };

        // Only send contact_persons for organizations
        if (data.partner_type !== 'organization') {
            delete payload.contact_persons;
        }

        if (partner) {
            put(route('partners.update', partner.id), {
                ...payload,
                onSuccess: () => router.visit(route('partners.index'))
            });
        } else {
            post(route('partners.store'), {
                ...payload,
                onSuccess: () => router.visit(route('partners.index'))
            });
        }
    };

    // Contact person handlers
    const addContactPerson = () => {
        if (data.contact_persons.length < 3) {
            setContactWarning('');
            setData('contact_persons', [
                ...data.contact_persons,
                { name: '', email: '', phone_number: '' }
            ]);
        } else {
            setContactWarning('⚠️ You can only add up to 3 contact persons.');
        }
    };

    const updateContactPerson = (index, field, value) => {
        const updated = [...data.contact_persons];
        if (field === 'phone_number') {
            updated[index][field] = formatPhone(value);
        } else {
            updated[index][field] = value;
        }
        setData('contact_persons', updated);

        if (showErrors) {
            validateFields({ ...data, contact_persons: updated });
        }
    };

    const removeContactPerson = (index) => {
        if (data.contact_persons.length > 1) {
            const updated = [...data.contact_persons];
            updated.splice(index, 1);
            setData('contact_persons', updated);
            setContactWarning('');
        }
    };

    return (
        <div className="p-6">
            {/* Breadcrumb */}
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href="http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/dashboard"
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / <Link href={route('partners.index')} className="text-[#37692F] hover:underline">Partners</Link> / <span>{partner ? 'Edit' : 'Create'} Partner</span>
                </nav>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    {partner ? 'Edit Partner' : 'Create New Partner'}
                </h1>

                <form onSubmit={submit} className="space-y-6">
                    {/* Partner Type */}
                    <div>
                        <label htmlFor="partner_type" className="block text-sm font-medium text-gray-700">
                            Partner Type *
                        </label>
                        <select
                            id="partner_type"
                            value={data.partner_type}
                            disabled={!!partner} // Disable if editing
                            onChange={(e) => {
                                setData('partner_type', e.target.value);
                                if (e.target.value === 'organization') {
                                    setData('contact_persons', [{ name: '', email: '', phone_number: '' }]);
                                } else {
                                    setData('contact_persons', []);
                                }
                            }}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                            required
                        >
                            <option value="individual">Individual</option>
                            <option value="organization">Organization</option>
                        </select>
                        {errors.partner_type && <p className="mt-1 text-sm text-red-600">{errors.partner_type}</p>}
                    </div>

                    {/* Organization or Individual Fields */}
                    {data.partner_type === 'organization' ? (
                        <>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Organization Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Company Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Company Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={data.phone}
                                        onChange={handlePhoneChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                        required
                                        maxLength={13}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter 11-digit mobile number (e.g., 0912-345-6789)
                                    </p>
                                    {showErrors && localErrors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{localErrors.phone}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Company Address *
                                </label>
                                <textarea
                                    id="address"
                                    rows={3}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                    required
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={data.phone}
                                        onChange={handlePhoneChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                        required
                                        maxLength={13}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter 11-digit mobile number (e.g., 0912-345-6789)
                                    </p>
                                    {showErrors && localErrors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{localErrors.phone}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Address *
                                </label>
                                <textarea
                                    id="address"
                                    rows={3}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                    required
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>
                        </>
                    )}

                    {/* Contact Persons for Organization */}
                    {data.partner_type === 'organization' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Persons</label>
                            {data.contact_persons.map((person, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 mt-2 items-start">
                                    <div className="col-span-4">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={person.name}
                                            onChange={e => updateContactPerson(idx, 'name', e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                        />
                                        {showErrors && localErrors.contact_persons && localErrors.contact_persons[idx]?.name && (
                                            <p className="mt-1 text-sm text-red-600">{localErrors.contact_persons[idx].name}</p>
                                        )}
                                    </div>
                                    <div className="col-span-4">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={person.email}
                                            onChange={e => updateContactPerson(idx, 'email', e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                        />
                                        {showErrors && localErrors.contact_persons && localErrors.contact_persons[idx]?.email && (
                                            <p className="mt-1 text-sm text-red-600">{localErrors.contact_persons[idx].email}</p>
                                        )}
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            placeholder="Phone"
                                            value={person.phone_number}
                                            onChange={e => updateContactPerson(idx, 'phone_number', e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                            maxLength={13}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Enter 11-digit mobile number (e.g., 0912-345-6789)
                                        </p>
                                        {showErrors && localErrors.contact_persons && localErrors.contact_persons[idx]?.phone_number && (
                                            <p className="mt-1 text-sm text-red-600">{localErrors.contact_persons[idx].phone_number}</p>
                                        )}
                                    </div>
                                    {/* Only show X button for contact persons after the first one */}
                                    <div className="col-span-1 flex items-center justify-center h-10 mt-2">
                                        {idx > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeContactPerson(idx)}
                                                className="text-red-600 hover:text-red-800 h-10 w-10 flex items-center justify-center rounded-md hover:bg-red-50 transition-colors"
                                                title="Remove contact person"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {/* Show add button only if less than 3 contact persons */}
                            {data.contact_persons.length < 3 && (
                                <button
                                    type="button"
                                    onClick={addContactPerson}
                                    className="mt-4 text-sm text-[#37692F] hover:text-[#2a5624] font-medium flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Another Contact Person
                                </button>
                            )}
                            {contactWarning && (
                                <p className="mt-2 text-sm text-yellow-600">{contactWarning}</p>
                            )}
                        </div>
                    )}

                    {/* Registration Number & Tax ID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700">
                                DTI Registration Number *
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                    BN-
                                </span>
                                <input
                                    type="text"
                                    id="registration_number"
                                    ref={regInputRef}
                                    value={data.registration_number}
                                    onFocus={handleRegFocus}
                                    onChange={handleRegChange}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                    maxLength={11}
                                    required
                                />
                                <span className="inline-flex items-center px-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                    REG
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Format: BN-YYYY#####REG
                            </p>
                            {showErrors && localErrors.registration_number && (
                                <p className="mt-1 text-sm text-red-600">{localErrors.registration_number}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700">
                                Tax ID (TIN) *
                            </label>
                            <input
                                type="text"
                                id="tax_id"
                                value={data.tax_id}
                                onChange={handleTinChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                                maxLength={15}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter 12-digit TIN (e.g., 123-456-789-000)
                            </p>
                            {showErrors && localErrors.tax_id && (
                                <p className="mt-1 text-sm text-red-600">{localErrors.tax_id}</p>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            rows={4}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37692F] focus:border-[#37692F]"
                            placeholder="Additional notes about this partner..."
                        />
                        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Link
                            href={route('partners.index')}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#37692F] hover:bg-[#2a5624] text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : (partner ? 'Update Partner' : 'Create Partner')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}