import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext"; //

type Role = "ADMIN" | "OPERATOR" | "USER";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      await login(email, password); //
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
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
              <p className="text-gray-500 mt-2">Parking Management System</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email Address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Password"
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <p className="text-sm text-center text-gray-600 mt-4">
              Don’t have an account?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </p>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-between">
            <span className="text-xs text-gray-500">© 2025 ParkMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
