"use client";

import { useEffect, useState } from "react";
import threats from "@/data/threats.json";

type Threat = (typeof threats)[0];

const SEVERITY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  critical: {
    label: "Critical",
    color: "var(--severity-critical)",
    bg: "var(--severity-critical-dim)",
    dot: "#f04438",
  },
  high: {
    label: "High",
    color: "var(--severity-high)",
    bg: "var(--severity-high-dim)",
    dot: "#f79009",
  },
  medium: {
    label: "Medium",
    color: "var(--severity-medium)",
    bg: "var(--severity-medium-dim)",
    dot: "#eaaa08",
  },
  low: {
    label: "Low",
    color: "var(--severity-low)",
    bg: "var(--severity-low-dim)",
    dot: "#17b26a",
  },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  investigating: { label: "Investigating", color: "var(--severity-critical)" },
  blocked: { label: "Blocked", color: "var(--severity-low)" },
  resolved: { label: "Resolved", color: "var(--text-secondary)" },
  contained: { label: "Contained", color: "var(--severity-low)" },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function ThreatFeed() {
  const [feed, setFeed] = useState<Threat[]>(threats.slice(0, 6));
  const [tick, setTick] = useState(0);

  // Simulate live feed — rotate entries every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setFeed((prev) => {
        const shifted = [...prev.slice(1), threats[tick % threats.length]];
        return shifted;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--severity-low)",
              display: "inline-block",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
          <span style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-primary)" }}>
            Live Threat Activity Feed
          </span>
        </div>
        <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
          Auto-refreshing · {feed.length} events
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["Time", "Severity", "Type", "Source IP", "Destination", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 14px",
                    textAlign: "left",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feed.map((threat, i) => {
              const sev = SEVERITY_CONFIG[threat.severity] || SEVERITY_CONFIG.low;
              const status = STATUS_CONFIG[threat.status] || {
                label: threat.status,
                color: "var(--text-secondary)",
              };
              return (
                <tr
                  key={`${threat.id}-${i}`}
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "9px 14px",
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-mono)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatTime(threat.timestamp)}
                  </td>
                  <td style={{ padding: "9px 14px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: sev.bg,
                        fontSize: "10px",
                        fontWeight: 600,
                        color: sev.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: sev.dot,
                          flexShrink: 0,
                        }}
                      />
                      {sev.label}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      fontSize: "12px",
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {threat.type}
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-mono)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {threat.source_ip}
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      fontSize: "11px",
                      color: "var(--text-tertiary)",
                      fontFamily: "var(--font-mono)",
                      maxWidth: "160px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {threat.destination}
                  </td>
                  <td style={{ padding: "9px 14px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
