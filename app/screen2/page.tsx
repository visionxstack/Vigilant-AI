import type { Metadata } from "next";
import Layout from "@/components/Layout";
import InvestigationWorkspace from "./InvestigationWorkspace";

export const metadata: Metadata = {
  title: "AI Investigation Workspace | Vigilant-AI",
  description: "Submit URLs, IPs, emails, and logs for AI-powered threat analysis and structured security reports.",
};

export default function Screen2() {
  return (
    <Layout>
      <InvestigationWorkspace />
    </Layout>
  );
}
