import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Plus,
    Phone,
    Mail,
    Home,
    Calendar,
    Filter,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

export default function TenantsIndex({ tenants, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedTenants, setSelectedTenants] = useState([]);
    const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

    const debouncedSearch = useCallback(
        debounce(value => {
            router.get(route('tenants.index'), { search: value }, { preserveState: true, replace: true });
        }, 300),
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const sendReceipt = (tenant) => {
        console.log(`Receipt sent to ${tenant.name}`);
    };

    const sendReminder = (tenant) => {
        post(route('notifications.send.type'), {
            user_id: tenant.id,
            type: 'sms_due_reminder',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Reminder sent to ${tenant.name}`);
            },
            onError: () => {
                toast.error(`Failed to send reminder to ${tenant.name}`);
            },
        });
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
                    <div className="space-y-4">
                        {tenants.map((tenant, index) => (
                            <div
                                key={`${tenant.id}-${index}`}
                                className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                                            <Badge variant="secondary" className={getStatusColor(tenant.status)}>
                                                {tenant.status}
                                            </Badge>
                                            {tenant.status === 'overdue' && (
                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Home className="w-4 h-4" />
                                                {tenant.property}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                {tenant.phone}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {tenant.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Due: {tenant.due ? new Date(tenant.due).toLocaleDateString('en-KE') : '—'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Monthly Rent</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            KSH {tenant.monthly_rent?.toLocaleString()}
                                        </p>
                                        {tenant.balance > 0 && (
                                            <p className="text-sm text-red-600 font-medium">
                                                Outstanding: KSH {tenant.balance.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500">
                                        Last payment:{' '}
                                        {tenant.last_payment
                                            ? new Date(tenant.last_payment).toLocaleDateString('en-KE')
                                            : '—'}
                                    </p>
                                    <div className="flex gap-2">
                                        <Link href={`/tenants/${tenant.id}`}>
                                            <Button variant="outline" size="sm" onClick={() => router.visit(`/tenants/${tenant.id}`)}>
                                                View Details
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm" onClick={() => sendReceipt(tenant)}>
                                            Send Receipt
                                        </Button>
                                        {tenant.status === 'overdue' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={() => sendReminder(tenant)}
                                            >
                                                Send Reminder
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

TenantsIndex.layout = page => <AppLayout title="Tenants">{page}</AppLayout>;