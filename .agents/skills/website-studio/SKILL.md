---
name: website-studio
description: End-to-end website and web-app UI building — interviews the user about purpose, audience, aesthetic direction and stack; writes a BRIEF.md; installs the matching design-skill library into the project; then runs the reference-first, token-only build (generate design references, extract measured design tokens, implement, guard with a hardcode checker, verify in a real browser at three widths in both themes). Use when building a new site or app UI from zero, reworking an existing one that looks generic or AI-made, adding a design system or design tokens, adding dark or light mode, theming an app, wiring shadcn onto a custom palette, or working in globals.css. Triggers on "build me a website", "start a new site", "landing page", "dashboard UI", "design system", "design tokens", "redesign", "match this reference", "add dark mode", "the UI looks off".
---

# Website studio

Zero to a built, verified UI. Self-contained: the design-skill library ships inside
this skill at `library/`.

**Interview** → **Install** → **Build** → **Verify**

Six non-negotiables. Everything else is judgement.

1. A reference image is the source of truth. No visually important surface gets coded first.
2. Every value is measured off the reference and written down with where it was read from.
3. Colour is declared in exactly one file. Components consume tokens, never literals.
4. One accent, used sparingly. The second theme is derived, not redesigned.
5. A script enforces #3, and every exemption carries a written reason.
6. It isn't done until it's been seen in a browser, at three widths, in both themes.

---

## Stage 0 — Read the room (no questions yet)

```bash
ls -a; cat package.json 2>/dev/null; ls .claude/skills 2>/dev/null
git rev-parse --is-inside-work-tree 2>/dev/null
```

- **Empty / fresh directory** → full interview.
- **Existing repo with a UI** → this is a rework. Skip to the aesthetic and theme
  questions only, then go to Stage 3 with `redesign-existing-projects` installed.
- **Existing repo, no UI yet** → skip the stack round, keep the rest.
- **Reference image already present** (`design/`, `*-reference.*`, `*-ref.png`) → say
  you found it and skip the "do you have a reference" question.
- **A project `CLAUDE.md` exists** → read it before proposing anything. Mature
  projects carry deliberate choices (a colour reserved for one status, glass kept
  over a video background, chrome that stays dark). Don't "fix" them.

Anything readable from the repo, don't ask. A question whose answer is already on
disk reads as not having looked.

## Stage 1 — Interview

Use `AskUserQuestion`. **One round per message** — later rounds depend on earlier
answers. Max 4 questions per call, 2–4 concrete options each.

### Round 1 — What is it, and what must it do

| Question | Header | Options |
|---|---|---|
| What kind of site is this? | Site type | Marketing / landing · Web app console or dashboard · Ecommerce storefront · Docs or content |
| What is the one thing a visitor should do? | Primary CTA | Book a demo or call · Sign up / start free · Buy a product · Read and learn |
| Who is it for? | Audience | Consumers · Small business · Enterprise buyers · Developers |

Also ask in the message body (free text, not options): **what the product is called
and what it actually does.**

The CTA answer matters more than it looks — one primary CTA per page is a hard rule
downstream, and it decides the hero, the nav and the section order.

### Round 2 — How it should look and feel

| Question | Header | Options |
|---|---|---|
| Which visual direction? | Direction | Minimal editorial (warm monochrome, typographic, flat) · High-end agency (rich, layered, premium polish) · Industrial / brutalist (rigid grids, extreme type contrast) · Expressive motion-led (GSAP-driven, cinematic) |
| Light or dark? | Theme | Dark-first · Light-first · Both, with a toggle |
| How much motion? | Motion | Restrained (hover / entrance only) · Balanced (staggered reveals, spring physics) · Cinematic (orchestrated, scroll-driven) |
| What do you already have? | Brand assets | Logo + colours · A design reference image · A live site to match · Nothing — generate it |

If they pick **both themes**, flag the cost honestly: it roughly doubles the palette
work and every surface gets checked twice. Right default for a console, usually
overkill for a one-page marketing site.

### Round 3 — Build constraints

Skip anything Stage 0 already answered.

