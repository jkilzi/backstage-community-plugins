#!/bin/bash

set -eu

script_path=$(realpath "${BASH_SOURCE:-$0}")
script_dir_path=$(dirname $script_path)
workspace_dir=$(dirname $script_dir_path)

REGISTRY_URL="${REGISTRY_URL:-'quay.io'}"
ORG_ID="${ORG_ID:-'redhat-resource-optimization'}"
REPO="${REPO:-'dynamic-plugins'}"
VERSION="${VERSION:-''}"

# Executes the container management tool
function _cmt {
  eval "$((command -v podman) || (command -v docker)) $@"
}

function _get_cmt_flag {
  (command -v docker) && echo -n '--use-docker'
}

function _get_version {
  if [[ "$VERSION" != '' ]]; then
    echo $VERSION
  else
    # Grab the version from the front-end package, assuming the back-end package will always have the same version
    jq -r '.version' $workspace_dir/plugins/redhat-resource-optimization/package.json
  fi
}

function _tsc {
  echo "Running tsc, please wait..."
  yarn tsc
}

function _januscli_dynamic_plugins {
  yarn janus-cli package package-dynamic-plugins "$@"
}

function cleanup {
  rm -rf $workspace_dir/dist-types $workspace_dir/plugins/*/dist-dynamic || true
}

function export {
  _tsc
  _januscli_dynamic_plugins $(_get_cmt_flag) --export-to $workspace_dir/dynamic-plugins-root
}

function build {
  _tsc
  _januscli_dynamic_plugins $(_get_cmt_flag) --tag $REGISTRY_URL/$ORG_ID/$REPO:v$(_get_version)
}

function publish {
  build
  _cmt push $REGISTRY_URL/$ORG_ID/$REPO:v$(_get_version)
}

"$@"
