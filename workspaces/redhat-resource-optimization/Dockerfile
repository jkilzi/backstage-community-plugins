FROM registry.redhat.io/rhel9/nodejs-20 AS builder

ENV CI=true

COPY --chown=1001:0 . /opt/app-root/src

RUN npm i --force -g yarn

WORKDIR /opt/app-root/src/workspaces/redhat-resource-optimization

RUN  yarn install --immutable && scripts/dynamic-plugins.sh pack

FROM scratch AS final

COPY --from=builder /opt/app-root/src/workspaces/redhat-resource-optimization/dynamic-plugins-root .
