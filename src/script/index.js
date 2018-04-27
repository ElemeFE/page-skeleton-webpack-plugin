var Skeleton = (function (exports) {
  'use strict';

  /**
  * constants
  */
  const TRANSPARENT = 'transparent';
  const EXT_REG = /\.(jpeg|jpg|png|gif|svg|webp)/;
  const GRADIENT_REG = /gradient/;
  const DISPLAY_NONE = /display:\s*none/;
  const PRE_REMOVE_TAGS = ['script'];
  const AFTER_REMOVE_TAGS = ['title', 'meta', 'style'];
  const CLASS_NAME_PREFEX = 'sk-';
  const CONSOLE_SELECTOR = '.sk-console';
  // 最小 1 * 1 像素的透明 gif 图片
  const SMALLEST_BASE64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const MOCK_TEXT_ID = 'sk-text-id';
  const Node = window.Node;

  /**
   * a Map instance to cache the styles which will be inserted into the skeleton page.
   * key is the selector and value is the css rules.
   */

  const styleCache = new Map();

  // some common styles
  const shapeStyle = (shape) => {
    const selector = `.${CLASS_NAME_PREFEX + shape}`;
    const rule = `{
    border-radius: ${shape === 'rect' ? '0' : '50%'};
  }`;
    if (!styleCache.has(selector)) {
      styleCache.set(selector, rule);
    }
  };

  const addStyle = (selector, rule) => {
    if (!styleCache.has(selector)) {
      styleCache.set(selector, rule);
    }
  };

  const getComputedStyle = window.getComputedStyle;
  const $$ = document.querySelectorAll.bind(document);
  const $ = document.querySelector.bind(document);
  const isBase64Img = (img) => /base64/.test(img.src);

  const setAttributes = (ele, attrs) => {
    Object.keys(attrs).forEach(k => ele.setAttribute(k, attrs[k]));
  };

  const inViewPort = (ele) => {
    const rect = ele.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.left < window.innerWidth
  };

  const checkHasPseudoEle = (ele) => {
    const hasBefore = getComputedStyle(ele, '::before').getPropertyValue('content') !== '';
    const hasAfter = getComputedStyle(ele, '::after').getPropertyValue('content') !== '';
    if (hasBefore || hasAfter) {
      return { hasBefore, hasAfter, ele }
    }
    return false
  };

  const checkHasBorder = (styles) => styles.getPropertyValue('border-style') !== 'none';

  const getOppositeShape = (shape) => shape === 'circle' ? 'rect' : 'circle';

  const checkHasTextDecoration = (styles) => !/none/.test(styles.textDecorationLine);

  const getViewPort = () => {
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    return {
      vh,
      vw,
      vmax: Math.max(vw, vh),
      vmin: Math.min(vw, vh),
    }
  };

  const px2relativeUtil = (px, unit = 'rem', decimal = 4) => {
    const pxValue = typeof px === 'string' ? parseFloat(px, 10) : px;
    if (unit === 'rem') {
      const htmlElementFontSize = getComputedStyle(document.documentElement).fontSize;
      return `${(pxValue / parseFloat(htmlElementFontSize, 10)).toFixed(decimal)}${unit}`
    } else {
      const dimensions = getViewPort();
      const base = dimensions[unit];
      return `${(pxValue / base * 100).toFixed(decimal)}${unit}`
    }
  };

  const getTextWidth = (text, style) => {
    let offScreenParagraph = document.querySelector(`#${MOCK_TEXT_ID}`);
    if (!offScreenParagraph) {
      const wrapper = document.createElement('p');
      offScreenParagraph = document.createElement('span');
      Object.assign(wrapper.style, {
        width: '10000px'
      });
      offScreenParagraph.id = MOCK_TEXT_ID;
      wrapper.appendChild(offScreenParagraph);
      document.body.appendChild(wrapper);
    }
    Object.assign(offScreenParagraph.style, style);
    offScreenParagraph.textContent = text;
    return offScreenParagraph.getBoundingClientRect().width
  };

  const addClassName = (ele, classArray) => {
    for (const name of classArray) {
      ele.classList.add(name);
    }
  };

  const setOpacity = (ele) => {
    const className = CLASS_NAME_PREFEX + 'opacity';
    const rule = `{
    opacity: 0 !important;
  }`;
    addStyle(`.${className}`, rule);
    ele.classList.add(className);
  };

  const transparent = (ele) => {
    const className = CLASS_NAME_PREFEX + 'transparent';
    const rule = `{
    color: ${TRANSPARENT} !important;
  }`;
    addStyle(`.${className}`, rule);
    ele.classList.add(className);
  };

  const removeElement = (ele) => {
    const parent = ele.parentNode;
    if (parent) {
      parent.removeChild(ele);
    }
  };

  const emptyElement = (ele) => {
    ele.innerHTML = '';
  };

  function listHandle(ele) {
    const children = ele.children;
    const len = Array.from(children).filter(child => child.tagName === 'LI').length;
    if (len === 0) return false
    const firstChild = children[0];
    // 解决有时ul元素子元素不是 li元素的 bug。
    if (firstChild.tagName !== 'LI') return listHandle(firstChild)
    Array.from(children).forEach((c, i) => {
      if (i > 0) c.parentNode.removeChild(c);
    });
    // 将 li 所有兄弟元素设置成相同的元素，保证生成的页面骨架整齐
    for (let i = 1; i < len; i++) {
      ele.appendChild(firstChild.cloneNode(true));
    }
  }

  /**
   * use the same config options as image block.
   */

  function backgroundHandler(ele, { color, shape }) {
    const imageClass = CLASS_NAME_PREFEX + 'image';
    const shapeClass = CLASS_NAME_PREFEX + shape;
    const rule = `{
    background: ${color} !important;
  }`;
    
    addStyle(`.${imageClass}`, rule);

    shapeStyle(shape);

    addClassName(ele, [imageClass, shapeClass]);
  }

  /**
   * [buttonHandler 改变 button 元素样式：包括去除 border和 box-shadow, 背景色和文字颜色统一]
   */

  function buttonHandler(ele, { color, excludes }) {
    if (excludes.indexOf(ele) > -1) return false
    const classname = CLASS_NAME_PREFEX + 'button';
    const rule = `{
    color: ${color} !important;
    background: ${color} !important;
    border: none !important;
    box-shadow: none !important;
  }`;
    addStyle(`.${classname}`, rule);
    ele.classList.add(classname);
  }

  function grayHandler(ele, { color }) {
    const classname = CLASS_NAME_PREFEX + 'gray';
    const rule = `{
    color: ${color} !important;
    background: ${color} !important;
  }`;
    addStyle(`.${classname}`, rule);
    ele.classList.add(classname);

    const elements = ele.querySelectorAll('*');
    Array.from(elements).forEach(element => {
      const childNodes = element.childNodes;
      if (Array.from(childNodes).some(n => n.nodeType === Node.TEXT_NODE)) {
        element.classList.add(classname);
      }
    });
  }

  function imgHandler(ele, { color, shape, shapeOpposite }) {
    const { width, height } = ele.getBoundingClientRect();
    const attrs = {
      width,
      height,
      src: SMALLEST_BASE64
    };

    const finalShape = shapeOpposite.indexOf(ele) > -1 ? getOppositeShape(shape) : shape;

    setAttributes(ele, attrs);
    
    const className = CLASS_NAME_PREFEX + 'image';
    const shapeName = CLASS_NAME_PREFEX + finalShape;
    const rule = `{
    background: ${color} !important;
  }`;
    addStyle(`.${className}`, rule);
    shapeStyle(finalShape);

    addClassName(ele, [className, shapeName]);

    if (ele.hasAttribute('alt')) {
      ele.removeAttribute('alt');
    }
  }

  function pseudosHandler({ ele, hasBefore, hasAfter }, { color, shape, shapeOpposite }) {
    const finalShape = shapeOpposite.indexOf(ele) > -1 ? getOppositeShape(shape) : shape;
    const PSEUDO_CLASS = `${CLASS_NAME_PREFEX}pseudo`;
    const PSEUDO_RECT_CLASS = `${CLASS_NAME_PREFEX}pseudo-rect`;
    const PSEUDO_CIRCLE_CLASS = `${CLASS_NAME_PREFEX}pseudo-circle`;

    const rules = {
      [`.${PSEUDO_CLASS}::before, .${PSEUDO_CLASS}::after`]: `{
      background: ${color} !important;
      background-image: none !important;
      color: transparent !important;
      border-color: transparent !important;
    }`,
      [`.${PSEUDO_RECT_CLASS}::before, .${PSEUDO_RECT_CLASS}::after`]: `{
      border-radius: 0 !important;
    }`,
      [`.${PSEUDO_CIRCLE_CLASS}::before, .${PSEUDO_CIRCLE_CLASS}::after`]: `{
      border-radius: 50% !important;
    }`
    };

    Object.keys(rules).forEach(key => {
      addStyle(key, rules[key]);
    });

    addClassName(ele, [PSEUDO_CLASS, finalShape === 'circle' ? PSEUDO_CIRCLE_CLASS : PSEUDO_RECT_CLASS]);
  }

  function svgHandler(ele, { color, shape, shapeOpposite }, cssUnit, decimal) {
    const { width, height } = ele.getBoundingClientRect();

    if (width === 0 || height === 0 || ele.getAttribute('aria-hidden') === 'true') {
      return removeElement(ele)
    }

    const finalShape = shapeOpposite.indexOf(ele) > -1 ? getOppositeShape(shape) : shape;

    emptyElement(ele);

    const shapeClassName = CLASS_NAME_PREFEX + shape;
    shapeStyle(shape);

    Object.assign(ele.style, {
      width: px2relativeUtil(width, cssUnit, decimal),
      height: px2relativeUtil(height, cssUnit, decimal),
    });

    addClassName(ele, [shapeClassName]);

    if (color === TRANSPARENT) {
      setOpacity(ele);
    } else {
      const className = CLASS_NAME_PREFEX + 'svg';
      const rule = `{
      background: ${color} !important;
    }`;
      addStyle(`.${className}`, rule);
      ele.classList.add(className);
    }
  }

  function addTextMask(paragraph, {
    textAlign,
    lineHeight,
    paddingBottom,
    paddingLeft,
    paddingRight
  }, maskWidthPercent = 0.5) {
    let left;
    let right;
    switch (textAlign) {
      case 'center':
        left = document.createElement('span');
        right = document.createElement('span')
        ;[left, right].forEach(mask => {
          Object.assign(mask.style, {
            display: 'inline-block',
            width: `${maskWidthPercent / 2 * 100}%`,
            height: lineHeight,
            background: '#fff',
            position: 'absolute',
            bottom: paddingBottom
          });
        });
        left.style.left = paddingLeft;
        right.style.right = paddingRight;
        paragraph.appendChild(left);
        paragraph.appendChild(right);
        break
      case 'right':
        left = document.createElement('span');
        Object.assign(left.style, {
          display: 'inline-block',
          width: `${maskWidthPercent * 100}%`,
          height: lineHeight,
          background: '#fff',
          position: 'absolute',
          bottom: paddingBottom,
          left: paddingLeft
        });
        paragraph.appendChild(left);
        break
      case 'left':
      default:
        right = document.createElement('span');
        Object.assign(right.style, {
          display: 'inline-block',
          width: `${maskWidthPercent * 100}%`,
          height: lineHeight,
          background: '#fff',
          position: 'absolute',
          bottom: paddingBottom,
          right: paddingRight
        });
        paragraph.appendChild(right);
        break
    }
  }

  function textHandler(ele, { color }, cssUnit, decimal) {
    const { width } = ele.getBoundingClientRect();
    // if the text block's width is less than 50, just set it to transparent.
    if (width <= 50) {
      return setOpacity(ele)
    }
    const comStyle = getComputedStyle(ele);
    const text = ele.textContent;
    let {
      lineHeight,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      position: pos,
      fontSize,
      textAlign,
      wordSpacing,
      wordBreak
    } = comStyle;

    if (!/\d/.test(lineHeight)) {
      const fontSizeNum = parseInt(fontSize, 10) || 14;
      lineHeight = `${fontSizeNum * 1.4}px`;
    }

    const position = ['fixed', 'absolute', 'flex'].find(p => p === pos) ? pos : 'relative';

    const height = ele.offsetHeight;
    // Math.floor
    const lineCount = (height - parseInt(paddingTop, 10) - parseInt(paddingBottom, 10)) / parseInt(lineHeight, 10) | 0; // eslint-disable-line no-bitwise

    let textHeightRatio = parseInt(fontSize, 10) / parseInt(lineHeight, 10);
    if (Number.isNaN(textHeightRatio)) {
      textHeightRatio = 1 / 1.4; // default number
    }
    /* eslint-disable no-mixed-operators */
    const firstColorPoint = ((1 - textHeightRatio) / 2 * 100).toFixed(decimal);
    const secondColorPoint = (((1 - textHeightRatio) / 2 + textHeightRatio) * 100).toFixed(decimal);
    const backgroundSize = `100% ${px2relativeUtil(lineHeight, cssUnit, decimal)}`;
    const className = CLASS_NAME_PREFEX + 'text-' + firstColorPoint.toString(32).replace(/\./g, '-');

    const rule = `{
    background-image: linear-gradient(transparent ${firstColorPoint}%, ${color} 0%, ${color} ${secondColorPoint}%, transparent 0%) !important;
    background-size: ${backgroundSize};
    position: ${position} !important;
  }`;

    const invariableClassName = CLASS_NAME_PREFEX + 'text';

    const invariableRule = `{
    background-origin: content-box !important;
    background-clip: content-box !important;
    background-color: transparent !important;
    color: transparent !important;
    background-repeat: repeat-y !important;
  }`;

    addStyle(`.${className}`, rule);
    addStyle(`.${invariableClassName}`, invariableRule);
    addClassName(ele, [className, invariableClassName]);
    /* eslint-enable no-mixed-operators */
    // add white mask
    if (lineCount > 1) {
      addTextMask(ele, comStyle);
    } else {
      const textWidth = getTextWidth(text, {
        fontSize,
        lineHeight,
        wordBreak,
        wordSpacing
      });
      const textWidthPercent = textWidth / (width - parseInt(paddingRight, 10) - parseInt(paddingLeft, 10));
      ele.style.backgroundSize = `${(textWidthPercent > 1 ? 1 : textWidthPercent) * 100}% ${px2relativeUtil(lineHeight, cssUnit, decimal)}`;
      switch (textAlign) {
        case 'left': // do nothing
          break
        case 'center':
          ele.style.backgroundPositionX = '50%';
          break
        case 'right':
          ele.style.backgroundPositionX = '100%';
          break
      }
    }
  }

  const addBlick = () => {
    const style = document.createElement('style');
    const styleContent = `
      @keyframes blink {
        0% {
          opacity: .4;
        }

        50% {
          opacity: 1;
        }

        100% {
          opacity: .4;
        }
      }
      .blink {
        animation-duration: 2s;
        animation-name: blink;
        animation-iteration-count: infinite;
      }
    `;
    style.innerHTML = styleContent;
    document.head.appendChild(style);
    document.body.firstElementChild.classList.add('blink');
  };

  const addShine = () => {
    const style = document.createElement('style');
    const styleContent = `
      body {
        overflow: hidden;
      }
      @keyframes flush {
        0% {
          left: -100%;
        }
        50% {
          left: 0;
        }
        100% {
          left: 100%;
        }
      }
      .sk-loading {
        animation: flush 2s linear infinite;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background: linear-gradient(to left, 
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, .85) 50%,
          rgba(255, 255, 255, 0) 100%
        )
      }
    `;
    style.innerHTML = styleContent;
    const load = document.createElement('div');
    load.classList.add('sk-loading');
    document.head.appendChild(style);
    document.body.appendChild(load);
  };

  const addSpin = () => {
    const style = document.createElement('style');
    const styleContent = `
      @keyframes loading-rotate {
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes loading-dash {
        0% {
          stroke-dasharray: 1, 200;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -40px;
        }
        100% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -120px;
        }
      }

      .sk-loading-spinner {
        top: 50%;
        margin-top: -0.5rem;
        width: 100%;
        text-align: center;
        position: absolute;
      }

      .sk-loading-spinner .circular {
        height: 1rem;
        width: 1rem;
        animation: loading-rotate 2s linear infinite;
      }

      .sk-loading-spinner .path {
        animation: loading-dash 1.5s ease-in-out infinite;
        stroke-dasharray: 90,150;
        stroke-dashoffset: 0;
        stroke-width: 2;
        stroke: #409eff;
        stroke-linecap: round;
      }
    `;
    style.innerHTML = styleContent;
    document.head.appendChild(style);
    const spinContainer = document.createElement('div');
    spinContainer.classList.add('sk-loading-spinner');
    spinContainer.innerHTML = `<svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>`;
    document.body.appendChild(spinContainer);
  };

  function traverse(options) {
    const { remove, excludes, text, image, button, svg, grayBlock, pseudo, cssUnit, decimal } = options;
    const excludesEle = excludes.length ? Array.from($$(excludes.join(','))) : [];
    const grayEle = grayBlock.length ? Array.from($$(grayBlock.join(','))) : [];
    const rootElement = document.documentElement;

    const texts = [];
    const buttons = [];
    const hasImageBackEles = [];
    let toRemove = [];
    const imgs = [];
    const svgs = [];
    const pseudos = [];
    const gradientBackEles = [];
    const grayBlocks = [];

    if (Array.isArray(remove)) {
      remove.push(CONSOLE_SELECTOR, ...PRE_REMOVE_TAGS);
      toRemove.push(...$$(remove.join(',')));
    }

    if (button && button.excludes.length) {
      // translate selector to element
      button.excludes = Array.from($$(button.excludes.join(',')));
    }
  [svg, pseudo, image].forEach(type => {
      if (type.shapeOpposite.length) {
        type.shapeOpposite = Array.from($$(type.shapeOpposite.join(',')));
      }
    })

    ;(function preTraverse(ele) {
      const styles = getComputedStyle(ele);
      const hasPseudoEle = checkHasPseudoEle(ele);
      if (!inViewPort(ele) || DISPLAY_NONE.test(ele.getAttribute('style'))) {
        return toRemove.push(ele)
      }
      if (~grayEle.indexOf(ele)) { // eslint-disable-line no-bitwise
        return grayBlocks.push(ele)
      }
      if (~excludesEle.indexOf(ele)) return false // eslint-disable-line no-bitwise

      if (hasPseudoEle) {
        pseudos.push(hasPseudoEle);
      }

      if (checkHasBorder(styles)) {
        ele.style.border = 'none';
      }

      if (ele.children.length > 0 && /UL|OL/.test(ele.tagName)) {
        listHandle(ele);
      }
      if (ele.children && ele.children.length > 0) {
        Array.from(ele.children).forEach(child => preTraverse(child));
      }

      // 将所有拥有 textChildNode 子元素的元素的文字颜色设置成背景色，这样就不会在显示文字了。
      if (ele.childNodes && Array.from(ele.childNodes).some(n => n.nodeType === Node.TEXT_NODE)) {
        transparent(ele);
      }
      if (checkHasTextDecoration(styles)) {
        ele.style.textDecorationColor = TRANSPARENT;
      }
      // 隐藏所有 svg 元素
      if (ele.tagName === 'svg') {
        return svgs.push(ele)
      }
      if (EXT_REG.test(styles.background) || EXT_REG.test(styles.backgroundImage)) {
        return hasImageBackEles.push(ele)
      }
      if (GRADIENT_REG.test(styles.background) || GRADIENT_REG.test(styles.backgroundImage)) {
        return gradientBackEles.push(ele)
      }
      if (ele.tagName === 'IMG' || isBase64Img(ele)) {
        return imgs.push(ele)
      }
      if (
        ele.nodeType === Node.ELEMENT_NODE &&
        (ele.tagName === 'BUTTON' || (ele.tagName === 'A' && ele.getAttribute('role') === 'button'))
      ) {
        return buttons.push(ele)
      }
      if (
        ele.childNodes &&
        ele.childNodes.length === 1 &&
        ele.childNodes[0].nodeType === Node.TEXT_NODE &&
        /\S/.test(ele.childNodes[0].textContent)
      ) {
        return texts.push(ele)
      }
    }(rootElement));

    svgs.forEach(e => svgHandler(e, svg, cssUnit, decimal));
    texts.forEach(e => textHandler(e, text, cssUnit, decimal));
    buttons.forEach(e => buttonHandler(e, button));
    hasImageBackEles.forEach(e => backgroundHandler(e, image));
    imgs.forEach(e => imgHandler(e, image));
    pseudos.forEach(e => pseudosHandler(e, pseudo));
    gradientBackEles.forEach(e => backgroundHandler(e, image));
    grayBlocks.forEach(e => grayHandler(e, button));
    // remove mock text wrapper
    const offScreenParagraph = $(`#${MOCK_TEXT_ID}`);
    if (offScreenParagraph && offScreenParagraph.parentNode) {
      toRemove.push(offScreenParagraph.parentNode);
    }
    toRemove.forEach(e => removeElement(e));
  }

  function genSkeleton(options) {
    const {
      remove,
      hide,
      loading = 'spin'
    } = options;
    /**
     * before walk
     */
    // 将 `hide` 队列中的元素通过调节透明度为 0 来进行隐藏
    if (hide.length) {
      const hideEle = $$(hide.join(','));
      Array.from(hideEle).forEach(ele => setOpacity(ele));
    }
    /**
     * walk in process
     */

    traverse(options);
    /**
     * add `<style>`
     */
    let rules = '';

    for (const [selector, rule] of styleCache) {
      rules += `${selector} ${rule}\n`;
    }

    const styleEle = document.createElement('style');

    if (!window.createPopup) { // For Safari
      styleEle.appendChild(document.createTextNode(''));
    }
      styleEle.innerHTML = rules;
    if (document.head) {
      document.head.appendChild(styleEle);
    } else {
      document.body.appendChild(styleEle);
    }
    /**
     * add animation of skeleton page when loading
     */
    switch (loading) {
      case 'chiaroscuro':
        addBlick();
        break
      case 'spin':
        addSpin();
        break
      case 'shine':
        addShine();
        break
      default:
        addSpin();
        break
    }
  }

  function getHtmlAndStyle() {
    const root = document.documentElement;
    const rawHtml = root.outerHTML;
    const styles = Array.from($$('style')).map(style => style.innerHTML || style.innerText);
    Array.from($$(AFTER_REMOVE_TAGS.join(','))).forEach(ele => removeElement(ele));
    // fix html parser can not handle `<div ubt-click=3659 ubt-data="{&quot;restaurant_id&quot;:1236835}" >`
    // need replace `&quot;` into `'`
    const cleanedHtml = document.body.innerHTML.replace(/&quot;/g, "'");
    return {
      rawHtml,
      styles,
      cleanedHtml
    }
  }

  exports.genSkeleton = genSkeleton;
  exports.getHtmlAndStyle = getHtmlAndStyle;

  return exports;

}({}));
