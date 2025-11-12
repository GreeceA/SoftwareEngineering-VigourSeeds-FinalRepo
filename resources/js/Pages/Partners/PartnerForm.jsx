import React, { useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function PartnerForm({ partner = null }) {
    const { props } = usePage();
    const regInputRef = useRef(null);
    const [showErrors, setShowErrors] = useState(false);
    const [localErrors, setLocalErrors] = useState({});
    const [contactWarning, setContactWarning] = useState('');
    const [farmWarning, setFarmWarning] = useState('');

    // Uniqueness check states
    const [nameUniqueError, setNameUniqueError] = useState('');
    const [emailUniqueError, setEmailUniqueError] = useState('');
    const [regUniqueError, setRegUniqueError] = useState('');
    const [tinUniqueError, setTinUniqueError] = useState('');
    const [checkingName, setCheckingName] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [checkingReg, setCheckingReg] = useState(false);
    const [checkingTin, setCheckingTin] = useState(false);

    const { data, setData, post, put, processing } = useForm({
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
        farms: partner?.farms?.length
            ? partner.farms
            : [{ location_name: '', address: '', area_size: '', soil_type: '' }],
    });

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        phone: false,
        address: false,
        registration_number: false,
        tax_id: false,
    });

    const [contactTouched, setContactTouched] = useState(
        data.contact_persons.map(() => ({
            name: false,
            email: false,
            phone_number: false,
        }))
    );

    const [farmTouched, setFarmTouched] = useState(
        data.farms.map(() => ({
            location_name: false,
            address: false,
            area_size: false,
            soil_type: false,
        }))
    );

    // State Updaters
    const setContactFieldTouched = (contactIdx, field) => {
        setContactTouched(prev => {
            const updated = [...prev];
            updated[contactIdx] = { ...updated[contactIdx], [field]: true };
            return updated;
        });
    };

    const setFarmFieldTouched = (farmIdx, field) => {
        setFarmTouched(prev => {
            const updated = [...prev];
            updated[farmIdx] = { ...updated[farmIdx], [field]: true };
            return updated;
        });
    };

    //  Partner Info Validation & Handlers

    async function handleNameBlur(e) {
        const name = e.target.value.trim();
        if (!name) return;
        setCheckingName(true);
        try {
            await axios.post(route('partners.checkName'), {
                name,
                partnerId: partner?.id || null,
            });
            setNameUniqueError('');
        } catch (err) {
            if (err.response?.status === 422) {
                setNameUniqueError(
                    err.response.data.errors?.name?.[0] ||
                    'A partner with this name already exists. Please provide a different name.'
                );
            }
        }
        setCheckingName(false);
    }

    const handleEmailBlur = async (e) => {
        const email = e.target.value.trim();
        if (!email) return;
        setCheckingEmail(true);
        try {
            await axios.post(route('partners.checkEmail'), {
                email,
                partnerId: partner?.id || null,
            });
            setEmailUniqueError('');
        } catch (err) {
            if (err.response?.status === 422) {
                setEmailUniqueError(
                    err.response.data.errors?.email?.[0] ||
                    'This email address is already registered.'
                );
            }
        }
        setCheckingEmail(false);
    };

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
        if (touched.phone) {
            validateFields({ ...data, phone: formatted }, touched, contactTouched, farmTouched, showErrors);
        }
    };

    //  Contact Person Validation & Handlers

    const validateContactPersons = (persons, contactTouched, showErrors) => {
        const names = persons.map(p => p.name?.trim()).filter(Boolean);
        const emails = persons.map(p => p.email?.trim()).filter(Boolean);
        const phones = persons.map(p => p.phone_number?.trim()).filter(Boolean);

        return persons.map((person, idx) => {
            let errors = {};
            
            if ((contactTouched[idx]?.name || showErrors) && !person.name?.trim()) {
                errors.name = 'Name is required.';
            } else if (person.name?.trim() && names.filter(n => n === person.name.trim()).length > 1) {
                errors.name = 'Contact person names must be unique within the company.';
            }
            
            if ((contactTouched[idx]?.email || showErrors) && !person.email?.trim()) {
                errors.email = 'Email is required.';
            } else if ((contactTouched[idx]?.email || showErrors) && person.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) {
                errors.email = 'Email must be valid.';
            } else if (person.email?.trim() && emails.filter(e => e === person.email.trim()).length > 1) {
                errors.email = 'Contact person emails must be unique within the company.';
            }
            
            const phoneRaw = person.phone_number.replace(/-/g, '');
            if ((contactTouched[idx]?.phone_number || showErrors) && !phoneRaw) {
                errors.phone_number = 'Phone number is required.';
            } else if ((contactTouched[idx]?.phone_number || showErrors) && phoneRaw && phoneRaw.length !== 11) {
                errors.phone_number = 'Phone number must be exactly 11 digits.';
            } else if ((contactTouched[idx]?.phone_number || showErrors) && phoneRaw && !/^0[89]\d{9}$/.test(phoneRaw)) {
                errors.phone_number = 'Phone number must start with 08 or 09.';
            } else if (person.phone_number?.trim() && phones.filter(p => p === person.phone_number.trim()).length > 1) {
                errors.phone_number = 'Contact person phone numbers must be unique within the company.';
            }
            
            return errors;
        });
    };

    const addContactPerson = () => {
        if (data.contact_persons.length < 3) {
            setContactWarning('');
            setData('contact_persons', [
                ...data.contact_persons,
                { name: '', email: '', phone_number: '' }
            ]);
            setContactTouched([...contactTouched, { name: false, email: false, phone_number: false }]);
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

        if (contactTouched[index]?.[field]) {
            validateFields({ ...data, contact_persons: updated }, touched, contactTouched, farmTouched, showErrors);
        }
    };

    const removeContactPerson = (index) => {
        if (data.contact_persons.length > 1) {
            const updated = [...data.contact_persons];
            updated.splice(index, 1);
            setData('contact_persons', updated);
            
            const updatedTouched = [...contactTouched];
            updatedTouched.splice(index, 1);
            setContactTouched(updatedTouched);
            
            setContactWarning('');
            validateFields({ ...data, contact_persons: updated }, touched, updatedTouched, farmTouched, showErrors);
        }
    };

    //  Farm Info Validation & Handlers 

    const validateFarms = (farms, farmTouched, showErrors) => {
        const names = farms.map(f => f.location_name?.trim()).filter(Boolean);
        return farms.map((farm, idx) => {
            let errors = {};

            if ((farmTouched[idx]?.location_name || showErrors) && !farm.location_name?.trim()) {
                errors.location_name = 'Farm name is required.';
            } else if (farm.location_name?.trim() && names.filter(n => n === farm.location_name.trim()).length > 1) {
                errors.location_name = 'Farm names must be unique within the same partner.';
            }

            if ((farmTouched[idx]?.address || showErrors) && !farm.address?.trim()) {
                errors.address = 'Address is required.';
            }

            // Area size validation logic
            const areaSizeValue = parseFloat(farm.area_size);

            if ((farmTouched[idx]?.area_size || showErrors) && (!farm.area_size || isNaN(areaSizeValue))) {
                errors.area_size = 'Area size is required.';
            } else if (areaSizeValue <= 0) {
                errors.area_size = 'Area size must be greater than 0.';
            } else if (
                areaSizeValue > 999.99 ||
                String(farm.area_size).split('.')[0].length > 3 ||
                (String(farm.area_size).includes('.') && String(farm.area_size).split('.')[1]?.length > 2)
            ) {
                errors.area_size = 'Area size must not exceed 1000 hectares.';
            }

            if ((farmTouched[idx]?.soil_type || showErrors) && (!farm.soil_type || !['clay', 'sandy', 'loam', 'silty'].includes(farm.soil_type))) {
                errors.soil_type = 'Soil type is required.';
            }

            return errors;
        });
    };

    const addFarm = () => {
        if (data.farms.length < 10) {
            setFarmWarning('');
            setData('farms', [
                ...data.farms,
                { location_name: '', address: '', area_size: '', soil_type: '' }
            ]);
            setFarmTouched([...farmTouched, { location_name: false, address: false, area_size: false, soil_type: false }]);
        } else {
            setFarmWarning('⚠️ You can only add up to 10 farms.');
        }
    };

    const updateFarm = (index, field, value) => {
        const updated = [...data.farms];
        updated[index][field] = value;
        setData('farms', updated);

        if (farmTouched[index]?.[field]) {
            const farmErrors = validateFarms(updated, farmTouched, showErrors);
            setLocalErrors(errors => ({
                ...errors,
                farms: farmErrors,
            }));
        }
    };

    const removeFarm = (index) => {
        if (data.farms.length > 1) {
            const updated = [...data.farms];
            updated.splice(index, 1);
            setData('farms', updated);
            
            const updatedTouched = [...farmTouched];
            updatedTouched.splice(index, 1);
            setFarmTouched(updatedTouched);
            
            setFarmWarning('');
            validateFields({ ...data, farms: updated }, touched, contactTouched, updatedTouched, showErrors);
        }
    };

    // DTI & TIN Validation & Handlers
    const handleRegFocus = () => {
        if (regInputRef.current) {
            regInputRef.current.setSelectionRange(0, regInputRef.current.value.length);
        }
    };

    const handleRegChange = (e) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11);
        setData('registration_number', value);
        if (touched.registration_number) {
            validateFields({ ...data, registration_number: value }, touched, contactTouched, farmTouched, showErrors);
        }
        setRegUniqueError('');
    };

    const handleRegBlur = async (e) => {
        const registration_number = e.target.value.replace(/\D/g, '');
        if (!registration_number) return;
        setCheckingReg(true);
        try {
            await axios.post(route('partners.checkRegistration'), {
                registration_number,
                partnerId: partner?.id || null,
            });
            setRegUniqueError('');
        } catch (err) {
            if (err.response?.status === 422) {
                setRegUniqueError(
                    err.response.data.errors?.registration_number?.[0] ||
                    'DTI Registration Number is already registered.'
                );
            }
        }
        setCheckingReg(false);
    };

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
        if (touched.tax_id) {
            validateFields({ ...data, tax_id: formatted }, touched, contactTouched, farmTouched, showErrors);
        }
        setTinUniqueError('');
    };

    const handleTinBlur = async (e) => {
        const tax_id = e.target.value; 
        if (!tax_id) return;
        setCheckingTin(true);
        try {
            await axios.post(route('partners.checkTaxId'), {
                tax_id,
                partnerId: partner?.id || null,
            });
            setTinUniqueError('');
        } catch (err) {
            if (err.response?.status === 422) {
                setTinUniqueError(
                    err.response.data.errors?.tax_id?.[0] ||
                    'Tax ID (TIN) is already registered.'
                );
            }
        }
        setCheckingTin(false);
    };

    // Main Validation Logic
    
    const validateFields = (fields, touched, contactTouched, farmTouched, showErrors) => {
        let newErrors = {};

        // Partner Name
        if ((touched.name || showErrors) && !fields.name?.trim()) {
            newErrors.name = 'Partner name is required.';
        }

        // Email
        if ((touched.email || showErrors) && !fields.email?.trim()) {
            newErrors.email = 'Email is required.';
        } else if ((touched.email || showErrors) && fields.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Phone
        const phoneRaw = fields.phone.replace(/-/g, '');
        if ((touched.phone || showErrors) && !phoneRaw) {
            newErrors.phone = 'Phone number is required.';
        } else if ((touched.phone || showErrors) && phoneRaw && phoneRaw.length !== 11) {
            newErrors.phone = 'Phone number must be exactly 11 digits.';
        } else if ((touched.phone || showErrors) && phoneRaw && !/^0[89]\d{9}$/.test(phoneRaw)) {
            newErrors.phone = 'Phone number must start with 08 or 09.';
        }

        // Address
        if ((touched.address || showErrors) && !fields.address?.trim()) {
            newErrors.address = 'Address is required.';
        }

        // DTI Registration
        const regRaw = fields.registration_number.replace(/\D/g, '');
        if ((touched.registration_number || showErrors) && !regRaw) {
            newErrors.registration_number = 'DTI number is required.';
        } else if ((touched.registration_number || showErrors) && regRaw && regRaw.length !== 11) {
            newErrors.registration_number = 'DTI Registration must be exactly 11 digits.';
        }

        // TIN
        const tinRaw = fields.tax_id.replace(/-/g, '');
        if ((touched.tax_id || showErrors) && !tinRaw) {
            newErrors.tax_id = 'TIN is required.';
        } else if ((touched.tax_id || showErrors) && tinRaw && tinRaw.length !== 12) {
            newErrors.tax_id = 'TIN must be exactly 12 digits.';
        }

        // Contact Persons (Conditional)
        if (fields.partner_type === 'organization') {
            newErrors.contact_persons = validateContactPersons(fields.contact_persons, contactTouched, showErrors);
        }

        // Farms
        newErrors.farms = validateFarms(fields.farms, farmTouched, showErrors);

        setLocalErrors(newErrors);

        const hasContactErrors = newErrors.contact_persons?.some(e => Object.keys(e).length > 0);
        const hasFarmErrors = newErrors.farms?.some(e => Object.keys(e).length > 0);
        return Object.keys(newErrors).filter(k => k !== 'contact_persons' && k !== 'farms').length === 0 && !hasContactErrors && !hasFarmErrors;
    };

    const submit = (e) => {
        e.preventDefault();
        setShowErrors(true);

        const allTouched = {
            name: true,
            email: true,
            phone: true,
            address: true,
            registration_number: true,
            tax_id: true,
        };
        setTouched(allTouched);

        const allContactTouched = data.contact_persons.map(() => ({
            name: true,
            email: true,
            phone_number: true,
        }));
        setContactTouched(allContactTouched);

        const allFarmTouched = data.farms.map(() => ({
            location_name: true,
            address: true,
            area_size: true,
            soil_type: true,
        }));
        setFarmTouched(allFarmTouched);

        const isValid = validateFields(
            data,
            allTouched,
            allContactTouched,
            allFarmTouched,
            true
        );

        if (!isValid || nameUniqueError || emailUniqueError || regUniqueError || tinUniqueError) {
            return;
        }

        const regRaw = data.registration_number.replace(/\D/g, '');
        const regNum = regRaw ? `BN-${regRaw}REG` : '';
        const tinRaw = data.tax_id.replace(/\D/g, '');

        const payload = {
            ...data,
            registration_number: regNum,
            tax_id: tinRaw,
        };

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

    const isAnyFormError = 
        localErrors.name ||
        localErrors.email ||
        localErrors.phone ||
        localErrors.address ||
        localErrors.registration_number ||
        localErrors.tax_id ||
        localErrors.contact_persons?.some(e => Object.keys(e).length > 0) ||
        localErrors.farms?.some(e => Object.keys(e).length > 0);

    return (
        <div className="p-6">
            <div className="px-6 pt-6">
                <nav className="text-sm text-gray-600">
                    <Link
                        href={route('dashboard')} 
                        className="text-[#37692F] hover:underline"
                    >
                        Home
                    </Link>{" "}
                    / <Link href={route('partners.index')} className="text-[#37692F] hover:underline">Partners</Link> / <span>{partner ? 'Edit' : 'Create'} Partner</span>
                </nav>
            </div>

            <div className="mt-4 rounded-lg bg-white p-6 shadow-lg">
                <h1 className="mb-6 text-2xl font-semibold text-gray-800">
                    {partner ? 'Edit Partner' : 'Create New Partner'}
                </h1>

                <form onSubmit={submit} className="space-y-6">
                    {/* Partner Type Selection */}
                    <div>
                        <label htmlFor="partner_type" className="block text-sm font-medium text-gray-700">
                            Partner Type *
                        </label>
                        <select
                            id="partner_type"
                            value={data.partner_type}
                            disabled={!!partner}
                            onChange={(e) => {
                                setData('partner_type', e.target.value);
                                if (e.target.value === 'organization') {
                                    setData('contact_persons', [{ name: '', email: '', phone_number: '' }]);
                                    setContactTouched([{ name: false, email: false, phone_number: false }]);
                                } else {
                                    setData('contact_persons', []);
                                    setContactTouched([]);
                                }
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                            required
                        >
                            <option value="individual">Individual</option>
                            <option value="organization">Organization</option>
                        </select>
                    </div>

                    {/* Partner Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            {data.partner_type === 'organization' ? 'Organization Name *' : 'Name *'}
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={e => {
                                setData('name', e.target.value);
                                setNameUniqueError('');
                                if (touched.name) {
                                    validateFields({ ...data, name: e.target.value }, touched, contactTouched, farmTouched, showErrors);
                                }
                            }}
                            onBlur={e => {
                                setTouched(t => ({ ...t, name: true }));
                                validateFields({ ...data, name: e.target.value }, { ...touched, name: true }, contactTouched, farmTouched, showErrors);
                                if (e.target.value) handleNameBlur(e);
                            }}
                            className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${(touched.name || showErrors) && (localErrors.name || nameUniqueError) ? 'border-red-500' : ''}`}
                            required
                        />
                        {(touched.name || showErrors) && (localErrors.name || nameUniqueError) && (
                            <p className="mt-1 text-sm text-red-600">
                                {localErrors.name || nameUniqueError}
                            </p>
                        )}
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {data.partner_type === 'organization' ? 'Company Email *' : 'Email *'}
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={e => {
                                    setData('email', e.target.value);
                                    setEmailUniqueError('');
                                    if (touched.email) {
                                        validateFields({ ...data, email: e.target.value }, touched, contactTouched, farmTouched, showErrors);
                                    }
                                }}
                                onBlur={e => {
                                    setTouched(t => ({ ...t, email: true }));
                                    validateFields({ ...data, email: e.target.value }, { ...touched, email: true }, contactTouched, farmTouched, showErrors);
                                    if (e.target.value) handleEmailBlur(e);
                                }}
                                className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${(touched.email || showErrors) && (localErrors.email || emailUniqueError) ? 'border-red-500' : ''}`}
                                required
                            />
                            {(touched.email || showErrors) && (localErrors.email || emailUniqueError) && (
                                <p className="mt-1 text-sm text-red-600">
                                    {localErrors.email || emailUniqueError}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                {data.partner_type === 'organization' ? 'Company Phone *' : 'Phone *'}
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={data.phone}
                                onChange={handlePhoneChange}
                                onBlur={e => {
                                    setTouched(t => ({ ...t, phone: true }));
                                    validateFields({ ...data, phone: e.target.value }, { ...touched, phone: true }, contactTouched, farmTouched, showErrors);
                                }}
                                className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${(touched.phone || showErrors) && localErrors.phone ? 'border-red-500' : ''}`}
                                required
                                maxLength={13}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Enter 11-digit mobile number (e.g., 0912-345-6789)
                            </p>
                            {(touched.phone || showErrors) && localErrors.phone && (
                                <p className="mt-1 text-sm text-red-600">{localErrors.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            {data.partner_type === 'organization' ? 'Company Address *' : 'Address *'}
                        </label>
                        <textarea
                            id="address"
                            rows={3}
                            value={data.address}
                            onChange={e => {
                                setData('address', e.target.value);
                                if (touched.address) {
                                    validateFields({ ...data, address: e.target.value }, touched, contactTouched, farmTouched, showErrors);
                                }
                            }}
                            onBlur={e => {
                                setTouched(t => ({ ...t, address: true }));
                                validateFields({ ...data, address: e.target.value }, { ...touched, address: true }, contactTouched, farmTouched, showErrors);
                            }}
                            className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${(touched.address || showErrors) && localErrors.address ? 'border-red-500' : ''}`}
                            required
                        />
                        {(touched.address || showErrors) && localErrors.address && (
                            <p className="mt-1 text-sm text-red-600">{localErrors.address}</p>
                        )}
                    </div>

                    {/* Contact Persons Section */}
                    {data.partner_type === 'organization' && (
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Contact Persons</label>
                            {data.contact_persons.map((person, idx) => (
                                <div key={idx} className="mt-2 grid grid-cols-12 items-start gap-2">
                                    <div className="col-span-4">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={person.name}
                                            onChange={e => updateContactPerson(idx, 'name', e.target.value)}
                                            onBlur={() => {
                                                setContactFieldTouched(idx, 'name');
                                                validateFields(data, touched, contactTouched, farmTouched, showErrors);
                                            }}
                                            required
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                        />
                                        {(contactTouched[idx]?.name || showErrors) && localErrors.contact_persons?.[idx]?.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {localErrors.contact_persons[idx].name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-span-4">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={person.email}
                                            onChange={e => updateContactPerson(idx, 'email', e.target.value)}
                                            onBlur={() => {
                                                setContactFieldTouched(idx, 'email');
                                                validateFields(data, touched, contactTouched, farmTouched, showErrors);
                                            }}
                                            required
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                        />
                                        {(contactTouched[idx]?.email || showErrors) && localErrors.contact_persons?.[idx]?.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {localErrors.contact_persons[idx].email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            placeholder="Phone"
                                            value={person.phone_number}
                                            onChange={e => updateContactPerson(idx, 'phone_number', e.target.value)}
                                            onBlur={() => {
                                                setContactFieldTouched(idx, 'phone_number');
                                                validateFields(data, touched, contactTouched, farmTouched, showErrors);
                                            }}
                                            required
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                            maxLength={13}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Enter 11-digit mobile number (e.g., 0912-345-6789)
                                        </p>
                                        {(contactTouched[idx]?.phone_number || showErrors) && localErrors.contact_persons?.[idx]?.phone_number && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {localErrors.contact_persons[idx].phone_number}
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-span-1 mt-2 flex h-10 items-center justify-center">
                                        {idx > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeContactPerson(idx)}
                                                className="flex h-10 w-10 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                                                title="Remove contact person"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {data.contact_persons.length < 3 && (
                                <button
                                    type="button"
                                    onClick={addContactPerson}
                                    className="mt-4 flex items-center font-medium text-[#37692F] text-sm hover:text-[#2a5624]"
                                >
                                    <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                    {/* Farm Information Section */}
                    <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-800">Farm Information</h3>
                            <span className="text-sm text-gray-500">
                                {data.farms.length} {data.farms.length === 1 ? 'farm' : 'farms'} added
                            </span>
                        </div>

                        <div className="space-y-4">
                            {data.farms.map((farm, idx) => (
                                <div key={idx} className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
                                    <div className="mb-3 flex items-start justify-between">
                                        <h4 className="font-medium text-gray-700">
                                            Farm #{idx + 1} {farm.location_name && `- ${farm.location_name}`}
                                        </h4>
                                        {idx > 0 && !farm.contract_id && (
                                            <button
                                                type="button"
                                                onClick={() => removeFarm(idx)}
                                                className="rounded-full p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                                                title="Remove farm"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Farm Name *</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., North Valley Farm"
                                                value={farm.location_name}
                                                onChange={e => updateFarm(idx, 'location_name', e.target.value)}
                                                onBlur={() => {
                                                    setFarmFieldTouched(idx, 'location_name');
                                                    validateFields(data, touched, contactTouched, farmTouched, showErrors);
                                                }}
                                                required
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                            />
                                            {(farmTouched[idx]?.location_name || showErrors) && localErrors.farms?.[idx]?.location_name && (
                                                <p className="mt-1 text-sm text-red-600">{localErrors.farms[idx].location_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Area Size (hectares) *</label>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="0.01"
                                                value={farm.area_size}
                                                onChange={e => {
                                                    let val = e.target.value;
                                                    
                                                    if (!/^\d*\.?\d{0,2}$/.test(val)) return;

                                                    const numericValue = parseFloat(val);
                                                    if (numericValue > 999.99) return;
                                                    
                                                    updateFarm(idx, 'area_size', val);
                                                }}
                                                onBlur={e => {
                                                    setFarmFieldTouched(idx, 'area_size');
                                                    
                                                    let val = e.target.value;
                                                    const numericValue = parseFloat(val);
                                                    
                                                    if (numericValue >= 0.01 && numericValue <= 999.99) {
                                                        val = numericValue.toFixed(2);
                                                    } else if (numericValue === 0) {
                                                        val = ''; // Clear if zero to trigger min:0.01 error
                                                    }
                                                    
                                                    updateFarm(idx, 'area_size', val);
                                                    validateFields(data, touched, contactTouched, farmTouched, showErrors);
                                                }}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Valid range: 0.01–999.99</p>
                                            {(farmTouched[idx]?.area_size || showErrors) && localErrors.farms?.[idx]?.area_size && (
                                                <p className="mt-1 text-sm text-red-600">{localErrors.farms[idx].area_size}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Address *</label>
                                            <input
                                                type="text"
                                                placeholder="Full farm address"
                                                value={farm.address}
                                                onChange={e => updateFarm(idx, 'address', e.target.value)}
                                                onBlur={() => {
                                                    setFarmFieldTouched(idx, 'address');
                                                    validateFields(data, touched, contactTouched, farmTouched, showErrors);
                                                }}
                                                required
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                            />
                                            {(farmTouched[idx]?.address || showErrors) && localErrors.farms?.[idx]?.address && (
                                                <p className="mt-1 text-sm text-red-600">{localErrors.farms[idx].address}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Soil Type *</label>
                                            <select
                                                value={farm.soil_type}
                                                onChange={e => updateFarm(idx, 'soil_type', e.target.value)}
                                                onBlur={() => {
                                                    setFarmFieldTouched(idx, 'soil_type');
                                                    validateFields(data, touched, contactTouched, farmTouched, showErrors);
                                                }}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                            >
                                                <option value="">Select soil type</option>
                                                <option value="clay">Clay</option>
                                                <option value="sandy">Sandy</option>
                                                <option value="loam">Loam</option>
                                                <option value="silty">Silty</option>
                                            </select>
                                            {(farmTouched[idx]?.soil_type || showErrors) && localErrors.farms?.[idx]?.soil_type && (
                                                <p className="mt-1 text-sm text-red-600">{localErrors.farms[idx].soil_type}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addFarm}
                            disabled={data.farms.length >= 10}
                            className="mt-4 flex w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 py-2 text-[#37692F] transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-green-50"
                        >
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Another Farm
                        </button>

                        {farmWarning && (
                            <p className="mt-2 rounded-md bg-yellow-50 p-2 text-sm text-yellow-600">{farmWarning}</p>
                        )}

                        <p className="mt-2 text-xs text-gray-500">
                            You can add up to 10 farms. Required fields are marked with *.
                        </p>
                    </div>

                    {/* DTI Registration and Tax ID */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700">
                                DTI Registration Number *
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-500">
                                    BN-
                                </span>
                                <input
                                    type="text"
                                    id="registration_number"
                                    ref={regInputRef}
                                    value={data.registration_number}
                                    onFocus={handleRegFocus}
                                    onChange={handleRegChange}
                                    onBlur={e => {
                                        setTouched(t => ({ ...t, registration_number: true }));
                                        validateFields({ ...data, registration_number: e.target.value }, { ...touched, registration_number: true }, contactTouched, farmTouched, showErrors);
                                        if (e.target.value) handleRegBlur(e);
                                    }}
                                    className="flex-1 rounded-none border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                    maxLength={11}
                                    required
                                />
                                <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-500">
                                    REG
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Enter 11-digit Number (Format: BN-YYYY#####REG)
                            </p>
                            {(touched.registration_number || showErrors) && (localErrors.registration_number || regUniqueError) && (
                                <p className="mt-1 text-sm text-red-600">
                                    {localErrors.registration_number || regUniqueError}
                                </p>
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
                                onBlur={e => {
                                    setTouched(t => ({ ...t, tax_id: true }));
                                    validateFields({ ...data, tax_id: e.target.value }, { ...touched, tax_id: true }, contactTouched, farmTouched, showErrors);
                                    if (e.target.value) handleTinBlur(e);
                                }}
                                className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F] ${(touched.tax_id || showErrors) && (localErrors.tax_id || tinUniqueError) ? 'border-red-500' : ''}`}
                                maxLength={15}
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Enter 12-digit TIN (e.g., 123-456-789-000)
                            </p>
                            {(touched.tax_id || showErrors) && (localErrors.tax_id || tinUniqueError) && (
                                <p className="mt-1 text-sm text-red-600">
                                    {localErrors.tax_id || tinUniqueError}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            rows={4}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#37692F] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                            placeholder="Additional notes about this partner..."
                        />
                    </div>

                    {/* Button Actions */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Link
                            href={route('partners.index')}
                            className="rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-400"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={
                                processing ||
                                !!nameUniqueError ||
                                !!emailUniqueError ||
                                !!regUniqueError ||
                                !!tinUniqueError ||
                                checkingName ||
                                checkingEmail ||
                                checkingReg ||
                                checkingTin ||
                                isAnyFormError 
                            }
                            className="rounded-md bg-[#37692F] px-4 py-2 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#2a5624]"
                        >
                            {processing ? 'Saving...' : (partner ? 'Update Partner' : 'Create Partner')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}