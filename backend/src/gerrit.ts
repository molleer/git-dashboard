import axios from "axios";
import { Gerrit, GerritConfig, DashboardEntry } from "./models";

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
      password: source.token,
    },
  });
  return JSON.parse(data.data.substring(4));
}

export async function get_changes(
  source: Gerrit,
  dashboard: GerritConfig,
): Promise<DashboardEntry[]> {
  const data = await gerrit_request("changes/", source, {
    q: dashboard.query,
  });

  const changes: DashboardEntry[] = [];
  for (const change of data) {
    const owner = await gerrit_request(
      `accounts/${change.owner._account_id}`,
      source,
    );

    changes.push({
      source: dashboard.source,
      source_type: source.type,
      url: `${source.url}/${change.virtual_id_number}`,
      title: change.subject,
      repository: change.project,
      branch: change.branch,
      owner: {
        name: owner.name,
        url: `${source.url}/q/owner:${owner.email}`,
        avatar: owner.avatar[0].url,
      },
    });
  }
  return changes;
}
