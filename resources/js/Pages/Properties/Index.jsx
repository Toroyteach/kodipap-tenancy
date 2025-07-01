import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function PropertiesIndex() {
    return (
        <AppLayout>
            <Head title="Properties" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                        <p className="text-sm text-gray-500">Manage your property portfolio</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Add Property
                    </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-gray-500">Your properties will appear here.</p>
                    {/* Property list will be implemented here */}
                </div>
            </div>
        </AppLayout>
    );
}
