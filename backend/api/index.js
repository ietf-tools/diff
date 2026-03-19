/**
 * API Routes
 */
async function routes(app) {
  app.register(import('./auth.js'), { prefix: '/auth' })
  app.register(import('./import.js'), { prefix: '/import' })
  app.register(import('./sessions.js'), { prefix: '/sessions' })

  app.get('/', async () => {
    return { ok: true }
  })
}

export default routes
