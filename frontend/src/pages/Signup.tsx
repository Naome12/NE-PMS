// src/pages/Signup.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/context/authContext';

export const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'ATTENDANT'>('ATTENDANT');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await signup(firstName, lastName, email, password, role);
      toast.success('Account created successfully!');
      navigate('/login'); // 👈 Always go to login after signup
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary">ParkMS</h1>
              <p className="text-gray-500 mt-2">Create Your Account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>

              <Button type="submit" className="w-full">Sign Up</Button>
            </form>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-between">
            <span className="text-xs text-gray-500">© 2025 ParkMaster</span>
            <span
              className="text-xs text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Already have an account?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
