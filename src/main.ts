import { Rancher } from "./api.ts";

const PLUGIN_API = "";
const PLUGIN_TOKEN =
  "";
const PLUGIN_PROJECT = "opment";
const PLUGIN_NAMESPACE = "";
const PLUGIN_DEPLOYMENT = "";

const api = new Rancher(PLUGIN_API, PLUGIN_TOKEN);

const {
  data: [project],
} = await api.projects({ name: PLUGIN_PROJECT });

if (!project) {
  throw new Error(`Project ${PLUGIN_PROJECT} is not found`);
}

const {
  data: [workload],
} = await project.workloads({
  namespaceId: PLUGIN_NAMESPACE,
  name: PLUGIN_DEPLOYMENT,
});

if (!workload) {
  throw new Error(
    `Workload ${PLUGIN_NAMESPACE}/${PLUGIN_DEPLOYMENT} is not found`
  );
}

await workload.action("redeploy");
