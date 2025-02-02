import Link from "next/link";

interface AdventureCardProps {
  slug: string;
  title: string;
  price: string;
  duration: string;
  imageSrc: string;
}

export default function AdventureCard({
  slug,
  title,
  price,
  duration,
  imageSrc,
}: AdventureCardProps) {
  return (
    <div key={slug} className="group relative">
      <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-center object-cover lg:w-full lg:h-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <p className="mt-1 text-sm text-gray-500">{duration}</p>
        <p className="text-sm font-medium text-gray-900">${price} USD</p>
      </div>
      <h3 className="font-semibold text-gray-700">
        <Link href={`adventures/${slug}`} legacyBehavior>
          <div>
            <span aria-hidden="true" className="absolute inset-0" />
            {title}
          </div>
        </Link>
      </h3>
    </div>
  );
}
