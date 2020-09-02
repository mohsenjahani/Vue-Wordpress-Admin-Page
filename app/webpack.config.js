const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const _root = path.resolve(__dirname, '..');

const root = function (args) {
	args = Array.prototype.slice.call(arguments, 0);

	return path.join.apply(path, [ _root ].concat(args));
};


module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: 'build.js'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					esModule: true,
					loaders: {
						// Since sass-loader (weirdly) has SCSS as its default parse mode, we map
						// the "scss" and "sass" values for the lang attribute to the right configs here.
						// other preprocessors should work out of the box, no loader config like this necessary.
						'scss': [
							'vue-style-loader',
							'css-loader',
							'sass-loader'
						],
							'sass': [
							'vue-style-loader',
							'css-loader',
							'sass-loader?indentedSyntax'
						]
					}
					// other vue-loader options go here
				}
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					appendTsSuffixTo: [/\.vue$/],
					transpileOnly: true
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [ root('src') ]
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
					loader: 'file-loader',
				options: {
					name: '[name].[ext]?[hash]'
				}
			},
			{
				test: /\.(s*)[a|c]ss$/,
				use: [
					"vue-style-loader",
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				]
			}
	]
	},
	resolve: {
			alias: {
				'vue$': 'vue/dist/vue.esm.js',
				'@': root('src')
			},
			extensions: ['*', '.ts', '.js', '.vue', '.json']
		},
	devServer: {
			historyApiFallback: true,
				noInfo: true,
				overlay: true
		},
	performance: {
			hints: false
		},
	devtool: '#eval-source-map',

	plugins: [
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: "[name].css"
		})
	]
}

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map'
	module.exports.optimization = {
		minimize: true,
		minimizer: [new TerserPlugin()],
	};
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),

		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	])
}
