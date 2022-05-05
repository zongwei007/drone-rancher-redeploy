declare interface IProject {
  description: string;
  id: string;
  name: string;
  uuid: string;
}

declare type ProjectFilters = {
  clusterId?: string;
  description?: string;
  id?: string;
  name?: string;
  namespaceId?: string;
  uuid?: string;
};

declare interface IWorkload {
  id: string;
  name: string;
  namespaceId: string;
  uuid: string;
  containers: Array<Container>;
}

declare type WorkloadFilters = {
  name?: string;
  namespaceId?: string;
  uuid?: string;
};

declare type Container = Record<string, unknown> & {
  environment: Record<string, string>;
  image: string;
};

declare type Pagination<T> = {
  pagination: { limit: number; total: number };
  data: T[];
};

declare type RequestOptions =
  & Pick<RequestInit, 'body' | 'headers' | 'method'>
  & { param?: Record<string, string | string[]> };
