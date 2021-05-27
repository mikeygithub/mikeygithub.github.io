---
title: Nacos-动态服务发现配置和服务管理平台
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/nacos.jpg
hide: false
date: 2021-01-25 22:39:23
category: 中间件篇
tags: 服务发现
---

# 什么是 Nacos

服务（Service）是 Nacos 世界的一等公民。Nacos 支持几乎所有主流类型的服务的发现、配置和管理：

- [Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/)
- [gRPC](https://grpc.io/docs/guides/concepts.html#service-definition) & [Dubbo RPC Service](https://dubbo.incubator.apache.org/)
- [Spring Cloud RESTful Service](https://spring.io/understanding/REST)

# Nacos 特性包括

- **服务发现和服务健康监测**

Nacos 支持基于 DNS 和基于 RPC 的服务发现。服务提供者使用 [原生SDK](https://nacos.io/zh-cn/docs/sdk.html)、[OpenAPI](https://nacos.io/zh-cn/docs/open-API.html)、或一个[独立的Agent TODO](https://nacos.io/zh-cn/docs/other-language.html)注册 Service 后，服务消费者可以使用[DNS TODO](https://nacos.io/zh-cn/docs/xx) 或[HTTP&API TODO](https://nacos.io/zh-cn/docs/xx)查找和发现服务。

Nacos 提供实时健康检查，阻止服务向不健康的主机或服务实例发送请求。Nacos 支持传输层(PING 或 TCP)和应用层(如 HTTP、Redis、MySQL、用户自定义）的健康检查。 对于复杂的云环境和网络拓扑环境中（如 VPC、边缘服务等）服务的健康检查，Nacos 提供了 agent 模式和服务端2种健康检查模式。Nacos 还提供统一的健康检查仪表盘，帮助您管理服务可用性及流量。

- **动态配置服务**

动态配置服务可以让您以中心化、外部化和动态化的方式管理所有环境的应用配置和服务配置。

动态配置消除了配置变更时重新部署应用和服务的需要，让配置变得更加高效和敏捷。

配置中心化管理让无状态服务实现变得更简单，让服务按需弹性扩展变得更容易。

Nacos 提供了一个 [简单易用的UI TODO](https://nacos.io/zh-cn/docs/xx) 帮助您管理所有的服务和应用的配置。Nacos 还提供包括配置版本跟踪、金丝雀发布、回滚配置以及客户进程配置更新状态跟踪在内的一系列开箱即用的配置管理特性，帮助您更安全地管理配置变更和控制配置变更的风险。

- **动态 DNS 服务**

动态 DNS 服务支持权重路由，让您更容易地实现中间层负载均衡、更灵活的路由策略、流量控制以及数据中心内网的简单DNS解析服务。动态DNS服务还能让您更容易地实现以DNS协议为基础的服务发现，以消除耦合到厂商私有服务发现API上的风险。

Nacos 提供了一些简单的 [DNS APIs TODO](https://nacos.io/zh-cn/docs/xx) 帮助您管理服务的关联域名和可用的 IP:PORT 列表.

- **服务及其元数据管理**

Nacos 能让您从微服务平台建设的视角管理数据中心的所有服务及元数据，包括管理服务的描述、生命周期、服务的静态依赖分析、服务的健康状态、服务的流量管理、路由及安全策略、服务的 SLA 以及最首要的 Metrics 统计数据。

# Nacos 全景图

![nacos_landscape.png](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/29102804_XygY.png)

如 Nacos 全景图所示，Nacos 无缝支持一些主流的开源生态，例如 [Dubbo and Dubbo Mesh TODO](https://nacos.io/zh-cn/docs/xx)、[Spring Cloud TODO](https://nacos.io/zh-cn/docs/xx)、[Kubernetes and CNCF TODO](https://nacos.io/zh-cn/docs/xx)。

使用 Nacos 简化服务发现、配置管理、服务治理及管理的解决方案，让微服务管理、共享、组合更加容易。

# 快速开始

<p class="note note-primary">
方式一通过下载源码
</p>

```jshelllanguage
git clone https://github.com/alibaba/nacos.git
cd nacos/
mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U 
ls -al distribution/target/

// change the $version to your actual path
cd distribution/target/nacos-server-$version/nacos/bin
```

<p class="note note-primary">
方式二下载可运行包
</p>

```jshelllanguage
  unzip nacos-server-$version.zip  OR tar -xvf nacos-server-$version.tar.gz
  cd nacos/bin
```

<p class="note note-primary">
启动服务
</p>

```jshelllanguage
bash startup.sh -m standalone
```

<p class="note note-primary">
服务注册
</p>

```jshelllanguage
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
```


<p class="note note-primary">
服务发现
</p>

```jshelllanguage
curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
```

<p class="note note-primary">
发布配置
</p>

```jshelllanguage
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"
```


<p class="note note-primary">
获取配置
</p>

```jshelllanguage
curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
```

<p class="note note-primary">
关闭服务
</p>

```jshelllanguage
sh shutdown.sh
```

# 参考资料

[官方文档](https://nacos.io/en-us/docs/quick-start.html)   


 