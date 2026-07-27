/* ------------------------------------------------------------------ *
 * Stat-tile marks — Streamline "Plump" free set (CC BY 4.0, attribution
 * owed, same as the composer's file-type badges), gradient-filled.
 *
 * The geometry is the open-source Plump set as shipped in
 * @iconify-json/streamline-plump-color. Streamline's own Plump *Gradient*
 * SVGs aren't reachable from this environment (the download API sits
 * behind the egress proxy), so the gradient treatment is applied here:
 * each icon's light layer runs from a pale step of its stat's hue down to
 * the hue, and the dark layer from the hue into its shadow — the same
 * two-layer construction the Plump Gradient style uses, on the same
 * shapes, in this app's validated stat hues.
 *
 * GENERATED: the fills are a find-and-replace over the set's two flat
 * colours (#8fbffa light, #2859c5 dark). Regenerate rather than
 * hand-editing paths.
 * ------------------------------------------------------------------ */
"use client";

import { useId } from "react";

function Glyph({ size, body, light, dark }: { size: number; body: string; light: [string, string]; dark: [string, string] }) {
  const id = useId();
  // useId's ":" is invalid inside url(#...) references.
  const key = id.replace(/[^a-zA-Z0-9_-]/g, "");
  const html =
    '<defs>' +
    '<linearGradient id="' + key + 'l" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="' + light[0] + '"/><stop offset="1" stop-color="' + light[1] + '"/>' +
    '</linearGradient>' +
    '<linearGradient id="' + key + 'd" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="' + dark[0] + '"/><stop offset="1" stop-color="' + dark[1] + '"/>' +
    '</linearGradient>' +
    '</defs>' +
    body.replaceAll("#8fbffa", "url(#" + key + "l)").replaceAll("#2859c5", "url(#" + key + "d)");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Plump "trending-content"
const BODY_FIRE = "<g fill=\"none\" stroke-width=\"3\"><path fill=\"#8fbffa\" d=\"M26.306 3.06c-1.096-.305-2.036.637-2.096 1.773c-.137 2.627-.65 5.565-2.07 7.495c-.685.932-2.01 1.158-2.832.344c-.909-.9-1.611-2.302-2.148-3.807c-.474-1.332-2.078-1.952-3.182-1.068c-5.405 4.327-10.98 10.954-10.98 19.88c0 11.96 9.403 17.325 21.002 17.325s21.002-5.365 21.002-17.325c0-12.222-10.452-20.133-16.609-23.733a8.8 8.8 0 0 0-2.087-.885\"/><path fill=\"#fff\" d=\"M23.273 23.332a1.64 1.64 0 0 1 1.454 0C26.698 24.301 32 27.39 32 32.6c0 4.418-3.582 6.4-8 6.4s-8-1.982-8-6.4c0-5.21 5.302-8.3 7.273-9.268\"/><path stroke=\"#2859c5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M26.306 3.06c-1.096-.305-2.036.637-2.095 1.773c-.137 2.627-.65 5.565-2.07 7.495c-.685.932-2.01 1.158-2.832.344c-.91-.9-1.612-2.302-2.148-3.807c-.475-1.332-2.078-1.952-3.183-1.068c-5.405 4.327-10.98 10.954-10.98 19.88c0 11.96 9.403 17.325 21.002 17.325c11.6 0 21.002-5.365 21.002-17.325c0-12.222-10.451-20.133-16.608-23.733a8.8 8.8 0 0 0-2.088-.885\"/><path stroke=\"#2859c5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M23.273 23.332a1.64 1.64 0 0 1 1.454 0C26.698 24.301 32 27.39 32 32.6c0 4.418-3.582 6.4-8 6.4s-8-1.982-8-6.4c0-5.21 5.302-8.3 7.273-9.268\"/></g>";
export function FireGlyph({ size = 28 }: { size?: number }) {
  return <Glyph size={size} body={BODY_FIRE} light={["#f6bba4","#ed7748"] as [string, string]} dark={["#eb6834","#994422"] as [string, string]} />;
}

// Plump "calendar-mark"
const BODY_CALENDAR = "<g fill=\"none\" stroke-width=\"3\"><path fill=\"#fff\" d=\"M3.859 39.973c.315 2.196 1.993 3.851 4.192 4.144c3.13.418 8.38.899 15.949.899s12.818-.481 15.949-.899c2.199-.293 3.877-1.948 4.192-4.144c.408-2.844.859-7.368.859-13.457s-.451-10.614-.859-13.458c-.315-2.196-1.993-3.85-4.192-4.144c-3.13-.417-8.38-.898-15.949-.898s-12.818.48-15.949.898c-2.199.293-3.877 1.948-4.192 4.144C3.451 15.902 3 20.426 3 26.516s.451 10.613.859 13.457\"/><path stroke=\"#2859c5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M11.003 8.578c-1.137.11-2.12.225-2.952.336c-2.199.293-3.877 1.948-4.192 4.144C3.451 15.902 3 20.427 3 26.516s.451 10.614.859 13.458c.315 2.196 1.993 3.85 4.192 4.144c3.13.417 8.38.898 15.949.898s12.818-.481 15.949-.898c2.199-.294 3.877-1.948 4.192-4.144c.408-2.844.859-7.369.859-13.458s-.451-10.614-.859-13.458c-.315-2.196-1.993-3.85-4.192-4.144a82 82 0 0 0-2.952-.336M29 8.09a164 164 0 0 0-5-.074q-2.693.002-5 .074M22 25h4m6 0h4m-20 0h-4m10 10h4m6 0h4m-20 0h-4\"/><path fill=\"#8fbffa\" d=\"M11.013 9.27c.043 2.08 1.409 3.694 3.489 3.726a33 33 0 0 0 .996 0c2.08-.032 3.446-1.646 3.489-3.726a61 61 0 0 0 0-2.54c-.043-2.08-1.409-3.694-3.489-3.726a32 32 0 0 0-.996 0c-2.08.032-3.446 1.646-3.489 3.726a61 61 0 0 0 0 2.54m18 0c.043 2.08 1.409 3.694 3.489 3.726a33 33 0 0 0 .996 0c2.08-.032 3.446-1.646 3.489-3.726a61 61 0 0 0 0-2.54c-.043-2.08-1.409-3.694-3.489-3.726a32 32 0 0 0-.996 0c-2.08.032-3.446 1.646-3.489 3.726a61 61 0 0 0 0 2.54\"/><path stroke=\"#2859c5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M11.013 9.27c.043 2.08 1.409 3.694 3.489 3.726a33 33 0 0 0 .996 0c2.08-.032 3.446-1.646 3.489-3.726a61 61 0 0 0 0-2.54c-.043-2.08-1.409-3.694-3.489-3.726a32 32 0 0 0-.996 0c-2.08.032-3.446 1.646-3.489 3.726a61 61 0 0 0 0 2.54m18 0c.043 2.08 1.409 3.694 3.489 3.726a33 33 0 0 0 .996 0c2.08-.032 3.446-1.646 3.489-3.726a61 61 0 0 0 0-2.54c-.043-2.08-1.409-3.694-3.489-3.726a32 32 0 0 0-.996 0c-2.08.032-3.446 1.646-3.489 3.726a61 61 0 0 0 0 2.54\"/></g>";
export function CalendarGlyph({ size = 28 }: { size?: number }) {
  return <Glyph size={size} body={BODY_CALENDAR} light={["#9fc2ed","#3f86da"] as [string, string]} dark={["#2a78d6","#1b4e8b"] as [string, string]} />;
}

// Plump "check-thick"
const BODY_CHECK = "<g fill=\"none\" fill-rule=\"evenodd\" stroke-width=\"3\" clip-rule=\"evenodd\"><path fill=\"#8fbffa\" d=\"M43.696 9.135c.98 1.336.762 3.135-.15 4.518c-8.535 12.93-14.682 20.785-18.083 24.85c-1.687 2.015-4.617 2.163-6.525.354A165 165 0 0 1 4.955 23.794c-1.21-1.483-1.46-3.576-.282-5.085c1.024-1.312 2.193-2.438 3.25-3.33c1.753-1.48 4.284-1.144 5.86.524c4.863 5.152 7.794 8.75 7.794 8.75s4.818-7.04 12.548-17.87c1.197-1.677 3.33-2.458 5.132-1.459c1.447.803 3.129 2.025 4.439 3.81Z\"/><path stroke=\"#2859c5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M43.696 9.135c.98 1.336.762 3.135-.15 4.518c-8.535 12.93-14.682 20.785-18.083 24.85c-1.687 2.015-4.617 2.163-6.525.354A165 165 0 0 1 4.955 23.794c-1.21-1.483-1.46-3.576-.282-5.085c1.024-1.312 2.193-2.438 3.25-3.33c1.753-1.48 4.284-1.144 5.86.524c4.863 5.152 7.794 8.75 7.794 8.75s4.818-7.04 12.548-17.87c1.197-1.677 3.33-2.458 5.132-1.459c1.447.803 3.129 2.025 4.439 3.81Z\"/></g>";
export function CheckGlyph({ size = 28 }: { size?: number }) {
  return <Glyph size={size} body={BODY_CHECK} light={["#97c1af","#2e835f"] as [string, string]} dark={["#17754d","#0f4c32"] as [string, string]} />;
}

// Plump "star-medal"
const BODY_MEDAL = "<g fill=\"none\" stroke-width=\"3\"><path fill=\"#fff\" d=\"M24 3c-7 0-10 1-10 1v.491c.014.033 1.707 4.066 4.599 9.668C19.964 14.064 21.727 14 24 14s4.036.064 5.401.16C32.304 8.533 34 4.49 34 4.49V4s-3-1-10-1\"/><path fill=\"#8fbffa\" d=\"M35.462 29.438c4.05-4.593 7.256-9.086 8.702-11.194c.536-.782.655-1.774.255-2.634C41.15 8.588 34 4 34 4s-3.337 7.957-8.663 17.074c4.793.53 8.735 3.886 10.125 8.364M3.836 18.244c-.536-.782-.655-1.774-.255-2.634C6.85 8.588 14 4 14 4s3.337 7.957 8.663 17.074c-4.794.531-8.735 3.886-10.126 8.364c-4.05-4.593-7.255-9.086-8.7-11.194Z\"/><path fill=\"#fff\" d=\"M12 33a12 12 0 1 0 24 0a12 12 0 1 0-24 0\"/><path fill=\"#8fbffa\" d=\"M22.89 26.64a1.25 1.25 0 0 1 2.22 0l1.51 2.912l3.22.634a1.25 1.25 0 0 1 .688 2.062l-2.288 2.545l.42 3.395a1.25 1.25 0 0 1-1.8 1.272L24 38.032l-2.86 1.428a1.25 1.25 0 0 1-1.799-1.272l.42-3.395l-2.289-2.545a1.25 1.25 0 0 1 .688-2.062l3.22-.634l1.51-2.913Z\"/><path stroke=\"#2859c5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M14 4s3-1 10-1s10 1 10 1M18.845 14.143A81 81 0 0 1 24 14c2.139 0 3.826.056 5.155.143M12 33a12 12 0 1 0 24 0a12 12 0 1 0-24 0\"/><path stroke=\"#2859c5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M35.462 29.438c4.05-4.593 7.256-9.086 8.702-11.194c.536-.782.655-1.774.255-2.634C41.15 8.588 34 4 34 4s-3.337 7.957-8.663 17.074m-2.674 0C17.337 11.957 14 4 14 4S6.85 8.588 3.58 15.61c-.4.86-.281 1.852.255 2.634c1.446 2.108 4.651 6.6 8.701 11.194M22.89 26.64a1.25 1.25 0 0 1 2.22 0l1.51 2.912l3.22.634a1.25 1.25 0 0 1 .688 2.062l-2.288 2.545l.419 3.395a1.25 1.25 0 0 1-1.799 1.272L24 38.032l-2.86 1.428a1.25 1.25 0 0 1-1.8-1.272l.42-3.395l-2.288-2.545a1.25 1.25 0 0 1 .688-2.062l3.22-.634l1.51-2.913Z\"/></g>";
export function MedalGlyph({ size = 28 }: { size?: number }) {
  return <Glyph size={size} body={BODY_MEDAL} light={["#aea6d7","#5c4eb0"] as [string, string]} dark={["#4a3aa7","#30266d"] as [string, string]} />;
}
