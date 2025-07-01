import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { CreditCard, Smartphone } from 'lucide-react';

const RecentPayments = () => {
  const payments = [
    {
      id: '1',
      tenant: 'Mary Wanjiku',
      unit: 'Unit A-101',
      amount: 25000,
      method: 'M-Pesa',
      status: 'completed',
      date: '2024-01-15 at 14:30'
    },
    {
      id: '2',
      tenant: 'James Mwangi',
      unit: 'Unit B-205',
      amount: 30000,
      method: 'Bank',
      status: 'completed',
      date: '2024-01-15 at 10:15'
    },
    {
      id: '3',
      tenant: 'Grace Akinyi',
      unit: 'Unit C-302',
      amount: 22000,
      method: 'M-Pesa',
      status: 'pending',
      date: '2024-01-15 at 09:45'
    },
    {
      id: '4',
      tenant: 'Peter Otieno',
      unit: 'Unit A-104',
      amount: 28000,
      method: 'Bank',
      status: 'completed',
      date: '2024-01-14 at 16:20'
    }
  ];

  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'm-pesa':
        return <Smartphone className="h-6 w-6 text-green-500" />;
      case 'bank':
        return <CreditCard className="h-6 w-6 text-blue-500" />;
      default:
        return <CreditCard className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    switch (status) {
      case 'completed':
        return <Badge variant="default">{statusText}</Badge>;
      case 'pending':
        return <Badge variant="warning">{statusText}</Badge>;
      default:
        return <Badge variant="outline">{statusText}</Badge>;
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Latest rent collections</p>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {payments.map((payment) => (
            <li key={payment.id} className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded-md">
                {getPaymentIcon(payment.method)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{payment.tenant}</p>
                <p className="text-sm text-gray-500">{`${payment.unit}, ${payment.date}`}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{`KSH ${payment.amount.toLocaleString()}`}</p>
                {getStatusBadge(payment.status)}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentPayments;
