import React from 'react';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
// import { OptimizationsApi } from '@backstage-community/plugin-cost-management-client';

import exampleUsers from './example-users.json';
// import { DiscoveryApi } from '@backstage/core-plugin-api';
import { User } from './models/User';
import { DenseTable } from '../DenseTable/DenseTable';

// const client = new OptimizationsApi.OptimizationsApiClient({

// });

const delay = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ExampleFetchComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<User[]> => {
    // Would use fetch in a real world example
    const MILLISECONDS_2 = 2000;
    await delay(MILLISECONDS_2);
    return exampleUsers.results;
  }, []);

  // const { value, loading, error } = useAsync(async () => {
  //   return fetch('/api/proxy/cost-management/reccomendations', {
  //     headers: {
  //       'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICItTnhSYldvSkt1S2ZqV25Nc2VmemhzY1kySkNPSUFjdzUzLWJiSm1VTWhRIn0.eyJleHAiOjE3MTYzODgwMjcsImlhdCI6MTcxNjM4NzEyNywianRpIjoiZWZkYTk1NWMtNWQ3NC00MTY4LWE5YjEtMWE3ODA2MDk2YTkxIiwiaXNzIjoiaHR0cHM6Ly9zc28uc3RhZ2UucmVkaGF0LmNvbS9hdXRoL3JlYWxtcy9yZWRoYXQtZXh0ZXJuYWwiLCJzdWIiOiI1ZDU4NDZlYS05NjYwLTQ5MWMtOGMzZi1hZmZiYWIxNDU3NmIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiI0YTIzZmRkMy0xODk0LTQ4NTEtYmUxYy1jZjVlNDNhNTJmNzEiLCJzY29wZSI6Im9wZW5pZCBhcGkuaWFtLnNlcnZpY2VfYWNjb3VudHMiLCJjbGllbnRIb3N0IjoiMjMuNTIuNDEuMTgyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyaC11c2VyLWlkIjoiNTUxNzA0NzkiLCJyaC1vcmctaWQiOiIxNTk4NjI5OSIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC00YTIzZmRkMy0xODk0LTQ4NTEtYmUxYy1jZjVlNDNhNTJmNzEiLCJjbGllbnRBZGRyZXNzIjoiMjMuNTIuNDEuMTgyIiwiY2xpZW50X2lkIjoiNGEyM2ZkZDMtMTg5NC00ODUxLWJlMWMtY2Y1ZTQzYTUyZjcxIn0.p3CwruWstNm_npsY93fel0vgU1dgA1Xhgsq1QWZVxr3yk8N2FAjVx1sqY7WEHsyDveqdq8R14zdFXH2jaGXo8x5vzA2T1V4DwbgmuPC2AhjGL3gLDoXdD-N-tbpLWY3zMXLuX_Duxd6QmW1n5zRmPqWNaW8CEX2ZXv4l5_5fMI8et88aQJl7fRe65GhFXpSeHU-gTj6CTo-NFOx0Fffqp6BGN-t2dZRKCg0HcG5nnzLitGRdDvMhmwmPCaVa63sPzagVOwZYtwIlwYcAJoprerVFkcRYDkFzbRJOYgm5G8jhg7qO1hAB1XkTw6QNXFU99B785P1h7OfeWRvsHrqm1b7u0av4W2n4hCa2G63C_xOuWheeMZlVNlpiIHHJEcV2ythueNEtuE1bO6j5Vk3Hjzwti7ojzoBH4nEDMoAjblJFdM8y4tJCH2uJueawZCq-PCiSUItwsXD3mjBLQbb3kF_fTWSdihhJg5M9sICtS7Nd3zSm7-S60hYxZMl2UsVCkCZr5vNVDJbHk8ozqZ-TvOi1aNU4Azpbf6tL205rXF6vzhqkTtYtbxJJNU20vD2Xb5Dvpe7swL8DhfUHGhTDMzZSjyxeA9BTQGjOsmv9QasRv00n9-cLeAEKSXXzmlzsdRUxuyBot0F4xGUK_RqqTlzDGGijueCQIWX13MMkrsQ',
  //     }
  //   })
  // }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable users={value || []} />;
  
  // return value;
};
