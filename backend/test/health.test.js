const test = require('node:test')
const assert = require('node:assert/strict')

const app = require('../src/app')

test('health endpoint returns service status', async () => {
  const server = app.listen(0)
  const { port } = server.address()

  try {
    const response = await fetch(`http://localhost:${port}/api/health`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.deepEqual(body, {
      success: true,
      data: {
        service: 'careerlens-api',
        status: 'ok',
      },
    })
  } finally {
    server.close()
  }
})
