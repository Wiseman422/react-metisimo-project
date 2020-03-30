// webpack
var logger = require('better-console');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackConfig = require("../../webpack.config.js");
var webpack = require("webpack");
var webpackCompiler = webpack(webpackConfig);

export default function(app){
	app.use(webpackDevMiddleware(webpackCompiler,{
		publicPath : '/build/',
		lazy : false,
		stats : {
			colors: true,
			chunks : false,
			'errors-only' : true
		},
		watchOptions: {
			aggregateTimeout: 300,
			poll: true
		},
	}));
}