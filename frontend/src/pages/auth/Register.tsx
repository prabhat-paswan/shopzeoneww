import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Register: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create account</CardTitle>
        <CardDescription className="text-center">
          Sign up for a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p className="text-gray-600">Registration functionality coming soon...</p>
          <Button asChild className="w-full">
            <Link to="/auth/login">Back to Login</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Register;
