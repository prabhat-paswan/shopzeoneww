import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminUsers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage all users across the platform</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users Overview</CardTitle>
          <CardDescription>Manage customers, vendors, delivery men, and employees</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">User management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
