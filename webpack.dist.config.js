var webpack = require('webpack');
var path = require('path');
var config = require('./webpack.config');
var CopyWebpackPlugin = require('copy-webpack-plugin');

config.output = {
    filename: '[name].bundle.js',
    publicPath: '',
    path: path.resolve(__dirname, 'dist')
};

config.plugins = config.plugins.concat([

  // Reduces bundles total size
//  new webpack.optimize.UglifyJsPlugin({
            //        mangle: {
            //
            //            // You can specify all variables that should not be mangled.
            //            // For example if your vendor dependency doesn't use modules
            //            // and relies on global variables. Most of angular modules relies on
            //            // angular global variable, so we should keep it unchanged
            //            except: ['$super', '$', 'exports', 'require', 'angular']
            //        }
            //    }),

    new CopyWebpackPlugin(
        [
            {
                from: 'client/assets',
                to: path.resolve(config.output.path, 'assets')
            }
        ], {
            // By default, we only copy modified files during
            // a watch or webpack-dev-server build. Setting this
            // to `true` copies all files.
            copyUnmodified: true
        })
]);

module.exports = config;
