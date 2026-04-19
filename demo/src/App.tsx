import { useCallback, useRef, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Hero } from "./components/Hero";
import { WhyChoose } from "./components/WhyChoose";
import { InstallMatrix } from "./components/InstallMatrix";
import { CodeExamples } from "./components/CodeExamples";
import { UseCases } from "./components/UseCases";
import { WhatsNew } from "./components/WhatsNew";
import { MigrationGuide } from "./components/MigrationGuide";
import { Playground } from "./components/Playground";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useTheme } from "./hooks/useTheme";

export function App() {
  const { cycle } = useTheme();
  const [countryCode, setCountryCode] = useState<string>("US");
  const datasetSearchRef = useRef<HTMLInputElement>(null);

  const handlePickCountry = useCallback((code: string) => {
    setCountryCode(code);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const focusSearch = useCallback(() => {
    const el = datasetSearchRef.current;
    if (!el) return;
    el.focus();
    el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  const goTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useKeyboardShortcuts({
    t: cycle,
    "/": focusSearch,
    g: goTop,
  });

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <Navbar />
      <div className="shell">
        <Sidebar />
        <main id="main">
          <Hero countryCode={countryCode} onCountryChange={setCountryCode} />
          <WhyChoose />
          <InstallMatrix />
          <CodeExamples />
          <UseCases />
          <WhatsNew />
          <MigrationGuide />
          <Playground
            activeCountry={countryCode}
            onPickCountry={handlePickCountry}
            searchRef={datasetSearchRef}
          />
          <Faq />
        </main>
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}
