"use client";

import React, { useState } from "react";
import AIAnalyzer from "@/components/AIAnalyzer";
import incidents from "@/data/incidents.json";
import { History, Save, GitBranch, ArrowUpRight, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const RISK_TREND = [
  { d: "1", v: 4.2 }, { d: "2", v: 5.1 }, { d: "3", v: 4.8 },
  { d: "4", v: 6.3 }, { d: "5", v: 7.0 }, { d: "6", v: 8.4 }, { d: "7", v: 9.7 },
];

const STATUS_COLORS: Record<string, string> = {
  investigating: "var(--severity-critical)",
  contained: "var(--severity-low)",
  resolved: "var(--text-secondary)",
};

export default function InvestigationWorkspace() {
  const [selectedIncident, setSelectedIncident] = useState<null | (typeof incidents)[0]>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* Main */}
      <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px", minWidth: 0, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              AI Investigation Workspace
            </h1>
            <p style={{ fontSize: "12px", color: "var(--text-tertiary)", margin: "4px 0 0" }}>
              Submit indicators for AI-powered threat analysis
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[{ icon: History, label: "History" }, { icon: Save, label: "Save Case" }].map(({ icon: Icon, label }) => (
              <button key={label} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "7px", background: "none", border: "1px solid var(--border-default)", color: "var(--text-secondary)", fontSize: "12px", cursor: "pointer" }}>
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Analyzer */}
        <AIAnalyzer />

        {/* Active Incidents */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
              Active Incidents
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(selectedIncident?.id === inc.id ? null : inc)}
                style={{
                  padding: "14px 18px",
                  borderBottom: "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  background: selectedIncident?.id === inc.id ? "var(--bg-elevated)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (selectedIncident?.id !== inc.id) (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)"; }}
                onMouseLeave={(e) => { if (selectedIncident?.id !== inc.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{
                        fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px",
                        color: inc.severity === "critical" ? "var(--severity-critical)" : "var(--severity-high)",
                        background: inc.severity === "critical" ? "var(--severity-critical-dim)" : "var(--severity-high-dim)",
                        textTransform: "uppercase", letterSpacing: "0.06em",
                      }}>{inc.severity}</span>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {inc.title}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {inc.description}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                    <span style={{ fontSize: "10px", color: STATUS_COLORS[inc.status] || "var(--text-secondary)", fontWeight: 500 }}>
                      {inc.status.charAt(0).toUpperCase() + inc.status.slice(1)}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
                      Risk: {inc.risk_score}
                    </span>
                  </div>
                </div>

                {/* Expanded Timeline */}
                {selectedIncident?.id === inc.id && (
                  <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                      <GitBranch size={12} color="var(--accent-blue)" />
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-primary)" }}>Attack Timeline</span>
                    </div>
                    <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
                      <div style={{ position: "absolute", top: "16px", left: "5%", right: "5%", height: "1px", background: "var(--border-default)" }} />
                      {inc.timeline.map((step, i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", zIndex: 1 }}>
                          <span style={{ fontSize: "9px", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>{step.time}</span>
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: i === inc.timeline.length - 1 ? "var(--severity-critical)" : "var(--accent-blue)", border: "3px solid var(--bg-surface)" }} />
                          <span style={{ fontSize: "9px", color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.3 }}>{step.event}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                      {inc.iocs.map((ioc) => (
                        <span key={ioc} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "var(--bg-overlay)", border: "1px solid var(--border-subtle)", borderRadius: "4px", padding: "2px 7px", color: "var(--text-secondary)" }}>
                          {ioc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: "220px", minWidth: "220px", background: "var(--bg-surface)", borderLeft: "1px solid var(--border-subtle)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>
        <div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>Investigation Context</span>
          <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>Linked intelligence</span>
        </div>

        {/* IOCs */}
        <div>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "8px" }}>Related IOCs</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {["185.244.25.118", "microsft-verify.com", "a1f4cb8e2d01", "AS200651"].map((ioc) => (
              <span key={ioc} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "var(--bg-overlay)", border: "1px solid var(--border-subtle)", borderRadius: "5px", padding: "4px 8px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {ioc}
              </span>
            ))}
          </div>
        </div>

        {/* Similar Cases */}
        <div>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "8px" }}>Similar Cases</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[{ title: "M365 Credential Phish", link: "#" }, { title: "Azure AD Typosquat Q3", link: "#" }].map(({ title, link }) => (
              <div key={title}>
                <div style={{ fontSize: "12px", color: "var(--text-primary)", marginBottom: "2px" }}>{title}</div>
                <a href={link} style={{ fontSize: "10px", color: "var(--accent-blue)", display: "flex", alignItems: "center", gap: "3px", textDecoration: "none" }}>
                  View <ArrowUpRight size={10} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Trend */}
        <div>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "8px" }}>Risk Score Trend</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }}>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>9.7</span>
            <span style={{ fontSize: "10px", color: "var(--severity-critical)", display: "flex", alignItems: "center", gap: "2px" }}>
              <TrendingUp size={10} /> +12%
            </span>
          </div>
          <div style={{ height: "50px" }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={RISK_TREND}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area dataKey="v" stroke="var(--accent-blue)" strokeWidth={1.5} fill="url(#rg)" type="monotone" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <button style={{ marginTop: "auto", padding: "8px 12px", border: "1px solid var(--border-default)", borderRadius: "7px", background: "none", color: "var(--text-secondary)", fontSize: "11px", cursor: "pointer" }}>
          + Add Note
        </button>
      </div>
    </div>
  );
}
