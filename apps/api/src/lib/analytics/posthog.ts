import { PostHog } from 'posthog-node';

let client: PostHog | null = null;

export function initPosthog() {
  const key = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST || 'https://app.posthog.com';

  if (!key) {
    console.warn('POSTHOG_API_KEY not provided, analytics disabled');
    return;
  }

  client = new PostHog(key, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });

  console.log('PostHog server analytics initialized');
}

export function capture(event: string, distinctId: string, properties?: Record<string, unknown>) {
  if (!client) return;
  client.capture({ event, distinctId, properties });
}

export async function shutdown() {
  if (client) {
    await client.shutdown();
    client = null;
  }
}
