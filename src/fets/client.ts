import { createClient, type NormalizeOAS } from "fets";
import openapi from "./openapi";

export const client = createClient<NormalizeOAS<typeof openapi>>({
  endpoint: "https://api.spotify.com/v1",
});
