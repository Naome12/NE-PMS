import { Link } from "react-router-dom";
import {
  Car,
  MapPin,
  TicketPercent,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useParkingContext } from "@/context/ParkingContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/authContext";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { logout } = useAuth();
  const { currentUser } = useAuth();
  const role = currentUser?.role || "ATTENDANT";

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: MapPin, allowedRoles: ["ADMIN"] },
    { name: "Parking", href: "/parks", icon: Car, allowedRoles: ["ADMIN","ATTENDANT"] },
    { name: "Book Ticket", href: "/book-space", icon: TicketPercent, allowedRoles: ["ATTENDANT"] },
    { name: "Add Park", href: "/register-parking", icon: Car, allowedRoles: ["ADMIN"] },
    { name: "Entered Cars", href: "/entered-cars", icon: Car, allowedRoles: ["ADMIN"] },
    { name: "Outgoing", href: "/outgoing-cars", icon: Car, allowedRoles: ["ADMIN"] },
    { name: "Attendants", href: "/users", icon: Users, allowedRoles: ["ADMIN"] },
  ];

  return (
    <div className={cn("transition-all duration-300 z-20 h-screen bg-primary shadow-lg", open ? "w-64" : "w-20")}>
      <div className="flex items-center justify-between p-4 border-b border-primary-700">
        <div className={cn("flex items-center", open ? "justify-between w-full" : "justify-center")}>
          {open && <h1 className="text-xl font-bold text-primary-50">ParkMaster</h1>}
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="text-primary-50">
            {open ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <div className="py-4 flex flex-col justify-between h-[calc(100vh-64px)]">
        <nav className="px-2 space-y-1">
          {navigationItems
            .filter((item) => item.allowedRoles.includes(role))
            .map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn("flex items-center py-2 px-4 rounded-md text-primary-100 hover:bg-primary-800 hover:text-white transition-colors", open ? "" : "justify-center")}
              >
                <item.icon className={cn("h-5 w-5", open ? "mr-3" : "")} />
                {open && <span>{item.name}</span>}
              </Link>
            ))}
        </nav>

        <div className="px-2 pb-4">
          <Button
            variant="ghost"
            className={cn("w-full flex items-center py-2 text-primary-100 hover:bg-primary-800 hover:text-white", open ? "justify-start" : "justify-center")}
            onClick={logout}
          >
            <LogOut className={cn("h-5 w-5", open ? "mr-3" : "")} />
            {open && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};
