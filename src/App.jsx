import React, { useState } from "react";
import SolutionUploader from "./components/SolutionUploader";
import TestCases from "./components/TestCases";
import {
  CheckCircle2,
  AlertCircle,
  Circle,
  Database,
  Folder,
  Mail,
  Cloud,
  HardDrive,
  ChevronDown,
  ArrowRight,
  Lock,
} from "lucide-react";

export default function ManifestPortalMockup() {
  const [activeTab, setActiveTab] = useState("setup"); // "setup" | "testcases"

  const connections = [
    { name: "SharePoint", icon: Folder, status: "connected" },
    { name: "Dataverse", icon: Database, status: "connected" },
    { name: "Outlook", icon: Mail, status: "connected" },
    { name: "OneDrive", icon: Cloud, status: "disconnected" },
  ];

  return (
    <div className="mf-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .mf-root {
          --bg: #0d121d;
          --panel: #151c2b;
          --panel-raised: #1a2233;
          --border: #28324a;
          --border-soft: #202940;
          --text: #e9edf6;
          --text-dim: #8b95ac;
          --text-faint: #5b6580;
          --accent: #5b9dff;
          --accent-dim: #2c4a7c;
          --ok: #38d9a9;
          --ok-dim: rgba(56, 217, 169, 0.12);
          --warn: #f2a94e;
          --warn-dim: rgba(242, 169, 78, 0.12);
          --mono: 'JetBrains Mono', ui-monospace, monospace;
          --sans: 'IBM Plex Sans', system-ui, sans-serif;

          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          min-height: 100vh;
          padding: 32px 20px 60px;
          box-sizing: border-box;
        }
        .mf-root * { box-sizing: border-box; }
        .mf-shell { max-width: 980px; margin: 0 auto; }

        .mf-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .mf-brand { display: flex; align-items: center; gap: 12px; }
        .mf-mark {
          width: 34px; height: 34px; border-radius: 8px;
          background: linear-gradient(135deg, var(--accent), #7b6bf0);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--mono); font-weight: 600; font-size: 15px; color: #0d121d;
          flex-shrink: 0;
        }
        .mf-brand-text h1 { font-size: 17px; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
        .mf-brand-text p { font-size: 12.5px; color: var(--text-dim); margin: 2px 0 0; }
        .mf-env {
          display: flex; align-items: center; gap: 6px;
          background: var(--panel); border: 1px solid var(--border);
          padding: 7px 12px; border-radius: 7px;
          font-size: 13px; color: var(--text-dim); cursor: pointer;
          font-family: var(--mono);
        }
        .mf-env:hover { border-color: var(--accent-dim); color: var(--text); }
        .mf-env:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .mf-tabs {
          display: flex; gap: 4px;
          background: var(--panel); border: 1px solid var(--border-soft);
          border-radius: 9px; padding: 4px; margin-bottom: 20px;
          width: fit-content;
        }
        .mf-tab {
          font-family: var(--sans); font-size: 13px; font-weight: 500;
          color: var(--text-dim); background: transparent; border: none;
          padding: 8px 16px; border-radius: 6px; cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .mf-tab:hover { color: var(--text); }
        .mf-tab.active { background: var(--accent-dim); color: var(--text); }
        .mf-tab:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .mf-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 760px) {
          .mf-grid { grid-template-columns: 1fr; }
        }

        .mf-card {
          background: var(--panel);
          border: 1px solid var(--border-soft);
          border-radius: 12px;
          padding: 20px;
        }
        .mf-step-label {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--text-faint);
          margin: 0 0 4px;
        }
        .mf-card-title { font-size: 15px; font-weight: 600; margin: 0 0 16px; }

        .mf-hint {
          font-size: 11.5px; color: var(--text-faint); margin: 10px 2px 0;
          font-family: var(--mono);
        }

        .mf-conn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 420px) { .mf-conn-grid { grid-template-columns: 1fr; } }

        .mf-conn-card {
          border: 1px solid var(--border-soft);
          background: var(--panel-raised);
          border-radius: 9px;
          padding: 13px;
        }
        .mf-conn-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .mf-conn-icon {
          width: 28px; height: 28px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04); color: var(--text-dim);
        }
        .mf-conn-name { font-size: 13px; font-weight: 500; margin: 0 0 8px; }
        .mf-pill {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-family: var(--mono); padding: 3px 8px; border-radius: 100px;
        }
        .mf-pill.connected { background: var(--ok-dim); color: var(--ok); }
        .mf-pill.disconnected { background: rgba(255,255,255,0.05); color: var(--text-faint); }
        .mf-pill.warn { background: var(--warn-dim); color: var(--warn); }
        .mf-connect-btn {
          margin-top: 8px; width: 100%; background: transparent; border: 1px solid var(--border);
          color: var(--text-dim); font-size: 12px; padding: 6px; border-radius: 6px; cursor: pointer;
          font-family: var(--sans);
        }
        .mf-connect-btn:hover { border-color: var(--accent); color: var(--text); }
        .mf-connect-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .mf-mysql-card {
          grid-column: 1 / -1;
          border: 1px solid var(--border-soft);
          background: var(--panel-raised);
          border-radius: 9px;
          padding: 13px;
        }
        .mf-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
        .mf-field label {
          display: block; font-size: 10.5px; color: var(--text-faint);
          font-family: var(--mono); letter-spacing: 0.04em; margin-bottom: 4px;
        }
        .mf-field input {
          width: 100%; background: #0a0e17; border: 1px solid var(--border);
          color: var(--text); font-size: 12.5px; padding: 7px 9px; border-radius: 6px;
          font-family: var(--mono);
        }
        .mf-field input:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
        .mf-field input::placeholder { color: var(--text-faint); }
        .mf-verify-btn {
          margin-top: 10px; background: var(--warn-dim); border: 1px solid rgba(242,169,78,0.35);
          color: var(--warn); font-size: 12px; padding: 7px 12px; border-radius: 6px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px; font-family: var(--sans); font-weight: 500;
        }
        .mf-verify-btn:hover { background: rgba(242,169,78,0.2); }
        .mf-verify-btn:focus-visible { outline: 2px solid var(--warn); outline-offset: 2px; }

        .mf-footer {
          margin-top: 22px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 14px;
          padding-top: 18px; border-top: 1px solid var(--border-soft);
        }
        .mf-progress { display: flex; align-items: center; gap: 10px; }
        .mf-progress-track {
          width: 120px; height: 5px; border-radius: 100px; background: #1c2536; overflow: hidden;
        }
        .mf-progress-fill { height: 100%; width: 60%; background: linear-gradient(90deg, var(--ok), var(--accent)); }
        .mf-progress-text { font-size: 12.5px; color: var(--text-dim); font-family: var(--mono); }

        .mf-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--border-soft); color: var(--text-faint);
          font-size: 13.5px; font-weight: 500; padding: 10px 18px; border-radius: 8px;
          border: none; cursor: not-allowed;
        }
        .mf-cta-active {
          background: var(--accent); color: #0d121d; cursor: pointer;
        }
        .mf-cta-active:hover { background: #6ba8ff; }
        .mf-cta-active:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      `}</style>

      <div className="mf-shell">
        <header className="mf-header">
          <div className="mf-brand">
            <div className="mf-mark">M</div>
            <div className="mf-brand-text">
              <h1>Manifest</h1>
              <p>Power Platform test intake</p>
            </div>
          </div>
          <div className="mf-env" tabIndex={0}>
            Contoso · UAT
            <ChevronDown size={14} />
          </div>
        </header>

        <div className="mf-tabs">
          <button
            className={`mf-tab${activeTab === "setup" ? " active" : ""}`}
            onClick={() => setActiveTab("setup")}
          >
            Setup
          </button>
          <button
            className={`mf-tab${activeTab === "testcases" ? " active" : ""}`}
            onClick={() => setActiveTab("testcases")}
          >
            QA Test cases
          </button>
        </div>

        {activeTab === "testcases" ? (
          <div className="mf-card">
            <p className="mf-step-label">STEP 03</p>
            <h2 className="mf-card-title">QA test cases</h2>
            <TestCases />
          </div>
        ) : (
          <>
            <div className="mf-grid">
              {/* Left column: upload + manifest scan */}
              <div className="mf-card">
                <p className="mf-step-label">STEP 01</p>
                <h2 className="mf-card-title">Solution package</h2>

                <SolutionUploader onParsed={(result) => console.log("Parsed solution:", result)} />
                <p className="mf-hint">
                  export as managed or unmanaged from make.powerapps.com
                </p>
              </div>

              {/* Right column: data source connections */}
              <div className="mf-card">
                <p className="mf-step-label">STEP 02</p>
                <h2 className="mf-card-title">Data sources</h2>

                <div className="mf-conn-grid">
                  {connections.map((c) => {
                    const Icon = c.icon;
                    const connected = c.status === "connected";
                    return (
                      <div className="mf-conn-card" key={c.name}>
                        <div className="mf-conn-top">
                          <div className="mf-conn-icon">
                            <Icon size={15} />
                          </div>
                          {connected ? (
                            <CheckCircle2 size={15} color="#38d9a9" />
                          ) : (
                            <Circle size={15} color="#5b6580" />
                          )}
                        </div>
                        <p className="mf-conn-name">{c.name}</p>
                        {connected ? (
                          <span className="mf-pill connected">connected</span>
                        ) : (
                          <>
                            <span className="mf-pill disconnected">not connected</span>
                            <button className="mf-connect-btn">Connect</button>
                          </>
                        )}
                      </div>
                    );
                  })}

                  <div className="mf-mysql-card">
                    <div className="mf-conn-top">
                      <div className="mf-conn-icon">
                        <HardDrive size={15} />
                      </div>
                      <AlertCircle size={15} color="#f2a94e" />
                    </div>
                    <p className="mf-conn-name">MySQL database</p>
                    <span className="mf-pill warn">needs credentials</span>

                    <div className="mf-form-row">
                      <div className="mf-field">
                        <label>Host</label>
                        <input placeholder="db.internal.contoso.com" />
                      </div>
                      <div className="mf-field">
                        <label>Database</label>
                        <input placeholder="expense_prod" />
                      </div>
                      <div className="mf-field">
                        <label>Username</label>
                        <input placeholder="svc_qa_reader" />
                      </div>
                      <div className="mf-field">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••••" />
                      </div>
                    </div>
                    <button className="mf-verify-btn">
                      <Lock size={12} />
                      Verify connection
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mf-footer">
              <div className="mf-progress">
                <div className="mf-progress-track">
                  <div className="mf-progress-fill" />
                </div>
                <span className="mf-progress-text">3 of 5 connected</span>
              </div>
              <button className="mf-cta mf-cta-active" onClick={() => setActiveTab("testcases")}>
                Continue to test cases
                <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}