import type { MouseEvent, ReactNode } from "react";
import { trackAffiliateClick, type AffiliateNetwork } from "@calqo/analytics";

export interface AffiliateInlineLinkProps {
  network: AffiliateNetwork;
  partner: string;
  trackingUrl: string;
  site: string;
  placement: string;
  subId?: string;
  className?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function AffiliateInlineLink({
  network,
  partner,
  trackingUrl,
  site,
  placement,
  subId,
  className,
  children,
  onClick,
}: AffiliateInlineLinkProps) {
  const classes = ["calqo-affiliate-inline", className].filter(Boolean).join(" ");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackAffiliateClick({
      affiliate_network: network,
      affiliate_partner: partner,
      site,
      placement,
      sub_id: subId,
    });
    onClick?.(event);
  };

  return (
    <a
      className={classes}
      href={trackingUrl}
      rel="sponsored nofollow noopener"
      target="_blank"
      onClick={handleClick}
      data-affiliate-network={network}
      data-affiliate-partner={partner}
    >
      {children}
    </a>
  );
}
