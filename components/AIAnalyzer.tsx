"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, Link2, Mail, Globe, FileCode, AlertTriangle, ArrowRight, X, Loader2, Shield, Target, Activity, ListChecks } from "lucide-react";
import type { AnalysisType } from "@/lib/prompt";

const INPUT_TYPES: { type: AnalysisType; label: string; icon: typeof Link2; placeholder: string }[] = [
  { type: "url", label: "URL", icon: Link2, placeholder: "https://suspicious-domain.example.com/payload" },
  { type: "email", label: "Email", icon: Mail, placeholder: "From: attacker@evil.com\nSubject: Urgent: Verify your account\n..." },
  { type: "ip", label: "IP Address", icon: Globe, placeholder: "185.220.101.55" },
  { type: "log", label: "Log Snippet", icon: FileCode, placeholder: "2025-03-18T14:22:14 EventID=1 Image=cmd.exe ParentImage=winword.exe..." },
  { type: "incident", label: "Incident", icon: AlertTriangle, placeholder: "Describe the security incident or paste incident details..." },
];

interface AnalysisResult {
  summary: string;
  risk_score: number;
  classification: string;
  evidence: string[];
  attack_vector: string;
  recommendations: string[];
}

function getRiskColor(score: number) {
  if (score >= 80) return "var(--severity-critical)";
  if (score >= 60) return "var(--severity-high)";
  if (score >= 40) return "var(--severity-medium)";
  return "var(--severity-low)";
}
function getRiskLabel(score: number) {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export default function AIAnalyzer() {
  const [activeType, setActiveType] = useState<AnalysisType>("url");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim(), type: activeType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data.analysis as AnalysisResult);
      setInput(""); // Clear input field after successful submission
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [input, activeType, loading]);

  const handleInputChange = (val: string) => {
    setInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  const activeConfig = INPUT_TYPES.find((t) => t.type === activeType)!;
  const riskColor = result ? getRiskColor(result.risk_score) : "var(--text-secondary)";
  const circumference = 2 * Math.PI * 28;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Input Card */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "10px", overflow: "hidden" }}>
        {/* Type Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", padding: "0 4px" }}>
          {INPUT_TYPES.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => { setActiveType(type); setResult(null); setError(null); }}
              style={{
                display: "flex", alignItems: "center", gap: "6px", padding: "12px 14px",
                background: "none", border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: activeType === type ? 600 : 400,
                color: activeType === type ? "var(--text-primary)" : "var(--text-secondary)",
                borderBottom: activeType === type ? "2px solid var(--accent-blue)" : "2px solid transparent",
                marginBottom: "-1px", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (activeType !== type) (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { if (activeType !== type) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div style={{ padding: "16px" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: "10px", background: "var(--bg-base)", border: "1px solid var(--border-default)", borderRadius: "8px", padding: "10px 12px" }}>
            <activeConfig.icon size={15} color="var(--text-tertiary)" style={{ marginTop: "2px", flexShrink: 0 }} />
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={activeConfig.placeholder}
              rows={activeType === "email" || activeType === "log" || activeType === "incident" ? 4 : 2}
              style={{
                flex: 1, background: "none", border: "none", outline: "none", resize: "none",
                fontFamily: activeType === "url" || activeType === "ip" ? "var(--font-mono)" : "var(--font-sans)",
                fontSize: "12px", color: "var(--text-primary)", lineHeight: 1.6,
              }}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAnalyze(); }}
            />
            {input && (
              <button onClick={() => { setInput(""); setResult(null); setError(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: "0", marginTop: "2px" }}>
                <X size={14} />
              </button>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
            <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
              Press ⌘+Enter to analyze
            </span>
            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || loading}
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "8px 16px", borderRadius: "7px", border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                background: input.trim() && !loading ? "var(--accent-blue)" : "var(--bg-overlay)",
                color: input.trim() && !loading ? "#fff" : "var(--text-tertiary)",
                fontSize: "12px", fontWeight: 600, transition: "all 0.15s",
              }}
            >
              {loading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={13} />}
              {loading ? "Analyzing..." : "Analyze with AI"}
              {!loading && <ArrowRight size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "var(--severity-critical-dim)", border: "1px solid rgba(240,68,56,0.2)", borderRadius: "8px", padding: "12px 14px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <AlertTriangle size={14} color="var(--severity-critical)" style={{ marginTop: "1px", flexShrink: 0 }} />
          <span style={{ fontSize: "12px", color: "var(--severity-critical)" }}>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", animation: "fade-in 0.3s ease-out" }}>
          {/* Score + Summary Row */}
          <div style={{ display: "flex", gap: "12px" }}>
            {/* Risk Score Ring */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", minWidth: "120px" }}>
              <span style={{ fontSize: "10px", color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Risk Score</span>
              <div style={{ position: "relative", width: "72px", height: "72px" }}>
                <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="36" cy="36" r="28" fill="none" stroke="var(--bg-overlay)" strokeWidth="4" />
                  <circle
                    cx="36" cy="36" r="28" fill="none"
                    stroke={riskColor} strokeWidth="4"
                    strokeDasharray={`${(result.risk_score / 100) * circumference} ${circumference}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.8s ease" }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: riskColor, lineHeight: 1 }}>{result.risk_score}</span>
                  <span style={{ fontSize: "9px", color: "var(--text-tertiary)" }}>/100</span>
                </div>
              </div>
              <span style={{ fontSize: "10px", fontWeight: 700, color: riskColor, letterSpacing: "0.06em" }}>
                {getRiskLabel(result.risk_score)}
              </span>
            </div>

            {/* Summary + Classification */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <Shield size={13} color="var(--accent-blue)" />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>Threat Classification</span>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 600, color: riskColor, background: riskColor.replace(")", ", 0.12)").replace("var(", "rgba(").replace(",0.12)", ", 0.12)"), padding: "2px 8px", borderRadius: "4px", whiteSpace: "nowrap" }}>
                  {result.classification}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                {result.summary}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingTop: "4px", borderTop: "1px solid var(--border-subtle)" }}>
                <Target size={11} color="var(--text-tertiary)" />
                <span style={{ fontSize: "10px", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                  {result.attack_vector}
                </span>
              </div>
            </div>
          </div>

          {/* Evidence + Recommendations */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {/* Evidence */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                <Activity size={13} color="var(--severity-critical)" />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>Evidence</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                {result.evidence.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--severity-critical)", flexShrink: 0, marginTop: "5px" }} />
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                <ListChecks size={13} color="var(--accent-blue)" />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>Recommendations</span>
              </div>
              <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                {result.recommendations.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-blue)", flexShrink: 0, marginTop: "1px", minWidth: "14px" }}>
                      {i + 1}.
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
