const cors = require('cors')
const express = require('express')

const app = express()
let databasePool

app.use(cors())
app.use(express.json())

const authRoutes = require('./routes/authRoutes')
const resumeRoutes = require('./routes/resumeRoutes')
const jobRoutes = require('./routes/jobRoutes')
const mlRoutes = require('./routes/mlRoutes')
const matchRoutes = require('./routes/matchRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const { getMlServiceHealth } = require('./services/mlService')

app.use('/api/auth', authRoutes)
app.use('/api/resumes', resumeRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/ml', mlRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/api/health', (request, response) => {
  response.json({
    success: true,
    data: {
      service: 'careerlens-api',
      status: 'ok',
    },
  })
})

app.get('/api/health/database', async (request, response) => {
  try {
    if (!databasePool) {
      databasePool = require('./config/database')
    }

    await databasePool.query('SELECT 1')

    response.json({
      success: true,
      data: {
        service: 'careerlens-database',
        status: 'ok',
      },
    })
  } catch (error) {
    console.error('Database health check failed:', error.message)
    response.status(503).json({
      success: false,
      message: 'Database is unavailable',
    })
  }
})

app.get('/api/health/ml', async (request, response) => {
  try {
    const mlHealth = await getMlServiceHealth()

    response.json({
      success: true,
      data: mlHealth,
    })
  } catch (error) {
    console.error('ML service health check failed:', error.message)

    response.status(503).json({
      success: false,
      message: 'ML service is unavailable',
    })
  }
})

module.exports = app
