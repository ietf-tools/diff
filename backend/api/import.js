import { ReadableStream } from 'node:stream/web'
import { Octokit } from 'octokit'

/**
 * Import API Routes
 */
async function routes(app) {
  /**
   * FETCH FROM DATATRACKER
   */
  app.post(
    '/datatracker',
    {
      schema: {
        body: {
          type: 'object',
          required: ['draft', 'version', 'format'],
          properties: {
            draft: {
              type: 'string',
              pattern: '[a-z0-9-]{7,255}'
            },
            version: {
              type: 'string',
              pattern: '[0-9]{1,3}'
            },
            format: {
              type: 'string',
              enum: ['xml', 'txt']
            }
          }
        }
      }
    },
    async function (req, reply) {
      const version = req.body.version.padStart(2, '0')
      const resp = await fetch(
        `https://www.ietf.org/archive/id/${req.body.draft}-${version}.${req.body.format}`
      )
      if (resp.ok) {
        return ReadableStream.from(resp.body)
      } else {
        reply.badRequest('Failed to fetch draft.')
      }
    }
  )
  /**
   * FETCH FROM GITHUB
   */
  app.post(
    '/github',
    {
      schema: {
        body: {
          type: 'object',
          required: ['repository', 'filePath'],
          properties: {
            repository: {
              type: 'string',
              pattern: '[a-zA-Z0-9-_]{2,127}/[a-zA-Z0-9-_]{1,127}'
            },
            filePath: {
              type: 'string',
              pattern: '[a-zA-Z0-9-_/.]{1,251}\\.(xml|md|txt)'
            },
            revision: {
              type: 'string',
              pattern: '[a-zA-Z0-9-_/.]{0,255}'
            }
          }
        }
      }
    },
    async function (req, reply) {
      if (!req.session.get('ghAccessToken')) {
        return reply.unauthorized('You must be logged in and have linked your GitHub account.')
      }

      const ref = req.body.revision || null
      const owner = req.body.repository.split('/')[0]
      const repo = req.body.repository.split('/')[1]

      const octokit = new Octokit({ auth: req.session.get('ghAccessToken') })

      const resp = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: req.body.filePath,
        ...(ref && { ref }),
        headers: {
          Accept: 'application/vnd.github.raw+json',
          'X-GitHub-Api-Version': '2026-03-10'
        }
      })

      return reply.type('text/plain; charset=utf-8').send(resp.data)
    }
  )
}

export default routes
