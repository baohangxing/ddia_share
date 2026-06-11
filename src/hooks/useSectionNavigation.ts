import {useCallback} from "react";

interface SectionNavigationOptions {
  totalSections: number;
}

/**
 * Hook for section-based navigation.
 * - No keyboard or scroll interception — section changes are click-driven
 * - Provides scrollToSection for programmatic navigation (nav bar, auto-advance)
 */
export function useSectionNavigation({totalSections: _totalSections}: SectionNavigationOptions) {
  const scrollToSection = useCallback((index: number) => {
    const el = document.getElementById(`section-${index}`);
    if (el) el.scrollIntoView({behavior: "smooth"});
  }, []);

  return {scrollToSection};
}
