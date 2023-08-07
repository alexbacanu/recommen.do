#!/bin/bash

# Unix programming convention to exit if any command return with a nonzero exit value
set -e

for file in ./build/*-mv*-prod.zip; do
  base=$(basename "$file")
  name="${base%%-*}"
  mv "$file" "./build/$name-1.0.5.zip"
done
