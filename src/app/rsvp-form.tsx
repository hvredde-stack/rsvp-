"use client";

import { useActionState, useState } from "react";
import { submitRsvp, type RsvpFormState } from "./actions";

const initialState: RsvpFormState = { ok: false };

export function RsvpForm() {
  const [state, formAction, isPending] = useActionState(submitRsvp, initialState);
  const [attending, setAttending] = useState<"yes" | "no">("yes");

  if (state.ok) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="font-display text-2xl text-stone-800">
          Thank you, {state.guestName}!
        </p>
        <p className="mt-2 text-stone-600">
          {state.attending === "yes"
            ? "We can't wait to celebrate with you."
            : "We'll miss you, but thank you for letting us know."}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700">
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-stone-700">
          Will you be joining us?
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label
            className={`cursor-pointer rounded-md border px-4 py-3 text-center transition ${
              attending === "yes"
                ? "border-amber-600 bg-amber-100 text-amber-900"
                : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
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
            className={`cursor-pointer rounded-md border px-4 py-3 text-center transition ${
              attending === "no"
                ? "border-stone-500 bg-stone-100 text-stone-800"
                : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
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
          <label
            htmlFor="guest_count"
            className="block text-sm font-medium text-stone-700"
          >
            How many will be attending? (including yourself)
          </label>
          <input
            id="guest_count"
            name="guest_count"
            type="number"
            min={1}
            max={20}
            defaultValue={1}
            className="mt-1 w-28 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      )}

      {attending === "no" && (
        <input type="hidden" name="guest_count" value="0" />
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-stone-700">
          A note for the hosts <span className="text-stone-400">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={500}
          className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-amber-700 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}
