## Page Skeleton Webpack Plugin

你是否还在为你的应用首屏前的一段白屏而困扰？或者单纯重复的 **loading** 图已经让用户产生了审美疲劳？如果在应用首屏出现之前能够展示应用的骨架样式该多好啊，这样用户感觉页面似乎加载更快了。但是开发者都不想重复的去写这些繁琐的骨架页面。**Page Skeleton Webpack Plugin** 就是一款帮你解决以上痛点的整套方案。

Page SkeletonWebpack Plugin 是一款 webpack 插件，在开发过程中，通过简单的点击操作，生成开发页面对应的骨架页面，并通过 webpack 将骨架页面打包到你的应用中，这样就能够在你的应用启动之前，看到页面的骨架结构了。

![](./docs/compare.jpg)

### 安装

通过 npm 来安装插件及依赖，该插件依赖于 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)。

> npm install -- save-dev page-skeleton-webpack-plugin
>
> npm install --save-dev html-webpack-plugin

### 基础使用

#### 第一步：配置插件

按照上面教程安装完成插件后，需要对插件进行必要的配置，以便插件能够正常运行。插件会根据 node 环境的不同，进行不同的操作，当 `NODE_ENV === 'development'` 时，插件可以执行生成和写入骨架页面的操作。

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

#### 第二步：修改 HTML Webpack Plugin 插件的模板

在你启动 App 的根元素内部添加 `<!-- shell -->` 的注释，这样插件才能够在打包的时候将 shel.html 内容插入到正确位置。

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

#### 第三步：界面操作生成、写入骨架页面

1. 在开发页面中通过 Ctrl|Cmd + enter 呼出插件交互界面，或者在在浏览器的 JavaScript 控制台内输入`toggleBar` 呼出交互界面。

![](./docs/step1.jpg)

2. 点击交互界面中的按钮，进行骨架页面的预览，这一过程可能会花费 20s 左右时间，当插件准备好骨架页面后，会自动通过浏览器打开预览页面，如下图。

![](./docs/step2.jpg)

3. 扫描预览页面中的二维码，可在手机端预览骨架页面，通过点击写入文件按钮，将骨架页面写入到 shell.html 文件中，你可以通过你喜爱的编辑器打开该文件进行修改，来更好匹配你的应用。
4. 通过 webpack 重新打包应用，当页面重新启动后，就能够在获取到数据前看到应用的骨架结构了。

### 配置插件

可以向插件传递一个配置对象，该配置对象可以包含如下字段。

* **pathname**

  **必须配置项** String 类型值

  该配置项要求配置一个绝对路径，用于确定生成的 shell.html 文件存放路径。

* **text**

  非必须配置项，其接受一个 Object 类型值

  在生成骨架页面过程中，如果一个元素只有一个文本节点`Node.TEXT_NODE`，作为子节点，那么该元素将视为文本块。因此为了生成美观的骨架页面，建议所有的文本节点外都包裹一个元素节点，比如包裹一个 span 标签。

  该配置对象可以配置一个 `color` 字段，用于决定骨架页面中文字块的的颜色，颜色值支持16进制、RGB等。

* **image**

  非必须配置项，其接受一个 Object 类型值

  在生成骨架页面的过程中，**img 元素**、**背景为图片的元素**将被视为图片块。

  该配置接受 3 个字段，`color`、`shape`、`shapeOpposite`。color 和 shape 用于确定骨架页面中图片块的颜色和形状，颜色值支持16 进制和 RGB等，形状支持两个枚举值，`circle` （矩形）和 `rect`（圆形）。shapeOpposite 字段接受一个数组，数组中每个元素是一个 DOM 选择器，用于选择 DOM 元素，被选择 DOM 的形状将和配置的 shape 形状相反，例如，配置的是 `rect`那么，shapeOpposite 中的图片块将在骨架页面中显示成 circle 形状（圆形），具体怎么配置可以参考该部分末尾的默认配置。

* **button**

  非必须配置项，其接受一个 Object 类型值

  在生成骨架页面的过程中，**button 元素**、**button 类型的 input 元素**、**role 为 button 的 a 元素**都将被视为 button 元素，插件将视这些元素为按钮块，按钮块内部的文字将不再单独显示为文字块，按钮块整个背景色将是配置的颜色。

  该配置接受两个字段，`color` 和 `excludes`。color 用来确定骨架页面中被视为按钮块的颜色，excludes 接受一个数组，数组中元素是 DOM 选择器，用来选择元素，该数组中的元素将不被视为**按钮块**。

* **svg**

  非必须配置项，其接受一个 Object 类型值

  在生成骨架页面的过程中，所有的 **svg** 元素将被视为 svg 块，在骨架页面中，可以通过配置将 svg 块设置成透明，或者矩形块、圆形块。

  该配置接受 3 个字段，`color`、`shape`、`shapeOpposite`。color 和 shape 用于确定骨架页面中 svg 块的颜色和形状，颜色值支持16 进制和 RGB等，同时也支持 `transparent` 枚举值，设置为 transparent 后，svg 块将是透明块。形状支持两个枚举值，`circle` （矩形）和 `rect`（圆形）。shapeOpposite 字段接受一个数组，数组中每个元素是一个 DOM 选择器，用于选择 DOM 元素，被选择 DOM 的形状将和配置的 shape 形状相反，例如，配置的是 `rect`那么，shapeOpposite 中的 svg 块将在骨架页面中显示成 circle 形状（圆形），具体怎么配置可以参考该部分末尾的默认配置。

