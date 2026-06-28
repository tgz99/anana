"use client";

import Script from "next/script";
import { useEffect } from "react";
import { GA_ID, META_PIXEL } from "@/lib/config";
import { getSessionId } from "@/lib/session";

export function Analytics() {
  useEffect(() => {
    trackEvent("page_view");
  }, []);

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {META_PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}

export function ScrollDepthTracker() {
  useEffect(() => {
    let fired = false;
    const handler = () => {
      if (fired) return;
      const d = document.documentElement;
      if ((d.scrollTop + d.clientHeight) / d.scrollHeight >= 0.75) {
        fired = true;
        trackEvent("scroll_depth_75");
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return null;
}

export function trackEvent(name: string, params?: Record<string, string>) {
  try {
    if (typeof window === "undefined") return;

    if ((window as any).gtag) {
      (window as any).gtag("event", name, params ?? {});
    }
    if ((window as any).fbq) {
      (window as any).fbq("trackCustom", name, params ?? {});
    }

    const sessionId = getSessionId();
    if (!sessionId) return;

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        source: params?.source ?? null,
        sessionId,
        referrer: document.referrer,
      }),
    }).catch(() => {});
  } catch {}
}
