import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { DollarSign, Users, AlertTriangle, ArrowUpRight, Calendar } from 'lucide-react';
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
    const { stats, monthly_collections, recent_payments } = usePage().props;

    const statCards = [
        {
            title: 'Total Collections',
            value: `KSH ${Number(stats.total_collections).toLocaleString()}`,
            // change: `${stats.collections_change >= 0 ? '+' : ''}${stats.collections_change}% from last month`,
            icon: DollarSign,
            // changeColor: stats.collections_change >= 0 ? 'text-green-500' : 'text-red-500',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'Active Tenants',
            value: stats.active_tenants,
            change: `${stats.tenants_change >= 0 ? '+' : ''}${stats.tenants_change} from last month`,
            icon: Users,
            changeColor: stats.tenants_change >= 0 ? 'text-green-500' : 'text-red-500',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Pending Payments',
            value: `KSH ${Number(stats.pending_payments).toLocaleString()}`,
            change: `${stats.pending_change >= 0 ? '+' : ''}${stats.pending_change}% from last month`,
            icon: AlertTriangle,
            changeColor: stats.pending_change >= 0 ? 'text-orange-600' : 'text-red-500',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
        {
            title: 'This Month',
            value: `KSH ${Number(stats.last_month_total_collections).toLocaleString()}`,
            change: `${stats.collections_change >= 0 ? '+' : ''}${stats.collections_change}% from last month`,
            icon: ArrowUpRight,
            changeColor: stats.collections_change >= 0 ? 'text-green-500' : 'text-red-500',
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('en-KE', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, index) => (
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
                            <PaymentChart data={monthly_collections} />
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-3">
                        <CardContent>
                            <RecentPayments payments={recent_payments} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}