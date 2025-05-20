// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParkingContext } from '@/context/ParkingContext';
import api from '@/lib/lib';
import { User } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 5;

const AdminDashboard = () => {
  const { parks, refreshParks } = useParkingContext();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/attendants');
      setUsers(res.data.attendants);
      setTotalPages(Math.ceil(res.data.attendants.length / PAGE_SIZE));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    refreshParks();
    fetchUsers();
  }, []);

  const totalSpots = parks.length;
  const freeSpots = parks.filter((p) => p.status === 'FREE').length;
  const occupiedSpots = parks.filter((p) => p.status === 'OCCUPIED').length;
  const reservedSpots = parks.filter((p) => p.status === 'RESERVED').length;
  const occupancyRate = totalSpots > 0 ? ((occupiedSpots / totalSpots) * 100).toFixed(1) : '0';

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const currentUsers = users.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="space-y-8 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Parking Spots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSpots}</div>
          <p className="text-xs text-muted-foreground">
            {freeSpots} FREE, {occupiedSpots} OCCUPIED, {reservedSpots} RESERVED
          </p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full">
            <div
              className="h-1 bg-secondary rounded-full"
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{occupancyRate}% occupancy rate</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4">Attendants</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName} </TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
