import path from 'node:path'
import { v4 as uuid } from 'uuid'

import fastify from 'fastify'
import fastifyCompress from '@fastify/compress'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyFavicon from 'fastify-favicon'
import fastifyHelmet from '@fastify/helmet'
import fastifySensible from '@fastify/sensible'
import fastifySecureSession from '@fastify/secure-session'
import fastifyStatic from '@fastify/static'
import fastifyOAuth2 from '@fastify/oauth2'
import gracefulServer from '@gquittet/graceful-server'

const ROOTPATH = process.cwd()

async function main() {
  // ----------------------------------------
  // Initialize Fastify App
  // ----------------------------------------

  const app = fastify({
    logger: {
      level: process.env.DIFF_LOG_LEVEL ?? 'warn'
    },
    trustProxy: true,
    routerOptions: {
      ignoreTrailingSlash: true
    }
  })
  const server = gracefulServer(app.server, {
    livenessEndpoint: '/_live',
    readinessEndpoint: '/_ready',
    kubernetes: Boolean(process.env.KUBERNETES_SERVICE_HOST)
  })

  app.register(fastifySensible)
  app.register(fastifyCompress, { global: true })

  // ----------------------------------------
  // Handle graceful server shutdown
  // ----------------------------------------

  server.on(gracefulServer.SHUTTING_DOWN, () => {
    console.info('Shutting down HTTP Server... [ STOPPING ]')
  })

  server.on(gracefulServer.SHUTDOWN, (err) => {
    console.info(`HTTP Server has exited: [ STOPPED ] (${err.message})`)
    if (err.message !== 'SIGINT') {
      console.warn(err)
    }
  })

  // ----------------------------------------
  // Security
  // ----------------------------------------

  app.register(fastifyHelmet, {
    contentSecurityPolicy: false
  })

  app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'HEAD', 'POST', 'OPTIONS']
  })

  // ----------------------------------------
  // Public Assets
  // ----------------------------------------

  app.register(fastifyFavicon, {
    path: path.join(ROOTPATH, 'dist'),
    name: 'favicon.ico'
  })
  app.register(fastifyStatic, {
    root: path.join(ROOTPATH, 'dist'),
    maxAge: '7d'
  })

  // ----------------------------------------
  // SEO - Trailing slash redirect
  // ----------------------------------------

  app.addHook('onRequest', (req, reply, done) => {
    const [urlPath, urlQuery] = req.raw.url.split('?')
    if (urlPath.length > 1 && urlPath.endsWith('/')) {
      const newPath = urlPath.slice(0, -1)
      reply.redirect(urlQuery ? `${newPath}?${urlQuery}` : newPath, 301)
      return
    }
    done()
  })

  // ----------------------------------------
  // Sessions
  // ----------------------------------------

  if (!process.env.DIFF_SECRET || !process.env.DIFF_SALT) {
    console.warn('WARNING - Using random session secret + salt. For DEV only.')
  }
  app.register(fastifyCookie)
  app.register(fastifySecureSession, {
    cookieName: 'diffsession',
    secret: process.env.DIFF_SECRET ?? uuid(),
    salt: process.env.DIFF_SALT ?? uuid().substring(0, 16),
    cookie: {
      path: '/',
      httpOnly: true,
      secure: 'auto'
    }
  })

  // -> Datatracker
  app.register(fastifyOAuth2, {
    name: 'datatracker',
    scope: ['openid', 'profile', 'email'],
    credentials: {
      client: {
        id: process.env.DIFF_DT_CLIENT_ID,
        secret: process.env.DIFF_DT_CLIENT_SECRET
      }
    },
    startRedirectPath: '/login',
    callbackUri: process.env.DIFF_DT_CALLBACK ?? 'http://localhost:5173/login/callback',
    discovery: {
      issuer: 'https://datatracker.ietf.org/api/openid/.well-known/openid-configuration'
    }
  })
  app.get('/login/callback', async function (req, reply) {
    const { token } = await this.datatracker.getAccessTokenFromAuthorizationCodeFlow(req)
    const profile = await this.datatracker.userinfo(token)

    req.session.set('accessToken', token.access_token)
    req.session.set('id', profile.sub)
    req.session.set('name', profile.name)
    req.session.set('email', profile.email)
    req.session.set('picture', profile.picture)

    reply.redirect('/')
  })
  app.get('/logout', async function (req, reply) {
    req.session.delete()
    reply.redirect('/')
  })

  // -> GitHub
  app.register(fastifyOAuth2, {
    name: 'github',
    credentials: {
      client: {
        id: process.env.DIFF_GH_CLIENT_ID,
        secret: process.env.DIFF_GH_CLIENT_SECRET
      },
      auth: fastifyOAuth2.GITHUB_CONFIGURATION
    },
    startRedirectPath: '/login/link-github',
    callbackUri: process.env.DIFF_GH_CALLBACK ?? 'http://localhost:5173/login/link-github/callback'
  })
  app.get('/login/link-github/callback', async function (req, reply) {
    const { token } = await this.github.getAccessTokenFromAuthorizationCodeFlow(req)

    req.session.set('ghAccessToken', token.access_token)

    const profile = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token.access_token}`,
        'X-GitHub-Api-Version': '2026-03-10'
      }
    }).then((r) => r.json())
    req.session.set('ghUsername', profile.login)

    reply.redirect('/')
  })
  app.get('/login/unlink-github', async function (req, reply) {
    if (req.session.get('ghAccessToken')) {
      req.session.set('ghAccessToken', null)
    }
    if (req.session.get('ghUsername')) {
      req.session.set('ghUsername', null)
    }
    reply.redirect('/')
  })

  // ----------------------------------------
  // Routes
  // ----------------------------------------

  app.register(import('./api/index.js'), { prefix: '/api' })

  // ----------------------------------------
  // Error handling
  // ----------------------------------------

  app.setErrorHandler((error, req, reply) => {
    if (error instanceof fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
      console.warn(error)
      reply.status(500).send({ ok: false })
    } else {
      reply.send(error)
    }
  })

  // ----------------------------------------
  // Bind HTTP Server
  // ----------------------------------------

  try {
    console.info(`Starting HTTP Server on port 3000 [ STARTING ]`)
    await app.listen({ port: 3000, host: '0.0.0.0' })
    console.info('HTTP Server: [ RUNNING ]')
    server.setReady()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
