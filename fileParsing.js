import React, { useState, useRef, useEffect } from "react";
import {
  Scan, Upload, FileText, Github, MessageSquare, GitCompare, ChevronRight,
  AlertTriangle, CheckCircle2, XCircle, Loader2, Send, TrendingUp, Target,
  Zap, Award, DollarSign, Briefcase, Users, BarChart3, Sparkles, Key, X, Eye, EyeOff
} from "lucide-react";
import { extractTextFromFile } from "./fileParsing.js";

/* ---------------------------------- API key storage ---------------------------------- */

const LS_KEY = "resumescan_api_key";

function getStoredKey() {
  try { return localStorage.getItem(LS_KEY) || ""; } catch { return ""; }
}
function storeKey(key) {
  try { localStorage.setItem(LS_KEY, key); } catch {}
}
function clearStoredKey() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}

/* ---------------------------------- Claude API ---------------------------------- */

async function callClaude(apiKey, systemPrompt, userContent, maxTokens = 4096) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const msg = errBody?.error?.message || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }
  const data = await res.json();
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

function parseJSON(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const slice = start >= 0 && end >= 0 ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(slice);
}

const ANALYSIS_SYSTEM = `You are a senior technical recruiter and ATS systems expert with 15 years of hiring experience across AI, software engineering, and data roles. You analyze resumes with brutal honesty and specificity. You NEVER return anything except a single raw JSON object — no markdown fences, no preamble, no commentary before or after. Respond only in valid JSON matching exactly this schema:
{
 "candidateName": string,
 "atsScore": {"overall": number, "formatting": number, "sectionDetection": number, "contactInfo": number, "fileReadability": number, "keywordOptimization": number, "issues": [{"severity":"high|medium|low","text":string}]},
 "qualityScores": {"atsCompatibility": number, "technicalSkills": number, "experienceQuality": number, "projects": number, "grammar": number, "impactStatements": number, "overall": number},
 "jdMatch": null_or_object {"matchPercent": number, "found": [string], "missing": [string], "suggestedWording": [{"original": string, "suggested": string}]},
 "skillGap": {"current": [string], "recommended": [string]},
 "achievements": [{"original": string, "rewritten": string}],
 "starCheck": [{"item": string, "situation": boolean, "task": boolean, "action": boolean, "result": boolean, "note": string}],
 "actionVerbs": {"weakFound": [string], "suggestions": [string]},
 "keywordDensity": [{"keyword": string, "count": number}],
 "grammarIssues": [{"issue": string, "suggestion": string}],
 "recruiterHeatmap": [{"section": string, "rating": "excellent|needs_work|poor", "note": string}],
 "salaryPrediction": {"currency": string, "junior": {"min": number, "max": number}, "mid": {"min": number, "max": number}, "senior": {"min": number, "max": number}, "note": string},
 "careerLevel": {"title": string, "confidence": number},
 "missingSections": [string],
 "industryAnalysis": {"detectedRole": string, "notes": string},
 "careerRecommendations": {"goodFit": [string], "lessSuitable": [string]},
 "recruiterQuestions": [string],
 "summary": string
}
All numeric scores are 0-100 integers. Include up to 8 items per array where relevant. If no job description was provided, set "jdMatch" to null. Base the salary prediction on the likely region implied by the resume (or a generic US estimate if unclear), and say so in "note".`;

const CHAT_SYSTEM = `You are a senior technical recruiter continuing a conversation about a candidate's resume you already analyzed. You have the original resume, optional job description, and your structured analysis as context below. Answer the user's follow-up question directly and specifically, referencing concrete details from the resume. Keep responses under 150 words, plain text, no markdown headers. Be honest and constructive, not falsely encouraging.`;

const COMPARE_SYSTEM = `You are a senior technical recruiter comparing two resumes for the same target role. Return ONLY a raw JSON object, no fences, no commentary, matching exactly:
{"winner":"A|B|tie","reasoning":string,"scoreA":number,"scoreB":number,"categories":[{"name":string,"a":number,"b":number,"note":string}],"summary":string}
Scores are 0-100. Max 6 categories.`;

/* ---------------------------------- small UI bits ---------------------------------- */

function Ring({ value = 0, size = 88, stroke = 8, label, color }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="ring-wrap" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#221f33" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color || "url(#g)"}
          strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={off}
          strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.16,1,.3,1)" }}
        />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ring-center"><div className="ring-value">{value}</div></div>
      {label && <div className="ring-label">{label}</div>}
    </div>
  );
}

