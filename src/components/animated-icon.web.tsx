/**
 * The animated overlay is only needed on native. On web the static splash
 * screen is handled by the Expo web build, so this is intentionally a no-op.
 */
export function AnimatedSplashOverlay() {
  return null;
}
