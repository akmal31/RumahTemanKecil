"use client";

import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  // Initialize Pixel
  useEffect(() => {
    if (!pixelId) return;

    // Standard Meta Pixel Code
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    (window as any).fbq("init", pixelId);
    (window as any).fbq("track", "PageView");
    /* eslint-enable */
  }, [pixelId]);

  // Track page views on route changes
  useEffect(() => {
    if (!pixelId) return;

    if ((window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
  }, [pathname, searchParams, pixelId]);

  // Render noscript fallback if pixelId exists for accessibility and solid tracking fallback
  if (!pixelId) return null;

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        alt="Meta Pixel Tracking"
      />
    </noscript>
  );
}
