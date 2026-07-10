"use client";

import { useEffect, useState } from "react";
import { CursorFollower } from "@/components/portfolio/cursor-follower";
import { ScrollProgress } from "@/components/portfolio/scroll-progress";
import { TopNav } from "@/components/portfolio/top-nav";
import { CommandPalette } from "@/components/portfolio/command-palette";
import { KonamiEasterEgg } from "@/components/portfolio/konami-easter-egg";
import { HeroSection } from "@/components/portfolio/hero-section";
import { ManifestoSection } from "@/components/portfolio/manifesto-section";
import { TechMarquee } from "@/components/portfolio/tech-marquee";
import { ConstellationSection } from "@/components/portfolio/constellation-section";
import { TrajectorySection } from "@/components/portfolio/trajectory-section";
import { BuildsSection } from "@/components/portfolio/builds-section";
import { TransmitSection } from "@/components/portfolio/transmit-section";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SectionDivider } from "@/components/portfolio/section-divider";

export default function Home() {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <CursorFollower />
      <ScrollProgress />
      <TopNav onOpenCommand={() => setCmdOpen(true)} />
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
      <KonamiEasterEgg />

      <main className="relative flex-1">
        <HeroSection />

        <SectionDivider index="//" label="enter the manifesto" accent="ember" />
        <ManifestoSection />

        <TechMarquee direction="left" />

        <SectionDivider index="//" label="map the skills" accent="aurora" />
        <ConstellationSection />

        <SectionDivider index="//" label="trace the path" accent="ember" />
        <TrajectorySection />

        <TechMarquee direction="right" speed={48} />

        <SectionDivider index="//" label="inspect the work" accent="aurora" />
        <BuildsSection />

        <SectionDivider index="//" label="open the channel" accent="ember" />
        <TransmitSection />
      </main>

      <SiteFooter />
    </div>
  );
}
