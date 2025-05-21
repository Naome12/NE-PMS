// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useParkingContext } from '@/context/ParkingContext';
import { useCarContext } from '@/context/carContext';

const ITEMS_PER_PAGE = 5;

const AdminDashboard = () => {
  const { parks, refreshParks } = useParkingContext();
  const { enteredCars, exitedCars, fetchParkedCars, fetchExitedCars } = useCarContext();

  const [enteredPage, setEnteredPage] = useState(1);
  const [exitedPage, setExitedPage] = useState(1);

  useEffect(() => {
    refreshParks();
    fetchParkedCars();
    fetchExitedCars();
  }, []);

  const totalSpots = parks.length;

  // Pagination logic
  const paginate = (data: any[], page: number) =>
    data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalEnteredPages = Math.ceil(enteredCars.length / ITEMS_PER_PAGE);
  const totalExitedPages = Math.ceil(exitedCars.length / ITEMS_PER_PAGE);

  const paginatedEnteredCars = paginate(enteredCars, enteredPage);
  const paginatedExitedCars = paginate(exitedCars, exitedPage);

  return (
    <div className="space-y-8 p-4">
      {/* Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Parking Spots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSpots}</div>
        </CardContent>
      </Card>

      {/* Tables */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Parked Cars Table */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Parked Cars</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate Number</TableHead>
                <TableHead>Parking Code</TableHead>
                <TableHead>Entry Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEnteredCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>{car.plateNumber}</TableCell>
                  <TableCell>{car.parkingCode}</TableCell>
                  <TableCell>{new Date(car.entryTime).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination controls */}
          <div className="flex justify-between mt-2">
            <Button
              variant="outline"
              onClick={() => setEnteredPage((prev) => Math.max(prev - 1, 1))}
              disabled={enteredPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm px-2">
              Page {enteredPage} of {totalEnteredPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setEnteredPage((prev) => Math.min(prev + 1, totalEnteredPages))}
              disabled={enteredPage === totalEnteredPages}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Exited Cars Table */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Exited Cars</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate Number</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Exit Time</TableHead>
                <TableHead>Charged</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExitedCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>{car.plateNumber}</TableCell>
                  <TableCell>{car.entryTime ? new Date(car.entryTime).toLocaleString() : '-'}</TableCell>
                  <TableCell>{car.exitTime ? new Date(car.exitTime).toLocaleString() : '-'}</TableCell>
                  <TableCell>
                    {car.chargedAmount !== undefined && car.chargedAmount !== null
                      ? `${Number(car.chargedAmount).toFixed(2) } RWF`
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination controls */}
          <div className="flex justify-between mt-2">
            <Button
              variant="outline"
              onClick={() => setExitedPage((prev) => Math.max(prev - 1, 1))}
              disabled={exitedPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm px-2">
              Page {exitedPage} of {totalExitedPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setExitedPage((prev) => Math.min(prev + 1, totalExitedPages))}
              disabled={exitedPage === totalExitedPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
