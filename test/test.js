var os = require( 'os' );
var cartero = require( '../index' );
var path = require( 'path' );
var test = require( 'tape' );
var fs = require( 'fs' );
var crypto = require( 'crypto' );
var _ = require( 'underscore' );

test( 'page1', function( t ) {
	t.plan( 4 );

	var viewDirPath = path.join( __dirname, 'example1/views' );
	var dstDir = path.join( __dirname, 'example1/static/assets' );
	var packageId, viewRelativePathHash;

	var c = cartero( viewDirPath, dstDir, {} );

	c.on( 'packageCreated', function( newPackage, isMain ) {
		if( isMain ) {
			packageId = newPackage.id;
			viewRelativePathHash = crypto.createHash( 'sha1' ).update( path.relative( viewDirPath, newPackage.view ) ).digest( 'hex' );
		}
	} );

	c.on( 'done', function() {
		t.deepEqual(
			fs.readdirSync( dstDir ).sort(),
			[ packageId, 'view_map.json' ]
		);

		t.deepEqual( fs.readFileSync( path.join( dstDir, 'view_map.json' ), 'utf8' ), '{\n    \"' + viewRelativePathHash + '\": \"' + packageId +'\"\n}' );
	
		t.deepEqual(
			fs.readdirSync( path.join( dstDir, packageId ) ).sort(),
			[ 'assets.json', 'page1_bundle_9238125c90e5cfc790e8a5ac8926185dfb162b8c.css', 'page1_bundle_d4d3df760297139ea6f4ec7b2296537fe86efe67.js' ]
		);

		t.deepEqual( fs.readFileSync( path.join( dstDir, packageId, 'page1_bundle_9238125c90e5cfc790e8a5ac8926185dfb162b8c.css' ), 'utf8' ),
			'body {\n\tcolor : blue;\n}body {\n\tcolor : red;\n}body {\n\tcolor: #00FF00;\n}' );
	} );
} );

test( 'page2', function( t ) {
	t.plan( 3 );

	var viewDirPath = path.join( __dirname, 'example2/views' );
	var dstDir = path.join( __dirname, 'example2/static/assets' );
	var parcelId, viewRelativePathHash;

	var options = {
		packageFilter : function( pkg ) {
			_.defaults( pkg, {
				'style' : '*.css',
				'browserify' : {
					'transform' : [ 'browserify-shim' ]
				}
			} );

			switch( pkg.name ) {
				case 'jqueryui-browser':
					pkg.main = 'ui/jquery-ui.js';
					pkg.style = [ './themes/base/jquery-ui.css' ];
					break;
			}

			return pkg;
		}
	};

	var c = cartero( viewDirPath, dstDir, options );

	c.on( 'packageCreated', function( newPackage ) {
		if( newPackage.isParcel ) {
			parcelId = newPackage.id;
			viewRelativePathHash = crypto.createHash( 'sha1' ).update( path.relative( viewDirPath, newPackage.view ) ).digest( 'hex' );
		}
	} );

	c.on( 'done', function() {
		t.deepEqual(
			fs.readdirSync( dstDir ).sort(),
			[ parcelId, 'view_map.json' ]
		);

		t.deepEqual( fs.readFileSync( path.join( dstDir, 'view_map.json' ), 'utf8' ), '{\n    \"' + viewRelativePathHash + '\": \"' + parcelId + '\"\n}' );
	
		t.deepEqual(
			fs.readdirSync( path.join( dstDir, parcelId ) ).sort(),
			[ 'assets.json', 'page1_bundle_11bb516a23b579161b330874cff9bb89a3f16753.css', 'page1_bundle_a4e9e288ce50e82528efab4e4b9e412b08fa9074.js' ]
		);
	} );
} );


test( 'page3', function( t ) {
	t.plan( 5 );

	var viewDirPath = path.join( __dirname, 'example3/views' );
	var dstDir = path.join( __dirname, 'example3/static/assets' );
	var viewMap = {};
	var packageIds = [];
	var parcelIdsByView = {};

	var c = cartero( viewDirPath, dstDir, {} );

	c.on( 'packageCreated', function( newPackage ) {
		if( newPackage.isParcel ) {
			parcelId = newPackage.id;
			viewMap[ crypto.createHash( 'sha1' ).update( path.relative( viewDirPath, newPackage.view ) ).digest( 'hex' ) ] = parcelId;
			parcelIdsByView[ path.basename( newPackage.view ) ] = parcelId;
		}

		packageIds.push( newPackage.id );
	} );

	c.on( 'done', function() {
		t.deepEqual(
			fs.readdirSync( dstDir ).sort(),
			packageIds.sort().concat( [ 'view_map.json' ] )
		);

		t.deepEqual( JSON.parse( fs.readFileSync( path.join( dstDir, 'view_map.json' ), 'utf8' ) ), viewMap );
	
		t.deepEqual(
			fs.readdirSync( path.join( dstDir, parcelIdsByView[ 'page1.jade' ] ) ).sort(),
			[ 'assets.json', 'page1_bundle_14d030e0e64ea9a1fced71e9da118cb29caa6676.js', 'page1_bundle_da3d062d2f431a76824e044a5f153520dad4c697.css' ]
		);

		t.deepEqual(
			fs.readdirSync( path.join( dstDir, parcelIdsByView[ 'page2.jade' ] ) ).sort(),
			[ 'assets.json', 'page2_bundle_182694e4a327db0056cfead31f2396287b7d4544.css', 'page2_bundle_5066f9594b8be17fd6360e23df52ffe750206020.js' ]
		);

		t.deepEqual(
			fs.readdirSync( path.join( dstDir, '9d82ba90fa7a400360054671ea26bfc03a7338bf' ) ).sort(),
			[ 'robot.png' ]
		);
	} );
} );