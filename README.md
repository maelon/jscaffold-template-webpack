# jscaffold-template-webpack

## What?
This is a jscaffold template with webpack. You can use this with vue, react and so on.

## Why?
In some spa projects, we build all the source files into one js file, thus the browser would load slowly.
And some times there are many entries in hybird app according to different spa router.

## How?
So we need to split code into modules, and load them asynchronously.

We split code with `require.ensure`, build with command `npm run build`, so we get dist directory.

In thie directory:
* vinfo.json

  eg: 
  ```json
  {
	"buildHash": "235b576d1f7ba5d42ee4",
	"buildDate": "12/6/2016, 7:14:30 PM",
	"buildVersion": "v1.0.0",
	"buildNumber": "20161107v1",
    'cache': true,
	"moduleList": [
		{
			"name": "load",
			"hash": "be311daea3cecaaca032",
			"type": "js"
		},
		{
			"name": "baselib",
			"hash": "936321dc7394e195df36",
			"type": "js"
		},
		{
			"name": "app",
			"hash": "5069bbe8821e4ba61b7b",
			"type": "js"
		}
	],
    "ios": {
        "buildVersion": "v1.1.0",
        "moduleList": [
            {
                "name": "load",
                "hash": "ajsdflkjasdlfjaskdjf",
                "type": "js"
            }
        ]
    },
    "other": {
        "moduleList": [
            {   
                "name": "load",
                "hash": "ajsdflkjasdlfjaskdjf",
                "type": "js"
            }
        ]
    }
  }
  ```

  This json file describes build info.
  * `buildVersion` This is important. Builded according to ___src/config.js___ (the version pattern).
  * `buildNumber` This is build number (GNU version style).
  * `cache` This tells to store base modules in localStorage and load them from next time. Remove "--cache" from package.json will load base modules always from server.
  * `moduleList` This is the default base modules need to load in the browser in sequence.
  * `ios` This specifys ios devices modules loaded.
  * `android` This specifys android devices modules loaded.
  * `other` This specifys other runtime modules loaded.

  Especially, the module config in ios|android|other will override the default one.

* index.html
  This will load modules in vinfo.json in seqence.
  In the root directory, file index.html is the template of this.

All other files will be placed in the version directory.
* File load is webpack loader, which webpack modules load info is in it.
* File baselib is the base library used in project. eg: vue, chartjs...
* File app is the project main file.
* File buildNumber.json is a build history.
* Other asynchronous modules will be placed in modules directory with their names.
