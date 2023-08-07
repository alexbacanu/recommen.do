#!/bin/bash

# Cleanup
rm -r ../recommen.do-mozilla

# Destination dir
dest_dir="../recommen.do-mozilla"

# Make src folder
mkdir -p $dest_dir

# Copy folders required for building firefox
cp -r ./src ./public ./assets $dest_dir

# Copy files in the root directory
cp ./* $dest_dir

# Copy .env file
cp ./.env.mozilla.local $dest_dir/.env

# Make src folder working dir
cd $dest_dir

# Remove unnecessary directories
rm -rf ./src/components/_analytics ./README.md

# Install packages
# pnpm i

# Build plasmo firefox
# pnpm run build:plasmo-firefox

# Compare builds
# diff -y <(unzip -l ./build/firefox-mv2-prod.zip) <(unzip -l ../recommen.do/build/firefox-1.0.5.zip)
