import crossFetch from 'cross-fetch';
import camelCase from 'lodash/camelCase';
import {
  OptimizationsApiClient,
  RequestOptions,
  TypedResponse,
} from './generated/apis/OptimizationsApi.client';
import { pluginId } from './generated/pluginId';
import type { OptimizationsApi as OptimizationsApiInternal } from './generated/apis';
import type {
  RecommendationBoxPlots,
  RecommendationList,
} from './generated/models';
import type { DiscoveryApi } from './generated/types/discovery';
import type { FetchApi } from './generated/types/fetch';
import type { GetTokenResponse } from './types/token';
import { deepMapKeys } from '@y0n1/json/deep-map-keys';

export type OptimizationsApi = Omit<
  OptimizationsApiInternal,
  'fetchApi' | 'discoveryApi'
>;

export class OptimizationsClient implements OptimizationsApi {
  private readonly _discoveryApi: DiscoveryApi;
  private readonly _fetchApi: FetchApi;
  private readonly _client: OptimizationsApiClient;
  private _token?: string;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this._client = new OptimizationsApiClient({
      fetchApi: options.fetchApi,
      discoveryApi: {
        async getBaseUrl() {
          const baseUrl = await options.discoveryApi.getBaseUrl('proxy');
          return `${baseUrl}/cost-management/v1`;
        },
      },
    });
    this._discoveryApi = options.discoveryApi;
    this._fetchApi = options.fetchApi || { fetch: crossFetch };
  }

  private async getNewToken(): Promise<GetTokenResponse> {
    const baseUrl = await this._discoveryApi.getBaseUrl(`${pluginId}`);
    const response = await this._fetchApi.fetch(`${baseUrl}/token`);
    const data = (await response.json()) as GetTokenResponse;
    return data;
  }

  private async fetchWithToken<
    F extends (this: OptimizationsApiClient, ...args: any[]) => any,
  >(asyncOp: F, request: Parameters<F>[0]): Promise<Awaited<ReturnType<F>>> {
    if (!this._token) {
      const { accessToken } = await this.getNewToken();
      this._token = accessToken;
    }

    let response: Awaited<ReturnType<F>> = await asyncOp.call(
      this._client,
      request,
      {
        token: this._token,
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        const { accessToken } = await this.getNewToken();
        this._token = accessToken;

        response = await asyncOp.call(this._client, request, {
          token: this._token,
        });
      } else {
        throw new Error(response.statusText);
      }
    }

    const data = await response.json();
    const transformedData = deepMapKeys(data, camelCase);

    return {
      ...response,
      json: () => Promise.resolve(transformedData),
    };
  }

  public async getRecommendationById(
    request: {
      path: { recommendationId: string };
      query: {
        memoryUnit?: 'bytes' | 'MiB' | 'GiB' | undefined;
        cpuUnit?: 'millicores' | 'cores' | undefined;
      };
    },
    _options?: RequestOptions,
  ): Promise<TypedResponse<RecommendationBoxPlots>> {
    const response = await this.fetchWithToken(
      this._client.getRecommendationById,
      request,
    );

    return response;
  }

  public async getRecommendationList(
    request: {
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
    },
    _options?: RequestOptions,
  ): Promise<TypedResponse<RecommendationList>> {
    const response = await this.fetchWithToken(
      this._client.getRecommendationList,
      request,
    );

    return response;
  }
}
