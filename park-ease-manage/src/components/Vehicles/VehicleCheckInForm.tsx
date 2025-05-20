import { useState } from 'react';
import { useParkingContext } from '@/context/ParkingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { ParkingGrid } from '@/components/ParkingSpots/ParkPage';
import { toast } from 'sonner';
import api from '@/lib/lib.ts';

export const VehicleCheckInForm = () => {
  const { checkInVehicle, parkingSpots, activeSessions } = useParkingContext();
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('CAR');
  const [selectedSpotId, setSelectedSpotId] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plateNumber.trim()) {
      toast.error('Please enter a valid vehicle plate number');
      return;
    }

    if (!selectedSpotId) {
      toast.error('Please select a parking spot');
      return;
    }

    try {
      const trimmedPlate = plateNumber.trim();
      const spot = parkingSpots.find(s => s.id === selectedSpotId);
      if (!spot) {
        toast.error('Selected spot not found');
        return;
      }

      const ticketResponse = await api.get('/ticket/verify', {
        params: { plateNumber: trimmedPlate, spotId: selectedSpotId },
      });

      const hasApprovedTicket = ticketResponse.data.exists === true;

      const updatedSpot = (await api.get(`/parking-spots/${selectedSpotId}`)).data;

      if (hasApprovedTicket) {
        if (updatedSpot.status !== 'RESERVED') {
          toast.error('Selected spot is not RESERVED for this ticket');
          return;
        }
      } else {
        // No approved ticket, must use an FREE spot
        if (updatedSpot.status !== 'FREE') {
          toast.error('Selected spot is not FREE for non-ticketed check-in');
          return;
        }
      }

      // Perform check-in
      await checkInVehicle({
        plateNumber: trimmedPlate,
        vehicleType,
        spotId: selectedSpotId,
      });

      const isCheckedIn = activeSessions.some(
        session =>
          session.vehicle.plateNumber === trimmedPlate &&
          session.spotId === selectedSpotId
      );

      if (!isCheckedIn) {
        toast.error('Check-in failed: Vehicle not found in active sessions');
        return;
      }

      toast.success(`Vehicle ${plateNumber} checked in successfully`);
      setPlateNumber('');
      setVehicleType('CAR');
      setSelectedSpotId(undefined);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Vehicle check-in failed';
      toast.error(errorMessage);
      console.error('Check-in error:', err);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vehicle Check-In</CardTitle>
        <CardDescription>
          Check-in using an approved ticket or select an FREE spot manually
        </CardDescription>
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
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
                onlyShowAvailable={false} // Allow showing RESERVED spots too
              />
            </div>
            {selectedSpotId && (
              <p className="text-sm text-muted-foreground">
                Selected spot: {parkingSpots.find(spot => spot.id === selectedSpotId)?.label}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">Check-In Vehicle</Button>
        </form>
      </CardContent>
    </Card>
  );
};
