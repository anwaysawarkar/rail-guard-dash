import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Train, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/railway';
import heroImage from '@/assets/railway-control-hero.jpg';

const LoginPage: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login } = useAuth();

  const handleLogin = () => {
    if (name.trim() && selectedRole) {
      login(name.trim(), selectedRole);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-primary flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.9)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white/10 p-3 rounded-xl">
              <Train className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Railway Control</h1>
          </div>
          <p className="text-white/80">Traffic Management System</p>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">System Access</CardTitle>
            <CardDescription>Select your role to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="transition-all duration-200 focus:shadow-control"
              />
            </div>

            <div className="space-y-3">
              <Label>Role Selection</Label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setSelectedRole('government')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedRole === 'government'
                      ? 'border-primary bg-primary/5 shadow-control'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${
                      selectedRole === 'government' ? 'bg-primary text-white' : 'bg-muted'
                    }`}>
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Government Official</h3>
                      <p className="text-sm text-muted-foreground">View train operations and status</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedRole('controller')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedRole === 'controller'
                      ? 'border-primary bg-primary/5 shadow-control'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${
                      selectedRole === 'controller' ? 'bg-primary text-white' : 'bg-muted'
                    }`}>
                      <Train className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Section Controller</h3>
                      <p className="text-sm text-muted-foreground">Monitor and control train signals</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={!name.trim() || !selectedRole}
              variant="control"
              size="lg"
              className="w-full"
            >
              Access Control System
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;