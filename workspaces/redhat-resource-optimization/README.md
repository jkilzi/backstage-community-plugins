# Welcome to the Resource Optimization plugin workspace

# Resource Optimization

Welcome to the Resource Optimization plugin!

Based on [Project Koku](https://github.com/project-koku/koku), the Resource Optimization plugin allows users to visualize usage trends and receive optimization recommendations for workloads running on OpenShift clusters.

## Getting started

### Prerequisite

The plugin consumes services from [Red Hat Hybrid Cloud Console](https://console.redhat.com/openshift/cost-management/optimizations), therefore your clusters [must be configured to receive optimization recommendations](https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html-single/getting_started_with_resource_optimization_for_openshift/index).  
To get started, [create a service account](https://console.redhat.com/application-services/service-accounts) and assign it the `Cost OpenShift Viewer` role from the Red Hat Hybrid Cloud Console.

### Setup

#### Static plugin

1. Add the dependencies

   ```sh
   # From your Backstage root directory
   yarn --cwd packages/app add @backstage-community/plugin-redhat-resource-optimization
   yarn --cwd packages/backend add @backstage-community/plugin-redhat-resource-optimization-backend
   ```

1. Update your `app-config.yaml` file

   ```yaml
   # app-config.yaml

   proxy:
     endpoints:
       '/cost-management/v1':
         target: https://console.redhat.com/api/cost-management/v1
         allowedHeaders: ['Authorization']
         # See: https://backstage.io/docs/releases/v1.28.0/#breaking-proxy-backend-plugin-protected-by-default
         credentials: dangerously-allow-unauthenticated

   # Replace `${RHHCC_SA_CLIENT_ID}` and `${RHHCC_SA_CLIENT_SECRET}` with the service account credentials.
   resourceOptimization:
     clientId: ${RHHCC_SA_CLIENT_ID}
     clientSecret: ${RHHCC_SA_CLIENT_SECRET}
     // TODO: add config info around workflow here
   ```

1. Add the back-end plugin to `packages/backend/src/index.ts`

   ```ts
   backend.add(
     import('@backstage-community/plugin-redhat-resource-optimization-backend'),
   );
   ```

1. Add the `ResourceOptimizationPage` extension to your `App.tsx` routes

   ```ts
   // packages/app/src/App.tsx

   import { ResourceOptimizationPage } from '@backstage-community/plugin-redhat-resource-optimization';

   <FlatRoutes>
     ...
     <Route
       path="/redhat-resource-optimization"
       element={<ResourceOptimizationPage />}
     />
     ...
   </FlatRoutes>;
   ```

1. Add a link to the Resource Optimization page in the side bar

   ```diff
   // packages/app/src/components/Root/Root.tsx

   + import { ResourceOptimizationIconOutlined } from '@backstage-community/plugin-redhat-resource-optimization';

   export const Root = ({ children }: PropsWithChildren<{}>) => (
     <SidebarPage>
       <Sidebar>
         <SidebarLogo />
         <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
           <SidebarSearchModal />
         </SidebarGroup>
         <SidebarDivider />
         <SidebarGroup label="Menu" icon={<MenuIcon />}>
           {/* Global nav, not org-specific */}
           <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
           <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
           <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
           <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
           {/* End global nav */}
           <SidebarDivider />
           <SidebarScrollWrapper>
             <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
           </SidebarScrollWrapper>
   +       <SidebarItem
   +         icon={ResourceOptimizationIconOutlined}
   +         to="/redhat-resource-optimization"
   +         text="Optimizations"
   +       />
         </SidebarGroup>
         <SidebarSpace />
         <SidebarDivider />
         <SidebarGroup
           label="Settings"
           icon={<UserSettingsSignInAvatar />}
           to="/settings"
         >
           <SidebarSettings />
         </SidebarGroup>
       </Sidebar>
       {children}
     </SidebarPage>
   );
   ```

#### Dependency on Orchestrator plugin and Workflow details

The Resource Optimization plugin is dependent on [Orchestrator plugin](https://www.rhdhorchestrator.io/main/docs/) to run the workflow for applying the recommendation. Make sure you have installed the [Orchestrator plugin](https://www.rhdhorchestrator.io/main/docs/) by following its [documentation](https://github.com/redhat-developer/rhdh-plugins/tree/main/workspaces/orchestrator#install-as-a-static-plugin).

### Contributing

- [License Apache 2.0](../../LICENSE.md)
- [DCO](../../DCO.md)
- Find more details in the [Resource Optimization back-end](../redhat-resource-optimization-backend/README.md) part of this plugin.
