import fs from "fs";
import { config } from "dotenv";

config();

interface SpotifyResponse {
  access_token: string;
  [key: string]: unknown;
}

const fetchSpotifyToken = async (): Promise<void> => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error(
      "SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is not set in .env",
    );
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      console.error("No data was returned from the Spotify API.");
      return;
    }
    const reader = response.body.getReader();

    const { done, value } = await reader.read();

    if (done) {
      console.error("No data was returned from the Spotify API.");
      return;
    }

    const data = new TextDecoder("utf-8").decode(value);
    const spotifyResponse = JSON.parse(data) as SpotifyResponse;

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
      return;
    }
    console.error(error);
  });
