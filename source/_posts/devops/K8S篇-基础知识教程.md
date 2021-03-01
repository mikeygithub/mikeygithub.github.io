---
title: K8S篇-基础知识教程
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/k8s.jpeg'
hide: false
date: 2020-07-01 00:59:42
category: DevOps
tags: K8S
---

# 什么是K8S

# 基本概念

## Pods概述

![Pod概念](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/module_03_pods.ccc5ba54.svg)

**Pod 容器组** 是一个k8s中一个抽象的概念，用于存放一组 container（可包含一个或多个 container 容器，即图上正方体)，以及这些 container （容器）的一些共享资源。这些资源包括：

- 共享存储，称为卷(Volumes)，即图上紫色圆柱
- 网络，每个 Pod（容器组）在集群中有个唯一的 IP，pod（容器组）中的 container（容器）共享该IP地址
- container（容器）的基本信息，例如容器的镜像版本，对外暴露的端口等

> 例如，Pod可能既包含带有Node.js应用程序的 container 容器，也包含另一个非 Node.js 的 container 容器，用于提供 Node.js webserver 要发布的数据。Pod中的容器共享 IP 地址和端口空间（同一 Pod 中的不同 container 端口不能相互冲突），始终位于同一位置并共同调度，并在同一节点上的共享上下文中运行。（同一个Pod内的容器可以使用 localhost + 端口号互相访问）。

Pod（容器组）是 k8s 集群上的最基本的单元。当我们在 k8s 上创建 Deployment 时，会在集群上创建包含容器的 Pod (而不是直接创建容器)。每个Pod都与运行它的 worker 节点（Node）绑定，并保持在那里直到终止或被删除。如果节点（Node）发生故障，则会在群集中的其他可用节点（Node）上运行相同的 Pod（从同样的镜像创建 Container，使用同样的配置，IP 地址不同，Pod 名字不同）。

TIP

重要：

- Pod 是一组容器（可包含一个或多个应用程序容器），以及共享存储（卷 Volumes）、IP 地址和有关如何运行容器的信息。
- 如果多个容器紧密耦合并且需要共享磁盘等资源，则他们应该被部署在同一个Pod（容器组）中。

## Node（节点）

下图显示一个 Node（节点）上含有4个 Pod（容器组）

![Kubernetes教程：Node概念](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/module_03_nodes.38f0ef71.svg)

Pod（容器组）总是在 **Node（节点）** 上运行。Node（节点）是 kubernetes 集群中的计算机，可以是虚拟机或物理机。每个 Node（节点）都由 master 管理。一个 Node（节点）可以有多个Pod（容器组），kubernetes master 会根据每个 Node（节点）上可用资源的情况，自动调度 Pod（容器组）到最佳的 Node（节点）上。

每个 Kubernetes Node（节点）至少运行：

- Kubelet，负责 master 节点和 worker 节点之间通信的进程；管理 Pod（容器组）和 Pod（容器组）内运行的 Container（容器）。
- 容器运行环境（如Docker）负责下载镜像、创建和运行容器等。

# 部署应用

## 简单应用






# 参考资料

[kuboard](https://kuboard.cn/learning/)