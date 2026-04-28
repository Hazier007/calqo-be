import { describe, expect, it } from "vitest";
import {
  BOL_PARTNERS_BASE,
  BOL_SITE_CONFIGS,
  buildBolDeeplink,
  buildBolSiteDeeplink,
  getBolSiteConfig,
  type BolEnrolledSite,
} from "../bolPartners.js";

describe("buildBolDeeplink", () => {
  it("emits the standard partner.bol.com click format with the supplied SiteId", () => {
    const url = new URL(
      buildBolDeeplink({
        siteId: "1517373",
        targetUrl: "https://www.bol.com/be/nl/",
        subId: "interesten_bol_apr2026",
      }),
    );

    expect(`${url.origin}${url.pathname}`).toBe(BOL_PARTNERS_BASE);
    expect(url.searchParams.get("p")).toBe("1");
    expect(url.searchParams.get("t")).toBe("url");
    expect(url.searchParams.get("s")).toBe("1517373");
    expect(url.searchParams.get("url")).toBe("https://www.bol.com/be/nl/");
    expect(url.searchParams.get("subid")).toBe("interesten_bol_apr2026");
  });

  it("URL-encodes target URLs that contain query strings", () => {
    const result = buildBolDeeplink({
      siteId: "1517322",
      targetUrl: "https://www.bol.com/be/nl/s/?searchtext=airfryer",
      subId: "airfryertijden_bol_apr2026",
    });

    // Bol's click endpoint requires the destination URL to be URL-encoded so
    // the inner `?` doesn't terminate Bol's own query string.
    expect(result).toContain(
      "url=https%3A%2F%2Fwww.bol.com%2Fbe%2Fnl%2Fs%2F%3Fsearchtext%3Dairfryer",
    );
    expect(result).toContain("subid=airfryertijden_bol_apr2026");
    expect(result).toContain("s=1517322");
  });

  it("omits the subid parameter when no sub-ID is given", () => {
    const url = new URL(
      buildBolDeeplink({
        siteId: "1517322",
        targetUrl: "https://www.bol.com/be/nl/",
      }),
    );
    expect(url.searchParams.has("subid")).toBe(false);
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

  it("uses unique sub-IDs per site so internal reporting can split revenue", () => {
    const subIds = enrolledSites.map((s) => BOL_SITE_CONFIGS[s].subIdSlug);
    expect(new Set(subIds).size).toBe(subIds.length);
  });

  it("uses unique per-domain SiteIds so Bol attributes clicks to the right site", () => {
    const siteIds = enrolledSites.map((s) => BOL_SITE_CONFIGS[s].siteId);
    expect(new Set(siteIds).size).toBe(siteIds.length);
  });

  it("matches the SiteId codes captured in the Bol Partner dashboard 2026-04-27 (CAL-136)", () => {
    expect(BOL_SITE_CONFIGS["interesten.be"].siteId).toBe("1517373");
    expect(BOL_SITE_CONFIGS["huurrendementcalculator.be"].siteId).toBe(
      "1517367",
    );
    expect(BOL_SITE_CONFIGS["loonberekening.be"].siteId).toBe("1517359");
    expect(BOL_SITE_CONFIGS["kleurcodes.be"].siteId).toBe("1517352");
    expect(BOL_SITE_CONFIGS["buitendrogen.be"].siteId).toBe("1517334");
    expect(BOL_SITE_CONFIGS["zwangerschapscalculator.be"].siteId).toBe(
      "1517329",
    );
    expect(BOL_SITE_CONFIGS["airfryertijden.be"].siteId).toBe("1517322");
  });
});

describe("buildBolSiteDeeplink", () => {
  it("uses the per-site SiteId, default target URL, and sub-ID", () => {
    const url = new URL(buildBolSiteDeeplink({ site: "interesten.be" }));
    expect(url.searchParams.get("s")).toBe("1517373");
    expect(url.searchParams.get("subid")).toBe("interesten_bol_apr2026");
    expect(url.searchParams.get("url")).toBe(
      getBolSiteConfig("interesten.be").defaultTargetUrl,
    );
  });

  it("emits airfryertijden's own SiteId 1517322, not interesten's 1517373", () => {
    // Regression guard for CAL-136: the original CAL-78 helper hardcoded
    // 1517373 (interesten's SiteId) on every site, so all clicks were
    // attributed to interesten.be in Bol's reporting.
    const url = new URL(buildBolSiteDeeplink({ site: "airfryertijden.be" }));
    expect(url.searchParams.get("s")).toBe("1517322");
    expect(url.searchParams.get("s")).not.toBe("1517373");
  });

  it("lets callers override the targetUrl while keeping the per-site SiteId + sub-ID", () => {
    const url = new URL(
      buildBolSiteDeeplink({
        site: "airfryertijden.be",
        targetUrl: "https://www.bol.com/be/nl/p/philips-airfryer/123/",
      }),
    );
    expect(url.searchParams.get("s")).toBe("1517322");
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
    expect(url.searchParams.get("s")).toBe("1517352");
    expect(url.searchParams.get("subid")).toBe(
      "kleurcodes_bol_sidebar_apr2026",
    );
  });
});
