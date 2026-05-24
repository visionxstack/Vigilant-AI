"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Radio,
  Brain,
  FileText,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/screen1", label: "Dashboard", icon: LayoutDashboard },
  { href: "/screen2", label: "Investigations", icon: Search },
  { href: "/screen3", label: "Threat Feed", icon: Radio },
  { href: "/screen2?tab=ai", label: "AI Analyst", icon: Brain },
  { href: "/screen1?tab=reports", label: "Reports", icon: FileText },
  { href: "/screen1?tab=settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    return pathname === base;
  };

  return (
    <aside
      style={{
        width: "220px",
        minWidth: "220px",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden"
          }}
        >
          <Image src="/logo.png" alt="Vigilant-AI Logo" width={32} height={32} style={{ objectFit: "contain" }} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
            Vigilant-AI
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-tertiary)", marginTop: "1px" }}>
            Threat Intel Platform
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "6px",
                marginBottom: "2px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: active ? 500 : 400,
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--bg-overlay)" : "transparent",
                borderLeft: active ? "2px solid var(--accent-blue)" : "2px solid transparent",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                }
              }}
            >
              <Icon
                size={15}
                color={active ? "var(--accent-blue)" : "currentColor"}
                style={{ flexShrink: 0 }}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div
        style={{
          padding: "14px 16px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "var(--accent-blue-dim)",
            border: "1px solid var(--accent-blue-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--accent-blue)",
            flexShrink: 0,
          }}
        >
          VK
        </div>
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Vision KC
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>SOC Analyst</div>
        </div>
      </div>
    </aside>
  );
}
