// components/CarsTable.tsx
import { Car } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CarsTableProps {
  cars: Car[];
}

const CarsTable = ({ cars }: CarsTableProps) => {
  if (cars.length === 0) {
    return <p className="text-gray-500 italic">No cars found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plate Number</TableHead>
          <TableHead>Vehicle Type</TableHead>
          <TableHead>Entry Time</TableHead>
          <TableHead>Exit Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cars.map((car) => (
          <TableRow key={car.id}>
            <TableCell>{car.parkingCode}</TableCell>
            <TableCell>{car.plateNumber}</TableCell>
            <TableCell>
              {car.entryTime ? new Date(car.entryTime).toLocaleString() : '—'}
            </TableCell>
            <TableCell>
              {car.exitTime ? new Date(car.exitTime).toLocaleString() : '—'}
            </TableCell>
            <TableCell>{car.attendantId}</TableCell>
            <TableCell>
              {car.chargedAmount ? `$${car.chargedAmount.toFixed(2)}` : '—'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CarsTable;
