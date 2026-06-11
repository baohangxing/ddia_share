import {useCallback, useEffect, useState, useRef} from "react";
import {useScrollProgress} from "./hooks/useScrollProgress";
import {useSectionNavigation} from "./hooks/useSectionNavigation";
import {usePresentationMode} from "./hooks/usePresentationMode";
import {
  SectionVisibilityProvider,
  useSectionVisibility,
} from "./contexts/SectionVisibilityContext";
import {AppShell} from "./components/layout/AppShell";
import {Navigation} from "./components/layout/Navigation";
import {PresentationControls} from "./components/layout/PresentationControls";
import HomePage from "./components/sections/HomePage";
import Section01_Prologue from "./components/sections/Section01_Prologue";
import Section02_Index from "./components/sections/Section02_Index";
import Section03_Replication from "./components/sections/Section03_Replication";
import Section04_Partitioning from "./components/sections/Section04_Partitioning";
import Section05_Streams from "./components/sections/Section05_Streams";
import Section06_Transactions from "./components/sections/Section06_Transactions";
import Section07_Consistency from "./components/sections/Section07_Consistency";
import Section08_Consensus from "./components/sections/Section08_Consensus";
import Section09_Finale from "./components/sections/Section09_Finale";

const sections = [
  "序章",
  "Day 1",
  "Day 5",
  "Day 10",
  "Day 15",
  "Day 20",
  "Day 25",
  "Day 30",
  "终章",
];

function AppContent() {
  const [entered, setEntered] = useState(false);
  const {progress} = useScrollProgress(sections.length);
  const {isPresentation, togglePresentation} = usePresentationMode();
  const {currentChapter, advancePhase, navigateToSection} =
    useSectionVisibility();
  const {scrollToSection} = useSectionNavigation({
    totalSections: sections.length,
  });
  const prevChapterRef = useRef(currentChapter);

  // Auto-scroll to newly revealed chapter
  useEffect(() => {
    if (currentChapter > prevChapterRef.current) {
      scrollToSection(currentChapter);
    }
    prevChapterRef.current = currentChapter;
  }, [currentChapter, scrollToSection]);

  const handleNavigate = useCallback(
    (index: number) => {
      navigateToSection(index);
    },
    [navigateToSection],
  );

  // Global background click: advance one phase
  const handleBackgroundClick = useCallback(() => {
    advancePhase();
  }, [advancePhase]);

  if (!entered) {
    return <HomePage onEnter={() => setEntered(true)} />;
  }

  return (
    <AppShell progress={progress}>
      <Navigation
        sections={sections}
        currentSection={currentChapter}
        onNavigate={handleNavigate}
      />

      <div onClick={handleBackgroundClick}>
        <div id="section-0">
          <Section01_Prologue />
        </div>
        <div id="section-1">
          <Section02_Index />
        </div>
        <div id="section-2">
          <Section03_Replication />
        </div>
        <div id="section-3">
          <Section04_Partitioning />
        </div>
        <div id="section-4">
          <Section05_Streams />
        </div>
        <div id="section-5">
          <Section06_Transactions />
        </div>
        <div id="section-6">
          <Section07_Consistency />
        </div>
        <div id="section-7">
          <Section08_Consensus />
        </div>
        <div id="section-8">
          <Section09_Finale />
        </div>
      </div>

      {!isPresentation && (
        <PresentationControls
          isPresentation={isPresentation}
          onToggle={togglePresentation}
        />
      )}

      {isPresentation && (
        <div className="fixed bottom-4 left-4 text-xs text-[#555] font-mono">
          点击空白区域切换章节 | 按 Escape 退出
        </div>
      )}
    </AppShell>
  );
}

function App() {
  return (
    <SectionVisibilityProvider sectionCount={sections.length}>
      <AppContent />
    </SectionVisibilityProvider>
  );
}

export default App;
