export interface BuildSubIdInput {
  site: string;
  placement: string;
  date?: Date;
}

function slug(part: string): string {
  return part
    .toLowerCase()
    .replace(/\.[a-z]{2,}$/i, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function buildSubId({ site, placement, date = new Date() }: BuildSubIdInput): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${slug(site)}_${slug(placement)}_${yyyy}${mm}`;
}
