const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
  entry: './src/app.js',
  mode: 'development',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/' // это мне не понятно
  },
  devServer: {
    compress: true, // Включить сжатие
    port: 9000, // Порт, на котором будет запущен DevServer
    open: true ,
    historyApiFallback: true,//Когда historyApiFallback установлен в true, все запросы, которые не соответствуют существующим файлам на сервере,
    // будут перенаправлены к index.html, что позволяет вашему SPA правильно обрабатывать клиентский роутинг.
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          
          "style-loader",
   
          "css-loader"
        ],
      },
    ],
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Путь к вашему основному HTML файлу
      filename: 'index.html', // Имя генерируемого файла
    }),
    new CopyPlugin({
      patterns: [
         // Копирование компонентов
         { from: './src/js', to: 'js' }, 
         { from: './node_modules/bootstrap/dist/js/bootstrap.min.js', to: 'js' }, 
         { from: './node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'styles' }, 
           { from: './src/templates', to: 'templates' },
        { from: './src/images', to: 'images' },
        { from: './src/fonts', to: 'fonts' },
        { from: './src/styles', to: 'styles' },
        {from: "./node_modules/chart.js/dist/chart.umd.js", to: "js"},
        { from: "./node_modules/moment/min/moment.min.js", to: "js" },
        { from: "./node_modules/moment/min/locales.js", to: "js" },
       
      ]
    })
  ],
};