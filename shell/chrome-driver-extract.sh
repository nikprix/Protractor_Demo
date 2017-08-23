#!/usr/bin/env bash
cd ./node_modules/protractor/node_modules/webdriver-manager/selenium/
# find and extract zipped chrome driver
find . -name '*.zip' -execdir unzip '{}' ';'
# return to the previous path
cd $OLDPWD
