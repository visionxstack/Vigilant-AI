"use client";

import React, { useEffect, useState } from "react";
import { Clock, Sparkles, UsersRound, BellRing } from "lucide-react";
import MetricsCards from "./MetricsCards";
import ThreatFeed from "./ThreatFeed";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CHART_DATA = [
  { day: "Wed", v: 820 },
  { day: "Thu", v: 1140 },
  { day: "Fri", v: 760 },
  { day: "Sat", v: 480 },
  { day: "Sun", v: 590 },
  { day: "Mon", v: 1320 },
  { day: "Tue", v: 1247 },
];

const THREAT_ACTORS = [
  { name: "APT-Nebula", country: "🇷🇺", pct: 88, color: "var(--severity-critical)" },
  { name: "SilverFox", country: "🇨🇳", pct: 64, color: "var(--severity-high)" },
  { name: "DarkRaven", country: "🇰🇵", pct: 42, color: "var(--accent-blue)" },
];

const RECENT_ALERTS = [
  { msg: "Unusual outbound traffic on SRV-09", time: "3 min ago" },
  { msg: "New CVE-2024-3812 patch available", time: "22 min ago" },
  { msg: "MFA bypass attempt on admin portal", time: "41 min ago" },
  { msg: "Endpoint isolation completed: WS-117", time: "1 hr ago" },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("en-US", {
          weekday: "short", month: "short", day: "numeric",
          hour: "2-digit", minute: "2-digit", timeZone: "UTC",
          timeZoneName: "short",
        })
      );
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px", minWidth: 0, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>
              Dashboard
            </h1>
            <p style={{ fontSize: "12px", color: "var(--text-tertiary)", margin: "4px 0 0" }}>
              Real-time security operations overview
            </p>
          </div>
          {time && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text-tertiary)" }}>
              <Clock size={12} />
              <span>{time}</span>
            </div>
          )}
        </div>

        {/* Metrics */}
        <MetricsCards />

        {/* Threat Feed */}
        <ThreatFeed />

        {/* AI Summary */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderLeft: "3px solid var(--accent-blue)", borderRadius: "10px", padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <Sparkles size={14} color="var(--accent-blue)" />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
              AI-Generated Incident Summary
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
            In the last hour, Vigilant-AI detected a coordinated probing campaign originating from three distinct subnets in Eastern Europe, primarily targeting authentication endpoints. Pattern correlation suggests a credential-stuffing operation linked to actor cluster{" "}
            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>APT-Nebula</span>.
            Automated containment has blocked 84% of attempts; two sessions remain under analyst review.
          </p>
        </div>

        {/* Threat Volume Chart */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
              Threat Volume — Last 7 Days
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Events / day</span>
          </div>
          <div style={{ height: "140px" }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} barSize={28}>
                  <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-default)",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "var(--text-primary)",
                    }}
                    cursor={{ fill: "var(--bg-elevated)" }}
                  />
                  <Bar dataKey="v" name="Threats" fill="rgba(59,126,255,0.45)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar Panel */}
      <div style={{ width: "220px", minWidth: "220px", background: "var(--bg-surface)", borderLeft: "1px solid var(--border-subtle)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "24px", overflowY: "auto" }}>
        {/* Threat Actors */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px" }}>
            <UsersRound size={13} color="var(--accent-blue)" />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>Top Threat Actors</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {THREAT_ACTORS.map(({ name, country, pct, color }) => (
              <div key={name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-primary)" }}>{name}</span>
                  <span style={{ fontSize: "12px" }}>{country}</span>
                </div>
                <div style={{ height: "4px", borderRadius: "4px", background: "var(--bg-overlay)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: "4px", background: color, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: "1px", background: "var(--border-subtle)" }} />

        {/* Recent Alerts */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px" }}>
            <BellRing size={13} color="var(--accent-blue)" />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>Recent Alerts</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {RECENT_ALERTS.map(({ msg, time }) => (
              <div key={msg}>
                <div style={{ fontSize: "11px", color: "var(--text-primary)", lineHeight: 1.45, marginBottom: "2px" }}>{msg}</div>
                <div style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>{time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI CTA */}
        <div style={{ marginTop: "auto", background: "var(--accent-blue-dim)", border: "1px solid var(--accent-blue-border)", borderRadius: "8px", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <Sparkles size={12} color="var(--accent-blue)" />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-primary)" }}>Ask AI Analyst</span>
          </div>
          <p style={{ fontSize: "10px", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 10px" }}>
            Run a natural-language investigation in seconds.
          </p>
          <a href="/screen2" style={{ display: "block", textAlign: "center", padding: "6px 12px", background: "var(--accent-blue)", color: "#fff", borderRadius: "6px", fontSize: "11px", fontWeight: 600, textDecoration: "none" }}>
            Open Workspace
          </a>
        </div>
      </div>
    </div>
  );
}
