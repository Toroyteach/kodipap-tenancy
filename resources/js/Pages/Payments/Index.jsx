import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    Download,
    Smartphone,
    CreditCard,
    Eye,
    Send
} from 'lucide-react';

export default function PaymentsIndex() {
    const { stats, payments } = usePage().props;

    const [searchTerm, setSearchTerm] = useState('');

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getPaymentIcon = (method) => {
        return method === 'M-Pesa' ? Smartphone : CreditCard;
    };

    const getStatusColor = (status) => {
        switch (status) {
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

    return (
        <div className="p-6">
            <Head title="Payments" />

            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Payments</h1>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border px-2 py-1 rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Link
                        href="#"
                        className="inline-flex items-center px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Record Payment
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Today's Collections</p>
                                <p className="text-xl font-bold text-gray-900">
                                    KSH {Number(stats.today_total).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <CreditCard className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">M-Pesa Payments</p>
                                <p className="text-xl font-bold text-gray-900">
                                    KSH {Number(stats.total_mpesa).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Smartphone className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Bank Transfers</p>
                                <p className="text-xl font-bold text-gray-900">
                                    KSH {Number(stats.total_bank).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-xl font-bold text-gray-900">
                                    KSH {Number(stats.total_pending).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-2 bg-yellow-50 rounded-lg">
                                <CreditCard className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Payment History</CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input placeholder="Search payments..." className="pl-10 w-64" />
                            </div>
                            <Button variant="outline" size="sm">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Payment ID</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Tenant</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Property</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Method</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Reference</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((payment) => {
                                    const PaymentIcon = getPaymentIcon(payment.method);
                                    return (
                                        <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-4 px-4 font-medium text-gray-900">{payment.id}</td>
                                            <td className="py-4 px-4 text-gray-900">{payment.tenant}</td>
                                            <td className="py-4 px-4 text-gray-600">{payment.property} ({payment.unit})</td>
                                            <td className="py-4 px-4 font-medium text-gray-900">
                                                KSH {payment.amount.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <PaymentIcon className={`w-4 h-4 ${payment.method === 'M-Pesa' ? 'text-green-600' : 'text-blue-600'}`} />
                                                    <span className="text-gray-600">{payment.method}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-gray-600 font-mono text-sm">{payment.reference}</td>
                                            <td className="py-4 px-4 text-gray-600">
                                                <div>
                                                    <div>{payment.paid_at?.split(' ')[0]}</div>
                                                    <div className="text-xs text-gray-400">{payment.paid_at?.split(' ')[1]}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <Link href={`/payments/${payment.id}`}>
                                                        <Button variant="ghost" size="sm" title="View Details">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredPayments.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-6 text-gray-500">
                                            No payments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Set the layout for this page
PaymentsIndex.layout = page => <AppLayout title="Payments" children={page} />;
