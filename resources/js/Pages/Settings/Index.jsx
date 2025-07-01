import { Head, useForm } from '@inertiajs/react';
import { Bell, CreditCard, Home, Save, Shield, Send, XCircle } from 'lucide-react';

import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import AppLayout from '@/Layouts/AppLayout';

export default function SettingsPage({ settings = {}, notifications = [] }) {
    const appData = useForm({ app_name: settings.app_name || 'Kodipap', support_email: settings.support_email || '', mpesa_enabled: settings.mpesa_enabled || false });
    const propertyData = useForm({ name: settings.property_name || '', address: settings.property_address || '', total_units: settings.total_units || 0 });
    const notificationData = useForm({ payment_notifications: settings.payment_notifications || false, overdue_reminders: settings.overdue_reminders || false, sms_notifications: settings.sms_notifications || false, email_notifications: settings.email_notifications || false });
    const paymentData = useForm({ mpesa_shortcode: settings.mpesa_shortcode || '', mpesa_passkey: '', mpesa_consumer_key: '', mpesa_consumer_secret: '' });
    const securityData = useForm({ current_password: '', new_password: '', new_password_confirmation: '' });
    const submit = (form, routeName) => (e) => { e.preventDefault(); form.post(route(routeName), { preserveScroll: true }); };
    const handleSecuritySubmit = (e) => {
        e.preventDefault();
        securityData.post(route('password.update'), { preserveScroll: true, onSuccess: () => securityData.reset() });
    };

    const getStatusBadgeVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'sent':
                return 'default';
            case 'failed':
                return 'destructive';
            case 'pending':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const FormCard = ({ title, description, form, onSubmit, children, icon: Icon }) => (
        <Card>
            <CardHeader><div className="flex items-center space-x-2">{Icon && <Icon className="h-5 w-5 text-primary" />}<CardTitle>{title}</CardTitle></div>{description && <CardDescription>{description}</CardDescription>}</CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">{children}</CardContent>
                <CardFooter><Button type="submit" disabled={form.processing}><Save className="mr-2 h-4 w-4" />{form.processing ? 'Saving...' : 'Save'}</Button></CardFooter>
            </form>
        </Card>
    );

    const FormInput = ({ form, name, label, type = 'text' }) => (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} type={type} value={form.data[name]} onChange={(e) => form.setData(name, e.target.value)} />
            {form.errors[name] && <p className="text-sm text-red-500 mt-1">{form.errors[name]}</p>}
        </div>
    );

    const FormSwitch = ({ form, name, label, description }) => (
        <div className="flex items-center justify-between pt-2">
            <Label htmlFor={name} className="flex flex-col space-y-1"><span>{label}</span><span className="font-normal leading-snug text-muted-foreground">{description}</span></Label>
            <Switch id={name} checked={form.data[name]} onCheckedChange={(checked) => form.setData(name, checked)} />
        </div>
    );

    return (
        <AppLayout>
            <Head title="Settings" />
            <div className="">
                <div className="mb-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Manage your settings.</p></div>
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <FormCard title="Application" description="General application settings." form={appData} onSubmit={submit(appData, 'settings.app.update')}>
                            <FormInput form={appData} name="app_name" label="App Name" />
                            <FormInput form={appData} name="support_email" label="Support Email" type="email" />
                            <FormSwitch form={appData} name="mpesa_enabled" label="MPESA Service" description="Enable MPESA payments." />
                        </FormCard>
                        <FormCard title="Property Info" description="Update property details." form={propertyData} onSubmit={submit(propertyData, 'settings.property.update')} icon={Home}>
                            <FormInput form={propertyData} name="name" label="Property Name" />
                            <FormInput form={propertyData} name="address" label="Address" />
                            <FormInput form={propertyData} name="total_units" label="Total Units" type="number" />
                        </FormCard>
                        <FormCard title="Notifications" description="Manage notifications." form={notificationData} onSubmit={submit(notificationData, 'settings.notifications.update')} icon={Bell}>
                            <FormSwitch form={notificationData} name="payment_notifications" label="Payment Alerts" description="Alerts for new payments." />
                            <FormSwitch form={notificationData} name="overdue_reminders" label="Overdue Reminders" description="Automatic overdue reminders." />
                            <FormSwitch form={notificationData} name="sms_notifications" label="SMS Notifications" description="Enable SMS alerts." />
                            <FormSwitch form={notificationData} name="email_notifications" label="Email Notifications" description="Enable email alerts." />
                        </FormCard>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormCard title="Payment Integration" description="Configure M-Pesa details." form={paymentData} onSubmit={submit(paymentData, 'settings.payment.update')} icon={CreditCard}>
                            <FormInput form={paymentData} name="mpesa_shortcode" label="Shortcode" />
                            <FormInput form={paymentData} name="mpesa_passkey" label="Passkey" type="password" />
                            <FormInput form={paymentData} name="mpesa_consumer_key" label="Consumer Key" type="password" />
                            <FormInput form={paymentData} name="mpesa_consumer_secret" label="Consumer Secret" type="password" />
                        </FormCard>
                        <FormCard title="Security" description="Change account password." form={securityData} onSubmit={handleSecuritySubmit} icon={Shield}>
                            <FormInput form={securityData} name="current_password" label="Current Password" type="password" />
                            <FormInput form={securityData} name="new_password" label="New Password" type="password" />
                            <FormInput form={securityData} name="new_password_confirmation" label="Confirm New Password" type="password" />
                        </FormCard>
                    </div>
                    <Card>
                        <CardHeader><CardTitle>Sent Notifications</CardTitle><CardDescription>A log of all sent notifications.</CardDescription></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Message</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <TableRow key={notification.id}>
                                                <TableCell className="font-medium">{notification.message}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(notification.status)} className="capitalize">
                                                        {notification.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(notification.created_at).toLocaleString()}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="outline" size="sm" disabled={notification.status === 'Pending'}>
                                                        <Send className="h-4 w-4 mr-1" />
                                                        Resend
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" disabled={notification.status !== 'Pending'}>
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Cancel
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan="4" className="text-center text-muted-foreground py-4">
                                                No notifications found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
