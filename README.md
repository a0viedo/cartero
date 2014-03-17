

An asset pipeline based on commonjs and built on [browserify](http://browserify.org/). 

## Benefits

* Get your javascript, css, and other assets where you need them to be, in the form you need them to be in.
* Include css and images in npm modules and then serve them directly to your rendered pages.
* Keep assets used by a particular view template in the same folder as the view.
* Easily serve only the assets that are required by each page in multi-page applications.

## How dat work?

Cartero let's you organize your application so that the assets that pertain to a particular view are kept in the same folder as the view's template, and assets needed by multiple views can be kept in a `node_modules` directory and pulled in using `require( 'my-module' )`. For example, consider the following directory structure:

```
├── node_modules
│   └── my-module
│       ├── index.js
│       ├── icon.png
│       ├── package.json
│       └── style.scss
└── views
    ├── page1
    │   ├── package.json
    │   ├── page1.jade
    │   ├── style.css
    │   └── index.js
    └── page2
        ├── package.json
        ├── style.css
        ├── page2.jade
        └── index.js
```

The `package.json` for each package enumerates the style and image assets in the package. For instance, `my-module/package.json`:

```
{
	"style" : "*.scss",
	"image" : "*.png",
	"transforms" : [ "scss-css-stream" ]
}
```

Additionally, packages located in the `views` directory may contain a `view` key that specifies a server side view template in that package. Such packages are called __parcels__. For instance, `page1` is a parcel because it is in the `views` directory and `page1/package.json` contains:

```
{
	"view" : "page1.jade",
	"style" : "*.css"
}
```

At build time, Cartero runs through every parcel, computing the list of assets that is needed by each by inspecting the browserify dependency graph. The assets, transformed and concatinated / minified as appropriate, are dropped into your static directory, along with an inventory of what assets are needed by what parcels. At run time, your application uses the cartero hook to find the assets associated with a given view when that view is rendered. The result is that each view gets the assets it needs in the form it needs them in.


## Usage

```
$ npm install -g cartero
$ cartero views static/assets
```

## Command line options

```
-packageFilter, -pf		Path of JavaScript file that exports a function that transforms package.json
						files before they are used. The function should be of the signature 
						function( pkgJson, dirPath ) and return the parsed, transformed package.json.
						This feature can be used to add default values to package.json files or
						extend the package.json of third party modules without modifying them directly.

--dev, -d       		Dev mode - keep css files separate, don't apply post processors, and enable
						source maps on browserify bundles.

--watch, -w      		Watch mode - watch for changes and update output as appropriate.

--postProcessors, -p	The name of a post process module to apply to assets in prod mode (e.g. uglify js, minify css, compress images).

--help, -h       		Show this message

```

## Contributers

* [James Halliday](https://twitter.com/substack)
* [Oleg Seletsky](https://github.com/go-oleg)
* [David Beck](https://twitter.com/davegbeck)

## License

MIT
