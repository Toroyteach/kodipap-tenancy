import React from 'react';
import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PaymentChart = () => {
  const { monthly_collections } = usePage().props;

  const data = monthly_collections.map(item => ({
    month: item.month,
    Collections: item.amount,
    Target: item.target,
  }));

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Monthly Collections</CardTitle>
        <p className="text-sm text-gray-500">Last 6 months performance</p>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              barGap={8}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => (value / 1000).toLocaleString()}
                width={50}
              />
              <Tooltip
                cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value, name) => [`KSH ${Number(value).toLocaleString()}`, name]}
              />
              <Bar dataKey="Collections" fill="#10b981" name="Collections" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Target" fill="#e5e7eb" name="Target" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentChart;