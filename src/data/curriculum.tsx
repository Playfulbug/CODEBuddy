import React from "react";

export type Language = "rust" | "c" | "python" | "javascript" | "htmlcss" | "cpp" | "r" | "postgresql";
export type View = "overview" | "lessons" | "practice" | "checks" | "shelf";

export type Lesson = {
  id: string;
  stage: string;
  title: string;
  description: string;
  duration: string;
  code: string;
  takeaways: string[];
};

export type Curriculum = {
  language: Language;
  label: string;
  eyebrow: string;
  accent: string;
  soft: string;
  total: number;
  completed: number;
  level: string;
  tagline: string;
  lessons: Lesson[];
};

export const curriculum: Record<Language, Curriculum> = {
  rust: {
    language: "rust",
    label: "Rust",
    eyebrow: "Memory-safe systems",
    accent: "#C56A3B",
    soft: "#F2DED2",
    total: 24,
    completed: 0,
    level: "Building fluency",
    tagline: "Own the machine without losing the plot.",
    lessons: [
      {
        id: "rust-ownership",
        stage: "02 · Core model",
        title: "Ownership is a design tool",
        description: "Build the mental model that makes borrowing, moves, and lifetimes feel predictable instead of magical.",
        duration: "18 min",
        code: `fn take_title(title: String) {\n    println!("{title}");\n}\n\nlet title = String::from("systems");\ntake_title(title);\n// title is moved — and that is the point`,
        takeaways: ["A value has one owner at a time", "Moves are compile-time decisions", "Borrow when ownership should remain with the caller"],
      },
      {
        id: "rust-borrowing",
        stage: "02 · Core model",
        title: "Borrowing without a runtime tax",
        description: "Use references to share access while the compiler checks aliasing and mutation rules for you.",
        duration: "22 min",
        code: `fn first_word(text: &str) -> &str {\n    text.split_whitespace().next().unwrap_or("")\n}\n\nlet sentence = String::from("ship it");\nlet word = first_word(&sentence);`,
        takeaways: ["Shared references are read-only", "Mutable references are exclusive", "Lifetimes describe relationships, not timestamps"],
      },
      {
        id: "rust-traits",
        stage: "03 · Abstraction",
        title: "Traits as capability contracts",
        description: "Compose behavior with explicit contracts and let generics stay zero-cost at the call site.",
        duration: "26 min",
        code: `trait Summarize {\n    fn summary(&self) -> String;\n}\n\nfn print_summary<T: Summarize>(item: &T) {\n    println!("{}", item.summary());\n}`,
        takeaways: ["Traits describe behavior", "Bounds make generic code honest", "Prefer small, composable capabilities"],
      },
      {
        id: "rust-concurrency",
        stage: "04 · Scale",
        title: "Fearless concurrency",
        description: "Use channels, Send, and Sync to build parallel programs that make unsafe sharing difficult.",
        duration: "31 min",
        code: `use std::sync::mpsc;\nuse std::thread;\n\nlet (tx, rx) = mpsc::channel();\nthread::spawn(move || tx.send("done").unwrap());\nprintln!("{}", rx.recv().unwrap());`,
        takeaways: ["Move ownership into a thread", "Channels coordinate without shared mutable state", "The type system becomes a concurrency reviewer"],
      },
    ],
  },
  c: {
    language: "c",
    label: "C",
    eyebrow: "Close-to-metal fundamentals",
    accent: "#58705B",
    soft: "#DDE8DF",
    total: 20,
    completed: 0,
    level: "Steady foundations",
    tagline: "See the bytes. Shape the system.",
    lessons: [
      {
        id: "c-memory",
        stage: "02 · Memory model",
        title: "Memory is part of the API",
        description: "Understand stack, heap, and object lifetime so your programs behave by design rather than luck.",
        duration: "20 min",
        code: `int *scores = malloc(3 * sizeof(int));\nif (scores == NULL) return 1;\n\nscores[0] = 42;\nfree(scores);\nscores = NULL;`,
        takeaways: ["Every allocation needs a clear owner", "Check allocation results", "Free exactly what you allocate"],
      },
      {
        id: "c-pointers",
        stage: "02 · Memory model",
        title: "Pointers without superstition",
        description: "Trace addresses, indirection, and pointer arithmetic with a visual mental model.",
        duration: "24 min",
        code: `void bump(int *value) {\n    (*value)++;\n}\n\nint count = 7;\nbump(&count);\n// count is now 8`,
        takeaways: ["& gets an address", "* follows an address", "Pointer type tells you how to interpret bytes"],
      },
      {
        id: "c-structs",
        stage: "03 · Data structures",
        title: "Make data carry meaning",
        description: "Model domain objects with structs, then connect them with pointers and invariants.",
        duration: "23 min",
        code: `typedef struct {\n    const char *name;\n    size_t capacity;\n} Buffer;\n\nBuffer buffer = { .name = "out", .capacity = 1024 };`,
        takeaways: ["Structs group related state", "Design invariants before functions", "Use const to make intent visible"],
      },
      {
        id: "c-systems",
        stage: "04 · Systems",
        title: "The process is the program",
        description: "Connect compilation, linking, file descriptors, and the operating system boundary.",
        duration: "34 min",
        code: `int fd = open("notes.txt", O_RDONLY);\nif (fd == -1) {\n    perror("open");\n    return 1;\n}\nclose(fd);`,
        takeaways: ["The linker resolves relationships", "System calls return failure information", "Resource ownership is a discipline, not a feature"],
      },
    ],
  },
  python: {
    language: "python",
    label: "Python",
    eyebrow: "Readable power",
    accent: "#4E7896",
    soft: "#DDE9EF",
    total: 18,
    completed: 0,
    level: "Finding your rhythm",
    tagline: "Make the idea executable.",
    lessons: [
      { id: "python-model", stage: "01 · Foundations", title: "Names, values, and flow", description: "Learn how Python binds names, evaluates expressions, and turns a clear idea into a useful program.", duration: "16 min", code: `def total(prices):\n    return sum(prices)\n\ncart = [12, 8, 5]\nprint(total(cart))`, takeaways: ["Names point at values", "Indentation is syntax", "Small functions make intent visible"] },
      { id: "python-data", stage: "02 · Data", title: "Choose the right container", description: "Use lists, dictionaries, tuples, and sets as deliberate models for real-world data.", duration: "21 min", code: `profile = {"name": "Ada", "focus": "systems"}\nfor key, value in profile.items():\n    print(f"{key}: {value}")`, takeaways: ["Data structures encode decisions", "Iteration should read like the problem", "Prefer explicit transformations"] },
      { id: "python-objects", stage: "03 · Design", title: "Objects with a small surface", description: "Build classes only when state and behavior genuinely belong together.", duration: "24 min", code: `class Counter:\n    def __init__(self):\n        self.value = 0\n\n    def increment(self):\n        self.value += 1`, takeaways: ["Keep public APIs small", "Composition often beats inheritance", "Tests document behavior"] },
      { id: "python-async", stage: "04 · Scale", title: "Async without mystery", description: "Understand coroutines, await, and where asynchronous Python actually helps.", duration: "27 min", code: `async def fetch_all(client, urls):\n    return await asyncio.gather(\n        *(client.get(url) for url in urls)\n    )`, takeaways: ["Await yields control", "Concurrency is not parallelism", "Measure before making code async"] },
    ],
  },
  javascript: {
    language: "javascript",
    label: "JavaScript",
    eyebrow: "The language of the web",
    accent: "#B08A22",
    soft: "#EEE5BF",
    total: 18,
    completed: 0,
    level: "Shaping the runtime",
    tagline: "Make the browser do useful work.",
    lessons: [
      { id: "js-values", stage: "01 · Foundations", title: "Values, scope, and closure", description: "Build the runtime model that makes functions, scope, and callbacks stop feeling surprising.", duration: "18 min", code: `function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\n\nconst next = makeCounter();\nnext(); // 1`, takeaways: ["Closures retain bindings", "const protects the binding", "Scope is a design boundary"] },
      { id: "js-dom", stage: "02 · Browser", title: "The DOM is a live model", description: "Connect events, state, and rendered output without turning every click into a bug hunt.", duration: "22 min", code: `button.addEventListener("click", () => {\n  count += 1;\n  label.textContent = String(count);\n});`, takeaways: ["Events are messages", "Render from state", "Keep side effects at the edges"] },
      { id: "js-types", stage: "03 · Reliability", title: "Types at the boundary", description: "Use modern JavaScript patterns to make data crossing your app easier to trust.", duration: "23 min", code: `const user = { name: "Ada" };\nconst displayName = user.name ?? "Guest";\nconst safe = Array.isArray(items) ? items : [];`, takeaways: ["Validate external data", "Nullish is not falsy", "Names beat clever coercion"] },
      { id: "js-async", stage: "04 · Scale", title: "Promises as time-shaped values", description: "Compose network and file work with async/await while keeping failure paths visible.", duration: "25 min", code: `const response = await fetch("/api/notes");\nif (!response.ok) throw new Error("Request failed");\nconst notes = await response.json();`, takeaways: ["Await does not block the server", "Errors are part of the return shape", "Cancel work when the UI disappears"] },
    ],
  },
  htmlcss: {
    language: "htmlcss",
    label: "HTML / CSS",
    eyebrow: "Interfaces with structure",
    accent: "#A85A72",
    soft: "#F0DCE2",
    total: 16,
    completed: 0,
    level: "Reading the browser",
    tagline: "Structure first. Style with intent.",
    lessons: [
      { id: "html-semantics", stage: "01 · Structure", title: "HTML as meaning", description: "Choose elements for their meaning, not their default appearance, and your interface gains a stronger foundation.", duration: "15 min", code: `<main>\n  <article>\n    <h1>Study notes</h1>\n    <p>One concept at a time.</p>\n  </article>\n</main>`, takeaways: ["Landmarks help everyone navigate", "Headings create a document outline", "Buttons are not links"] },
      { id: "css-layout", stage: "02 · Layout", title: "Layout is a constraint system", description: "Use flexbox and grid to express relationships instead of nudging pixels into place.", duration: "20 min", code: `.desk {\n  display: grid;\n  grid-template-columns: 1fr 18rem;\n  gap: 2rem;\n}`, takeaways: ["Parent rules shape children", "Intrinsic sizing is your ally", "Responsive means reflow, not shrink"] },
      { id: "css-cascade", stage: "03 · Styling", title: "The cascade is a conversation", description: "Understand specificity, inheritance, and custom properties so styles remain editable months later.", duration: "19 min", code: `:root { --ink: #171614; }\n.card { color: var(--ink); }\n.card h2 { margin-block: 0; }`, takeaways: ["Keep specificity low", "Tokens make intent reusable", "Whitespace is a visual tool"] },
      { id: "html-access", stage: "04 · Quality", title: "Build for more browsers", description: "Use focus states, labels, contrast, and reduced motion as part of the design rather than polish at the end.", duration: "22 min", code: `:focus-visible {\n  outline: 3px solid #c56a3b;\n  outline-offset: 3px;\n}`, takeaways: ["Keyboard access is a baseline", "Focus must be visible", "Respect user motion preferences"] },
    ],
  },
  cpp: {
    language: "cpp",
    label: "C++",
    eyebrow: "Zero-cost abstraction",
    accent: "#55759A",
    soft: "#DEE7F0",
    total: 20,
    completed: 0,
    level: "Learning the vocabulary",
    tagline: "Use the hardware without handcuffing yourself.",
    lessons: [
      { id: "cpp-raii", stage: "01 · Foundations", title: "RAII makes cleanup local", description: "Let resource lifetime follow object lifetime with constructors, destructors, and scope.", duration: "22 min", code: `std::lock_guard<std::mutex> lock(mutex);\n// protected work\n// lock releases at scope exit`, takeaways: ["Scope is a safety boundary", "Destructors should be predictable", "Resource ownership belongs in types"] },
      { id: "cpp-templates", stage: "02 · Generic", title: "Templates as a compiler conversation", description: "Write generic code that preserves useful type information and readable errors.", duration: "27 min", code: `template <typename T>\nT clamp(T value, T low, T high) {\n  return std::min(std::max(value, low), high);\n}`, takeaways: ["Generic code has contracts", "Concepts clarify intent", "Compile-time work can remove runtime branches"] },
      { id: "cpp-move", stage: "03 · Ownership", title: "Move, don’t copy by accident", description: "Understand value categories and move semantics as a performance and ownership tool.", duration: "30 min", code: `std::vector<int> build() {\n  std::vector<int> result{1, 2, 3};\n  return result;\n}`, takeaways: ["Moves transfer resources", "Copy cost should be visible", "Standard containers carry ownership"] },
      { id: "cpp-modern", stage: "04 · Design", title: "Modern C++ is a smaller language", description: "Use ranges, smart pointers, and const-correct APIs to make large codebases less surprising.", duration: "28 min", code: `auto even = values | std::views::filter(\n  [](int value) { return value % 2 == 0; }\n);`, takeaways: ["Prefer the standard library", "Make invalid states harder to express", "Readability is a performance feature"] },
    ],
  },
  r: {
    language: "r",
    label: "R",
    eyebrow: "Evidence through computation",
    accent: "#587A7B",
    soft: "#DCE9E7",
    total: 16,
    completed: 0,
    level: "Making data speak",
    tagline: "Ask better questions of the numbers.",
    lessons: [
      { id: "r-vectors", stage: "01 · Foundations", title: "Vectors are the grain", description: "Think in vectors first: R’s smallest useful unit is already a column of data.", duration: "17 min", code: `scores <- c(72, 88, 91, 64)\nmean(scores)\nscores[scores > 80]`, takeaways: ["Vectorization is the default", "Indexing is a question", "Missingness deserves a plan"] },
      { id: "r-dataframes", stage: "02 · Data", title: "Data frames as working tables", description: "Filter, select, and reshape data while keeping each transformation legible.", duration: "21 min", code: `library(dplyr)\nnotes |>\n  filter(status == "open") |>\n  select(title, owner)`, takeaways: ["Pipelines show decisions", "Names make analysis auditable", "One transformation per line helps review"] },
      { id: "r-visuals", stage: "03 · Communication", title: "Plots are arguments", description: "Choose encodings that make the important comparison easy to see and hard to misread.", duration: "25 min", code: `ggplot(notes, aes(x = owner, y = minutes)) +\n  geom_col(fill = "#587A7B") +\n  labs(title = "Study minutes by owner")`, takeaways: ["Scale is a design choice", "Labels reduce guesswork", "A chart should answer a question"] },
      { id: "r-models", stage: "04 · Models", title: "Model, inspect, communicate", description: "Fit a simple model, inspect residuals, and separate confidence from certainty.", duration: "30 min", code: `fit <- lm(score ~ hours, data = study)\nsummary(fit)\nplot(fit)`, takeaways: ["A model is an assumption", "Diagnostics are not optional", "Explain limits with the result"] },
    ],
  },
  postgresql: {
    language: "postgresql",
    label: "PostgreSQL",
    eyebrow: "Data with a memory",
    accent: "#496A87",
    soft: "#DCE5ED",
    total: 18,
    completed: 0,
    level: "Thinking in relations",
    tagline: "Make the data tell the truth later, too.",
    lessons: [
      { id: "sql-relations", stage: "01 · Foundations", title: "Tables are promises", description: "Model entities and relationships so your database can protect the meaning of your data.", duration: "19 min", code: `create table lessons (\n  id bigint generated always as identity primary key,\n  title text not null,\n  completed_at timestamptz\n);`, takeaways: ["Constraints are executable documentation", "Keys make identity explicit", "Null is a modeling choice"] },
      { id: "sql-queries", stage: "02 · Querying", title: "Ask for exactly what you need", description: "Use filtering, grouping, and joins as a composable language for questions.", duration: "23 min", code: `select language, count(*) as completed\nfrom progress\nwhere completed_at is not null\ngroup by language\norder by completed desc;`, takeaways: ["A query is a set transformation", "Joins need a relationship", "Sort only when it changes meaning"] },
      { id: "sql-indexes", stage: "03 · Performance", title: "Indexes are trade-offs", description: "Understand what an index buys you, what it costs writes, and how to verify the planner’s choice.", duration: "27 min", code: `create index progress_language_idx\n  on progress (language, completed_at);\n\nexplain analyze\nselect * from progress where language = 'rust';`, takeaways: ["Measure with EXPLAIN", "Index the access pattern", "Every index has a write cost"] },
      { id: "sql-transactions", stage: "04 · Reliability", title: "Transactions protect a story", description: "Use atomicity and isolation to keep multi-step changes truthful under pressure.", duration: "29 min", code: `begin;\nupdate balances set amount = amount - 20 where id = 1;\nupdate balances set amount = amount + 20 where id = 2;\ncommit;`, takeaways: ["A transaction is one story", "Isolation shapes concurrency", "Rollback is a feature"] },
    ],
  },
};

