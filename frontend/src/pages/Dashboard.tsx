
import { MainLayout } from '@/components/Layout/MainLayout';
import ParkingOverview from '@/components/Dashboard/ParkingOverview';

export const Dashboard = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your parking lot in real-time.</p>
      </div>
      
      <div className="space-y-8">
        <ParkingOverview/>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
