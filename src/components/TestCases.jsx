import React, { useState } from "react";
import { Plus, Trash2, ClipboardList } from "lucide-react";

let nextId = 1;
const makeId = () => `tc-${nextId++}-${Date.now()}`;

const STATUS_OPTIONS = ["Not run", "Pass", "Fail", "Blocked"];

function emptyCase() {
  return {
    id: makeId(),
    title: "",
    steps: "",
    expected: "",
    status: "Not run",
  };
}

export default function TestCases() {
  const [cases, setCases] = useState([emptyCase()]);

  const updateCase = (id, field, value) => {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const addCase = () => {
    setCases((prev) => [...prev, emptyCase()]);
  };

  const removeCase = (id) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
  };

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = cases.filter((c) => c.status === s).length;
    return acc;
  }, {});

  return (
    <div className="tc-wrap">
      <style>{`
        .tc-wrap {
          --tc-accent: var(--accent, #5b9dff);
          --tc-ok: var(--ok, #38d9a9);
          --tc-warn: var(--warn, #f2a94e);
          --tc-fail: #f2644e;
          --tc-border: var(--border, #28324a);
          --tc-border-soft: var(--border-soft, #202940);
          --tc-panel-raised: var(--panel-raised, #1a2233);
          --tc-text: var(--text, #e9edf6);
          --tc-text-dim: var(--text-dim, #8b95ac);
          --tc-text-faint: var(--text-faint, #5b6580);
          --tc-mono: var(--mono, 'JetBrains Mono', ui-monospace, monospace);
          --tc-sans: var(--sans, system-ui, sans-serif);
          font-family: var(--tc-sans);
          color: var(--tc-text);
        }

        .tc-summary {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .tc-summary-item {
          font-family: var(--tc-mono); font-size: 12px; color: var(--tc-text-dim);
          display: flex; align-items: center; gap: 6px;
        }
        .tc-dot {
          width: 7px; height: 7px; border-radius: 50%; display: inline-block;
        }
        .tc-dot.pass { background: var(--tc-ok); }
        .tc-dot.fail { background: var(--tc-fail); }
        .tc-dot.blocked { background: var(--tc-warn); }
        .tc-dot.notrun { background: var(--tc-text-faint); }

        .tc-list { display: flex; flex-direction: column; gap: 12px; }

        .tc-case {
          border: 1px solid var(--tc-border-soft);
          background: var(--tc-panel-raised);
          border-radius: 10px;
          padding: 14px 16px;
        }
        .tc-case-top {
          display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
        }
        .tc-index {
          font-family: var(--tc-mono); font-size: 11px; color: var(--tc-text-faint);
          flex-shrink: 0;
        }
        .tc-title-input {
          flex: 1;
          background: transparent; border: none; border-bottom: 1px solid transparent;
          color: var(--tc-text); font-size: 14px; font-weight: 500;
          padding: 4px 2px; font-family: var(--tc-sans);
        }
        .tc-title-input::placeholder { color: var(--tc-text-faint); font-weight: 400; }
        .tc-title-input:focus { outline: none; border-bottom-color: var(--tc-accent); }

        .tc-status-select {
          background: #0a0e17; border: 1px solid var(--tc-border);
          color: var(--tc-text-dim); font-size: 11.5px; font-family: var(--tc-mono);
          padding: 5px 8px; border-radius: 6px; cursor: pointer; flex-shrink: 0;
        }
        .tc-status-select:focus-visible { outline: 2px solid var(--tc-accent); outline-offset: 1px; }

        .tc-delete-btn {
          background: transparent; border: none; color: var(--tc-text-faint);
          cursor: pointer; padding: 4px; border-radius: 5px; flex-shrink: 0;
          display: flex; align-items: center;
        }
        .tc-delete-btn:hover { color: var(--tc-fail); background: rgba(242,100,78,0.1); }
        .tc-delete-btn:focus-visible { outline: 2px solid var(--tc-fail); outline-offset: 1px; }

        .tc-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 560px) { .tc-fields { grid-template-columns: 1fr; } }

        .tc-field label {
          display: block; font-size: 10.5px; color: var(--tc-text-faint);
          font-family: var(--tc-mono); letter-spacing: 0.04em; margin-bottom: 4px;
        }
        .tc-field textarea {
          width: 100%; min-height: 60px; resize: vertical;
          background: #0a0e17; border: 1px solid var(--tc-border);
          color: var(--tc-text); font-size: 12.5px; padding: 8px 9px; border-radius: 6px;
          font-family: var(--tc-sans); line-height: 1.4;
        }
        .tc-field textarea::placeholder { color: var(--tc-text-faint); }
        .tc-field textarea:focus-visible { outline: 2px solid var(--tc-accent); outline-offset: 1px; }

        .tc-add-btn {
          margin-top: 14px;
          display: inline-flex; align-items: center; gap: 7px;
          background: transparent; border: 1px dashed var(--tc-border);
          color: var(--tc-text-dim); font-size: 13px; font-weight: 500;
          padding: 10px 14px; border-radius: 8px; cursor: pointer;
          font-family: var(--tc-sans); width: 100%; justify-content: center;
        }
        .tc-add-btn:hover { border-color: var(--tc-accent); color: var(--tc-text); }
        .tc-add-btn:focus-visible { outline: 2px solid var(--tc-accent); outline-offset: 2px; }

        .tc-empty {
          text-align: center; padding: 40px 20px; color: var(--tc-text-faint);
          font-size: 13px;
        }
        .tc-empty svg { margin-bottom: 10px; opacity: 0.6; }
      `}</style>

      {cases.length > 0 && (
        <div className="tc-summary">
          <span className="tc-summary-item">
            <span className="tc-dot notrun" /> {statusCounts["Not run"]} not run
          </span>
          <span className="tc-summary-item">
            <span className="tc-dot pass" /> {statusCounts["Pass"]} pass
          </span>
          <span className="tc-summary-item">
            <span className="tc-dot fail" /> {statusCounts["Fail"]} fail
          </span>
          <span className="tc-summary-item">
            <span className="tc-dot blocked" /> {statusCounts["Blocked"]} blocked
          </span>
        </div>
      )}

      {cases.length === 0 ? (
        <div className="tc-empty">
          <ClipboardList size={28} />
          <p>No test cases yet. Add your first one below.</p>
        </div>
      ) : (
        <div className="tc-list">
          {cases.map((c, i) => (
            <div className="tc-case" key={c.id}>
              <div className="tc-case-top">
                <span className="tc-index">TC-{String(i + 1).padStart(2, "0")}</span>
                <input
                  className="tc-title-input"
                  placeholder="Test case title…"
                  value={c.title}
                  onChange={(e) => updateCase(c.id, "title", e.target.value)}
                />
                <select
                  className="tc-status-select"
                  value={c.status}
                  onChange={(e) => updateCase(c.id, "status", e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  className="tc-delete-btn"
                  aria-label="Delete test case"
                  onClick={() => removeCase(c.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="tc-fields">
                <div className="tc-field">
                  <label>Steps</label>
                  <textarea
                    placeholder="1. Open the app&#10;2. Submit an expense&#10;3. Approve as manager"
                    value={c.steps}
                    onChange={(e) => updateCase(c.id, "steps", e.target.value)}
                  />
                </div>
                <div className="tc-field">
                  <label>Expected result</label>
                  <textarea
                    placeholder="Expense status changes to Approved and notification is sent"
                    value={c.expected}
                    onChange={(e) => updateCase(c.id, "expected", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="tc-add-btn" onClick={addCase}>
        <Plus size={15} />
        Add test case
      </button>
    </div>
  );
}
