"use server";

import { z } from "zod";
import { insertRsvp } from "@/lib/db";

const RsvpSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  attending: z.enum(["yes", "no"]),
  guest_count: z.coerce.number().int().min(0).max(20),
  message: z.string().trim().max(500).optional(),
});

export type RsvpFormState = {
  ok: boolean;
  error?: string;
  guestName?: string;
  attending?: "yes" | "no";
};

export async function submitRsvp(
  _prev: RsvpFormState,
  formData: FormData,
): Promise<RsvpFormState> {
  const parsed = RsvpSchema.safeParse({
    name: formData.get("name"),
    attending: formData.get("attending"),
    guest_count: formData.get("guest_count"),
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid submission",
    };
  }

  const data = parsed.data;

  try {
    await insertRsvp({
      name: data.name,
      attending: data.attending === "yes",
      guest_count: data.attending === "yes" ? data.guest_count : 0,
      message: data.message?.length ? data.message : null,
    });
  } catch (err) {
    console.error("[rsvp] insert failed", err);
    return {
      ok: false,
      error:
        "Could not save your RSVP. Please try again, or text the hosts directly.",
    };
  }

  return {
    ok: true,
    guestName: data.name,
    attending: data.attending,
  };
}
