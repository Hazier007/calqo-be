export type AffiliateNetwork =
  | "daisycon"
  | "tradetracker"
  | "awin"
  | "bol"
  | "direct";

export interface AffiliateClickPayload {
  affiliate_network: AffiliateNetwork;
  affiliate_partner: string;
  site: string;
  placement: string;
  sub_id?: string;
}

interface DataLayerWindow extends Window {
  dataLayer?: Array<Record<string, unknown>>;
}

export function trackAffiliateClick(payload: AffiliateClickPayload): void {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  const event: Record<string, unknown> = { event: "click_outbound" };
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined) event[key] = value;
  }
  w.dataLayer.push(event);
}
