const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    outputDir: "dist",
    assetsDir: "static",       
    indexPath: "index.html",
    publicPath: "./",
    configureWebpack: {
        resolve: { 
            fallback: { 
                fs: false 
            } 
        }
    },     
    devServer: {
        client: {
            overlay: false,
        },
    }
})