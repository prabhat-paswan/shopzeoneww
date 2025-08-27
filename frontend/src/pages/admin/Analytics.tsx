import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-2">View detailed analytics and generate reports</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>Sales reports, product analytics, and business insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Analytics functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
