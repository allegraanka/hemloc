export const SITE_URL = "https://hemloc.co";
export const SITE_NAME = "Hemloc";
export const SITE_TAGLINE = "Browser tools and utilities";

export const SITE_DESCRIPTION =
  "Free browser tools for foraging weather, stargazing hours, historical lookups, and similar utilities. No account. Data you save stays on your device.";

function organizationJsonLd(): Record<string, unknown> {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rochester",
      addressRegion: "NY",
      addressCountry: "US",
    },
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: organizationJsonLd(),
  };
}

export function utilitiesItemListJsonLd(
  listedTools: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hemloc utilities",
    itemListElement: listedTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${SITE_URL}${tool.path}`,
    })),
  };
}

export function webAppJsonLd(input: {
  name: string;
  path: string;
  description: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    url: `${SITE_URL}${input.path}`,
    description: input.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: organizationJsonLd(),
  };
}

export function articleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.datePublished,
    mainEntityOfPage: `${SITE_URL}${input.path}`,
    author: organizationJsonLd(),
    publisher: organizationJsonLd(),
  };
}
