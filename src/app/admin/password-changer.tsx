"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  updateAdminPassword,
  type PasswordFormState,
} from "./actions";

const initialState: PasswordFormState = { ok: false };

const inputBase =
  "mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm transition focus:border-[#b08043] focus:outline-none focus:ring-2 focus:ring-[#b08043]/30";

const labelBase =
  "block text-[10px] font-medium tracking-wider text-stone-500 uppercase";

export function PasswordChanger() {
  const [state, formAction, isPending] = useActionState(
    updateAdminPassword,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && state.savedAt) {
      formRef.current?.reset();
    }
  }, [state.ok, state.savedAt]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      <div>
        <label htmlFor="current_password" className={labelBase}>
          Current password
        </label>
        <input
          id="current_password"
          name="current_password"
          type="password"
          autoComplete="current-password"
          required
          className={inputBase}
        />
      </div>
      <div>
        <label htmlFor="new_password" className={labelBase}>
          New password
        </label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputBase}
        />
      </div>
      <div>
        <label htmlFor="confirm_password" className={labelBase}>
          Confirm new password
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputBase}
        />
      </div>

      <div className="sm:col-span-3 flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-stone-800 px-5 py-2.5 text-xs font-medium tracking-[0.2em] text-white uppercase shadow-sm transition hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Updating…" : "Update password"}
        </button>
        {state.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700">
            {state.error}
          </p>
        )}
        {state.ok && !state.error && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
            Password updated. Use it on your next sign-in.
          </p>
        )}
      </div>

      <p className="sm:col-span-3 text-xs text-stone-500">
        The username stays the same (set by the <code>ADMIN_USER</code> env
        var). The new password is stored securely in the database and takes
        precedence over <code>ADMIN_PASS</code>.
      </p>
    </form>
  );
}
