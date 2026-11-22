const {
  resumeBelongsToUser,
  listSections,
  createSection,
  updateSection,
  deleteSection,
} = require('../repositories/resumeSectionRepository')
const {
  validateResumeSection,
} = require('../validators/resumeSectionValidator')

async function ownsResume(request, response) {
  const owned = await resumeBelongsToUser(
    request.params.resumeId,
    request.user.id,
  )

  if (!owned) {
    response.status(404).json({
      success: false,
      message: 'Resume not found',
    })
    return false
  }

  return true
}

async function list(request, response) {
  try {
    if (!(await ownsResume(request, response))) return

    const sections = await listSections(request.params.resumeId)
    return response.json({ success: true, data: sections })
  } catch (error) {
    console.error('Resume sections listing failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to list resume sections',
    })
  }
}

async function create(request, response) {
  const validation = validateResumeSection(request.body)

  if (!validation.isValid) {
    return response.status(400).json({
      success: false,
      message: 'Please correct the section fields',
      errors: validation.errors,
    })
  }

  try {
    if (!(await ownsResume(request, response))) return

    const section = await createSection({
      resumeId: request.params.resumeId,
      sectionType: request.body.sectionType,
      content: request.body.content.trim(),
      displayOrder: request.body.displayOrder ?? 0,
    })

    return response.status(201).json({
      success: true,
      message: 'Resume section created successfully',
      data: section,
    })
  } catch (error) {
    console.error('Resume section creation failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to create resume section',
    })
  }
}

async function update(request, response) {
  const validation = validateResumeSection(request.body)

  if (!validation.isValid) {
    return response.status(400).json({
      success: false,
      message: 'Please correct the section fields',
      errors: validation.errors,
    })
  }

  try {
    if (!(await ownsResume(request, response))) return

    const section = await updateSection({
      sectionId: request.params.sectionId,
      resumeId: request.params.resumeId,
      sectionType: request.body.sectionType,
      content: request.body.content.trim(),
      displayOrder: request.body.displayOrder ?? 0,
    })

    if (!section) {
      return response.status(404).json({
        success: false,
        message: 'Resume section not found',
      })
    }

    return response.json({
      success: true,
      message: 'Resume section updated successfully',
      data: section,
    })
  } catch (error) {
    console.error('Resume section update failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to update resume section',
    })
  }
}

async function remove(request, response) {
  try {
    if (!(await ownsResume(request, response))) return

    const section = await deleteSection(
      request.params.sectionId,
      request.params.resumeId,
    )

    if (!section) {
      return response.status(404).json({
        success: false,
        message: 'Resume section not found',
      })
    }

    return response.json({
      success: true,
      message: 'Resume section deleted successfully',
    })
  } catch (error) {
    console.error('Resume section deletion failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to delete resume section',
    })
  }
}

module.exports = {
  list,
  create,
  update,
  remove,
}
