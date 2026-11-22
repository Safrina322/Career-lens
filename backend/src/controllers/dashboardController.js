const {
  getDashboardData,
} = require('../repositories/dashboardRepository')

async function get(request, response) {
  try {
    const dashboard = await getDashboardData(request.user.id)

    return response.json({
      success: true,
      data: dashboard,
    })
  } catch (error) {
    console.error('Dashboard query failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to load dashboard',
    })
  }
}

module.exports = {
  get,
}
