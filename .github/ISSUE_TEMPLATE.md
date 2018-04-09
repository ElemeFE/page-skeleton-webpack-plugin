### Description

[Description of the bug or feature]

### Steps to reproduce

1. [First step]
2. [Second step]
3. [and so on...]

**Expected behavior:** [What you expected to happen]

**Actual behavior:** [What actually happened]

**Link to an example:** [If you're reporting a bug that's not reproducible, please try to reproduce it on [JSFiddle](https://jsfiddle.net/), [JS Bin](https://jsbin.com), [CodePen](http://codepen.io/) or a similar service and paste a link here]

### Plugin configration

for example:

```javascript
new SkeletonPlugin({
  pathname: path.resolve(__dirname, `./src`),
  port: '7890',
  loading: 'spin',
  svg: {
    color: '#EFEFEF',
    shape: 'circle',
    shapeOpposite: ['.red']
  },
  image: {
    shape: 'rect', // `rect` | `circle`
    color: '#EFEFEF',
    shapeOpposite: ['.white']
  },
  pseudo: {
    color: '#EFEFEF', // or transparent
    shape: 'circle', // circle | rect
    shapeOpposite: ['.apple', '.pen']
  },
  button: {
    color: '#EFEFEF',
    excludes: ['.center a']
  },
  defer: 5000,
  excludes: [],
  remove: [],
  hide: ['.ag-text', '.ag-image'],
  grayBlock: ['#header'],
  cssUnit: 'vw',
  cookies: [{
    name: 'SID',
    value: 'xxxxxx',
    url: 'https://xx.xxx.xx'
  }, {
    name: 'USERID',
    value: 'xxxxxx',
    url: 'https://xx.xxx.xx'
  }]
})
```

### Versions

- Page Skeleton:
- Webpack:
