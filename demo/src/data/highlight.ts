export type SegmentKind = "text" | "cmt" | "str" | "kw" | "fn" | "tag";

export type Segment = {
  kind: SegmentKind;
  text: string;
};

const KEYWORDS = new Set([
  "import",
  "export",
  "from",
  "const",
  "let",
  "var",
  "async",
  "await",
  "function",
  "return",
  "if",
  "else",
  "new",
  "type",
  "class",
  "for",
  "in",
  "of",
  "while",
  "typeof",
  "default",
  "null",
  "true",
  "false",
  "this",
  "as",
  "interface",
  "enum",
  "throw",
  "try",
  "catch",
]);

/**
 * Tiny JS/TS tokenizer. Handles line comments, string literals (", ', `),
 * keywords, and identifiers called as functions. Everything else falls
 * through as plain text. Not a real parser — good enough for the demo
 * snippets, ~1% the byte cost of shipping Shiki/Prism.
 */
export function tokenize(src: string): Segment[] {
  const out: Segment[] = [];
  const n = src.length;
  let i = 0;

  const push = (kind: SegmentKind, text: string) => {
    if (!text) return;
    const last = out[out.length - 1];
    if (last && last.kind === kind) {
      last.text += text;
    } else {
      out.push({ kind, text });
    }
  };

  while (i < n) {
    const c = src[i];

    // Line comment: // ... to end of line
    if (c === "/" && src[i + 1] === "/") {
      let j = i;
      while (j < n && src[j] !== "\n") j++;
      push("cmt", src.slice(i, j));
      i = j;
      continue;
    }

    // Block comment: /* ... */
    if (c === "/" && src[i + 1] === "*") {
      let j = i + 2;
      while (j < n - 1 && !(src[j] === "*" && src[j + 1] === "/")) j++;
      j = Math.min(j + 2, n);
      push("cmt", src.slice(i, j));
      i = j;
      continue;
    }

    // String literals: ", ', `
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === quote) {
          j++;
          break;
        }
        if (src[j] === "\n" && quote !== "`") break;
        j++;
      }
      push("str", src.slice(i, j));
      i = j;
      continue;
    }

    // Identifier / keyword / function name
    if (/[a-zA-Z_$]/.test(c)) {
      let j = i;
      while (j < n && /[a-zA-Z0-9_$]/.test(src[j]!)) j++;
      const word = src.slice(i, j);
      if (KEYWORDS.has(word)) {
        push("kw", word);
      } else if (src[j] === "(") {
        push("fn", word);
      } else {
        push("text", word);
      }
      i = j;
      continue;
    }

    // JSX-ish: < followed by letter → treat tag name as keyword color.
    if (c === "<" && /[a-zA-Z/]/.test(src[i + 1] ?? "")) {
      push("text", "<");
      i++;
      if (src[i] === "/") {
        push("text", "/");
        i++;
      }
      let j = i;
      while (j < n && /[a-zA-Z0-9]/.test(src[j]!)) j++;
      if (j > i) push("tag", src.slice(i, j));
      i = j;
      continue;
    }

    // Everything else — consume one char. Cheap fallback.
    push("text", c);
    i++;
  }

  return out;
}
