"use client";

import { ShieldCheck, Search, AlertOctagon, ShieldOff } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  icon: React.ReactNode;
  iconBg?: string;
  scoreRing?: number; // 0–100 for circular score
}

function MetricCard({ label, value, sub, subColor, icon, iconBg, scoreRing }: MetricCardProps) {
  const circumference = 2 * Math.PI * 18;
  const strokeDash = scoreRing !== undefined ? (scoreRing / 100) * circumference : 0;

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "10px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500 }}>
          {label}
        </span>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: iconBg || "var(--bg-overlay)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {scoreRing !== undefined && (
          <div style={{ position: "relative", width: "44px", height: "44px", flexShrink: 0 }}>
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx="22" cy="22" r="18"
                fill="none"
                stroke="var(--bg-overlay)"
                strokeWidth="3"
              />
              <circle
                cx="22" cy="22" r="18"
                fill="none"
                stroke="var(--severity-low)"
                strokeWidth="3"
                strokeDasharray={`${strokeDash} ${circumference}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
        <div>
          <div
            style={{
              fontSize: scoreRing !== undefined ? "20px" : "24px",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
          {sub && (
            <div
              style={{
                fontSize: "11px",
                color: subColor || "var(--text-secondary)",
                marginTop: "2px",
              }}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MetricsCards() {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <MetricCard
        label="Security Score"
        value="84"
        sub="+2.4% this week"
        subColor="var(--severity-low)"
        scoreRing={84}
        icon={<ShieldCheck size={14} color="var(--severity-low)" />}
        iconBg="var(--severity-low-dim)"
      />
      <MetricCard
        label="Active Investigations"
        value="12"
        sub="Open cases"
        subColor="var(--severity-high)"
        icon={<Search size={14} color="var(--severity-high)" />}
        iconBg="var(--severity-high-dim)"
      />
      <MetricCard
        label="Critical Alerts"
        value="3"
        sub="Requires action"
        subColor="var(--severity-critical)"
        icon={<AlertOctagon size={14} color="var(--severity-critical)" />}
        iconBg="var(--severity-critical-dim)"
      />
      <MetricCard
        label="Threats Blocked"
        value="1,247"
        sub="Today"
        subColor="var(--text-secondary)"
        icon={<ShieldOff size={14} color="var(--accent-blue)" />}
        iconBg="var(--accent-blue-dim)"
      />
    </div>
  );
}