export const languageOptions: { value: Language; label: string; sub: string; color: string }[] = [
  { value: "rust", label: "Rust", sub: "memory-safe systems", color: "rust-dot" },
  { value: "c", label: "C", sub: "close-to-metal craft", color: "c-dot" },
  { value: "python", label: "Python", sub: "readable power", color: "python-dot" },
  { value: "javascript", label: "JavaScript", sub: "the web runtime", color: "js-dot" },
  { value: "htmlcss", label: "HTML / CSS", sub: "interface structure", color: "html-dot" },
  { value: "cpp", label: "C++", sub: "zero-cost abstraction", color: "cpp-dot" },
  { value: "r", label: "R", sub: "evidence through data", color: "r-dot" },
  { value: "postgresql", label: "PostgreSQL", sub: "data with a memory", color: "sql-dot" },
];

export const fileNameByLanguage: Record<Language, string> = {
  rust: "main.rs",
  c: "main.c",
  python: "main.py",
  javascript: "main.js",
  htmlcss: "index.html",
  cpp: "main.cpp",
  r: "analysis.R",
  postgresql: "query.sql",
};

export const practiceByLanguage: Record<Language, { title: string; description: string; placeholder: string; reference: string }> = {
  rust: { title: "Borrow the first word", description: "Complete `first_word` so it returns a slice of the input without allocating a new String.", placeholder: "fn first_word(text: &str) -> &str {\n    // your answer\n}", reference: "text.split_whitespace().next().unwrap_or(\"\")" },
  c: { title: "Write a safe allocator", description: "Write a helper that allocates space for three integers, checks the result, and returns a clean pointer.", placeholder: "int *make_scores(void) {\n    /* your answer */\n}", reference: "let values = malloc(3 * sizeof(int));\nif (!values) return NULL;" },
  python: { title: "Group a list of notes", description: "Write a function that returns the titles of open notes, keeping the transformation easy to read.", placeholder: "def open_titles(notes):\n    # your answer\n", reference: "[note[\"title\"] for note in notes if note[\"open\"]]" },
  javascript: { title: "Guard a fetch result", description: "Write the small boundary check that turns a failed HTTP response into a useful error.", placeholder: "async function load(url) {\n  // your answer\n}", reference: "if (!response.ok) throw new Error(\"Request failed\");" },
  htmlcss: { title: "Name the page structure", description: "Create a semantic article skeleton with a heading, a paragraph, and a visible action.", placeholder: "<article>\n  <!-- your answer -->\n</article>", reference: "<h1>Study notes</h1>\n<p>One concept at a time.</p>" },
  cpp: { title: "Make cleanup automatic", description: "Choose a standard-library type that owns a dynamic collection and releases it at scope exit.", placeholder: "void collect() {\n  // your answer\n}", reference: "std::vector<int> values{1, 2, 3};" },
  r: { title: "Filter the signal", description: "Write an expression that returns scores above 80 from a numeric vector.", placeholder: "scores <- c(72, 88, 91, 64)\n# your answer\n", reference: "scores[scores > 80]" },
  postgresql: { title: "Count completed units", description: "Write a query that groups completed progress rows by language and sorts the largest count first.", placeholder: "select language\n-- your answer\n", reference: "group by language order by count(*) desc" },
};

