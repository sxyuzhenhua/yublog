
## 一、介绍

本质上，webpack是一个用于现代javascript应用程序的静态模块打包工具，当 webpck 处理应用程序时，会内部构建一个依赖图(dependency graph), 此依赖图对应的映射到项目所需要的每一个模块，并生成一个或多个bundle.

`

npm  install webpack webpack-cli 

// webpack-cli 是命令行工具

`

## 二、环境差异

* 开发环境： 需要生成sourcemap文件； 需要打印debug信息；需要live reload 和 hot reload 的功能；

* 生产环境：可能需要分离css 成单独的文件，以使多个页面共享同一个CSS文件； 需要压缩HTML/CSS/JS 代码； 需要压缩图片

## 三、publicPath 区别

```       

//启动命令   

// npx webpack serve --config webpack.config1.js      

const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

​    mode: 'development',

​    entry: './src/index.js',

​    output: {

​        path: path.resolve(__dirname, 'dist'),   // 打包后的 文件目录

​        filename: 'main.js',

​        publicPath: '/devmiddlepath'  // 最好和devMiddleware里面保持一致， 打包后的 main.js 前缀，文件如下 <script defer src="/assets/main.js"></script></head>；可以是CDN地址

​    },

​    devServer: {

​        port: 8000,

​        open: true,

​        hot: true,

​        static: {

​            directory: path.join(__dirname, 'assets'), // 静态文件从哪里取

​            publicPath: '/staticfile',  // 访问静态资源路径是   http://localhost:8000/staticfile/a.png

​        },

​        devMiddleware: {

​            index: true,

​            publicPath: '/devmiddlepath', //把dist目录映射成devmiddlepath，访问打包后的路径是   http://localhost:8000/devmiddlepath

​        }

​    },

​    plugins: [

​        new HtmlWebpackPlugin({

​            template: './public/index.html',

​            filename: 'index.html'

​        })

​    ]

}

```

## 四、babel-loader & @babel/core & 预设 的关系

* babel-loader:  作用是调用@babel/core；

* @babel/core: 提供过程管理，把源代码转换成抽象语法树，本身并不知道具体转什么语法，靠预设；

* 预设（presets）：可以理解为各种plugins的集合

> 1. 先把ES6转成抽象语法树；@babel/core;

> 2. 然后调用preset-env把ES6语法树转成ES5语法树; preset-env;

> 3. 把ES5语法树转成ES5代码；@babel/core;

#### 4.1 babel-loader 

```  

const core = require('@babel/core')

const path = require('path');

/**

 * 

 * @param {*} source 

 * @param {*} inputSourceMap 

 * @param {*} overrides 

 * @returns 

 */

function loader(source, inputSourceMap, overrides) {

​    const options = {

​        presets: ['@babel/preset-env'],

​        inputSourceMap, // 上一个loader传递过来的sourcemap

​        sourceMaps: true, // 告诉babel  我要生成sourcemap

​        filename: path.basename(this.resourcePath)

​    }

​    const {code, map, ast} = core.transform(source, options)

​    return this.callback(null, code, map, ast);

}

/**

 * 当需要返回多值，用 this.calback, 异步

 * 只返回一个值，return

 * 

 */

module.exports = loader;

```

#### 4.2 使用自定义的 loader 三种方法

```   

​    resolveLoader: {

​        // 第一种

​        // alias: {   

​        //     'babel-loader': path.resolve('./loaders/babel-loader.js')

​        // },

​        // 第二种

​        modules: [path.resolve('./loaders'), 'node_modules'] 

​    },

​    

​    

​        module: {

​        rules: [

​            {

​                test: /.jsx?$/,

​                use: [ path.resolve('./loaders/babel-loader.js')]   // 第三种

​            },

​        ]

​    },

```

#### 4.3 babel-polyfill && babel-runtime && babel-plugin-transform-runtime

webpack 使用babel:   npm install -D babel-loader @babel/core @babel/preset-env webpack   

