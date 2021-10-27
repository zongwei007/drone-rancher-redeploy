declare interface ProjectData {
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

declare interface WorkloadData {
  id: string;
  name: string;
  namespaceId: string;
  uuid: string;
}

declare type WorkloadFilters = {
  name?: string;
  namespaceId?: string;
  uuid?: string;
};

declare type PaginationData<T> = {
  pagination: { limit: number; total: number };
  data: T[];
};


declare type RequestOptions = {
  param?: Record<string, any>;
} & Pick<RequestInit, "body" | "headers" | "method">;
