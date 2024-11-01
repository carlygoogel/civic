// app/dashboard/page.tsx
'use client';
import InquiryCenter from '../components/inquarycenter';
import MainDashboard from '../components/maindashboard';



export default function DashboardPage() {
  return (
    <div>
    <div>
      <MainDashboard />
    </div>
    <div>
      <InquiryCenter />
    </div>
    </div>
  );
}