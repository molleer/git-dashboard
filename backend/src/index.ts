import express from "express";
import fs from "fs";
import { Config, DashboardEntry, GerritConfig } from "./models";
import { get_changes } from "./gerrit";

const config_file: string =
  process.env.CONFIG_FILE ||
  process.argv[1].split("/").slice(0, -2).join("/") + "/dashboard_config.json";

const config: Config = fs.existsSync(config_file)
  ? JSON.parse(String(fs.readFileSync(config_file)))
  : { sources: {}, dashboards: {} };

function save_config() {
  fs.writeFileSync(config_file, JSON.stringify(config));
  console.log("Config saved!");
  process.exit();
}

const EXIT_EVENTS: string[] = [
  "exit",
  "SIGINT",
  "SIGUSR1",
  "SIGUSR2",
  "uncaughtException",
];
EXIT_EVENTS.forEach(event => process.on(event, save_config));

const app = express();
const router = express.Router();

app.use(express.json());
app.use("/api", router);

router.get("/sources", (_, res) => {
  res.json(config);
});

router.post("/sources/add", (req, res) => {
  if (Object.keys(config.sources).includes(req.body.name)) {
    res.status(403).send("Source with the same name already exist");
    return;
  }

  switch (req.body.type) {
    case "gerrit":
      config.sources[req.body.name] = {
        type: req.body.type,
        url: req.body.url,
        username: req.body.username,
        http_password: req.body.http_password,
      };
      res.status(201).send();
      break;
    case undefined:
      res.status(400).send("Source type not provided");
      break;
    default:
      res.status(400).send(`Unknown source type '${req.body.type}'`);
  }
});

router.post("/sources/edit", (req, res) => {
  if (!Object.keys(config.sources).includes(req.body.name)) {
    res.status(400).send(`No source called '${req.body.name}'`);
    return;
  }

  switch (req.body.type) {
    case "gerrit":
      const source = config.sources[req.body.name];
      config.sources[req.body.name] = {
        type: req.body.type || source.type,
        url: req.body.url || source.url,
        username: req.body.username || source.url,
        http_password: req.body.http_password || source.http_password,
      };
      res.status(200).send();
      break;
    case undefined:
      res.status(400).send("Source type not provided");
      break;
    default:
      res.status(400).send(`Unknown source type ${req.body.type}`);
  }
});

router.get("/dashboard/configs", (_, res) => {
  res.json(config.dashboards);
});

router.post("/dashboard/configs", (req, res) => {
  config.dashboards[req.body.name] = req.body.filters;
  res.status(200).send();
});

async function get_filtered_data(
  filter: GerritConfig,
): Promise<DashboardEntry[]> {
  if (!Object.keys(config.sources).includes(filter.source)) {
    throw Error(`Source '${filter.source}' was not found`);
  }

  const source = config.sources[filter.source];
  switch (source.type) {
    case "gerrit":
      return get_changes(source, filter);
    default:
      throw Error(`Source type '${source.type}' not supported`);
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
