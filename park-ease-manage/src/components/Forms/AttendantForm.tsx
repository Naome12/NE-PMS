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

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const currentUsers = users.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="space-y-8 p-4">
     

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
