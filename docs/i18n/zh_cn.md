<p align="center">
<img src="https://github.com/ElemeFE/page-skeleton-webpack-plugin/raw/master/docs/banner.jpg" alt="mark text" width="100%">
</p>

<div align="center">
  <strong>:high_brightness:Automatically generate Skeleton Page:crescent_moon:</strong>
</div>

<div align="center">
  A <code>Webpack</code> plugin helps you build better JavaScript application
</div>

<hr />

<div align="center">
  <!-- Version -->
  <a href="https://github.com/ElemeFE/page-skeleton-webpack-plugin">
    <img src="https://badge.fury.io/gh/elemefe%2Fpage-skeleton-webpack-plugin.svg" alt="website">
  </a>
  <!-- License -->
  <a href="https://github.com/ElemeFE/page-skeleton-webpack-plugin">
    <img src="https://img.shields.io/github/license/ElemeFE/page-skeleton-webpack-plugin.svg?style=flat-square" alt="LICENSE">
  </a>
  <!-- Build Status -->
  <a href="https://github.com/ElemeFE/page-skeleton-webpack-plugin">
    <img src="https://travis-ci.org/ElemeFE/page-skeleton-webpack-plugin.svg?branch=master" alt="build">
  </a>
  <!-- Downloads weekly -->
  <a href="https://github.com/ElemeFE/page-skeleton-webpack-plugin">
    <img src="https://img.shields.io/npm/dw/page-skeleton-webpack-plugin.svg?style=flat-square" alt="download">
  </a>
</div>

<div align="center">
 <a href="https://nodei.co/npm/page-skeleton-webpack-plugin/"><img src="https://nodei.co/npm/page-skeleton-webpack-plugin.png?downloads=true&downloadRank=true&stars=true"></a>
</div>

<div align="center">
  <h3>
    <a href="https://github.com/ElemeFE/page-skeleton-webpack-plugin#features">
      Features
    </a>
   <span> | </span>
​    <a href="https://github.com/ElemeFE/page-skeleton-webpack-plugin#examples">
      Examples
    </a>
​    <span> | </span>
    <a href="https://github.com/ElemeFE/page-skeleton-webpack-plugin#installation">
      Install
    </a>
    <span> | </span>
    <a href="https://github.com/ElemeFE/page-skeleton-webpack-plugin#basic-use">
      Basic Use
    </a>
    <span> | </span>
    <a href="https://github.com/ElemeFE/page-skeleton-webpack-plugin#documents">
      Documents
    </a>
    <span> | </span>
    <a href="https://github.com/ElemeFE/page-skeleton-webpack-plugin#contribution">
      Contribution
    </a>
  </h3>
</div>

<br />

![](https://github.com/ElemeFE/page-skeleton-webpack-plugin/raw/master/docs/workflow.gif)

### Features

Page Skeleton 是一款 webpack 插件，该插件的目的是根据你项目中不同的路由页面生成相应的骨架屏页面，并将骨架屏页面通过 webpack 打包到对应的静态路由页面中。

- 支持多种加载动画
- 针对移动端 web 页面
- 支持多路由
- 可定制化，可以通过配置项对骨架块形状颜色进行配置，同时也可以在预览页面直接修改骨架页面源码
- 几乎可以零配置使用

### Examples

所有的 example 都放在了 `examples` 文件夹内。

* [**sale**](https://github.com/ElemeFE/page-skeleton-webpack-plugin/tree/master/examples/sale)

### Installation

通过 npm 来安装插件及依赖，该插件依赖于 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)。

> npm install --save-dev page-skeleton-webpack-plugin
> 
> npm install --save-dev html-webpack-plugin

### Basic Use

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

    new SkeletonPlugin({
      pathname: path.resolve(__dirname, `${customPath}`), // 用来存储 shell 文件的地址
      staticDir: path.resolve(__dirname, './dist'), // 最好和 `output.path` 相同
      routes: ['/', '/search'], // 将需要生成骨架屏的路由添加到数组中
    })
  ]
}
```

:notebook_with_decorative_cover:由于插件是根据`process.env.NODE_ENV` 环境变量来选择不同的操作，因此需要在`package.json` 文件中 `scrpt`选项显示配置环境变量如下：

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development node server.js",
  "build": "rm -rf dist && cross-env NODE_ENV=production webpack --progress --hide-modules"
}
```

