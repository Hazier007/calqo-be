import { describe, expect, it } from "vitest";
import { buildSubId } from "../buildSubId.js";

describe("buildSubId", () => {
  it("formats {site}_{placement}_{yyyymm} with provided date", () => {
    expect(
      buildSubId({
        site: "goedkoopstroom.be",
        placement: "result_card",
        date: new Date(Date.UTC(2026, 3, 15)),
      }),
    ).toBe("goedkoopstroom_result_card_202604");
  });

  it("strips TLD and lowercases site, normalises placement separators", () => {
    expect(
      buildSubId({
        site: "Registratiekosten.BE",
        placement: "FAQ Inline",
        date: new Date(Date.UTC(2026, 0, 1)),
      }),
    ).toBe("registratiekosten_faq_inline_202601");
  });

  it("zero-pads single-digit months", () => {
    expect(
      buildSubId({
        site: "interesten.be",
        placement: "result_card",
        date: new Date(Date.UTC(2026, 8, 30)),
      }),
    ).toBe("interesten_result_card_202609");
  });

  it("defaults to current month when no date is provided", () => {
    const subId = buildSubId({ site: "huurrendementcalculator.be", placement: "result_card" });
    expect(subId).toMatch(/^huurrendementcalculator_result_card_\d{6}$/);
  });
});
