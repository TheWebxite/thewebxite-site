import type { Metadata } from "next";

import "@fontsource/open-sauce-one/400.css";
import "@fontsource/open-sauce-one/500.css";
import "@fontsource/open-sauce-one/700.css";
import "./globals.css";

import SmoothScroll from "./components/SmoothScroll";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import StructuredData from "./components/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL("https://thewebxite.com"),
  title: {
    // PLACEHOLDER: written by us, not quoted from the client's deck.
    default: "TheWebxite — Petaling Jaya digital architect",
    template: "%s · TheWebxite",
  },
  // PLACEHOLDER: written by us, not quoted from the client's deck.
  description:
    "We build the brand, the systems, the automation and the growth as one connected stack. Petaling Jaya, Malaysia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* NEITHER CLASS HERE IS COSMETIC — both were causing a second
       scroll container, and the page has exactly one scroller by
       design.

       `overflow-x: clip` RATHER THAN `hidden`. Per CSS Overflow 3, when
       one axis is `visible` and the other is neither `visible` nor
       `clip`, the visible one computes to `auto`. So `overflow-x:
       hidden` here silently made body `overflow-y: auto` — measured,
       not inferred — which is a scroll container nested inside the
       document's own. It is inert only while body's height equals its
       content height; any absolutely-positioned layer hanging below
       body's in-flow bottom gives it a real scroll range, and this
       layout has several such layers at negative z-index. `clip` IS in
       the allowed set, so the y axis stays `visible` and body stays a
       plain box. It clips the same horizontal overflow.

       NO `h-full` ON html. It set `height: 100%`, which is the one
       thing Lenis's own stylesheet exists to override
       (`html.lenis, html.lenis body { height: auto }`) — and that
       stylesheet is not imported, so nothing was correcting it. With
       html's height left to `auto`, the requirement is met by
       construction instead of by an import nobody can see.

       body's floor moved from `min-h-full` to `min-h-screen` in the
       same breath, and it has to: `min-h-full` was a percentage of
       html's 100% height, so dropping that would have resolved it
       against `auto` and left short pages — /news is one viewport tall
       — with a body shorter than the window and the ground not
       reaching the bottom of the screen. */
    <html lang="en">
      <body className="ground-grain min-h-screen overflow-x-clip">
        <StructuredData />
        <SmoothScroll />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
