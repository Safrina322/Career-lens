const {
  createJob,
  listJobsByUser,
  findJobByUser,
  updateJob,
  deleteJob,
} = require('../repositories/jobRepository')
const { validateJob } = require('../validators/jobValidator')

function normalizeOptionalText(value) {
  if (typeof value !== 'string') return null
  return value.trim() || null
}

async function create(request, response) {
  const validation = validateJob(request.body)

  if (!validation.isValid) {
    return response.status(400).json({
      success: false,
      message: 'Please correct the job fields',
      errors: validation.errors,
    })
  }

  try {
    const job = await createJob({
      userId: request.user.id,
      title: request.body.title.trim(),
      company: request.body.company.trim(),
      location: normalizeOptionalText(request.body.location),
      description: request.body.description.trim(),
      sourceUrl: normalizeOptionalText(request.body.sourceUrl),
    })

    return response.status(201).json({
      success: true,
      message: 'Job description created successfully',
      data: job,
    })
  } catch (error) {
    console.error('Job creation failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to create job description',
    })
  }
}

async function list(request, response) {
  try {
    const jobs = await listJobsByUser(request.user.id)

    return response.json({
      success: true,
      data: jobs,
    })
  } catch (error) {
    console.error('Job listing failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to list job descriptions',
    })
  }
}

async function getById(request, response) {
  try {
    const job = await findJobByUser(request.params.id, request.user.id)

    if (!job) {
      return response.status(404).json({
        success: false,
        message: 'Job description not found',
      })
    }

    return response.json({
      success: true,
      data: job,
    })
  } catch (error) {
    console.error('Job lookup failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to retrieve job description',
    })
  }
}

async function update(request, response) {
  const validation = validateJob(request.body)

  if (!validation.isValid) {
    return response.status(400).json({
      success: false,
      message: 'Please correct the job fields',
      errors: validation.errors,
    })
  }

  try {
    const existingJob = await findJobByUser(
      request.params.id,
      request.user.id,
    )

    if (!existingJob) {
      return response.status(404).json({
        success: false,
        message: 'Job description not found',
      })
    }

    const job = await updateJob({
      jobId: request.params.id,
      userId: request.user.id,
      title: request.body.title.trim(),
      company: request.body.company.trim(),
      location: normalizeOptionalText(request.body.location),
      description: request.body.description.trim(),
      sourceUrl: normalizeOptionalText(request.body.sourceUrl),
    })

    return response.json({
      success: true,
      message: 'Job description updated successfully',
      data: job,
    })
  } catch (error) {
    console.error('Job update failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to update job description',
    })
  }
}

async function remove(request, response) {
  try {
    const job = await deleteJob(request.params.id, request.user.id)

    if (!job) {
      return response.status(404).json({
        success: false,
        message: 'Job description not found',
      })
    }

    return response.json({
      success: true,
      message: 'Job description deleted successfully',
    })
  } catch (error) {
    console.error('Job deletion failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to delete job description',
    })
  }
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
}
