import React, { useState, useEffect } from "react";
import {
  Play,
  RotateCcw,
  Check,
  Send,
  Lightbulb,
  Terminal,
  Activity,
  AlertTriangle,
  Code2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import type { Language } from "../data/curriculum";

interface CodePlaygroundProps {
  language: Language;
  title: string;
  description: string;
  placeholder: string;
  reference: string;
  fileName: string;
  onAskTutorWithCode?: (code: string) => void;
}

export function CodePlayground({
  language,
  title,
  description,
  placeholder,
  reference,
  fileName,
  onAskTutorWithCode,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(placeholder);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"terminal" | "solution">("terminal");
  const [output, setOutput] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [execTime, setExecTime] = useState<number | null>(null);

  // Shape check states
  const [shapePassed, setShapePassed] = useState<boolean | null>(null);
  const [shapeFeedback, setShapeFeedback] = useState<string | null>(null);

  // Reset code when language changes
  useEffect(() => {
    setCode(placeholder);
    setOutput(null);
    setShapePassed(null);
    setShapeFeedback(null);
    setActiveTab("terminal");
  }, [language, placeholder]);

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error("Write some code first before running.");
      return;
    }

    setRunning(true);
    setIsError(false);
    setActiveTab("terminal");

    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      if (data.status === "error") {
        setIsError(true);
        setOutput(data.stderr || "Execution failed with non-zero status.");
        toast.error("Runtime / Compiler diagnostic", { description: "Inspect the output below." });
      } else {
        setIsError(false);
        setOutput(data.stdout || "Program finished with exit code 0.");
        setExecTime(data.executionTimeMs || null);
        toast.success("Execution completed", {
          description: data.executionTimeMs ? `${data.executionTimeMs}ms` : undefined,
        });
      }
    } catch (err: any) {
      setIsError(true);
      setOutput(`Connection error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const handleCheckShape = () => {
    const answer = code.trim().toLowerCase();
    const requiredSignals: Record<Language, string[]> = {
      rust: ["split_whitespace"],
      c: ["malloc", "null"],
      python: ["for", "open"],
      javascript: ["response.ok"],
      htmlcss: ["<h1>", "<p>"],
      cpp: ["vector"],
      r: ["scores > 80"],
      postgresql: ["group by", "count"],
    };

    const signals = requiredSignals[language] || [];
    const passed = answer.length > 0 && signals.every((sig) => answer.includes(sig));

    setShapePassed(passed);
    setShapeFeedback(
      passed
        ? "✓ Shape check passed! The core language construct and contract are satisfied. Compare with the reference or run tests."
        : `⚠️ Contract not yet satisfied. The check expects you to use: ${signals.join(", ")}.`
    );

    if (passed) {
      toast.success("Shape check passed", { description: "Great work. Compare with the reference." });
    } else {
      toast("Keep tuning", { description: "The check is verifying the expected operations." });
    }
  };

  const handleReset = () => {
    setCode(placeholder);
    setOutput(null);
    setShapePassed(null);
    setShapeFeedback(null);
    toast("Reset code to starter template");
  };

  return (
    <article className="exercise-card">
      <div className="exercise-top-bar">
        <div className="exercise-label">
          <span>exercise 01</span>
          <span>12 min · hands-on</span>
        </div>
        <div className="editor-controls-top">
          <button className="text-ctrl-btn" onClick={handleReset} title="Reset starter code">
            <RotateCcw size={13} />
            <span>reset</span>
          </button>
          {onAskTutorWithCode && (
            <button
              className="text-ctrl-btn highlight"
              onClick={() => onAskTutorWithCode(code)}
              title="Send code to AI tutor"
            >
              <Lightbulb size={13} />
              <span>ask tutor with code</span>
            </button>
          )}
        </div>
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      {/* Editor Box */}
      <div className="editor">
        <div className="editor-bar">
          <span className="file-tag">
            <Terminal size={14} /> {fileName}
          </span>
          <span className="editor-dots">● ● ●</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          placeholder={placeholder}
          rows={9}
        />
      </div>

      {/* Action Buttons */}
      <div className="exercise-actions-bar">
        <div className="left-actions">
          <button
            className={`primary-button run-btn ${running ? "loading" : ""}`}
            onClick={handleRunCode}
            disabled={running}
          >
            <Play size={15} fill="currentColor" />
            <span>{running ? "Running..." : "Run Code"}</span>
          </button>
          <button
            className={`secondary-button shape-check-btn ${shapePassed === true ? "success" : ""}`}
            onClick={handleCheckShape}
          >
            {shapePassed === true ? <Check size={15} /> : <Send size={14} />}
            <span>{shapePassed === true ? "Contract Satisfied" : "Check Contract Shape"}</span>
          </button>
        </div>

        <button
          className="hint-button"
          onClick={() => {
            setActiveTab(activeTab === "solution" ? "terminal" : "solution");
            toast("Reference Shape", { description: "Study the standard library idiom." });
          }}
        >
          <Code2 size={14} />
          <span>{activeTab === "solution" ? "Hide Reference" : "View Reference Shape"}</span>
        </button>
      </div>

      {/* Shape Feedback Pill */}
      {shapeFeedback && (
        <div className={`practice-feedback ${shapePassed ? "passed" : "warning"}`}>
          {shapeFeedback}
        </div>
      )}

      {/* Terminal Output / Solution Box */}
      {activeTab === "terminal" && output && (
        <div className={`terminal-output-box ${isError ? "has-error" : ""}`}>
          <div className="terminal-header">
            <span className="term-title">
              <Terminal size={13} /> Console / Compiler Diagnostic
            </span>
            {execTime && <span className="term-exec-time">{execTime}ms</span>}
          </div>
          <pre className="terminal-body">
            <code>{output}</code>
          </pre>
        </div>
      )}

      {activeTab === "solution" && (
        <div className="solution-reveal visible">
          <div className="solution-head">
            <span className="section-kicker">idiomatic reference shape</span>
            <button
              className="copy-sol-btn"
              onClick={() => {
                navigator.clipboard.writeText(reference);
                toast.success("Copied reference to clipboard");
              }}
            >
              <Copy size={12} />
              <span>Copy</span>
            </button>
          </div>
          <pre>
            <code>{reference}</code>
          </pre>
        </div>
      )}
    </article>
  );
}
