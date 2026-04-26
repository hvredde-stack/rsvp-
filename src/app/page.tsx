import Image from "next/image";
import { EVENT } from "@/lib/event";
import { RsvpForm } from "./rsvp-form";

export default function Home() {
  return (
    <main className="flex flex-1 items-start justify-center px-3 py-8 sm:px-4 sm:py-20">
      <div className="w-full max-w-2xl">
        <header className="text-center">
          <p className="text-2xl sm:text-3xl">🏡 ✨</p>
          <h1 className="mt-3 font-display text-3xl text-stone-900 sm:mt-4 sm:text-5xl">
            Housewarming Celebration
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-700 sm:mt-6 sm:text-lg">
            With hearts full of joy, we warmly invite you to share a special
            milestone with us.
          </p>
        </header>

        <div className="mt-6 flex justify-center sm:mt-10">
          <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-md">
            <Image
              src="/family.png"
              alt={`${EVENT.hosts} at their housewarming`}
              width={382}
              height={662}
              priority
              sizes="(max-width: 640px) 240px, 320px"
              className="block h-auto w-[240px] sm:w-[320px]"
            />
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-white/60 p-5 text-center shadow-sm sm:mt-10 sm:p-8">
          <p className="font-display text-xl text-stone-800 sm:text-2xl">
            {EVENT.hosts}
          </p>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">
            invite you and your family to our
          </p>
          <p className="mt-3 font-display text-2xl text-amber-800 sm:text-3xl">
            🏡 {EVENT.title} 🏡
          </p>

          <dl className="mt-6 grid grid-cols-1 gap-4 text-stone-700 sm:mt-8 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-500">
                Date
              </dt>
              <dd className="mt-1 font-display text-lg text-stone-900 sm:text-xl">
                {EVENT.date}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-500">
                Time
              </dt>
              <dd className="mt-1 font-display text-lg text-stone-900 sm:text-xl">
                {EVENT.time}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-500">
                Location
              </dt>
              <dd className="mt-1 font-display text-lg text-stone-900 sm:text-xl">
                {EVENT.address}
              </dd>
            </div>
          </dl>

          <a
            href={EVENT.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-700 bg-amber-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-800 sm:mt-8"
          >
            <span aria-hidden>📍</span>
            Get directions on Google Maps
          </a>

          <p className="mt-6 text-stone-700 sm:mt-8">
            Please join us for {EVENT.meal}.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-8">
          <h2 className="font-display text-xl text-stone-900 sm:text-2xl">
            Kindly RSVP
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            We&apos;d love to know if you can make it.
          </p>
          <div className="mt-5 sm:mt-6">
            <RsvpForm />
          </div>
        </section>

        <footer className="mt-8 text-center text-xs text-stone-500 sm:mt-12 sm:text-sm">
          With love, {EVENT.hosts}
        </footer>
      </div>
    </main>
  );
}
