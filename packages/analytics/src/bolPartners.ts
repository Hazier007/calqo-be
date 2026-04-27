// Bol Partners click-tracking helpers.
//
// Bol Partners is auto-approved op signup → er zijn geen per-advertiser
// applicaties. Revenue loopt via directe integratie van click-tracking links
// + sub-IDs op de portfolio-sites.
//
// Click-URL format (publiek gedocumenteerd, bevestigd in Bol Partners
// dashboard "Tools → Linkmaker"):
//
//   https://partner.bol.com/click/click
//     ?p=1
//     &t=url
//     &s={publisher_id}
//     &url={url-encoded target Bol URL}
//     &subid={sub_id}
//
// `p=1` selecteert het standaard "click → URL" linktype, `t=url` zegt dat de
// destination een URL is (geen product-EAN), `s` is de publisher-ID, `subid`
// is onze tracking-segmentatie.

export const BOL_PUBLISHER_ID = "1517373";

export const BOL_PARTNERS_BASE = "https://partner.bol.com/click/click";

export interface BuildBolDeeplinkInput {
  publisherId?: string;
  targetUrl: string;
  subId?: string;
}

export function buildBolDeeplink({
  publisherId = BOL_PUBLISHER_ID,
  targetUrl,
  subId,
}: BuildBolDeeplinkInput): string {
  const params = new URLSearchParams();
  params.set("p", "1");
  params.set("t", "url");
  params.set("s", publisherId);
  params.set("url", targetUrl);
  if (subId) params.set("subid", subId);
  return `${BOL_PARTNERS_BASE}?${params.toString()}`;
}

export type BolEnrolledSite =
  | "interesten.be"
  | "huurrendementcalculator.be"
  | "kleurcodes.be"
  | "zwangerschapscalculator.be"
  | "airfryertijden.be"
  | "buitendrogen.be"
  | "loonberekening.be";

export interface BolSiteConfig {
  site: BolEnrolledSite;
  subIdSlug: string;
  categoryFit: string;
  defaultTargetUrl: string;
}

// Sub-ID convention: `{site-slug}_bol_apr2026` per CAL-21 §5.2 — maand-suffix
// laat ons per maand attribution doen zonder ID-rotatie. Default-targetUrls
// gebruiken Bol's publieke search-URL omdat die stabiel zijn ongeacht
// category-ID rotaties; site-teams mogen later een specifieke category- of
// product-page deeplinken via `buildBolDeeplink({ targetUrl: ... })` direct.
export const BOL_SITE_CONFIGS: Record<BolEnrolledSite, BolSiteConfig> = {
  "interesten.be": {
    site: "interesten.be",
    subIdSlug: "interesten_bol_apr2026",
    categoryFit: "Personal finance / sparen / beleggen books",
    defaultTargetUrl:
      "https://www.bol.com/be/nl/s/?searchtext=slim+sparen+beleggen",
  },
  "huurrendementcalculator.be": {
    site: "huurrendementcalculator.be",
    subIdSlug: "huurrendement_bol_apr2026",
    categoryFit: "Vastgoed-investeren books",
    defaultTargetUrl:
      "https://www.bol.com/be/nl/s/?searchtext=vastgoed+beleggen",
  },
  "kleurcodes.be": {
    site: "kleurcodes.be",
    subIdSlug: "kleurcodes_bol_apr2026",
    categoryFit: "Hobby / kunst / kleurboeken",
    defaultTargetUrl:
      "https://www.bol.com/be/nl/s/?searchtext=kleurboek+volwassenen",
  },
  "zwangerschapscalculator.be": {
    site: "zwangerschapscalculator.be",
    subIdSlug: "zwangerschap_bol_apr2026",
    categoryFit: "Baby / zwangerschap",
    defaultTargetUrl:
      "https://www.bol.com/be/nl/s/?searchtext=zwangerschap+baby",
  },
  "airfryertijden.be": {
    site: "airfryertijden.be",
    subIdSlug: "airfryertijden_bol_apr2026",
    categoryFit: "Keuken / airfryers + cookbooks",
    defaultTargetUrl: "https://www.bol.com/be/nl/s/?searchtext=airfryer",
  },
  "buitendrogen.be": {
    site: "buitendrogen.be",
    subIdSlug: "buitendrogen_bol_apr2026",
    categoryFit: "Tuin / wasrekken / wasdrogen",
    defaultTargetUrl:
      "https://www.bol.com/be/nl/s/?searchtext=wasrek+buiten",
  },
  "loonberekening.be": {
    site: "loonberekening.be",
    subIdSlug: "loonberekening_bol_apr2026",
    categoryFit: "Algemeen catalog (low-affinity fallback)",
    defaultTargetUrl: "https://www.bol.com/be/nl/",
  },
};

export function getBolSiteConfig(site: BolEnrolledSite): BolSiteConfig {
  return BOL_SITE_CONFIGS[site];
}

export interface BuildBolSiteDeeplinkInput {
  site: BolEnrolledSite;
  publisherId?: string;
  targetUrl?: string;
  subId?: string;
}

export function buildBolSiteDeeplink({
  site,
  publisherId,
  targetUrl,
  subId,
}: BuildBolSiteDeeplinkInput): string {
  const config = getBolSiteConfig(site);
  return buildBolDeeplink({
    publisherId,
    targetUrl: targetUrl ?? config.defaultTargetUrl,
    subId: subId ?? config.subIdSlug,
  });
}
