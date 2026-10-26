import type { Language } from "./curriculum";

export type ReferenceTier = "beginner" | "intermediate" | "advanced";

export interface DocReference {
  label: string;
  tier: ReferenceTier;
  tierName: string;
  sourceType: "Official Guide" | "Language Standard" | "Standard Library" | "Open Book" | "Spec / Architecture";
  note: string;
  url: string;
  badgeColor?: string;
}

export const tieredReferencesByLanguage: Record<Language, DocReference[]> = {
  rust: [
    // Tier 1: Beginner
    {
      label: "The Rust Programming Language (The Book)",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Official Guide",
      note: "The canonical starting point covering ownership, borrowing, structs, and pattern matching.",
      url: "https://doc.rust-lang.org/book/",
    },
    {
      label: "Rust by Example",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Official Guide",
      note: "Learn language mechanics through hundreds of annotated, runnable code examples.",
      url: "https://doc.rust-lang.org/rust-by-example/",
    },
    {
      label: "Tour of Rust",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Open Book",
      note: "Bite-sized visual walk-through of Rust's syntax, generics, and error handling fundamentals.",
      url: "https://tourofrust.com/",
    },
    // Tier 2: Intermediate
    {
      label: "Rust Standard Library (std) Reference",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Standard Library",
      note: "Complete index of Option, Result, Vec, collections, concurrency, and I/O traits.",
      url: "https://doc.rust-lang.org/std/",
    },
    {
      label: "Rust API Guidelines",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Official Guide",
      note: "Official conventions for designing idiomatic, ergonomic, and future-proof Rust crates.",
      url: "https://rust-lang.github.io/api-guidelines/",
    },
    {
      label: "Rust by Practice",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Open Book",
      note: "Challenging compiler puzzles and exercises focusing on lifetime annotations and trait bounds.",
      url: "https://practice.course.rs/",
    },
    // Tier 3: Advanced
    {
      label: "The Rustonomicon (Unsafe Rust)",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Official Guide",
      note: "The dark arts of Unsafe Rust: raw pointers, undefined behavior, aliasing rules, and subtyping.",
      url: "https://doc.rust-lang.org/nomicon/",
    },
    {
      label: "The Rust Reference & Grammar Specification",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Language Standard",
      note: "The formal reference documentation detailing compiler behavior, memory model, and ABI.",
      url: "https://doc.rust-lang.org/reference/",
    },
    {
      label: "Asynchronous Programming in Rust",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Official Guide",
      note: "Deep dive into async executors, Future mechanics, Pin projection, and zero-cost cooperative concurrency.",
      url: "https://rust-lang.github.io/async-book/",
    },
  ],

  c: [
    // Tier 1: Beginner
    {
      label: "Modern C (Jens Gustedt / Inria Open Access)",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Open Book",
      note: "A modern, accessible introduction emphasizing standard idioms, types, and modular code.",
      url: "https://modernc.gforge.inria.fr/",
    },
    {
      label: "Beej's Guide to C Programming",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Open Book",
      note: "Famous, humorous, and rigorously accurate tutorial covering pointers, memory, and arrays.",
      url: "https://beej.us/guide/bgc/",
    },
    {
      label: "The GNU C Reference Manual",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Official Guide",
      note: "Clean, authoritative overview of standard C syntax, types, and preprocessor directives.",
      url: "https://www.gnu.org/software/gnu-c-manual/gnu-c-manual.html",
    },
    // Tier 2: Intermediate
    {
      label: "cppreference C Standard Library",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Standard Library",
      note: "The definitive cross-platform reference for stdlib.h, string.h, stdio.h, and standard headers.",
      url: "https://en.cppreference.com/w/c",
    },
    {
      label: "SEI CERT C Coding Standard",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Spec / Architecture",
      note: "Rules and recommendations for secure, bug-free C code and preventing buffer overflows.",
      url: "https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard",
    },
    {
      label: "C Programming FAQs (Steve Summit)",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Open Book",
      note: "Classic comp.lang.c answers on pointer vs array equivalence, struct padding, and macro traps.",
      url: "https://c-faq.com/",
    },
    // Tier 3: Advanced
    {
      label: "ISO/IEC 9899:C17 / C23 Working Draft",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Language Standard",
      note: "The international ISO standard specification defining the official syntax, constraints, and semantics.",
      url: "https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf",
    },
    {
      label: "System V Application Binary Interface (AMD64 ABI)",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Spec / Architecture",
      note: "Register allocation, calling conventions, stack alignment, and ELF binary layout.",
      url: "https://gitlab.com/x86-psABIs/x86-64-ABI",
    },
    {
      label: "What Every Programmer Should Know About Memory (Drepper)",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Open Book",
      note: "CPU caches, TLB, bus architectures, and writing hardware-friendly, cache-conscious C algorithms.",
      url: "https://people.freebsd.org/~lstewart/articles/cpumemory.pdf",
    },
  ],

  python: [
    // Tier 1: Beginner
    {
      label: "The Official Python Tutorial",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Official Guide",
      note: "Official guided tour of Python syntax, data types, control flow, and function definitions.",
      url: "https://docs.python.org/3/tutorial/",
    },
    {
      label: "Think Python (Allen Downey)",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Open Book",
      note: "Free, open textbook focusing on clear computational thinking and algorithms in Python.",
      url: "https://greenteapress.com/wp/think-python-2e/",
    },
    // Tier 2: Intermediate
    {
      label: "Python Standard Library Reference",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Standard Library",
      note: "Comprehensive documentation of itertools, functools, collections, and asyncio modules.",
      url: "https://docs.python.org/3/library/",
    },
    {
      label: "PEP 8 – Style Guide for Python Code",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Language Standard",
      note: "The canonical style conventions and formatting guidelines for writing idiomatic, clean Python.",
      url: "https://peps.python.org/pep-0008/",
    },
    // Tier 3: Advanced
    {
      label: "Python Data Model & Execution Model",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Language Standard",
      note: "In-depth mechanics of dunder methods (__getitem__, __enter__), descriptors, metaclasses, and MRO.",
      url: "https://docs.python.org/3/reference/datamodel.html",
    },
    {
      label: "CPython Internal Developer Guide",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Spec / Architecture",
      note: "Internals of the CPython C codebase, bytecode evaluation loop, garbage collection, and GIL.",
      url: "https://devguide.python.org/",
    },
  ],

  javascript: [
    // Tier 1: Beginner
    {
      label: "MDN Web Docs: JavaScript First Steps",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Official Guide",
      note: "Beginner-friendly introduction to variables, operators, conditionals, and functions.",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps",
    },
    {
      label: "The Modern JavaScript Tutorial (JavaScript.info)",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Open Book",
      note: "Widely praised open-source curriculum covering fundamentals from basic syntax to modern ES6+.",
      url: "https://javascript.info/",
    },
    // Tier 2: Intermediate
    {
      label: "MDN Standard Built-in Objects",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Standard Library",
      note: "In-depth guide for Promises, Async/Await, Array methods, Map/Set, and Web APIs.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects",
    },
    {
      label: "Clean Code JavaScript",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Open Book",
      note: "Software engineering principles and readability patterns adapted for modern JavaScript.",
      url: "https://github.com/ryanmcdermott/clean-code-javascript",
    },
    // Tier 3: Advanced
    {
      label: "ECMAScript Language Specification (ECMA-262)",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Language Standard",
      note: "The official international standard specifying runtime semantics, event loop, and engine behavior.",
      url: "https://tc39.es/ecma262/",
    },
    {
      label: "V8 Engine Blog & Architecture",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Spec / Architecture",
      note: "Technical deep dives on inline caching, hidden classes, Ignition bytecode, and TurboFan compilation.",
      url: "https://v8.dev/blog",
    },
  ],

  htmlcss: [
    // Tier 1: Beginner
    {
      label: "MDN Web Docs: Learn HTML & CSS",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Official Guide",
      note: "Foundational guide to semantic markup, heading hierarchies, document structure, and basic styling.",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core",
    },
    {
      label: "web.dev: Learn HTML & CSS by Google",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Official Guide",
      note: "Modern, bite-sized curriculum on semantic elements, responsive units, and box-sizing.",
      url: "https://web.dev/learn/html/",
    },
    // Tier 2: Intermediate
    {
      label: "A Complete Guide to Flexbox & Grid (CSS-Tricks)",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Open Book",
      note: "The quintessential visual references for 1D and 2D responsive CSS layouts and alignment.",
      url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
    },
    {
      label: "W3C Web Content Accessibility Guidelines (WCAG)",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Language Standard",
      note: "Standards for accessible DOM structure, keyboard navigation, high contrast, and ARIA attributes.",
      url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
    },
    // Tier 3: Advanced
    {
      label: "HTML Living Standard (WHATWG)",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Language Standard",
      note: "The canonical browser specification for HTML parsing algorithms, DOM tree construction, and window event loop.",
      url: "https://html.spec.whatwg.org/multipage/",
    },
    {
      label: "W3C CSS Current Work & Working Drafts",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Language Standard",
      note: "Specifications for subgrid, CSS cascade layers (@layer), container queries, and CSS color-4.",
      url: "https://www.w3.org/Style/CSS/current-work",
    },
  ],

  cpp: [
    // Tier 1: Beginner
    {
      label: "LearnCpp.com",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Open Book",
      note: "Universally recommended open tutorial from basic syntax to modern C++20 standard practices.",
      url: "https://www.learncpp.com/",
    },
    {
      label: "A Tour of C++ (Bjarne Stroustrup)",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Official Guide",
      note: "Concise overview of C++ fundamentals, types, and philosophy by the language's creator.",
      url: "https://isocpp.org/tour",
    },
    // Tier 2: Intermediate
    {
      label: "cppreference C++ Standard Library Reference",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Standard Library",
      note: "Complete reference for std::vector, smart pointers (unique_ptr, shared_ptr), algorithms, and templates.",
      url: "https://en.cppreference.com/w/cpp",
    },
    {
      label: "C++ Core Guidelines (Stroustrup & Sutter)",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Spec / Architecture",
      note: "Authoritative engineering best practices for RAII, lifetime safety, resource management, and interfaces.",
      url: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines",
    },
    // Tier 3: Advanced
    {
      label: "ISO C++ Committee Standards (WG21)",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Language Standard",
      note: "The working draft standards and formal proposals shaping C++23 and C++26.",
      url: "https://open-std.org/jtc1/sc22/wg21/",
    },
    {
      label: "C++ Memory Model & Orderings (cppreference)",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Spec / Architecture",
      note: "Formal memory order semantics: memory_order_seq_cst, acquire-release, atomic synchronization, and fences.",
      url: "https://en.cppreference.com/w/cpp/atomic/memory_order",
    },
  ],

  r: [
    // Tier 1: Beginner
    {
      label: "An Introduction to R (CRAN Official)",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Official Guide",
      note: "The official foundational manual on data vectors, indexing, factors, arrays, and matrices.",
      url: "https://cran.r-project.org/doc/manuals/r-release/R-intro.html",
    },
    {
      label: "Hands-On Programming with R (Garrett Grolemund)",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Open Book",
      note: "Friendly open textbook teaching programming fundamentals and data exploration with R.",
      url: "https://rstudio-education.github.io/hopr/",
    },
    // Tier 2: Intermediate
    {
      label: "R for Data Science (Hadley Wickham)",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Open Book",
      note: "The tidyverse standard text on tidy data, dplyr transformations, ggplot2, and data pipelines.",
      url: "https://r4ds.hadley.nz/",
    },
    {
      label: "The R Graph Gallery",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Open Book",
      note: "Reproducible recipes and best-practice charts built with standard R and ggplot2.",
      url: "https://r-graph-gallery.com/",
    },
    // Tier 3: Advanced
    {
      label: "Advanced R (Hadley Wickham)",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Open Book",
      note: "Mastering functional programming, S3/S4/R6 object models, metaprogramming, and performance.",
      url: "https://adv-r.hadley.nz/",
    },
    {
      label: "R Internals Manual (CRAN)",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Spec / Architecture",
      note: "Internal memory allocation, SEXPREC data structures, and the C source code architecture of R.",
      url: "https://cran.r-project.org/doc/manuals/r-release/R-ints.html",
    },
  ],

  postgresql: [
    // Tier 1: Beginner
    {
      label: "PostgreSQL Official Tutorial",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Official Guide",
      note: "Official primer on relational concepts, table creation, SELECT queries, joins, and keys.",
      url: "https://www.postgresql.org/docs/current/tutorial.html",
    },
    {
      label: "PostgreSQL Exercises (pgexercises.com)",
      tier: "beginner",
      tierName: "Beginner · Foundations",
      sourceType: "Open Book",
      note: "Hands-on, interactive SQL challenges with immediate query feedback and explanation steps.",
      url: "https://pgexercises.com/",
    },
    // Tier 2: Intermediate
    {
      label: "PostgreSQL Functions & Operators Reference",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Standard Library",
      note: "Authoritative reference for window functions, JSONB indexing, aggregates, and CTEs (WITH).",
      url: "https://www.postgresql.org/docs/current/functions.html",
    },
    {
      label: "Use The Index, Luke! (Markus Winand)",
      tier: "intermediate",
      tierName: "Intermediate · Fluency",
      sourceType: "Open Book",
      note: "Essential guide to B-tree indexes, execution plans (EXPLAIN), and query performance tuning.",
      url: "https://use-the-index-luke.com/",
    },
    // Tier 3: Advanced
    {
      label: "PostgreSQL Internals (Egor Rogov)",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Open Book",
      note: "Deep architectural text on MVCC isolation, write-ahead logging (WAL), vacuuming, and buffer pools.",
      url: "https://postgrespro.com/community/books/internals",
    },
    {
      label: "PostgreSQL Documentation: Internals Chapter",
      tier: "advanced",
      tierName: "Advanced · Deep Systems",
      sourceType: "Spec / Architecture",
      note: "System catalogs, cost-based query optimizer architecture, and the Server Programming Interface (SPI).",
      url: "https://www.postgresql.org/docs/current/internals.html",
    },
  ],
};
