import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, LogIn, AlertCircle, ShieldQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log('AuthPage loaded');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    // Basic validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    console.log('Login attempt:', { email, password });
    // Mock login success
    // In a real app, you would call an API
    if (email === "user@example.com" && password === "password123") {
      setSuccessMessage("Login successful! Redirecting...");
      // Store auth token, user info in context/localStorage
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (!email || !password || !confirmPassword) {
      setError("All fields are required for registration.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    console.log('Registration attempt:', { email, password, userType });
    // Mock registration success
    setSuccessMessage(`Registration successful as ${userType}! Please log in.`);
    // In a real app, you would call an API and likely redirect or clear form
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 p-4">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login"><LogIn className="mr-2 h-4 w-4" /> Login</TabsTrigger>
          <TabsTrigger value="register"><UserPlus className="mr-2 h-4 w-4" /> Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-blue-700">Welcome Back!</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {successMessage && (
                  <Alert variant="default" className="bg-green-100 border-green-300 text-green-700">
                     <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-1">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" placeholder="password123" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
                <Button variant="link" size="sm" className="text-blue-600">
                  <ShieldQuestion className="mr-2 h-4 w-4" /> Forgot Password?
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-blue-700">Create Account</CardTitle>
              <CardDescription className="text-center">Join us to manage your health efficiently.</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {successMessage && (
                  <Alert variant="default" className="bg-green-100 border-green-300 text-green-700">
                     <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-1">
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-password">Password</Label>
                  <Input id="register-password" type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label>Register as:</Label>
                  <div className="flex gap-4">
                    <Button type="button" variant={userType === 'patient' ? 'default' : 'outline'} onClick={() => setUserType('patient')} className={userType === 'patient' ? 'bg-blue-500' : ''}>Patient</Button>
                    <Button type="button" variant={userType === 'doctor' ? 'default' : 'outline'} onClick={() => setUserType('doctor')} className={userType === 'doctor' ? 'bg-blue-500' : ''}>Doctor</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="mr-2 h-4 w-4" /> Register
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;