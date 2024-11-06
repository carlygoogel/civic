// app/dashboard/page.tsx
'use client';
import InquiryCenter from '../components/inquarycenter';
import MainDashboard from '../components/maindashboard';
import Layout from '../components/Layout';



export default function DashboardPage() {
  return (
    <div>
    <Layout>
      <MainDashboard />
    </Layout>
    </div>
  );
}