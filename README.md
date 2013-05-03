#INSTRUCTIONS

clone this repository
```shell
git clone https://github.com/rotundasoftware/assetBundler.git
```
cd to your application directory and install
```shell
npm install path/to/assetBundler/
```
update your package.json to include the following dependencies (list to be trimmed down)

    "express": "3.1.0",
    "grunt": "~0.4.1",
    "underscore": "~1.4.4",
    "underscore.string": "~2.3.1",
    "findit": "~0.1.2",
    "swig": "~0.13.5",
    "consolidate": "~0.9.0",
    "path": "~0.4.9",
    "grunt-contrib-copy": "~0.4.1",
    "grunt-contrib-clean": "~0.4.1",
    "grunt-contrib-sass": "~0.3.0",
    "grunt-contrib-less": "~0.5.1",
    "grunt-contrib-coffee": "~0.7.0",
    "grunt-contrib-stylus": "~0.5.0",
    "grunt-contrib-concat": "~0.3.0",
    "grunt-contrib-watch": "~0.3.1",
    "grunt-bundler": "~0.1.0",
    "grunt-contrib-uglify": "~0.2.0",
    "grunt-contrib-htmlmin": "~0.1.3",
    "grunt-contrib-compass": "~0.2.0"
    
```shell
npm install
```

copy the Gruntfile.js from examples/bundler_sample_1 and modify appropriately

TODOs:
* support "*" wildcard character for bundle dependencies
* do more processing at build time vs runtime for pageMap.json and bundleMap.json
* break task options into separate assetLibrary and appPages hashes