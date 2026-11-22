function validateResume({ title, summary, rawText }) {
  const errors = {}

  if (typeof title !== 'string' || title.trim().length < 2) {
    errors.title = 'Resume title must contain at least 2 characters'
  }

  if (typeof rawText !== 'string' || rawText.trim().length < 20) {
    errors.rawText = 'Resume text must contain at least 20 characters'
  }

  if (summary !== undefined && summary !== null && typeof summary !== 'string') {
    errors.summary = 'Summary must be text'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

module.exports = {
  validateResume,
}
