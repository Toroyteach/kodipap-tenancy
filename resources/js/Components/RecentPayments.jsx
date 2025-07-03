import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { CreditCard, Smartphone } from 'lucide-react';

const RecentPayments = () => {
  const { recent_payments } = usePage().props;

  const getPaymentIcon = (method) => {
    switch ((method || '').toLowerCase()) {
      case 'mpesa':
      case 'm-pesa':
        return <Smartphone className="h-6 w-6 text-green-500" />;
      case 'bank':
        return <CreditCard className="h-6 w-6 text-blue-500" />;
      default:
        return <CreditCard className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-KE')} at ${date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Payments</CardTitle>
          <p className="text-sm text-gray-500">Latest rent collections</p>
        </div>
        <Link href="/payments">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recent_payments?.map((payment) => (
            <li key={payment.id} className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded-md">
                {getPaymentIcon(payment.method)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{payment.lease?.tenant?.name || 'Unknown Tenant'}</p>
                <p className="text-sm text-gray-500">
                  {`${payment.lease?.unit?.unit_number || 'N/A'}, ${formatDateTime(payment.payment_date)}`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">KSH {Number(payment.amount).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentPayments;