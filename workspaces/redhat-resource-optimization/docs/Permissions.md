The redhat-resource-optimization plugin protects its backend endpoints with the builtin permission mechanism and combines it with the RBAC plugin.

## redhat-resource-optimization plugin Permissions

| Name               | Resource Type | Policy | Description                                                                                                           |
| ------------------ | ------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| ros.plugin         | -             | read   | Allows the user to read from the redhat-resource-optimization plugin and give access to all the data                  |
| ros.{CLUSTER_NAME} | -             | read   | Allows the user to read from the redhat-resource-optimization plugin and give access to the data of specified Cluster |

## Enable permissions

To enable permissions, you need to add the following in the [app-config file](../app-config.yaml):

```
permission:
  enabled: true
  rbac:
    policies-csv-file: <absolute path to the policy file>
    policyFileReload: true
    admin:
      users:
        - name: user:default/YOUR_USER
```

## Defining Policy File

To get started with policies, we recommend defining roles and assigning them to groups or users.

As an example, check the following [policy file](../plugins/redhat-resource-optimization-common/rbac-policy.csv)

### ros.plugin Permission

Since the `test_user_1` user has the `default/rosUser` role, which has `ros.plugin` permission, it can:

- See the list of all the clusters and projects specified under the service account which is specified in the [app-config file](../app-config.yaml) file using `clientId` and `clientSecret` and optimization recommendations for the same.

```csv
p, role:default/rosUser, ros.plugin, read, allow

g, user:default/test_user_1, role:default/rosUser
```

### ros.{CLUSTER_NAME}

Since the `test_user_2` user has the `default/rosClusterUser` role, which has `ros.OpenShift on AWS` permission, it can:

- See the list of records for OpenShift on AWS cluster under the service account which is specified in the [app-config file](../app-config.yaml) file using `clientId` and `clientSecret` and optimization recommendations for the same.

```csv
p, role:default/rosClusterUser, ros.OpenShift on AWS, read, allow

g, user:default/test_user_2, role:default/rosClusterUser
```

See https://casbin.org/docs/rbac for more information about casbin rules.
