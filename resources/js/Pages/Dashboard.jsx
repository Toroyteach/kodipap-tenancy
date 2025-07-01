import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { DollarSign, Users, AlertTriangle, ArrowUpRight } from 'lucide-react';
import PaymentChart from '@/Components/PaymentChart';
import RecentPayments from '@/Components/RecentPayments';

const StatCard = ({ title, value, change, icon: Icon, changeColor, iconBg, iconColor }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className={`p-2 rounded-md ${iconBg}`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className={`text-xs ${changeColor}`}>{change}</p>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const stats = [
        {
            title: 'Total Collections',
            value: 'KSH 450,000',
            change: '+12.5% from last month',
            icon: DollarSign,
            changeColor: 'text-green-500',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'Active Tenants',
            value: '24',
            change: '+2 from last month',
            icon: Users,
            changeColor: 'text-green-500',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Pending Payments',
            value: 'KSH 85,000',
            change: '-8.3% from last month',
            icon: AlertTriangle,
            changeColor: 'text-red-500',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
        {
            title: 'This Month',
            value: 'KSH 125,000',
            change: '+15.2% from last month',
            icon: ArrowUpRight,
            changeColor: 'text-green-500',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, here's what's happening with your properties</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Tuesday, 1 July 2025
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Monthly Collections</CardTitle>
                            <p className="text-sm text-muted-foreground">Collection performance vs targets</p>
                        </CardHeader>
                        <CardContent>
                            <PaymentChart />
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-3">
                        <CardContent>
                            <RecentPayments />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
