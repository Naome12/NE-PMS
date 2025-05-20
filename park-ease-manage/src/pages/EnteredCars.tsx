
import { MainLayout } from '@/components/Layout/MainLayout';
import { CarEntryForm } from '@/components/Forms/CarEntryForm';

export const EnteredCars = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Car Entry</h1>
        <p className="text-muted-foreground">Monitor your parking lot in real-time.</p>
      </div>
      
      <div className="space-y-8">
        <CarEntryForm/>
      </div>
    </MainLayout>
  );
};

export default EnteredCars;
