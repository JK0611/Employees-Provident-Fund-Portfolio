# The build method — six phases

Loaded by `website-studio` at Stage 3. Follow in order.

---

Distilled from a set of production dashboards, consoles and storefronts. It exists
because freeform "make it pretty" coding produces an app that looks different on
every screen and breaks the moment a second theme is added. The rule set below is
what stops that.

The six non-negotiables are stated in `SKILL.md`; the phases here are how they get
enforced.

---

## Phase 0 — Get a reference before writing CSS

A visually important surface (landing page, dashboard, pricing page, console shell)
starts from an image, not from code.

- **User has a reference** → use it. Keep it in the repo root or `design/` next to
  the code (`dashboard-reference.png`, `component-design.png`, `pricing-reference.png`). Referencing a file that lives outside the
  repo means the contract is unverifiable later.
- **No reference** → generate one first (`image-to-code` / Higgsfield `generate_image`
  if available), show it, get a yes, *then* build. Generate large section-specific
  images, not one tiny compressed board.
- **Reworking a live app** → screenshot the current state first. The before/after
  pair is what makes the rework reviewable.

If the user gives a reference for one screen only, extract the *system* from it and
derive the rest. Don't ask for eight more images.

## Phase 1 — Measure it, write the contract

Produce `plans/<name>/DESIGN-SYSTEM.md` (or `docs/design-system.md`) **before**
touching `globals.css`. Every row names the value *and where in the reference it
was read*. This is the document the implementation is checked against — a table of
invented values is worthless.

Cover, in this order: surfaces · borders · text ramp · accent · semantic tones ·
radii · spacing · type scale · component geometry · charts · second theme · contrast
audit · focus · motion.

Two habits that carry most of the value:

- **Say what the reference does *not* do.** "The reference has no drop shadows —
  hierarchy is one surface step plus a hairline. Any shadow is a deviation."
  That single line prevents a hundred stray `shadow-lg`s.
- **Count accent occurrences.** In one reference dashboard the lime accent appeared
  exactly twice: the brand mark and one chart bar. Writing that down is what stopped
  it becoming the active-nav colour. Restraint has to be recorded or it evaporates.

Finish with a **WCAG AA contrast audit** as a table (pair · dark ratio · light ratio ·
required · pass). Failures are allowed, but each must be justified and bounded — e.g.
*"`--text-tertiary` is 2.9:1; it is used only for chart axis labels and duplicated
suffixes. Rule: it may never carry information that appears nowhere else."*

## Phase 2 — Encode the tokens (one file, one place)

All colour lives in `globals.css`. Nothing outside it declares a colour.

Split by what varies:

- **Geometry is theme-invariant** — radii, spacing, type scale, motion, layout
  widths. Declare once at `:root`. If a radius changes between themes, that's a bug.
- **Colour ramps are per-theme** — declared in a `:root`/default block and a
  `[data-theme="…"]` block that redeclares *every* colour token. Never a partial
  override; a token defined in only one theme is a future invisible-text bug.

The ramp shape that has held up across every project using this method:

| Group | Tokens |
|---|---|
| Surfaces | `page` → `panel` → `raised` → `hover` → `active` (one step each) |
| Borders | `subtle` · `base` · `strong` (`strong` for interactive bounds) |
| Text | `primary` · `secondary` · `tertiary` |
| Accent | `accent` (fills) · `accent-ink` (text/icons — differs on light) · `accent-wash` (~10%) · `accent-contrast` (text *on* accent) |
| Semantic | `success` · `warn` · `danger` · `info`, each with a `-wash`/`-soft` fill |
| Chart | idle bar · active bar · axis · grid · categorical set · heat ramp |
| State | `focus-ring` · `scrim` · overlay hover/press |

Use `oklch()` for new palettes (predictable lightness when deriving the second
theme) or hex when transcribing a reference literally. Don't mix within a project.

`references/tokens.css` is a working Tailwind-v4 skeleton with the
shadcn interop block — copy it and replace values. Read it before authoring
`globals.css` from scratch.

**shadcn interop:** map shadcn's names onto your palette (`--primary: var(--ink)`,
`--ring: var(--accent-soft)`, `--card: var(--surface)`, plus the `--sidebar-*` set)
via `@theme inline`. Then shadcn primitives inherit the system for free and you
never restyle a Button.

## Phase 3 — Consume tokens, never literals

Pick **one** consumption convention per repo and never mix the two:

```tsx
// A — arbitrary values
className="bg-[color:var(--color-card)] text-[color:var(--color-fg)] border-[color:var(--color-border)]"

// B — shadcn utility names, backed by @theme inline
className="bg-card text-foreground border-border"
```

Banned in app UI under either convention: `text-white`, `bg-black/40`,
`border-white/10`, `text-emerald-400`, raw hexes, any Tailwind palette colour.

**Status colour goes through a tone set, not per-component classes.** Define
`--tone-{success,danger,warning,info,progress,draft,accent}-{bg,border,text}` and
drive a single `Pill`/`Badge` from a `Record<Tone, string>` map. This is why status chips stay
legible when dark mode lands later — the tones brighten in one place. Adding a status = adding a tone, never a new colour in a component.

