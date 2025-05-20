import { useState } from "react";
import { useParkingContext } from "@/context/ParkingContext";
import { useTicketContext } from "@/context/ticketContext";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParkingGrid } from "@/components/ParkingSpots/ParkPage";
import { toast } from "sonner";

export const BookTicketForm = () => {
  const { parkingSpots } = useParkingContext();
  const { bookTicket } = useTicketContext();
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("CAR");
  const [selectedSpotId, setSelectedSpotId] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plateNumber) {
      toast.error("Please enter vehicle plate number");
      return;
    }

    if (!selectedSpotId) {
      toast.error("Please select a parking spot");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await bookTicket({
        plateNumber,
        type: vehicleType,
        spotId: selectedSpotId
      });

      if (result.success) {
        toast.success(`Ticket for ${plateNumber} booked successfully`);
        setPlateNumber("");
        setVehicleType("CAR");
        setSelectedSpotId(undefined);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to book ticket. Please try again.");
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Booking Ticket</CardTitle>
        <CardDescription>Book a parking ticket</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plateNumber">License Plate Number</Label>
              <Input
                id="plateNumber"
                placeholder="e.g. ABC123"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select 
                value={vehicleType} 
                onValueChange={setVehicleType}
                required
              >
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Vehicle Types</SelectLabel>
                    <SelectItem value="CAR">CAR</SelectItem>
                    <SelectItem value="TRUCK">TRUCK</SelectItem>
                    <SelectItem value="MOTORCYCLE">MOTORCYCLE</SelectItem>
                    <SelectItem value="BICYCLE">BICYCLE</SelectItem>
                    <SelectItem value="BUS">BUS</SelectItem>
                    <SelectItem value="VAN">VAN</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select a Parking Spot</Label>
            <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
              <ParkingGrid
                onSpotSelect={setSelectedSpotId}
                selectedSpotId={selectedSpotId}
                onlyShowAvailable={true}
              />
            </div>
            {selectedSpotId && (
              <p className="text-sm text-muted-foreground">
                Selected spot:{" "}
                {
                  parkingSpots.find((spot) => spot.id === selectedSpotId)
                    ?.label
                }
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Booking..." : "Book Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};