import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-2">Configure platform settings and integrations</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Settings Overview</CardTitle>
          <CardDescription>Business settings, system configuration, and third-party integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Settings functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
