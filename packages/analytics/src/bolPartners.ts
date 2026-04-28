// Bol Partners click-tracking helpers.
//
// Bol Partners is auto-approved op signup → er zijn geen per-advertiser
// applicaties. Revenue loopt via directe integratie van click-tracking links
// + sub-IDs op de portfolio-sites.
//
// Click-URL format (publiek gedocumenteerd op
// affiliate.bol.com/nl/handleiding/tracking-url/):
//
//   https://partner.bol.com/click/click
//     ?p=1
//     &t=url
//     &s={SiteId}
//     &url={url-encoded target Bol URL}
//     &subid={sub_id}
//
// `s=` is de **SiteId** (per-domein, uniek per geregistreerde website onder je
// Bol-account). Bol-docs: "Het SiteId is uniek per domein, dus let erop tijdens
// het maken van Affiliate links. Gebeurt dat niet, dan kunnen we niet
// registreren bij welk Affiliate account de klik en aankoop hoort." Ergo:
// elke site moet zijn eigen SiteId meesturen — een gedeelde "publisher ID"
// bestaat niet in dit URL-format. `subid` is daarnaast onze eigen vrije
// sub-segmentatie (per maand / placement) — die drijft Bol's accounting niet.

export const BOL_PARTNERS_BASE = "https://partner.bol.com/click/click";

export interface BuildBolDeeplinkInput {
  siteId: string;
  targetUrl: string;
  subId?: string;
}

export function buildBolDeeplink({
  siteId,
  targetUrl,
  subId,
}: BuildBolDeeplinkInput): string {
  const params = new URLSearchParams();
  params.set("p", "1");
  params.set("t", "url");
  params.set("s", siteId);
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
  siteId: string;
  subIdSlug: string;
  categoryFit: string;
  defaultTargetUrl: string;
}

// SiteId-codes geverifieerd in Bol Partner dashboard 2026-04-27 (CAL-136
// screenshot). Sub-ID convention: `{site-slug}_bol_apr2026` per CAL-21 §5.2 —
// maand-suffix laat ons per maand attribution doen zonder ID-rotatie.
// Default-targetUrls gebruiken Bol's publieke search-URL omdat die stabiel
// zijn ongeacht category-ID rotaties; site-teams mogen later een specifieke
// category- of product-page deeplinken via `buildBolDeeplink({ targetUrl: ... })`.
export const BOL_SITE_CONFIGS: Record<BolEnrolledSite, BolSiteConfig> = {
  "interesten.be": {
    site: "interesten.be",
    siteId: "1517373",
    subIdSlug: "interesten_bol_apr2026",
    categoryFit: "Personal finance / sparen / beleggen books",
    defaultTargetUrl:
      "https://www.bol.com/be/nl/s/?searchtext=slim+sparen+beleggen",
  },
  "huurrendementcalculator.be": {
    site: "huurrendementcalculator.be",
    siteId: "1517367",
    subIdSlug: "huurrendement_bol_apr2026",
    categoryFit: "Vastgoed-investeren books",
    defaultTargetUrl:
      "https://www.bol.com/be/nl/s/?searchtext=vastgoed+beleggen",
  },
  "kleurcodes.be": {
    site: "kleurcodes.be",
    siteId: "1517352",
    subIdSlug: "kleurcodes_bol_apr2026",
    categoryFit: "Hobby / kunst / kleurboeken",
    defaultTargetUrl:
      "https://www.bol.com/be/nl/s/?searchtext=kleurboek+volwassenen",
  },
  "zwangerschapscalculator.be": {
    site: "zwangerschapscalculator.be",
    siteId: "1517329",
    subIdSlug: "zwangerschap_bol_apr2026",
    categoryFit: "Baby / zwangerschap",
    defaultTargetUrl:
      "https://www.bol.com/be/nl/s/?searchtext=zwangerschap+baby",
  },
  "airfryertijden.be": {
    site: "airfryertijden.be",
    siteId: "1517322",
    subIdSlug: "airfryertijden_bol_apr2026",
    categoryFit: "Keuken / airfryers + cookbooks",
    defaultTargetUrl: "https://www.bol.com/be/nl/s/?searchtext=airfryer",
  },
  "buitendrogen.be": {
    site: "buitendrogen.be",
    siteId: "1517334",
    subIdSlug: "buitendrogen_bol_apr2026",
    categoryFit: "Tuin / wasrekken / wasdrogen",
    defaultTargetUrl:
      "https://www.bol.com/be/nl/s/?searchtext=wasrek+buiten",
  },
  "loonberekening.be": {
    site: "loonberekening.be",
    siteId: "1517359",
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
  targetUrl?: string;
  subId?: string;
}

export function buildBolSiteDeeplink({
  site,
  targetUrl,
  subId,
}: BuildBolSiteDeeplinkInput): string {
  const config = getBolSiteConfig(site);
  return buildBolDeeplink({
    siteId: config.siteId,
    targetUrl: targetUrl ?? config.defaultTargetUrl,
    subId: subId ?? config.subIdSlug,
  });
}
