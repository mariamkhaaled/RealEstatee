import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Lock, User, Building } from 'lucide-react';

const Register: React.FC = () => {
  const [role, setRole] = useState<'Customer' | 'Owner'>('Customer');

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-8 sm:p-10 rounded-2xl shadow-custom border border-border">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground">Create Account</h2>
          <p className="mt-2 text-muted-foreground">Join EstateAura to find or list properties</p>
        </div>

        <div className="flex p-1 bg-secondary rounded-lg border border-border">
          <button 
            onClick={() => setRole('Customer')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${role === 'Customer' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            I am looking to buy/rent
          </button>
          <button 
            onClick={() => setRole('Owner')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${role === 'Owner' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            I am a property owner
          </button>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  required 
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-lg text-foreground bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" 
                  placeholder="John Doe" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-lg text-foreground bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" 
                  placeholder="you@example.com" 
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-lg text-foreground bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-custom transition-colors">
              Create {role} Account
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;