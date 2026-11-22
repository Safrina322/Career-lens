const express = require('express')
const multer = require('multer')

const authenticateToken = require('../middleware/authMiddleware')
const resumeController = require('../controllers/resumeController')
const resumeSectionController = require('../controllers/resumeSectionController')

const router = express.Router()

const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (request, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      callback(
        new multer.MulterError(
          'LIMIT_UNEXPECTED_FILE',
          'Only PDF files are supported',
        ),
      )
      return
    }

    callback(null, true)
  },
})

router.use(authenticateToken)
router.post(
  '/extract-pdf',
  pdfUpload.single('resume'),
  resumeController.extractPdf,
)
router.get('/', resumeController.list)
router.post('/', resumeController.create)
router.get('/:id', resumeController.getById)
router.put('/:id', resumeController.update)
router.delete('/:id', resumeController.remove)
router.get('/:resumeId/sections', resumeSectionController.list)
router.post('/:resumeId/sections', resumeSectionController.create)
router.put(
  '/:resumeId/sections/:sectionId',
  resumeSectionController.update,
)
router.delete(
  '/:resumeId/sections/:sectionId',
  resumeSectionController.remove,
)

router.use((error, request, response, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return response.status(413).json({
        success: false,
        message: 'PDF file must be 5 MB or smaller',
      })
    }

    return response.status(400).json({
      success: false,
      message: 'Only PDF files are supported',
    })
  }

  return next(error)
})

module.exports = router
