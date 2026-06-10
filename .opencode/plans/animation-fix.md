# Animation Playback Fix Plan

## Problem Summary

The presentation-style webpage has several animation playback issues:

1. **Sections disappear unexpectedly** — scrolling backward resets state, hiding completed sections
2. **Animation direction is not unidirectional** — going backward can re-trigger animations
3. **No scroll lock** — users can scroll past a section before its animation finishes
4. **Navigation to later sections** should skip intermediate animations
5. **Navigation to earlier sections** should just scroll, not reset any state

## Design Decisions

Based on user confirmation:
- **Scroll lock**: Completely lock (preventDefault on wheel) during animation
- **Forward jump**: Intermediate sections show final state immediately (skip)
- **Backward jump**: Just scroll, keep all state unchanged

## Changes

### 1. Rewrite `src/contexts/SectionVisibilityContext.tsx`

**Core principle: Monotonic (forward-only) progress**

Changes:
- `navigateToSection`: When going backward (`clamped < revealedUpTo`), return `prev` unchanged — don't hide or reset any sections
- `navigateToSection`: When going forward, mark intermediate sections as `skip` + `complete` (same as before)
- `revealedUpTo` only increases, never decreases
- `completedSections` only gains entries, never loses them
- Add `isAnimating()` method that checks if the current section is still playing its animation

Updated `useSectionPlayMode`:
- Once a section is completed, always return `'skip'`
- Once revealed, never go back to `'hidden'`
- Simplified logic order: check completed first, then visibility, then skip

### 2. Create `src/hooks/useScrollLock.ts`

New hook that:
- Listens to `wheel` events on the document
- When the current section is animating (`isAnimating()` returns true):
  - `deltaY > 0` (scroll down): `preventDefault()` + call `navigateToSection(next)` which marks current section as skip+complete
  - `deltaY < 0` (scroll up): allow normally (no prevent)
- When no section is animating:
  - `deltaY > 0` (scroll down): call `navigateToSection(next)` to reveal the next section
  - `deltaY < 0` (scroll up): normal scroll, no state change
- Debounce wheel events to prevent rapid-fire section advancement
- Also handle keyboard (ArrowDown, ArrowRight, Space, PageDown) similarly

### 3. Update `src/App.tsx`

- Remove the `useEffect` at lines 37-43 that auto-advances `revealedUpTo` based on `currentSection` — this conflicts with the scroll lock mechanism
- Remove `useScrollProgress` usage for section advancement (keep for progress bar only)
- Integrate `useScrollLock` hook
- Sections must be rendered with enough height even when `hidden` (to establish scroll positions), OR we switch to a position-based approach where scroll position determines the active section

**Important consideration**: Currently `useScrollProgress` calculates `currentSection` based on scroll position divided by section height. But if sections are `hidden` (rendering empty), they have `min-h-screen` but no content, making scroll positions unreliable.

**Solution**: Always render section content (no `hidden` rendering), but use CSS `visibility: hidden` or `opacity: 0` for unrevealed sections to maintain layout, OR always render all content but control animation timing through `useSectionPlayMode`.

Actually, the better approach is:
- Remove the `hidden` mode entirely from `useSectionPlayMode`
- Sections that haven't been revealed yet should render their content but with `opacity: 0` and `pointer-events: none`
- This way all sections have their full height and scroll positions are correct
- When a section is revealed (index <= revealedUpTo), it becomes visible and plays its animation

### 4. Update Section Components

Currently, several sections check `playMode === 'hidden'` and render an empty section:

```tsx
if (playMode === 'hidden') {
  return (
    <section className="min-h-screen ..." style={...} />
  );
}
```

This needs to change. Instead, sections should always render their full content but wrap it in a visibility control:

```tsx
const playMode = useSectionPlayMode(SECTION_INDEX);

return (
  <section className="min-h-screen ..." style={...}>
    <div style={{ opacity: playMode === 'hidden' ? 0 : 1, pointerEvents: playMode === 'hidden' ? 'none' : 'auto' }}>
      {/* all content */}
    </div>
  </section>
);
```

**Sections to update** (that check for `hidden`):
- `Section03_Replication.tsx:279-282`
- `Section04_Partitioning.tsx:19-23`
- `Section05_Streams.tsx:51-54`
- `Section06_Transactions.tsx:178` (likely)
- `Section07_Consistency.tsx:306` (likely)
- `Section08_Consensus.tsx:142` (likely)
- `Section09_Finale.tsx:182` (likely)

### 5. Fix `src/components/shared/Typewriter.tsx`

The `started.current` ref prevents the typewriter from restarting. Since sections won't be unmounted/remounted anymore (they stay rendered), this is less critical, but should still be fixed in case the component does remount:

- Change `started.current` to reset when the component's key changes or when the `text` prop changes
- Or remove the guard entirely and let the effect run on mount

### 6. Update `src/hooks/useKeyboardNav.ts`

- Need to integrate with the scroll lock mechanism
- Forward navigation (ArrowDown, ArrowRight, Space) should call our navigation logic
- Backward navigation (ArrowUp, ArrowLeft) should just scroll, no state changes

## Implementation Order

1. SectionVisibilityContext.tsx — core state logic
2. useScrollLock.ts — scroll blocking
3. App.tsx — integration
4. Section components — remove `hidden` empty renders
5. Typewriter.tsx — fix started ref
6. useKeyboardNav.ts — align with new logic

## File Change Summary

| File | What changes |
|------|-------------|
| `src/contexts/SectionVisibilityContext.tsx` | Remove backward-reset, monotonic progress, add isAnimating |
| `src/hooks/useScrollLock.ts` | **NEW** — wheel event lock + forward navigation |
| `src/App.tsx` | Remove auto-advance useEffect, add scroll lock |
| `src/hooks/useKeyboardNav.ts` | Align with scroll lock behavior |
| `src/hooks/useScrollProgress.ts` | May simplify (keep for progress bar only) |
| `src/components/sections/Section03_Replication.tsx` | Remove hidden empty render |
| `src/components/sections/Section04_Partitioning.tsx` | Remove hidden empty render |
| `src/components/sections/Section05_Streams.tsx` | Remove hidden empty render |
| `src/components/sections/Section06_Transactions.tsx` | Remove hidden empty render |
| `src/components/sections/Section07_Consistency.tsx` | Remove hidden empty render |
| `src/components/sections/Section08_Consensus.tsx` | Remove hidden empty render |
| `src/components/sections/Section09_Finale.tsx` | Remove hidden empty render |
| `src/components/shared/Typewriter.tsx` | Fix started.current reset |