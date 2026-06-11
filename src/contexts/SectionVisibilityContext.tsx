import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

/** Max phase index for each chapter (0–8) */
const chapterMaxPhases: number[] = [5, 10, 1, 1, 3, 8, 5, 8, 16];

interface SectionState {
  mode: "hidden" | "play" | "done";
  activePhase: number;
}

interface SectionVisibilityState {
  currentChapter: number;
  currentPhase: number;
}

interface SectionVisibilityContextType {
  currentChapter: number;
  currentPhase: number;
  /** Called on background click — advances one phase */
  advancePhase: () => void;
  /** Called from nav bar — jump to chapter, start from phase 0 */
  navigateToSection: (index: number) => void;
  /** Derive display state for a given section index */
  getSectionState: (index: number) => SectionState;
}

const SectionVisibilityContext =
  createContext<SectionVisibilityContextType | null>(null);

export function SectionVisibilityProvider({
  children,
}: {
  children: ReactNode;
  sectionCount: number;
}) {
  const [state, setState] = useState<SectionVisibilityState>({
    currentChapter: 0,
    currentPhase: 0,
  });

  const advancePhase = useCallback(() => {
    setState((prev) => {
      const max = chapterMaxPhases[prev.currentChapter];
      if (prev.currentPhase < max) {
        return {
          currentChapter: prev.currentChapter,
          currentPhase: prev.currentPhase + 1,
        };
      }
      // Chapter complete — advance to next chapter phase 0
      if (prev.currentChapter < chapterMaxPhases.length - 1) {
        return {currentChapter: prev.currentChapter + 1, currentPhase: 0};
      }
      // Already at last chapter last phase — no-op
      return prev;
    });
  }, []);

  const navigateToSection = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(chapterMaxPhases.length - 1, index));
    setState({currentChapter: clamped, currentPhase: 0});
  }, []);

  const getSectionState = useCallback(
    (index: number): SectionState => {
      if (state.currentChapter < index) {
        return {mode: "hidden", activePhase: 0};
      }
      if (state.currentChapter > index) {
        return {mode: "done", activePhase: chapterMaxPhases[index]};
      }
      // currentChapter === index
      return {mode: "play", activePhase: state.currentPhase};
    },
    [state.currentChapter, state.currentPhase],
  );

  const value = useMemo(
    () => ({
      currentChapter: state.currentChapter,
      currentPhase: state.currentPhase,
      advancePhase,
      navigateToSection,
      getSectionState,
    }),
    [
      state.currentChapter,
      state.currentPhase,
      advancePhase,
      navigateToSection,
      getSectionState,
    ],
  );

  return (
    <SectionVisibilityContext.Provider value={value}>
      {children}
    </SectionVisibilityContext.Provider>
  );
}

export function useSectionVisibility(): SectionVisibilityContextType {
  const ctx = useContext(SectionVisibilityContext);
  if (!ctx) {
    throw new Error(
      "useSectionVisibility must be used within SectionVisibilityProvider",
    );
  }
  return ctx;
}

/**
 * Legacy hook — wraps getSectionState for components still using playMode.
 * Prefer getSectionState directly for new code.
 */
export function useSectionPlayMode(
  sectionIndex: number,
): "hidden" | "skip" | "play" {
  const {getSectionState} = useSectionVisibility();
  const {mode} = getSectionState(sectionIndex);

  if (mode === "hidden") return "hidden";
  if (mode === "done") return "skip";
  return "play";
}
