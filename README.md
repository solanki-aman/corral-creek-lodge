# Corral Creek Lodge

An independent redesign preview for Corral Creek Lodge in Kernville, California. The existing production website, domain, hosting, and reservations remain unchanged.

## Run locally

Requires Node 22.13 or newer.

```sh
npm ci
npm run dev
```

Open the local address printed by the development server. Use `npm run build` for the deployment build and `npx tsc --noEmit` for type checking.

## Experience

- Compact photographic arrival, four room choices at a glance, and an interactive field-guide map derived from the actual drone photograph.
- No scroll zoom or pinned scroll sequences. Native landmark buttons, a place-list alternative, reduced motion, and a saved motion preference.
- Room index and detail pages, filterable destination guide, interactive Kernville field guide, keyboard-operable photo lightbox, FAQs, directions and contact links.
- Booking buttons open a clearly labeled handoff to the **live** existing ResNexus system. No simulated prices or inventory. No test reservations have been made.
- Preview is marked noindex/nofollow. Contact uses real telephone/email links; no fake contact submission success states.

## Shared foundation for a future app

`lib/content.ts` contains reusable structured rooms, destination entries, gallery records and booking configuration. Visual tokens live in `app/globals.css`. Booking and site navigation are separate components. A future native application can reuse content and branding; direct reservation APIs require verification with ResNexus.

## Production launch gates

This is a preview, not a replacement for the current business site. Before production: verify current content and room features with the owner; confirm media rights; test booking through an agreed provider-supported process; manually audit accessibility with keyboard and screen readers on real desktop and mobile devices; verify external social profiles, policies and contacts; add redirects for all legacy pages; configure production metadata, search indexing, analytics and confirmed booking measurement; retain the old site and a rollback plan.

## Local content

The `/api/local-info` endpoint retrieves NWS forecasts and upcoming public Kern Valley Events listings, with seven-second source timeouts, independent failure handling, and a 15-minute cache. Events use public HTML microdata because the published RSS feed is currently empty; source markup changes may require updating the parser. No external markup is rendered. The unreliable Facebook embed has been removed. Instagram’s public profile was verified, but no public post feed was available without an authorized integration, so the website links to the profile rather than presenting fake posts. The guestbook contains all 16 reviewer summaries (not full quotations), credited to their original platforms, with original-source links.

## Photography

Lodge images are from the existing Corral Creek website, reused at the owner's request. Downtown Kernville is an archival 2007 public-domain photograph by Jpgordon from Wikimedia Commons. See `/credits`. Do not interpret photographic depiction of a business as verification of its current operation. The featured room photos have light AI-assisted retouching; unedited originals remain alongside them. The illustrated map is derived from the original drone view, with a toggle to the original photograph. The social card is AI-generated graphic artwork.

No secret keys or booking/customer records are stored in this repository.
