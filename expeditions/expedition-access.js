import { isDevUnlockProfile } from "../wm-entitlement.js";

export function canAccessExpeditions(profile) {
  return isDevUnlockProfile(profile);
}
