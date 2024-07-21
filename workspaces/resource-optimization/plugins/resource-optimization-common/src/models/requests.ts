/** @public */
export type GetRecommendationByIdRequest = {
  path: { recommendationId: string };
  query: {
    memoryUnit?: 'bytes' | 'MiB' | 'GiB' | undefined;
    cpuUnit?: 'millicores' | 'cores' | undefined;
  };
};

/** @public */
export type GetRecommendationListRequest = {
  query: {
    cluster?: string[];
    workloadType?: string[];
    workload?: string[];
    container?: string[];
    project?: string[];
    startDate?: string;
    endDate?: string;
    offset?: number;
    limit?: number;
    orderBy?: string;
    orderHow?: string;
  };
};
