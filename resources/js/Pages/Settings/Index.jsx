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
                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <CardTitle>Application</CardTitle>
                                </div>
                                <CardDescription>General application settings.</CardDescription>
                            </CardHeader>

                            <form onSubmit={submit(appData, 'settings.app.update')} className="space-y-6 bg-white p-6 rounded-xl shadow">
                                <div className="space-y-2">
                                    <label htmlFor="app_name" className="block text-sm font-medium text-gray-700">App Name</label>
                                    <input
                                        id="app_name"
                                        type="text"
                                        value={appData.data.app_name}
                                        onChange={(e) => appData.setData('app_name', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {appData.errors.app_name && (
                                        <p className="text-sm text-red-500">{appData.errors.app_name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="app_url" className="block text-sm font-medium text-gray-700">App URL</label>
                                    <input
                                        id="app_url"
                                        type="text"
                                        value={appData.data.app_url}
                                        onChange={(e) => appData.setData('app_url', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {appData.errors.app_url && (
                                        <p className="text-sm text-red-500">{appData.errors.app_url}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="support_email" className="block text-sm font-medium text-gray-700">Support Email</label>
                                    <input
                                        id="support_email"
                                        type="email"
                                        value={appData.data.support_email}
                                        onChange={(e) => appData.setData('support_email', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {appData.errors.support_email && (
                                        <p className="text-sm text-red-500">{appData.errors.support_email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                                    <input
                                        id="currency"
                                        type="text"
                                        value={appData.data.currency}
                                        onChange={(e) => appData.setData('currency', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {appData.errors.currency && (
                                        <p className="text-sm text-red-500">{appData.errors.currency}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                                    <input
                                        id="timezone"
                                        type="text"
                                        value={appData.data.timezone}
                                        onChange={(e) => appData.setData('timezone', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {appData.errors.timezone && (
                                        <p className="text-sm text-red-500">{appData.errors.timezone}</p>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={appData.processing}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Home className="h-5 w-5 text-primary" />
                                    <CardTitle>Property Info</CardTitle>
                                </div>
                                <CardDescription>Update property details.</CardDescription>
                            </CardHeader>

                            <form onSubmit={submit(propertyData, 'settings.property.update')} className="space-y-6 bg-white p-6 rounded-xl shadow">
                                <div className="space-y-2">
                                    <label htmlFor="property_name" className="block text-sm font-medium text-gray-700">Property Name</label>
                                    <input
                                        id="property_name"
                                        type="text"
                                        value={propertyData.data.property_name}
                                        onChange={(e) => propertyData.setData('property_name', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {propertyData.errors.property_name && (
                                        <p className="text-sm text-red-500">{propertyData.errors.property_name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="property_address" className="block text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        id="property_address"
                                        type="text"
                                        value={propertyData.data.property_address}
                                        onChange={(e) => propertyData.setData('property_address', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {propertyData.errors.property_address && (
                                        <p className="text-sm text-red-500">{propertyData.errors.property_address}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="property_units" className="block text-sm font-medium text-gray-700">Total Units</label>
                                    <input
                                        id="property_units"
                                        type="number"
                                        value={propertyData.data.property_units}
                                        onChange={(e) => propertyData.setData('property_units', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {propertyData.errors.property_units && (
                                        <p className="text-sm text-red-500">{propertyData.errors.property_units}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="bank_account" className="block text-sm font-medium text-gray-700">Bank Account</label>
                                    <input
                                        id="bank_account"
                                        type="text"
                                        value={propertyData.data.bank_account}
                                        onChange={(e) => propertyData.setData('bank_account', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {propertyData.errors.bank_account && (
                                        <p className="text-sm text-red-500">{propertyData.errors.bank_account}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="default_rent_due_day" className="block text-sm font-medium text-gray-700">Rent Due Day</label>
                                    <input
                                        id="default_rent_due_day"
                                        type="number"
                                        value={propertyData.data.default_rent_due_day}
                                        onChange={(e) => propertyData.setData('default_rent_due_day', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {propertyData.errors.default_rent_due_day && (
                                        <p className="text-sm text-red-500">{propertyData.errors.default_rent_due_day}</p>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={propertyData.processing}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Bell className="h-5 w-5 text-primary" />
                                    <CardTitle>Notifications</CardTitle>
                                </div>
                                <CardDescription>Manage notifications and templates.</CardDescription>
                            </CardHeader>

                            <form onSubmit={submit(notificationData, 'settings.notifications.update')} className="space-y-6 bg-white p-6 rounded-xl shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label htmlFor="enable_auto_reconcile" className="block text-sm font-medium text-gray-700">Auto Reconcile</label>
                                        <p className="text-sm text-gray-500">Enable auto reconciliation of rent.</p>
                                    </div>
                                    <input
                                        id="enable_auto_reconcile"
                                        type="checkbox"
                                        checked={notificationData.data.enable_auto_reconcile}
                                        onChange={(e) => notificationData.setData('enable_auto_reconcile', e.target.checked)}
                                        className="h-5 w-10 rounded-full border-gray-300 text-primary focus:ring focus:ring-primary"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label htmlFor="enable_email_notifications" className="block text-sm font-medium text-gray-700">Email Notifications</label>
                                        <p className="text-sm text-gray-500">Enable sending email alerts.</p>
                                    </div>
                                    <input
                                        id="enable_email_notifications"
                                        type="checkbox"
                                        checked={notificationData.data.enable_email_notifications}
                                        onChange={(e) => notificationData.setData('enable_email_notifications', e.target.checked)}
                                        className="h-5 w-10 rounded-full border-gray-300 text-primary focus:ring focus:ring-primary"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label htmlFor="enable_sms_notifications" className="block text-sm font-medium text-gray-700">SMS Notifications</label>
                                        <p className="text-sm text-gray-500">Enable sending SMS messages.</p>
                                    </div>
                                    <input
                                        id="enable_sms_notifications"
                                        type="checkbox"
                                        checked={notificationData.data.enable_sms_notifications}
                                        onChange={(e) => notificationData.setData('enable_sms_notifications', e.target.checked)}
                                        className="h-5 w-10 rounded-full border-gray-300 text-primary focus:ring focus:ring-primary"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="sms_due_reminder" className="block text-sm font-medium text-gray-700">SMS Due Reminder</label>
                                    <input
                                        id="sms_due_reminder"
                                        type="text"
                                        value={notificationData.data.sms_due_reminder}
                                        onChange={(e) => notificationData.setData('sms_due_reminder', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {notificationData.errors.sms_due_reminder && (
                                        <p className="text-sm text-red-500">{notificationData.errors.sms_due_reminder}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="sms_payment_thankyou" className="block text-sm font-medium text-gray-700">Payment Thank You SMS</label>
                                    <input
                                        id="sms_payment_thankyou"
                                        type="text"
                                        value={notificationData.data.sms_payment_thankyou}
                                        onChange={(e) => notificationData.setData('sms_payment_thankyou', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {notificationData.errors.sms_payment_thankyou && (
                                        <p className="text-sm text-red-500">{notificationData.errors.sms_payment_thankyou}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="sms_partial_payment" className="block text-sm font-medium text-gray-700">Partial Payment SMS</label>
                                    <input
                                        id="sms_partial_payment"
                                        type="text"
                                        value={notificationData.data.sms_partial_payment}
                                        onChange={(e) => notificationData.setData('sms_partial_payment', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {notificationData.errors.sms_partial_payment && (
                                        <p className="text-sm text-red-500">{notificationData.errors.sms_partial_payment}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="sms_overdue_notice" className="block text-sm font-medium text-gray-700">Overdue Notice SMS</label>
                                    <input
                                        id="sms_overdue_notice"
                                        type="text"
                                        value={notificationData.data.sms_overdue_notice}
                                        onChange={(e) => notificationData.setData('sms_overdue_notice', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {notificationData.errors.sms_overdue_notice && (
                                        <p className="text-sm text-red-500">{notificationData.errors.sms_overdue_notice}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="sms_welcome_tenant" className="block text-sm font-medium text-gray-700">Welcome Tenant SMS</label>
                                    <input
                                        id="sms_welcome_tenant"
                                        type="text"
                                        value={notificationData.data.sms_welcome_tenant}
                                        onChange={(e) => notificationData.setData('sms_welcome_tenant', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {notificationData.errors.sms_welcome_tenant && (
                                        <p className="text-sm text-red-500">{notificationData.errors.sms_welcome_tenant}</p>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={notificationData.processing}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    <CardTitle>Payment Integration</CardTitle>
                                </div>
                                <CardDescription>Configure M-Pesa integration settings.</CardDescription>
                            </CardHeader>

                            <form onSubmit={submit(paymentData, 'settings.payment.update')} className="space-y-6 bg-white p-6 rounded-xl shadow">
                                <div className="space-y-2">
                                    <label htmlFor="mpesa_short_code" className="block text-sm font-medium text-gray-700">Short Code</label>
                                    <input
                                        id="mpesa_short_code"
                                        type="text"
                                        value={paymentData.data.mpesa_short_code}
                                        onChange={(e) => paymentData.setData('mpesa_short_code', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {paymentData.errors.mpesa_short_code && (
                                        <p className="text-sm text-red-500">{paymentData.errors.mpesa_short_code}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="mpesa_passkey" className="block text-sm font-medium text-gray-700">Passkey</label>
                                    <input
                                        id="mpesa_passkey"
                                        type="password"
                                        value={paymentData.data.mpesa_passkey}
                                        onChange={(e) => paymentData.setData('mpesa_passkey', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {paymentData.errors.mpesa_passkey && (
                                        <p className="text-sm text-red-500">{paymentData.errors.mpesa_passkey}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="mpesa_consumer_key" className="block text-sm font-medium text-gray-700">Consumer Key</label>
                                    <input
                                        id="mpesa_consumer_key"
                                        type="password"
                                        value={paymentData.data.mpesa_consumer_key}
                                        onChange={(e) => paymentData.setData('mpesa_consumer_key', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {paymentData.errors.mpesa_consumer_key && (
                                        <p className="text-sm text-red-500">{paymentData.errors.mpesa_consumer_key}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="mpesa_consumer_secret" className="block text-sm font-medium text-gray-700">Consumer Secret</label>
                                    <input
                                        id="mpesa_consumer_secret"
                                        type="password"
                                        value={paymentData.data.mpesa_consumer_secret}
                                        onChange={(e) => paymentData.setData('mpesa_consumer_secret', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {paymentData.errors.mpesa_consumer_secret && (
                                        <p className="text-sm text-red-500">{paymentData.errors.mpesa_consumer_secret}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="mpesa_base_url" className="block text-sm font-medium text-gray-700">Base URL</label>
                                    <input
                                        id="mpesa_base_url"
                                        type="text"
                                        value={paymentData.data.mpesa_base_url}
                                        onChange={(e) => paymentData.setData('mpesa_base_url', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {paymentData.errors.mpesa_base_url && (
                                        <p className="text-sm text-red-500">{paymentData.errors.mpesa_base_url}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="mpesa_initiator" className="block text-sm font-medium text-gray-700">Initiator</label>
                                    <input
                                        id="mpesa_initiator"
                                        type="text"
                                        value={paymentData.data.mpesa_initiator}
                                        onChange={(e) => paymentData.setData('mpesa_initiator', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {paymentData.errors.mpesa_initiator && (
                                        <p className="text-sm text-red-500">{paymentData.errors.mpesa_initiator}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="mpesa_security_credential" className="block text-sm font-medium text-gray-700">Security Credential</label>
                                    <input
                                        id="mpesa_security_credential"
                                        type="password"
                                        value={paymentData.data.mpesa_security_credential}
                                        onChange={(e) => paymentData.setData('mpesa_security_credential', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {paymentData.errors.mpesa_security_credential && (
                                        <p className="text-sm text-red-500">{paymentData.errors.mpesa_security_credential}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="mpesa_timeout_url" className="block text-sm font-medium text-gray-700">Timeout URL</label>
                                    <input
                                        id="mpesa_timeout_url"
                                        type="text"
                                        value={paymentData.data.mpesa_timeout_url}
                                        onChange={(e) => paymentData.setData('mpesa_timeout_url', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {paymentData.errors.mpesa_timeout_url && (
                                        <p className="text-sm text-red-500">{paymentData.errors.mpesa_timeout_url}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="mpesa_result_url" className="block text-sm font-medium text-gray-700">Result URL</label>
                                    <input
                                        id="mpesa_result_url"
                                        type="text"
                                        value={paymentData.data.mpesa_result_url}
                                        onChange={(e) => paymentData.setData('mpesa_result_url', e.target.value)}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
                                    />
                                    {paymentData.errors.mpesa_result_url && (
                                        <p className="text-sm text-red-500">{paymentData.errors.mpesa_result_url}</p>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={paymentData.processing}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </Card>
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