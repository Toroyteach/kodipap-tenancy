import React from 'react';
import { useForm, Link, usePage, router, Head } from '@inertiajs/react';
import LandlordLayout from '@/Layouts/Landlord/landlordlayout';
import { toast } from 'react-toastify';

export default function EditTenant() {
    const { tenant } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        id: tenant.id,
        domain: tenant.domains?.[0]?.domain || '',

        name: tenant.name || '',
        email: tenant.email || '',
        phone: tenant.phone || '',
        id_number: tenant.id_number || '',
        kra_pin: tenant.kra_pin || '',

        company_name: tenant.company_name || '',
        company_reg_no: tenant.company_reg_no || '',
        industry: tenant.industry || '',
        ownership_type: tenant.ownership_type || '',

        billing_email: tenant.billing_email || '',
        billing_phone: tenant.billing_phone || '',
        billing_address: tenant.billing_address || '',
        city: tenant.city || '',
        country: tenant.country || '',
        currency: tenant.currency || 'KES',

        plan: tenant.plan || 'free',
        trial_ends_at: tenant.trial_ends_at || '',
        subscription_ends_at: tenant.subscription_ends_at || '',
        is_active: tenant.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
    
        put(`/system-landlord/clients/${tenant.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Tenant updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update tenant.');
            },
        });
    };

    const handleDelete = () => {
        if (
            confirm(
                '⚠️ WARNING: Deleting this tenant will remove all associated data and database. This action is irreversible.\n\nAre you sure you want to continue?'
            )
        ) {
            router.delete(`/system-landlord/clients/${tenant.id}`);
        }
    };

    return (
        <LandlordLayout>
            <Head title={`Edit Tenant ${tenant.id}`} />

            <div className="mx-auto min-h-screen flex items-center justify-center">
                <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 text-center">Edit Tenant Details</h1>
                        <p className="text-gray-600 mb-8 text-center">Modify the tenant's information and update their profile.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Tenant ID and Domain - Often read-only for editing but kept editable as per original */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="tenantId" className="block text-sm font-semibold text-gray-700 mb-1">Tenant ID</label>
                                    <input
                                        id="tenantId"
                                        type="text"
                                        value={data.id}
                                        onChange={(e) => setData('id', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out px-4 py-2 bg-gray-50 cursor-not-allowed"
                                        readOnly // Often Tenant ID is not editable after creation
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

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
                                <Link href="/system-landlord/clients" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out mb-4 sm:mb-0">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Update Tenant
                                </button>
                            </div>
                        </form>

                        {/* Delete Tenant Section */}
                        <div className="mt-10 bg-red-50 p-6 rounded-lg border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center">
                                <svg className="h-8 w-8 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.542 2.705-1.542 3.47 0l5.58 11.163A2.002 2.002 0 0116.292 18H3.708a2.002 2.002 0 01-1.725-2.938L8.257 3.099zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 5.5a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
                                </svg>
                                <p className="text-base text-red-800 font-medium">
                                    **Warning:** Deleting this tenant will permanently destroy all its associated data, including database, domains, and configurations. This action cannot be undone.
                                </p>
                            </div>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-150 ease-in-out w-full sm:w-auto"
                            >
                                Delete Tenant
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </LandlordLayout>
    );
}