## Installing as Dynamic Plugin

Unlike static plugins that necessitate source code modifications, dynamic plugins can be seamlessly integrated through configuration entries in the `app-config.yaml` file.
Red Hat Developer Hub (RHDH) leverages dynamic plugins to efficiently deploy plugins on a Backstage instance.

The procedure involves the following steps:

1. First and foremost, you must follow [these instructions](https://github.com/janus-idp/backstage-showcase/blob/main/docs/dynamic-plugins/export-derived-package.md) to understand how to export this plugin as a dynamic plugin.
2. Ensure you are familiar with the [RHDH configuration docs](https://docs.redhat.com/en/documentation/red_hat_developer_hub/1.3/html/administration_guide_for_red_hat_developer_hub/assembly-add-custom-app-file-openshift_admin-rhdh#proc-add-custom-app-config-file-ocp-operator_admin-rhdh)

3. Specially, make sure you have configured

   - ConfigMaps: `app-config-rhdh`, `dynamic-plugins-rhdh`
   - Secrets: `secrets-rhdh`

4. Add the following configuration to each one of the objects mentioned above respectively

   ```yaml
   # Add to secrets-rhdh Secret

   ROS_CLIENT_ID: # <as base64 string>
   ROS_CLIENT_SECRET: # <as base64 string>
   ```

   ```yaml
   # Add to app-config-rhdh ConfigMap

   proxy:
     endpoints:
       '/cost-management/v1':
         target: https://console.redhat.com/api/cost-management/v1
         allowedHeaders: ['Authorization']
         credentials: dangerously-allow-unauthenticated
     resourceOptimization:
       clientId: '${ROS_CLIENT_ID}'
       clientSecret: '${ROS_CLIENT_SECRET}'
   ```

   ```yaml
   # Add to dynamic-plugins-rhdh ConfigMap

   - package: oci://quay.io/redhat-resource-optimization/dynamic-plugins:1.1.0-rc.7!backstage-community-plugin-redhat-resource-optimization
      disabled: false
      pluginConfig:
        dynamicPlugins:
          frontend:
            backstage-community.plugin-redhat-resource-optimization:
              appIcons:
                - name: resourceOptimizationIconOutlined
                  importName: ResourceOptimizationIconOutlined
              dynamicRoutes:
                - path: /redhat-resource-optimization
                  importName: ResourceOptimizationPage
                  menuItem:
                    icon: resourceOptimizationIconOutlined
                    text: Optimizations
    - package: oci://quay.io/redhat-resource-optimization/dynamic-plugins:1.1.0-rc.7!backstage-community-plugin-redhat-resource-optimization-backend
      disabled: false
      pluginConfig:
        proxy:
          endpoints:
            '/cost-management/v1':
              target: https://console.redhat.com/api/cost-management/v1
              allowedHeaders: ['Authorization']
              credentials: dangerously-allow-unauthenticated
        resourceOptimization:
          clientId: ${ROS_CLIENT_ID}
          clientSecret: ${ROS_CLIENT_SECRET}
          optimizationWorkflowId: 'patch-k8s-resource'
   ```

   ### References

   [Installing ROS-OCP RHDH plugin on Red Hat Developer Hub on a Openshift Cluster](https://docs.google.com/document/d/1tExe7cEBYMJplkk9ppSdBINwE-14KmxURczGjloHqZ4/edit?usp=sharing)
