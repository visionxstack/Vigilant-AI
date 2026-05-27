"use client";

import React, { useState } from "react";
import logs from "@/data/logs.json";
import { 
  Search, 
  Filter, 
  Download, 
  Terminal, 
  Brain, 
  ChevronDown, 
  Activity,
  AlertCircle,
  Clock,
  ShieldAlert,
  Loader2
} from "lucide-react";

export default function ThreatFeedWorkspace() {
  const [selectedLog, setSelectedLog] = useState<null | (typeof logs)[0]>(null);
  const [analyzingLogId, setAnalyzingLogId] = useState<string | null>(null);
  const [logAnalysis, setLogAnalysis] = useState<Record<string, any>>({});

  const analyzeLog = async (log: typeof logs[0]) => {
    if (logAnalysis[log.id]) return;
    
    setAnalyzingLogId(log.id);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          input: log.raw, 
          type: "log" 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLogAnalysis(prev => ({ ...prev, [log.id]: data.analysis }));
      }
    } catch (err) {
      console.error("Log analysis failed", err);
    } finally {
      setAnalyzingLogId(null);
    }
  };

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* Main Log Viewer */}
      <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px", minWidth: 0, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              Log Analyzer & Threat Feed
            </h1>
            <p style={{ fontSize: "12px", color: "var(--text-tertiary)", margin: "4px 0 0" }}>
              Investigate system anomalies and global threat indicators
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "7px", background: "none", border: "1px solid var(--border-default)", color: "var(--text-secondary)", fontSize: "12px" }}>
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
            <input 
              type="text" 
              placeholder="Filter logs by IP, host, or message..." 
              style={{ width: "100%", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "8px 12px 8px 36px", fontSize: "12px", color: "var(--text-primary)", outline: "none" }}
            />
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontSize: "12px" }}>
            <Filter size={13} /> Severity <ChevronDown size={12} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--severity-low)", fontWeight: 500, marginLeft: "10px" }}>
            <Activity size={12} className="animate-pulse-dot" /> LIVE
          </div>
        </div>

        {/* Log List */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
                {["Timestamp", "Level", "Host", "Message", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr 
                    onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                    style={{ borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", background: selectedLog?.id === log.id ? "var(--bg-elevated)" : "transparent" }}
                  >
                    <td style={{ padding: "12px 16px", fontSize: "11px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ 
                        fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px",
                        color: log.level === "ERROR" || log.level === "CRITICAL" ? "var(--severity-critical)" : log.level === "WARN" ? "var(--severity-high)" : "var(--severity-low)",
                        background: log.level === "ERROR" || log.level === "CRITICAL" ? "var(--severity-critical-dim)" : log.level === "WARN" ? "var(--severity-high-dim)" : "var(--severity-low-dim)"
                      }}>
                        {log.level}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--text-primary)", fontWeight: 500 }}>{log.host}</td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--text-secondary)" }}>{log.message}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); analyzeLog(log); }}
                        disabled={analyzingLogId === log.id}
                        style={{ background: "none", border: "none", color: "var(--accent-blue)", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600 }}
                      >
                        {analyzingLogId === log.id ? <Loader2 size={12} className="animate-spin" /> : <Brain size={12} />}
                        Explain
                      </button>
                    </td>
                  </tr>
                  {selectedLog?.id === log.id && (
                    <tr>
                      <td colSpan={5} style={{ background: "var(--bg-base)", padding: "20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Raw Log Entry</span>
                            <div style={{ background: "#000", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-default)", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#00ff00" }}>
                              {log.raw}
                            </div>
                          </div>

                          {logAnalysis[log.id] ? (
                            <div style={{ animation: "fade-in 0.3s ease-out", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "14px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                  <Brain size={14} color="var(--accent-blue)" />
                                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>AI Analysis</span>
                                </div>
                                <p style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{logAnalysis[log.id].summary}</p>
                              </div>
                              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "14px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                  <ShieldAlert size={14} color="var(--severity-high)" />
                                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>Risk Factors</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>Classification</span>
                                    <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-primary)" }}>{logAnalysis[log.id].classification}</span>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>Risk Score</span>
                                    <span style={{ fontSize: "10px", fontWeight: 700, color: logAnalysis[log.id].risk_score > 70 ? "var(--severity-critical)" : "var(--severity-low)" }}>{logAnalysis[log.id].risk_score}/100</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : analyzingLogId === log.id ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-tertiary)", fontSize: "11px", padding: "10px" }}>
                              <Loader2 size={14} className="animate-spin" /> Analyzing log pattern with Groq AI...
                            </div>
                          ) : (
                            <div 
                              onClick={() => analyzeLog(log)}
                              style={{ border: "1px dashed var(--border-default)", borderRadius: "8px", padding: "14px", textAlign: "center", cursor: "pointer", color: "var(--text-tertiary)", fontSize: "11px" }}
                            >
                              Click "Explain" to generate AI analysis for this log entry
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Intelligence Panel */}
      <div style={{ width: "240px", minWidth: "240px", background: "var(--bg-surface)", borderLeft: "1px solid var(--border-subtle)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "24px", overflowY: "auto" }}>
        <div>
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>Global Threat Intel</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { title: "Typosquatted Azure Domains", count: 42, severity: "high" },
              { title: "Log4j RCE Exploitation", count: 128, severity: "critical" },
              { title: "New Qakbot Infrastructure", count: 15, severity: "medium" }
            ].map((intel) => (
              <div key={intel.title} style={{ padding: "10px", background: "var(--bg-overlay)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                   <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-primary)" }}>{intel.title}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>{intel.count} detections</span>
                   <span style={{ fontSize: "9px", fontWeight: 700, color: `var(--severity-${intel.severity})` }}>{intel.severity.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: "1px", background: "var(--border-subtle)" }} />

        <div>
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>Source Reliability</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {["Recorded Future", "Mandiant", "CrowdStrike", "ThreatConnect"].map(source => (
              <div key={source} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{source}</span>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(i => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: i <= 4 ? "var(--accent-blue)" : "var(--bg-overlay)" }} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