也就是说，在开发环境下设置 `NODE_ENV` 为 development，在生产环境下设置 `NODE_ENV` 为 production。

#### 第二步：修改 HTML Webpack Plugin 插件的模板

在你启动 App 的根元素内部添加 `<!-- shell -->`

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

![](./step1.jpg)

1. 点击交互界面中的按钮，进行骨架页面的预览，这一过程可能会花费 20s 左右时间，当插件准备好骨架页面后，会自动通过浏览器打开预览页面，如下图。

![](./step2.jpg)

1. 扫描预览页面中的二维码，可在手机端预览骨架页面，可以在预览页面直接编辑源码，通过点击右上角写入按钮，将骨架页面写入到 shell.html 文件中。

2. 通过 webpack 重新打包应用，当页面重新启动后，就能够在获取到数据前看到应用的骨架结构了。

### Documents

**Server Options**

| Option    | Type            | Required? | Default      | Description                                                  |
| --------- | --------------- | --------- | ------------ | ------------------------------------------------------------ |
| pathname  | String          | Yes       | None         | Where the shell.html file shoud be output.                   |
| staticDir | String          | Yes       | None         | 用来输出静态路由页面的路径                                   |
| routes    | Array           | Yes       | None         | 需要生成带有骨架屏的静态路由，请参考 [**sale**](https://github.com/ElemeFE/page-skeleton-webpack-plugin/tree/master/examples/sale) |
| Port      | String          | No        | 8989         | The port of Page Skeleton server                             |
| debug     | Boolean         | No        | true         | 是否开启 `debug` 模式，当 `debug` 为 `true` 时，headless Chromium 控制台的输出信息将在终端输出。 |
| minify    | false or Object | No        | See defaults | 插件默认会压缩生成的 shell.html 文件，默认压缩配置参见本部分默认配置。可以传递 [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference) 的配置参数给 `mimify`，进行按需压缩。当配置为 false 时，不压缩生成的 shell.html 文件，并且会对 shell.html 文件进行格式化处理。 |
| logLevel  | String          | No        | `info`       | 在运行插件的过程中，想要打印的消息类型，可选值为`info`, `warn` 默认值为 `info`。 |
| quiet     | Boolean         | No        | `false`      | 是否在终端打印消息，当设置为 true 时，不打印任何消息。       |
| noInfo    | Boolean         | No        | `false`      | 当设置为 true 时，不打印 `info` 类型的消息                   |
| logTime   | Boolean         | No        | `true`       | 当设置为 true 时，在任何消息前面都会带有一个格式化的时间值。 |

**Skeleton Page Options**

| Option    | Type   | Required | Default      | Description                                                  |
| --------- | ------ | -------- | ------------ | ------------------------------------------------------------ |
| loading   | String | No       | spin         | Animations of skeleton page,  enumerated values:`spin` `chiaroscuro` `shine` |
| text      | Object | No       | See defaults | 该配置对象可以配置一个 `color` 字段，用于决定骨架页面中文字块的的颜色，颜色值支持16进制、RGB等。 |
| image     | Object | No       | See defaults | 该配置接受 3 个字段，`color`、`shape`、`shapeOpposite`。color 和 shape 用于确定骨架页面中图片块的颜色和形状，颜色值支持16 进制和 RGB等，形状支持两个枚举值，`circle` （矩形）和 `rect`（圆形）。shapeOpposite 字段接受一个数组，数组中每个元素是一个 DOM 选择器，用于选择 DOM 元素，被选择 DOM 的形状将和配置的 shape 形状相反，例如，配置的是 `rect`那么，shapeOpposite 中的图片块将在骨架页面中显示成 circle 形状（圆形），具体怎么配置可以参考该部分末尾的默认配置。 |
| button    | Object | No       | See defaults | 该配置接受两个字段，`color` 和 `excludes`。color 用来确定骨架页面中被视为按钮块的颜色，excludes 接受一个数组，数组中元素是 DOM 选择器，用来选择元素，该数组中的元素将不被视为**按钮块**。 |
| svg       | Object | No       | See defaults | 该配置接受 3 个字段，`color`、`shape`、`shapeOpposite`。color 和 shape 用于确定骨架页面中 svg 块的颜色和形状，颜色值支持16 进制和 RGB等，同时也支持 `transparent` 枚举值，设置为 transparent 后，svg 块将是透明块。形状支持两个枚举值，`circle` （矩形）和 `rect`（圆形）。shapeOpposite 字段接受一个数组，数组中每个元素是一个 DOM 选择器，用于选择 DOM 元素，被选择 DOM 的形状将和配置的 shape 形状相反，例如，配置的是 `rect`那么，shapeOpposite 中的 svg 块将在骨架页面中显示成 circle 形状（圆形），具体怎么配置可以参考该部分末尾的默认配置。 |
| pseudo    | Object | No       | See defaults | 该配置接受两个字段，`color` 和 `shape`。color 用来确定骨架页面中被视为伪元素块的颜色，shape 用来设置伪元素块的形状，接受两个枚举值：circle 和 rect。 |
| excludes  | Array  | No       | `[]`         | 如果你有不需要进行骨架处理的元素，那么将该元素的 CSS 选择器写入该数组。 |
| remove    | Array  | No       | `[]`         | 不需要生成页面骨架，且需要从 DOM 中移除的元素，配置值为移除元素的 CSS 选择器。 |
| hide      | Array  | No       | `[]`         | 不需要移除，但是通过设置其透明度为 0，来隐藏该元素，配置值为隐藏元素的 CSS 选择器。 |
| grayBlock | Array  | No       | `[]`         | 该数组中元素是 CSS 选择器，被选择的元素将被被插件处理成一个色块，色块的颜色和按钮块颜色一致。内部元素将不再做特殊处理，文字将隐藏。 |
| cssUnit   | String | No       | `rem`        | 其接受的枚举值`rem`, `vw`, `vh`, `vmin`, `vmax`。            |
| decimal   | Number | No       | 4            | 生成骨架页面（shell.html）中 css 值保留的小数位数，默认值是 4。 |

**Puppeteer Options**

| Options | Type   | Required? | Default         | Description                                                  |
| ------- | ------ | --------- | --------------- | ------------------------------------------------------------ |
| device  | String | No        | `iPhone 6 Plus` | 用来设置你在哪款移动设备的模拟器上生成骨架页面，配置参考[puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js)。 |
| defer   | Number | No        | 5000            | puppeteer 启动 headless Chrome 浏览器，打开页面后的延迟，主要是为了保证页面加载完全，单位是`ms`。 |
| cookie  | Array  | No        | `[]`            | 数组中每个对象（Object 类型值）是一个 cookie，参考 puppeteer 最新文档。 |

**Default options**

```javascript
const pluginDefaultConfig = {
  port: '8989',
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
  cssUnit: 'rem',
  decimal: 4,
  logLevel: 'info',
  quiet: false,
  noInfo: false,
  logTime: true
}
```

### Contribution

运行 npm run dev:sale 启动 sample 文件夹的 sale 项目，可以进行项目的开发，client 端和 preview 页面的开发请参见 package 中的 script 命令，如果你对该项目感兴趣，欢迎大家贡献代码。

Special thanks to @Yasujizr who designed the banner of Page Skeleton.

### License

 [**MIT**](https://github.com/ElemeFE/page-skeleton-webpack-plugin/blob/master/LICENSE).

Copyright (c) 2017-present, @ElemeFE
