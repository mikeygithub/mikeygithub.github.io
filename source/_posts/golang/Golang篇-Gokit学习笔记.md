---
title: Golang篇-Gokit学习笔记
date: 2019-08-03 16:49:48
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/go-kit.png
category: Golang
tags: go-kit
---

# 简单介绍

>Go is a great general-purpose language, but microservices require a certain amount of specialized support. RPC safety, system observability, infrastructure integration, even program design — Go kit fills in the gaps left by the standard library, and makes Go a first-class language for writing microservices in any organization.

# 简单用例

用户始终发现，学习Go kit的最有效方法是学习示例服务并向其学习。在这里，您可以找到一些示例，这些示例将使您适应Go kit的习惯用法，模式和最佳实践。

- **[stringsvc](https://gokit.io/examples/stringsvc.html)** 是一个教程，带您从基本原则开始编写服务。它可以帮助您了解Go kit设计中的决策。
- **[addsvc](https://github.com/go-kit/kit/blob/master/examples/addsvc)** 是原始的示例服务。它在所有受支持的传输上公开了一组操作。它已完全记录，检测并使用分布式跟踪。它还演示了如何创建和使用客户端软件包。它演示了Go工具包的几乎所有功能。
- **[profilesvc](https://github.com/go-kit/kit/blob/master/examples/profilesvc)** 演示了如何使用Go kit编写带有REST-ish API的微服务。它使用net / http和出色的Gorilla Web工具包。
- **[运输](https://github.com/go-kit/kit/blob/master/examples/shipping)** 是基于域驱动设计原则的，由多个微服务组成的完整的“真实世界”应用程序。
- **[apigateway](https://github.com/go-kit/kit/blob/master/examples/apigateway)** 演示了如何实现 由Consul服务发现系统支持的[API网关模式](http://microservices.io/patterns/apigateway.html)。

# 相关资料

[官网文档](https://gokit.io/)

[参考博文](https://learnku.com/go/t/36923)   


 