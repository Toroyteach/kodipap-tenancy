import React from 'react';
import { useForm, Link, Head, router } from '@inertiajs/react';
import LandlordLayout from '@/Layouts/Landlord/landlordlayout';
import { toast } from 'react-toastify';

export default function CreateTenant() {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: '',
        domain: '',
        name: '',
        email: '',
        phone: '',
        id_number: '',
        kra_pin: '',
        company_name: '',
        company_reg_no: '',
        industry: '',
        ownership_type: '',
        billing_email: '',
        billing_phone: '',
        billing_address: '',
        city: '',
        country: '',
        currency: 'KES',
        plan: 'free',
        trial_ends_at: '',
        subscription_ends_at: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
    
        post('/system-landlord/clients', {
            preserveScroll: true,
            onSuccess: () => {
                // router.visit('/landlord/tenants');
                reset(); 
                toast.success('Tenant created successfully.');
            },
            onError: () => {
                toast.error('Failed to create tenant.');
            },
        });
    };

    return (
        <LandlordLayout>
            <Head title="Create Tenant" />

            <div className="mx-auto min-h-screen flex items-center justify-center">
                <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 text-center">Create New Tenant</h1>
                        <p className="text-gray-600 mb-8 text-center">Fill in the details below to register a new tenant in your system.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Tenant ID and Domain */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="tenantId" className="block text-sm font-semibold text-gray-700 mb-1">Tenant ID</label>
                                    <input
                                        id="tenantId"
                                        type="text"
                                        value={data.id}
                                        onChange={(e) => setData('id', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                        placeholder="e.g., tenant_001"
                                    />
                                    {errors.id && <p className="text-red-600 text-xs mt-1">{errors.id}</p>}
                                </div>
                                <div>
                                    <label htmlFor="domain" className="block text-sm font-semibold text-gray-700 mb-1">Domain</label>
                                    <input
                                        id="domain"
                                        type="text"
                                        value={data.domain}
                                        onChange={(e) => setData('domain', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                        placeholder="e.g., example.com"
                                    />
                                    {errors.domain && <p className="text-red-600 text-xs mt-1">{errors.domain}</p>}
                                </div>
                            </div>

                            {/* Basic Info Section */}
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="Tenant Name"
                                        />
                                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="email@example.com"
                                        />
                                        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                                    <input
                                        id="phone"
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                        placeholder="+1234567890"
                                    />
                                </div>
                            </div>

                            {/* Identification Section */}
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Identification Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="idNumber" className="block text-sm font-semibold text-gray-700 mb-1">ID Number</label>
                                        <input
                                            id="idNumber"
                                            type="text"
                                            value={data.id_number}
                                            onChange={(e) => setData('id_number', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="e.g., 12345678"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="kraPin" className="block text-sm font-semibold text-gray-700 mb-1">KRA PIN</label>
                                        <input
                                            id="kraPin"
                                            type="text"
                                            value={data.kra_pin}
                                            onChange={(e) => setData('kra_pin', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="e.g., A123456789Z"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Company Info Section */}
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Company Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                                        <input
                                            id="companyName"
                                            type="text"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="e.g., Tech Solutions Ltd."
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="companyRegNo" className="block text-sm font-semibold text-gray-700 mb-1">Registration No.</label>
                                        <input
                                            id="companyRegNo"
                                            type="text"
                                            value={data.company_reg_no}
                                            onChange={(e) => setData('company_reg_no', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="e.g., C12345"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-1">Industry</label>
                                        <input
                                            id="industry"
                                            type="text"
                                            value={data.industry}
                                            onChange={(e) => setData('industry', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="e.g., Software Development"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="ownershipType" className="block text-sm font-semibold text-gray-700 mb-1">Ownership Type</label>
                                        <input
                                            id="ownershipType"
                                            type="text"
                                            value={data.ownership_type}
                                            onChange={(e) => setData('ownership_type', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="e.g., Private Limited"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Billing Info Section */}
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Billing Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="billingEmail" className="block text-sm font-semibold text-gray-700 mb-1">Billing Email</label>
                                        <input
                                            id="billingEmail"
                                            type="email"
                                            value={data.billing_email}
                                            onChange={(e) => setData('billing_email', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="billing@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="billingPhone" className="block text-sm font-semibold text-gray-700 mb-1">Billing Phone</label>
                                        <input
                                            id="billingPhone"
                                            type="text"
                                            value={data.billing_phone}
                                            onChange={(e) => setData('billing_phone', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label htmlFor="billingAddress" className="block text-sm font-semibold text-gray-700 mb-1">Billing Address</label>
                                    <input
                                        id="billingAddress"
                                        type="text"
                                        value={data.billing_address}
                                        onChange={(e) => setData('billing_address', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                        placeholder="123 Main St"
                                    />
                                </div>
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                                        <input
                                            id="city"
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                                        <input
                                            id="country"
                                            type="text"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="USA"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Plan Info Section */}
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Plan Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="plan" className="block text-sm font-semibold text-gray-700 mb-1">Plan</label>
                                        <input
                                            id="plan"
                                            type="text"
                                            value={data.plan}
                                            onChange={(e) => setData('plan', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                            placeholder="e.g., Premium"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="trialEnds" className="block text-sm font-semibold text-gray-700 mb-1">Trial Ends</label>
                                        <input
                                            id="trialEnds"
                                            type="date"
                                            value={data.trial_ends_at}
                                            onChange={(e) => setData('trial_ends_at', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="subscriptionEnds" className="block text-sm font-semibold text-gray-700 mb-1">Subscription Ends</label>
                                        <input
                                            id="subscriptionEnds"
                                            type="date"
                                            value={data.subscription_ends_at}
                                            onChange={(e) => setData('subscription_ends_at', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="pt-4 border-t border-gray-200">
                                <label htmlFor="isActive" className="inline-flex items-center cursor-pointer">
                                    <input
                                        id="isActive"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-base text-gray-700">Active Tenant</span>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
                                <Link href="/system-landlord/clients" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out mb-4 sm:mb-0">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create Tenant
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </LandlordLayout>
    );
}