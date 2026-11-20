/**
 * AsyncStorage keys shared across the app.
 *
 * Keep these in one place so pages always read and write the same entries.
 */
export const STORAGE_KEYS = {
  notes: "@notes_app_data",
  profile: "@user_profile",
} as const;
