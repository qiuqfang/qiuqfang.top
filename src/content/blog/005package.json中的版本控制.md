---
title: "package.json中的版本控制"
description: "Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro."
pubDate: "Nov 25 2021"
heroImage: "/placeholder-hero.jpg"
---

## 前言

当我们开发一个前端项目时，我们会发现安装的库版本号前面都会出现一个'^'或者'~'符号，特此写篇文章记录一下。

## 语义化版本规则

![image-20211222105451583](https://images-ivory-pi.vercel.app/image-20211222105451583-eda73f8cca0041fa99827cd7f362e3d4-20220421114854545.png)

在介绍之前先让我们了解一下什么是语义化版本吧，语义化版本可以让我们避免项目中出现'依赖地狱'的问题，这里我截取了规范的开头，想详细了解的可以去[这里](https://semver.org/lang/zh-CN/)阅读语义化版本的详细规范。

## 破浪符号（~）

它会将```package.json```中的库更新到次版本号的最新版本，比如```element-ui: ~2.15.1```,那么就会更新到```2.15.x```的最新版本，如果出现了```2.16.x```的版本则不会自动升级。除了使用`~`这种方式我们还可以直接在库后面使用```主版本号:次版本号:x```的方式来更新到次版本号的最新版本。

## 插入符号（^）

它会将package.json中的库更新到主版本号的最新版本，比如element-ui: ~2.15.1,那么就会更新到2.x.x的最新版本，如果出现了3.x.x的版本则不会自动升级。除了使用`~`这种方式我们还可以直接在库后面使用```主版本号:x:x```的方式来更新到次版本号的最新版本。
