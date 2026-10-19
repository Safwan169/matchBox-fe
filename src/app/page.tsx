import { Suspense } from "react";
import { DefaultHero, HomeSectionView } from "@/components/home/sections";
import { getHomeSections } from "@/lib/store-data";

// The home page is built from sections the admin arranges (Admin → Home page).
export default function Home() {
  return (
    <div className="pb-12">
      <Suspense
        fallback={
          <section className="mx-auto w-full max-w-6xl px-4 pt-6">
            <DefaultHero />
          </section>
        }
      >
        <HomeSections />
      </Suspense>
    </div>
  );
}

async function HomeSections() {
  const sections = await getHomeSections();

  return sections.map((section) => <HomeSectionView key={section.id} section={section} />);
}
