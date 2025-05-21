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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/lib";

export const CarEntryForm = () => {
  const { availableParks, refreshAvailableParks } = useParkingContext();
  console.log('parks:', availableParks);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: "",
    parkingCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/car/register", formData);
      toast.success("Car entry registered successfully");
      refreshAvailableParks();
      setFormData({
        plateNumber: "",                                 

        parkingCode: "",
      });
    } catch (error) {
      toast.error("Failed to register car entry");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParkingSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, parkingCode: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Register Car Entry</CardTitle>
        <CardDescription>Record a new car entering the parking</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plateNumber">License Plate Number</Label>
            <Input
              id="plateNumber"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChange}
              required
              placeholder="e.g., ABC123"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parkingCode">Parking</Label>
            <Select
              value={formData.parkingCode}
              onValueChange={handleParkingSelect}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a parking " />
              </SelectTrigger>
              <SelectContent>
                {availableParks.map((park) => (
                  <SelectItem key={park.code} value={park.code}>
                    {park.name} - {park.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register Car Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 