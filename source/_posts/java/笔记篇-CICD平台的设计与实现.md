---
title: 笔记篇-CICD平台的设计与实现
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/cicd.jpeg'
hide: false
date: 2021-04-27 23:35:38
category: DevOps
tags: CICD
---

# 背景简介

>我们知道在企业级产品开发的流程中CI、CD能极大的提高我们的开发测试的效率。本篇文章将从真实企业环境出发，介绍CI、CD平台的设计与实现

# 系统设计

>首先我们需要结合企业的实际环境来设定，如项目组件数量是否庞大、组件之间的通信方式是什么、是否有自己机房等等。
目前其主要的CI、CD产品有Jenkins、Travis-CI、Gitlab CI等，其中Jenkins作为业界的标准，在设计中我们也采用他来进行搭建。


在CICD的流程中主要分为

```mermaid
graph LR;

A(提交代码)--触发-->B(依赖扫描)
B-->C(打包项目)
C-->D(编译构建)-->E(部署应用)-->启动成功

```



# 参考资料