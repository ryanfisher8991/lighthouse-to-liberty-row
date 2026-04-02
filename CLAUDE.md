# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/ryanf/puppeteer-test/`. Chrome cache is at `C:/Users/ryanf/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Mobile Compatibility

### Screenshot Requirements
- After every desktop screenshot pass, take a matching mobile screenshot at 390px width:
  `node screenshot.mjs http://localhost:3000 mobile 390`
- Also check tablet at 768px when layouts are complex:
  `node screenshot.mjs http://localhost:3000 tablet 768`
- Never consider a pass complete without reviewing both desktop and mobile screenshots.

### Breakpoints to Target
- **Mobile:** 390px (iPhone 14 — primary mobile target)
- **Tablet:** 768px (`md:` in Tailwind)
- **Desktop:** 1280px (`lg:` in Tailwind)

### Navigation
- On mobile, the nav must collapse — specify a hamburger menu, slide-out drawer, or bottom bar. Do not just shrink or hide the desktop nav without a replacement.
- If not specified by the user, default to a hamburger that opens a full-width dropdown.

### Touch Targets
- Every tappable element (buttons, links, nav items) must be at least 44×44px. Use `min-h-[44px] min-w-[44px]` where needed.

### Typography Scaling
- Headings must scale down meaningfully — do not let `text-6xl` stay `text-6xl` on mobile.
- Use responsive prefixes: e.g. `text-3xl md:text-5xl lg:text-6xl`.
- Body text minimum `text-base` (16px) on mobile — never smaller.

### Layout Reflow
- All multi-column grids (`grid-cols-2`, `grid-cols-3`, etc.) must stack to single column on mobile unless explicitly told otherwise.
- Flex rows must wrap or stack: use `flex-col md:flex-row`.
- Hero sections: stack image below text on mobile by default, unless reference shows otherwise.

### Hard Mobile Rules
- **No horizontal scroll ever.** If content overflows horizontally on mobile, fix it — do not leave it.
- Never hide content with `hidden md:block` without a mobile alternative. If something is hidden on mobile, there must be a deliberate reason stated.
- Padding: use `px-4` minimum on mobile containers — never let content touch the screen edge.
- Images must never overflow their containers — use `max-w-full` and `h-auto`.


## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
