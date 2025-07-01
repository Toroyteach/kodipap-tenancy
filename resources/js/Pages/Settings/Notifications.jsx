import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { MoreHorizontal, RefreshCw, CheckCircle2, XCircle, Clock, Mail, Bell, AlertCircle, ArrowUpDown } from 'lucide-react';

const statuses = {
    sent: { label: 'Sent', color: 'bg-green-100 text-green-800' },
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
};

const notificationTypes = {
    email: { icon: Mail, color: 'text-blue-500' },
    sms: { icon: Bell, color: 'text-green-500' },
    alert: { icon: AlertCircle, color: 'text-amber-500' },
};

const Notifications = ({ notifications = [] }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Sort notifications
    const sortedNotifications = [...notifications].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Handle sort
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Toggle select all notifications
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(notifications.map(n => n.id));
        }
        setSelectAll(!selectAll);
    };

    // Toggle single notification selection
    const toggleNotificationSelection = (id) => {
        setSelectedNotifications(prev => 
            prev.includes(id)
                ? prev.filter(notificationId => notificationId !== id)
                : [...prev, id]
        );
    };

    // Handle bulk actions
    const handleBulkAction = (action) => {
        // Implement bulk action logic here
        console.log(`Performing ${action} on:`, selectedNotifications);
        // Reset selection after action
        setSelectedNotifications([]);
        setSelectAll(false);
    };

    // Handle single action
    const handleAction = (id, action) => {
        // Implement single action logic here
        console.log(`Performing ${action} on notification:`, id);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'sent':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-yellow-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <Head title="Notifications" />
            
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
                    <p className="text-muted-foreground">
                        Manage your notification history and preferences
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="ml-auto h-8">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Notification History</CardTitle>
                            <CardDescription>
                                {notifications.length} total notifications
                            </CardDescription>
                        </div>
                        {selectedNotifications.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">
                                    {selectedNotifications.length} selected
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            Actions
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleBulkAction('resend')}>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Resend Selected
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => handleBulkAction('delete')}
                                            className="text-red-600"
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Delete Selected
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                        />
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <button 
                                        className="flex items-center hover:text-blue-600"
                                        onClick={() => handleSort('subject')}
                                    >
                                        Subject
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </button>
                                </TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead>
                                    <button 
                                        className="flex items-center hover:text-blue-600"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        Date
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </button>
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedNotifications.length > 0 ? (
                                sortedNotifications.map((notification) => {
                                    const NotificationIcon = notificationTypes[notification.type]?.icon || Bell;
                                    const notificationColor = notificationTypes[notification.type]?.color || 'text-gray-500';
                                    const status = statuses[notification.status] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
                                    
                                    return (
                                        <TableRow key={notification.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    checked={selectedNotifications.includes(notification.id)}
                                                    onChange={() => toggleNotificationSelection(notification.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center">
                                                    <NotificationIcon className={`mr-2 h-4 w-4 ${notificationColor}`} />
                                                    {notification.subject}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {notification.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {notification.recipient}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {formatDate(notification.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {getStatusIcon(notification.status)}
                                                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleAction(notification.id, 'view')}>
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleAction(notification.id, 'resend')}
                                                            disabled={notification.status === 'pending'}
                                                        >
                                                            Resend
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleAction(notification.id, 'delete')}
                                                            className="text-red-600"
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        <div className="flex flex-col items-center justify-center py-6">
                                            <Bell className="h-12 w-12 text-gray-400 mb-2" />
                                            <h3 className="text-sm font-medium text-gray-900">No notifications</h3>
                                            <p className="text-sm text-gray-500">
                                                Get started by sending your first notification.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>
                            Customize how you receive notifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">Email Notifications</h4>
                                <p className="text-sm text-muted-foreground">Receive email notifications</p>
                            </div>
                            <Button variant="outline" size="sm">
                                Configure
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">SMS Alerts</h4>
                                <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                            </div>
                            <Button variant="outline" size="sm">
                                Configure
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">Push Notifications</h4>
                                <p className="text-sm text-muted-foreground">Enable browser notifications</p>
                            </div>
                            <Button variant="outline" size="sm">
                                Configure
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Notification Templates</CardTitle>
                        <CardDescription>
                            Manage your notification templates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <h4 className="font-medium">Payment Reminder</h4>
                                        <p className="text-sm text-muted-foreground">Sent when rent is due</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Edit Template
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <AlertCircle className="h-5 w-5 text-amber-500" />
                                    <div>
                                        <h4 className="font-medium">Maintenance Alert</h4>
                                        <p className="text-sm text-muted-foreground">For maintenance updates</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Edit Template
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Bell className="h-5 w-5 text-green-500" />
                                    <div>
                                        <h4 className="font-medium">General Announcement</h4>
                                        <p className="text-sm text-muted-foreground">For general communications</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Edit Template
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Set the layout for this page
Notifications.layout = page => <AppLayout title="Notifications" children={page} />;

export default Notifications;
