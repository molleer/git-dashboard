export interface Source {
  type: string;
}

export interface Gerrit extends Source {
  type: "gerrit";
  url: string;
  username: string;
  token: string;
}

export interface Github extends Source {
  type: "github";
  url: "https://api.github.com";
  token: string;
}

export interface DashboardConfig {
  source: string;
}

export interface GerritConfig extends DashboardConfig {
  query: string;
}

export interface GithubConfig extends DashboardConfig {
  repo: string;
  state: string;
}

export interface Config {
  sources: { [id: string]: Gerrit | Github };
  dashboards: { [id: string]: GerritConfig[] };
}

export interface DashboardEntry {
  source: string;
  source_type: string;
  url: string;
  title: string;
  repository: string;
  branch: string;
  owner: {
    name: string;
    url: string;
    avatar: string;
  };
}

export type Dashboard = { [id: string]: DashboardEntry[] };
