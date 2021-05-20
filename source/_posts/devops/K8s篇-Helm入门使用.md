---
title: K8s篇-Helm入门使用
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/helm.jpeg'
hide: false
date: 2021-03-07 12:55:02
category: DevOps
tags: Helm
---

# Helm 简介

**Helm** 帮助您管理 Kubernetes 应用程序——Helm Charts 帮助您定义、安装和升级最复杂的 Kubernetes 应用程序。

Helm 可以使用 Charts 启动 Kubernetes 集群，提供可用的工作流：

- 一个 Redis 集群
- 一个 Postgres 数据库
- 一个 HAProxy 边界负载均衡

特性：

- 查找并使用流行的软件，将其打包为 Helm Charts，以便在 Kubernetes 中运行
- 以 Helm Charts 的形式共享您自己的应用程序
- 为您的 Kubernetes 应用程序创建可复制的构建
- 智能地管理您的 Kubernetes 清单文件
- 管理 Helm 包的发行版

Chart 是 Kubernetes 的单元，Helm 的架构参考 [Homebrew]()。

# 安装 Helm

```sh
sudo snap install helm --classic
```

初始化

```shell
helm repo add stable https://charts.helm.sh/stable
```

查看列表

```fallback
helm search repo stable
```

查看版本

```shell
helm version
```

输出

```text
version.BuildInfo{Version:"v3.5.2", GitCommit:"167aac70832d3a384f65f9745335e9fb40169dc2", GitTreeState:"dirty", GoVersion:"go1.15.7"}
```

# helm命令

## Charts

```
helm search 查找可用的Charts
helm inspect 查看指定Chart的基本信息
helm install 根据指定的Chart 部署一个Release到K8s
helm create 创建自己的Chart
helm package 打包Chart，一般是一个压缩包文件
```

## release

```
helm list 列出已经部署的Release
helm delete [RELEASE] 删除一个Release. 并没有物理删除， 出于审计需要，历史可查。
helm status [RELEASE] 查看指定的Release信息，即使使用helm delete命令删除的Release.
helm upgrade 升级某个Release
helm rollback [RELEASE] [REVISION] 回滚Release到指定发布版本
helm get values [RELEASE] 查看Release的配置文件值
helm ls –deleted 列出已经删除的Release
```

## repo

```
helm repo list
helm repo add [RepoName] [RepoUrl]
helm repo update
```

# 参考资料

[快速开始](https://helm.sh/zh/docs/intro/quickstart/)
[安装教程](https://www.orchome.com/1910)   


 