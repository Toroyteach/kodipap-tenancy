import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import TenantSwitcher from '@/Components/TenantSwitcher';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/Components/ui/dialog';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { MessageSquare } from 'lucide-react';

export default function TenantShowPage({ tenant, allTenants = [] }) {
    const [isMessageModalOpen, setMessageModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({ message: '' });

    const handleSendMessage = (e) => {
        e.preventDefault();
        post(route('notifications.send.custom'), {
            user_id: tenant.id,
            message: data.message,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setMessageModalOpen(false);
                reset();
            },
        });
    };

    if (!tenant) {
        return (
            <AppLayout>
                <Head title="Tenant Not Found" />
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Tenant Not Found</h1>
                    <p>The requested tenant could not be found.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title={`Tenant - ${tenant.name}`} />
            <div className="">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold truncate">{tenant.name || 'Tenant Details'}</h1>
                        <TenantSwitcher tenants={allTenants} currentTenantId={tenant.id} />
                    </div>
                    <Dialog open={isMessageModalOpen} onOpenChange={setMessageModalOpen}>
                        <DialogTrigger asChild>
                            <Button><MessageSquare className="mr-2 h-4 w-4" /> Send Message</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Send Custom Message</DialogTitle>
                                <DialogDescription>Compose a message to send to {tenant.name}.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSendMessage}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid w-full gap-1.5">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Type your message here."
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-red-500 mt-1">{errors.message}</p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Tenant Basic Info */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Tenant Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Name:</strong> {tenant.name}</p>
                        <p><strong>Email:</strong> {tenant.email}</p>
                        <p><strong>Phone:</strong> {tenant.phone || 'N/A'}</p>
                        <p><strong>Created At:</strong> {new Date(tenant.created_at).toLocaleString()}</p>
                    </CardContent>
                </Card>

                {/* Leases Grid */}
                {tenant.leases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {tenant.leases.map((lease, index) => (
                            <Card key={lease.id}>
                                <CardHeader>
                                    <CardTitle>Lease #{index + 1} — Unit: {lease.unit?.unit_number || 'N/A'}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-2">
                                    <p><strong>Status:</strong> <Badge variant={lease.status === 'active' ? 'default' : 'secondary'}>{lease.status}</Badge></p>
                                    <p><strong>Start Date:</strong> {lease.start_date}</p>
                                    <p><strong>End Date:</strong> {lease.end_date}</p>
                                    <p><strong>Rent:</strong> KES {Number(lease.rent_amount).toLocaleString()}</p>
                                    <p><strong>Deposit:</strong> KES {Number(lease.deposit_amount).toLocaleString()}</p>

                                    {/* Payments */}
                                    <div className="pt-4">
                                        <h3 className="font-semibold mb-2">Payments</h3>
                                        {lease.payments?.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-3">
                                                {lease.payments.map((payment) => (
                                                    <div key={payment.id} className="border rounded p-3 bg-muted">
                                                        <p className="text-sm"><strong>Date:</strong> {payment.payment_date}</p>
                                                        <p className="text-sm"><strong>Amount:</strong> KES {Number(payment.amount).toLocaleString()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">No payments found.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardHeader><CardTitle>No Leases Found</CardTitle></CardHeader>
                        <CardContent className="text-muted-foreground">This tenant has no lease records.</CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}