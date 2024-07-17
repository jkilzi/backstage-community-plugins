#!/usr/bin/bash

set -eu

dynamic_plugins_root_dir="$(dirname "$0")/../dynamic-plugins-root"
pkg=$1

archive=$(npm pack "$pkg")
tar -xzvf "$archive" && rm "$archive"
mv package "$dynamic_plugins_root_dir"/"${archive//.tgz/}"
