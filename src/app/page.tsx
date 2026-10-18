import { Suspense } from "react";
import { DefaultHero, FALLBACK_SECTIONS, HomeSectionView } from "@/components/home/sections";
import { apiGet } from "@/lib/api";
import type { ApiItem, HomeSection } from "@/lib/types";

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
  const sections = await apiGet<ApiItem<HomeSection[]>>("/home-sections")
    .then((r) => r.data)
    .catch(() => FALLBACK_SECTIONS);

  return sections.map((section) => <HomeSectionView key={section.id} section={section} />);
}
