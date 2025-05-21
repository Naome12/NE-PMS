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

export const CarExitForm = () => {
  const { refreshParks } = useParkingContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plateNumber, setPlateNumber] = useState("");
  const [exitDetails, setExitDetails] = useState<{
    chargedAmount: number;
    parkedDuration: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post("/car/exit", { plateNumber });
      setExitDetails(response.data.data);
      toast.success("Car exit registered successfully");
      refreshParks();
      setPlateNumber("");
    } catch (error) {
      toast.error("Failed to register car exit");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Register Car Exit</CardTitle>
        <CardDescription>Record a car leaving the parking</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plateNumber">License Plate Number</Label>
            <Input
              id="plateNumber"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              required
              placeholder="e.g., ABC123"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Register Car Exit"}
          </Button>

          {exitDetails && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Exit Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Parked Duration:</span>{" "}
                  {exitDetails.parkedDuration}
                </p>
                <p>
                  <span className="font-medium">Charged Amount:</span> $
                  {exitDetails.chargedAmount.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}; 