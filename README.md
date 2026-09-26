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

- The home page opens on a treasure map drawn over the real drone photograph: an inked trail, an X on the lodge, and six field-note stops that pan the map. Toggle between map ink and true color.
- A Corral Creek logo (peaks, a low sun and the Kern), used in the header, footer, favicon and a rotating badge. The map tour advances on its own with a progress ring and a Pause tour control.
- Scroll-driven scenes (CSS `animation-timeline`): the map pushes in as you leave it, a postcard of the welcome arch rises in, develops like an instant print, gets postmarked and flips to a handwritten note, and room cards deal in. Browsers without support, and motion off, get still panels.
- The valley chapter is an illustrated map traced from OpenStreetMap data (river, Mountain Highway 99, Sierra Way and downtown streets) with an enlarged downtown inset, pins for food, events and outdoors, and a car that drives the route as you scroll.
- Three more one-screen chapters: all four room types side by side with room counts, sizes and numbers; a tabbed valley ledger (food, live and annual events, outdoors); and a sideways guest register with every original review.
- No scroll zoom or pinned scroll sequences. Native landmark buttons, a place-list alternative, reduced motion, and a saved motion preference.
- Room index and detail pages, filterable destination guide, interactive Kernville field guide, keyboard-operable photo lightbox, FAQs, directions and contact links.
- Booking buttons open a clearly labeled handoff to the **live** existing ResNexus system. No simulated prices or inventory. No test reservations have been made.
- Preview is marked noindex/nofollow. Contact uses real telephone/email links; no fake contact submission success states.

## Shared foundation for a future app

`lib/content.ts` contains reusable structured rooms, destination entries, gallery records and booking configuration. Visual tokens live in `app/globals.css`. Booking and site navigation are separate components. A future native application can reuse content and branding; direct reservation APIs require verification with ResNexus.

## Production launch gates

This is a preview, not a replacement for the current business site. Before production: verify current content and room features with the owner; confirm media rights; test booking through an agreed provider-supported process; manually audit accessibility with keyboard and screen readers on real desktop and mobile devices; verify external social profiles, policies and contacts; add redirects for all legacy pages; configure production metadata, search indexing, analytics and confirmed booking measurement; retain the old site and a rollback plan.

## Local content

The `/api/local-info` endpoint retrieves NWS forecasts and upcoming public Kern Valley Events listings, with seven-second source timeouts, independent failure handling, and a 15-minute cache. Events use public HTML microdata because the published RSS feed is currently empty; source markup changes may require updating the parser. No external markup is rendered. The unreliable Facebook embed has been removed. Instagram’s public profile was verified, but no public post feed was available without an authorized integration, so the website links to the profile rather than presenting fake posts. The guest register reproduces all 16 reviews from the original homepage word for word, credited to their platforms. Food, hours and event dates in `lib/valley.ts` were checked against each source on Sep 26, 2026; past annual events drop off automatically.

## Photography

Lodge images are from the existing Corral Creek website, reused at the owner's request. Downtown Kernville is an archival 2007 public-domain photograph by Jpgordon from Wikimedia Commons. See `/credits`. Do not interpret photographic depiction of a business as verification of its current operation. The featured room photos have light AI-assisted retouching; unedited originals remain alongside them. The illustrated map is derived from the original drone view, with a toggle to the original photograph. The social card is AI-generated graphic artwork.

No secret keys or booking/customer records are stored in this repository.
