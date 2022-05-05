///  <reference types="./types.d.ts"/>

class Workload implements IWorkload {
  public id: string;
  public name: string;
  public namespaceId: string;
  public uuid: string;
  public containers: Array<Container>;
  public restProps: Record<string, unknown>;

  private parent: Project;
  private api: Rancher;

  constructor(
    { id, name, namespaceId, uuid, containers, ...rest }: IWorkload & Record<string, unknown>,
    parent: Project,
    api: Rancher,
  ) {
    this.id = id;
    this.name = name;
    this.namespaceId = namespaceId;
    this.uuid = uuid;
    this.containers = containers;
    this.restProps = rest;

    this.parent = parent;
    this.api = api;
  }

  get containerImage() {
    return this.containers[0].image;
  }

  set containerImage(image: string) {
    this.containers[0].image = image;
  }

  action(action: 'redeploy' | 'rollback' | 'pause' | 'resume') {
    return this.api.request(`project/${this.parent.id}/workloads/${this.id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      param: { action },
    });
  }

  update() {
    return this.api.request(`project/${this.parent.id}/workloads/${this.id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        ...this.restProps,
        containers: this.containers,
        name: this.name,
        namespaceId: this.namespaceId,
        uuid: this.uuid,
      }),
    });
  }
}

class Project implements IProject {
  public description: string;
  public id: string;
  public name: string;
  public uuid: string;

  private api: Rancher;

  constructor(data: IProject, api: Rancher) {
    this.description = data.description;
    this.id = data.id;
    this.name = data.name;
    this.uuid = data.uuid;
    this.api = api;
  }

  async workloads(param: WorkloadFilters): Promise<Pagination<Workload>> {
    const pagination = await this.api.request<Pagination<IWorkload & Record<string, unknown>>>(
      `projects/${this.id}/workloads`,
      { param },
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

  async request<T>(path = '', options: RequestOptions): Promise<T> {
    const url = `${this.api}/v3/${path}?${toSearchParam(options.param)}`;

    console.log(`Request: ${options.method || 'GET'} ${url}`);

    try {
      const resp = await fetch(url, {
        headers: {
          ...options.headers,
          Authorization: `Bearer ${this.token}`,
        },
        method: options.method,
        body: options.body,
      });

      const contentLength = parseInt(resp.headers.get('Content-Length') || '-1');

      if (contentLength !== 0) {
        return await resp.json();
      } else {
        return null as unknown as T;
      }
    } catch (e) {
      console.error(`Request ${url} fail: ${e.message}`, e);

      throw e;
    }
  }

  async projects(param: ProjectFilters): Promise<Pagination<Project>> {
    const pagination = await this.request<Pagination<IProject>>('projects', { param });

    return {
      ...pagination,
      data: pagination.data.map((ele) => new Project(ele, this)),
    };
  }
}

function toSearchParam(param?: Record<string, unknown | unknown[]>): URLSearchParams {
  const result = new URLSearchParams();

  if (param) {
    Object.entries(param).forEach(([key, value]) => {
      if (value == null) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((ele) => result.append(key, ele));
      } else {
        result.append(key, String(value));
      }
    });
  }

  return result;
}
