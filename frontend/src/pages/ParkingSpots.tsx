
import { MainLayout } from '@/components/Layout/MainLayout';
import  ParkPage from '@/components/ParkingSpots/ParkPage';

export const ParkingSpots = () => {
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Parking Spots</h1>
        <p className="text-muted-foreground">View and manage all parking spots in the facility.</p>
      </div>
      
      <ParkPage/>
    </MainLayout>
  );
};

export default ParkingSpots;
