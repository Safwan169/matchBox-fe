import { Suspense } from "react";
import { DefaultHero, HomeSectionView } from "@/components/home/sections";
import { getHomeSections } from "@/lib/store-data";

// The home page is built from sections the admin arranges (Admin → Home page).
export default function Home() {
  return (
    <Suspense fallback={<DefaultHero />}>
      <HomeSections />
    </Suspense>
  );
}

async function HomeSections() {
  const sections = await getHomeSections();

  return sections.map((section, i) => <HomeSectionView key={section.id} section={section} first={i === 0} />);
}
