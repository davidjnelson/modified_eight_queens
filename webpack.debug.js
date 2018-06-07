const path = require('path');
const FlowStatusWebpackPlugin = require('flow-status-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: ['./src/js/entry.js'],
	output: {
		path: path.resolve(__dirname, './buildTileMatrix/js'),
		publicPath: "/js/",
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
		]
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new FlowStatusWebpackPlugin({
			failOnError: true,
			onSuccess: (stdout) => {
				console.log('Flow type check succeeded.');
			},
			onError: (stdout) => {
				console.log('Flow type check failed.');
			},
		})
	],
	devtool: 'source-map'
};
