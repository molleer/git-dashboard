import axios from "axios";
import { DashboardEntry, Github, GithubConfig } from "./models";

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
  draft: boolean;
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
  const is = queries
    .filter(e => e.match(/^is:(draft)/))
    .map(e => e.replace(/^is:/, ""));
  const is_not = queries
    .filter(e => e.match(/^-is:(draft)/))
    .map(e => e.replace(/^-is:/, ""));

  if (!authors.includes(pull.user.login)) return false;
  if (not_author.includes(pull.user.login)) return false;
  if (is.includes("draft") && !pull.draft) return false;
  if (is_not.includes("draft") && pull.draft) return false;
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
