import Image from "next/image";
import { getEvent } from "@/lib/event";
import { RsvpForm } from "./rsvp-form";

export const dynamic = "force-dynamic";

function Ornament() {
  return (
    <div
      aria-hidden
      className="divider-ornament my-6 sm:my-8 text-[#b08043]"
    >
      <span className="text-lg">❦</span>
    </div>
  );
}

export default async function Home() {
  const event = await getEvent();
  const [hostFirst, hostSecond] = event.hosts
    .split(/\s*&\s*/)
    .map((s) => s.trim());

  return (
    <main className="flex flex-1 items-start justify-center px-3 py-10 sm:px-4 sm:py-20">
      <div className="w-full max-w-2xl">
        <header className="text-center">
          <p className="text-sm tracking-luxe text-stone-500 uppercase sm:text-xs">
            An invitation
          </p>
          <h1 className="mt-2 font-display text-4xl italic text-stone-900 sm:text-6xl">
            {event.title}
          </h1>
          <p className="mt-4 font-script text-3xl text-[#b08043] sm:mt-5 sm:text-4xl">
            with heart full of joy
          </p>
        </header>

        <div className="mt-8 flex justify-center sm:mt-10">
          <div className="relative overflow-hidden rounded-2xl border border-[#d4b97a]/50 bg-white p-2 shadow-[0_10px_30px_-10px_rgba(176,128,67,0.35)] sm:p-3">
            <Image
              src="/family.png"
              alt={`${event.hosts} at their housewarming`}
              width={382}
              height={662}
              priority
              sizes="(max-width: 640px) 240px, 320px"
              className="block h-auto w-[240px] rounded-xl sm:w-[320px]"
            />
          </div>
        </div>

        <Ornament />

        <section className="rounded-2xl border border-[#d4b97a]/50 bg-white/70 px-5 py-7 text-center shadow-[0_10px_30px_-15px_rgba(176,128,67,0.4)] backdrop-blur-sm sm:px-10 sm:py-10">
          <p className="text-xs tracking-luxe text-stone-500 uppercase">
            Together with their family
          </p>
          <p className="mt-4 font-script text-5xl text-stone-900 sm:text-6xl">
            {hostSecond ? (
              <>
                {hostFirst} &amp; {hostSecond}
              </>
            ) : (
              event.hosts
            )}
          </p>
          <p className="mt-4 font-display text-2xl tracking-[0.2em] text-[#7a4f1d] uppercase sm:text-3xl">
            {event.title}
          </p>

          <div
            aria-hidden
            className="mx-auto my-7 h-px w-24 bg-gradient-to-r from-transparent via-[#b08043]/60 to-transparent sm:my-9"
          />

          <dl className="grid grid-cols-1 gap-6 text-stone-700 sm:grid-cols-3 sm:gap-4">
            <div>
              <dt className="text-[10px] tracking-luxe text-stone-500 uppercase">
                Date
              </dt>
              <dd className="mt-2 font-display text-xl text-stone-900 sm:text-2xl">
                {event.date}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-luxe text-stone-500 uppercase">
                Time
              </dt>
              <dd className="mt-2 font-display text-xl text-stone-900 sm:text-2xl">
                {event.time}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-luxe text-stone-500 uppercase">
                Venue
              </dt>
              <dd className="mt-2 font-display text-lg text-stone-900 sm:text-xl">
                {event.address}
              </dd>
            </div>
          </dl>

          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#b08043] bg-[#b08043] px-6 py-2.5 text-xs font-medium tracking-[0.2em] text-white uppercase shadow-sm transition hover:bg-[#8a6432] sm:mt-8"
          >
            <span aria-hidden>📍</span>
            Get Directions
          </a>

          <p className="mt-7 font-display italic text-base text-stone-700 sm:mt-9 sm:text-lg">
            Please join us for {event.meal}.
          </p>
        </section>

        <Ornament />

        <section className="rounded-2xl border border-stone-200 bg-white px-5 py-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] sm:px-10 sm:py-10">
          <h2 className="text-center font-script text-3xl text-[#b08043] sm:text-4xl">
            Kindly RSVP
          </h2>
          <p className="mt-1 text-center text-xs tracking-luxe text-stone-500 uppercase">
            We&apos;d love to know if you can make it
          </p>
          <div className="mt-6 sm:mt-8">
            <RsvpForm />
          </div>
        </section>

        <footer className="mt-10 text-center sm:mt-14">
          <p className="text-xs tracking-luxe text-stone-500 uppercase">
            With love
          </p>
          <p className="mt-2 font-script text-3xl text-stone-700 sm:text-4xl">
            {hostSecond ? (
              <>
                {hostFirst} &amp; {hostSecond}
              </>
            ) : (
              event.hosts
            )}
          </p>
        </footer>
      </div>
    </main>
  );
}
