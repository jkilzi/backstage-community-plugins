import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  Table,
  ResponseErrorPanel,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { optimizationsApiRef } from '../../api/refs';
import { Recommendations } from '@backstage-community/plugin-resource-optimization-common';
import { columns } from '../Tables/columns';
import {
  CatalogFilterLayout,
  EntityListProvider,
} from '@backstage/plugin-catalog-react';
import { SearchFilterComponent } from '../Filters/SearchFilter';

export default {
  title: 'Plugins/Examples',
  component: Page,
};

type SortOrder = 'asc' | 'desc';

export interface filtersType {
  containerFilter: string[];
  clusterFilter: string[];
  projectFilter: string[];
  workloadFilter: string[];
  workloadTypeFilter: string[];
}

export const ExampleComponent = () => {
  const api = useApi(optimizationsApiRef);

  const [page, setPage] = useState(0); // first page starts at 0
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [orderBy, setOrderBy] = useState('last_reported');
  const [orderDirection, setOrderDirection] = useState<SortOrder>('desc');

  const [filters, setFilers] = useState<filtersType>({
    containerFilter: [],
    clusterFilter: [],
    projectFilter: [],
    workloadFilter: [],
    workloadTypeFilter: [],
  });

  const { value, loading, error } = useAsync(async () => {
    const offsetValue = page * rowsPerPage;

    const apiQuery: Parameters<typeof api.getRecommendationList>[0]['query'] = {
      limit: rowsPerPage,
      offset: offsetValue,
      orderBy: orderBy,
      orderHow: orderDirection,
    };

    if (filters.containerFilter) {
      apiQuery.container = filters.containerFilter;
    }

    if (filters.projectFilter) {
      apiQuery.project = filters.projectFilter;
    }

    if (filters.workloadFilter) {
      apiQuery.workload = filters.workloadFilter;
    }

    if (filters.workloadTypeFilter) {
      apiQuery.workloadType = filters.workloadTypeFilter;
    }

    if (filters.clusterFilter) {
      apiQuery.cluster = filters.clusterFilter;
    }

    const response = await api.getRecommendationList({
      query: apiQuery,
    });
    const payload = await response.json();

    return payload;
  }, [rowsPerPage, page, orderBy, orderDirection, filters]);

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const handleChangeRowsPerPage = (pageSize: number) => {
    setRowsPerPage(pageSize);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setPage(page);
  };

  const handleOnOrderChange = (orderBy: number, orderDirection: SortOrder) => {
    if (orderBy >= 0) {
      setOrderBy(`${columns[orderBy].field}`);
      setOrderDirection(orderDirection);
    }
  };

  const handleOnSearchChange = (searchText: string) => {
    setFilers(prevState => ({
      ...prevState,
      containerFilter: [searchText],
    }));
  };

  const handleFilterChange = (
    filtersValue: string[],
    filterKey: keyof filtersType,
  ) => {
    setFilers(prevState => ({
      ...prevState,
      [filterKey]: filtersValue,
    }));
  };

  const tableTitle = `Optimizable containers (${value?.meta?.count || 0})`;

  return (
    <Page themeId="tool">
      <Header title="Resource Optimization" />
      <Content>
        <ContentHeader title="">
          <SupportButton>All your optimizations</SupportButton>
        </ContentHeader>

        <EntityListProvider>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <Typography variant="h6">Filters</Typography>
              <hr></hr>
              <SearchFilterComponent
                filterLabel="CLUSTER"
                filterKey="clusterFilter"
                onFilterChange={handleFilterChange}
              />

              <SearchFilterComponent
                filterLabel="PROJECT"
                filterKey="projectFilter"
                onFilterChange={handleFilterChange}
              />

              <SearchFilterComponent
                filterLabel="Workload"
                filterKey="workloadFilter"
                onFilterChange={handleFilterChange}
              />

              <SearchFilterComponent
                filterLabel="Workload Type"
                filterKey="workloadTypeFilter"
                onFilterChange={handleFilterChange}
              />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <Table<Recommendations>
                title={tableTitle}
                options={{
                  debounceInterval: 700,
                  paging: true,
                  search: true,
                  padding: 'dense',
                  thirdSortClick: false,
                }}
                data={value?.data || []}
                isLoading={loading}
                columns={columns}
                totalCount={value?.meta?.count || 0}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onOrderChange={handleOnOrderChange}
                onSearchChange={handleOnSearchChange}
              />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
      </Content>
    </Page>
  );
};
