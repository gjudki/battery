# Battery
# API/website status checker

This is a script that you can run to see if everything that matters to you is running OK.

## config.json

- Processors: file path reference to js files that export an array of URLS. This let's you define URLS programmatically
- URLS: statically defined list of URLS to check
- Logging: when set to true, will create a [log].txt file

## config-test.json

Example config file. Rename to 'config.json' in order to see something happen.

## Run it

Run the script with `node battery`

This command accepts one argument, which is a filter. The filter is applied to all of the urls that would normally run in a blanket test, so if you run `node battery qa2`, you would only run it against URLS that contain the "qa2" string.

## Requirements

1. Node version must support ES6 features
2. NPM install `npm install`

** Will be adding the ability to run a single "process" with an additional argument.

** Will add the ability to leave the script running, and periodically check sites that are down.
