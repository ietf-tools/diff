/**
 * API Routes
 */
async function routes(app) {
  app.register(import('./auth.js'), { prefix: '/auth' })

  app.get('/', async () => {
    return { ok: true }
  })
}

export default routes
