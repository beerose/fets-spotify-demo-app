import { client } from './fets/client'

export const fetchSpotifyToken = async (
  clientId: string,
  clientSecret: string
): Promise<string> => {
  const response = await client['https://accounts.spotify.com/api/token'].post({
    formUrlEncoded: {
      grant_type: 'client_credentials',
    },
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64')}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  if (!response.body) {
    throw new Error('No data was returned from the Spotify API.')
  }

  const spotifyResponse = await response.json()

  return spotifyResponse.access_token
}
