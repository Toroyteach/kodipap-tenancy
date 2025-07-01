import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
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
import { Checkbox } from '@/Components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';



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

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

export default function TenantsIndex({ tenants, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedTenants, setSelectedTenants] = useState([]);
    const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

    const debouncedSearch = useCallback(
        debounce(value => {
            router.get(route('tenants.index'), { search: value }, { preserveState: true, replace: true });
        }, 300), // 300ms delay
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedTenants(tenants.map(t => t.id));
        } else {
            setSelectedTenants([]);
        }
    };

    const handleSelectTenant = (tenantId, checked) => {
        if (checked) {
            setSelectedTenants(prev => [...prev, tenantId]);
        } else {
            setSelectedTenants(prev => prev.filter(id => id !== tenantId));
        }
    };

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

            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Bulk Message</DialogTitle>
                        <DialogDescription>
                            You are about to send a message to {selectedTenants.length} tenant(s).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Type your message here." rows={4} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => {
                            // Handle message sending logic here
                            console.log('Sending message to:', selectedTenants);
                            setIsMessageDialogOpen(false);
                            setSelectedTenants([]);
                        }}>Send Message</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <CardTitle className="text-lg font-semibold">All Tenants</CardTitle>
                            {selectedTenants.length > 0 && (
                                <Button onClick={() => setIsMessageDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 h-9">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send Message ({selectedTenants.length})
                                </Button>
                            )}
                        </div>
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
                                    <th scope="col" className="p-4">
                                        <Checkbox 
                                            id="select-all"
                                            onCheckedChange={handleSelectAll}
                                            checked={selectedTenants.length === tenants.length && tenants.length > 0}
                                        />
                                    </th>
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
                                {tenants.map((tenant) => (
                                    <tr key={tenant.id} className={`hover:bg-gray-50 ${selectedTenants.includes(tenant.id) ? 'bg-blue-50' : ''}`}>
                                        <td className="p-4">
                                            <Checkbox 
                                                id={`select-${tenant.id}`}
                                                onCheckedChange={(checked) => handleSelectTenant(tenant.id, checked)}
                                                checked={selectedTenants.includes(tenant.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link href={route('tenants.show', tenant.id)} className="flex items-center group">
                                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium group-hover:bg-green-200 transition-colors">
                                                    {tenant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">{tenant.name}</div>
                                                    <div className="text-sm text-gray-500">{tenant.phone}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Home className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{tenant.unit}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">KSH {tenant.rent?.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">Monthly</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(tenant.lastPayment)}</div>
                                            <div className="text-xs text-gray-500">
                                                {tenant.balance === 0 ? (
                                                    <span className="text-green-600">Paid in full</span>
                                                ) : (
                                                    <span className="text-red-600">Balance: KSH {tenant.balance?.toLocaleString()}</span>
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
                    
                    {tenants.length === 0 && (
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

