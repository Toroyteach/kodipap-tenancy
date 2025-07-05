import React from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import LandlordLayout from '@/Layouts/Landlord/landlordlayout';

export default function Dashboard() {
    const { totalTenants, latestTenants } = usePage().props;

    return (
        <LandlordLayout>
            <Head title="Landlord Dashboard" />

            <h1 className="text-2xl font-bold mb-4">Landlord Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">Total Tenants</h2>
                    <p className="text-3xl font-bold">{totalTenants}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">Actions</h2>
                    <Link
                        href="/system-landlord/clients/create"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        + Create New Tenant
                    </Link>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">Latest Tenants</h2>
                <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tenant</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Domain</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {latestTenants.map((tenant) => (
                            <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{tenant.name || tenant.id}</td>
                                <td className="px-6 py-4 text-gray-700">{tenant.name || '—'}</td>
                                <td className="px-6 py-4 text-gray-700">{tenant.domains?.[0]?.domain || '—'}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-white text-xs ${tenant.is_active ? 'bg-green-600' : 'bg-gray-400'}`}>
                                        {tenant.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{new Date(tenant.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 space-x-2">
                                    <Link
                                        href={`/system-landlord/clients/${tenant.id}`}
                                        className="inline-block text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/system-landlord/clients/${tenant.id}/edit`}
                                        className="inline-block text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                                    >
                                        Edit
                                    </Link>
                                    {tenant.domains?.[0]?.domain && (
                                        <a
                                            href={`http://${tenant.domains[0].domain}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                                        >
                                            Visit
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {latestTenants.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No tenants found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </LandlordLayout>
    );
}