function validateJob({
  title,
  company,
  location,
  description,
  sourceUrl,
}) {
  const errors = {}

  if (typeof title !== 'string' || title.trim().length < 2) {
    errors.title = 'Job title must contain at least 2 characters'
  }

  if (typeof company !== 'string' || company.trim().length < 2) {
    errors.company = 'Company name must contain at least 2 characters'
  }

  if (
    location !== undefined &&
    location !== null &&
    typeof location !== 'string'
  ) {
    errors.location = 'Location must be text'
  }

  if (typeof description !== 'string' || description.trim().length < 20) {
    errors.description =
      'Job description must contain at least 20 characters'
  }

  if (
    sourceUrl !== undefined &&
    sourceUrl !== null &&
    sourceUrl.trim().length > 0
  ) {
    try {
      const parsedUrl = new URL(sourceUrl)

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        errors.sourceUrl = 'Source URL must use HTTP or HTTPS'
      }
    } catch {
      errors.sourceUrl = 'Enter a valid source URL'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

module.exports = {
  validateJob,
}
