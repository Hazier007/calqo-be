import type { MouseEvent, ReactNode } from "react";
import { trackAffiliateClick, type AffiliateNetwork } from "@calqo/analytics";

const DEFAULT_DISCLOSURE =
  "Als je via deze link afsluit, ontvangen we mogelijk een commissie. Dat kost jou niets extra en beïnvloedt onze rangschikking niet.";

export interface AffiliateCardProps {
  network: AffiliateNetwork;
  partner: string;
  trackingUrl: string;
  offerText: ReactNode;
  ctaLabel: string;
  site: string;
  placement: string;
  disclosure?: ReactNode;
  subId?: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function AffiliateCard({
  network,
  partner,
  trackingUrl,
  offerText,
  ctaLabel,
  site,
  placement,
  disclosure = DEFAULT_DISCLOSURE,
  subId,
  className,
  onClick,
}: AffiliateCardProps) {
  const classes = ["calqo-affiliate-card", className].filter(Boolean).join(" ");

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
    <article className={classes} data-affiliate-network={network} data-affiliate-partner={partner}>
      <div className="calqo-affiliate-card__partner">{partner}</div>
      <p className="calqo-affiliate-card__offer">{offerText}</p>
      <a
        className="calqo-affiliate-card__cta"
        href={trackingUrl}
        rel="sponsored nofollow noopener"
        target="_blank"
        onClick={handleClick}
      >
        {ctaLabel}
      </a>
      <p className="calqo-affiliate-card__disclosure">{disclosure}</p>
    </article>
  );
}
