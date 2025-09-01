import express from "express";
import fs from "fs";
import {
  Config,
  DashboardConfig,
  DashboardEntry,
  GerritConfig,
  GithubConfig,
} from "./models";
import { get_changes } from "./gerrit";
import { get_pulls } from "./github";

const config_file: string =
  process.env.CONFIG_FILE ||
  process.argv[1].split("/").slice(0, -2).join("/") + "/dashboard_config.json";

const config: Config = fs.existsSync(config_file)
  ? JSON.parse(String(fs.readFileSync(config_file)))
  : { sources: {}, dashboards: {} };

const app = express();
const router = express.Router();

app.use(express.json());
app.use("/api", router);

router.get("/sources", (_, res) => {
  res.json(config.sources);
});

router.post("/sources", (req, res) => {
  delete config.sources[req.body.name];
  res.status(200).send();
});

router.get("/config", (_, res) => {
  res.json(config);
});

async function get_filtered_data(
  filter: DashboardConfig,
): Promise<DashboardEntry[]> {
  if (!Object.keys(config.sources).includes(filter.source)) {
    throw Error(`Source '${filter.source}' was not found`);
  }

  const source = config.sources[filter.source];
  switch (source.type) {
    case "gerrit":
      return get_changes(source, filter as GerritConfig);
    case "github":
      return get_pulls(source, filter as GithubConfig);
    default:
      throw Error(`Source type not supported`);
  }
}
router.get("/dashboard", async (req, res) => {
  const data: { [id: string]: DashboardEntry[] } = {};
  for (const name in config.dashboards) {
    data[name] = [];
    for (const filter of config.dashboards[name]) {
      data[name].push(...(await get_filtered_data(filter)));
    }
  }
  res.json(data);
});

app.listen(Number(process.env.PORT) || 9090, () => {
  console.log("Running!");
});
