
import { MainLayout } from '@/components/Layout/MainLayout';

import Attendant from '@/components/Forms/AttendantForm';

export const AddPark = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Attendants</h1>
        <p className="text-muted-foreground">Monitor your parking lot in real-time.</p>
      </div>
      
      <div className="space-y-8">
        <Attendant/>
      </div>
    </MainLayout>
  );
};

export default AddPark;