##### 4.3.1 babel-polyfill

* Babel默认只转换新的 javascript 的语法，而不转换新的API，比如 Iterator，Generator, Set, Map, Proxy, Reflect, Symbol, Promise等全局对象，以及一些在全局对象上的方法，比如Object.assign,都不会转码；

* 比如,  ES6在Array对象上新增了 Array.from 方法，Babel就不会转码这个方法，如果想让这个方法运行，就必须使用babel-polyfill 来转换等；

* babel-polyfill 是通过向全局对象和内置的prototype上添加方法来实现的，比如运行环境中不支持Array.find, 引入polyfill ，我们就可以使用es6方法来编写了，但是缺点就是会造成全局污染；

* @babel/preset-env 为每一个环境的预设；   

"useBuiltIns": false        此时不对polyfill做操作，如果引入@babel-polyfill,则无视配置的浏览器兼容，引入所有的polyfill；    

"useBuiltIns": "entry"    根据配置的浏览器兼容，引入浏览器不兼容的polyfill,需要在入口文件手动添加 import "@babel-plyfill"，会自动根据browserlist 替换成浏览器不兼容的polyfill;需要手动引入；   

"useBuiltIns": "usage"   需要的时候在自动引入，不需要手动引入；   

> import 'core-js/stable.js'    

> import 'regenerator-runtime/runtime'    

![执行结果](/image/1523927904.png "执行结果截图index")

**如何使用babel-polyfill**

```

// 1. npm install --save @babel/polyfill

// 2. 在src文件下引入

require("@babel/polyfill");

```

##### 4.3.2 babel-runtime

* Babel为了解决全局空间污染的问题，提供了单独的babel-polyfill ；重新构造，所以体积比较大；

* 简单的说，babel-runtime 更像是一种按需加载的实现，哪里需要使用 Promise , 只要在这个文件头部 import Promise from 'babel-runtime/core-js/promise'   

```   

// npm i @babel/runtime-corejs2 -D

const Promise = require ('@babel/runtime-corejs2/core-js/promise.js');

export const p = new Promise((resolve, reject) => {

​    console.log(9999);

​    resolve(true);

});

console.log(p)

```

![执行结果](/image/1523818106.png)

##### 4.3.3 babel-plugin-transform-runtime

* 启用插件 babel-plugin-transform-runtime 后，Babel就会使用 babel-runtime 下的工具函数; 就是可以在我们使用新的API时自动 import babel-runtime 里面的polyfill

* 当我们使用 async/await 时，自动引入 babel-runtime/regenerator;

* 当我们使用 ES6 的静态事件或者内置对象时，自动引入babel-runtime/core-js;

* 移除内联 babel helpers 并替换使用babel-runtime helpers 来替换；   

```

//npm install --save-dev @babel/plugin-transform-runtime

// npm install --save @babel/runtime

// npm install @babel/runtime-corejs2

loader: 'babel-loader',

  options: {

​    presets: ['@babel/preset-env'],

​    plugins: [

​      [

​        '@babel/plugin-transform-runtime', {

​          // "absoluteRuntime": false,

​          "corejs": 2, // 要安装 @babel/runtime-corejs2

​          // "helpers": true,   // 是否需要提取一些类的继承帮助方法

​          // "regenerator": true,  // 

​          // "useESModules": false

​        }

​      ]

  ]

}

```

![执行结果](/image/1523992722.png)

## 五、SourceMap

* sourcemap是为了解决开发代码与实际运行代码不一致时帮助我们 debug 到原始开发代码的技术

* webpack 通过配置可以自动给我们 source maps 文件，map 文件是一种对应编译文件和源文件的方法

![执行结果](/image/1652864538221.jpg)

- 看似配置项很多，其实只是五个关键字eval、 source-map、cheap、 module、和inline的任意组合

![执行结果](/image/1652864616350.jpg)

