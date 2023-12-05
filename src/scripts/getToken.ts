import fs from 'node:fs'
import { config } from 'dotenv'
import { fetchSpotifyToken } from '../fetchToken'

config()

const saveToken = async (): Promise<void> => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error(
      'SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is not set in .env'
    )
  }

  try {
    const token = await fetchSpotifyToken(
      SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET
    )
    // replace the token in .env
    const envFile = fs.readFileSync('.env', 'utf-8').split('\n')

    const newEnvVariables = envFile
      .map((line) => {
        if (line.startsWith('VITE_APP_SPOTIFY_TOKEN')) {
          return ''
        }
        return line
      })
      .filter(Boolean)

    newEnvVariables.push(`VITE_APP_SPOTIFY_TOKEN=${token}`)

    fs.writeFileSync('.env', newEnvVariables.join('\n'))

    console.log(token)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

saveToken()
  .then(() => {
    console.log('\nSpotify token was saved successfully!')
  })
  .catch((error) => {
    if (error instanceof Error) {
      console.error('An error occurred: ', error.message)
    } else {
      console.error(error)
    }
    process.exit(1)
  })
