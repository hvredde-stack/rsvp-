import { listRsvps } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const rsvps = await listRsvps();

  const attending = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + r.guest_count, 0);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl text-stone-900">RSVP responses</h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Stat label="Responses" value={rsvps.length} />
        <Stat label="Attending guests" value={totalGuests} />
        <Stat label="Declined" value={declined.length} />
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Guests</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rsvps.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                  No RSVPs yet.
                </td>
              </tr>
            )}
            {rsvps.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-medium text-stone-900">{r.name}</td>
                <td className="px-4 py-3">
                  {r.attending ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Attending
                    </span>
                  ) : (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
                      Declined
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-stone-700">{r.guest_count}</td>
                <td className="px-4 py-3 text-stone-700">{r.message ?? "—"}</td>
                <td className="px-4 py-3 text-stone-500">
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-1 font-display text-3xl text-stone-900">{value}</p>
    </div>
  );
}
