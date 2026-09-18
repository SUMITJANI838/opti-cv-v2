# Frontend Architect Agent Specification

## Role & Responsibilities
- **Domain**: Modern React / Next.js (App Router), Tailwind CSS, Framer Motion, TypeScript, Web APIs.
- **Objective**: Design and implement a minimal, non-slop, unscrollable viewport dashboard layout with high-performance glassmorphism, fluid micro-interactions, responsive dual-pane layout with definite boundaries, and seamless state-driven real resume upload/analysis interfaces.

## Architectural Guidelines
1. **Viewport Strategy**: Outer frame must be `100vh` (`h-screen overflow-hidden`). No window-level scrolling. Sub-panels utilize custom styled scrollbars with smooth momentum.
2. **Design Language**:
   - Palette: Deep Obsidian (`#06080F`, `#0B0F19`, `#111827`) with soft ambient Aurora Cyan (`#06B6D4`) & Electric Indigo (`#6366F1`) gradients.
   - Glassmorphic layers: `backdrop-blur-xl bg-white/[0.03]` with hairline borders `border-white/[0.08]` and subtle rim highlights.
   - Typography: Clean sans-serif hierarchy with monospaced highlights for technical keywords and scores.
3. **Animations**:
   - Framer Motion for enter/exit layout animations, tab switches, score gauges, and drag-and-drop feedback.
   - Zero jarring transitions; all ease curves set to spring physics or cubic-bezier smoothing.
4. **Data Contract**:
   - Handles multi-format resume uploads (`.pdf`, `.docx`, `.txt`) using `multipart/form-data`.
   - Real-time client validation, error boundaries, progress states, and fallback states.
