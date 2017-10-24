### page-skeleton-webpack-plugin

你是否还在为你的应用首屏前的一段白屏而困扰？或者单纯重复的 **loading** 图已经让用户产生了审美疲劳？如果在应用首屏出现之前能够展示应用的骨架样式该多好啊，这样用户感觉页面似乎加载更快了。但是开发者都不想重复的去写这些繁琐的骨架页面。**page-skeleton-webpack-plugin** 就是一款帮你解决以上痛点的工具。

**page-skeleton-webpack-plugin** 是一款 webpack 插件，它能够在你开发过程中，生成应用的**骨架页面**。并通过 webpack 将骨架页面打包到你的应用中，这样在你启动应用的时，就能够在首屏之前看到应用的大概样式了。

![](./assets/skeleton2.jpg)

#### 安装

> npm install —save-dev page-skeleton-webpack-plugin

#### 如何使用

**配置：**

**使用流程：**

#### 贡献代码

如果你对该项目感兴趣，欢迎大家贡献代码。

#### TODO List

- 客户端接收消息、打印消息、跳转页面、界面
- Server 中sockjs 代码优化
- plugin 配置参数 schema 验证
- 一个plugin能够获取另外一个plugin的配置吗？
- 优化错误处理
- Skeleton优化：隐藏高度小于某个值的元素。背景颜色不是灰色处理成灰色
- 添加eslint
- 发布流程：发布到npm。发布脚本？
- 单元测试
- 添加example
- 文档：README.md

二期：

- 预览页面可编辑
- ShellWebpackPlugin 将shell文件打包

**注意：** **page-skeleton-webpack-plugin**还处于 beta 阶段，你可以随意试用，用于生产环境之前请务必生产的**骨架页面** 是否满足你的要求。