#!/usr/bin/env node
/**
 * Guard against theme regressions: no raw light/dark colour utilities inside the
 * app surface. Everything there must go through design tokens so both themes stay
 * correct — a `text-white` that looks fine on a near-black canvas is invisible on
 * white, and nobody notices until a user toggles the theme.
 *
 * Exits non-zero on any hit, listing file:line so it's actionable.
 *
 *   node scripts/check-theme-hardcodes.mjs
 *   node scripts/check-theme-hardcodes.mjs app components   # override roots
 *
 * Node rather than a ripgrep one-liner so it runs anywhere `pnpm typecheck` runs.
 *
 * Copied from ~/.claude/skills/website-design. Tune ROOTS/EXEMPT/PATTERNS for the
 * project, then wire it into the same command as typecheck.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
/** Project root, relative to this script's location (scripts/ → ..). */
const root = resolve(here, '..');

/** Directories to walk, relative to the project root. CLI args override. */
const ROOTS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['app', 'src/app', 'components', 'src/components'];

/**
 * Files exempt by design, matched as substrings of the project-relative path.
 * EVERY entry needs a reason — an unexplained exemption is how a theme bug hides,
 * and an unrecorded intentional choice is how a future agent "fixes" it back.
 * Mirror this list in the project's CLAUDE.md under "Deliberate exemptions".
 *
 * Legitimate categories (from real projects):
 *   - controls overlaid on video/media frames — theme-independent by nature
 *   - bespoke cinematic dark landings / hero art / generative backdrops
 *   - brand marks (swap a PNG pair, don't token them)
 *   - deliberate always-dark chrome: sidebars over page art, media letterboxes
 */
const EXEMPT = [
  // 'components/player/scene-player',  // controls sit on video frames
  // 'components/marketing/',           // bespoke dark landing, out of theming scope
];

/** Raw utilities and literals that hardcode a light or dark value. */
const PATTERNS = [
  /\btext-white\b/,
  /\btext-black\b/,
  /\bbg-white\b/,
  /\bbg-black\b/,
  /\b(bg|text|border|from|via|to)-white\//,
  /\b(bg|text|border|from|via|to)-black\//,
  // Tailwind palette colours — status must go through tone tokens.
  /\b(bg|text|border|ring|from|via|to)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/,
  // Raw hex in a className / inline style.
  /(className|style)=[^\n]*#[0-9a-fA-F]{3,8}\b/,
];

const walk = (dir) => {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out; // a root that doesn't exist in this project layout
  }
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === '.next' || entry === 'dist') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out = out.concat(walk(full));
    else if (/\.(tsx?|jsx?|css)$/.test(entry)) out.push(full);
  }
  return out;
};

const hits = [];
let scanned = 0;
for (const r of ROOTS) {
  for (const file of walk(resolve(root, r))) {
    scanned++;
    const rel = relative(root, file);
    if (EXEMPT.some((e) => rel.includes(e))) continue;
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        // Skip comment lines — prose about a utility isn't a use of it.
        if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
        // Opt-out for a single justified line.
        if (/theme-hardcode-ok/.test(line)) return;
        if (PATTERNS.some((p) => p.test(line))) {
          hits.push(`  ${rel}:${i + 1}  ${line.trim().slice(0, 110)}`);
        }
      });
  }
}

// A clean run over zero files is not a pass — it means ROOTS is wrong for this
// project's layout (paths resolve against this script's parent directory).
if (scanned === 0) {
  console.error(
    `Scanned 0 files. ROOTS (${ROOTS.join(', ')}) resolved nothing under ${root}.\n` +
      'Fix ROOTS for this project layout, or pass roots as CLI args.',
  );
  process.exit(2);
}

if (hits.length) {
  console.error(
    `Found ${hits.length} hardcoded theme colour(s) in the app surface.\n` +
      'Use design tokens instead, e.g. text-[color:var(--text-primary)].\n' +
      'If a surface is genuinely theme-independent (overlay on media, brand art),\n' +
      'add it to EXEMPT in this script WITH A REASON, or mark the single line\n' +
      'with a `theme-hardcode-ok` comment.\n',
  );
  console.error(hits.join('\n'));
  process.exit(1);
}

console.log('No hardcoded theme colours in the app surface.');
