import {
  S3Client,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand
} from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.DIFF_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DIFF_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.DIFF_R2_SECRET_ACCESS_KEY
  }
})

/**
 * Sessions API Routes
 */
async function routes(app) {
  /**
   * Create a session
   */
  app.post('/create', async function (req, reply) {
    if (req.session.get('id')) {
      return reply.unauthorized('You must be logged in to create a session.')
    }

    const id = uuid()

    try {
      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.DIFF_R2_BUCKET,
          Key: `sessions/${req.session.get('id')}/${id}.json`,
          Body: JSON.stringify({
            userId: req.session.get('id')
          })
        })
      )
      return {
        userId: req.session.get('id'),
        sessionId: id
      }
    } catch (err) {
      console.warn(err.message)
      return reply.internalServerError('Session creation failed.')
    }
  })

  /**
   * List all sessions for a user
   */
  app.post('/list', async function (req, reply) {
    if (req.session.get('id')) {
      return reply.unauthorized('You must be logged in to list sessions.')
    }

    try {
      const resp = await r2.send(
        new ListObjectsV2Command({
          Bucket: process.env.DIFF_R2_BUCKET,
          Prefix: `sessions/${req.session.get('id')}/`
        })
      )

      return resp?.Contents?.map((s) => s.Key) ?? []
    } catch (err) {
      console.warn(err.message)
      return reply.internalServerError('Session list fetch failed.')
    }
  })

  /**
   * Delete a session
   */
  app.delete(
    '/single/:sessionId',
    {
      schema: {
        params: {
          type: 'object',
          required: ['sessionId'],
          properties: {
            sessionId: {
              type: 'string',
              format: 'uuid'
            }
          }
        }
      }
    },
    async function (req, reply) {
      if (req.session.get('id')) {
        return reply.unauthorized('You must be logged in to delete a session.')
      }

      const sessionPath = `sessions/${req.session.get('id')}/${req.params.sessionId}.json`

      try {
        const sessionMeta = JSON.parse(
          await r2
            .send(
              new GetObjectCommand({
                Bucket: process.env.DIFF_R2_BUCKET,
                Key: sessionPath
              })
            )
            .then((r) => r.Body.transformToString())
        )

        const objectsToDelete = [
          {
            Key: sessionPath
          }
        ]

        if (sessionMeta?.files?.length > 0) {
          objectsToDelete.push(
            ...sessionMeta.files.map((f) => ({
              Key: f.path
            }))
          )
        }

        await r2.send(
          new DeleteObjectsCommand({
            Bucket: process.env.DIFF_R2_BUCKET,
            Delete: {
              Objects: objectsToDelete
            }
          })
        )

        return {
          ok: true
        }
      } catch (err) {
        console.warn(err.message)
        return reply.internalServerError(
          'Failed to delete session. Session not found or you are not the owner.'
        )
      }
    }
  )
}

export default routes
