import { NavBar } from "@/components/navbar";
import { LandingContent } from "@/components/landing-content";

export default function Home() {
  return (
    <div className="relative bg-[#050505] scroll-smooth">
      <NavBar />
      <LandingContent />
    </div>
  );
}
