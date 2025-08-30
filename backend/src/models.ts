export interface Source {
  type: string;
}

export interface Gerrit extends Source {
  type: "gerrit";
  url: string;
  username: string;
  http_password: string;
}

export interface DashboardConfig {
  source: string;
}

export interface GerritConfig extends DashboardConfig {
  query: string;
}

export interface Config {
  sources: { [id: string]: Gerrit };
  dashboards: { [id: string]: GerritConfig[] };
}

export interface DashboardEntry {
  source: string;
  source_type: string;
  url: string;
  title: string;
  branch: string;
  owner: {
    name: string;
    email: string;
  };
}

export type Dashboard = { [id: string]: DashboardEntry[] };
