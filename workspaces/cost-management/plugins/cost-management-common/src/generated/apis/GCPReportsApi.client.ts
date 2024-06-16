//

// ******************************************************************
// * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY. *
// ******************************************************************
import { DiscoveryApi } from '../types/discovery';
import { FetchApi } from '../types/fetch';
import crossFetch from 'cross-fetch';
import {pluginId} from '../pluginId';
import * as parser from 'uri-template';

import { ReportCost } from '../models/ReportCost.model';
import { ReportInstanceInventory } from '../models/ReportInstanceInventory.model';
import { ReportStorageInventory } from '../models/ReportStorageInventory.model';

/**
 * Wraps the Response type to convey a type on the json call.
 *
 * @public
 */
export type TypedResponse<T> = Omit<Response, 'json'> & {
  json: () => Promise<T>;
};


/**
 * Options you can pass into a request for additional information.
 *
 * @public
 */
export interface RequestOptions {
  token?: string;
}

/**
 * no description
 */
export class GCPReportsApiClient {
    private readonly discoveryApi: DiscoveryApi;
    private readonly fetchApi: FetchApi;

    constructor(options: {
        discoveryApi: { getBaseUrl(pluginId: string): Promise<string> };
        fetchApi?: { fetch: typeof fetch };
    }) {
        this.discoveryApi = options.discoveryApi;
        this.fetchApi = options.fetchApi || { fetch: crossFetch };
    }

    /**
     * Query to obtain cost reports
     * @param delta Toggle to include delta values in report.
     * @param filter The filter to apply to the report as a URL encoded dictionary.
     * @param groupBy The grouping to apply to the report as a URL encoded dictionary. The syntax is group_by[parameter]&#x3D;value except for tags, which use group_by[tag:key]&#x3D;value.
     * @param orderBy The ordering to apply to the report as a URL encoded dictionary. The syntax is order_by[field]&#x3D;order. Use &#39;asc&#39; for ascending and &#39;desc&#39; for descending.
     * @param offset Parameter for selecting the offset of data.
     * @param limit Parameter for selecting the amount of data in a returned. Limit of 0 will return all data.
     * @param startDate String to indicate start date of date range.
     * @param endDate String to indicate end date of date range.
     */
    public async getGCPCostReports(
        // @ts-ignore
        request: {
            query: {
                delta?: string,
                filter?: any,
                groupBy?: any,
                orderBy?: any,
                offset?: number,
                limit?: number,
                startDate?: string,
                endDate?: string,
            },
        },
        options?: RequestOptions
    ): Promise<TypedResponse<ReportCost >> {
        const baseUrl = await this.discoveryApi.getBaseUrl(pluginId);

        const uriTemplate = `/reports/gcp/costs/{?delta,filter,group_by,order_by,offset,limit,start_date,end_date}`;

        const uri = parser.parse(uriTemplate).expand({
            ...request.query,
        })

        return await this.fetchApi.fetch(`${baseUrl}${uri}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(options?.token && { Authorization: `Bearer ${options?.token}` }),
            },
            method: 'GET',
            
        });
    }

    /**
     * Query to obtain GCP instance type data
     * @param filter The filter to apply to the report as a URL encoded dictionary.
     * @param groupBy The grouping to apply to the report as a URL encoded dictionary. The syntax is group_by[parameter]&#x3D;value except for tags, which use group_by[tag:key]&#x3D;value.
     * @param orderBy The ordering to apply to the report as a URL encoded dictionary. The syntax is order_by[field]&#x3D;order. Use &#39;asc&#39; for ascending and &#39;desc&#39; for descending.
     * @param offset Parameter for selecting the offset of data.
     * @param limit Parameter for selecting the amount of data in a returned. Limit of 0 will return all data.
     * @param startDate String to indicate start date of date range.
     * @param endDate String to indicate end date of date range.
     */
    public async getGCPInstanceReports(
        // @ts-ignore
        request: {
            query: {
                filter?: any,
                groupBy?: any,
                orderBy?: any,
                offset?: number,
                limit?: number,
                startDate?: string,
                endDate?: string,
            },
        },
        options?: RequestOptions
    ): Promise<TypedResponse<ReportInstanceInventory >> {
        const baseUrl = await this.discoveryApi.getBaseUrl(pluginId);

        const uriTemplate = `/reports/gcp/instance-types/{?filter,group_by,order_by,offset,limit,start_date,end_date}`;

        const uri = parser.parse(uriTemplate).expand({
            ...request.query,
        })

        return await this.fetchApi.fetch(`${baseUrl}${uri}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(options?.token && { Authorization: `Bearer ${options?.token}` }),
            },
            method: 'GET',
            
        });
    }

    /**
     * Query to obtain GCP storage data
     * @param filter The filter to apply to the report as a URL encoded dictionary.
     * @param groupBy The grouping to apply to the report as a URL encoded dictionary. The syntax is group_by[parameter]&#x3D;value except for tags, which use group_by[tag:key]&#x3D;value.
     * @param orderBy The ordering to apply to the report as a URL encoded dictionary. The syntax is order_by[field]&#x3D;order. Use &#39;asc&#39; for ascending and &#39;desc&#39; for descending.
     * @param offset Parameter for selecting the offset of data.
     * @param limit Parameter for selecting the amount of data in a returned. Limit of 0 will return all data.
     * @param startDate String to indicate start date of date range.
     * @param endDate String to indicate end date of date range.
     */
    public async getGCPStorageReports(
        // @ts-ignore
        request: {
            query: {
                filter?: any,
                groupBy?: any,
                orderBy?: any,
                offset?: number,
                limit?: number,
                startDate?: string,
                endDate?: string,
            },
        },
        options?: RequestOptions
    ): Promise<TypedResponse<ReportStorageInventory >> {
        const baseUrl = await this.discoveryApi.getBaseUrl(pluginId);

        const uriTemplate = `/reports/gcp/storage/{?filter,group_by,order_by,offset,limit,start_date,end_date}`;

        const uri = parser.parse(uriTemplate).expand({
            ...request.query,
        })

        return await this.fetchApi.fetch(`${baseUrl}${uri}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(options?.token && { Authorization: `Bearer ${options?.token}` }),
            },
            method: 'GET',
            
        });
    }

}
export type GCPReportsApi = InstanceType<typeof GCPReportsApiClient>;