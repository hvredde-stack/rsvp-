import Image from "next/image";
import { EVENT } from "@/lib/event";
import { RsvpForm } from "./rsvp-form";

export default function Home() {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-2xl">
        <header className="text-center">
          <p className="text-3xl">🏡 ✨</p>
          <h1 className="mt-4 font-display text-4xl text-stone-900 sm:text-5xl">
            Housewarming Celebration
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-700">
            With hearts full of joy, we warmly invite you to share a special
            milestone with us.
          </p>
        </header>

        <div className="mt-10 flex justify-center">
          <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-md">
            <Image
              src="/family.png"
              alt={`${EVENT.hosts} at their housewarming`}
              width={382}
              height={662}
              priority
              className="block h-auto w-[260px] sm:w-[320px]"
            />
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-amber-200 bg-white/60 p-8 text-center shadow-sm">
          <p className="font-display text-2xl text-stone-800">{EVENT.hosts}</p>
          <p className="mt-2 text-stone-600">
            invite you and your family to our
          </p>
          <p className="mt-3 font-display text-3xl text-amber-800">
            🏡 {EVENT.title} 🏡
          </p>

          <dl className="mt-8 grid grid-cols-1 gap-4 text-stone-700 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-500">
                Date
              </dt>
              <dd className="mt-1 font-display text-xl text-stone-900">
                {EVENT.date}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-500">
                Time
              </dt>
              <dd className="mt-1 font-display text-xl text-stone-900">
                {EVENT.time}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-500">
                Location
              </dt>
              <dd className="mt-1">
                <a
                  href={EVENT.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-xl text-amber-800 underline-offset-4 hover:underline"
                >
                  {EVENT.address}
                </a>
              </dd>
            </div>
          </dl>

          <p className="mt-8 text-stone-700">
            Please join us for {EVENT.meal}.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <h2 className="font-display text-2xl text-stone-900">Kindly RSVP</h2>
          <p className="mt-1 text-sm text-stone-600">
            We&apos;d love to know if you can make it.
          </p>
          <div className="mt-6">
            <RsvpForm />
          </div>
        </section>

        <footer className="mt-12 text-center text-sm text-stone-500">
          With love, {EVENT.hosts}
        </footer>
      </div>
    </main>
  );
}