export const referencesByLanguage: Record<Language, { label: string; note: string; url: string }[]> = {
  rust: [{ label: "The Rust Book", note: "official free guide", url: "https://doc.rust-lang.org/book/" }, { label: "Rust by Example", note: "learn by reading code", url: "https://doc.rust-lang.org/rust-by-example/" }],
  c: [{ label: "cppreference / C", note: "language reference", url: "https://en.cppreference.com/w/c" }, { label: "C FAQ", note: "practical questions", url: "https://c-faq.com/" }],
  python: [{ label: "Python Tutorial", note: "official free guide", url: "https://docs.python.org/3/tutorial/" }, { label: "Python docs", note: "language reference", url: "https://docs.python.org/3/" }],
  javascript: [{ label: "MDN JavaScript", note: "web platform guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }, { label: "ECMAScript spec", note: "the language standard", url: "https://tc39.es/ecma262/" }],
  htmlcss: [{ label: "MDN Learn", note: "HTML, CSS, browser", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core" }, { label: "Web.dev", note: "modern web craft", url: "https://web.dev/learn/" }],
  cpp: [{ label: "cppreference", note: "language reference", url: "https://en.cppreference.com/w/" }, { label: "C++ Core Guidelines", note: "community best practice", url: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines" }],
  r: [{ label: "R Manuals", note: "official free manuals", url: "https://cran.r-project.org/manuals.html" }, { label: "R for Data Science", note: "open practical book", url: "https://r4ds.hadley.nz/" }],
  postgresql: [{ label: "PostgreSQL docs", note: "official free manual", url: "https://www.postgresql.org/docs/current/" }, { label: "SQL tutorial", note: "query foundations", url: "https://www.postgresql.org/docs/current/tutorial.html" }],
};

export const checkQuestions: Record<Language, { prompt: string; options: string[]; answer: number }> = {
  rust: { prompt: "In Rust, what happens to `title` after passing it to a function that takes `String`?", options: ["It is copied automatically", "It is moved and cannot be used", "It becomes a static value"], answer: 1 },
  c: { prompt: "In C, which operation releases memory returned by `malloc`?", options: ["delete", "release", "free"], answer: 2 },
  python: { prompt: "Which Python container maps keys to values?", options: ["list", "dictionary", "tuple"], answer: 1 },
  javascript: { prompt: "What does `await` do inside an async function?", options: ["It pauses that function until a promise settles", "It freezes the browser", "It converts a string to JSON"], answer: 0 },
  htmlcss: { prompt: "Which element is the main heading of a page section?", options: ["<div>", "<h1>", "<span>"], answer: 1 },
  cpp: { prompt: "What does RAII primarily tie resource cleanup to?", options: ["Global variables", "Object lifetime", "Compiler warnings"], answer: 1 },
  r: { prompt: "What does `scores[scores > 80]` return?", options: ["Scores above 80", "The row names only", "A sorted copy of every score"], answer: 0 },
  postgresql: { prompt: "Which clause groups rows so aggregate functions can summarize them?", options: ["GROUP BY", "ORDER BY", "LIMIT"], answer: 0 },
};

export const checkExplanations: Record<Language, string> = {
  rust: "A function taking String receives ownership. Borrow with &str when the caller should retain it.",
  c: "free releases a block allocated by malloc. The pointer should not be used after the release.",
  python: "Dictionaries make a key-to-value relationship explicit and support readable lookups.",
  javascript: "await suspends the current async function while the promise settles; it does not freeze the whole runtime.",
  htmlcss: "h1 communicates the primary heading to browsers, assistive technology, and search engines.",
  cpp: "RAII makes a resource follow object lifetime, so scope exit performs deterministic cleanup.",
  r: "Logical indexing selects the elements whose corresponding condition is TRUE.",
  postgresql: "GROUP BY forms groups before aggregate functions such as count summarize each group.",
};

export function ProgressRing({ value, color }: { value: number; color: string }) {
  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="progress-ring" style={{ ["--progress-color" as string]: color } as React.CSSProperties}>
      <svg width="64" height="64" viewBox="0 0 64 64" aria-label={`${value}% complete`}>
        <circle className="ring-track" cx="32" cy="32" r={radius} />
        <circle className="ring-value" cx="32" cy="32" r={radius} style={{ strokeDasharray: circumference, strokeDashoffset: circumference - (value / 100) * circumference }} />
      </svg>
      <span>{value}%</span>
    </div>
  );
}

export function AppMark() {
  return (
    <div className="app-mark" aria-label="CodeMastery home">
      <span>CM</span><b>&gt;</b>
    </div>
  );
}

