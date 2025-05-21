// src/pages/ParkPage.tsx
import React, { useEffect } from 'react';
import { useParkingContext } from '@/context/ParkingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ParkPage = () => {
  const { availableParks, refreshAvailableParks, loading } = useParkingContext();
  const navigate = useNavigate();

  useEffect(() => {
    refreshAvailableParks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Parking Areas</h1>
      {loading ? (
        <p>Loading...</p>
      ) : availableParks.length === 0 ? (
        <p>No available parks at the moment.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableParks.map((park) => (
            <Card key={park.code} className="shadow-md">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">{park.name}</h2>
                <p className="text-sm text-gray-600">Location: {park.location}</p>
                <p className="text-sm text-gray-600">Available Spaces: {park.availableSpaces}</p>
                <p className="text-sm text-gray-600">Fee/hr: {park.feePerHour} RWF</p>
                <Button
                  className="mt-2"
                  onClick={() => navigate(`/park/${park.code}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParkPage;
