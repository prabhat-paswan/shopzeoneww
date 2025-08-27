import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const VendorStore: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Store</h1>
        <p className="text-gray-600 mt-2">Manage your store profile and settings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Store Profile</CardTitle>
          <CardDescription>Update your store information and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Store management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorStore;
