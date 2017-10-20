function skelegonPlugin() {

}

skelegonPlugin.prototype.apply = function(compiler) {
  compiler.plugin('run', function(compiler, callback) {
    console.log("webpack 构建过程开始！！！")

    callback()
  })
}

module.exports = skelegonPlugin

