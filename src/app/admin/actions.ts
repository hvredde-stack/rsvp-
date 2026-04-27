"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  getAdminPasswordHash,
  setAdminPasswordHash,
  upsertEventSettings,
} from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";

const InvitationSchema = z.object({
  hosts: z.string().trim().min(1, "Hosts is required").max(200),
  title: z.string().trim().min(1, "Title is required").max(200),
  date: z.string().trim().min(1, "Date is required").max(80),
  time: z.string().trim().min(1, "Time is required").max(80),
  meal: z.string().trim().min(1, "Meal is required").max(80),
  address: z.string().trim().min(1, "Address is required").max(300),
  maps_url: z
    .string()
    .trim()
    .min(1, "Maps URL is required")
    .max(1000)
    .url("Maps URL must be a valid URL"),
});

export type InvitationFormState = {
  ok: boolean;
  error?: string;
  savedAt?: number;
};

export async function updateInvitation(
  _prev: InvitationFormState,
  formData: FormData,
): Promise<InvitationFormState> {
  const parsed = InvitationSchema.safeParse({
    hosts: formData.get("hosts"),
    title: formData.get("title"),
    date: formData.get("date"),
    time: formData.get("time"),
    meal: formData.get("meal"),
    address: formData.get("address"),
    maps_url: formData.get("maps_url"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid invitation",
    };
  }

  try {
    await upsertEventSettings(parsed.data);
  } catch (err) {
    console.error("[admin] failed to save invitation", err);
    return { ok: false, error: "Could not save the invitation. Try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, savedAt: Date.now() };
}

const PasswordSchema = z
  .object({
    current_password: z.string().min(1, "Enter your current password"),
    new_password: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(200),
    confirm_password: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "New passwords do not match",
    path: ["confirm_password"],
  });

export type PasswordFormState = {
  ok: boolean;
  error?: string;
  savedAt?: number;
};

export async function updateAdminPassword(
  _prev: PasswordFormState,
  formData: FormData,
): Promise<PasswordFormState> {
  const parsed = PasswordSchema.safeParse({
    current_password: formData.get("current_password"),
    new_password: formData.get("new_password"),
    confirm_password: formData.get("confirm_password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { current_password, new_password } = parsed.data;

  // Verify current password against the same source the proxy trusts:
  // DB hash if one is set, otherwise the env var.
  let currentValid = false;
  try {
    const dbHash = await getAdminPasswordHash();
    if (dbHash) {
      currentValid = verifyPassword(current_password, dbHash);
    } else {
      const envPass = process.env.ADMIN_PASS;
      currentValid = !!envPass && current_password === envPass;
    }
  } catch (err) {
    console.error("[admin] failed to read current password hash", err);
    return {
      ok: false,
      error: "Could not verify the current password. Try again.",
    };
  }

  if (!currentValid) {
    return { ok: false, error: "Current password is incorrect." };
  }

  try {
    const hash = hashPassword(new_password);
    await setAdminPasswordHash(hash);
  } catch (err) {
    console.error("[admin] failed to save new password", err);
    return { ok: false, error: "Could not save the new password. Try again." };
  }

  return { ok: true, savedAt: Date.now() };
}
