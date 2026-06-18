import {useCallback, useEffect, useState, useRef} from "react";
import {usePresentationMode} from "./hooks/usePresentationMode";
import {PageProvider, usePage, sectionIndexFromPage} from "./contexts/PageContext";
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
  const {isPresentation, togglePresentation} = usePresentationMode();
  const {currentPage, advancePage, navigateToSection} = usePage();
  const currentSection = sectionIndexFromPage(currentPage);

  const scrollToSection = useCallback((index: number) => {
    const el = document.getElementById(`section-${index}`);
    if (el) el.scrollIntoView({behavior: "smooth"});
  }, []);

  const prevSectionRef = useRef(currentSection);

  useEffect(() => {
    if (currentSection > prevSectionRef.current && currentSection >= 0) {
      scrollToSection(currentSection);
    }
    prevSectionRef.current = currentSection;
  }, [currentSection, scrollToSection]);

  const handleNavigate = useCallback(
    (index: number) => {
      navigateToSection(index);
    },
    [navigateToSection],
  );

  const handleBackgroundClick = useCallback(() => {
    advancePage();
  }, [advancePage]);

  if (!entered) {
    return <HomePage onEnter={() => setEntered(true)} />;
  }

  return (
    <AppShell>
      <Navigation
        sections={sections}
        currentPage={currentPage}
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
    <PageProvider>
      <AppContent />
    </PageProvider>
  );
}

export default App;