import React, { useState, useCallback } from "react";
import JSZip from "jszip";
import { UploadCloud, CheckCircle2, XCircle, Loader2 } from "lucide-react";

// Detects the files that matter inside a Power Platform solution export
// and exposes them to a parent component via onParsed(), so a later step
// (backend pac CLI parsing, upload to blob storage, etc.) can pick up
// from here without re-reading the zip.
export default function SolutionUploader({ onParsed }) {
  const [status, setStatus] = useState("idle"); // idle | parsing | done | error
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [summary, setSummary] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const parseZip = useCallback(
    async (file) => {
      setStatus("parsing");
      setErrorMsg("");
      setFileName(file.name);
      setSummary(null);

      try {
        if (!file.name.toLowerCase().endsWith(".zip")) {
          throw new Error("File must be a .zip solution export");
        }
        if (file.size > 100 * 1024 * 1024) {
          throw new Error("File is larger than 100MB — check this is the right export");
        }

        const zip = await JSZip.loadAsync(file);
        const entries = Object.keys(zip.files).filter((e) => !zip.files[e].dir);

        const manifest = entries.find(
          (e) =>
            e.toLowerCase() === "customizations.xml" ||
            e.toLowerCase() === "solution.xml"
        );
        if (!manifest) {
          throw new Error(
            "No customizations.xml or solution.xml found — this doesn't look like a Power Platform solution export"
          );
        }

        const canvasApps = entries.filter((e) => e.toLowerCase().endsWith(".msapp"));
        const flows = entries.filter((e) => /workflows\/.*\.json$/i.test(e));

        const result = {
          fileName: file.name,
          totalFiles: entries.length,
          manifest,
          canvasApps,
          flows,
        };

        setSummary(result);
        setStatus("done");
        if (onParsed) onParsed({ zip, ...result });
      } catch (err) {
        setErrorMsg(err.message || "Failed to read solution zip");
        setStatus("error");
      }
    },
    [onParsed]
  );

  const handleFiles = (files) => {
    if (files && files[0]) parseZip(files[0]);
  };

  return (
    <div className="su-wrap">
      <style>{`
        .su-wrap {
          --su-accent: var(--accent, #5b9dff);
          --su-ok: var(--ok, #38d9a9);
          --su-warn: var(--warn, #f2a94e);
          --su-border: var(--border, #28324a);
          --su-border-soft: var(--border-soft, #202940);
          --su-text: var(--text, #e9edf6);
          --su-text-dim: var(--text-dim, #8b95ac);
          --su-text-faint: var(--text-faint, #5b6580);
          --su-mono: var(--mono, 'JetBrains Mono', ui-monospace, monospace);
          --su-sans: var(--sans, system-ui, sans-serif);
          font-family: var(--su-sans);
          color: var(--su-text);
        }

        .su-dropzone {
          border: 1.5px dashed var(--su-border);
          border-radius: 10px;
          padding: 30px 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .su-dropzone.active { border-color: var(--su-accent); background: rgba(91, 157, 255, 0.06); }
        .su-dropzone:hover { border-color: var(--su-accent); }
        .su-dropzone:focus-visible { outline: 2px solid var(--su-accent); outline-offset: 3px; }
        .su-dropzone svg { color: var(--su-text-faint); margin-bottom: 10px; }
        .su-dropzone .primary { font-size: 14px; font-weight: 500; margin: 0 0 3px; }
        .su-dropzone .secondary { font-size: 12.5px; color: var(--su-text-dim); margin: 0; }

        .su-spin { animation: su-rotate 0.9s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .su-spin { animation: none; } }
        @keyframes su-rotate { to { transform: rotate(360deg); } }

        .su-error {
          margin-top: 12px;
          display: flex; align-items: center; gap: 8px;
          background: rgba(242, 100, 78, 0.1);
          border: 1px solid rgba(242, 100, 78, 0.3);
          color: #f2644e;
          font-size: 12.5px;
          padding: 10px 12px;
          border-radius: 8px;
        }

        .su-scan {
          margin-top: 16px;
          background: #0a0e17;
          border: 1px solid var(--su-border-soft);
          border-radius: 9px;
          padding: 14px 16px;
        }
        .su-scan-title {
          font-family: var(--su-mono); font-size: 11px; letter-spacing: 0.06em;
          color: var(--su-text-faint); margin: 0 0 10px; text-transform: uppercase;
        }
        .su-scan-line {
          display: flex; align-items: baseline; justify-content: space-between;
          font-family: var(--su-mono); font-size: 12.5px; padding: 4px 0;
          border-bottom: 1px solid #141b28;
        }
        .su-scan-line:last-of-type { border-bottom: none; }
        .su-scan-line .fmeta { color: var(--su-text-faint); font-size: 11px; }
        .su-scan-line .ok { color: var(--su-ok); margin-left: 10px; flex-shrink: 0; }
        .su-scan-footer {
          margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--su-border-soft);
          font-family: var(--su-mono); font-size: 11px; color: var(--su-text-faint);
        }
      `}</style>

      <div
        className={`su-dropzone${dragActive ? " active" : ""}`}
        tabIndex={0}
        role="button"
        aria-label="Upload solution zip file"
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => document.getElementById("su-file-input").click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            document.getElementById("su-file-input").click();
          }
        }}
      >
        <input
          id="su-file-input"
          type="file"
          accept=".zip"
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {status === "parsing" ? (
          <>
            <Loader2 className="su-spin" size={26} />
            <p className="primary">Reading {fileName}…</p>
          </>
        ) : (
          <>
            <UploadCloud size={26} />
            <p className="primary">Drop your solution .zip here</p>
            <p className="secondary">or click to browse</p>
          </>
        )}
      </div>

      {status === "error" && (
        <div className="su-error">
          <XCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      {status === "done" && summary && (
        <div className="su-scan">
          <p className="su-scan-title">Manifest scan</p>

          <div className="su-scan-line">
            <span>{summary.manifest}</span>
            <CheckCircle2 size={13} className="ok" />
          </div>

          {summary.canvasApps.map((f) => (
            <div className="su-scan-line" key={f}>
              <span>
                {f.split("/").pop()} <span className="fmeta">— canvas app</span>
              </span>
              <CheckCircle2 size={13} className="ok" />
            </div>
          ))}

          {summary.flows.map((f) => (
            <div className="su-scan-line" key={f}>
              <span>
                {f.split("/").pop()} <span className="fmeta">— flow</span>
              </span>
              <CheckCircle2 size={13} className="ok" />
            </div>
          ))}

          <div className="su-scan-footer">{summary.totalFiles} files total</div>
        </div>
      )}
    </div>
  );
}