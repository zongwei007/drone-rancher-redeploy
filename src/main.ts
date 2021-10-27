import { Rancher } from "./api.ts";

const {
  PLUGIN_API,
  PLUGIN_TOKEN,
  PLUGIN_PROJECT,
  PLUGIN_NAMESPACE,
  PLUGIN_DEPLOYMENT,
} = Deno.env.toObject();

const args = [
  PLUGIN_API,
  PLUGIN_TOKEN,
  PLUGIN_PROJECT,
  PLUGIN_NAMESPACE,
  PLUGIN_DEPLOYMENT,
];
const argNames = ["api", "token", "project", "namespace", "deployment"];

let emptyIdx: number;
if ((emptyIdx = args.findIndex((ele) => !ele)) !== -1) {
  throw new Error(`param ${argNames[emptyIdx]} is empty`);
}

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
