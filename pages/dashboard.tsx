// app/dashboard/page.tsx
"use client";
import Dashboard from "../components/Dashboard";
import Layout from "../components/Layout";
import CityHeatmap from "../components/HeatMap";

export default function DashboardPage() {
  return (
    <div>
      <Layout>
        <Dashboard />
        <CityHeatmap />
      </Layout>
    </div>
  );
}
