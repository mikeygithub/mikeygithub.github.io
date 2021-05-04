---
title: 工具篇-Jmeter工具入门使用
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/jmeter.jpeg'
hide: false
password: ''
date: 2021-05-03 18:24:16
category: 工具
tags: Jmeter
---

# 简介

>Apache JMeter是Apache组织开发的基于Java的压力测试工具。用于对软件做压力测试，它最初被设计用于Web应用测试，但后来扩展到其他测试领域。 它可以用于测试静态和动态资源，例如静态文件、Java 小服务程序、CGI 脚本、Java 对象、数据库、FTP 服务器， 等等。JMeter 可以用于对服务器、网络或对象模拟巨大的负载，来自不同压力类别下测试它们的强度和分析整体性能。另外，JMeter能够对应用程序做功能/回归测试，通过创建带有断言的脚本来验证你的程序返回了你期望的结果。为了最大限度的灵活性，JMeter允许使用正则表达式创建断言。

>Apache jmeter 可以用于对静态的和动态的资源（文件，Servlet，Perl脚本，java 对象，数据库和查询，FTP服务器等等）的性能进行测试。它可以用于对服务器、网络或对象模拟繁重的负载来测试它们的强度或分析不同压力类型下的整体性能。你可以使用它做性能的图形分析或在大并发负载测试你的服务器/脚本/对象。

# 安装

```shell
# 下载
wget https://mirrors.bfsu.edu.cn/apache//jmeter/binaries/apache-jmeter-5.4.1.tgz
# 解压
tar -zxvf apache-jmeter-5.4.1.tgz
# 启动
./apache-jmeter-5.4.1/bin/start.sh
```

# 压测

1.第一步是先将你要压测的应用跑起来

```shell
# 上传应用到服务器
scp jmeter-0.0.1-SNAPSHOT.jar root@47.106.210.183:/root/
# 启动应用
nohup java -jar jmeter-0.0.1-SNAPSHOT.jar > jmeter.log &
```

2.搭建监控大盘

参考：

3.配置压测脚本





![后台报错](https://i.loli.net/2021/05/04/xljQbKDYofS3ZN7.png)

# 自动

# 资料

