import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Copy,
  Download,
  Trash2,
  Code,
  Check,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import type { Curriculum, Lesson } from "../data/curriculum";

interface NotepadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  track: Curriculum;
  lesson: Lesson;
}

export function NotepadDrawer({
  isOpen,
  onClose,
  track,
  lesson,
}: NotepadDrawerProps) {
  const [tab, setTab] = useState<"lesson" | "scratchpad">("lesson");

  // Load lesson notes
  const lessonKey = `cm_note_${lesson.id}`;
  const [lessonNote, setLessonNote] = useState<string>("");

  // Load general scratchpad notes
  const [scratchpadNote, setScratchpadNote] = useState<string>(() => {
    return localStorage.getItem("cm_scratchpad") || "";
  });

  const [savedTime, setSavedTime] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem(lessonKey) || "";
    setLessonNote(saved);
  }, [lesson.id, lessonKey]);

  if (!isOpen) return null;

  const handleLessonNoteChange = (text: string) => {
    setLessonNote(text);
    localStorage.setItem(lessonKey, text);
    setSavedTime("Saved just now");
  };

  const handleScratchpadChange = (text: string) => {
    setScratchpadNote(text);
    localStorage.setItem("cm_scratchpad", text);
    setSavedTime("Saved just now");
  };

  const currentContent = tab === "lesson" ? lessonNote : scratchpadNote;

  const insertSnippet = () => {
    const snippetToAdd = `\n\n\`\`\`${track.language}\n// From: ${lesson.title}\n${lesson.code}\n\`\`\`\n`;
    if (tab === "lesson") {
      handleLessonNoteChange(lessonNote + snippetToAdd);
    } else {
      handleScratchpadChange(scratchpadNote + snippetToAdd);
    }
    toast.success("Inserted lesson code snippet into notes");
  };

  const copyNotes = () => {
    if (!currentContent.trim()) {
      toast("No notes to copy");
      return;
    }
    navigator.clipboard.writeText(currentContent);
    toast.success("Notes copied to clipboard");
  };

  const downloadNotes = () => {
    if (!currentContent.trim()) {
      toast("No notes to export");
      return;
    }
    const blob = new Blob([currentContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      tab === "lesson"
        ? `${track.language}-${lesson.id}-notes.txt`
        : `codemastery-scratchpad.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded notes as .txt file");
  };

  const clearCurrentNotes = () => {
    if (window.confirm("Are you sure you want to clear these notes?")) {
      if (tab === "lesson") {
        handleLessonNoteChange("");
      } else {
        handleScratchpadChange("");
      }
      toast("Notes cleared");
    }
  };

  const wordCount = currentContent.trim()
    ? currentContent.trim().split(/\s+/).length
    : 0;

  return (
    <div className="notepad-backdrop" onClick={onClose}>
      <aside className="notepad-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notepad-head">
          <div className="notepad-title-group">
            <span className="section-kicker">Study Desk / Offline Scratchpad</span>
            <h2>Field Notepad</h2>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close notepad">
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="notepad-tabs">
          <button
            className={`notepad-tab ${tab === "lesson" ? "active" : ""}`}
            onClick={() => setTab("lesson")}
          >
            <BookOpen size={13} />
            <span>Lesson: {lesson.title.slice(0, 22)}...</span>
          </button>
          <button
            className={`notepad-tab ${tab === "scratchpad" ? "active" : ""}`}
            onClick={() => setTab("scratchpad")}
          >
            <FileText size={13} />
            <span>Global Desk Scratchpad</span>
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="notepad-toolbar">
          <button className="notepad-tool-btn" onClick={insertSnippet} title="Insert current lesson code">
            <Code size={13} />
            <span>Insert Code</span>
          </button>
          <button className="notepad-tool-btn" onClick={copyNotes} title="Copy notes to clipboard">
            <Copy size={13} />
            <span>Copy</span>
          </button>
          <button className="notepad-tool-btn" onClick={downloadNotes} title="Save notes as text file">
            <Download size={13} />
            <span>Save .txt</span>
          </button>
          <button className="notepad-tool-btn danger" onClick={clearCurrentNotes} title="Clear notes">
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        </div>

        {/* Note Editor Area */}
        <div className="notepad-editor-wrap">
          <textarea
            className="notepad-textarea"
            value={currentContent}
            onChange={(e) => {
              if (tab === "lesson") {
                handleLessonNoteChange(e.target.value);
              } else {
                handleScratchpadChange(e.target.value);
              }
            }}
            placeholder={
              tab === "lesson"
                ? `Write your mental model observations, takeaways, or compiler reminders for "${lesson.title}"…\n\n- Auto-saved locally in your browser storage.\n- Private, anonymous, and offline.`
                : `General scratchpad for code ideas, algorithms, commands, or study logs…\n\n- Auto-saved locally in your browser.`
            }
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="notepad-footer">
          <span className="notepad-stat">
            {wordCount} words · {currentContent.length} chars
          </span>
          <span className="notepad-save-indicator">
            <Check size={12} />
            {savedTime || "Saved locally"}
          </span>
        </div>
      </aside>
    </div>
  );
}
