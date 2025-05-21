import { useState } from "react";
import { useParkingContext } from "@/context/ParkingContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/lib";

export const ParkingForm = () => {
  const { refreshParks } = useParkingContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    availableSpaces: "",
    location: "",
    feePerHour: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/park", {
        ...formData,
        availableSpaces: parseInt(formData.availableSpaces),
        feePerHour: parseFloat(formData.feePerHour),
      });
      
      toast.success("Parking spot registered successfully");
      refreshParks();
      setFormData({
        code: "",
        name: "",
        availableSpaces: "",
        location: "",
        feePerHour: "",
      });
    } catch (error) {
      toast.error("Failed to register parking spot");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Register Parking Spot</CardTitle>
        <CardDescription>Add a new parking spot to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Parking Code</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="e.g., P001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Parking Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Main Parking"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availableSpaces">Available Spaces</Label>
              <Input
                id="availableSpaces"
                name="availableSpaces"
                type="number"
                value={formData.availableSpaces}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feePerHour">Fee per Hour</Label>
              <Input
                id="feePerHour"
                name="feePerHour"
                type="number"
                step="0.01"
                value={formData.feePerHour}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g., 5.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., 123 Main Street"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register Parking Spot"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 