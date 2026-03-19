import { ReadableStream } from 'node:stream/web'

/**
 * Import API Routes
 */
async function routes(app) {
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
      const resp = await fetch(`https://www.ietf.org/archive/id/${req.body.draft}-${version}.xml`)
      if (resp.ok) {
        return ReadableStream.from(resp.body)
      } else {
        reply.badRequest('Failed to fetch draft.')
      }
    }
  )
}

export default routes
