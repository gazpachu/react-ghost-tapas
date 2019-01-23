require('dotenv').config();
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

module.exports = (options) => {
  const ExtractSASS = new ExtractTextPlugin(`assets/styles/${options.cssFileName}`);
  const VENDOR_LIBS = [
    'history', 'lodash', 'react', 'react-dom', 'react-ga',
    'react-helmet', 'react-redux', 'react-router',
    'react-router-redux', 'reduce-reducers', 'redux', 'redux-thunk'
  ];

  const webpackConfig = {
    devtool: options.devtool,
    entry: {
      app: Path.resolve(__dirname, '../src/app/index'),
      vendor: VENDOR_LIBS
    },
    output: {
      path: Path.resolve(__dirname, '../dist'),
      publicPath: process.env.HOSTING_URL || '/',
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [{
        test: /.jsx?$/,
        use: 'eslint-loader',
        enforce: 'pre',
        include: Path.resolve(__dirname, '../src'),
        exclude: /node_modules/
      },
      {
        test: /.jsx?$/,
        include: Path.resolve(__dirname, '../src/app'),
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        use: 'svg-sprite-loader'
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true
            }
          }
        ]
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },
      {
        test: /particles\.js/,
        loader: 'exports-loader?particlesJS=window.particlesJS,pJSDom=window.pJSDom'
      }]
    },
    plugins: [
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development')
        }
      }),
      new Webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      new Webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        FastClick: 'fastclick'
      })
    ]
  };

  if (options.isProduction) {
    webpackConfig.output.filename = 'assets/scripts/[name].[chunkhash].js';

    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        path: process.env.HOSTING_URL ? process.env.HOSTING_URL : '/assets',
        template: Path.resolve(__dirname, '../src/index.html')
      }),
      new CopyWebpackPlugin([
        {
          from: 'assets/static',
          to: 'assets/static'
        }
      ]),
      ExtractSASS,
      new OfflinePlugin({
        safeToUseOptionalCaches: true,
        excludes: ['**/*.map'],
        updateStrategy: 'changed',
        autoUpdate: 1000 * 60 * 2,
        caches: {
          main: [
            'assets/styles/app.*.css',
            'assets/scripts/vendor.*.js',
            'assets/scripts/app.*.js',
            'assets/scripts/manifest.*.js'
          ],
          additional: [
            ':externals:'
          ],
          optional: [
            ':rest:'
          ]
        },
        externals: [
          '/'
        ],
        ServiceWorker: {
          events: true,
          navigateFallbackURL: '/'
        },
        AppCache: {
          FALLBACK: {
            '/': '/assets/static/offline.html'
          }
        }
      })
    );

    webpackConfig.module.rules.push({
      test: /\.scss$/,
      use: ExtractSASS.extract([
        'css-loader?importLoaders=1',
        'postcss-loader?config=webpack/postcss.config.js',
        'sass-loader'
      ])
    });
  } else {
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        path: '/assets',
        template: Path.resolve(__dirname, '../src/index.html')
      }),
      new Webpack.HotModuleReplacementPlugin()
    );

    webpackConfig.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader?importLoaders=1',
        'postcss-loader?config=webpack/postcss.config.js',
        'sass-loader'
      ]
    });

    webpackConfig.devServer = {
      contentBase: Path.resolve(__dirname, '../'),
      hot: true,
      inline: true,
      historyApiFallback: true
    };
  }

  return webpackConfig;
};
