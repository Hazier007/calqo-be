import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const trackMock = vi.fn();
vi.mock("@calqo/analytics", () => ({
  trackAffiliateClick: (...args: unknown[]) => trackMock(...args),
}));

import { AffiliateInlineLink } from "../AffiliateInlineLink.js";

beforeEach(() => {
  trackMock.mockReset();
});

describe("<AffiliateInlineLink>", () => {
  const baseProps = {
    network: "tradetracker" as const,
    partner: "Keytrade Bank",
    trackingUrl: "https://example.invalid/tt?ref=keytrade",
    site: "interesten.be",
    placement: "faq_inline",
    subId: "interesten_faq_202604",
  };

  it("renders children inside an anchor with proper rel + target", () => {
    render(
      <AffiliateInlineLink {...baseProps}>
        open een Keytrade Bolero rekening
      </AffiliateInlineLink>,
    );
    const link = screen.getByRole("link", { name: "open een Keytrade Bolero rekening" });
    expect(link).toHaveAttribute("href", baseProps.trackingUrl);
    expect(link).toHaveAttribute("rel", "sponsored nofollow noopener");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("fires trackAffiliateClick with the full payload on click", async () => {
    const user = userEvent.setup();
    render(<AffiliateInlineLink {...baseProps}>klik hier</AffiliateInlineLink>);
    await user.click(screen.getByRole("link", { name: "klik hier" }));
    expect(trackMock).toHaveBeenCalledWith({
      affiliate_network: "tradetracker",
      affiliate_partner: "Keytrade Bank",
      site: "interesten.be",
      placement: "faq_inline",
      sub_id: "interesten_faq_202604",
    });
  });
});
