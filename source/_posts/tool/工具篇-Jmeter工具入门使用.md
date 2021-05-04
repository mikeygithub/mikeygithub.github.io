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

参考：[DevOps篇-Prometheus+Grafana搭建监控大盘](https://mikeygithub.github.io/2021/05/03/devops/DevOps%E7%AF%87-Prometheus+Grafana%E6%90%AD%E5%BB%BA%E7%9B%91%E6%8E%A7%E5%A4%A7%E7%9B%98/)

![image-20210504003102865](https://i.loli.net/2021/05/04/1G4nkDSJ9ihUF3Q.png)

配置TPS面板

![添加TPS监控](/Users/mikey/Library/Application Support/typora-user-images/image-20210504150708411.png)

配置RT面板

![RT监控面板](https://i.loli.net/2021/05/04/wIWN8gi1LnbFTKq.png)

3.配置压测脚本

![image-20210504151141683](https://i.loli.net/2021/05/04/TiXVsqSE1NtIPrc.png)

可以通过工资电脑进行压测也可将压测脚步导出到压测服务器进行压测

```shell
nohup ./jmeter -n -t /root/apache-jmeter-5.4.1/线程组-10线程一直压测.jmx -l results.jtl -e -o /root/jmeter_results &
```

压测数据（当前的服务器是阿里云的学生机部署了很多应用测出来的效果不理想）

![数据展示](https://i.loli.net/2021/05/04/GXaI3ODy2v1uzZe.png)

当压测到后台开始报错时就可停止了，此时的数据已经没有意义

![后台报错](https://i.loli.net/2021/05/04/xljQbKDYofS3ZN7.png)

通过获取的数据进行瓶颈分析，针对性进行优化。

# CSV数据

> jmeter支持从csv文件中读取数据到我们需要发送到请求当中

![数据准备](https://i.loli.net/2021/05/04/s13qOTHR2IjC85a.png)

配置使用

![配置](/Users/mikey/Library/Application Support/typora-user-images/image-20210504163732056.png)

在请求中通过`${variableName}`进行获取使用

![使用](https://i.loli.net/2021/05/04/bldfMnGY3hI2Twv.png)

验证结果

![验证结果](https://i.loli.net/2021/05/04/jEDSKqaPOWVCu2B.png)



# 资料

[grafana官网](https://grafana.com/)
[prometheus官网](https://prometheus.io/)<br/>


![扫一扫，关注我](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/wechat.jpg)