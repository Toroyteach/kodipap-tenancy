import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import {
    Smartphone,
    CreditCard,
    User,
    Home,
    DollarSign,
    Clock,
} from 'lucide-react';

export default function Show() {
    const { payment, tenant, unit, property, payment_history } = usePage().props;

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('en-KE', options);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentIcon = (method) =>
        method?.toLowerCase() === 'mpesa' ? Smartphone : CreditCard;

    const PaymentMethodIcon = payment?.method ? getPaymentIcon(payment.method) : CreditCard;

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <Head title={`Payment #${payment.id}`} />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Payment & Tenant Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Payment Details */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <DollarSign className="text-blue-600 w-5 h-5" />
                                Payment #{payment.id}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <p className="text-gray-500">Amount</p>
                                <p className="text-lg font-semibold">KSH {Number(payment.amount).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <PaymentMethodIcon className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-gray-500">Method</p>
                                    <p className="text-lg font-semibold">{payment.method}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500">Status</p>
                                <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                            </div>
                            <div>
                                <p className="text-gray-500">Reference</p>
                                <p className="text-lg font-semibold">{payment.reference || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Paid At</p>
                                <p className="text-lg font-semibold">{formatDateTime(payment.paid_at)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tenant Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <User className="text-green-600 w-5 h-5" />
                                Tenant
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-gray-700">
                            <div>
                                <p className="text-gray-500">Name</p>
                                <p className="font-medium">{tenant.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p>{tenant.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p>{tenant.phone || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Property & Unit */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Home className="text-purple-600 w-5 h-5" />
                            Property & Unit
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <p className="text-gray-500">Property</p>
                            <p className="font-medium">{property}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Unit</p>
                            <p className="font-medium">{unit}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Lease Payment History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Clock className="text-orange-600 w-5 h-5" />
                            Lease Payment History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Paid At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payment_history.length > 0 ? (
                                    payment_history.map((p, i) => (
                                        <TableRow key={i}>
                                            <TableCell>KSH {Number(p.amount).toLocaleString()}</TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                {React.createElement(getPaymentIcon(p.method), {
                                                    className: `w-4 h-4 ${p.method?.toLowerCase() === 'mpesa' ? 'text-green-600' : 'text-blue-600'}`,
                                                })}
                                                {p.method}
                                            </TableCell>
                                            <TableCell>{p.reference || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(p.status)}>{p.status}</Badge>
                                            </TableCell>
                                            <TableCell>{formatDateTime(p.paid_at)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                            No payment history found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Show.layout = (page) => <AppLayout title="Payments" children={page} />;