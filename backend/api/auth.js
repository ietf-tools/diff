/**
 * Authentication API Routes
 */
async function routes(app) {
  app.post('/userinfo', async function (req) {
    // extend session if logged in
    if (req.session.get('id')) {
      req.session.touch()
    }

    return {
      id: req.session.get('id') ?? '',
      name: req.session.get('name') ?? 'Guest',
      email: req.session.get('email') ?? 'guest@rfc-editor.org',
      picture: req.session.get('picture') ?? '',
      ghUsername: req.session.get('ghUsername') ?? ''
    }
  })
}

export default routes
