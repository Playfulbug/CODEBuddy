import React, { useState, useEffect } from "react";
import {
  X,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Send,
  LockKeyhole,
  Check,
  AlertCircle,
  Activity,
  Bot,
  Cpu,
  Trash2,
  Copy,
  ChevronDown,
  Terminal,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import type { Curriculum, Lesson } from "../data/curriculum";

export type AIProvider = "gemini" | "claude" | "openai" | "custom";

interface TutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  track: Curriculum;
  lesson: Lesson;
  activeCode?: string;
}

export function TutorDrawer({
  isOpen,
  onClose,
  track,
  lesson,
  activeCode,
}: TutorDrawerProps) {
  // Provider & Connection State
  const [provider, setProvider] = useState<AIProvider>(() => {
    return (localStorage.getItem("cm_tutor_provider") as AIProvider) || "gemini";
  });
  const [model, setModel] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("http://localhost:11434/v1");
  const [promptMode, setPromptMode] = useState<"standard" | "explain" | "hint" | "debug" | "compare">("standard");

  // Connection test state
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    ok: boolean;
    text: string;
    latencyMs?: number;
  } | null>(null);

  // Chat State
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "assistant";
      content: string;
      provider?: string;
      model?: string;
    }>
  >([]);

  // Update default model whenever provider changes
  useEffect(() => {
    localStorage.setItem("cm_tutor_provider", provider);
    setConnectionStatus(null);
    if (provider === "gemini") setModel("gemini-3.8-flash");
    else if (provider === "openai") setModel("gpt-4o-mini");
    else if (provider === "claude") setModel("claude-3-5-haiku-20241022");
    else if (provider === "custom") setModel("llama3.2");
  }, [provider]);

  if (!isOpen) return null;

  const testConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    try {
      const res = await fetch("/api/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey: apiKey.trim(),
          baseUrl: baseUrl.trim(),
          model: model.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setConnectionStatus({
          ok: true,
          text: `Connected (${data.latencyMs}ms)`,
          latencyMs: data.latencyMs,
        });
        toast.success(`Connected to ${provider.toUpperCase()}`, {
          description: `Latency: ${data.latencyMs}ms with model ${data.model}`,
        });
      } else {
        setConnectionStatus({
          ok: false,
          text: data.error || "Connection failed",
        });
        toast.error("Connection failed", { description: data.error });
      }
    } catch (err: any) {
      setConnectionStatus({
        ok: false,
        text: err.message || "Failed to reach backend",
      });
      toast.error("Connection error", { description: err.message });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || loading) return;

    if (provider !== "gemini" && provider !== "custom" && !apiKey.trim()) {
      toast.error(`Add your ${provider === "claude" ? "Claude" : "OpenAI"} key first`, {
        description: "The key lives in this active session tab only.",
      });
      return;
    }

    const nextMessages = [
      ...messages,
      { role: "user" as const, content: textToSend },
    ];
    setMessages(nextMessages);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey: apiKey.trim(),
          baseUrl: baseUrl.trim(),
          model: model.trim(),
          language: track.label,
          lesson: lesson.title,
          message: textToSend,
          promptMode,
          selectedCode: activeCode || lesson.code,
          history: nextMessages.slice(-6),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "The tutor could not respond.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.text || "No response received.",
          provider: data.provider || provider,
          model: data.model || model,
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **Error:** ${error.message || "Could not reach the tutor API."}`,
        },
      ]);
      toast.error("Tutor error", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: "Explain simply", prompt: "Explain this concept in simple terms with an everyday analogy." },
    { label: "Find edge cases", prompt: "What are the subtle bugs or edge cases learners usually miss here?" },
    { label: "C vs Rust comparison", prompt: "Compare how C and Rust handle this exact problem differently." },
    { label: "Challenge question", prompt: "Give me a quick 1-sentence thought experiment to test if I really understand this." },
  ];

  return (
    <div className="tutor-drawer-backdrop" onClick={onClose}>
      <aside className="tutor-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-head">
          <div>
            <span className="section-kicker">AI workbench / {track.label}</span>
            <h2>Mastery Tutor</h2>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close tutor">
            <X size={20} />
          </button>
        </div>

        {/* Multi-Model Provider Tabs */}
        <div className="provider-selector">
          <div className="provider-tabs">
            <button
              className={`provider-tab ${provider === "gemini" ? "active" : ""}`}
              onClick={() => setProvider("gemini")}
            >
              <Sparkles size={14} className="provider-icon-gemini" />
              <span>Gemini</span>
            </button>
            <button
              className={`provider-tab ${provider === "openai" ? "active" : ""}`}
              onClick={() => setProvider("openai")}
            >
              <Bot size={14} className="provider-icon-openai" />
              <span>ChatGPT</span>
            </button>
            <button
              className={`provider-tab ${provider === "claude" ? "active" : ""}`}
              onClick={() => setProvider("claude")}
            >
              <Cpu size={14} className="provider-icon-claude" />
              <span>Claude</span>
            </button>
            <button
              className={`provider-tab ${provider === "custom" ? "active" : ""}`}
              onClick={() => setProvider("custom")}
            >
              <Terminal size={14} className="provider-icon-custom" />
              <span>Local / Ollama</span>
            </button>
          </div>
        </div>

        {/* Configuration Card */}
        <div className="tutor-config-card">
          {provider === "gemini" && (
            <>
              <div className="config-row">
                <label className="key-label">
                  Gemini Model
                  <select
                    value={model || "gemini-3.8-flash"}
                    onChange={(e) => setModel(e.target.value)}
                    className="model-select"
                  >
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended)</option>
                    <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                  </select>
                </label>
              </div>
              <label className="key-label">
                API Key <span>(Optional if server key configured)</span>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste restricted Gemini API key"
                  autoComplete="off"
                />
              </label>
            </>
          )}

          {provider === "openai" && (
            <>
              <div className="config-row">
                <label className="key-label">
                  OpenAI Model
                  <select
                    value={model || "gpt-4o-mini"}
                    onChange={(e) => setModel(e.target.value)}
                    className="model-select"
                  >
                    <option value="gpt-4o-mini">gpt-4o-mini (Fast & Efficient)</option>
                    <option value="gpt-4o">gpt-4o (Deep Reasoning)</option>
                    <option value="o3-mini">o3-mini (High STEM Reasoning)</option>
                  </select>
                </label>
              </div>
              <label className="key-label">
                OpenAI API Key <span>session-only</span>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  autoComplete="off"
                />
              </label>
            </>
          )}

          {provider === "claude" && (
            <>
              <div className="config-row">
                <label className="key-label">
                  Claude Model
                  <select
                    value={model || "claude-3-5-haiku-20241022"}
                    onChange={(e) => setModel(e.target.value)}
                    className="model-select"
                  >
                    <option value="claude-3-5-haiku-20241022">claude-3.5-haiku (Lightning Fast)</option>
                    <option value="claude-3-5-sonnet-20241022">claude-3.5-sonnet (Flagship)</option>
                    <option value="claude-3-opus-20240229">claude-3-opus</option>
                  </select>
                </label>
              </div>
              <label className="key-label">
                Anthropic API Key <span>session-only</span>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  autoComplete="off"
                />
              </label>
            </>
          )}

          {provider === "custom" && (
            <>
              <div className="config-row">
                <label className="key-label">
                  Local / OpenAI-compatible Base URL
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="http://localhost:11434/v1"
                  />
                </label>
              </div>
              <div className="preset-buttons">
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => {
                    setBaseUrl("http://localhost:11434/v1");
                    setModel("llama3.2");
                  }}
                >
                  Ollama (:11434)
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => {
                    setBaseUrl("http://localhost:1234/v1");
                    setModel("local-model");
                  }}
                >
                  LM Studio (:1234)
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => {
                    setBaseUrl("https://api.deepseek.com/v1");
                    setModel("deepseek-chat");
                  }}
                >
                  DeepSeek API
                </button>
              </div>
              <div className="config-grid">
                <label className="key-label">
                  Model Name
                  <input
                    type="text"
                    value={model || "llama3.2"}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="llama3.2, deepseek-r1, qwen2.5-coder"
                  />
                </label>
                <label className="key-label">
                  API Key <span>(optional)</span>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Optional token"
                  />
                </label>
              </div>
            </>
          )}

          {/* Test Connection Button */}
          <div className="connection-action-bar">
            <button
              type="button"
              className="test-conn-button"
              onClick={testConnection}
              disabled={testingConnection}
            >
              <Activity size={14} className={testingConnection ? "spin" : ""} />
              <span>{testingConnection ? "Testing ping..." : "Test connection"}</span>
            </button>
            {connectionStatus && (
              <span
                className={`conn-pill ${
                  connectionStatus.ok ? "conn-success" : "conn-fail"
                }`}
              >
                {connectionStatus.ok ? <Check size={12} /> : <AlertCircle size={12} />}
                {connectionStatus.text}
              </span>
            )}
          </div>
        </div>

        {/* Security Assurance */}
        <div className="security-warning">
          <ShieldCheck size={15} />
          <p>
            Keys are never stored to persistent databases or disks. They live strictly in active memory and vanish when refreshed.
          </p>
        </div>

        {/* Quick Prompts Bar */}
        <div className="quick-prompts">
          <span className="quick-prompts-label">Quick actions:</span>
          <div className="prompt-chips">
            {quickPrompts.map((qp) => (
              <button
                key={qp.label}
                className="chip-btn"
                onClick={() => handleSend(qp.prompt)}
                disabled={loading}
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="tutor-thread">
          {messages.length === 0 && (
            <div className="tutor-empty">
              <Sparkles size={26} />
              <p>
                Connected to <b>{provider.toUpperCase()}</b> ({model || "default"}).
                Ask for an explanation, memory layout breakdown, or borrow checker hint.
              </p>
              <span>Current context: <i>{lesson.title}</i> ({track.label})</span>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={`${msg.role}-${index}`} className={`message ${msg.role}`}>
              <div className="message-header">
                <span className="message-role">
                  {msg.role === "user" ? "you" : `tutor · ${msg.provider || provider}`}
                </span>
                {msg.role === "assistant" && (
                  <button
                    className="copy-msg-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(msg.content);
                      toast.success("Copied tutor answer");
                    }}
                    title="Copy message"
                  >
                    <Copy size={12} />
                  </button>
                )}
              </div>
              {msg.role === "assistant" ? (
                <div className="prose">
                  <Streamdown>{msg.content}</Streamdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          ))}

          {loading && (
            <div className="message assistant loading">
              <span className="message-role">tutor · {provider}</span>
              <span className="typing">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
        </div>

        {/* Compose Input */}
        <div className="tutor-compose">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder={`Ask ${provider.toUpperCase()} about ${lesson.title}…`}
            rows={2}
          />
          <button
            onClick={() => void handleSend()}
            disabled={loading || !input.trim()}
            aria-label="Send question"
          >
            <Send size={16} />
          </button>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-foot-bar">
          <div className="foot-left">
            <LockKeyhole size={13} />
            <span>Active provider: <b>{provider.toUpperCase()}</b></span>
          </div>
          {messages.length > 0 && (
            <button
              className="clear-chat-btn"
              onClick={() => {
                setMessages([]);
                toast("Chat cleared");
              }}
            >
              <Trash2 size={12} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
