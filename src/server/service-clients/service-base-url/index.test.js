import { serviceBaseUrl } from './index.js'

describe('#serviceBaseUrl', () => {
  it('should return the configured URL when set', () => {
    expect(
      serviceBaseUrl({
        configuredUrl: 'https://custom.example.com',
        serviceName: 'cdp-uploader',
        localhostPort: 7337,
        environment: 'dev'
      })
    ).toBe('https://custom.example.com')
  })

  it('should derive the CDP internal domain from the environment', () => {
    expect(
      serviceBaseUrl({
        serviceName: 'cdp-uploader',
        localhostPort: 7337,
        environment: 'dev'
      })
    ).toBe('https://cdp-uploader.dev.cdp-int.defra.cloud')
  })

  it('should fall back to localhost when no config URL and no environment', () => {
    expect(
      serviceBaseUrl({
        serviceName: 'nrf-impact-assessor',
        localhostPort: 8085,
        environment: undefined
      })
    ).toBe('http://localhost:8085')
  })

  it('should default the environment from process.env.ENVIRONMENT', () => {
    process.env.ENVIRONMENT = 'preprod'

    expect(
      serviceBaseUrl({ serviceName: 'cdp-uploader', localhostPort: 7337 })
    ).toBe('https://cdp-uploader.preprod.cdp-int.defra.cloud')

    delete process.env.ENVIRONMENT
  })
})
