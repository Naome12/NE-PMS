
import { MainLayout } from '@/components/Layout/MainLayout';
import { CarEntryForm } from '@/components/Forms/CarEntryForm';
import { CarExitForm } from '@/components/Forms/CarExitForm';

export const OutgoingCars = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Car Entry</h1>
        <p className="text-muted-foreground">Monitor your parking lot in real-time.</p>
      </div>
      
      <div className="space-y-8">
        <CarExitForm/>
      </div>
    </MainLayout>
  );
};

export default OutgoingCars;
