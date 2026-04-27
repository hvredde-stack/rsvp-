"use client";

import { useActionState } from "react";
import {
  updateInvitation,
  type InvitationFormState,
} from "./actions";
import type { Event } from "@/lib/event";

const initialState: InvitationFormState = { ok: false };

const inputBase =
  "mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm transition focus:border-[#b08043] focus:outline-none focus:ring-2 focus:ring-[#b08043]/30";

const labelBase =
  "block text-[10px] font-medium tracking-wider text-stone-500 uppercase";

type Field = {
  name: keyof Event | "maps_url";
  label: string;
  hint?: string;
  type?: "text" | "url";
  full?: boolean;
};

const FIELDS: Field[] = [
  { name: "hosts", label: "Hosts", hint: "e.g. Naveen Adusumilli & Sri Durga", full: true },
  { name: "title", label: "Event title", hint: "Shown in the headline", full: true },
  { name: "date", label: "Date", hint: "e.g. May 9th" },
  { name: "time", label: "Time", hint: "e.g. 12:00 PM onwards" },
  { name: "meal", label: "Meal", hint: "e.g. lunch" },
  { name: "address", label: "Address", full: true },
  { name: "maps_url", label: "Google Maps link", type: "url", full: true },
];

export function InvitationEditor({ event }: { event: Event }) {
  const [state, formAction, isPending] = useActionState(
    updateInvitation,
    initialState,
  );

  const valueFor = (field: Field): string => {
    if (field.name === "maps_url") return event.mapsUrl;
    return event[field.name as keyof Event];
  };

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {FIELDS.map((field) => (
        <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
          <label htmlFor={`inv-${field.name}`} className={labelBase}>
            {field.label}
          </label>
          <input
            id={`inv-${field.name}`}
            name={field.name}
            type={field.type ?? "text"}
            defaultValue={valueFor(field)}
            required
            className={inputBase}
          />
          {field.hint && (
            <p className="mt-1 text-xs text-stone-400">{field.hint}</p>
          )}
        </div>
      ))}

      <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-[#7a4f1d] px-5 py-2.5 text-xs font-medium tracking-[0.2em] text-white uppercase shadow-sm transition hover:bg-[#5e3c14] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save invitation"}
        </button>
        {state.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700">
            {state.error}
          </p>
        )}
        {state.ok && !state.error && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
            Saved. The invitation page is updated.
          </p>
        )}
      </div>
    </form>
  );
}
