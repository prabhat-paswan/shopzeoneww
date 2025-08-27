import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CustomerProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details and account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Profile management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProfile;
