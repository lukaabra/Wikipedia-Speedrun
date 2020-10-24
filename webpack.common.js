const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'public', 'dist'), // absolute path
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime', '@babel/plugin-proposal-object-rest-spread']
                }
            }
        }, {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, {
                loader: 'css-loader',
                options: {
                    sourceMap: true
                }
            }]
        }]
    },
    plugins: [new MiniCssExtractPlugin()]
};