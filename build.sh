#!/bin/bash
###############################################################################
# Build in Ubuntu Linux
###############################################################################
echo
echo Builder must be run as root or sudo
echo
#
# Cleanup build files 
#
echo -n "Skip build and clean up project files? (y/n)?"
read SKIPPROMPT

case $SKIPPROMPT in

  y)
    rm -fdr ./build/webrcade*
    exit
    ;;

  n)
    ;;
esac

#
# Install and update prerequisites
#
apt-get update -y
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
apt-get install -y nodejs
apt-get install -y zip
apt-get install -y git

#
# Clone main repository (https://github.com/KingIzzymon/webrcade-dev.git)
#
mkdir build && cd build
DIR="$( pwd )"
git clone https://github.com/webrcade/webrcade.git
mv webrcade ./webrcade-temp
cd webrcade-temp

#
# Setup directories and purge unnecessary files
#
mkdir ../webrcade
mv \
  copy-default-feed.js \
  dist.sh \
  dist-package.sh \
  dist-clone-deps.sh \
  dist-version.sh \
  package.json \
  package-lock.json \
  VERSION \
  ../webrcade/
mv public ../webrcade/public
mv CHANGELOG.md ../webrcade/public
mv src ../webrcade/src

cd $DIR
chmod +x ./webrcade/dist.sh && \
chmod +x ./webrcade/dist-package.sh && \
chmod +x ./webrcade/dist-clone-deps.sh && \
chmod +x ./webrcade/dist-version.sh

#
# Clone dependencies & Build
#
./webrcade/dist-clone-deps.sh

mv -f ./webrcade-temp/docker/config.json ./webrcade-app-common/src/conf/

cd webrcade && \
  ./dist-version.sh "Docker Build" && \
  ./dist.sh
wget -O - https://webrcade.github.io/webrcade-utils/cors.php > $DIR/webrcade/dist/out/cors.php
cd $DIR/webrcade && \
  ./dist-package.sh

#
# Move package to build directory
#
mv ./dist/webrcade-dist.zip $DIR/build.zip
echo
echo Complete! --> build.zip
echo
#
# Cleanup build files 
#
echo -n "Clean up and delete project files? (y/n)"
read CLEANUPPROMPT

case $CLEANUPPROMPT in

  y)
    rm -fdr ./build/webrcade*
    ;;

  n)
    exit
    ;;
esac
