import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Search, 
    Plus, 
    MoreVertical, 
    User, 
    Phone, 
    Mail, 
    Home, 
    Calendar, 
    FileText,
    Filter,
    MapPin,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';

// Sample data - replace with actual data from your backend
const tenants = [
    {
        id: '1',
        name: 'Mary Wanjiku',
        unit: 'A-101',
        phone: '+254 712 345 678',
        email: 'mary.wanjiku@email.com',
        rent: 25000,
        status: 'active',
        lastPayment: '2024-01-15',
        dueDate: '2024-02-01',
        balance: 0
    },
    {
        id: '2',
        name: 'James Mwangi',
        unit: 'B-205',
        phone: '+254 723 456 789',
        email: 'james.mwangi@email.com',
        rent: 30000,
        status: 'active',
        lastPayment: '2024-01-15',
        dueDate: '2024-02-01',
        balance: 0
    },
    {
        id: '3',
        name: 'Grace Akinyi',
        unit: 'C-302',
        phone: '+254 734 567 890',
        email: 'grace.akinyi@email.com',
        rent: 22000,
        status: 'overdue',
        lastPayment: '2023-12-15',
        dueDate: '2024-01-01',
        balance: 22000
    },
    {
        id: '4',
        name: 'Peter Otieno',
        unit: 'A-104',
        phone: '+254 745 678 901',
        email: 'peter.otieno@email.com',
        rent: 28000,
        status: 'active',
        lastPayment: '2024-01-14',
        dueDate: '2024-02-01',
        balance: 0
    }
];

const getStatusVariant = (status) => {
    switch (status) {
        case 'active':
            return 'default';
        case 'overdue':
            return 'destructive';
        case 'inactive':
            return 'outline';
        default:
            return 'outline';
    }
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function TenantsIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredTenants = tenants.filter(tenant => 
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone.includes(searchTerm) ||
        tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 p-6">
            <Head title="Tenants" />
            
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
                    <p className="text-gray-500">Manage your tenants and their information</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tenant
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">All Tenants</CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search tenants..."
                                    className="pl-10 w-64 text-sm h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="h-9">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tenant
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unit
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rent
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Payment
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                                                    {tenant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                                                    <div className="text-sm text-gray-500">{tenant.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Home className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{tenant.unit}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">KSH {tenant.rent.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">Monthly</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(tenant.lastPayment)}</div>
                                            <div className="text-xs text-gray-500">
                                                {tenant.balance === 0 ? (
                                                    <span className="text-green-600">Paid in full</span>
                                                ) : (
                                                    <span className="text-red-600">Balance: KSH {tenant.balance.toLocaleString()}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{formatDate(tenant.dueDate)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={getStatusVariant(tenant.status)}>
                                                {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {filteredTenants.length === 0 && (
                        <div className="text-center py-12">
                            <div className="mx-auto h-12 w-12 text-gray-400">
                                <User className="h-full w-full" />
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No tenants found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'Try a different search term' : 'Get started by adding a new tenant'}
                            </p>
                            <div className="mt-6">
                                <Button className="bg-green-600 hover:bg-green-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Tenant
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Set the layout for this page
TenantsIndex.layout = page => <AppLayout title="Tenants" children={page} />;

