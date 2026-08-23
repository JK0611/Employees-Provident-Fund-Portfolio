# Website Studio Skill

Comprehensive UI/UX design and development skill for building reference-first, token-based web interfaces.

## 📁 Directory Structure & Categories

```
.agents/skills/website-studio/
├── SKILL.md                          # Core Skill Definition & Workflow Execution
├── README.md                         # Developer Documentation & Index
├── references/                       # Specification Templates & Design Guidelines
│   ├── brief-template.md             # Project Requirements & Brief Template
│   ├── design-method.md              # 6-Step Implementation Methodology
│   └── tokens.css                    # Modern CSS / Tailwind Token Design System
└── scripts/                          # Automated Tooling & Quality Assurance
    ├── check-theme-hardcodes.mjs     # Theme Hardcode Verification & Linter
    └── install-design-skills.mjs     # Automated Design Skill Package Installer
```

---

## 🛠️ Components Breakdown

### 1. Skill Entrypoint
- **`SKILL.md`**: Main instructions executed by the agent upon triggering. Defines the 4-phase lifecycle (`Interview` → `Install` → `Build` → `Verify`).

### 2. Reference Standards (`references/`)
- **`brief-template.md`**: Standardized scaffold for capturing product goal, audience, stack, and section outline before code generation.
- **`design-method.md`**: Detailed workflow covering reference measuring, CSS variable extraction, dual-theme mapping, and responsive testing.
- **`tokens.css`**: Production-ready design token architecture supporting light/dark themes with semantic color tokens.

### 3. Automation Tools (`scripts/`)
- **`check-theme-hardcodes.mjs`**: Code analysis script that scans UI files for hardcoded hex/RGB color values to maintain token integrity.
- **`install-design-skills.mjs`**: Helper script for provisioning project-specific design system assets.
