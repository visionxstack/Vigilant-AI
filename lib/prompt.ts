export type AnalysisType = "url" | "email" | "ip" | "log" | "incident";

export const SYSTEM_PROMPT = `You are a senior cybersecurity AI analyst embedded in an enterprise Security Operations Center (SOC) platform called Vigilant-AI.

Your role is to perform real-time, professional-grade threat analysis on submitted indicators and return structured, actionable intelligence.

ALWAYS respond with ONLY a valid JSON object in this exact format — no markdown, no explanation, no preamble:
{
  "summary": "2-4 sentence professional analysis summary",
  "risk_score": <integer 0-100>,
  "classification": "<threat classification, e.g. Phishing, Malware C2, Credential Harvesting, Brute Force, Port Scan, Benign, etc.>",
  "evidence": ["<specific evidence item 1>", "<specific evidence item 2>", "<specific evidence item 3>"],
  "attack_vector": "<MITRE ATT&CK tactic or technique, e.g. T1566.002 Spearphishing Link>",
  "recommendations": ["<actionable remediation step 1>", "<actionable remediation step 2>", "<actionable remediation step 3>"]
}

Rules:
- Be realistic, technical, and professional — write like a senior SOC analyst
- Use MITRE ATT&CK terminology for attack_vector when applicable
- risk_score must reflect real threat severity: 0-20 benign, 21-40 low, 41-60 medium, 61-80 high, 81-100 critical
- evidence array must contain specific, observable indicators (not generic statements)
- recommendations must be concrete and prioritized
- Never respond casually or with conversational language
- Never add text outside the JSON object`;

export function buildUserPrompt(type: AnalysisType, input: string): string {
  const prompts: Record<AnalysisType, string> = {
    url: `Analyze this URL for phishing, malware delivery, typosquatting, or other malicious indicators:\n\n${input}`,
    email: `Analyze this email content/headers for phishing, social engineering, malicious attachments, or spoofing:\n\n${input}`,
    ip: `Analyze this IP address for threat reputation, geolocation risk, botnet membership, C2 infrastructure, or malicious activity:\n\n${input}`,
    log: `Analyze this system/network log snippet for security anomalies, IOCs, attack patterns, or policy violations:\n\n${input}`,
    incident: `Analyze this security incident description and provide a full threat assessment with classification and response recommendations:\n\n${input}`,
  };
  return prompts[type];
}

export function detectInputType(input: string): AnalysisType {
  const trimmed = input.trim().toLowerCase();
  if (/^https?:\/\//.test(trimmed) || /^www\./.test(trimmed)) return "url";
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(trimmed)) return "ip";
  if (
    trimmed.includes("from:") ||
    trimmed.includes("subject:") ||
    trimmed.includes("received:") ||
    trimmed.includes("@") && trimmed.includes("mime")
  )
    return "email";
  if (
    trimmed.includes("[") ||
    trimmed.includes("error") ||
    trimmed.includes("warn") ||
    trimmed.includes("failed") ||
    /\d{4}-\d{2}-\d{2}/.test(trimmed)
  )
    return "log";
  return "incident";
}
