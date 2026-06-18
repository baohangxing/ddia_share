import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

export function sectionIndexFromPage(page: number): number {
  if (page <= 0) return -1;
  return Math.floor(page / 100) - 1;
}

interface PageContextType {
  currentPage: number;
  advancePage: () => void;
  navigateToSection: (index: number) => void;
  registerPage: (page: number, groupKey?: string) => void;
  unregisterPage: (page: number, groupKey?: string) => void;
  getActivatedReplacement: (groupKey: string) => number;
}

const PageContext = createContext<PageContextType | null>(null);

export function PageProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState(0);
  const registeredPagesRef = useRef(new Set<number>());
  const replacementGroupsRef = useRef(new Map<string, Set<number>>());

  const registerPage = useCallback(
    (page: number, groupKey?: string) => {
      registeredPagesRef.current.add(page);
      if (groupKey) {
        let group = replacementGroupsRef.current.get(groupKey);
        if (!group) {
          group = new Set<number>();
          replacementGroupsRef.current.set(groupKey, group);
        }
        group.add(page);
      }
    },
    [],
  );

  const unregisterPage = useCallback(
    (page: number, groupKey?: string) => {
      registeredPagesRef.current.delete(page);
      if (groupKey) {
        const group = replacementGroupsRef.current.get(groupKey);
        if (group) {
          group.delete(page);
          if (group.size === 0) {
            replacementGroupsRef.current.delete(groupKey);
          }
        }
      }
    },
    [],
  );

  const getActivatedReplacement = useCallback(
    (groupKey: string): number => {
      const group = replacementGroupsRef.current.get(groupKey);
      if (!group || group.size === 0) return -1;
      const sorted = Array.from(group).sort((a, b) => a - b);
      const last = sorted[sorted.length - 1];
      const sectionIdx = sectionIndexFromPage(currentPage);
      const nextSectionStart = (sectionIdx + 2) * 100 + 1;
      if (currentPage >= nextSectionStart) return last;
      let activated = -1;
      for (const p of sorted) {
        if (currentPage >= p) activated = p;
        else break;
      }
      return activated;
    },
    [currentPage],
  );

  const advancePage = useCallback(() => {
    setCurrentPage((prev) => {
      const pages = Array.from(registeredPagesRef.current).sort(
        (a, b) => a - b,
      );
      const next = pages.find((p) => p > prev);
      return next !== undefined ? next : prev;
    });
  }, []);

  const navigateToSection = useCallback((index: number) => {
    const scopeStart = (index + 1) * 100 + 1;
    const scopeEnd = (index + 2) * 100 + 1;
    const pages = Array.from(registeredPagesRef.current).sort(
      (a, b) => a - b,
    );
    const first = pages.find((p) => p >= scopeStart && p < scopeEnd);
    if (first !== undefined) {
      setCurrentPage(first);
    } else {
      setCurrentPage(scopeStart);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentPage,
      advancePage,
      navigateToSection,
      registerPage,
      unregisterPage,
      getActivatedReplacement,
    }),
    [
      currentPage,
      advancePage,
      navigateToSection,
      registerPage,
      unregisterPage,
      getActivatedReplacement,
    ],
  );

  return (
    <PageContext.Provider value={value}>{children}</PageContext.Provider>
  );
}

export function usePage(): PageContextType {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("usePage must be used within PageProvider");
  return ctx;
}