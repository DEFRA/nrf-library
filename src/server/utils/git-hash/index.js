import { readFileSync } from 'node:fs'

/**
 * Resolve the deployed git hash for the running service.
 *
 * Lifted verbatim from nrf-frontend (and the identical inline copy in
 * nrf-backend's /version route). Reads the GIT_HASH env var first, then the
 * `.git-hash` file written at the app image root by CI, relative to the
 * process working directory.
 *
 * @returns {string} the git hash, or 'unknown' when neither source is
 * available
 */
export function getGitHash() {
  if (process.env.GIT_HASH) {
    return process.env.GIT_HASH
  }
  try {
    return readFileSync('.git-hash', 'utf-8').trim()
  } catch {
    return 'unknown'
  }
}
