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

- Scroll-driven lodge opening with photographic masking and split typography.
- A retouched aerial zoom into the lodge, responsive mobile layouts, reduced-motion defaults and a saved motion preference.
- Room index and detail pages, filterable destination guide, interactive Kernville field guide, keyboard-operable photo lightbox, FAQs, directions and contact links.
- Booking buttons open a clearly labeled handoff to the **live** existing ResNexus system. No simulated prices or inventory. No test reservations have been made.
- Preview is marked noindex/nofollow. Contact uses real telephone/email links; no fake contact submission success states.

## Shared foundation for a future app

`lib/content.ts` contains reusable structured rooms, destination entries, gallery records and booking configuration. Visual tokens live in `app/globals.css`. Booking and site navigation are separate components. A future native application can reuse content and branding; direct reservation APIs require verification with ResNexus.

## Production launch gates

This is a preview, not a replacement for the current business site. Before production: verify current content and room features with the owner; confirm media rights; test booking through an agreed provider-supported process; manually audit accessibility with keyboard and screen readers on real desktop and mobile devices; verify external social profiles, policies and contacts; add redirects for all legacy pages; configure production metadata, search indexing, analytics and confirmed booking measurement; retain the old site and a rollback plan.

## Local content

The `/api/local-info` endpoint retrieves NWS forecasts and upcoming public Kern Valley Events listings, with seven-second source timeouts, independent failure handling, and a 15-minute cache. Events use public HTML microdata because the published RSS feed is currently empty; source markup changes may require updating the parser. No external markup is rendered. Facebook timeline loads only on visitor request and may be blocked by Meta or browser privacy settings. Instagram links to the profile; a custom auto-updating Instagram feed requires an authorized professional account integration. Review excerpts retain original site attribution and do not imply recent review dates.

## Photography

Lodge images are from the existing Corral Creek website, reused at the owner's request. Downtown Kernville is an archival 2007 public-domain photograph by Jpgordon from Wikimedia Commons. See `/credits`. Do not interpret photographic depiction of a business as verification of its current operation. The featured aerial and room photos have light AI-assisted retouching; unedited originals remain alongside them. The social card is AI-generated graphic artwork.

No secret keys or booking/customer records are stored in this repository.
