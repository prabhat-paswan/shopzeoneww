import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ResetPassword: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Set new password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p className="text-gray-600">Password reset functionality coming soon...</p>
          <Button asChild className="w-full">
            <Link to="/auth/login">Back to Login</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
