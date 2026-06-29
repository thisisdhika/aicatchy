"use client";

import posthog from 'posthog-js';

declare global {
  interface Window {
    posthog?: typeof posthog;
  }
}

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  window.posthog = posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
  });
}
