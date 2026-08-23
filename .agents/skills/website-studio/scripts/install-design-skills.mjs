#!/usr/bin/env node
/**
 * Install design skills from this skill's bundled library into a project's
 * .claude/skills/ directory.
 *
 *   node install-design-skills.mjs --core
 *   node install-design-skills.mjs --core --taste minimal
 *   node install-design-skills.mjs image-to-code brandkit
 *   node install-design-skills.mjs --list
 *   node install-design-skills.mjs --core --project ~/sites/acme
 *
 * Node rather than shell on purpose: macOS still ships bash 3.2, which has no
 * associative arrays, and any project this skill targets already needs Node.
 * Same behaviour on macOS, Linux and Windows.
 *
 * Copies real files rather than symlinking, so an installed skill survives the
 * repo being cloned, moved, or checked out into a git worktree.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));

/** Bundled library first; fall back to a machine-global one if this is a slim copy. */
const LIB = [
  process.env.SKILL_LIBRARY,
  resolve(here, '..', 'library'),
  join(homedir(), '.claude', 'skill-library', 'design'),
].find((p) => p && existsSync(p));

/** The always-on set. Every website build gets these. */
const CORE = [
  'image-to-code',           // generate references, analyse, then implement
  'imagegen-frontend-web',   // how to prompt for premium, extractable references
  'design-taste-frontend',   // anti-slop direction: reads a brief, picks a lane
  'full-output-enforcement', // stops truncated / placeholder code generation
  'emil-design-eng',         // UI polish, the invisible details
  'apple-design',            // motion, materials, typography foundations
];

/**
 * Aesthetic direction — pick exactly ONE. These contradict each other by design:
 * minimalist-ui bans what gpt-taste requires. Installing two makes the agent hedge
 * between them, and hedged design is the generic look this is meant to avoid.
 */
const TASTE = {
  minimal: 'minimalist-ui',
  agency: 'high-end-visual-design',
  brutalist: 'industrial-brutalist-ui',
  editorial: 'stitch-design-taste',
  motion: 'gpt-taste',
};

const expand = (p) => (p.startsWith('~') ? join(homedir(), p.slice(1)) : p);
const die = (msg, code = 2) => { console.error(msg); process.exit(code); };

// ── Parse args ───────────────────────────────────────────────────────────────
const want = [];
let project = process.cwd();
let force = false;
let list = false;

const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--list') list = true;
  else if (a === '--core') want.push(...CORE);
  else if (a === '--force') force = true;
  else if (a === '--taste') {
    const key = argv[++i];
    if (!TASTE[key]) die(`Unknown taste '${key}'. Options: ${Object.keys(TASTE).join(', ')}`);
    want.push(TASTE[key]);
  } else if (a === '--project') {
    project = resolve(expand(argv[++i] ?? die('--project needs a path')));
  } else if (a === '-h' || a === '--help') {
    console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(2, 12).join('\n').replace(/^ \* ?/gm, ''));
    process.exit(0);
  } else if (a.startsWith('-')) die(`Unknown flag: ${a}`);
  else want.push(a);
}

if (!LIB) {
  die(
    'No skill library found. Expected a bundled ./library next to this script,\n' +
    'or ~/.claude/skill-library/design, or $SKILL_LIBRARY pointing at one.',
    1,
  );
}

// ── --list ───────────────────────────────────────────────────────────────────
if (list) {
  console.log(`Library: ${LIB}\n`);
  for (const name of readdirSync(LIB).sort()) {
    if (!statSync(join(LIB, name)).isDirectory()) continue;
    let desc = '';
    try {
      const md = readFileSync(join(LIB, name, 'SKILL.md'), 'utf8');
      desc = (md.match(/^description:\s*(.*)$/m)?.[1] ?? '').replace(/^["']|["']$/g, '').slice(0, 88);
    } catch { /* a skill without SKILL.md still lists, just without a description */ }
    console.log(`  ${name.padEnd(28)} ${desc}`);
  }
  console.log(`\nTaste keys: ${Object.keys(TASTE).join(', ')}`);
  console.log(`Core set:   ${CORE.join(', ')}`);
  process.exit(0);
}

if (!want.length) die('Nothing to install. Try --core, or --list to see the library.');

// More than one aesthetic skill selected — warn, but let it through; the user may
// genuinely want to read two before choosing.
const tasteHits = want.filter((s) => Object.values(TASTE).includes(s));
if (tasteHits.length > 1) {
  console.error(
    `WARNING: ${tasteHits.length} aesthetic skills selected (${tasteHits.join(', ')}).\n` +
    '         They contradict each other — pick one direction, or the output hedges.\n',
  );
}

// ── Install ──────────────────────────────────────────────────────────────────
const dest = join(project, '.claude', 'skills');
mkdirSync(dest, { recursive: true });

let installed = 0, skipped = 0, missing = 0;
for (const name of [...new Set(want)]) {
  const src = join(LIB, name);
  if (!existsSync(src)) {
    console.error(`  missing in library:  ${name}`);
    missing++;
    continue;
  }
  const dst = join(dest, name);
  if (existsSync(dst) && !force) {
    console.log(`  exists (--force):    ${name}`);
    skipped++;
    continue;
  }
  rmSync(dst, { recursive: true, force: true });
  cpSync(src, dst, { recursive: true, dereference: true });
  console.log(`  installed:           ${name}`);
  installed++;
}

const short = dest.replace(homedir(), '~');
console.log(`\n${installed} installed, ${skipped} skipped, ${missing} missing → ${short}`);
if (missing) process.exit(1);
console.log('Newly installed skills are listed after a session reload — until then,');
console.log('read their SKILL.md directly rather than waiting.');
