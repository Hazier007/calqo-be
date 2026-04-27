import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { trackAffiliateClick } from "../trackAffiliateClick.js";

interface DataLayerWindow extends Window {
  dataLayer?: Array<Record<string, unknown>>;
}

describe("trackAffiliateClick", () => {
  beforeEach(() => {
    (window as DataLayerWindow).dataLayer = undefined;
  });

  afterEach(() => {
    (window as DataLayerWindow).dataLayer = undefined;
  });

  it("initialises window.dataLayer if not present and pushes click_outbound event", () => {
    expect((window as DataLayerWindow).dataLayer).toBeUndefined();

    trackAffiliateClick({
      affiliate_network: "daisycon",
      affiliate_partner: "Mega",
      site: "goedkoopstroom.be",
      placement: "result_card",
      sub_id: "goedkoopstroom_result_202604",
    });

    const dl = (window as DataLayerWindow).dataLayer;
    expect(dl).toHaveLength(1);
    expect(dl?.[0]).toEqual({
      event: "click_outbound",
      affiliate_network: "daisycon",
      affiliate_partner: "Mega",
      site: "goedkoopstroom.be",
      placement: "result_card",
      sub_id: "goedkoopstroom_result_202604",
    });
  });

  it("appends to existing dataLayer instead of overwriting", () => {
    (window as DataLayerWindow).dataLayer = [{ event: "page_view" }];

    trackAffiliateClick({
      affiliate_network: "tradetracker",
      affiliate_partner: "Keytrade",
      site: "interesten.be",
      placement: "faq_inline",
    });

    const dl = (window as DataLayerWindow).dataLayer;
    expect(dl).toHaveLength(2);
    expect(dl?.[0]).toEqual({ event: "page_view" });
    expect(dl?.[1]).toMatchObject({
      event: "click_outbound",
      affiliate_partner: "Keytrade",
    });
    expect(dl?.[1]).not.toHaveProperty("sub_id");
  });
});
