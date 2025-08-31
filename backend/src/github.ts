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

export async function get_pulls(
  source: Github,
  dashboard: GithubConfig,
): Promise<DashboardEntry[]> {
  const pulls = await github_request<PullResponse[]>(
    `repos/${dashboard.repo}/pulls`,
    source,
    {
      state: dashboard.state,
    },
  );

  return pulls.data.map<DashboardEntry>(pull => ({
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
