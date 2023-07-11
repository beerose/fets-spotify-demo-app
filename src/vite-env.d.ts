/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_SPOTIFY_TOKEN: string;
  readonly SPOTIFY_CLIENT_ID: string;
  readonly SPOTIFY_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
