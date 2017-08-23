#!/usr/bin/env bash
cd ./node_modules/protractor-jasmine2-html-reporter/

# edit index.js
# find code string
# screenshotPath = path.join(self.savePath + self.screenshotsFolder, spec.screenshot);
# replace it with:
# screenshotPath = path.join(self.savePath + "/" + self.screenshotsFolder, spec.screenshot);
# save file
# EX: http://askubuntu.com/a/20416 & http://stackoverflow.com/a/5174368

old="savePath + self"
echo "Looking for:" $old

new="savePath + \"/\" + self"
echo "Replacing with: " $new

# Leaving backup .bak in case if command corrupts original file.
sed -i ".bak" "s|${old}|${new}|g" index.js

# return to the previous path
cd $OLDPWD