| Question | Header | Options |
|---|---|---|
| Stack? | Stack | Next.js App Router + Tailwind v4 + shadcn (default) · Existing repo's stack · Static HTML/CSS · Other |
| Where does the copy come from? | Copy | I'll provide real copy · Draft it from this brief · Placeholder for now |
| Where does it deploy? | Deploy | Railway · Vercel · Not yet / local only |
| Which sections? | Sections | *(multiSelect: hero, features, pricing, testimonials, FAQ, about, contact, blog — or for a console: shell + nav, overview, list/table, detail, settings)* |

**Real copy beats placeholder by a mile.** Sections sized for fake text collapse when
real text arrives. If they choose placeholder, write realistic length-accurate
strings — never lorem ipsum.

### Round 4 — Only if something is genuinely still open

At most two follow-ups: inspiration sites, a fixed brand colour, a launch date that
should cut scope. If you know enough to build, stop asking.

## Stage 2 — Brief, then install

**Write `BRIEF.md` at the project root first**, from `references/brief-template.md`.
Show it and get a yes. This is the cheapest moment to catch a misunderstanding — one
wrong paragraph here is a day of rework later.

Then install. Round 2's direction maps to exactly one aesthetic skill:

| Direction | `--taste` | Installs |
|---|---|---|
| Minimal editorial | `minimal` | `minimalist-ui` |
| High-end agency | `agency` | `high-end-visual-design` |
| Industrial / brutalist | `brutalist` | `industrial-brutalist-ui` |
| Expressive motion-led | `motion` | `gpt-taste` |
| *(Stitch DESIGN.md workflow)* | `editorial` | `stitch-design-taste` |

Run it from this skill's directory:

```bash
node scripts/install-design-skills.mjs --core --taste minimal
node scripts/install-design-skills.mjs --list          # see everything available
```

`--core` installs `image-to-code`, `imagegen-frontend-web`, `design-taste-frontend`,
`full-output-enforcement`, `emil-design-eng`, `apple-design`.

**Install exactly one aesthetic skill.** They contradict each other on purpose —
`minimalist-ui` bans what `gpt-taste` requires. Two installed means the agent hedges,
and hedged design is the generic look this exists to avoid.

Optional extras by need: `brandkit` (no identity yet) · `imagegen-frontend-mobile`
(native app screens) · `redesign-existing-projects` (reworking a live site) ·
`animation-vocabulary` + `review-animations` (motion-heavy builds).

Newly installed skills aren't listed until the session reloads. Don't wait — read the
installed `SKILL.md` files directly and follow them now.

## Stage 3 — Build

Follow **`references/design-method.md`** — the six phases, in order. Summary:

1. **Reference** — generate with `image-to-code` + `imagegen-frontend-web`. Large
   section-specific images, never one compressed board. Show them, get a yes, save to `design/`.
2. **Measure** — `DESIGN-SYSTEM.md`, every value naming where in the reference it was
   read, plus a WCAG AA contrast table.
3. **Tokens** — `globals.css` from `references/tokens.css`.
4. **Build** — token-only components, one consumption convention, tone sets for status.
5. **Guard** — copy `scripts/check-theme-hardcodes.mjs` into the project's `scripts/`,
   wire it next to typecheck.
6. **Verify** — both themes × 375 / 768 / 1440 in a real browser. Not done until seen.

Then record in the project's `CLAUDE.md`: chosen direction, theme strategy, and any
deliberate exemptions ("this surface stays dark on purpose"). That note is what stops
the next session undoing this one's decisions.

---

## Running the interview well

- **Ask, don't assume.** If the opening message answers a question, skip it — but
  never invent an answer to keep momentum.
- **Recommend, don't survey.** Put your recommended option first, marked. The user
  asked for a website, not a design-theory quiz.
- **Stop early when you can.** "Minimal dark landing page for a dev tool, book-a-demo
  CTA, Next.js, Vercel" has answered Rounds 1–3. Confirm the brief and move.
- **The brief is the contract.** Once approved, build to it. If it turns out wrong
  mid-build, say so in a sentence and propose the change — don't silently redesign.

## What's in this skill

```
SKILL.md                        this file
references/design-method.md     the six build phases in full
references/brief-template.md    BRIEF.md scaffold
references/tokens.css           Tailwind v4 dual-theme token skeleton
scripts/install-design-skills.mjs   library installer (Node; no bash-4 dependency)
scripts/check-theme-hardcodes.mjs   the guard from phase 5
library/                        18 design skills, bundled
```
