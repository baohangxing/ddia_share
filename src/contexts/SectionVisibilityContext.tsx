import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';

interface SectionVisibilityState {
  /** Sections 0..revealedUpTo have their content visible */
  revealedUpTo: number;
  /** Sections that have finished their animation sequence */
  completedSections: Set<number>;
  /** Sections that should show final state immediately (skip animation) */
  skipSections: Set<number>;
}

interface SectionVisibilityContextType extends SectionVisibilityState {
  /** Called by a section when its animation sequence completes */
  markComplete: (index: number) => void;
  /** Navigate to a section (from nav click, keyboard, or scroll) */
  navigateToSection: (index: number) => void;
  /** Whether a section should skip animation and show final state */
  shouldSkip: (index: number) => boolean;
  /** Whether a section's content should be rendered at all */
  isVisible: (index: number) => boolean;
  /** Whether any revealed section is still animating */
  isAnimating: () => boolean;
}

const SectionVisibilityContext = createContext<SectionVisibilityContextType | null>(null);

export function SectionVisibilityProvider({
  children,
  sectionCount,
}: {
  children: ReactNode;
  sectionCount: number;
}) {
  const [state, setState] = useState<SectionVisibilityState>({
    revealedUpTo: 0,
    completedSections: new Set(),
    skipSections: new Set(),
  });

  const completedRef = useRef<Set<number>>(new Set());

  const markComplete = useCallback((index: number) => {
    completedRef.current.add(index);
    setState(prev => {
      const newCompleted = new Set(prev.completedSections);
      newCompleted.add(index);

      const nextRevealed = Math.min(
        sectionCount - 1,
        Math.max(prev.revealedUpTo, index + 1),
      );

      return {
        ...prev,
        completedSections: newCompleted,
        revealedUpTo: nextRevealed,
      };
    });
  }, [sectionCount]);

  const navigateToSection = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(sectionCount - 1, index));

    setState(prev => {
      // Forward: reveal all intermediate sections in skip mode
      if (clamped > prev.revealedUpTo) {
        const newSkip = new Set(prev.skipSections);
        const newCompleted = new Set(prev.completedSections);
        for (let i = prev.revealedUpTo; i < clamped; i++) {
          newSkip.add(i);
          newCompleted.add(i);
          completedRef.current.add(i);
        }
        return {
          revealedUpTo: clamped,
          completedSections: newCompleted,
          skipSections: newSkip,
        };
      }

      // Backward or same position: no state change at all.
      // Progress is monotonically increasing — sections never un-reveal.
      return prev;
    });
  }, [sectionCount]);

  const shouldSkip = useCallback(
    (index: number) => state.skipSections.has(index),
    [state.skipSections],
  );

  const isVisible = useCallback(
    (index: number) => index <= state.revealedUpTo,
    [state.revealedUpTo],
  );

  const isAnimating = useCallback(() => {
    for (let i = state.revealedUpTo; i >= 0; i--) {
      if (!state.completedSections.has(i)) {
        return true;
      }
    }
    return false;
  }, [state.revealedUpTo, state.completedSections]);

  return (
    <SectionVisibilityContext.Provider
      value={{
        ...state,
        markComplete,
        navigateToSection,
        shouldSkip,
        isVisible,
        isAnimating,
      }}
    >
      {children}
    </SectionVisibilityContext.Provider>
  );
}

export function useSectionVisibility(): SectionVisibilityContextType {
  const ctx = useContext(SectionVisibilityContext);
  if (!ctx) {
    throw new Error(
      'useSectionVisibility must be used within SectionVisibilityProvider',
    );
  }
  return ctx;
}

export function useSectionPlayMode(sectionIndex: number): 'hidden' | 'skip' | 'play' {
  const { completedSections, isVisible, shouldSkip } = useSectionVisibility();

  if (completedSections.has(sectionIndex)) {
    return 'skip';
  }

  if (!isVisible(sectionIndex)) {
    return 'hidden';
  }

  if (shouldSkip(sectionIndex)) {
    return 'skip';
  }

  return 'play';
}