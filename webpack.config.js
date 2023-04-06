const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode:'development',
    devtool:'eval-source-map',
    entry: './src/index.js',
    output: {
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js',
        library: 'requestPermission',
        libraryTarget: 'window',
        libraryExport: 'default'
    },
    plugins: [
        new CopyPlugin({
          patterns: [
            { from: "src/index.html", to: "index.html" },
            { from: "src/main.css", to: "main.css" },
            //{ from: "src/firebase-messaging-sw.js", to: "firebase-messaging-sw.js" },
            {from: "src/favicon.ico", to:"favicon.ico"},
            {from: "src/images", to:"images"},
            {from: "src/manifest.json" , to:"manifest.json"},
            {from: "src/serviceworker.js", to:"serviceworker.js" }
          ],
        }),
      ],

};