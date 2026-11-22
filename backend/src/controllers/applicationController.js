const {
  createApplication,
  listApplications,
  updateApplication,
  deleteApplication,
  findOwnedJob,
} = require('../repositories/applicationRepository')

const allowedStatuses = [
  'saved',
  'applied',
  'interview',
  'rejected',
  'accepted',
]

function validateApplication(body) {
  const errors = {}

  if (!body.jobId) errors.jobId = 'Job ID is required'
  if (!allowedStatuses.includes(body.status || 'saved')) {
    errors.status = 'Choose a valid application status'
  }
  if (body.notes !== undefined && typeof body.notes !== 'string') {
    errors.notes = 'Notes must be text'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

async function create(request, response) {
  const validation = validateApplication(request.body)

  if (!validation.isValid) {
    return response.status(400).json({
      success: false,
      message: 'Please correct the application fields',
      errors: validation.errors,
    })
  }

  try {
    const job = await findOwnedJob(request.body.jobId, request.user.id)

    if (!job) {
      return response.status(404).json({
        success: false,
        message: 'Job description not found',
      })
    }

    const application = await createApplication({
      userId: request.user.id,
      jobId: request.body.jobId,
      status: request.body.status || 'saved',
      appliedAt: request.body.appliedAt || null,
      notes: request.body.notes?.trim() || null,
    })

    return response.status(201).json({
      success: true,
      message: 'Application saved successfully',
      data: application,
    })
  } catch (error) {
    console.error('Application creation failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to save application',
    })
  }
}

async function list(request, response) {
  try {
    const applications = await listApplications(request.user.id)
    return response.json({ success: true, data: applications })
  } catch (error) {
    console.error('Application listing failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to list applications',
    })
  }
}

async function update(request, response) {
  const validation = validateApplication({
    jobId: request.body.jobId || 'existing',
    status: request.body.status,
    notes: request.body.notes,
  })

  if (!validation.isValid) {
    return response.status(400).json({
      success: false,
      message: 'Please correct the application fields',
      errors: validation.errors,
    })
  }

  try {
    const application = await updateApplication({
      applicationId: request.params.id,
      userId: request.user.id,
      status: request.body.status,
      appliedAt: request.body.appliedAt || null,
      notes: request.body.notes?.trim() || null,
    })

    if (!application) {
      return response.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    return response.json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    })
  } catch (error) {
    console.error('Application update failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to update application',
    })
  }
}

async function remove(request, response) {
  try {
    const application = await deleteApplication(
      request.params.id,
      request.user.id,
    )

    if (!application) {
      return response.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    return response.json({
      success: true,
      message: 'Application deleted successfully',
    })
  } catch (error) {
    console.error('Application deletion failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to delete application',
    })
  }
}

module.exports = {
  create,
  list,
  update,
  remove,
}
