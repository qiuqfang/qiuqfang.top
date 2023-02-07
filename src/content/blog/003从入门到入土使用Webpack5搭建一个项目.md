---
title: "从入门到入土使用Webpack5搭建一个项目"
description: "手把手教你如何从零搭建一个Webpack项目"
pubDate: "Oct 05 2021"
---

## 引言

在日常开发中，我们开发一个项目用到的都是`Vue`、`React`等官方出的脚手架；或者团队内部自定义的脚手架。脚手架中封装了许多功能，但是如果没有特别好的文档的话，我们要通过脚手架去自定义的话就会发现有很多功能的定义对我们并不友好，这里本着让大多数人从入门到入土使用`Webpack5`搭建一个项目，让更多人了解脚手架的内部功能。

## 技术选型

`yarn`：包管理器

`Webpack`：什么还有人不知道`Webpack`是啥，但针对前端开发者而言，估计工作当中每时每刻都在有意或无意的接触着`Webpack`。可以看[这里](https://webpack.docschina.org/concepts/)哦！！！

`ESLint`：这是一个提供插件化的 javascript 代码检测工具。它能让你在团队协作开发的时候，统一代码风格。

`Prettier`：让你在`ESLint`的前提下格式化代码的一个插件工具。

`Babel`：一个用来转译 ECMAScript 2015+ 至可兼容浏览器的版本工具。

`husky + lint-staged`：用来构建代码检查工作流。

`Postcss`：故名思意是用来处理`CSS`的工具。

## 搭建项目

### 项目出生

新建一个项目 webpack-project，进入项目根目录，打开命令行使用`yarn init -y`创建 package.json

![image-20210911195520406](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210911195520406-8360d225bfde4e06b607ace368b3a75a-20220421115143764.png?token=AJQWBIAF7DRG2KGNLP6SLXDCMDKQY)

安装`webpack@5.46.0`、`webpack-cli@4.7.2`、`webpack-merge@5.7.3`、`webpack-dev-server@3.11.2`、`webpack-bundle-analyze`

```shell
yarn add -D webpack@5.46.0 webpack-cli@4.7.2 webpack-merge@5.7.3 webpack-dev-server@3.11.2 compression-webpack-plugin
```

### 开发环境配置

新建配置文件`webpack.dev.js`

#### mode

用来指定当前环境

```js
module.exports = merge(common, {
  mode: "development",
});
```

#### devtool

用来指定生成 sourceMap 的格式

```js
module.exports = merge(common, {
  devtool: "eval-cheap-module-source-map",
});
```

#### 解析图片与字体

配置解析图片与字体（开发与生产环境下 publicPath 可能会有不同所以分开配置）

```js
module.exports = merge(common, {
  module: {
    rules: [
      // 解析图片
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset",
        generator: {
          publicPath: "/",
          filename: "images/[hash][ext][query]",
        },
      },
      // 解析字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset",
        generator: {
          publicPath: "/",
          filename: "fonts/[hash][ext][query]",
        },
      },
    ],
  },
});
```

#### 优化压缩 JS 文件

通过 terser-webpack-plugin 插件来压缩 JS 文件

```js
const TerserWebpackPlugin = require("terser-webpack-plugin"); // 优化压缩js文件 webpack5内置
module.exports = merge(common, {
  optimization: {
    minimizer: [new TerserWebpackPlugin()],
  },
});
```

#### 开启一个服务

在开发环境中我们需要时刻观察页面的变化与逻辑，那么开启一个热更新服务是很有必要的，只要你更新了代码，就会实时刷新页面，那么就需要用到 webpack-dev-server 这个工具啦。

```js
module.exports = merge(common, {
  // 为了解决添加了browserslist文件出现无法热更新的问题（https://github.com/webpack/webpack-dev-server/issues/2758）
  // https://github.com/webpack/webpack-dev-server/issues/2758 已关闭，但webpack并未解决此bug，必须添加该语句
  target: "web",
  devServer: {
    compress: true, // 开启gzip压缩
    open: true,
    port: 9000,
    hot: true,
  },
});
```

### 生产环境配置

新建配置文件`webpack.prod.js`

#### mode

用来指定当前环境

```js
module.exports = merge(common, {
  mode: "production",
});
```

#### devtool

用来指定生成 sourceMap 的格式

```js
module.exports = merge(common, {
  devtool: "source-map",
});
```

#### 解析图片与字体

配置解析图片与字体（开发与生产环境下 publicPath 可能会有不同所以分开配置）

```js
module.exports = merge(common, {
  module: {
    rules: [
      // 解析图片
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset",
        generator: {
          publicPath: "/dist/",
          filename: "images/[hash][ext][query]",
        },
      },
      // 解析字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset",
        generator: {
          publicPath: "/dist/",
          filename: "fonts/[hash][ext][query]",
        },
      },
    ],
  },
});
```

#### 优化压缩 JS 文件

通过 terser-webpack-plugin 插件来压缩 JS 文件（删除 console）

```js
const TerserWebpackPlugin = require("terser-webpack-plugin"); // 优化压缩js文件 webpack5内置
module.exports = merge(common, {
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
});
```

#### 开启 GZIP 压缩，减小请求压力

通过 compression-webpack-plugin 插件开启 gzip 压缩

```js
const CompressionWebpackPlugin = require("compression-webpack-plugin"); // gzip压缩
module.exports = merge(common, {
  plugins: [
    /* 开启gzip压缩 */
    new CompressionWebpackPlugin({
      test: /\.js$|\.html$|\.css/,
      include: undefined,
      exclude: undefined,
      algorithm: "gzip",
      compressionOptions: { level: 9 },
      threshold: 0,
      minRatio: 0.8,
      filename: "[path][base].gz",
      deleteOriginalAssets: false, // 项目上线时改为true，为了开启打包文件分析工具必须改为false
    }),
  ],
});
```

接下来就是一个项目的主要配置，在`webpack.common.js`中我们需要配置`entry`、`output`、通用`module.rules`、`resolve`、通用`optimization`、通用`plugins`。

### 通用配置

#### entry

配置页面的入口文件。

```js
const path = require("path");
module.exports = {
  entry: {
    page1: {
      import: path.resolve(__dirname, "src/pages/page1/index.js"),
    },
    page2: {
      import: path.resolve(__dirname, "src/pages/page2/index.js"),
    },
  },
};
```

#### output

配置项目打包后 js 文件的输出目录

```js
const path = require("path");
module.exports = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
    // webpack5.20+ 功能:CleanWebpackPlugin
    clean: true,
  },
};
```

#### 通用`module.rules`

配置通用 rules。

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 将css文件提取出来
// 使用 mini-css-extract-plugin 需要在 plugins 中引入
module.exports = {
  module: {
    rules: [
      // 解析html，需要安装 html-loader，通过 yarn add -D html-loader安装， 无需引入
      {
        test: /\.(html|htm)$/i,
        use: ["html-loader"],
      },
      // 解析css，需要安装 postcss-loader、css-loader，通过 yarn add -D html-loader css-loader 安装， 无需引入
      {
        test: /\.css$/i,
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.less$/i,
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.styl$/i,
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "stylus-loader",
        ],
      },
      // 解析js
      {
        test: /\.js$/,
        exclude: /(node_modules|lib)/,
        use: ["babel-loader"],
      },
    ],
  },
};
```

#### resolve

解析路径。

```js
const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      vue$: "vue/dist/vue.min.js",
    },
    extensions: [".js", ".json", ".wasm"],
    modules: ["node_modules"],
    symlinks: false, // 减少 npm link 或 yarn link 解析工作量
  },
};
```

#### 通用`optimization`

```js
const HtmlMinimizerWebpackPlugin = require("html-minimizer-webpack-plugin"); // 优化压缩html文件
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin"); // 优化压缩css文件

