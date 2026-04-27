import { getEventSettings, type EventSettings } from "./db";

export const EVENT = {
  hosts: "Naveen Adusumilli & Sri Durga",
  title: "Housewarming Ceremony",
  date: "May 9th",
  time: "12:00 PM onwards",
  meal: "lunch",
  address: "3610 Sky Ln, Cumming, GA",
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=3610+Sky+Ln+Cumming+GA+30040",
};

export type Event = typeof EVENT;

function fromRow(row: EventSettings): Event {
  return {
    hosts: row.hosts,
    title: row.title,
    date: row.date,
    time: row.time,
    meal: row.meal,
    address: row.address,
    mapsUrl: row.maps_url,
  };
}

/**
 * Read the current invitation. Falls back to the EVENT defaults when nothing
 * has been customized yet, or when the DB read fails (e.g. local dev without
 * Postgres configured).
 */
export async function getEvent(): Promise<Event> {
  try {
    const row = await getEventSettings();
    return row ? fromRow(row) : EVENT;
  } catch (err) {
    console.error("[event] failed to load settings, using defaults", err);
    return EVENT;
  }
}
