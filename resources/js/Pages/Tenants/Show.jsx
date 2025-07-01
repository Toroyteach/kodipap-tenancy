import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { User, Home, FileText, MessageSquare } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import TenantSwitcher from '@/Components/TenantSwitcher';

export default function TenantShowPage({ tenant, allTenants }) {
    const [isMessageModalOpen, setMessageModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    const handleSendMessage = (e) => {
        e.preventDefault();
        // Note: Ensure you have a route named 'tenants.message.send' in your Laravel backend.
        post(route('tenants.message.send', tenant.id), {
            preserveScroll: true,
            onSuccess: () => {
                setMessageModalOpen(false);
                reset();
            },
        });
    };

    // Render a message if the tenant data is not available.
    if (!tenant) {
        return (
            <AppLayout>
                <Head title="Tenant Not Found" />
                <div className="p-4 sm:p-6 lg:p-8">
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
                                <DialogDescription>
                                    Compose a message to send to {tenant.name}.
                                </DialogDescription>
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
                                        {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tenant Details</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{tenant.email || 'No email'}</p>
                            <p className="text-sm text-muted-foreground">{tenant.phone || 'No phone'}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Property & Unit</CardTitle>
                            <Home className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-bold">{tenant.property?.name || 'No property'}</p>
                            <p className="text-sm text-muted-foreground">{tenant.unit?.name || 'No unit'}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lease Information</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Start: {tenant.lease?.start_date || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">End: {tenant.lease?.end_date || 'N/A'}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tenant.payments && tenant.payments.length > 0 ? (
                                    tenant.payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{payment.date}</TableCell>
                                            <TableCell>{payment.amount}</TableCell>
                                            <TableCell>
                                                <Badge variant={payment.status === 'Paid' ? 'default' : 'destructive'}>
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="3" className="text-center">
                                            No payment history available.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}