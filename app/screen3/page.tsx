import type { Metadata } from "next";
import Layout from "@/components/Layout";
import ThreatFeedWorkspace from "./ThreatFeedWorkspace";

export const metadata: Metadata = {
  title: "Threat Feed & Log Analyzer | Vigilant-AI",
  description: "Real-time global threat intelligence and AI-powered system log analysis.",
};

export default function Screen3() {
  return (
    <Layout>
      <ThreatFeedWorkspace />
    </Layout>
  );
}
