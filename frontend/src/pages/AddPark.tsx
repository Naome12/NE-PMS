
import { MainLayout } from '@/components/Layout/MainLayout';
import { CarEntryForm } from '@/components/Forms/CarEntryForm';
import { ParkingForm } from '@/components/Forms/ParkingForm';

export const AddPark = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add a Parking</h1>
        <p className="text-muted-foreground">Monitor your parking lot in real-time.</p>
      </div>
      
      <div className="space-y-8">
        <ParkingForm/>
      </div>
    </MainLayout>
  );
};

export default AddPark;
