// Renders the chat's replies: a small, safe subset of Markdown built as DOM nodes (never innerHTML), so model
// output can't inject markup. Blocks: paragraphs, headings, bullet and numbered lists, tables, code blocks.
// Inline: **bold**, *italic*, ~~strike~~, `code`, [links](https://…), and bare URLs and email addresses.

const INLINE =
  /\*\*(.+?)\*\*|__(.+?)__|(?<![\w*])\*(?![\s*])(.+?)(?<!\s)\*(?![\w*])|(?<!\w)_(?!\s)(.+?)(?<!\s)_(?!\w)|~~(.+?)~~|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|(?<![\w.+-])([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|(https?:\/\/[^\s<>()]*[^\s<>().,!?;:'"])/g;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function link(href: string, children: Node[] | string) {
  const a = el("a", "md-link");
  a.href = href;
  if (/^https?:/.test(href)) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  a.append(...(typeof children === "string" ? [children] : children));
  return a;
}

/** An email address: emphasised in the accent colour and kept on one line. */
function email(address: string) {
  const a = link(`mailto:${address}`, address);
  a.className = "md-email";
  return a;
}

function inline(text: string): Node[] {
  const nodes: Node[] = [];
  let at = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > at) nodes.push(document.createTextNode(text.slice(at, m.index)));
    at = m.index + m[0].length;
    const [, bold1, bold2, italic1, italic2, strike, code, label, href, address, url] = m;
    if (bold1 ?? bold2) {
      const strong = el("strong");
      strong.append(...inline(bold1 ?? bold2));
      nodes.push(strong);
    } else if (italic1 ?? italic2) {
      const em = el("em");
      em.append(...inline(italic1 ?? italic2));
      nodes.push(em);
    } else if (strike) {
      const s = el("s");
      s.append(...inline(strike));
      nodes.push(s);
    } else if (code) {
      const c = el("code");
      c.textContent = code;
      nodes.push(c);
    } else if (label) {
      const target = href.replace(/^mailto:/i, "");
      if (/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(target)) nodes.push(email(target));
      else if (/^https?:\/\//i.test(href)) nodes.push(link(href, inline(label)));
      else nodes.push(...inline(label)); // anything else (javascript:, relative paths) stays plain text
    } else if (address) {
      nodes.push(email(address));
    } else if (url) {
      nodes.push(link(url, url));
    }
  }
  if (at < text.length) nodes.push(document.createTextNode(text.slice(at)));
  return nodes;
}

/** Inline content with single line breaks kept as <br>. */
function lines(parent: HTMLElement, text: string) {
  text.split("\n").forEach((line, i) => {
    if (i > 0) parent.append(el("br"));
    parent.append(...inline(line));
  });
  return parent;
}

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
const isDivider = (row: string) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(row);
const startsTable = (rows: string[], i: number) => rows[i].includes("|") && i + 1 < rows.length && isDivider(rows[i + 1]);
const BULLET = /^\s*[-*•]\s+/;
const NUMBER = /^\s*\d+[.)]\s+/;

export function markdown(source: string) {
  const out = document.createDocumentFragment();
  const rows = source.replace(/\r\n?/g, "\n").split("\n");
  let i = 0;
  while (i < rows.length) {
    const row = rows[i];
    if (!row.trim()) {
      i++;
    } else if (row.trim().startsWith("```")) {
      const code: string[] = [];
      for (i++; i < rows.length && !rows[i].trim().startsWith("```"); i++) code.push(rows[i]);
      i++;
      const pre = el("pre");
      pre.textContent = code.join("\n");
      out.append(pre);
    } else if (/^#{1,6}\s/.test(row)) {
      out.append(lines(el("p", "md-heading"), row.replace(/^#+\s*/, "")));
      i++;
    } else if (startsTable(rows, i)) {
      const table = el("table");
      const head = table.createTHead().insertRow();
      cells(row).forEach((c) => head.append(lines(el("th"), c)));
      const body = table.createTBody();
      for (i += 2; i < rows.length && rows[i].includes("|") && rows[i].trim(); i++) {
        const tr = body.insertRow();
        cells(rows[i]).forEach((c) => tr.append(lines(el("td"), c)));
      }
      const wrap = el("div", "md-table");
      wrap.append(table);
      out.append(wrap);
    } else if (BULLET.test(row) || NUMBER.test(row)) {
      const marker = BULLET.test(row) ? BULLET : NUMBER;
      const list = el(marker === BULLET ? "ul" : "ol");
      for (; i < rows.length && marker.test(rows[i]); i++) list.append(lines(el("li"), rows[i].replace(marker, "")));
      out.append(list);
    } else {
      const text: string[] = [];
      do text.push(rows[i++]);
      while (i < rows.length && rows[i].trim() && !/^(#{1,6}\s|\s*```)/.test(rows[i]) && !BULLET.test(rows[i]) && !NUMBER.test(rows[i]) && !startsTable(rows, i));
      out.append(lines(el("p"), text.join("\n")));
    }
  }
  return out;
}