* **pseudo**

  非必须配置项，其接受一个 Object 类型值

  在生成骨架页面的过程中，所有带有**伪元素的元素**都将被视为伪元素块，伪元素块可以设置成透明，或者矩形、圆形色块，并且会忽略 backgroundImage css 样式。

  该配置接受两个字段，`color` 和 `shape`。color 用来确定骨架页面中被视为伪元素块的颜色，shape 用来设置伪元素块的形状，接受两个枚举值：circle 和 rect。

* **device**

  非必须配置项，接受一个 String 类型值

  用来设置你在哪款移动设备的模拟器上生成骨架页面，配置参考[puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js)。默认值是`iPhone 6 Plus`。

* **debug**

  非必须配置项，其接受一个 Boolean 类型值

   默认值为 `false`，是否开启 `debug` 模式，当 `debug` 为 `true` 时，headless Chromium 控制台的输出信息将在终端输出。

* **minify**

  非必须配置项，其接受 **false** 或者 Object 类型值

  插件默认会压缩生成的 shell.html 文件，默认压缩配置参见本部分默认配置。可以传递 [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference) 的配置参数给 `mimify`，进行按需压缩。当配置为 false 时，不压缩生成的 shell.html 文件，并且会对 shell.html 文件进行格式化处理。

* **defer**

  非必须配置项，其接受一个 Number 类型值

  默认值 5000，puppeteer 启动 headless Chrome 浏览器，打开页面后的延迟，主要是为了保证页面加载完全，单位是`ms`。

* **excludes**

  非必须配置项，其接受一个 Array 类型值

  默认值为空数组，如果你有不需要进行骨架处理的元素，那么将该元素的 CSS 选择器写入该数组。

* **remove**

  非必须配置项，其接受一个 Array 类型值

  默认值是空数组，不需要生成页面骨架，且需要从 DOM 中移除的元素，配置值为移除元素的 CSS 选择器。

* **hide**

  非必须配置项，其接受一个 Array 类型值

  默认值为空数组，不需要移除，但是通过设置其透明度为 0，来隐藏该元素，配置值为隐藏元素的 CSS 选择器。

* **grayBlock**

  非必须配置项，其接受一个 Array 类型值

  默认值是空数组，该数组中元素是 CSS 选择器，被选择的元素将被被插件处理成一个色块，色块的颜色和按钮块颜色一致。内部元素将不再做特殊处理，文字将隐藏。

* **cookies**

  非必配置项，其接受一个 Array 类型值

  在打开应用页面时，可能需要鉴权，比如需要某些特定的 cookie，通过该配置项可以设置 puppeteer 打开的 页面的 cookie 值。

  该配置中默认值为空数组，数组中每个对象（Object 类型值）是一个 cookie，其接受的 key 如下：

  - `name` \<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)> **required**
  - `value` \<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)> **required**
  - `url` \<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>
  - `domain` \<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>
  - `path` \<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>
  - `expires` \<[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)> Unix time in seconds.
  - `httpOnly` \<[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)>
  - `secure` \<[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)>
  - `sameSite` \<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)> `"Strict"` or `"Lax"`.

  或参考 puppeteer 最新文档。

项目中所有配置项的默认配置如下：

```javascript
const pluginDefaultConfig = {
  text: {
    color: '#EEEEEE'
  },
  image: {
    shape: 'rect', // `rect` | `circle`
    color: '#EFEFEF',
    shapeOpposite: []
  },
  button: {
    color: '#EFEFEF',
    excludes: [] 
  },
  svg: {
    color: '#EFEFEF',
    shape: 'circle', // circle | rect
    shapeOpposite: []
  },
  pseudo: {
    color: '#EFEFEF', // or transparent
    shape: 'circle' // circle | rect
  },
  device: 'iPhone 6 Plus',
  debug: false,
  minify: {
    minifyCSS: { level: 2 },
    removeComments: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: false
  },
  defer: 5000,
  excludes: [],
  remove: [],
  hide: [],
  grayBlock: [],
  cookies: [],
  headless: true,
  h5Only: false
}
```

### FAQ

**问题一：h5 项目中已经有将 shell.js 文件打包的插件了，怎么使用该插件？**

pageSkeletonWebpackPlugin 完全兼容 h5 项目，只需要添加配置项 `h5Only: true`，这样插件就知道是 h5项目，会生成与项目兼容的 `shell.js` 和 `shell.vue` 两个文件，而不是通常的 `shell.html` 文件。并且在 h5项目中，pageSkeletonWebpackPlugin 插件将不会对 shell 文件进行打包，打包 shell 文件的工作依然交给 h5 项目中的 prerenderPlugin。

**问题二：pageSkeletonWebpackPlugin 的实现原理？**

插件通过 Chrome headless 在服务端打开你所开发的页面，通过对页面中元素进行增减，以及对元素样式进行修改，生成骨架页面。这一过程，也就是上图的演示过程。生成骨架页面，然后保存到配置路径，文件命名为 `shell.html` ，在重新通过 webpack 打包的过程中，插件读取 `shell.html` 文件，并通过文件内容替换`<!-- shell -->`。当再次刷新页面的时候，页面中首先预览的就是骨架页面了。

**问题三：项目中必须使用 DefinePlugin 吗？**

是的，因为pageSkeletonWebpackPlugin 插件会根据环境，进行不同的操作，例如，在生产环境下，将无法通过`ctrl + enter` 呼出交互界面。

**注意：** **page-skeleton-webpack-plugin** 还处于 beta 阶段，你可以随意试用，用于生产环境之前请务必检查生产的**骨架页面** 是否满足你的要求。

### 贡献代码

运行 npm run dev:sale 启动 sample 文件夹的 sale 项目，可以进行项目的开发，client 端和 preview 页面的开发请参见 package 中的 script 命令，如果你对该项目感兴趣，欢迎大家贡献代码。

### License

This project is licensed under MIT.