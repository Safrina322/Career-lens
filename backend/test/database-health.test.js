const test = require('node:test')
const assert = require('node:assert/strict')

const app = require('../src/app')

test('database health endpoint reports database status safely', async () => {
  const server = app.listen(0)
  const { port } = server.address()

  try {
    const response = await fetch(`http://localhost:${port}/api/health/database`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.deepEqual(body, {
      success: true,
      data: {
        service: 'careerlens-database',
        status: 'ok',
      },
    })
  } finally {
    server.close()
  }
})
