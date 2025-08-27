import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminStores: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
        <p className="text-gray-600 mt-2">Manage vendor stores and their settings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Stores Overview</CardTitle>
          <CardDescription>Manage vendor stores, approvals, and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Store management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStores;
