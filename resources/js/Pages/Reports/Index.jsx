import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { 
    Download, 
    ArrowUpRight, 
    FileText, 
    Calendar, 
    TrendingUp,
    Percent,
    Users,
    Home,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    BarChart, 
    Bar,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// Sample data for charts
const revenueData = [
    { name: 'Jan', revenue: 1800000, expenses: 1200000 },
    { name: 'Feb', revenue: 2000000, expenses: 1400000 },
    { name: 'Mar', revenue: 2200000, expenses: 1500000 },
    { name: 'Apr', revenue: 2100000, expenses: 1450000 },
    { name: 'May', revenue: 2400000, expenses: 1600000 },
    { name: 'Jun', revenue: 2500000, expenses: 1700000 },
];

const paymentData = [
    { name: 'M-Pesa', value: 60, color: '#10B981' },
    { name: 'Bank Transfer', value: 35, color: '#3B82F6' },
    { name: 'Cash', value: 5, color: '#6B7280' },
];

const quickActions = [
    { 
        title: 'Monthly Statement',
        description: 'Generate monthly financial statement',
        icon: FileText,
        action: () => console.log('Generate Monthly Statement')
    },
    { 
        title: 'Rental Schedule',
        description: 'View upcoming rental payments',
        icon: Calendar,
        action: () => console.log('View Rental Schedule')
    },
    { 
        title: 'Tax Report',
        description: 'Generate tax report for the period',
        icon: TrendingUp,
        action: () => console.log('Generate Tax Report')
    },
];

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
                                <span className={`ml-2 flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
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
    return (
        <AppLayout>
            <Head title="Reports & Analytics" />
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
                        <p className="text-muted-foreground">
                            Comprehensive insights into your property performance
                        </p>
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

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <StatCard 
                        title="Total Revenue" 
                        value="KSH 2.5M" 
                        change="12.5"
                        icon={TrendingUp}
                    />
                    <StatCard 
                        title="Collection Rate" 
                        value="94.2%" 
                        change="2.1"
                        icon={Percent}
                    />
                    <StatCard 
                        title="Active Tenants" 
                        value="24" 
                        changeText="+2 new this month"
                        icon={Users}
                    />
                    <StatCard 
                        title="Avg. Rent" 
                        value="KSH 26.5K" 
                        description="per unit"
                        icon={Home}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    {/* Revenue Trends */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Revenue Trends</CardTitle>
                            <CardDescription>Monthly collections vs expenses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis 
                                            axisLine={false}
                                            tickLine={false}
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
                                        <Line 
                                            type="monotone" 
                                            dataKey="expenses" 
                                            name="Expenses" 
                                            stroke="#3B82F6" 
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Methods */}
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
                                            data={paymentData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {paymentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value}%`, '']} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-6 space-y-3">
                                    {paymentData.map((item, index) => (
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

                {/* Quick Actions */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col h-full">
                                        <div className="p-3 rounded-lg bg-blue-50 w-fit mb-4">
                                            <action.icon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h3 className="font-medium text-lg mb-1">{action.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{action.description}</p>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="mt-auto w-fit"
                                            onClick={action.action}
                                        >
                                            Generate
                                            <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
