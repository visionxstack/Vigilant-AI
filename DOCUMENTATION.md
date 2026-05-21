# Vigilant-AI Documentation

## Project Overview
**Vigilant-AI** is a professional-grade, AI-powered cybersecurity operations platform designed for real-time threat detection, indicator investigation, and incident analysis. Built with Next.js and powered by Groq AI, the platform provides Security Operations Center (SOC) analysts with a centralized workspace to analyze suspicious URLs, emails, IP addresses, and system logs.

The primary purpose of Vigilant-AI is to augment human intelligence with high-speed AI analysis, enabling rapid response to security anomalies and potential breaches.

## How The System Works
The platform follows a modular architecture to ensure security and performance:

1.  **User Input**: The analyst submits data (URL, Email, IP, or Logs) through the high-fidelity React frontend.
2.  **Next.js Frontend**: The request is captured and sent to a secure server-side API route.
3.  **API Route (`/api/analyze`)**: The server-side route processes the input, identifies the analysis type, and constructs a structured prompt for the AI.
4.  **Groq API**: The request is forwarded to the Groq Cloud API, utilizing state-of-the-art Large Language Models (LLMs).
5.  **AI Analysis**: The model (Llama 3.3 70B) performs a deep-dive security investigation based on curated cybersecurity knowledge.
6.  **Dashboard Rendering**: The structured JSON response from the AI is parsed and rendered into intuitive, interactive widgets on the dashboard.

## AI Integration
Vigilant-AI leverages the **Groq API** for its industry-leading inference speeds. By using models like **Llama 3.3 70B**, the platform can generate complex security reports in milliseconds.
- **Model used**: `llama-3.3-70b-versatile`
- **Output**: The system is tuned to return structured JSON data, ensuring that analysis results (risk scores, evidence, recommendations) are consistently rendered in the UI.

## Seed Data System
To provide a realistic "day-in-the-life" SOC experience, Vigilant-AI includes a comprehensive seed data system. This data simulates live cybersecurity activity without requiring a connection to a production SIEM.

### Key Data Files:
-   **`incidents.json`**: Contains historical and active security cases, including severity levels, assigned analysts, and detailed attack timelines.
-   **`logs.json`**: Simulates system and network logs that can be analyzed to explain anomalies.
-   **`threats.json`**: Populates the live threat feed with global indicators of compromise (IoCs) and actor profiles.

This system ensures that the dashboard is always populated with high-fidelity, actionable data for training and demonstration purposes.

## Project Structure
-   **/app**: Contains the Next.js App Router pages and API routes.
-   **/components**: Reusable UI components (Dashboard, Sidebar, AIAnalyzer, etc.).
-   **/lib**: Core logic, including Groq SDK initialization and prompt engineering.
-   **/data**: JSON seed data for the SOC simulation.
-   **/styles**: Global CSS and design tokens.
-   **/public**: Static assets, including the branding logo.

## Features
-   **URL Analysis**: Scans suspicious links for phishing and malware patterns.
-   **Email Threat Detection**: Analyzes email headers and content for social engineering tactics.
-   **IP Investigation**: Performs reputation checks and attribution analysis on IP addresses.
-   **Log Analysis**: Breaks down complex log entries into human-readable explanations.
-   **Incident Investigation**: Provides a dedicated workspace for managing and auditing security cases.
-   **Threat Feed**: A real-time feed of global threat intelligence.
-   **AI Security Dashboard**: A high-level overview of security posture and metrics.

## Deployment
### Running Locally
1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Set up your `.env` file with `GROQ_API_KEY`.
4.  Run the development server: `npm run dev`.

### Vercel Deployment
The project is optimized for Vercel. Ensure that your `GROQ_API_KEY` environment variable is configured in the Vercel project settings.

## Security Notes
-   **API Key Protection**: The Groq API key is stored as a server-side environment variable and never exposed to the client.
-   **Safe Architecture**: All AI requests are handled via server-side API routes to prevent client-side tampering.
-   **Data Privacy**: Vigilant-AI is designed to analyze metadata and snippets. Avoid submitting highly sensitive PII in public demonstrations.

## Future Improvements
-   **Real Threat Intel Integration**: Connect to APIs like VirusTotal, AlienVault, or CrowdStrike.
-   **SIEM Integration**: Ability to ingest logs directly from Splunk or ELK stack.
-   **Live Monitoring**: Real-time WebSocket updates for the threat feed.
-   **User Authentication**: Multi-tenant support with role-based access control (RBAC).
-   **Alert Pipelines**: Automated notifications via Slack or Microsoft Teams when critical threats are detected.
