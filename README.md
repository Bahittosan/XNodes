# XNodes

<div align="left">
  <img src="assets/hero.jpg" alt="XNodes" width="800"/>
</div>

Short: XNodes is an autopilot for RPC providers. Smart routing, automatic failover, and cost optimization for multi-chain applications — solving unreliable and expensive RPCs so teams spend time on features, not infrastructure.

---

Submission to 2025 Solana Colosseum  
Submission by:  
- Bakhyt Adilova — https://github.com/Bahittosan · https://x.com/AdillBaqyt · https://www.linkedin.com/in/bakhyt-adill/ 

---

## Resources
- Presentation: https://link.to/presentation  
- Demo video: https://link.to/demo_video  
- Live dashboard (MVP): https://app.xnodes.dev  
- Project website: https://xnodes.dev  
- Social: https://twitter.com/xnodes_dev · https://t.me/xnodes_dev · https://linkedin.com/company/xnodes  
- SDK & examples: https://github.com/xnodes/sdk-examples

---

## Problem and solution

Problem
- RPC providers are unreliable: outages, timeouts and latency spikes (30–75% failures for some providers under peak load).  
- No unified place to compare provider quality and price — teams overpay and spend time debugging.  
- Multi-chain increases integration cost and complexity (10–20 hours per provider/endpoint).

Solution (XNodes)
- Smart Router between the app and a pool of RPC providers with a Policy Engine (health, latency, cost, quota, geo).  
- Automatic failover with circuit-breaker logic (switch within ~700 ms on failure or congestion).  
- Cost-aware routing — route by price + SLA.  
- Unified multi-chain SDK: one-line init and a single interface for Solana (priority), EVM, Aptos, Sui, etc.  
- CA‑CHECKER — session-hijack detection and security tagging.  
- Real-time telemetry, live logs and historical charts for audit and RCA.

Impact estimates
- RPC cost savings: ~30–40% via optimal routing.  
- Target availability: approach 99.95% through instant failover.  
- Engineer time on RPC integration: from hours to minutes.

---

## Summary of Submission Features
- One-line SDK init; compact SDKs (target ~5 MB)  
- Smart routing: health / latency / cost / geo / quota policies  
- Automatic provider failover and multi-chain failover  
- Cost optimization and SLA-aware routing  
- Telemetry: p50/p95 latency, error rates, uptime, historical graphs  
- Export (JSON / CSV), public dashboard (MVP)  
- CA‑CHECKER: session hijack detection  
- Enterprise roadmap: white-label, SAML, self-host, SLAs

---

## Tech Stack
- SDK / Client: TypeScript (Browser + Node)  
- Frontend: React 18 + TypeScript, Tailwind CSS, Recharts / Chart.js  
- Router / Edge: Node.js (Express) + Cloudflare Workers / Vercel Edge  
- Policy Engine: Go / Node (JSON-driven rules)  
- Telemetry: Prometheus / InfluxDB / Grafana  
- Storage: PostgreSQL (audit logs), object store for logs  
- CI/CD: GitHub Actions; Dependabot / Snyk  
- Hosting: Vercel (frontend), Railway / Kubernetes (backend), Cloudflare (WAF/CDN)  
- Security: TLS/HSTS, secret managers, RBAC, pre-commit scanning

---

## Architecture

<div align="left">
  <img src="./assets/architecture diagram.png" alt="Architecture diagram" width="800"/>
</div>

---

## Quick start

Local prototype (SDK + local Router). Repo structure assumed: /router, /sdk.

1. Clone the repo  
   git clone https://github.com/your-org/xnodes.git  
   cd xnodes

2. Run the router locally  
   cd router  
   npm install  
   cp .env.example .env    # fill XNODES_API_KEY, RPC_LIST  
   npm run dev

3. Run the SDK example client  
   cd ../sdk/examples/quickstart  
   npm install  
   npm run start

4. Open dashboard: http://localhost:3000/dashboard

Production notes: use a secret manager for keys, enable TLS, configure SLOs/SLAs, alerts and budget limits. For high throughput deploy Router to edge functions + autoscaling.

---

## Roadmap (12 months)
- Q1: Solana focus — SDK, SEP integrations (SEP-6/24/31/38/1/12/10/30/39), MVP front/back, 50 pilots  
- Q2: Multi-chain — EVM, Cosmos, Polkadot, SUI, Aptos, ICP; SDK + wallet integrations  
- Q3: B2B SaaS — team dashboards, SLAs, self-host, enterprise features  
- Q4: B2C Superapp — wallet, swap, send/receive; scale to 1k+ customers

---

## GTM & Monetization
GTM: sales-first for quick enterprise pilots + developer funnels via freemium SDK and partnerships with wallets and bridges. Sales team incentivized with tokens + fiat.

Monetization: per-session micro-pricing (example $0.00015 / session). Volume model: small margin at high volumes + enterprise SLA tiers.

---

## Quick checklist for judges
- MVP: public dashboard, live telemetry, provider comparison (Solana)  
- Integration: SDK + example (one-line init)  
- Security: CA‑CHECKER MVP, TLS, secret handling  
- Business: pricing model + enterprise roadmap

---

## Contributing

How to help:
- Fork and PR improvements for SDKs, provider integrations or dashboard  
- Open an issue to propose a new provider (URL, rate limits, auth)  
- Pilots and feedback:  Telegram @BahittoSan

Run locally:

```bash
git clone https://github.com/yourusername/xnodes.git
cd xnodes
# router
cd router && npm install && npm run dev
# sdk example
cd ../sdk/examples/quickstart && npm install && npm run start
```


