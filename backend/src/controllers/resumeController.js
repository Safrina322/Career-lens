const {
  createResume,
  listResumesByUser,
  findResumeByUser,
  updateResume,
  deleteResume,
} = require('../repositories/resumeRepository')
const { validateResume } = require('../validators/resumeValidator')
const { PDFParse } = require('pdf-parse')

async function extractPdf(request, response) {
  if (!request.file) {
    return response.status(400).json({
      success: false,
      message: 'A PDF resume file is required',
    })
  }

  const parser = new PDFParse({ data: request.file.buffer })

  try {
    const result = await parser.getText()
    const rawText = result.text.trim()

    if (!rawText) {
      return response.status(422).json({
        success: false,
        message: 'No readable text was found in the PDF',
      })
    }

    return response.json({
      success: true,
      data: {
        rawText,
        characterCount: rawText.length,
        pageCount: result.pages?.length || 0,
      },
    })
  } catch (error) {
    console.error('PDF resume extraction failed:', error.message)
    return response.status(422).json({
      success: false,
      message: 'Unable to read the uploaded PDF',
    })
  } finally {
    await parser.destroy()
  }
}

async function create(request, response) {
  const validation = validateResume(request.body)

  if (!validation.isValid) {
    return response.status(400).json({
      success: false,
      message: 'Please correct the resume fields',
      errors: validation.errors,
    })
  }

  try {
    const resume = await createResume({
      userId: request.user.id,
      title: request.body.title.trim(),
      summary: request.body.summary?.trim() || null,
      rawText: request.body.rawText.trim(),
    })

    return response.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: resume,
    })
  } catch (error) {
    console.error('Resume creation failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to create resume',
    })
  }
}

async function list(request, response) {
  try {
    const resumes = await listResumesByUser(request.user.id)

    return response.json({
      success: true,
      data: resumes,
    })
  } catch (error) {
    console.error('Resume listing failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to list resumes',
    })
  }
}

async function getById(request, response) {
  try {
    const resume = await findResumeByUser(
      request.params.id,
      request.user.id,
    )

    if (!resume) {
      return response.status(404).json({
        success: false,
        message: 'Resume not found',
      })
    }

    return response.json({
      success: true,
      data: resume,
    })
  } catch (error) {
    console.error('Resume lookup failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to retrieve resume',
    })
  }
}

async function update(request, response) {
  const validation = validateResume(request.body)

  if (!validation.isValid) {
    return response.status(400).json({
      success: false,
      message: 'Please correct the resume fields',
      errors: validation.errors,
    })
  }

  try {
    const existingResume = await findResumeByUser(
      request.params.id,
      request.user.id,
    )

    if (!existingResume) {
      return response.status(404).json({
        success: false,
        message: 'Resume not found',
      })
    }

    const resume = await updateResume({
      resumeId: request.params.id,
      userId: request.user.id,
      title: request.body.title.trim(),
      summary: request.body.summary?.trim() || null,
      rawText: request.body.rawText.trim(),
    })

    return response.json({
      success: true,
      message: 'Resume updated successfully',
      data: resume,
    })
  } catch (error) {
    console.error('Resume update failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to update resume',
    })
  }
}

async function remove(request, response) {
  try {
    const existingResume = await findResumeByUser(
      request.params.id,
      request.user.id,
    )

    if (!existingResume) {
      return response.status(404).json({
        success: false,
        message: 'Resume not found',
      })
    }

    await deleteResume(request.params.id, request.user.id)

    return response.json({
      success: true,
      message: 'Resume deleted successfully',
    })
  } catch (error) {
    console.error('Resume deletion failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to delete resume',
    })
  }
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  extractPdf,
}
