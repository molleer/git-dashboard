import { DashboardEntry, Github, GithubConfig } from "./models";
import axios from "axios";

interface PullResponse {
  title: string;
  html_url: string;
  head: {
    repo: {
      full_name: string;
    };
  };
  base: {
    ref: string;
  };
  user: {
    login: string;
    html_url: string;
    avatar_url: string;
  };
}

async function github_request<T>(
  endpoint: string,
  source: Github,
  params: Object | undefined = undefined,
): Promise<Axios.AxiosXHR<T>> {
  return axios.get<T>(`https://api.github.com/${endpoint}`, {
    params,
    headers: {
      Authorization: `Bearer ${source.token}`,
    },
  });
}

function filer_query(pull: PullResponse, query: string) {
  const queries = query.split(" ");
  const authors = queries
    .filter(e => e.match(/^author:[a-zA-Z0-9]+/))
    .map(e => e.replace(/^author:/, ""));
  const not_author = queries
    .filter(e => e.match(/^-author:[a-zA-Z0-9]+/))
    .map(e => e.replace(/^-author:/, ""));

  if (authors.length > 0 && !authors.includes(pull.user.login)) return false;
  if (not_author.length && not_author.includes(pull.user.login)) return false;
  return true;
}

export async function get_pulls(
  source: Github,
  dashboard: GithubConfig,
): Promise<DashboardEntry[]> {
  const pulls = await github_request<PullResponse[]>(
    `repos/${dashboard.repo}/pulls`,
    source,
    {},
  );

  return pulls.data
    .filter(pull => filer_query(pull, dashboard.query))
    .map<DashboardEntry>(pull => ({
      title: pull.title,
      url: pull.html_url,
      source: dashboard.source,
      source_type: source.type,
      repository: pull.head.repo.full_name,
      branch: pull.base.ref,
      owner: {
        name: pull.user.login,
        url: pull.user.html_url,
        avatar: pull.user.avatar_url,
      },
    }));
}
