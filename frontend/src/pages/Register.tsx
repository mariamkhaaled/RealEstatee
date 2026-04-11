import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home } from 'lucide-react';

const Register: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-custom border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Home className="text-primary-foreground" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Create an Account</h2>
          <p className="text-muted-foreground mt-2">Join us to find or list your properties</p>
        </div>

        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
              <Input placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
              <Input placeholder="Doe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
            <Input type="email" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">I want to</label>
            <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary">
              <option>Browse properties (Customer)</option>
              <option>List my properties (Owner)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>

          <Button className="w-full py-6 text-base font-semibold">Register</Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;