const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	resolve: {
        extensions: ['*', '.js', '.jsx']
    },
	entry: {
		ocPoc: "./src/App/index.js",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "portal-[name]-[chunkhash].js",
		publicPath: '/' // used for routing
	},
    module: {
        rules: [{
            	test: /\.jsx?$/,
            	use: {
			        loader: "babel-loader",
				},
            	exclude: /node_modules/
            },
            {
            	test: /\.(css|scss|sass)$/,
                include: [
                    path.resolve(__dirname, "src"),
                    path.resolve(__dirname, "public"),
                    path.resolve(__dirname, "node_modules/")
                ],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader" ]
                })
            },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
        ]
    },
    devServer: {
    	inline: true, // refreshes the page on change
    	port: 3000,
    	historyApiFallback: true // used for routing (404 response), and address bar routing
    },
	plugins: [
		new HtmlWebpackPlugin({
			hash: true, // cache busting
			template: "./src/index.html",
		}),
        // creates a separate style.css file instead of adding the styles to the bundle.js
        new ExtractTextPlugin({
            filename: "style-[chunkhash].css"
        })
	],
    devtool: "cheap-module-source-map",
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: 'http://localhost:5000/api'
        })
    }
}