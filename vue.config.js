module.exports = {
    outputDir: 'dist',   //打包的文件名，可以自己设置，默认是dist
    publicPath: process.env.NODE_ENV === 'production'
    ? '/dist/'
    : '/'
    // assetsDir: 'static',
     
    }