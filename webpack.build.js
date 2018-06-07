const path = require('path');
const webpack = require("webpack");

module.exports = {
	entry: ['./src/js/entry.js'],
	output: {
		path: path.resolve(__dirname, './build/js'),
		publicPath: "/js/",
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			mangle: false
		})
	]
};
