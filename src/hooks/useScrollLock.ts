import {useEffect, useRef, useCallback} from "react";
import {useSectionVisibility} from "../contexts/SectionVisibilityContext";

interface ScrollLockOptions {
  totalSections: number;
}

export function useScrollLock({totalSections}: ScrollLockOptions) {
  const {revealedUpTo, isAnimating, markComplete, navigateToSection} =
    useSectionVisibility();
  const cooldownRef = useRef(false);

  const advanceToNext = useCallback(() => {
    if (cooldownRef.current) return;
    const nextIndex = Math.min(totalSections - 1, revealedUpTo + 1);
    if (nextIndex <= revealedUpTo) return;

    cooldownRef.current = true;
    setTimeout(() => {
      cooldownRef.current = false;
    }, 800);

    if (isAnimating()) {
      markComplete(revealedUpTo);
    }

    navigateToSection(nextIndex);

    setTimeout(() => {
      const el = document.getElementById(`section-${nextIndex}`);
      if (el) el.scrollIntoView({behavior: "smooth"});
    }, 100);
  }, [
    totalSections,
    revealedUpTo,
    isAnimating,
    markComplete,
    navigateToSection,
  ]);

  // Listen for wheel events to advance sections when scrolling down
  useEffect(() => {
    let accumulatedDelta = 0;
    const THRESHOLD = 80;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        // Scrolling down
        accumulatedDelta += e.deltaY;

        if (accumulatedDelta >= THRESHOLD) {
          accumulatedDelta = 0;
          advanceToNext();
        }
      }
      // Scrolling up: allow normal scroll, no section state change
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const isForward =
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === " " ||
        e.key === "PageDown";

      if (isForward) {
        e.preventDefault();
        advanceToNext();
      }
    };

    // Reset accumulated delta periodically
    const resetInterval = setInterval(() => {
      accumulatedDelta = 0;
    }, 1500);

    window.addEventListener("wheel", handleWheel, {passive: true});
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(resetInterval);
    };
  }, [advanceToNext]);

  const scrollToSection = useCallback((index: number) => {
    const el = document.getElementById(`section-${index}`);
    if (el) el.scrollIntoView({behavior: "smooth"});
  }, []);

  return {scrollToSection};
}
