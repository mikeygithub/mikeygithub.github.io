---
title: Java篇-微服务链路跟踪
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/softservice.jpeg'
hide: false
date: 2021-04-27 23:31:35
category: Java相关
tags: 链路跟踪
---

# 背景简介

>微服务架构是一个分布式架构，它按业务划分服务单元，一个分布式系统往往有很多个服务单元。由于服务单元数量众多，业务的复杂性，如果出现了错误和异常，很难去定位。主要体现在，一个请求可能需要调用很多个服务，而内部服务的调用复杂性，决定了问题难以定位。所以微服务架构中，必须实现分布式链路追踪，去跟进一个请求到底有哪些服务参与，参与的顺序又是怎样的，从而达到每个请求的步骤清晰可见，出了问题，很快定位。


# 参考资料

[服务链路追踪(Spring Cloud Sleuth)](https://www.cnblogs.com/duanxz/p/7552857.html)   


 