import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Building, Bell, CreditCard, Shield, Settings as SettingsIcon, Save } from 'lucide-react';

const SettingsPanel = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure your application preferences and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building className="w-5 h-5" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="property-name">Property Name</Label>
              <Input id="property-name" defaultValue="Greenview Apartments" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="123 Moi Avenue, Nairobi" />
            </div>
            <div>
              <Label htmlFor="total-units">Total Units</Label>
              <Input id="total-units" type="number" defaultValue="24" />
            </div>
            <Button className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Property Info
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Payment Notifications</Label>
                <p className="text-sm text-gray-500">Get notified when payments are received</p>
              </div>
              <Switch id="payment-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Overdue Reminders</Label>
                <p className="text-sm text-gray-500">Send automatic reminders for late payments</p>
              </div>
              <Switch id="overdue-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-gray-500">Send notifications via SMS</p>
              </div>
              <Switch id="sms-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Send notifications via email</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Payment Integration */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mpesa-shortcode">M-Pesa Business Shortcode</Label>
              <Input id="mpesa-shortcode" placeholder="Enter your M-Pesa shortcode" />
            </div>
            <div>
              <Label htmlFor="bank-account">NCBA Bank Account</Label>
              <Input id="bank-account" placeholder="Enter your bank account number" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <Label>Auto-reconciliation</Label>
                <p className="text-sm text-gray-500">Automatically match payments to tenants</p>
              </div>
              <Switch id="auto-reconciliation" defaultChecked />
            </div>
            <Button variant="outline" className="w-full">
              Configure Integrations
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Switch id="two-factor" />
            </div>
            <Button className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Update Security
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-500">Application Version</Label>
              <p className="text-lg font-semibold">v1.0.0</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Last Backup</Label>
              <p className="text-lg font-semibold">Jan 15, 2024</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Storage Used</Label>
              <p className="text-lg font-semibold">2.4 GB / 10 GB</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
