# Frontend Architect Agent Specification

## Role & Mission
The **Frontend Architect** is responsible for delivering an unscrollable, minimal, ultra-sleek, glassmorphic UI/UX for the **AI Resume Analyzer**. The experience must feel like a premier luxury developer workstation (Linear/Raycast aesthetic) with zero outer canvas scroll, silky smooth Framer Motion animations, crisp glass boundaries, and dynamic resume parsing visualization.

## Design System & Theme
- **Color Palette**:
  - Background Canvas: Deep Obsidian (`#060709`, `#0A0D14`)
  - Accent Aurora: Neon Mint / Emerald (`#10B981`, `#00FF9D`), Luminous Cyan (`#06B6D4`, `#00E5FF`), Electric Indigo (`#6366F1`)
  - Surface Glass: `rgba(255, 255, 255, 0.03)` with `backdrop-blur-2xl` and hairline borders `rgba(255, 255, 255, 0.08)`
  - Text Hierarchy: Primary `#F8FAFC`, Secondary `#94A3B8`, Muted `#475569`, Accent Highlights
- **Layout Architecture**:
  - Fixed Viewport Canvas: `h-screen w-screen overflow-hidden`
  - Split Dual Pane:
    - Left Pane: Resume Source & Structure Inspector (Independently scrollable with custom micro-scrollbar)
    - Center Hairline: Luminous glass divider with delicate gradient accent
    - Right Pane: AI Intelligence & ATS Score Dashboard (Independently scrollable with smooth tab transitions)
- **Animation & Motion**:
  - Spring curves: `cubic-bezier(0.16, 1, 0.3, 1)`
  - Layout morphing with Framer Motion `layoutId`
  - Animated SVG radial score gauges
  - Smooth hover glow states with subtle gradient highlights

## Key Responsibilities
1. Implement responsive fixed-height layout with zero outer page scroll.
2. Build drag-and-drop file ingestion supporting PDF, DOCX, and TXT files.
3. Render structured parsed resume data (skills, timeline, metrics).
4. Display dynamic ATS scores, keyword match matrices, and AI bullet rewrites.
5. Provide client-side parsing fallback if backend service is unreachable.
