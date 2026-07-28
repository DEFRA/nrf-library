// Single source of truth for boundary-check failure codes, shared between
// nrf-frontend and nrf-backend (the Python nrf-impact-assessor duplicates
// these as string literals — it can't consume an npm package — so keep the
// two in sync by hand if a code is added, renamed, or removed here).
//
// The frontend owns all user-facing copy and GTM `failure_reason` values
// derived from these codes; backend/impact-assessor emit the code only, no
// display prose, so wording can change without touching another service.
//
// UPLOAD holds codes that can only occur for a file upload (size limits,
// zip/filename validation, CDP Uploader rejection). GEOMETRY holds codes
// that can occur for either an uploaded file or a hand-drawn boundary, since
// both flows go through the same impact-assessor geometry validation.
// SERVICE holds network/infrastructure failures.
export const BOUNDARY_ERRORS = {
  UPLOAD: {
    FILE_SIZE_TOO_LARGE: 'file_size_too_large',
    ZIP_ENTRY_TOO_LARGE: 'zip_entry_too_large',
    ZIP_TOTAL_TOO_LARGE: 'zip_total_too_large',
    UPLOAD_NOT_READY: 'upload_not_ready',
    UPLOAD_FILE_MISSING: 'upload_file_missing',
    UPLOAD_STATUS_CHECK_FAILED: 'upload_status_check_failed',
    S3_DOWNLOAD_FAILED: 's3_download_failed',
    UNSAFE_FILENAME: 'unsafe_filename',
    INVALID_ZIP: 'invalid_zip',
    ZIP_TOO_MANY_FILES: 'zip_too_many_files',
    ZIP_NESTED_ZIP: 'zip_nested_zip',
    ZIP_UNSAFE_PATH: 'zip_unsafe_path',
    ZIP_MISSING_SHAPEFILE: 'zip_missing_shapefile',
    ZIP_MISSING_SHAPEFILE_PARTS: 'zip_missing_shapefile_parts',
    BOUNDARY_FILE_NOT_FOUND_IN_ZIP: 'boundary_file_not_found_in_zip',
    ZIP_AMBIGUOUS_FILENAME: 'zip_ambiguous_filename',
    UNSUPPORTED_FILE_TYPE: 'unsupported_file_type',
    UNREADABLE_GEOMETRY_FILE: 'unreadable_geometry_file',
    FILE_CONTAINS_VIRUS: 'file_contains_virus',
    FILE_REJECTED_BY_UPLOADER: 'file_rejected_by_uploader',
    UNSUPPORTED_CRS: 'unsupported_crs',
    MISSING_CRS: 'missing_crs'
  },
  GEOMETRY: {
    INVALID_GEOMETRY: 'invalid_geometry',
    UNSUPPORTED_GEOMETRY_TYPE: 'unsupported_geometry_type',
    SELF_INTERSECTING: 'self_intersecting_geometry',
    HAS_HOLES: 'geometry_has_holes',
    DUPLICATE_VERTICES: 'duplicate_vertices',
    UNCLOSED_RING: 'unclosed_ring',
    NO_POLYGON_FOUND: 'no_polygon_found'
  },
  SERVICE: {
    IMPACT_ASSESSOR_UNREACHABLE: 'impact_assessor_unreachable',
    IMPACT_ASSESSOR_BAD_RESPONSE: 'impact_assessor_bad_response',
    CHECK_FAILED: 'boundary_check_failed'
  }
}

// Flat set of every known code, for validating a code received over the
// wire before trusting it.
export const KNOWN_BOUNDARY_ERROR_CODES = new Set(
  Object.values(BOUNDARY_ERRORS).flatMap((group) => Object.values(group))
)

// Codes for files rejected before any geometry is parsed (CDP Uploader
// rejections). The frontend sends the user back to the upload page to retry,
// rather than to the boundary preview page which has no geometry to show.
export const UPLOAD_REJECTION_CODES = new Set([
  BOUNDARY_ERRORS.UPLOAD.FILE_SIZE_TOO_LARGE,
  BOUNDARY_ERRORS.UPLOAD.FILE_CONTAINS_VIRUS,
  BOUNDARY_ERRORS.UPLOAD.FILE_REJECTED_BY_UPLOADER
])
