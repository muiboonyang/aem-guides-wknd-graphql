import { Metadata } from "next";

import {
  aemHeadlessClient,
  getAdventuresBySlug,
  serveFromAem,
} from "@/lib/aem-headless-client";

interface AdventureProps {
  params: { slug: string };
}

// Fetch adventure data
async function fetchAdventure(slug: string) {
  const queryVariables = { imageWidth: 1600, imageQuality: 95 };
  const res = await getAdventuresBySlug(
    aemHeadlessClient,
    slug,
    queryVariables,
  );
  return res?.data?.adventureList?.items[0] || null;
}

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: AdventureProps): Promise<Metadata> {
  const slug = (await params).slug;
  const adventure = await fetchAdventure(slug);
  return { title: adventure?.title || "Adventure Not Found" };
}

export default async function AdventurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const adventure = await fetchAdventure(slug);

  if (!adventure) {
    return <p>Adventure not found.</p>;
  }

  return (
    <>
      <Article adventure={adventure} />
    </>
  );
}

function Article({ adventure }: { adventure: any }) {
  const {
    title,
    activity,
    adventureType,
    price,
    tripLength,
    groupSize,
    difficulty,
    primaryImage,
    description,
    itinerary,
  } = adventure;

  return (
    <article>
      <div className="bg-white">
        <div className="pt-6">
          <ImageSection
            title={title}
            imageUrl={primaryImage?._dynamicUrl || primaryImage?._path}
          />
          <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                {title}
              </h1>
            </div>
            <PricingAndDetails
              {...{
                price,
                activity,
                adventureType,
                tripLength,
                groupSize,
                difficulty,
              }}
            />
            <DescriptionAndItinerary {...{ description, itinerary }} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ImageSection({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string;
}) {
  return (
    <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 overflow-hidden lg:h-80 lg:aspect-none">
      <img
        alt={title}
        src={serveFromAem(imageUrl)}
        className="w-full h-full object-center object-cover lg:w-full lg:h-full"
      />
    </div>
  );
}

function PricingAndDetails({
  price,
  activity,
  adventureType,
  tripLength,
  groupSize,
  difficulty,
}: any) {
  return (
    <div className="mt-4 lg:mt-0 lg:row-span-3">
      <h2 className="sr-only">Product information</h2>
      <p className="text-3xl text-gray-900 mb-10">${price} USD</p>
      <dl>
        {[
          { label: "Activity", value: activity },
          { label: "Type", value: adventureType },
          { label: "Trip Length", value: tripLength },
          { label: "Group Size", value: groupSize },
          { label: "Difficulty", value: difficulty },
        ].map(({ label, value }) => (
          <div key={label} className="py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function DescriptionAndItinerary({ description, itinerary }: any) {
  return (
    <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
      <div>
        <h3 className="sr-only">Description</h3>
        <div className="space-y-6">
          <div
            className="text-base text-gray-900"
            dangerouslySetInnerHTML={{ __html: description.html }}
          ></div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-base font-bold text-gray-900">Itinerary</h2>
        <div className="mt-4 space-y-6">
          <div
            className="text-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: itinerary.html }}
          ></div>
        </div>
      </div>
    </div>
  );
}
