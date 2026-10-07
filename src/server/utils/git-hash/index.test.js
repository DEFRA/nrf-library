import { rmSync, writeFileSync } from 'node:fs'

import { getGitHash } from './index.js'

describe('#getGitHash', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should return the GIT_HASH env var when set', () => {
    vi.stubEnv('GIT_HASH', 'env-hash-123')

    expect(getGitHash()).toBe('env-hash-123')
  })

  it('should return "unknown" when GIT_HASH is unset and no .git-hash file exists', () => {
    vi.stubEnv('GIT_HASH', '')

    expect(getGitHash()).toBe('unknown')
  })

  describe('When GIT_HASH is unset and a .git-hash file exists', () => {
    beforeEach(() => {
      writeFileSync('.git-hash', 'file-hash-456')
    })

    afterEach(() => {
      rmSync('.git-hash')
    })

    it('should return the .git-hash file contents', () => {
      vi.stubEnv('GIT_HASH', '')

      expect(getGitHash()).toBe('file-hash-456')
    })
  })
})
