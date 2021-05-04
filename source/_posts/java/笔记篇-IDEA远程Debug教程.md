---
title: 笔记篇-IDEA远程Debug教程
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/debug.jpeg'
hide: false
date: 2021-04-29 23:31:35
category: 笔记
tags: Debug
---

# 背景

> ，在日常的开发工程中可能需要用到远程DeBug
# 原理

> Java的字节码是运行在JVM上的

# 配置

对服务端的JVM配置参数

```
Jdk1.7之前: -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n
jdk1.7之后: -agentlib:jdwp=transport=dt_socket,address=8000,server=y,suspend=n
```



![添加远程调试](https://i.loli.net/2021/04/29/D1AzFu7TsnZikcO.png)



下一步配置IP端口和选择模块

![配置地址端口](https://i.loli.net/2021/04/29/ckGgqCvnxBPLZdM.png)



# 参考资料

[Intellij IDEA远程debug教程实战和要点总结](https://blog.csdn.net/qq_37192800/article/details/80761643)

<br/>


![扫一扫，关注我](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/wechat.jpg)