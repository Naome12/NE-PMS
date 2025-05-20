import { useParkingContext } from '@/context/ParkingContext';
import { Button } from '@/components/ui/button';
import { CarFront, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

export const ActiveSessionsList = () => {
  const { activeSessions, checkOutVehicle, refreshData, isLoading } = useParkingContext();

  console.log("Active sessions in ActiveSessionsList:", JSON.stringify(activeSessions, null, 2));

  const calculateDuration = (entryTime: Date | string | null) => {
    if (!entryTime) return 'N/A';
    const entryDate = typeof entryTime === 'string' ? new Date(entryTime) : entryTime;
    if (isNaN(entryDate.getTime())) return 'N/A';
    const now = new Date();
    const durationMs = now.getTime() - entryDate.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return hours > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${minutes} min`;
  };

  const calculateCurrentCharge = (entryTime: Date | string | null) => {
    if (!entryTime) return 0;
    const entryDate = typeof entryTime === 'string' ? new Date(entryTime) : entryTime;
    if (isNaN(entryDate.getTime())) return 0;
    const now = new Date();
    const durationMs = now.getTime() - entryDate.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));

    if (minutes <= 30) return 0;

    const billableHours = Math.ceil((minutes - 30) / 60);
    return billableHours * 2;
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshData()}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Spot</TableHead>
              <TableHead>Entry Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Current Charge</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {activeSessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  <div className="flex flex-col items-center text-gray-500">
                    <CarFront className="h-8 w-8 mb-2" />
                    <p>No active parking sessions</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              activeSessions.map((session) => {
                const entryDate = typeof session.checkInAt === 'string' ? new Date(session.checkInAt) : session.checkInAt;
                const plateNumber = session.vehicle?.plateNumber || 'Unknown';

                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {plateNumber}
                      <div className="text-xs text-muted-foreground">
                        {session.vehicle?.type || 'Unknown type'}
                      </div>
                    </TableCell>

                    <TableCell>{session.spot?.label|| session.spotId || 'N/A'}</TableCell>

                    <TableCell>
                      {entryDate && !isNaN(entryDate.getTime()) ? (
                        <>
                          <div>{format(entryDate, 'HH:mm')}</div>
                          <div className="text-xs text-muted-foreground">{format(entryDate, 'dd MMM yyyy')}</div>
                        </>
                      ) : (
                        <div>N/A</div>
                      )}
                    </TableCell>

                    <TableCell>{calculateDuration(session.checkInAt)}</TableCell>

                    <TableCell>${calculateCurrentCharge(session.checkInAt).toFixed(2)}</TableCell>

                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => checkOutVehicle(plateNumber)}
                      >
                        Check-out
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};