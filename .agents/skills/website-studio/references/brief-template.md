# BRIEF — <project name>

<!-- Written by the `new-website` skill from the interview. Approved by the user
     before any code. Every later decision is checked against this file; if the
     brief turns out to be wrong, change it here first, then rebuild to it. -->

**Date:** <YYYY-MM-DD> · **Status:** draft | approved

## What this is

<One paragraph, plain language. What the product does, for whom. If you cannot
write this without hedging, the interview is not finished.>

- **Type:** marketing site | console/dashboard | storefront | docs
- **Audience:** <consumer | SMB | enterprise | developer> — <what they already know
  when they land, and what they're worried about>
- **Primary CTA:** <the one action> — every page drives here
- **Secondary actions:** <or "none" — resist adding these>

## Success looks like

<How we'd know it worked. "Demo bookings from the pricing page", "an operator can
find a failing order in under 10 seconds". Not "looks modern".>

## Design direction

- **Direction:** <minimal editorial | high-end agency | industrial-brutalist | motion-led>
- **Taste skill installed:** <minimalist-ui | high-end-visual-design | industrial-brutalist-ui | gpt-taste>
- **Theme:** <dark-first | light-first | both with toggle> — default `<x>`
- **Motion:** <restrained | balanced | cinematic>
- **Brand inputs:** <logo/colours provided | reference image at `design/…` | generate from scratch>
- **Fixed constraints:** <a brand colour that cannot move, a typeface that's licensed,
  an existing nav that must survive — or "none">

### Explicitly not this

<The single most useful section in the file. Name the look being avoided: "not a
purple-gradient AI landing page", "not three-equal-cards-in-a-row", "not a centered
dark hero". Written before the build, this survives contact with defaults.>

## Scope

| Page / surface | Sections | Priority |
|---|---|---|
| <Home> | <hero, features, pricing, FAQ, footer> | P0 |
| <…> | | P1 |

**Out of scope for this pass:** <name it, so "while you're in there" doesn't happen>

## Content

- **Copy:** <provided | drafted from this brief | placeholder>
- **Imagery:** <provided | generated | stock | none — typographic only>
- Placeholder text must be realistic and length-accurate. Lorem ipsum is banned —
  it hides the layout problems it's meant to reveal.

## Build

- **Stack:** <Next.js App Router + Tailwind v4 + shadcn | …>
- **Deploy:** <Railway | Vercel | local only>
- **Verification:** both themes × 375 / 768 / 1440 in a real browser; deployed work
  confirmed by curling the public URL, not localhost.

## Open questions

<Anything still unresolved, with who owns the answer. Empty is a good sign.>
