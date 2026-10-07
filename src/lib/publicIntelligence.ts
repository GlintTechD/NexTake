import { supabase } from "./supabase";
import type { EventRegion, TechEvent } from "../types";

export interface PublicStartup {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  industry: string;
  country: string;
  headquarters: string;
  website: string;
  stage: string;
}

const text = (value: unknown) => (value == null ? "" : String(value));

export async function getPublishedStartups(): Promise<PublicStartup[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("startups")
    .select("id, name, slug, logo_url, description, industry, country, headquarters, website, stage")
    .eq("origin", "live")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load published startups:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: text(row.id),
    name: text(row.name),
    slug: text(row.slug),
    logoUrl: text(row.logo_url),
    description: text(row.description),
    industry: text(row.industry) || "Technology",
    country: text(row.country),
    headquarters: text(row.headquarters),
    website: text(row.website),
    stage: text(row.stage),
  }));
}

const regionFor = (location: string): EventRegion => {
  const value = location.toLowerCase();
  if (/nigeria|kenya|south africa|ghana|rwanda|tanzania|uganda|senegal|morocco|egypt|ethiopia|côte d'ivoire|ivory coast/.test(value)) return "Africa";
  if (/united kingdom|uk|france|germany|spain|portugal|netherlands|sweden|switzerland|europe/.test(value)) return "Europe";
  if (/uae|emirates|saudi|qatar|israel|middle east/.test(value)) return "Middle East";
  return "Americas";
};

const calendarDate = (value: unknown) => text(value).slice(0, 10);

export async function getPublishedEvents(): Promise<TechEvent[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("events")
    .select("id, name, kind, start_date, end_date, location, url, description, origin")
    .eq("origin", "live")
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Unable to load published events:", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const place = text(row.location).split(",").map((part) => part.trim()).filter(Boolean);
    const startDate = calendarDate(row.start_date);
    const endDate = calendarDate(row.end_date) || startDate;
    return {
      id: text(row.id),
      name: text(row.name),
      category: text(row.kind).replace(/_/g, " "),
      startDate,
      endDate,
      venue: place.length > 2 ? place.slice(0, -2).join(", ") : undefined,
      city: place.length > 1 ? place[place.length - 2] : place[0] || "",
      country: place.length > 1 ? place[place.length - 1] : "",
      region: regionFor(text(row.location)),
      summary: text(row.description),
      url: text(row.url) || "#",
      image: "",
    };
  }).filter((event) => event.startDate && event.endDate);
}