function Bar({ label, value, max, color }) {
  const pct = max ? Math.min(100, (value / max) * 100) : value;
  return (
    <div className="bar-row">
      <span className="bar-label">{label}</span>
      <div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%`, background: color || "linear-gradient(90deg,#a855f7,#ec4899)" }} /></div>
      <span className="bar-value">{typeof value === "number" && max ? value : `${value}`}</span>
    </div>
  );
}

function Chip({ children, tone = "neutral" }) {
  return <span className={`chip chip-${tone}`}>{children}</span>;
}

function RatingDot({ rating }) {
  const map = { excellent: "#34d399", needs_work: "#fbbf24", poor: "#f87171" };
  return <span className="rdot" style={{ background: map[rating] || "#666" }} />;
}

function SectionCard({ icon: Icon, title, children, eyebrow }) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-icon"><Icon size={16} /></div>
        <div>{eyebrow && <div className="card-eyebrow">{eyebrow}</div>}<h3>{title}</h3></div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function Scanner({ text }) {
  return (
    <div className="scanner">
      <div className="scanner-doc">
        {(text || "").slice(0, 900).split("\n").slice(0, 22).map((l, i) => (
          <div key={i} className="scanner-line" style={{ width: `${30 + ((i * 37) % 60)}%` }} />
        ))}
      </div>
      <div className="scanner-sweep" />
    </div>
  );
}

/** File upload button that extracts text from .txt/.pdf/.docx into a text setter. */
function FileUploadButton({ onExtracted, label = "Upload file" }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handle(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setErr(""); setBusy(true);
    try {
      const text = await extractTextFromFile(f);
      onExtracted(text, f.name);
    } catch (ex) {
      setErr(ex.message || "Couldn't read that file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="upload-inline">
      <button type="button" className="btn-ghost" onClick={() => ref.current?.click()} disabled={busy}>
        {busy ? <Loader2 size={14} className="spin" /> : <Upload size={14} />} {busy ? "Reading..." : label}
      </button>
      <input ref={ref} type="file" accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden onChange={handle} />
      {err && <div className="error" style={{ marginTop: 8 }}><AlertTriangle size={14} /> {err}</div>}
    </div>
  );
}

/* ---------------------------------- API key modal ---------------------------------- */

function ApiKeyModal({ open, onClose, apiKey, onSave }) {
  const [value, setValue] = useState(apiKey);
  const [show, setShow] = useState(false);
  useEffect(() => setValue(apiKey), [apiKey, open]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title"><Key size={16} /> Anthropic API key</div>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <p className="fine-print">
          This page runs entirely in your browser with no backend, so it calls the Anthropic API
          directly using a key you provide. Your key is stored only in this browser's local storage —
          it is never sent anywhere except api.anthropic.com. Anyone who can open this browser's
          dev tools can see it, so don't use this page on a shared or public computer with a key
          tied to real spending limits you care about.
        </p>
        <div className="key-input-row">
          <input
            className="text-input"
            type={show ? "text" : "password"}
            placeholder="sk-ant-..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="icon-btn" onClick={() => setShow((s) => !s)}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
        </div>
        <p className="fine-print">
          Get a key at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">console.anthropic.com/settings/keys</a>.
        </p>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={() => { clearStoredKey(); setValue(""); onSave(""); }}>Clear</button>
          <button className="btn-primary" style={{ marginTop: 0, width: "auto" }} onClick={() => { storeKey(value.trim()); onSave(value.trim()); onClose(); }}>Save key</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- main app ---------------------------------- */

export default function App() {
  const [apiKey, setApiKey] = useState(getStoredKey());
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [tab, setTab] = useState("analyze");

  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [ghUser, setGhUser] = useState("");
  const [ghData, setGhData] = useState(null);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError, setGhError] = useState("");

  const [cmpA, setCmpA] = useState("");
  const [cmpB, setCmpB] = useState("");
  const [cmpResult, setCmpResult] = useState(null);
  const [cmpLoading, setCmpLoading] = useState(false);
  const [cmpError, setCmpError] = useState("");

  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs]);

  function requireKey() {
    if (!apiKey) { setKeyModalOpen(true); return false; }
    return true;
  }

  async function runAnalysis() {
    if (!requireKey()) return;
    if (!resumeText.trim()) { setError("Paste or upload a resume before scanning."); return; }
    setLoading(true); setError(""); setAnalysis(null); setChatMsgs([]);
    try {
      const userContent = `RESUME:\n${resumeText}\n\n${jdText.trim() ? `JOB DESCRIPTION:\n${jdText}` : "No job description provided."}`;
      const raw = await callClaude(apiKey, ANALYSIS_SYSTEM, userContent);
      setAnalysis(parseJSON(raw));
    } catch (e) {
      setError(e.message || "Scan failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function runGithub() {
    if (!ghUser.trim()) { setGhError("Enter a GitHub username."); return; }
    setGhLoading(true); setGhError(""); setGhData(null);
    try {
      const uRes = await fetch(`https://api.github.com/users/${ghUser.trim()}`);
      if (!uRes.ok) throw new Error("not found");
      const user = await uRes.json();
      const rRes = await fetch(`https://api.github.com/users/${ghUser.trim()}/repos?per_page=100&sort=updated`);
      const repos = await rRes.json();
      const langs = {};
      let stars = 0, forks = 0, withDesc = 0, recentPush = 0;
      const now = Date.now();
      (repos || []).forEach((r) => {
        if (r.language) langs[r.language] = (langs[r.language] || 0) + 1;
        stars += r.stargazers_count || 0;
        forks += r.forks_count || 0;
        if (r.description) withDesc += 1;
        if (r.pushed_at && now - new Date(r.pushed_at).getTime() < 1000 * 60 * 60 * 24 * 90) recentPush += 1;
      });
      const repoCount = (repos || []).length;
      const activityScore = Math.min(100, recentPush * 12);
      const docScore = repoCount ? Math.round((withDesc / repoCount) * 100) : 0;
      const popularityScore = Math.min(100, stars * 3 + forks * 2);
      const diversityScore = Math.min(100, Object.keys(langs).length * 15);
      const overall = Math.round((activityScore + docScore + popularityScore + diversityScore) / 4);
      setGhData({
        user, repoCount, stars, forks, langs,
        scores: { activity: activityScore, documentation: docScore, popularity: popularityScore, diversity: diversityScore, overall },
        topRepos: (repos || []).sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)).slice(0, 5),
      });
    } catch (e) {
      setGhError("Couldn't find that GitHub user, or GitHub's API is rate-limiting this browser session.");
    } finally {
      setGhLoading(false);
    }
  }

  async function runCompare() {
    if (!requireKey()) return;
    if (!cmpA.trim() || !cmpB.trim()) { setCmpError("Paste or upload both resumes to compare."); return; }
    setCmpLoading(true); setCmpError(""); setCmpResult(null);
    try {
      const raw = await callClaude(apiKey, COMPARE_SYSTEM, `RESUME A:\n${cmpA}\n\nRESUME B:\n${cmpB}`);
      setCmpResult(parseJSON(raw));
    } catch (e) {
      setCmpError(e.message || "Comparison failed. Try again.");
    } finally {
      setCmpLoading(false);
    }
  }

  async function sendChat() {
    if (!requireKey()) return;
    const q = chatInput.trim();
    if (!q || !analysis) return;
    const next = [...chatMsgs, { role: "user", text: q }];
    setChatMsgs(next); setChatInput(""); setChatLoading(true);
    try {
      const context = `RESUME:\n${resumeText}\n\n${jdText.trim() ? `JOB DESCRIPTION:\n${jdText}\n\n` : ""}ANALYSIS JSON:\n${JSON.stringify(analysis)}\n\nCONVERSATION SO FAR:\n${next.map((m) => `${m.role}: ${m.text}`).join("\n")}\n\nRespond to the latest user message.`;
      const raw = await callClaude(apiKey, CHAT_SYSTEM, context, 800);
      setChatMsgs((prev) => [...prev, { role: "assistant", text: raw.trim() }]);
    } catch (e) {
      setChatMsgs((prev) => [...prev, { role: "assistant", text: `Error: ${e.message || "couldn't reach the model."}` }]);
    } finally {
      setChatLoading(false);
    }
  }

  const tabs = [
    { id: "analyze", label: "Scan", icon: Scan },
    { id: "github", label: "GitHub", icon: Github },
    { id: "compare", label: "Compare", icon: GitCompare },
    { id: "chat", label: "Ask", icon: MessageSquare, disabled: !analysis },
  ];

  return (
    <div className="app">
      <ApiKeyModal open={keyModalOpen} onClose={() => setKeyModalOpen(false)} apiKey={apiKey} onSave={setApiKey} />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Scan size={18} /></div>
          <div>
            <div className="brand-name">RESUME<span>SCAN</span></div>
            <div className="brand-sub">ats analysis // hiring signal detection</div>
          </div>
        </div>
        <nav className="tabs">
          {tabs.map((t) => (
            <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} disabled={t.disabled} onClick={() => setTab(t.id)}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </nav>
        <button className="btn-ghost key-btn" onClick={() => setKeyModalOpen(true)}>
          <Key size={14} /> {apiKey ? "API key set" : "Set API key"}
        </button>
      </header>

      {/* ---------------- ANALYZE TAB ---------------- */}
      {tab === "analyze" && (
        <div className="layout">
          <div className="panel">
            <label className="field-label">Resume</label>
            <textarea className="textarea" placeholder="Paste resume text, or upload a file below..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={13} />
            <div className="upload-row">
              <FileUploadButton label="Upload .txt / .pdf / .docx" onExtracted={(text) => setResumeText(text)} />
              <span className="hint">{resumeText.length.toLocaleString()} chars</span>
            </div>

            <label className="field-label" style={{ marginTop: 18 }}>Job description (optional)</label>
            <textarea className="textarea" placeholder="Paste the target job description to get a match score..." value={jdText} onChange={(e) => setJdText(e.target.value)} rows={7} />
            <div className="upload-row"><FileUploadButton label="Upload JD file" onExtracted={(text) => setJdText(text)} /></div>

            <button className="btn-primary" onClick={runAnalysis} disabled={loading}>
              {loading ? <Loader2 size={16} className="spin" /> : <Zap size={16} />} {loading ? "Scanning..." : "Run full scan"}
            </button>
            {error && <div className="error"><AlertTriangle size={14} /> {error}</div>}
          </div>

          <div className="results">
            {loading && (
              <div className="loading-block">
                <Scanner text={resumeText} />
                <div className="loading-text">Reading sections, scoring impact, cross-checking keywords...</div>
              </div>
            )}

            {!loading && !analysis && (
              <div className="empty">
                <FileText size={28} />
                <p>Paste or upload a resume and run a scan to see the full breakdown — ATS score, skill gaps, rewritten bullets, recruiter simulation, and more.</p>
              </div>
            )}

            {!loading && analysis && (
              <div className="report">
                <div className="report-hero">
                  <div>
                    <div className="hero-eyebrow">{analysis.industryAnalysis?.detectedRole || "Candidate"}</div>
                    <h2>{analysis.candidateName || "Resume Report"}</h2>
                    <p className="hero-summary">{analysis.summary}</p>
                  </div>
                  <Ring value={analysis.qualityScores?.overall ?? 0} label="Overall" size={110} />
                </div>

                <SectionCard icon={Target} title="ATS Compatibility" eyebrow="Section 1">
                  <div className="ring-row">
                    <Ring value={analysis.atsScore?.overall ?? 0} label="Overall" size={72} />
                    <Ring value={analysis.atsScore?.formatting ?? 0} label="Formatting" size={72} />
                    <Ring value={analysis.atsScore?.sectionDetection ?? 0} label="Sections" size={72} />
                    <Ring value={analysis.atsScore?.contactInfo ?? 0} label="Contact" size={72} />
                    <Ring value={analysis.atsScore?.fileReadability ?? 0} label="Readability" size={72} />
                    <Ring value={analysis.atsScore?.keywordOptimization ?? 0} label="Keywords" size={72} />
                  </div>
                  {analysis.atsScore?.issues?.length > 0 && (
                    <ul className="issue-list">
                      {analysis.atsScore.issues.map((it, i) => (
                        <li key={i}><Chip tone={it.severity === "high" ? "danger" : it.severity === "medium" ? "warn" : "neutral"}>{it.severity}</Chip>{it.text}</li>
                      ))}
                    </ul>
                  )}
                </SectionCard>

                <SectionCard icon={BarChart3} title="Resume Quality Breakdown" eyebrow="Section 2">
                  {Object.entries(analysis.qualityScores || {}).filter(([k]) => k !== "overall").map(([k, v]) => (
                    <Bar key={k} label={k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())} value={v} max={100} />
                  ))}
                </SectionCard>

                {analysis.jdMatch && (
                  <SectionCard icon={Briefcase} title="Job Description Match" eyebrow="Section 3">
                    <Bar label="Match" value={analysis.jdMatch.matchPercent} max={100} color="linear-gradient(90deg,#34d399,#a855f7)" />
                    <div className="two-col">
                      <div><div className="mini-head">Found</div>{analysis.jdMatch.found?.map((s, i) => <Chip key={i} tone="good"><CheckCircle2 size={11} /> {s}</Chip>)}</div>
                      <div><div className="mini-head">Missing</div>{analysis.jdMatch.missing?.map((s, i) => <Chip key={i} tone="danger"><XCircle size={11} /> {s}</Chip>)}</div>
                    </div>
                    {analysis.jdMatch.suggestedWording?.length > 0 && (
                      <div className="rewrite-list">
                        {analysis.jdMatch.suggestedWording.map((w, i) => (
                          <div className="rewrite-item" key={i}><div className="rw-before">{w.original}</div><ChevronRight size={13} className="rw-arrow" /><div className="rw-after">{w.suggested}</div></div>
                        ))}
                      </div>
                    )}
                  </SectionCard>
                )}

                <SectionCard icon={TrendingUp} title="Skill Gap Analysis" eyebrow="Section 4">
                  <div className="two-col">
                    <div><div className="mini-head">Current skills</div>{analysis.skillGap?.current?.map((s, i) => <Chip key={i}>{s}</Chip>)}</div>
                    <div><div className="mini-head">Recommended next</div>{analysis.skillGap?.recommended?.map((s, i) => <Chip key={i} tone="accent">{s}</Chip>)}</div>
                  </div>
                </SectionCard>

                <SectionCard icon={Sparkles} title="Achievement & Bullet Rewrites" eyebrow="Sections 5–6">
                  <div className="rewrite-list">
                    {analysis.achievements?.map((a, i) => (
                      <div className="rewrite-block" key={i}><div className="rw-before">✗ {a.original}</div><div className="rw-after">✓ {a.rewritten}</div></div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard icon={CheckCircle2} title="STAR Method Check" eyebrow="Section 7">
                  {analysis.starCheck?.map((s, i) => (
                    <div className="star-row" key={i}>
                      <div className="star-title">{s.item}</div>
                      <div className="star-dots">{["situation", "task", "action", "result"].map((k) => (<span key={k} className={`star-dot ${s[k] ? "on" : ""}`} title={k}>{k[0].toUpperCase()}</span>))}</div>
                      <div className="star-note">{s.note}</div>
                    </div>
                  ))}
                </SectionCard>

                <SectionCard icon={Zap} title="Action Verb Analysis" eyebrow="Section 8">
                  <div className="two-col">
                    <div><div className="mini-head">Weak verbs found</div>{analysis.actionVerbs?.weakFound?.map((s, i) => <Chip key={i} tone="danger">{s}</Chip>)}</div>
                    <div><div className="mini-head">Use instead</div>{analysis.actionVerbs?.suggestions?.map((s, i) => <Chip key={i} tone="good">{s}</Chip>)}</div>
                  </div>
                </SectionCard>

                <SectionCard icon={BarChart3} title="Keyword Density" eyebrow="Section 9">
                  {analysis.keywordDensity?.map((k, i) => (
                    <Bar key={i} label={k.keyword} value={k.count} max={Math.max(...(analysis.keywordDensity.map((x) => x.count) || [1]))} />
                  ))}
                </SectionCard>

                <SectionCard icon={FileText} title="Grammar & Readability" eyebrow="Section 10">
                  <ul className="issue-list">{analysis.grammarIssues?.map((g, i) => (<li key={i}><strong>{g.issue}</strong> — {g.suggestion}</li>))}</ul>
                </SectionCard>

                <SectionCard icon={Users} title="Recruiter Attention Heatmap" eyebrow="Section 11">
                  {analysis.recruiterHeatmap?.map((h, i) => (
                    <div className="heat-row" key={i}><RatingDot rating={h.rating} /><span className="heat-section">{h.section}</span><span className="heat-note">{h.note}</span></div>
                  ))}
                </SectionCard>

                <div className="grid-2">
                  <SectionCard icon={DollarSign} title="Salary Prediction" eyebrow="Section 12">
                    {analysis.salaryPrediction && (
                      <>
                        {["junior", "mid", "senior"].map((lvl) => (
                          <div className="salary-row" key={lvl}>
                            <span className="salary-lvl">{lvl}</span>
                            <span className="salary-range">{analysis.salaryPrediction.currency} {analysis.salaryPrediction[lvl]?.min?.toLocaleString()} – {analysis.salaryPrediction[lvl]?.max?.toLocaleString()}</span>
                          </div>
                        ))}
                        <p className="fine-print">{analysis.salaryPrediction.note}</p>
                      </>
                    )}
                  </SectionCard>

                  <SectionCard icon={Award} title="Career Level" eyebrow="Section 13">
                    <div className="level-block">
                      <div className="level-title">{analysis.careerLevel?.title}</div>
                      <div className="level-conf">Confidence {analysis.careerLevel?.confidence}%</div>
                    </div>
                  </SectionCard>
                </div>

                <SectionCard icon={AlertTriangle} title="Missing Sections" eyebrow="Section 17">
                  {analysis.missingSections?.length ? analysis.missingSections.map((s, i) => <Chip key={i} tone="warn">{s}</Chip>) : <span className="hint">Nothing critical missing.</span>}
                </SectionCard>

                <SectionCard icon={Briefcase} title="Industry Fit & Career Recommendations" eyebrow="Sections 18–19">
                  <p className="fine-print">{analysis.industryAnalysis?.notes}</p>
                  <div className="two-col">
                    <div><div className="mini-head">Good fit</div>{analysis.careerRecommendations?.goodFit?.map((s, i) => <Chip key={i} tone="good">✓ {s}</Chip>)}</div>
                    <div><div className="mini-head">Less suitable</div>{analysis.careerRecommendations?.lessSuitable?.map((s, i) => <Chip key={i} tone="danger">✗ {s}</Chip>)}</div>
                  </div>
                </SectionCard>

                <SectionCard icon={Users} title="Recruiter Simulation" eyebrow="Section 16">
                  <ol className="q-list">{analysis.recruiterQuestions?.map((q, i) => <li key={i}>{q}</li>)}</ol>
                </SectionCard>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- GITHUB TAB ---------------- */}
      {tab === "github" && (
        <div className="layout">
          <div className="panel">
            <label className="field-label">GitHub username</label>
            <div className="inline-input">
              <input className="text-input" placeholder="e.g. octocat" value={ghUser} onChange={(e) => setGhUser(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runGithub()} />
              <button className="btn-primary" onClick={runGithub} disabled={ghLoading}>{ghLoading ? <Loader2 size={16} className="spin" /> : <Github size={16} />} Scan</button>
            </div>
            {ghError && <div className="error"><AlertTriangle size={14} /> {ghError}</div>}
            <p className="fine-print" style={{ marginTop: 14 }}>Pulls live public data from the GitHub API — repo count, stars, forks, language spread, and recent commit activity — to score a candidate's portfolio. No API key needed for this tab.</p>
          </div>

          <div className="results">
            {!ghData && !ghLoading && (<div className="empty"><Github size={28} /><p>Enter a GitHub username to generate a live portfolio score.</p></div>)}
            {ghData && (
              <div className="report">
                <div className="report-hero">
                  <div>
                    <div className="hero-eyebrow">@{ghData.user.login}</div>
                    <h2>{ghData.user.name || ghData.user.login}</h2>
                    <p className="hero-summary">{ghData.user.bio || "No bio provided."}</p>
                  </div>
                  <Ring value={ghData.scores.overall} label="GitHub score" size={110} />
                </div>

                <SectionCard icon={BarChart3} title="Portfolio Breakdown">
                  <div className="ring-row">
                    <Ring value={ghData.scores.activity} label="Activity" size={80} />
                    <Ring value={ghData.scores.documentation} label="Docs" size={80} />
                    <Ring value={ghData.scores.popularity} label="Popularity" size={80} />
                    <Ring value={ghData.scores.diversity} label="Language mix" size={80} />
                  </div>
                  <div className="stat-strip">
                    <div><strong>{ghData.repoCount}</strong> public repos</div>
                    <div><strong>{ghData.stars}</strong> stars</div>
                    <div><strong>{ghData.forks}</strong> forks</div>
                    <div><strong>{ghData.user.followers}</strong> followers</div>
                  </div>
                </SectionCard>

                <SectionCard icon={FileText} title="Languages">
                  {Object.entries(ghData.langs).sort((a, b) => b[1] - a[1]).map(([lang, count]) => (<Bar key={lang} label={lang} value={count} max={Math.max(...Object.values(ghData.langs))} />))}
                </SectionCard>

                <SectionCard icon={Award} title="Top Repositories">
                  {ghData.topRepos.map((r) => (
                    <div className="repo-row" key={r.id}>
                      <div><div className="repo-name">{r.name}</div><div className="repo-desc">{r.description || "No description."}</div></div>
                      <div className="repo-stats"><span>★ {r.stargazers_count}</span><span>{r.language || "—"}</span></div>
                    </div>
                  ))}
                </SectionCard>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- COMPARE TAB ---------------- */}
      {tab === "compare" && (
        <div className="layout">
          <div className="panel wide">
            <div className="two-col">
              <div>
                <label className="field-label">Resume A</label>
                <textarea className="textarea" rows={11} value={cmpA} onChange={(e) => setCmpA(e.target.value)} placeholder="Paste or upload resume A..." />
                <div className="upload-row"><FileUploadButton label="Upload file" onExtracted={(text) => setCmpA(text)} /></div>
              </div>
              <div>
                <label className="field-label">Resume B</label>
                <textarea className="textarea" rows={11} value={cmpB} onChange={(e) => setCmpB(e.target.value)} placeholder="Paste or upload resume B..." />
                <div className="upload-row"><FileUploadButton label="Upload file" onExtracted={(text) => setCmpB(text)} /></div>
              </div>
            </div>
            <button className="btn-primary" onClick={runCompare} disabled={cmpLoading}>{cmpLoading ? <Loader2 size={16} className="spin" /> : <GitCompare size={16} />} {cmpLoading ? "Comparing..." : "Compare resumes"}</button>
            {cmpError && <div className="error"><AlertTriangle size={14} /> {cmpError}</div>}
          </div>

          <div className="results">
            {!cmpResult && !cmpLoading && (<div className="empty"><GitCompare size={28} /><p>Paste or upload two resumes to see which is stronger, category by category.</p></div>)}
            {cmpResult && (
              <div className="report">
                <div className="report-hero">
                  <div>
                    <div className="hero-eyebrow">Head to head</div>
                    <h2>Winner: Resume {cmpResult.winner === "tie" ? "— tie" : cmpResult.winner}</h2>
                    <p className="hero-summary">{cmpResult.reasoning}</p>
                  </div>
                  <div className="ring-row"><Ring value={cmpResult.scoreA} label="Resume A" size={90} /><Ring value={cmpResult.scoreB} label="Resume B" size={90} /></div>
                </div>
                <SectionCard icon={BarChart3} title="Category Comparison">
                  {cmpResult.categories?.map((c, i) => (
                    <div key={i} className="cmp-row"><div className="cmp-name">{c.name}</div><Bar label="A" value={c.a} max={100} /><Bar label="B" value={c.b} max={100} /><div className="fine-print">{c.note}</div></div>
                  ))}
                </SectionCard>
                <SectionCard icon={FileText} title="Summary"><p className="fine-print">{cmpResult.summary}</p></SectionCard>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- CHAT TAB ---------------- */}
      {tab === "chat" && (
        <div className="chat-layout">
          <div className="chat-window">
            {chatMsgs.length === 0 && (<div className="empty"><MessageSquare size={28} /><p>Ask anything about this resume — "why is my ATS score low?", "rewrite my summary", "is this enough for a senior role?"</p></div>)}
            {chatMsgs.map((m, i) => (<div key={i} className={`msg ${m.role}`}><div className="msg-bubble">{m.text}</div></div>))}
            {chatLoading && <div className="msg assistant"><div className="msg-bubble"><Loader2 size={14} className="spin" /></div></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-row">
            <input className="text-input" placeholder="Ask a question about your resume..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} />
            <button className="btn-primary" onClick={sendChat} disabled={chatLoading}><Send size={16} /></button>
          </div>
        </div>
      )}

      <footer className="footer">ResumeScan runs fully client-side. Your resume text and API key never leave your browser except in direct calls to api.anthropic.com and api.github.com.</footer>
    </div>
  );
}
