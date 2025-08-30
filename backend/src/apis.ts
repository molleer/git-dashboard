import axios from "axios";
import { Gerrit } from "./models";

export async function gerrit_request(
  endpoint: string,
  source: Gerrit,
  params: Object | undefined = undefined,
) {
  const data = await axios.get<string>(`${source.url}/a/${endpoint}`, {
    params,
    headers: {
      Accept: "application/json",
    },
    auth: {
      username: source.username,
      password: source.http_password,
    },
  });
  return JSON.parse(data.data.substring(4));
}
