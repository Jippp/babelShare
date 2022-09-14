// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ProvidePlugin } = require('webpack')

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = 'style-loader';

const config = {
	entry: './src/demo/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
	},
	devtool: 'cheap-module-source-map',
	devServer: {
		open: true,
		host: 'localhost',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.html',
		}),
		new ProvidePlugin({
      process: require.resolve('process/browser'),
      Buffer: ['buffer', 'Buffer']
    })
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [stylesHandler, 'css-loader', 'postcss-loader'],
			},
		],
	},
};

module.exports = () => {
	if (isProduction) {
		config.mode = 'production';
	} else {
		config.mode = 'development';
	}
	return config;
};
