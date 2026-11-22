const allowedTypes = [
  'education',
  'experience',
  'project',
  'skills',
  'other',
]

function validateResumeSection({ sectionType, content, displayOrder }) {
  const errors = {}

  if (!allowedTypes.includes(sectionType)) {
    errors.sectionType = 'Choose a valid resume section type'
  }

  if (typeof content !== 'string' || content.trim().length < 2) {
    errors.content = 'Section content must contain at least 2 characters'
  }

  if (
    displayOrder !== undefined &&
    (!Number.isInteger(displayOrder) || displayOrder < 0)
  ) {
    errors.displayOrder = 'Display order must be a non-negative integer'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

module.exports = {
  validateResumeSection,
}
