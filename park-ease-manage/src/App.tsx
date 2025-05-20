import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
// import { Sonner } from "@/components/ui/sonner";
import { ParkingProvider } from "@/context/ParkingContext";

import { AuthProvider, useAuth } from "@/context/authContext";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Parks from "@/pages/ParkingSpots";
import Users from "@/pages/Users";
import NotFound from "@/pages/NotFound";
import { ParkingForm } from "@/components/Forms/ParkingForm";
import { CarEntryForm } from "@/components/Forms/CarEntryForm";
import { CarExitForm } from "@/components/Forms/CarExitForm";
import { EnteredCars } from "@/pages/EnteredCars";
import { OutgoingCars } from "@/pages/OutgoingCars";

const queryClient = new QueryClient();

//  Wrapper: Require login
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Wrapper: Restrict route to certain roles
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

//  Role-based redirect on login
const LoginRoute = () => {
  const { isAuthenticated, currentUser } = useAuth();
  if (!isAuthenticated) return <Login />;
  const role = currentUser?.role;
  if (role === "ADMIN") return <Navigate to="/" replace />;
  if (role === "ATTENDANT") return <Navigate to="/parks" replace />;
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<LoginRoute />} />
    <Route path="/signup" element={<Signup />} />

    {/* Protected Routes */}
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
      path="/register-parking"
      element={
        <RequireAuth>
          <RequireRole allowedRoles={["ADMIN"]}>
            <ParkingForm />
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
    <Route
      path="/entered-cars"
      element={
        <RequireAuth>
          <RequireRole allowedRoles={["ADMIN"]}>
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
      path="/users"
      element={
        <RequireAuth>
          <RequireRole allowedRoles={["ADMIN"]}>
            <Users />
          </RequireRole>
        </RequireAuth>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <AuthProvider>
          <ParkingProvider>
            {/* <TicketProvider> */}
              <AppRoutes />
              <Toaster />
              {/* <Sonner /> */}
            {/* </TicketProvider> */}
          </ParkingProvider>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
