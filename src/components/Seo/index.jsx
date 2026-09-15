import { useEffect } from "react";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
  DEFAULT_ROBOTS,
  DEFAULT_TITLE,
  NOINDEX_ROBOTS,
  SITE_NAME,
  SITE_URL,
} from "../../constants";

/* ------------------------------------------------------------------
 * Tiny zero-dependency SEO manager for this React + Vite SPA.
 *
 * Why not react-helmet-async? It is not installed and its peer
 * dependencies target React 16-18, while this project runs React 19.
 * Writing ~80 lines here keeps the bundle small and avoids installing
 * a dependency that may need --legacy-peer-deps.
 *
 * Usage:
 *   <Seo
 *     title="Student Login | UAF Notes Sharing App"
 *     description="..."
 *     path="/auth/login"
 *     noindex
 *   />
 * ------------------------------------------------------------------ */

const ROBOTS_DEFAULT = DEFAULT_ROBOTS;

const upsertMeta = (attr, key, content) => {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    tag.setAttribute("data-seo", "true");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const upsertCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("data-seo", "true");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

/* Only the dynamic script is touched here. The site-wide graph lives
 * in index.html with the id "site-structured-data" and is never removed. */
const upsertStructuredData = (data) => {
  const existing = document.getElementById("page-structured-data");
  if (!data) {
    if (existing) existing.remove();
    return;
  }
  const script = existing || document.createElement("script");
  script.id = "page-structured-data";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(script);
};

const applySeo = ({
  title,
  description,
  path,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  type,
  noindex,
  structuredData,
}) => {
  const url = new URL(path || "/", SITE_URL).toString();

  document.title = title;
  upsertMeta("name", "description", description);
  upsertMeta("name", "robots", noindex ? NOINDEX_ROBOTS : ROBOTS_DEFAULT);

  /* Open Graph - used by Facebook, WhatsApp, LinkedIn, Discord... */
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:locale", "en_US");
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:image:secure_url", image);
  upsertMeta("property", "og:image:type", "image/png");
  upsertMeta("property", "og:image:width", String(imageWidth));
  upsertMeta("property", "og:image:height", String(imageHeight));
  upsertMeta("property", "og:image:alt", imageAlt);

  /* Twitter / X card */
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", image);
  upsertMeta("name", "twitter:image:alt", imageAlt);

  /* Private pages must not advertise a canonical for indexing. */
  if (noindex) {
    const link = document.head.querySelector('link[rel="canonical"]');
    if (link) link.remove();
  } else {
    upsertCanonical(url);
  }

  upsertStructuredData(structuredData);
};

const DEFAULT_SEO = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  image: DEFAULT_OG_IMAGE,
  imageAlt: DEFAULT_OG_IMAGE_ALT,
  imageWidth: DEFAULT_OG_IMAGE_WIDTH,
  imageHeight: DEFAULT_OG_IMAGE_HEIGHT,
  type: "website",
  noindex: false,
  structuredData: null,
};

const Seo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  imageWidth = DEFAULT_OG_IMAGE_WIDTH,
  imageHeight = DEFAULT_OG_IMAGE_HEIGHT,
  type = "website",
  noindex = false,
  structuredData = null,
}) => {
  useEffect(() => {
    applySeo({
      title,
      description,
      path,
      image,
      imageAlt,
      imageWidth,
      imageHeight,
      type,
      noindex,
      structuredData,
    });

    /* Restore the homepage defaults when leaving the page, so an
     * unmounted route can never leave stale private metadata behind. */
    return () => applySeo(DEFAULT_SEO);
  }, [
    title,
    description,
    path,
    image,
    imageAlt,
    imageWidth,
    imageHeight,
    type,
    noindex,
    structuredData,
  ]);

  return null;
};

export default Seo;