**Signature moves are cheap and worth more than they look.** The uppercase 11px
`+0.06em` micro-label on every stat label, table header and panel sub-label does
more to make a surface read as *one system* than any other single choice. Find the
reference's equivalent move and apply it everywhere.

Layout defaults that keep output from looking AI-generated: no cards inside cards
inside cards; no three-equal-cards-in-a-row feature grid; `min-height: 100dvh` never
`100vh`; hierarchy from one surface step + hairline, not from stacked shadows.

## Phase 4 — The second theme is a derivation

Adding light to a dark app (or the reverse) is not a redesign.

- Same geometry, same accent, same semantics. **Only the neutral ramp inverts.**
- **The existing theme must stay pixel-identical.** Give it exactly the values it
  has today; every new theme-dependent value goes into *both* blocks.
- Retune the accent for the new canvas. A bright accent that sings on near-black
  usually fails contrast on white — keep the bright value for *fills* and add a
  darkened `--accent-ink` for text and icons.
- Washes invert too: a semantic wash is a tinted near-black on dark and a tinted
  near-white on light. Text sits ~7:1 on its own wash in both.
- Directional ramps flip. A heatmap goes dark→bright on dark and light→dark on
  light; both must read "more intense" correctly.
- Light-mode shadows are softer. A near-black drop shadow on white reads as grime.
- On light, prefer warm-grey scrims over black — black turns white surfaces muddy.

**Wiring:** write `data-theme` onto `<html>` (via `next-themes` or a small provider),
persist to `localStorage`, and inline a no-flash script in `<head>` that sets the
attribute *before paint*. Set `color-scheme` at the document level, not scoped to
the app shell, so native controls, caret and autofill follow the theme.

**Portals are the classic miss.** Anything rendered to `<body>` (toasts, dialogs,
command palettes) escapes an app-shell-scoped palette. Either declare tokens at
`:root` or give portaled surfaces a class carrying the same palette
(e.g. `.app-portal`). Audit every portal after adding a theme.

## Phase 5 — Guard it

Ship a checker with the design system; a token system without one decays in a week.

`scripts/check-theme-hardcodes.mjs` (copy from this skill's `scripts/`) walks the app
surface and fails on raw theme colours, printing `file:line`. Wire it into the same
command as typecheck.

Some surfaces are genuinely theme-independent, and re-theming them is a *regression*:

- controls overlaid on video/media frames
- bespoke cinematic dark landings, hero art, generative backdrops
- brand marks (swap a PNG pair, don't token it)
- accent/dark fills, where `text-white` is correct in both themes

Each goes in the script's `EXEMPT` list **with a reason**, and in a
**"Deliberate exemptions — do not fix these"** section of the project's CLAUDE.md.
An unexplained exemption is how a theme bug hides; an unrecorded intentional choice
is how a future agent "fixes" it back. Write both down.

## Phase 6 — See it before claiming it

Not done until it's been rendered.

- Screenshot **both themes × 375 / 768 / 1440**. Horizontal scroll at 375px is a
  critical failure, not a nit.
- A repeatable shoot script (Playwright/`preview_*`, handling sign-in and writing a
  screenshot pair per route) pays for itself by the second rework.
- Auth in the way: use a dev-login bypass route or seeded cookie rather than
  hand-driving the login form each time.
- Deployed work is verified by curling the public URL/IP, not localhost.
- Compare against the reference side by side. "Close enough" at 100% zoom usually
  means radii and type tracking drifted.

---

## Applying this to an existing project

1. Read `globals.css` and any project CLAUDE.md **first** — several of these repos
   already carry deliberate choices (a colour reserved for one status, glass kept
   over a video background, chrome that stays dark on purpose). Don't "fix" them.
2. Inventory the drift: run the hardcode checker (or grep the banned patterns) to
   size the job before proposing anything.
3. Migrate leaf-first — tone sets and shared primitives (`Pill`, `Card`, `Button`)
   before page bodies. One primitive fix repairs dozens of call sites.
4. Keep legacy aliases pointing at the new tokens (`--surface-primary: var(--color-card)`)
   so the app never breaks mid-migration, and retire them in a named later phase.

## Failure modes seen in practice

| Symptom | Cause | Fix |
|---|---|---|
| App looks generic / "AI-made" | No reference; values invented | Phase 0–1 properly |
| Accent everywhere, nothing reads as important | Accent restraint never written down | Count its uses in the reference; record the count |
| Dark mode ships, half the text invisible | Literals in components; portals unscoped | Checker + portal audit |
| Theme toggle flashes on load | No pre-paint inline script | Phase 4 wiring |
| Radix dialog/popover exits skip | Exit as a CSS *transition* | Use keyframes — Radix delays unmount only for animations |
| Dialog jumps toward top-left while animating | Keyframe carries `translate()` alongside Tailwind's `-translate-x/y-1/2` | Animate **scale/opacity only** |
| Surfaces drift apart over months | Colour declared outside `globals.css` | Re-run Phase 2, then guard |
