import { Head, useForm } from '@inertiajs/react';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { Textarea } from '@/Components/ui/textarea';
import { toast } from 'react-toastify';

import {
    Bell,
    CreditCard,
    Home,
    Save,
    Send,
} from 'lucide-react';

import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import AppLayout from '@/Layouts/AppLayout';

export default function SettingsPage({ settings = {}, notifications = [], tenants }) {

    const [openBulkSms, setOpenBulkSms] = useState(false);

    const bulkSmsForm = useForm({
        user_ids: [],
        message: '',
    });


    const appData = useForm({
        app_name: settings.app_name || '',
        app_url: settings.app_url || '',
        support_email: settings.support_email || '',
        currency: settings.currency || '',
        timezone: settings.timezone || ''
    });

    const propertyData = useForm({
        property_name: settings.property_name || '',
        property_address: settings.property_address || '',
        property_units: settings.property_units || '',
        bank_account: settings.bank_account || '',
        default_rent_due_day: settings.default_rent_due_day || ''
    });

    const notificationData = useForm({
        enable_auto_reconcile: settings.enable_auto_reconcile === 'true',
        enable_email_notifications: settings.enable_email_notifications === 'true',
        enable_sms_notifications: settings.enable_sms_notifications === 'true',
        sms_due_reminder: settings.sms_due_reminder || '',
        sms_payment_thankyou: settings.sms_payment_thankyou || '',
        sms_partial_payment: settings.sms_partial_payment || '',
        sms_overdue_notice: settings.sms_overdue_notice || '',
        sms_welcome_tenant: settings.sms_welcome_tenant || ''
    });

    const paymentData = useForm({
        mpesa_short_code: settings['mpesa.short_code'] || '',
        mpesa_passkey: settings['mpesa.passkey'] || '',
        mpesa_consumer_key: settings['mpesa.consumer_key'] || '',
        mpesa_consumer_secret: settings['mpesa.consumer_secret'] || '',
        mpesa_base_url: settings['mpesa.base_url'] || '',
        mpesa_initiator: settings['mpesa.initiator'] || '',
        mpesa_security_credential: settings['mpesa.security_credential'] || '',
        mpesa_timeout_url: settings['mpesa.timeout_url'] || '',
        mpesa_result_url: settings['mpesa.result_url'] || ''
    });

    const submit = (form, routeName) => async (e) => {
        e.preventDefault();
    
        const invalid = Object.entries(form.data).some(([_, value]) => {
            return typeof value !== 'boolean' && (!value || value.toString().trim() === '');
        });
    
        if (invalid) {
            toast.error('Please fill all required fields correctly.');
            return;
        }
    
        const confirmed = confirm('Are you sure you want to save these settings?');
        if (!confirmed) return;
    
        form.post(route(routeName), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Settings updated successfully.');
            },
            onError: () => {
                toast.error('Validation failed. Please check your inputs.');
            },
            onFinish: () => {
                // Optionally handle cleanup if needed
            },
        });
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
            <CardHeader>
                <div className="flex items-center space-x-2">
                    {Icon && <Icon className="h-5 w-5 text-primary" />}
                    <CardTitle>{title}</CardTitle>
                </div>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">{children}</CardContent>
                <CardFooter>
                    <Button type="submit" disabled={form.processing}>
                        <Save className="mr-2 h-4 w-4" />
                        {form.processing ? 'Saving...' : 'Save'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );

    const FormInput = ({ form, name, label, type = 'text' }) => (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                type={type}
                value={form.data[name] ?? ''}
                onChange={(e) => form.setData(name, e.target.value)}
            />
            {form.errors[name] && (
                <p className="text-sm text-red-500 mt-1">{form.errors[name]}</p>
            )}
        </div>
    );

    const FormSwitch = ({ form, name, label, description }) => (
        <div className="flex items-center justify-between pt-2">
            <Label htmlFor={name} className="flex flex-col space-y-1">
                <span>{label}</span>
                <span className="font-normal leading-snug text-muted-foreground">{description}</span>
            </Label>
            <Switch id={name} checked={form.data[name]} onCheckedChange={(checked) => form.setData(name, checked)} />
        </div>
    );

    const sendBulkSms = (e) => {
        e.preventDefault();
        bulkSmsForm.post(route('notifications.send.bulk'), {
            preserveScroll: true,
            onSuccess: () => {
                setOpenBulkSms(false);
                bulkSmsForm.reset();
                toast.success('Bulk SMS queued');
            },
            onError: () => {
                toast.error('Failed to send bulk SMS.');
            },
        });
    };

    const resendNotification = (id) => {
        if (!confirm('Re-send this failed notification?')) return;

        router.visit(route('notifications.resend', id), {
            method: 'post',
            preserveScroll: true,
            onSuccess: () => toast.success('Notification requeued.'),
            onError: () => toast.error('Failed to requeue notification.'),
        });
    };

    return (
        <AppLayout>
            <Head title="Settings" />
            <div>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Settings</h1>
                        <p className="text-muted-foreground">Manage your settings.</p>
                    </div>
                    <Button onClick={() => setOpenBulkSms(true)}>Send Bulk SMS</Button>
                </div>

                <Dialog open={openBulkSms} onOpenChange={setOpenBulkSms}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Send Bulk SMS</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={sendBulkSms} className="space-y-4">
                            <div>
                                <Label>Tenants</Label>
                                <select
                                    multiple
                                    value={bulkSmsForm.data.user_ids}
                                    onChange={(e) =>
                                        bulkSmsForm.setData(
                                            'user_ids',
                                            Array.from(e.target.selectedOptions).map((opt) => opt.value)
                                        )
                                    }
                                    className="w-full h-32 border rounded p-2"
                                >
                                    {tenants.map((tenant) => (
                                        <option key={tenant.id} value={tenant.id}>
                                            {tenant.name}
                                        </option>
                                    ))}
                                </select>
                                {bulkSmsForm.errors.user_ids && (
                                    <p className="text-sm text-red-500 mt-1">{bulkSmsForm.errors.user_ids}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    maxLength={144}
                                    value={bulkSmsForm.data.message}
                                    onChange={(e) => bulkSmsForm.setData('message', e.target.value)}
                                />
                                {bulkSmsForm.errors.message && (
                                    <p className="text-sm text-red-500 mt-1">{bulkSmsForm.errors.message}</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={bulkSmsForm.processing}>
                                    {bulkSmsForm.processing ? 'Sending...' : 'Send'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <div className="space-y-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormCard title="Application" description="General application settings." form={appData} onSubmit={submit(appData, 'settings.app.update')}>
                            <FormInput form={appData} name="app_name" label="App Name" />
                            <FormInput form={appData} name="app_url" label="App URL" />
                            <FormInput form={appData} name="support_email" label="Support Email" type="email" />
                            <FormInput form={appData} name="currency" label="Currency" />
                            <FormInput form={appData} name="timezone" label="Timezone" />
                        </FormCard>

                        <FormCard title="Property Info" description="Update property details." form={propertyData} onSubmit={submit(propertyData, 'settings.property.update')} icon={Home}>
                            <FormInput form={propertyData} name="property_name" label="Property Name" />
                            <FormInput form={propertyData} name="property_address" label="Address" />
                            <FormInput form={propertyData} name="property_units" label="Total Units" type="number" />
                            <FormInput form={propertyData} name="bank_account" label="Bank Account" />
                            <FormInput form={propertyData} name="default_rent_due_day" label="Rent Due Day" type="number" />
                        </FormCard>

                        <FormCard title="Notifications" description="Manage notifications and templates." form={notificationData} onSubmit={submit(notificationData, 'settings.notifications.update')} icon={Bell}>
                            <FormSwitch form={notificationData} name="enable_auto_reconcile" label="Auto Reconcile" description="Enable auto reconciliation of rent." />
                            <FormSwitch form={notificationData} name="enable_email_notifications" label="Email Notifications" description="Enable sending email alerts." />
                            <FormSwitch form={notificationData} name="enable_sms_notifications" label="SMS Notifications" description="Enable sending SMS messages." />
                            <FormInput form={notificationData} name="sms_due_reminder" label="SMS Due Reminder" />
                            <FormInput form={notificationData} name="sms_payment_thankyou" label="Payment Thank You SMS" />
                            <FormInput form={notificationData} name="sms_partial_payment" label="Partial Payment SMS" />
                            <FormInput form={notificationData} name="sms_overdue_notice" label="Overdue Notice SMS" />
                            <FormInput form={notificationData} name="sms_welcome_tenant" label="Welcome Tenant SMS" />
                        </FormCard>

                        <FormCard title="Payment Integration" description="Configure M-Pesa integration settings." form={paymentData} onSubmit={submit(paymentData, 'settings.payment.update')} icon={CreditCard}>
                            <FormInput form={paymentData} name="mpesa_short_code" label="Short Code" />
                            <FormInput form={paymentData} name="mpesa_passkey" label="Passkey" type="password" />
                            <FormInput form={paymentData} name="mpesa_consumer_key" label="Consumer Key" type="password" />
                            <FormInput form={paymentData} name="mpesa_consumer_secret" label="Consumer Secret" type="password" />
                            <FormInput form={paymentData} name="mpesa_base_url" label="Base URL" />
                            <FormInput form={paymentData} name="mpesa_initiator" label="Initiator" />
                            <FormInput form={paymentData} name="mpesa_security_credential" label="Security Credential" type="password" />
                            <FormInput form={paymentData} name="mpesa_timeout_url" label="Timeout URL" />
                            <FormInput form={paymentData} name="mpesa_result_url" label="Result URL" />
                        </FormCard>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sent Notifications</CardTitle>
                            <CardDescription>A log of all sent notifications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Message</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
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
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={notification.status !== 'failed'}
                                                        onClick={() => resendNotification(notification.id)}
                                                    >
                                                        <Send className="h-4 w-4 mr-1" />
                                                        Resend
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