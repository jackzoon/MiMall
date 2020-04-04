module.exports = {
    devServer:{
        host:'localhost',
        port: 8081,
        proxy: {
            '/api': {
                target: 'http://localhost:8085',
                changeOrigin: true,
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    },
    // lintOnSave: false,
    // publicPath: '/app',
    // outputDir: 'dist',
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.plugins.delete('prefetch')
    }
}
