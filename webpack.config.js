const path= require('path')
const CopyPlugin= require('copy-webpack-plugin')

module.exports= (env, argv) =>{
  return {
    stats: 'minimal', // Keep console output easy to read.
    entry: "./src/app.ts",
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'dist'),
    },
    // Enable sourcemaps while debugging
    devtool: argv.mode === 'development' ? 'eval-source-map' : undefined,
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'src/index.html', to: './' },
          { from: 'src/style.css', to: './' },
          { from: 'src/assets', to: './assets' }
        ]
      }),
    ],
    module: {
      rules:[
        {
          test: /\.ts$/,
          use: 'ts-loader',
          include:[path.resolve(__dirname, 'src')]
        }
      ]
    },
    resolve:{
      extensions: ['.ts', '.js']
    }
  }
}
