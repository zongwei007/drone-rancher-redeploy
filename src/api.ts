///  <reference types="./types.d.ts"/>

class Workload implements WorkloadData {
  public id: string;
  public name: string;
  public namespaceId: string;
  public uuid: string;

  private parent: Project;
  private api: Rancher;

  constructor(data: WorkloadData, parent: Project, api: Rancher) {
    this.id = data.id;
    this.name = data.name;
    this.namespaceId = data.namespaceId;
    this.uuid = data.uuid;
    this.parent = parent;
    this.api = api;
  }

  action(action: "redeploy" | "rollback" | "pause" | "resume") {
    return this.api.request(`project/${this.parent.id}/workloads/${this.id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      param: {
        action,
      },
    });
  }
}

class Project implements ProjectData {
  public description: string;
  public id: string;
  public name: string;
  public uuid: string;

  private api: Rancher;

  constructor(data: ProjectData, api: Rancher) {
    this.description = data.description;
    this.id = data.id;
    this.name = data.name;
    this.uuid = data.uuid;
    this.api = api;
  }

  async workloads(param: WorkloadFilters): Promise<PaginationData<Workload>> {
    const pagination = await this.api.request<PaginationData<WorkloadData>>(
      `projects/${this.id}/workloads`,
      {
        param,
      }
    );

    return {
      ...pagination,
      data: pagination.data.map((ele) => new Workload(ele, this, this.api)),
    };
  }
}

export class Rancher {
  private api: string;
  private token: string;

  constructor(api: string, token: string) {
    this.api = api;
    this.token = token;
  }

  async request<T>(path: string = "", options: RequestOptions): Promise<T> {
    const url = `${this.api}/v3/${path}?${toSearchParam(
      options.param
    ).toString()}`;

    console.log(`Request: ${options.method || "GET"} ${url}`);

    const resp = await fetch(url, {
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.token}`,
      },
      method: options.method,
      body: options.body,
    });

    const contentLength = parseInt(resp.headers.get("Content-Length") || "-1");

    if (contentLength !== 0) {
      return await resp.json();
    } else {
      return null as any;
    }
  }

  async projects(param: ProjectFilters): Promise<PaginationData<Project>> {
    const pagination = await this.request<PaginationData<ProjectData>>(
      "projects",
      {
        param,
      }
    );

    return {
      ...pagination,
      data: pagination.data.map((ele) => new Project(ele, this)),
    };
  }
}

function toSearchParam(
  param?: Record<string, string | string[]>
): URLSearchParams {
  const result = new URLSearchParams();

  if (param) {
    Object.entries(param).forEach(([key, value]) => {
      if (value == null) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((ele) => result.append(key, ele));
      } else {
        result.append(key, value);
      }
    });
  }

  return result;
}
