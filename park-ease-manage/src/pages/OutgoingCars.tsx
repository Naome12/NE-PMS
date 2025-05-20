import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import api from "@/lib/lib";

interface Car {
  id: string;
  plateNumber: string;
  parkingCode: string;
  entryTime: string;
  exitTime: string;
  chargedAmount: number;
  parkingName: string;
  location: string;
}

export const OutgoingCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const response = await api.get("/car/outgoing");
      setCars(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch outgoing cars");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recently Exited Cars</CardTitle>
        <CardDescription>View cars that have left the parking</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : cars.length === 0 ? (
          <div className="text-center py-4">No cars have exited yet</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License Plate</TableHead>
                <TableHead>Parking Spot</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Exit Time</TableHead>
                <TableHead>Charged Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>{car.plateNumber}</TableCell>
                  <TableCell>{car.parkingName}</TableCell>
                  <TableCell>{car.location}</TableCell>
                  <TableCell>
                    {new Date(car.entryTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(car.exitTime).toLocaleString()}
                  </TableCell>
                  <TableCell>${car.chargedAmount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}; 