import express from 'express'
import { client } from './fets/client'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.get('/token', async (_req, res) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return res.status(500).json({
      error: 'Missing env variables.',
    })
  }

  const response = await client['https://accounts.spotify.com/api/token'].post({
    formUrlEncoded: {
      grant_type: 'client_credentials',
    },
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
  })

  if (!response.ok) {
    return res.status(response.status).json({ error: response.statusText })
  }

  if (!response.body) {
    return res
      .status(500)
      .json({ error: 'No data was returned from the Spotify API.' })
  }

  const spotifyResponse = await response.json()

  res.json({ token: spotifyResponse.access_token })
})

export const handler = app
