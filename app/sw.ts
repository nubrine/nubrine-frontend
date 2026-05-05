
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
  Serwist,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // 1. API calls → never cache
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/"),
      handler: new NetworkOnly(),
    },

    // 2. Pages (HTML navigation)
    {
      matcher: ({ request }) => request.mode === "navigate",
      handler: new NetworkFirst({
        cacheName: "pages",
      }),
    },

    // 3. Static assets
    {
      matcher: ({ request }) =>
        ["script", "style", "image"].includes(request.destination),
      handler: new StaleWhileRevalidate({
        cacheName: "assets",
      }),
    },
  ],
});

serwist.addEventListeners();



