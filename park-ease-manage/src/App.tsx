// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider, useAuth } from "@/context/authContext";
import { ParkingProvider } from "@/context/ParkingContext";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Parks from "@/pages/ParkingSpots";
import NotFound from "@/pages/NotFound";
import { CarEntryForm } from "@/components/Forms/CarEntryForm";
import { CarExitForm } from "@/components/Forms/CarExitForm";
import { EnteredCars } from "@/pages/EnteredCars";
import { OutgoingCars } from "@/pages/OutgoingCars";
import AddPark from "./pages/AddPark";
import Attendant from "./pages/Attendant";
import { CarProvider } from "./context/carContext";

const queryClient = new QueryClient();

// 🔐 Wrapper: Require login
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// 🔒 Wrapper: Require specific role(s)
const RequireRole = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: JSX.Element;
}) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role;
  return role && allowedRoles.includes(role) ? children : <Navigate to="/" replace />;
};

// Smart redirect from login based on role
const LoginRoute = () => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) return <Login />;
  const role = currentUser?.role;

  switch (role) {
    case "ADMIN":
      return <Navigate to="/" replace />;
    case "ATTENDANT":
      return <Navigate to="/parks" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// 🛣️ App Routing Structure
const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<LoginRoute />} />
    <Route path="/signup" element={<Signup />} />

    {/* Protected: ADMIN */}
    <Route
      path="/"
      element={
        <RequireAuth>
          <RequireRole allowedRoles={["ADMIN"]}>
            <Dashboard />
          </RequireRole>
        </RequireAuth>
      }
    />
    <Route
      path="/register-parking"
      element={
        <RequireAuth>
          <RequireRole allowedRoles={["ADMIN"]}>
            <AddPark />
          </RequireRole>
        </RequireAuth>
      }
    />
    <Route
      path="/entered-cars"
      element={
        <RequireAuth>
          <RequireRole allowedRoles={["ADMIN","ATTENDANT"]}>
            <EnteredCars />
          </RequireRole>
        </RequireAuth>
      }
    />
    <Route
      path="/outgoing-cars"
      element={
        <RequireAuth>
          <RequireRole allowedRoles={["ADMIN"]}>
            <OutgoingCars />
          </RequireRole>
        </RequireAuth>
      }
    />
    <Route
      path="/attendants"
      element={
        <RequireAuth>
          <RequireRole allowedRoles={["ADMIN"]}>
            <Attendant />
          </RequireRole>
        </RequireAuth>
      }
    />

    {/* Protected: ADMIN & ATTENDANT */}
    <Route
      path="/parks"
      element={
        <RequireAuth>
          <RequireRole allowedRoles={["ADMIN", "ATTENDANT"]}>
            <Parks />
          </RequireRole>
        </RequireAuth>
      }
    />
    <Route
      path="/car-entry"
      element={
        <RequireAuth>
          <RequireRole allowedRoles={["ADMIN", "ATTENDANT"]}>
            <CarEntryForm />
          </RequireRole>
        </RequireAuth>
      }
    />
    <Route
      path="/car-exit"
      element={
        <RequireAuth>
          <RequireRole allowedRoles={["ADMIN", "ATTENDANT"]}>
            <CarExitForm />
          </RequireRole>
        </RequireAuth>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

// 🌐 Root App
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <AuthProvider>
          <ParkingProvider>
            <CarProvider>

            <AppRoutes />
            <Toaster />
            <Sonner />
            </CarProvider>
          </ParkingProvider>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
