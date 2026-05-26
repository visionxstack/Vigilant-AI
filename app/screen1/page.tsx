import type { Metadata } from "next";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard | Vigilant-AI",
  description: "Real-time security operations dashboard — active threats, metrics, and AI-generated incident summaries.",
};

export default function Screen1() {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}
