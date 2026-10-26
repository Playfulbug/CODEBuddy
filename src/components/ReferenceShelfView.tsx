import React, { useState, useMemo } from "react";
import {
  BookOpen,
  ExternalLink,
  Search,
  ArrowRight,
  Filter,
  Layers,
  GraduationCap,
  Wrench,
  Cpu,
  Sparkles,
} from "lucide-react";
import {
  tieredReferencesByLanguage,
  type DocReference,
  type ReferenceTier,
} from "../data/references";
import { languageOptions, type Language } from "../data/curriculum";

interface ReferenceShelfViewProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onBackToDesk: () => void;
}

export function ReferenceShelfView({
  currentLanguage,
  onSelectLanguage,
  onBackToDesk,
}: ReferenceShelfViewProps) {
  const [selectedLang, setSelectedLang] = useState<Language | "all">(currentLanguage);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<ReferenceTier | "all">("all");

  const references = useMemo(() => {
    let list: { lang: Language; langLabel: string; ref: DocReference }[] = [];

    const targetLangs: Language[] =
      selectedLang === "all"
        ? (languageOptions.map((o) => o.value) as Language[])
        : [selectedLang];

    targetLangs.forEach((lang) => {
      const langLabel = languageOptions.find((o) => o.value === lang)?.label || lang;
      const langRefs = tieredReferencesByLanguage[lang] || [];
      langRefs.forEach((ref) => {
        list.push({ lang, langLabel, ref });
      });
    });

    if (tierFilter !== "all") {
      list = list.filter((item) => item.ref.tier === tierFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.ref.label.toLowerCase().includes(q) ||
          item.ref.note.toLowerCase().includes(q) ||
          item.ref.sourceType.toLowerCase().includes(q) ||
          item.langLabel.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedLang, tierFilter, searchQuery]);

  // Group by tier for clean 3-tier view
  const tier1 = references.filter((i) => i.ref.tier === "beginner");
  const tier2 = references.filter((i) => i.ref.tier === "intermediate");
  const tier3 = references.filter((i) => i.ref.tier === "advanced");

  const tierSections = [
    {
      id: "beginner" as ReferenceTier,
      title: "Tier 1: Foundations & Beginner Guides",
      subtitle: "First principles, core syntax, mental models, and step-by-step tutorials.",
      icon: GraduationCap,
      color: "#58705b",
      badgeClass: "tier-badge-beginner",
      items: tier1,
    },
    {
      id: "intermediate" as ReferenceTier,
      title: "Tier 2: Intermediate Idioms & Standard Libraries",
      subtitle: "Official standard library interfaces, production design guidelines, collections, and best practices.",
      icon: Wrench,
      color: "#c56a3b",
      badgeClass: "tier-badge-intermediate",
      items: tier2,
    },
    {
      id: "advanced" as ReferenceTier,
      title: "Tier 3: Advanced Internals, Specs & Architecture",
      subtitle: "Official language specifications, memory models, compiler internals, and ABI standards.",
      icon: Cpu,
      color: "#8e5b88",
      badgeClass: "tier-badge-advanced",
      items: tier3,
    },
  ];

  return (
    <div className="reference-shelf-view">
      {/* Top Banner */}
      <div className="shelf-header">
        <div>
          <span className="section-kicker">3-Tier Library / Open-Source Shelves</span>
          <h2>Open Source Reference Shelf</h2>
          <p>
            Curated, authoritative open-source documentation, official ISO/RFC standards, and community textbooks organized into 3 clear progression tiers.
          </p>
        </div>
        <button className="secondary-button" onClick={onBackToDesk}>
          Back to Desk <ArrowRight size={15} />
        </button>
      </div>

      {/* Language Filter Tabs */}
      <div className="shelf-controls">
        <div className="shelf-lang-tabs">
          <button
            className={`shelf-tab-btn ${selectedLang === "all" ? "active" : ""}`}
            onClick={() => setSelectedLang("all")}
          >
            All Languages
          </button>
          {languageOptions.map((opt) => (
            <button
              key={opt.value}
              className={`shelf-tab-btn ${selectedLang === opt.value ? "active" : ""}`}
              onClick={() => {
                setSelectedLang(opt.value);
                onSelectLanguage(opt.value);
              }}
            >
              <span className={`track-dot ${opt.color}`} />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar & Tier Filter */}
        <div className="shelf-search-bar">
          <div className="shelf-search-input-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, standard libraries, specs, or topics (e.g. memory, async, ABI)…"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                ✕
              </button>
            )}
          </div>

          <div className="shelf-tier-filters">
            <button
              className={`tier-pill ${tierFilter === "all" ? "active" : ""}`}
              onClick={() => setTierFilter("all")}
            >
              All Tiers ({references.length})
            </button>
            <button
              className={`tier-pill tier-pill-green ${tierFilter === "beginner" ? "active" : ""}`}
              onClick={() => setTierFilter("beginner")}
            >
              🟢 Tier 1: Beginner
            </button>
            <button
              className={`tier-pill tier-pill-orange ${tierFilter === "intermediate" ? "active" : ""}`}
              onClick={() => setTierFilter("intermediate")}
            >
              🟡 Tier 2: Intermediate
            </button>
            <button
              className={`tier-pill tier-pill-purple ${tierFilter === "advanced" ? "active" : ""}`}
              onClick={() => setTierFilter("advanced")}
            >
              🔴 Tier 3: Advanced
            </button>
          </div>
        </div>
      </div>

      {/* 3-Tier Categorized Lists */}
      <div className="shelf-tiers-container">
        {tierSections.map((section) => {
          if (section.items.length === 0) return null;
          const Icon = section.icon;
          return (
            <section key={section.id} className="shelf-tier-section">
              <div className="tier-section-heading">
                <div className="tier-icon-wrap" style={{ background: `${section.color}20`, color: section.color }}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3>{section.title}</h3>
                  <p>{section.subtitle}</p>
                </div>
                <span className="tier-count-pill">{section.items.length} references</span>
              </div>

              <div className="shelf-grid">
                {section.items.map(({ langLabel, ref }) => (
                  <a
                    key={ref.url}
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="doc-card"
                  >
                    <div className="doc-card-top">
                      <span className="doc-lang-tag">{langLabel}</span>
                      <span className="doc-source-type">{ref.sourceType}</span>
                    </div>

                    <h4>{ref.label}</h4>
                    <p>{ref.note}</p>

                    <div className="doc-card-foot">
                      <span className={`doc-tier-tag ${section.badgeClass}`}>
                        {ref.tierName}
                      </span>
                      <span className="doc-open-link">
                        Open Doc <ExternalLink size={12} />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}

        {references.length === 0 && (
          <div className="shelf-empty">
            <BookOpen size={36} />
            <h3>No documentation links match your search.</h3>
            <p>Try clearing your search query or selecting "All Languages" to view the complete shelf.</p>
            <button
              className="secondary-button"
              onClick={() => {
                setSearchQuery("");
                setTierFilter("all");
                setSelectedLang("all");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
