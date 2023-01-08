var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin =require('extract-text-webpack-plugin');

const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');

module.exports = {
  devtool: '#inline-source-map',
  entry: {
    'docs.js': [path.resolve(__dirname, './docs/index.jsx')]
  },
  output: {
    path: path.join(__dirname, 'lib'),
    library: "ReactHighlight",
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
        test: /\.(js|jsx|mjs)$/,
        exclude: /(node_modules|bower_components|public\/)/,
        loader: 'babel-loader',
        options: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: isDebug,

          // https://babeljs.io/docs/usage/options/
          babelrc: false,
          presets: [
            // A Babel preset that can automatically determine the Babel plugins and polyfills
            // https://github.com/babel/babel-preset-env
            [
              'env',
              {
                targets: {
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9'
                  ],
                  forceAllTransforms: !isDebug, // for UglifyJS
                },
                modules: false,
                useBuiltIns: false,
                debug: false,
              },
            ],
            // Experimental ECMAScript proposals
            // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
            'stage-2',
            // Flow
            // https://github.com/babel/babel/tree/master/packages/babel-preset-flow
            'flow',
            // JSX
            // https://github.com/babel/babel/tree/master/packages/babel-preset-react
            ['react', {
              development: isDebug
            }],
          ],
          plugins: [
            // Treat React JSX elements as value types and hoist them to the highest scope
            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements
            ...(isDebug ? [] : ['transform-react-constant-elements']),
            // Replaces the React.createElement function with one that is more optimized for production
            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements
            ...(isDebug ? [] : ['transform-react-inline-elements']),
            // Remove unnecessary React propTypes from the production build
            // https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types
            ...(isDebug ? [] : ['transform-react-remove-prop-types']),
          ],
        },
      },
      // {
      //   test: /\.scss$/,
      //   loader: "style!css!postcss!sass?outputStyle=expanded&includePaths[]=" + 
      //       (path.resolve(__dirname, './node_modules')) + "&includePaths[]=" + (path.resolve(__dirname, './bower_components'))
      // },
      {
        test: /\.md$/,
        loader: 'raw!markdown'
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path:'./postcss.config.js'
              },
            },
          }
        ]
        })
      }
    ],
  },
  stats: {
    cached: isVerbose,
    cachedAssets: isVerbose,
    chunks: isVerbose,
    chunkModules: isVerbose,
    colors: true,
    hash: isVerbose,
    modules: isVerbose,
    reasons: isDebug,
    timings: true,
    version: isVerbose,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/vertx/),
    new ExtractTextPlugin('docs.css')
  ]
};
