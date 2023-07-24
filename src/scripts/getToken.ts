import fs from "fs";
import { config } from "dotenv";
import { client } from '../fets/client'

config();

const fetchSpotifyToken = async (): Promise<void> => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error(
      "SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is not set in .env",
    );
  }

  try {
    const response = await client['https://accounts.spotify.com/api/token'].post({
      formUrlEncoded: {
        grant_type: 'client_credentials'
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
        ).toString("base64")}`,
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      console.error("No data was returned from the Spotify API.");
      return;
    }

    const spotifyResponse = await response.json();

    // replace the token in .env
    const envFile = fs.readFileSync(".env", "utf-8").split("\n");

    const newEnvVariables = envFile
      .map((line) => {
        if (line.startsWith("VITE_APP_SPOTIFY_TOKEN")) {
          return "";
        }
        return line;
      })
      .filter(Boolean);

    newEnvVariables.push(
      `VITE_APP_SPOTIFY_TOKEN=${spotifyResponse.access_token}`,
    );

    fs.writeFileSync(".env", newEnvVariables.join("\n"));
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

fetchSpotifyToken()
  .then(() => {
    console.log("Spotify token was saved successfully!");
  })
  .catch((error) => {
    if (error instanceof Error) {
      console.error("An error occurred: ", error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  });
