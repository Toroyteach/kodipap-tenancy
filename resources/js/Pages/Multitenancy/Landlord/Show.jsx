import React from 'react';
import LandlordLayout from '@/Layouts/Landlord/landlordlayout';
import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Switch } from '@headlessui/react';

export default function Show({ tenant, modelCounts }) {

    const [showDialog, setShowDialog] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/system-landlord/clients/${tenant.id}/create-admin`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowDialog(false);
                toast.success('Admin User for Tenant created successfully.');
            },
        });
    };

    const toggleTenantStatus = () => {
        router.put(`/system-landlord/clients/${tenant.id}/toggle-active`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Tenant status updated.');
            },
            onError: () => {
                toast.error('Failed to update tenant status.');
            },
        });
    };

    const runSeeder = () => {
        router.post(`/system-landlord/clients/${tenant.id}/run-seeder`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Seeder executed successfully.');
            },
            onError: () => {
                toast.error('Failed to run seeder.');
            },
        });
    };

    return (
        <LandlordLayout>
            <Head title={`Tenant: ${tenant.id}`} />

            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Tenant: {tenant.id}</h1>

                <div className="mb-6 bg-white p-4 shadow rounded">
                    <h2 className="text-lg font-semibold mb-2">Domain(s)</h2>
                    <ul className="list-disc list-inside text-gray-700">
                        {tenant.domains?.length > 0 ? (
                            tenant.domains.map((d) => (
                                <li key={d.id}>
                                    <a
                                        href={`http://${d.domain}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {d.domain}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500">No domains assigned</li>
                        )}
                    </ul>

                    <div className="mt-6">
                        <button
                            onClick={() => setShowDialog(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Create Tenant Admin
                        </button>

                        {/* <button
                            onClick={() => runSeeder()}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-4"
                        >
                            Seed Dummy Data
                        </button> */}

                        {showDialog && (
                            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                                    <h2 className="text-xl font-semibold mb-4">Create Admin User</h2>
                                    <form onSubmit={submit} className="space-y-4">
                                        <div>
                                            <label className="block font-medium mb-1">Name</label>
                                            <input
                                                type="text"
                                                className="w-full border px-3 py-2 rounded"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                            />
                                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block font-medium mb-1">Email</label>
                                            <input
                                                type="email"
                                                className="w-full border px-3 py-2 rounded"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />
                                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block font-medium mb-1">Password</label>
                                            <input
                                                type="password"
                                                className="w-full border px-3 py-2 rounded"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                            />
                                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowDialog(false)}
                                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-6 flex items-center space-x-4">
                        <span className="font-medium text-gray-700">Maintenance Mode</span>
                        <Switch
                            checked={!tenant.is_active ? true : false}
                            onChange={() => toggleTenantStatus()}
                            className={`${!tenant.is_active ? 'bg-yellow-600' : 'bg-green-600'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
                        >
                            <span
                                className={`${!tenant.is_active ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                            />
                        </Switch>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(modelCounts).map(([label, count]) => (
                        <div key={label} className="bg-white p-4 rounded shadow text-center">
                            <h3 className="text-sm font-medium text-gray-500 capitalize">
                                {label.replace(/_/g, ' ')}
                            </h3>
                            <p className="text-2xl font-bold">{count}</p>
                        </div>
                    ))}
                </div>
            </div>
        </LandlordLayout>
    );
}