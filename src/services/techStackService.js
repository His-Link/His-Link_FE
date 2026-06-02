import { httpClient } from "services/httpClient";

export async function fetchTechStacks() {
  return httpClient.get("/tech-stacks");
}
