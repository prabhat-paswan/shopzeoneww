import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const VendorProducts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
        <p className="text-gray-600 mt-2">Manage your product catalog</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Products Overview</CardTitle>
          <CardDescription>Add, edit, and manage your products</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Product management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorProducts;
