import { describe, expect, it } from "vitest";
import {
  BOL_PARTNERS_BASE,
  BOL_PUBLISHER_ID,
  BOL_SITE_CONFIGS,
  buildBolDeeplink,
  buildBolSiteDeeplink,
  getBolSiteConfig,
  type BolEnrolledSite,
} from "../bolPartners.js";

describe("buildBolDeeplink", () => {
  it("emits the standard partner.bol.com click format with publisher 1517373 by default", () => {
    const url = new URL(
      buildBolDeeplink({
        targetUrl: "https://www.bol.com/be/nl/",
        subId: "interesten_bol_apr2026",
      }),
    );

    expect(`${url.origin}${url.pathname}`).toBe(BOL_PARTNERS_BASE);
    expect(url.searchParams.get("p")).toBe("1");
    expect(url.searchParams.get("t")).toBe("url");
    expect(url.searchParams.get("s")).toBe(BOL_PUBLISHER_ID);
    expect(url.searchParams.get("s")).toBe("1517373");
    expect(url.searchParams.get("url")).toBe("https://www.bol.com/be/nl/");
    expect(url.searchParams.get("subid")).toBe("interesten_bol_apr2026");
  });

  it("URL-encodes target URLs that contain query strings", () => {
    const result = buildBolDeeplink({
      targetUrl: "https://www.bol.com/be/nl/s/?searchtext=airfryer",
      subId: "airfryertijden_bol_apr2026",
    });

    // Bol's click endpoint requires the destination URL to be URL-encoded so
    // the inner `?` doesn't terminate Bol's own query string.
    expect(result).toContain(
      "url=https%3A%2F%2Fwww.bol.com%2Fbe%2Fnl%2Fs%2F%3Fsearchtext%3Dairfryer",
    );
    expect(result).toContain("subid=airfryertijden_bol_apr2026");
  });

  it("omits the subid parameter when no sub-ID is given", () => {
    const url = new URL(
      buildBolDeeplink({ targetUrl: "https://www.bol.com/be/nl/" }),
    );
    expect(url.searchParams.has("subid")).toBe(false);
  });

  it("accepts a custom publisher id override", () => {
    const url = new URL(
      buildBolDeeplink({
        publisherId: "9999999",
        targetUrl: "https://www.bol.com/be/nl/",
      }),
    );
    expect(url.searchParams.get("s")).toBe("9999999");
  });
});

describe("BOL_SITE_CONFIGS", () => {
  const enrolledSites: BolEnrolledSite[] = [
    "interesten.be",
    "huurrendementcalculator.be",
    "kleurcodes.be",
    "zwangerschapscalculator.be",
    "airfryertijden.be",
    "buitendrogen.be",
    "loonberekening.be",
  ];

  it("covers all 7 enrolled portfolio sites", () => {
    expect(Object.keys(BOL_SITE_CONFIGS).sort()).toEqual(
      [...enrolledSites].sort(),
    );
  });

  it("uses the {site}_bol_apr2026 sub-ID convention from CAL-21 §5.2", () => {
    for (const site of enrolledSites) {
      const config = BOL_SITE_CONFIGS[site];
      expect(config.subIdSlug).toMatch(/_bol_apr2026$/);
    }
  });

  it("points each site at a bol.com BE/NL target URL", () => {
    for (const site of enrolledSites) {
      const config = BOL_SITE_CONFIGS[site];
      expect(config.defaultTargetUrl).toMatch(
        /^https:\/\/www\.bol\.com\/be\/nl\//,
      );
    }
  });

  it("uses unique sub-IDs per site so Bol reporting can split revenue", () => {
    const subIds = enrolledSites.map((s) => BOL_SITE_CONFIGS[s].subIdSlug);
    expect(new Set(subIds).size).toBe(subIds.length);
  });
});

describe("buildBolSiteDeeplink", () => {
  it("uses the per-site default target URL and sub-ID", () => {
    const url = new URL(buildBolSiteDeeplink({ site: "interesten.be" }));
    expect(url.searchParams.get("s")).toBe(BOL_PUBLISHER_ID);
    expect(url.searchParams.get("subid")).toBe("interesten_bol_apr2026");
    expect(url.searchParams.get("url")).toBe(
      getBolSiteConfig("interesten.be").defaultTargetUrl,
    );
  });

  it("lets callers override the targetUrl while keeping the per-site sub-ID", () => {
    const url = new URL(
      buildBolSiteDeeplink({
        site: "airfryertijden.be",
        targetUrl: "https://www.bol.com/be/nl/p/philips-airfryer/123/",
      }),
    );
    expect(url.searchParams.get("subid")).toBe("airfryertijden_bol_apr2026");
    expect(url.searchParams.get("url")).toBe(
      "https://www.bol.com/be/nl/p/philips-airfryer/123/",
    );
  });

  it("lets callers override the sub-ID for A/B placement experiments", () => {
    const url = new URL(
      buildBolSiteDeeplink({
        site: "kleurcodes.be",
        subId: "kleurcodes_bol_sidebar_apr2026",
      }),
    );
    expect(url.searchParams.get("subid")).toBe(
      "kleurcodes_bol_sidebar_apr2026",
    );
  });
});