1. 顺序： [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

2. new webpack.SourceMapDevToolPlugin({ filename: '[name].js.map', exclude: ['vendor.js'], });

> - 开发环境： eval-cheap-source-map,  cheap-module-source-map , => eval-source-map 

> - 正式环境：hidden-source-map 

> - 最佳实践：

> - 开发环境：快（eval），信息全展示源码（module），且由于此时代码未压缩，不在意代码列信息（cheap），所以：devtool: 'eval-cheap-module-source-map';

> - 生产环境: 我们不希望任何人在浏览器直接看到源码，不应该提供 sourcemap 给浏览器。所以：devtool: 'hidden-source-map';  把sourcemap 文件单独上传到内网；

> -一方面webpack会生成sourcemap文件以提供给错误收集工具比如sentry,另一方面又不会为budle 添加🚰注释，以避免浏览器使用

```

devtool: false,

plugins: [

   new webpack.SourceMapDevToolPlugin({

​       filename: '[file].map',

​       append: 'n//# sourceMappingURL=https://localhost:9000/[url]',

   }),

]

```

## 六、 MPA多页面配置

#### 6.1 直接写简单配置

```

 entry: {

​        page1: './src/page1.js',

​        page2: './src/page2.js',

​    },

​    

output: {

​        path: path.resolve(__dirname, 'dist'),

​        filename: '[name].js',

​        // chunkFilename: '[name].main11.js'

},

plugins: [

​        new HtmlWebpackPlugin({

​            template: './public/index.html',

​            filename: 'page1.html',

​            chunks: ['page1']

​        }),

​        new HtmlWebpackPlugin({

​            template: './public/index.html',

​            filename: 'page2.html',

​            chunks: ['page2']

​        })

 ]

```

#### 6.2 野生 node API

```

const pages = fs.readdirSync(path.resolve(__dirname, 'pages'))

let entries = pages.reduce((result, cur) => {

​    result[path.basename(cur, '.jsx')] = `./pages/${cur}`

​    return result;

},{})

let plugins = [];

pages.map(item => {

​    console.log(999, item);

​     plugins.push(

​            new HtmlWebpackPlugin({

​            template: 'public/index.html',

​            filename: `${path.basename(item, '.jsx')}.html`,

​            chunks: [`${path.basename(item, '.jsx')}`]

​        })

​    )

})

module.exports = (env) => {

​    return {

​        entry: entries,

​        output: {

​            filename: '[name].js',

​            path: path.resolve(__dirname, 'dist'),

​            clean: true,

​            // publicPath: '/',

​        },

​        plugins: [

​            ...plugins,

​            new webpack.DefinePlugin({

​                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),

​            })

​        ]

​    }

}

```

#### 6.3 借助 glob  库

```

const glob = require('glob');

const setMPA = () => {

​    const entries = {};

​    const htmlWebpackPlugins = [];

​    const entryFiles = glob.sync(path.join(__dirname, './src/pages/*.js'));

​    console.log(123,entryFiles); // [ '/Users/yuzhenhua/project/webpack/src/pages/index.js', '/Users/yuzhenhua/project/webpack/src/pages/prodlist.js' ]

​    

​    entryFiles.forEach(item => {

​        let match = item.match(/src/pages/(.*).js/);

​        let key = match[1]

​        entries[key] = './' + match[0];

​        htmlWebpackPlugins.push(

​            new HtmlWebpackPlugin({

​                template: './public/index.html',

​                filename: `${key}.html`,

​                chunks: [key]

​            })

​        )

​    })

​    

​    console.log(111, entries, htmlWebpackPlugins);

​    return {

​        entries, htmlWebpackPlugins

​    }

}

const { entries, htmlWebpackPlugins } = setMPA();

``` 

## 七、引入第三方类库(lodash，jquery）

#### 7.1 直接引入

```    

import _ from 'lodash'

console.log(_.join(['a', 'b', 'c'], '-'))

```  

缺点：每次都要引用