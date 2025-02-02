import { Metadata } from "next";

import AdventureCard from "@/components/adventure-card";
import {
  aemHeadlessClient,
  getAllAdventures,
  serveFromAem,
} from "@/lib/aem-headless-client";

export const metadata: Metadata = {
  title: "Adventures",
};

async function fetchAdventures() {
  const queryVariables = {
    imageFormat: "PNG",
    imageWidth: 262,
    imageQuality: 80,
  };

  const res = await getAllAdventures(aemHeadlessClient, queryVariables);
  return res?.data?.adventureList?.items || [];
}

export default async function AdventuresPage() {
  const adventures = await fetchAdventures();

  if (!adventures.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No adventures available.
      </p>
    );
  }

  return (
    <section className="bg-white">
      <div className="max-w-2xl mx-auto py-10 px-4 sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-light tracking-tight text-gray-900">
          What{" "}
          <u>
            <strong>your</strong>
          </u>{" "}
          next adventure?
        </h2>
        <AdventureGrid adventures={adventures} />
      </div>
    </section>
  );
}

function AdventureGrid({ adventures }: { adventures: any[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {adventures.map(
        ({ slug, title, price, tripLength, primaryImage }, index) => (
          <AdventureCard
            key={index}
            slug={slug}
            title={title}
            price={price}
            duration={tripLength}
            imageSrc={serveFromAem(
              primaryImage?._dynamicUrl || primaryImage?._path,
            )}
          />
        ),
      )}
    </div>
  );
}
