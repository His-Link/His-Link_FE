import { httpClient } from "services/httpClient";

export async function fetchDashboard() {
  const response = await httpClient.get("/main/dashboard");
  return response.data;
}
