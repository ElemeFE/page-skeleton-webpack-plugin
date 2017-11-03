### page-skeleton-webpack-plugin

你是否还在为你的应用首屏前的一段白屏而困扰？或者单纯重复的 **loading** 图已经让用户产生了审美疲劳？如果在应用首屏出现之前能够展示应用的骨架样式该多好啊，这样用户感觉页面似乎加载更快了。但是开发者都不想重复的去写这些繁琐的骨架页面。**pageSkeletonWebpackPlugin** 就是一款帮你解决以上痛点的整套方案。

**pageSkeletonWebpackPlugin** 是一款 webpack 插件，它能够在你开发过程中，生成应用的**骨架页面**。并通过 webpack 将骨架页面打包到你的应用中，这样在你启动应用的时，就能够在首屏之前看到应用的大概样式了。

![](./assets/skeleton2.jpg)

#### Installation

首先我们需要安装该插件及依赖，该插件依赖于 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)。

> npm install \-\- save-dev page-skeleton-webpack-plugin 
>
> npm install \-\-save-dev html-webpack-plugin

#### Basic Usage

1. 第一步配置插件

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { SkeletonPlugin } = require('page-skeleton-webpack-plugin')
const path = require('path')
const webpackConfig = {
  entry: 'index.js',
  output: {
  	path: __dirname + '/dist',
    filename: 'index.bundle.js'
  },
  plugin: [
  	new HtmlWebpackPlugin({
       // Your HtmlWebpackPlugin config
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"' // "development" 是开发，"production"是生产。
      },
    }),
    new SkeletonPlugin({
        pathname: path.resolve(__dirname, `${customPath}`) // 生成名为 shell 文件存放地址
    })
  ]
}

```

1. 修改 HtmlWebpackPlugin 插件的模板，添加 `<!-- shell -->` 注释。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <div id="app">
    <!-- shell -->
  </div>
</body>
</html>
```

1. 开发过程中使用插件

- 通过浏览器打开你正在开发的项目，选定你要生成 page skeleton页面，通过 `ctrl + enter` 组合键呼出插件的交互界面。
- 点击交互界面上的唯一按钮 **P**，插件将在后台生成骨架页面，并自动帮你打开预览page skeleton 的页面。这个过程可能会耗时几秒到十几秒的时间。
- 如果你对预览页面还算满意，点击预览页面中的 **Write File** 按钮，将在你项目配置的路径中生成骨架页面所需名为 shell.html 文件。
- 通过 webpack 重新打包，e.g. npm run dev(你设置的开发 npm script)。这样当你刷新页面的时候就能够看到页面的骨架结构了。

#### Configuration

你可以向 `pageSkeletonWebpackPlugin` 插件传递一个对象作为配置对象。该配置对象可包含如下字段：

- `pathname:` `string` 生成的 shell 文件存放路径，需为**绝对路径**，且为**必配置项**。
- `debug:` `boolean` 默认值为 `false`，是否开启 `debug` 模式，当 `debug` 为 `true` 时，headless Chromium 控制台的输出信息将在终端输出。
- `minify:` `object | false` 默认值会对生成 shell 文件中的 **html** 和 **css** 进行压缩，当配置为 false 时，不压缩文件。可以传递 [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference) 的配置参数给 `mimify`，进行按需压缩。
- `device: string` Chrome 支持的手机模拟器的名字，配置参见[puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js)。
- `defer:` `number` 默认值为 5000， headless Chromium 打开页面进行操作的延迟，单位`ms`。
- `excludes`: `array` 默认值为空数组，如果你有不需要进行骨架处理的元素，那么将该元素的 CSS 选择器写入该数组。
- `remove:` `array` 默认值为空数组，不需要生成页面骨架，且需要从 DOM 中移除的元素，配置值为移除元素的 CSS 选择器。
- `hide:` `array` 默认值为空数组，不需要移除，但是通过设置其透明度为 0，来隐藏该元素，配置值为隐藏元素的 CSS 选择器。

可能的配置如下：

```javascript
new SkeletonPlugin({
  pathname: path.resolve(__dirname, `${pathname}`),
  defer: 5000,
  debug: false,
  device: 'iPhone 6 Plus'
  minify: {
    minifyCSS: { level: 2 },
    removeComments: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: false
  },
  excludes: ['.app-header'],
  remove: ['.icon-wrapper', '.remove:first-child'],
  hide: ['.remain-bar']
})
```

#### FAQ

**问题一：h5 项目中已经有将 shell.js 文件打包的插件了，怎么使用该插件？**

pageSkeletonWebpackPlugin 完全兼容 h5 项目，只需要添加配置项 `h5Only: true`，这样插件就知道是 h5项目，会生成与项目兼容的 `shell.js` 和 `shell.vue` 两个文件，而不是通常的 `shell.html` 文件。并且在 h5项目中，pageSkeletonWebpackPlugin 插件将不会对 shell 文件进行打包，打包 shell 文件的工作依然交给 h5 项目中的 prerenderPlugin。

**问题二：pageSkeletonWebpackPlugin 的实现原理？**

插件通过 Chrome headless 在服务端打开你所开发的页面，通过对页面中元素进行增减，以及对元素样式进行修改，生成骨架页面。这一过程，也就是上图的演示过程。生成骨架页面，然后保存到配置路径，文件命名为 `shell.html` ，在重新通过 webpack 打包的过程中，插件读取 `shell.html` 文件，并通过文件内容替换`<!-- shell -->`。当再次刷新页面的时候，页面中首先预览的就是骨架页面了。

**问题三：项目中必须使用 DefinePlugin 吗？**

是的，因为pageSkeletonWebpackPlugin 插件会根据环境，进行不同的操作，例如，在生成环境下，将无法通过`ctrl + enter` 呼出交互界面。

**注意：** **page-skeleton-webpack-plugin** 还处于 beta 阶段，你可以随意试用，用于生产环境之前请务必检查生产的**骨架页面** 是否满足你的要求。

#### Contribution

在 examples 目录中找到开发的项目。 npm run dev 启动后进行开发。
如果你对该项目感兴趣，欢迎大家贡献代码。

#### License

This project is licensed under MIT.