module.exports = {
  optimization: {
    minimize: true, // 最小化bundle
    minimizer: [
      new HtmlMinimizerWebpackPlugin(),
      new CssMinimizerWebpackPlugin(),
    ],
    splitChunks: {
      // 分包，拆分模块
      chunks: "initial",
      cacheGroups: {
        vue: {
          test: /[\\/]node_modules[\\/](vue)[\\/]/,
          name: "vue",
          priority: 0,
          reuseExistingChunk: true,
        },
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: "single", // 值single将创建一个运行时文件，用于共享所有生成的块。值multiple向每个入口点创建一个运行时文件
  },
};
```

#### 通用`plugins`

```js
const glob = require("glob");
const path = require("path");
const chalk = require("chalk");

const ProgressBarWebpackPlugin = require("progress-bar-webpack-plugin"); // 进度条

const HtmlWebpackPlugin = require("html-webpack-plugin"); // 配置html
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 将css文件提取出来
const PurgecssWebpackPlugin = require("purgecss-webpack-plugin"); // css摇树，只打包实际用到的代码

const HtmlMinimizerWebpackPlugin = require("html-minimizer-webpack-plugin"); // 优化压缩html文件
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin"); // 优化压缩css文件

const ESLintWebpackPlugin = require("eslint-webpack-plugin"); // 用于报告不符合规范的代码

module.exports = {
  plugins: [
    new ESLintWebpackPlugin({}),
    new HtmlWebpackPlugin({
      title: "页面1", // 使用了 html-loader 无效 （<%= htmlWebpackPlugin.options.title %>）
      filename: "index.html", // 打包后的文件名
      template: path.resolve(__dirname, "src/pages/page1/index.html"), // 打包的 html
      chunks: ["page1"], // 对于 entry 配置
    }),
    new HtmlWebpackPlugin({
      title: "页面2",
      filename: "page2.html",
      template: path.resolve(__dirname, "src/pages/page2/index.html"),
      chunks: ["page2"],
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new PurgecssWebpackPlugin({
      paths: glob.sync(`${path.resolve(__dirname, "src")}/**/*`, {
        nodir: true,
      }),
    }),
    new ProgressBarWebpackPlugin({
      format: `:msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
    }),
  ],
};
```

### ESLint + Prettier

这个组合相信大家在熟悉不过了吧，通过这个可以让你的代码变得优雅，像诗一般，接下来我就带大家了解它的魅力吧。

首先我们先安装 ESLint，我们来到[ESLint](https://eslint.org/docs/user-guide/getting-started)官网使用指南，根据官网指南安装并使用 ESLint。

```sh
# 我们打开webpack-project的命令行窗口，安装ESLint
yarn add eslint --dev
# 使用ESLint，会在项目中自动生成一个配置文件
yarn run eslint --init
```

选择你想如何使用 ESLint，一般选择第二个，语法检查与问题检查，代码风格则交给我们的 Prettier 啦

![image-20210912123025476](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210912123025476-27ece4983d15488e9aa754607b937ead-20220421115216415.png?token=AJQWBIERKIVG3Z2PZWHPQR3CMDKS2)

选择你项目中使用的类型模块，在 ES6 以前肯定选择 CommonJS，但是在今天我们的选择肯定是选择 JS modules 啦

![image-20210912123409474](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210912123409474-494977e662e341578c43cf1d7a66cddf-20220421115229150.png?token=AJQWBIGN7NCSY5E4VXRJ543CMDKTS)

选择你项目使用什么框架，ESLint 会针对框架给出最优的配置，在这里我选择第三种。

![image-20210912123657438](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210912123657438-4f1d8f8cd02e4ee69c7f457674db50bc-20220421115240625.png?token=AJQWBIBWNLGC5ZAIXFUV7A3CMDKUK)

选择是否使用 TS 编程，这里选择 No，有兴趣的同学可以试试配置 TS。

![image-20210912124105574](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210912124105574-b828f71e9f2d4abcbb6ef890d6c79f95-20220421115259057.png?token=AJQWBIGRFJENJRNWGBN556DCMDKVO)

选择你项目中代码运行的环境，一般 Browser 和 Node 都需要选择，如果不选择 Node 在使用 module.exports 时会出现 ESLint 的未定义变量错误。

![image-20210912124227413](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210912124227413-09d46d6c5c7745faa1780f0bad7ce5d8-20220421115316100.png?token=AJQWBIEY73NRTP3I657BOQTCMDKWQ)

选择配置文件的类型一般选择 js 文件类型。

![image-20210912124528242](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210912124528242-17a4b95d477d42a2ba7ac29f5e6424f4-20220421115330973.png?token=AJQWBIGWBX65B45KKWGUGD3CMDKXO)

这样我们就通过 ESLint，生成了我们的配置文件啦，这里附上配置文件截图：

![image-20210912124910032](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210912124910032-f166dfb3e2624cc5aa870b8fe7b56ddd-20220421115342003.png?token=AJQWBIAALVBC2BBWNAHTK5TCMDKYE)

我们可以看到 extends 中有一个 plugin:prettier/recommended 的选项，它是什么意思呢，它是在安装了`eslint-config-prettier`与`eslint-plugin-prettier`后的配置 ESLint+Prettier 共同协作的简便写法，具体可以在[这里](https://github.com/prettier/eslint-plugin-prettier#recommended-configuration)查看。

你以为到这里结束了吗，可别忘了你还没有安装`prettier`呢，我们需要通过`yarn add -D prettier`进行安装，安装之后我们就可以通过`yarn eslint --fix`来解决代码格式化问题啦。

当然我们也可以对`prettier`进行配置，我们在项目根目录中新建.prettierrc.js 配置文件，在这里就不过多说明啦，这里附上我常用的配置：

![image-20210912130716209](https://raw.githubusercontent.com/qiuqfang/images/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211222120218-141df85dd0de4e0eab7d393e0cbb8986-20220421115350111.png?token=AJQWBIGQ6WUB3S6FXUOFDG3CMDKYU)

详细说明可以到[这里](*https://prettier.io/docs/en/options.html*)

当然你还可以添加代码格式忽略文件，.eslintignore 与.prettierignore 它们的用法都大同小异，与.gitignore 也相似。所以就不做过多说明啦。

配置完 ESLint+Prettier 了，那应该配置什么呢，从上面我们可以知道我们需要执行`yarn eslint --fix`才能帮助我们解决代码格式化问题，但是这多多少少会有些麻烦，这就引出了我们下面的主角啦！

### husky + lint-staged

使用 husky + lint-staged 可以在我们提交代码之前，做一些事情，比如代码风格检查啊、代码格式化啊，这样就可以省去我们少敲命令行的时间啦。

```sh
# 安装 husky + lint-staged
yarn add husky lint-staged -D
```

配置 lint-staged，我们进入 package.json 文件在文件中键入，如下配置：

```json
{
  "lint-staged": {
    "*.js": ["eslint --fix"]
  }
}
```

这样它就会在提交代码时检查 js 文件，并对 js 文件执行代码风格检查啊、代码格式化。

配置 husky，我们需要在命令行中键入`yarn husky install`，执行成功后你的项目中会出现`.husky`文件夹。如下所示：

![image-20210912154218143](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210912154218143-6dee319cea654799aa9c935e33e217d0-20220421115406029.png?token=AJQWBIGVPQFZD4E3EU7PJF3CMDKZU)

### Babel

配置 Babel，新建 Babel 文件`babel.config.js`，如下图所示：

![image-20210912154509569](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210912154509569-07506e1931c043ec9f9e53ad421130b4-20220421115414574.png?token=AJQWBIDOJF3G3C2VDGT2L5LCMDK2G)

详细的配置内容我们可以去看官方文档。

### PostCSS

配置 PostCSS，新建 PostCSS 文件`postcss.config.js`，如下图所示：

![image-20210912154705422](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210912154705422-ae35d01db7174aa5bf2417337667b2fc-20220421115424913.png?token=AJQWBICA37CV4S7NLA2MED3CMDK22)

详细配置插件可以看官方文档。有关与 postcss 的插件可以到[这里](https://www.postcss.parts/)查看。

## 总结

![image-20210912155155275](https://raw.githubusercontent.com/qiuqfang/images/main/image-20210912155155275-bd1b72c11a00449c93939b2eb3730884-20220421115434906.png?token=AJQWBIAA43WGNIRGC7WT6UTCMDK3O)

最终搭建出来一个比较完善的项目结构。在写公司项目的时候我们关注的是 src 下面的目录与文件，往往却忽视了 src 以外的文件目录，而这些往往是相当重要的，这些涉及了各种性能的调优，制定团队协作的规范，所以我觉得我们有必要去从零搭建一个项目，希望对大家有所帮助。
