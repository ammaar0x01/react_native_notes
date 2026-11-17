/**
 * Vercel Analytics is web-only. On native, rendering its component crashes
 * because it expects `document` to exist, so this no-op keeps the app safe.
 */
export function Analytics() {
  return null;
}
