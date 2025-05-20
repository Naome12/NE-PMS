import { useParkingContext } from '@/context/ParkingContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const SessionHistoryList = () => {
  const { completedSessions } = useParkingContext();
  
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'N/A';
    return dateObj.toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const calculateDuration = (checkInAt: Date | string, checkedOutAt: Date | string | undefined) => {
    if (!checkedOutAt) return 'N/A';
    const start = typeof checkInAt === 'string' ? new Date(checkInAt) : checkInAt;
    const end = typeof checkedOutAt === 'string' ? new Date(checkedOutAt) : checkedOutAt;
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'N/A';
    
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${minutes} min`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Entry Time</TableHead>
            <TableHead>Exit Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Charge</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {completedSessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                <div className="font-medium">{session.vehicle?.plateNumber || 'Unknown'}</div>
                <div className="text-xs text-gray-500">{session.vehicle?.type || 'Unknown type'}</div>
              </TableCell>
              <TableCell>{formatDate(session.checkInAt)}</TableCell>
              <TableCell>{formatDate(session.checkedOutAt)}</TableCell>
              <TableCell>{session.duration}</TableCell>
              <TableCell>${(session.totalCost || 0).toFixed(2)}</TableCell>
            </TableRow>
          ))}
          {completedSessions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No completed sessions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};