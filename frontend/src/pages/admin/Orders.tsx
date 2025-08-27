import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminOrders: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">Manage orders, POS, and refund requests</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Orders Overview</CardTitle>
          <CardDescription>Manage orders, POS system, and refund requests</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Order management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
