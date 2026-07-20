// Maximum boundary file upload size, in MB. This is a fixed product decision
// (not an env-specific value) enforced identically by nrf-backend (rejecting
// the upload) and displayed by nrf-frontend (upload page copy), so it lives
// here as a single shared constant rather than being duplicated or
// configured separately in each service.
export const MAX_BOUNDARY_FILE_SIZE_MB = 2
