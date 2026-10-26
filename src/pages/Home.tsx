import React, { useMemo, useState, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Command,
  Flame,
  Gauge,
  KeyRound,
  Lightbulb,
  LockKeyhole,
  Menu,
  MessageSquareText,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  X,
  Zap,
  Sun,
  Moon,
  Copy,
  Volume2,
  NotebookPen,
  Library,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  curriculum,
  languageOptions,
  fileNameByLanguage,
  practiceByLanguage,
  checkQuestions,
  checkExplanations,
  ProgressRing,
  AppMark,
  type Language,
  type View,
  type Lesson,
} from "../data/curriculum";
import { tieredReferencesByLanguage } from "../data/references";
import { TutorDrawer } from "../components/TutorDrawer";
import { NotepadDrawer } from "../components/NotepadDrawer";
import { CodePlayground } from "../components/CodePlayground";
import { ReferenceShelfView } from "../components/ReferenceShelfView";

export default function Home() {
  const [language, setLanguage] = useState<Language>("rust");
  const [view, setView] = useState<View>("overview");
  const [activeLesson, setActiveLesson] = useState(0);

  // Local anonymous progress tracking
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("codemastery-progress") || "{}");
    } catch {
      return {};
    }
  });

  // Dark/Light theme mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("cm_theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("cm_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("cm_theme", "light");
    }
  }, [isDarkMode]);

  // Modals & Drawers
  const [tutorOpen, setTutorOpen] = useState(false);
  const [notepadOpen, setNotepadOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  // Knowledge Checks state
  const [selectedCheck, setSelectedCheck] = useState<number | null>(null);
  const [checkSubmitted, setCheckSubmitted] = useState(false);

  // Code context passed to tutor
  const [tutorCodeContext, setTutorCodeContext] = useState<string>("");

  const track = curriculum[language];
  const lesson = track.lessons[activeLesson] || track.lessons[0];
  const lessonComplete = Boolean(completed[lesson.id]);

  // Actual dynamic progress calculation starting at 0%
  const userCompletedCount = track.lessons.filter((item) => completed[item.id]).length;
  const progress =
    track.lessons.length > 0
      ? Math.round((userCompletedCount / track.lessons.length) * 100)
      : 0;

  const nextLesson = useMemo(
    () => track.lessons.find((item) => !completed[item.id]) || track.lessons[0],
    [track, completed]
  );
  const practice = practiceByLanguage[language];
  const checkQuestion = checkQuestions[language];
  const currentTieredDocs = tieredReferencesByLanguage[language] || [];

  const saveProgress = (next: Record<string, boolean>) => {
    setCompleted(next);
    localStorage.setItem("codemastery-progress", JSON.stringify(next));
  };

  const markComplete = () => {
    const next = { ...completed, [lesson.id]: true };
    saveProgress(next);
    toast.success(`${track.label} lesson marked complete`, {
      description: "Nice work. Your next compiler-shaped win is ready.",
    });
  };

  const selectLanguage = (next: Language) => {
    setLanguage(next);
    setActiveLesson(0);
    setCheckSubmitted(false);
    setSelectedCheck(null);
  };

  const handleAskTutorWithCode = (code: string) => {
    setTutorCodeContext(code);
    setTutorOpen(true);
  };

  const copyLessonCode = () => {
    navigator.clipboard.writeText(lesson.code);
    toast.success("Copied code to clipboard");
  };

  const speakLesson = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `${lesson.title}. ${lesson.description}. Key takeaways: ${lesson.takeaways.join(". ")}`
      );
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      toast.info("Reading lesson aloud", { description: "Use browser controls to stop." });
    } else {
      toast.error("Text-to-speech is not supported in this browser.");
    }
  };

  const navItems: { id: View; label: string; icon: typeof BookOpen }[] = [
    { id: "overview", label: "Desk", icon: Command },
    { id: "lessons", label: "Lessons", icon: BookOpen },
    { id: "practice", label: "Practice", icon: Code2 },
    { id: "checks", label: "Checks", icon: BrainCircuit },
    { id: "shelf", label: "Shelf", icon: Library },
  ];

  return (
    <div className={`app-shell ${isDarkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${mobileNav ? "is-open" : ""}`}>
        <div className="sidebar-top">
          <AppMark />
          <span className="wordmark">CodeMastery</span>
          <button
            className="mobile-close"
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-kicker">/ study desk</div>

        {/* 8 Track Switchers */}
        <div className="track-switcher">
          {languageOptions.map((option) => (
            <button
              key={option.value}
              className={`track-option ${language === option.value ? "selected" : ""}`}
              onClick={() => {
                selectLanguage(option.value);
                if (view !== "shelf") setView("overview");
              }}
            >
              <span className={`track-dot ${option.color}`} />
              <span>
                <b>{option.label}</b>
                <small>{option.sub}</small>
              </span>
              {language === option.value && <Check size={15} />}
            </button>
          ))}
        </div>

        {/* Primary Views Navigation */}
        <nav className="main-nav" aria-label="Primary">
          <div className="nav-label">workspace</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${view === item.id ? "active" : ""}`}
                onClick={() => {
                  setView(item.id);
                  setMobileNav(false);
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {item.id === "lessons" && (
                  <span className="nav-count">
                    {String(track.lessons.length).padStart(2, "0")}
                  </span>
                )}
                {item.id === "shelf" && (
                  <span className="nav-count">3-tier</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Notepad Action */}
        <div className="sidebar-notepad-banner">
          <button className="sidebar-note-btn" onClick={() => setNotepadOpen(true)}>
            <NotebookPen size={14} />
            <span>Open Field Notepad</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-mark">∿</span>
            <p>
              <b>Study note</b>
              <br />
              Build the mental model before the muscle memory.
            </p>
          </div>
          <div className="sidebar-meta">
            <span>free & anonymous</span>
            <span>100% private</span>
          </div>
        </div>
      </aside>

      {/* Main Workbench Area */}
      <main className="main-canvas">
        {/* Topbar */}
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div className="breadcrumb">
            <span>workspace</span>
            <ChevronRight size={13} />
            <strong>{view === "overview" ? "study desk" : view === "shelf" ? "reference shelf" : view}</strong>
            <span className="track-pill">{track.label}</span>
          </div>

          <div className="top-actions">
            {/* Theme Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to Day Atelier" : "Switch to Night Atelier"}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Reference Shelf Quick Button */}
            <button
              className={`shelf-top-btn ${view === "shelf" ? "active" : ""}`}
              onClick={() => setView(view === "shelf" ? "overview" : "shelf")}
              title="Open 3-tier reference shelf"
            >
              <Library size={14} />
              <span className="hide-mobile">Docs Shelf</span>
            </button>

            {/* Field Notepad Button */}
            <button
              className="notepad-top-btn"
              onClick={() => setNotepadOpen(true)}
              title="Open field notepad"
            >
              <NotebookPen size={14} />
              <span className="hide-mobile">Notepad</span>
            </button>

            {/* Multi-Model AI Tutor Trigger */}
            <button
              className="tutor-top-trigger"
              onClick={() => setTutorOpen(true)}
              title="Open AI Mastery Tutor"
            >
              <Sparkles size={14} />
              <span>AI Tutor</span>
            </button>

            <div className="streak">
              <Flame size={15} />
              <span>steady pace</span>
            </div>

            <div className="avatar" title="Guest Scholar">G</div>
          </div>
        </header>

        {/* Main Content Wrap */}
        <div className="content-wrap">
          {view === "shelf" ? (
            /* Dedicated 3-Tier Reference Shelf Page */
            <ReferenceShelfView
              currentLanguage={language}
              onSelectLanguage={selectLanguage}
              onBackToDesk={() => setView("overview")}
            />
          ) : (
            <>
              {/* Hero Banner */}
              <section className="hero-row">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-rule" /> {track.eyebrow}
                  </div>
                  <h1>
                    {view === "overview" ? (
                      <>
                        Make the machine
                        <br />
                        <em>make sense.</em>
                      </>
                    ) : (
                      <>
                        {view === "lessons"
                          ? "Lessons"
                          : view === "practice"
                          ? "Practice lab"
                          : "Knowledge checks"}
                        <br />
                        <em>{track.label} track.</em>
                      </>
                    )}
                  </h1>
                  <p className="hero-copy">
                    {track.tagline} Follow a deliberate path from first principles to the parts other courses skip.
                  </p>
                </div>

                <div className="hero-stat">
                  <ProgressRing value={progress} color={track.accent} />
                  <div>
                    <span className="stat-label">track progress</span>
                    <strong>
                      {userCompletedCount} <small>/ {track.lessons.length} units</small>
                    </strong>
                    <span className="stat-sub">{progress === 0 ? "Not started" : track.level}</span>
                  </div>
                </div>
              </section>

              {/* Grid Layout: Primary Column + Right Rail */}
              <div className="content-grid">
                <section className="primary-column">
                  {/* 1. Overview View */}
                  {view === "overview" && (
                    <>
                      <div className="section-heading">
                        <div>
                          <span className="section-kicker">01 / continue</span>
                          <h2>Your next compiler-shaped win</h2>
                        </div>
                        <button className="text-button" onClick={() => setView("lessons")}>
                          view syllabus <ArrowRight size={15} />
                        </button>
                      </div>

                      <article
                        className="lesson-feature"
                        style={{ ["--lesson-accent" as string]: track.accent } as React.CSSProperties}
                      >
                        <div className="lesson-top">
                          <span className="lesson-index">{nextLesson.stage}</span>
                          <span className="lesson-duration">
                            <Play size={12} fill="currentColor" /> {nextLesson.duration}
                          </span>
                        </div>
                        <div className="lesson-body">
                          <div>
                            <h3>{nextLesson.title}</h3>
                            <p>{nextLesson.description}</p>
                            <button
                              className="primary-button"
                              onClick={() => {
                                setActiveLesson(
                                  track.lessons.findIndex((item) => item.id === nextLesson.id)
                                );
                                setView("lessons");
                              }}
                            >
                              open lesson <ArrowRight size={16} />
                            </button>
                          </div>
                          <div className="code-mini">
                            <div className="code-bar">
                              <span>{fileNameByLanguage[language]}</span>
                              <span>● ● ●</span>
                            </div>
                            <pre>
                              <code>{nextLesson.code.split("\n").slice(0, 6).join("\n")}</code>
                            </pre>
                          </div>
                        </div>
                      </article>

                      <div className="section-heading compact">
                        <div>
                          <span className="section-kicker">02 / map</span>
                          <h2>Eight paths, one sharper mind</h2>
                        </div>
                      </div>

                      <div className="path-cards">
                        {languageOptions.map((opt) => {
                          const cur = curriculum[opt.value];
                          const comp = cur.lessons.filter((item) => completed[item.id]).length;
                          const tot = cur.lessons.length;
                          const pct = tot > 0 ? Math.round((comp / tot) * 100) : 0;
                          return (
                            <button
                              key={opt.value}
                              className={`path-card ${language === opt.value ? "selected" : ""}`}
                              onClick={() => selectLanguage(opt.value)}
                            >
                              <div className="path-card-top">
                                <span className="path-symbol">{opt.label[0]}</span>
                                <span className="path-status">{comp}/{tot} units</span>
                              </div>
                              <h3>{opt.label}</h3>
                              <p>{cur.tagline}</p>
                              <div className="line-progress">
                                <span style={{ width: `${pct}%`, background: cur.accent }} />
                              </div>
                              <small>
                                {opt.sub} <ArrowRight size={13} />
                              </small>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* 2. Lessons View */}
                  {view === "lessons" && (
                    <div className="lesson-view">
                      <div className="lesson-tabs">
                        {track.lessons.map((item, index) => (
                          <button
                            key={item.id}
                            className={activeLesson === index ? "active" : ""}
                            onClick={() => setActiveLesson(index)}
                          >
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            {item.title}
                          </button>
                        ))}
                      </div>

                      <article className="lesson-reader">
                        <div className="reader-meta">
                          <span>{lesson.stage}</span>
                          <span>{lesson.duration} read</span>
                        </div>
                        <h2>{lesson.title}</h2>
                        <p className="reader-lede">{lesson.description}</p>

                        <div className="reader-code">
                          <div className="code-bar">
                            <span>{fileNameByLanguage[language]}</span>
                            <div className="code-bar-actions">
                              <button
                                className="code-action-btn"
                                onClick={() => setNotepadOpen(true)}
                                title="Take notes on this lesson"
                              >
                                <NotebookPen size={13} />
                                <span>note</span>
                              </button>
                              <button
                                className="code-action-btn"
                                onClick={speakLesson}
                                title="Read lesson aloud"
                              >
                                <Volume2 size={13} />
                                <span>audio</span>
                              </button>
                              <button
                                className="code-action-btn"
                                onClick={copyLessonCode}
                                title="Copy code snippet"
                              >
                                <Copy size={13} />
                                <span>copy</span>
                              </button>
                            </div>
                          </div>
                          <pre>
                            <code>{lesson.code}</code>
                          </pre>
                        </div>

                        <div className="takeaways">
                          <span className="section-kicker">what to keep</span>
                          {lesson.takeaways.map((item, index) => (
                            <div key={item}>
                              <span>0{index + 1}</span>
                              <p>{item}</p>
                            </div>
                          ))}
                        </div>

                        <div className="reader-actions">
                          <button
                            className={`complete-button ${lessonComplete ? "done" : ""}`}
                            onClick={markComplete}
                          >
                            {lessonComplete ? (
                              <>
                                <CheckCircle2 size={17} /> completed
                              </>
                            ) : (
                              <>
                                <Check size={17} /> mark complete
                              </>
                            )}
                          </button>
                          <button
                            className="secondary-button"
                            onClick={() => {
                              setTutorCodeContext(lesson.code);
                              setTutorOpen(true);
                            }}
                          >
                            <MessageSquareText size={16} /> ask the tutor
                          </button>
                        </div>
                      </article>
                    </div>
                  )}

                  {/* 3. Practice View: Interactive Code Playground */}
                  {view === "practice" && (
                    <div className="practice-view">
                      <div className="practice-header">
                        <div>
                          <span className="section-kicker">hands-on / {track.label.toLowerCase()}</span>
                          <h2>Make the compiler explain itself.</h2>
                          <p>
                            Write the smallest answer you can defend. Run your code in the sandbox or test your solution against the contract shape.
                          </p>
                        </div>
                        <div className="practice-badge">
                          <Zap size={17} /> interactive playground
                        </div>
                      </div>

                      <CodePlayground
                        language={language}
                        title={practice.title}
                        description={practice.description}
                        placeholder={practice.placeholder}
                        reference={practice.reference}
                        fileName={fileNameByLanguage[language]}
                        onAskTutorWithCode={handleAskTutorWithCode}
                      />
                    </div>
                  )}

                  {/* 4. Knowledge Checks View */}
                  {view === "checks" && (
                    <div className="checks-view">
                      <div className="check-intro">
                        <span className="section-kicker">retrieval practice / 03 questions</span>
                        <h2>Can you say it without the notes?</h2>
                        <p>
                          Fast checks turn recognition into recall. You get the result immediately; the explanation is the part that sticks.
                        </p>
                      </div>

                      <article className="quiz-card">
                        <div className="quiz-progress">
                          <span>question 01</span>
                          <span>{checkSubmitted ? "review" : "1 / 3"}</span>
                        </div>

                        <h3>{checkQuestion.prompt}</h3>

                        <div className="quiz-options">
                          {checkQuestion.options.map((option, index) => (
                            <button
                              key={option}
                              className={`${selectedCheck === index ? "selected" : ""} ${
                                checkSubmitted && index === checkQuestion.answer ? "correct" : ""
                              } ${
                                checkSubmitted &&
                                selectedCheck === index &&
                                index !== checkQuestion.answer
                                  ? "incorrect"
                                  : ""
                              }`}
                              onClick={() => !checkSubmitted && setSelectedCheck(index)}
                            >
                              <span>{String.fromCharCode(65 + index)}</span>
                              {option}
                              {checkSubmitted && index === checkQuestion.answer && <Check size={16} />}
                            </button>
                          ))}
                        </div>

                        {checkSubmitted && (
                          <div className="answer-note">
                            <CheckCircle2 size={17} />
                            <p>
                              <b>Why it matters.</b> {checkExplanations[language]}
                            </p>
                          </div>
                        )}

                        <button
                          className="primary-button"
                          disabled={selectedCheck === null && !checkSubmitted}
                          onClick={() => {
                            if (checkSubmitted) {
                              setCheckSubmitted(false);
                              setSelectedCheck(null);
                            } else {
                              setCheckSubmitted(true);
                            }
                          }}
                        >
                          {checkSubmitted ? (
                            <>
                              <RotateCcw size={15} /> try again
                            </>
                          ) : (
                            <>
                              lock answer <ArrowRight size={15} />
                            </>
                          )}
                        </button>
                      </article>
                    </div>
                  )}
                </section>

                {/* Right Rail */}
                <aside className="right-rail">
                  {/* Momentum Card */}
                  <div className="rail-card momentum-card">
                    <div className="rail-heading">
                      <span>momentum</span>
                      <Flame size={15} />
                    </div>
                    <div className="momentum-number">
                      01 <small>day</small>
                    </div>
                    <p>Keep the chain alive. A focused 20 minutes beats a heroic weekend.</p>
                    <div className="week-dots">
                      <span className="filled" />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <small className="week-label">mon — sun</small>
                  </div>

                  {/* Signals Card */}
                  <div className="rail-card">
                    <div className="rail-heading">
                      <span>today's signal</span>
                      <Gauge size={15} />
                    </div>
                    <div className="signal-row">
                      <span className="signal-icon">
                        <Trophy size={16} />
                      </span>
                      <div>
                        <b>Ownership</b>
                        <small>Rust / core model</small>
                      </div>
                      <span className="signal-score">fresh</span>
                    </div>
                    <div className="signal-row">
                      <span className="signal-icon sage">
                        <Terminal size={16} />
                      </span>
                      <div>
                        <b>Memory model</b>
                        <small>C / foundations</small>
                      </div>
                      <span className="signal-score">fresh</span>
                    </div>
                  </div>

                  {/* Study Notepad Rail Card */}
                  <div className="rail-card notepad-rail">
                    <div className="rail-heading">
                      <span>field scratchpad</span>
                      <NotebookPen size={15} />
                    </div>
                    <h3>Study Notes & Log</h3>
                    <p>
                      Jot mental models, compiler traps, or code snippets. Saved 100% locally and privately in your browser.
                    </p>
                    <button className="secondary-button full" onClick={() => setNotepadOpen(true)}>
                      open notepad <ArrowRight size={15} />
                    </button>
                  </div>

                  {/* Multi-Model Tutor Rail Card */}
                  <div className="rail-card tutor-rail">
                    <div className="rail-heading">
                      <span>multi-model tutor</span>
                      <Sparkles size={15} />
                    </div>
                    <div className="tutor-rail-icon">
                      <MessageSquareText size={18} />
                    </div>
                    <h3>Gemini, Claude & ChatGPT</h3>
                    <p>
                      Connect any model or local Ollama instance for instant Socratic guidance on {track.label}.
                    </p>
                    <button className="secondary-button full" onClick={() => setTutorOpen(true)}>
                      open AI tutor <ArrowRight size={15} />
                    </button>
                  </div>

                  {/* 3-Tier Reference Shelf Rail Card */}
                  <div className="rail-card reference-card">
                    <div className="rail-heading">
                      <span>3-tier reference shelf</span>
                      <Library size={15} />
                    </div>
                    <p className="reference-intro">
                      Official open-source documentation for <b>{track.label}</b>, categorized into beginner, intermediate, and advanced tiers.
                    </p>

                    {/* Preview of links with tier tags */}
                    <div className="rail-refs-list">
                      {currentTieredDocs.slice(0, 3).map((reference) => (
                        <a
                          key={reference.url}
                          className="reference-link"
                          href={reference.url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <div>
                            <div className="rail-ref-title">
                              <b>{reference.label}</b>
                              <span className={`mini-tier-tag ${reference.tier}`}>
                                {reference.tier === "beginner" ? "Tier 1" : reference.tier === "intermediate" ? "Tier 2" : "Tier 3"}
                              </span>
                            </div>
                            <small>{reference.note}</small>
                          </div>
                          <ExternalLink size={13} />
                        </a>
                      ))}
                    </div>

                    <button
                      className="secondary-button full rail-shelf-btn"
                      onClick={() => setView("shelf")}
                    >
                      Browse Complete Shelf (All 8 Tracks) <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Rail Footer */}
                  <div className="rail-footer">
                    <LockKeyhole size={14} />
                    <span>
                      No login required. Free & anonymous.
                      <br />
                      All progress and notes stay on your device.
                    </span>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Multi-Model Tutor Drawer */}
      <TutorDrawer
        isOpen={tutorOpen}
        onClose={() => setTutorOpen(false)}
        track={track}
        lesson={lesson}
        activeCode={tutorCodeContext}
      />

      {/* Field Notepad Drawer */}
      <NotepadDrawer
        isOpen={notepadOpen}
        onClose={() => setNotepadOpen(false)}
        track={track}
        lesson={lesson}
      />
    </div>
  );
}
