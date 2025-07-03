import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    Download,
    FileText,
    Calendar,
    TrendingUp,
    Users,
    ArrowUp,
    ArrowDown,
    DollarSign,
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const StatCard = ({ title, value, change, icon: Icon }) => {
    const isPositive = change && parseFloat(change) > 0;
    const changeValue = change ? Math.abs(parseFloat(change)) : null;

    return (
        <Card className="flex-1">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <div className="mt-1 flex items-baseline">
                            <p className="text-2xl font-semibold">{value}</p>
                            {change && (
                                <span
                                    className={`ml-2 flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {isPositive ? (
                                        <ArrowUp className="h-3 w-3 mr-1" />
                                    ) : (
                                        <ArrowDown className="h-3 w-3 mr-1" />
                                    )}
                                    {changeValue}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="p-2 rounded-lg bg-green-50">
                        <Icon className="h-5 w-5 text-green-600" />
                    </div>
                </div>
                {change && (
                    <p className="mt-2 text-xs text-gray-500">
                        {isPositive ? 'Up' : 'Down'} from last month
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default function Reports() {
    const { stats, line_chart, pie_chart } = usePage().props;

    const lineChartData = line_chart.map(item => ({
        name: item.month,
        revenue: item.total,
    }));

    const totalPie = pie_chart.reduce((acc, curr) => acc + parseFloat(curr.total), 0);
    const pieChartData = pie_chart.map((item, index) => ({
        name: item.method,
        value: Math.round((parseFloat(item.total) / totalPie) * 100),
        color: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'][index % 4],
    }));

    return (
        <AppLayout>
            <Head title="Reports & Analytics" />
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
                        <p className="text-muted-foreground">Comprehensive insights into your property performance</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            This Month
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Report
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <StatCard
                        title="Total Revenue"
                        value={`KSH ${parseFloat(stats.total_revenue).toLocaleString()}`}
                        change={stats.growth_rate}
                        icon={DollarSign}
                    />
                    <StatCard
                        title="Collection Rate"
                        value={`${stats.collection_rate}%`}
                        change={stats.growth_rate}
                        icon={TrendingUp}
                    />
                    <StatCard
                        title="Active Tenants"
                        value={stats.active_tenants}
                        icon={Users}
                    />
                    <StatCard
                        title="Avg. Rent"
                        value={`KSH ${parseFloat(stats.average_rent).toLocaleString()}`}
                        icon={FileText}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Revenue Trends</CardTitle>
                            <CardDescription>Monthly collections</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis
                                            tickFormatter={(value) => `KSH ${value / 1000}K`}
                                        />
                                        <Tooltip
                                            formatter={(value) => [`KSH ${value.toLocaleString()}`, '']}
                                            labelFormatter={(label) => `Month: ${label}`}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            name="Revenue"
                                            stroke="#10B981"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Methods</CardTitle>
                            <CardDescription>Distribution of payment channels</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value}%`, '']} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-6 space-y-3">
                                    {pieChartData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div
                                                    className="w-3 h-3 rounded-full mr-2"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-sm">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-medium">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button variant="outline" className="h-24 flex flex-col gap-2">
                                <FileText className="w-6 h-6" />
                                <span>Monthly Statement</span>
                            </Button>
                            <Button variant="outline" className="h-24 flex flex-col gap-2">
                                <Calendar className="w-6 h-6" />
                                <span>Rental Schedule</span>
                            </Button>
                            <Button variant="outline" className="h-24 flex flex-col gap-2">
                                <Download className="w-6 h-6" />
                                <span>Tax Report</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}