import { gerrit_request } from "./apis";
import { Gerrit, GerritConfig, DashboardEntry } from "./models";

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
        email: owner.email,
      },
    });
  }
  return changes;
}
