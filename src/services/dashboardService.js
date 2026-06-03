import { httpClient } from "services/httpClient";

export async function fetchDashboard() {
  return httpClient.get("/main/dashboard");
}
