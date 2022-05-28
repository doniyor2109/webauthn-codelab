module.exports = {
  entry: {
    'components-bundle': './web/js/components.js',
  },
  mode: 'production',
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'bundle.css',
            },
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /components\.js$/,
        loader: 'babel-loader',
        query: { presets: ['env'] },
      },
    ],
  },
};
