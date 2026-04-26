"use client";

import { useActionState, useState } from "react";
import { submitRsvp, type RsvpFormState } from "./actions";

const initialState: RsvpFormState = { ok: false };

const inputBase =
  "mt-2 w-full rounded-md border border-[#d4b97a]/60 bg-white px-3 py-2.5 text-base text-stone-900 shadow-sm transition focus:border-[#b08043] focus:outline-none focus:ring-2 focus:ring-[#b08043]/30";

const labelBase =
  "block text-[10px] tracking-luxe text-stone-500 uppercase";

export function RsvpForm() {
  const [state, formAction, isPending] = useActionState(submitRsvp, initialState);
  const [attending, setAttending] = useState<"yes" | "no">("yes");

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-[#d4b97a]/50 bg-[#fbf6ec] p-8 text-center">
        <p className="font-script text-4xl text-[#b08043] sm:text-5xl">
          Thank you, {state.guestName}
        </p>
        <p className="mt-3 font-display italic text-base text-stone-700 sm:text-lg">
          {state.attending === "yes"
            ? "We can't wait to celebrate with you."
            : "We'll miss you, but thank you for letting us know."}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="name" className={labelBase}>
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          className={inputBase}
        />
      </div>

      <fieldset>
        <legend className={labelBase}>Will you be joining us?</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label
            className={`cursor-pointer rounded-md border px-3 py-3.5 text-center text-sm font-medium tracking-wide transition ${
              attending === "yes"
                ? "border-[#b08043] bg-[#fbf6ec] text-[#7a4f1d] shadow-inner"
                : "border-[#d4b97a]/40 bg-white text-stone-600 hover:border-[#d4b97a]"
            }`}
          >
            <input
              type="radio"
              name="attending"
              value="yes"
              checked={attending === "yes"}
              onChange={() => setAttending("yes")}
              className="sr-only"
            />
            Joyfully accepts
          </label>
          <label
            className={`cursor-pointer rounded-md border px-3 py-3.5 text-center text-sm font-medium tracking-wide transition ${
              attending === "no"
                ? "border-stone-500 bg-stone-100 text-stone-800 shadow-inner"
                : "border-[#d4b97a]/40 bg-white text-stone-600 hover:border-stone-400"
            }`}
          >
            <input
              type="radio"
              name="attending"
              value="no"
              checked={attending === "no"}
              onChange={() => setAttending("no")}
              className="sr-only"
            />
            Regretfully declines
          </label>
        </div>
      </fieldset>

      {attending === "yes" && (
        <div>
          <label htmlFor="guest_count" className={labelBase}>
            Number of guests (including you)
          </label>
          <input
            id="guest_count"
            name="guest_count"
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            defaultValue={1}
            className={`${inputBase} w-28`}
          />
        </div>
      )}

      {attending === "no" && (
        <input type="hidden" name="guest_count" value="0" />
      )}

      <div>
        <label htmlFor="message" className={labelBase}>
          A note for the hosts <span className="normal-case tracking-normal text-stone-400">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={500}
          className={inputBase}
        />
      </div>

      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-[#7a4f1d] px-4 py-3.5 text-xs font-medium tracking-[0.25em] text-white uppercase shadow-md transition hover:bg-[#5e3c14] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}
