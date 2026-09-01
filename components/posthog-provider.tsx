'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        capture_pageleave: true, // Enable pageleave capture
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') console.log('PostHog loaded');
        }
      });
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export function PostHogPageView(): null {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const utmProperties = Object.fromEntries(
        ['source', 'medium', 'campaign', 'term', 'content']
          .map((key) => [`$utm_${key}`, params.get(`utm_${key}`)])
          .filter(([, value]) => value !== null)
      );

      posthog.capture('$pageview', utmProperties);
    }
  }, []);

  return null;
} 
