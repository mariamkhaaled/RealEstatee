import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-8 sm:p-10 rounded-2xl shadow-custom border border-border">
        <div className="text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Home className="text-primary" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground">Welcome Back</h2>
          <p className="mt-2 text-muted-foreground">Sign in to your EstateAura account</p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
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
                  autoComplete="current-password" 
                  required 
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-lg text-foreground bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-border rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-custom transition-colors">
              Sign In
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;