### v0.5.2

* 优化预览页面二维码显示方式

### v0.5.1

* 升级 css-tree 到 1.0.0-alpha.27。rename lexer.grammar.translate -> generate

### v0.5.0

* 预览页面界面调整，及增加原始页面，这样就是可以实时对原始页面和骨架页面进行对比。
* 预览页面增加扫描手机二维码预览骨架页面功能。

### v0.4.0

* **API changes**

  * `image`、`svg`、`pseudo`三个配置项增加了一个 `shapeOpposite` 的属性，其接受一个数组，数组中的元素是 DOM 选择器，所代表元素最终展示的形状和`shape`形状相反，举例如下：

    ```json
    pseudo: {
       color: '#EFEFEF', // or transparent
       shape: 'circle', // circle | rect
       shapeOpposite: ['.apple'] // .apple 的形状将是矩形
    },
    ```

  * `button` 配置增加 `excludes` 配置属性，其接受一个数组，数组元素是 DOM 选择器，其配置的 DOM 元素将不被视为 buttom 处理，也就不会在骨架页面中展示成灰色块。

    ```json
    button: {
       color: '#EFEFEF',
       excludes: ['.apple a'] // 即使 a 元素带有 [role = button]特性，也不被视为 button
    },
    ```

    ​

### v0.3.5

* **bug fix**
  * 解决 IOS 设备中不支持 background-repeat-x css 属性。

### v0.3.4

* **package update**
  * Update puppeteer to v1.0.0
* **bug fix**
  * 解决了在文本块中由于 background-size设置的 px 单位，导致由于 dpr 变化尺寸发生变化的问题。

### v0.3.3

* Fix bug:在安卓等机器上，svg 长宽是 px 单位，导致svg 实际大小和真实大小有差异的问题。

### v0.3.1

* fix bug: 解决了伪类元素在预览时展示出来，但是打包后再首屏骨架页面消失的问题。

### v0.3.0

* 支持伪元素的配置，可能的配置如下：

  ```json
  {
    psudo: {
      color: '#efefef', // or transparent eg
      shape: 'circle' // or rect
    }
  }
  ```

  当配置颜色为 transparent 时候，伪元素将隐藏，但仍然空间占位。

### v0.2.9

* 对单行文本块展示宽度进行优化，单行文本展示的灰色块的宽度几乎和文本实际宽度一致。并且灰色块和之前文本块位置保持不变。

### v0.2.8

* 支持文字灰色条纹、按钮、图片颜色可配置。图片可以设置图片灰色块形状，可选值 circle 和 rect。
* svg 元素块支持颜色和形状配置，颜色可以设置16进制或者 rgb。也可以设置 transparent 值，这样 svg 将会被设置为透明色，形状可选值 circle 和 rect。
* 文字块宽度根据内容变化，不再由元素块决定。同时支持 textAligin 属性值为 right、left、center。文字块显示也有所不同。
* 增加新配置`grayBlock`，该配置选项接受一个数组，数组元素是 DOM 元素选择器。该配置项中选择的元素将展示位一个灰色块。内部元素不再做其他处理。
* 增加 skeleton page 闪烁效果。生成的页面将以2s 为周期，无尽明暗闪烁。暂时不支持闪烁周期，及明暗配置。

### v0.1.8

- 输出的 `shell.html` 文件，不压缩时，自动对 shell.html 文件内容进行 beautify。保证输出文件可读性，便于二次修改 shell.html 文件。

### v 0.0.8

* 预览无页面时，显示404页面。
* utils 添加单元测试

### v 0.0.7

* **bug fix**: 修复了配置的地址不存在报错的 bug。

