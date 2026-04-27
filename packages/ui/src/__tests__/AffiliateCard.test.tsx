import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const trackMock = vi.fn();
vi.mock("@calqo/analytics", () => ({
  trackAffiliateClick: (...args: unknown[]) => trackMock(...args),
}));

import { AffiliateCard } from "../AffiliateCard.js";

beforeEach(() => {
  trackMock.mockReset();
});

describe("<AffiliateCard>", () => {
  const baseProps = {
    network: "daisycon" as const,
    partner: "Mega",
    trackingUrl: "https://example.invalid/track?subid=test",
    offerText: "Vergelijk energieleveranciers",
    ctaLabel: "Bekijk aanbod",
    site: "goedkoopstroom.be",
    placement: "result_card",
    subId: "goedkoopstroom_result_202604",
  };

  it("renders partner, offer text, CTA and default Dutch disclosure", () => {
    render(<AffiliateCard {...baseProps} />);
    expect(screen.getByText("Mega")).toBeInTheDocument();
    expect(screen.getByText("Vergelijk energieleveranciers")).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: "Bekijk aanbod" });
    expect(cta).toHaveAttribute("href", baseProps.trackingUrl);
    expect(screen.getByText(/Als je via deze link afsluit/i)).toBeInTheDocument();
  });

  it("emits sponsored nofollow noopener and target=_blank on the CTA", () => {
    render(<AffiliateCard {...baseProps} />);
    const cta = screen.getByRole("link", { name: "Bekijk aanbod" });
    expect(cta).toHaveAttribute("rel", "sponsored nofollow noopener");
    expect(cta).toHaveAttribute("target", "_blank");
  });

  it("fires trackAffiliateClick with full payload on click", async () => {
    const user = userEvent.setup();
    render(<AffiliateCard {...baseProps} />);
    await user.click(screen.getByRole("link", { name: "Bekijk aanbod" }));
    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith({
      affiliate_network: "daisycon",
      affiliate_partner: "Mega",
      site: "goedkoopstroom.be",
      placement: "result_card",
      sub_id: "goedkoopstroom_result_202604",
    });
  });

  it("forwards the consumer onClick after tracking", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<AffiliateCard {...baseProps} onClick={onClick} />);
    await user.click(screen.getByRole("link", { name: "Bekijk aanbod" }));
    expect(trackMock).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("accepts a custom disclosure", () => {
    render(<AffiliateCard {...baseProps} disclosure="Aangepaste disclosure" />);
    expect(screen.getByText("Aangepaste disclosure")).toBeInTheDocument();
    expect(screen.queryByText(/Als je via deze link afsluit/i)).not.toBeInTheDocument();
  });
});
