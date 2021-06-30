---
title: 笔记篇-JAVA远程DEBUG教程
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/debug.jpg'
hide: false
date: 2021-04-29 23:31:35
category: Java相关
tags: Debug
---

# 背景

>在日常的开发工程中可能需要排查线上Bug，此时远程DEBUG就发挥用处了,前提是保持`远程和本地的代码版本`是一致的。

# 原理

> Java程序经过编译后的字节码是运行在JVM上的，通过JDWP将其和代码联系起来，提供给开发者一个可视化的UI环境进行调试，Java调试器架构如下所示。


```text
           Components                          Debugger Interfaces

                /    |--------------|
               /     |     VM       |
 debuggee ----(      |--------------|  <------- JVM TI - Java VM Tool Interface
               \     |   back-end   |
                \    |--------------|
                /           |
 comm channel -(            |  <--------------- JDWP - Java Debug Wire Protocol
                \           |
                     |--------------|
                     | front-end    |
                     |--------------|  <------- JDI - Java Debug Interface
                     |      UI      |
                     |--------------|


```


# 配置

对服务端的JVM配置参数

```
Jdk1.7之前: -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n
jdk1.7之后: -agentlib:jdwp=transport=dt_socket,address=8000,server=y,suspend=n
```

![添加远程调试](https://i.loli.net/2021/04/29/D1AzFu7TsnZikcO.png)


下一步配置IP端口和选择模块

![配置地址端口](https://i.loli.net/2021/04/29/ckGgqCvnxBPLZdM.png)

本地点DEBUG即可进入调试

# 参考资料

[Tutorial: Remote debug](https://www.jetbrains.com/help/idea/tutorial-remote-debug.html)

  


 
