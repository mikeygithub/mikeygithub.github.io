---
title: K8S篇-基础知识教程
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/k8s.jpeg'
hide: false
date: 2020-07-01 00:59:42
category: DevOps
tags: K8S
---

# 什么是K8S

Kuberneters 具有完备的集群管理能力，包括多层次的安全防护和准入机制、多租户应用支撑能力、透明的服务注册和服务发现机制、内建智能负载均衡器、强大的故障发现和自我修复能力、服务滚动升级和在线扩容能力、可扩展的资源自动调度机制，以及多粒度的资源配额管理能力。同时， Kuberneters 提供了完善的管理工具，这些工具涵盖了包括开发、部署测试、运维监控在内的各个环节。因此，Kuberneters是一个全新的基于容器技术的分布式架构解决方案，并且是一个一站式的完备的分布式系统开发和支撑平台。

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

![screenshot](/home/mikey/Downloads/jsDeliver/resource/img/dr5oXFv0IS-AbqyhAACfzxoTgIY518.png)





## Master

Kubernetes里的Master指的是集群控制节点，每个Kubernetes集群里需要有一个Master节点来负责整个集群的管理和控制，基本上Kubernetes的所有控制命令都发给它，它来负责具体的执行过程，我们后面执行的所有命令基本都是在Master节点上运行的。Master节点通常会占据一个独立的服务器（高可用部署建议用3台服务器），其主要原因是它太重要了，是整个集群的“首脑”，如果宕机或者不可用，那么对集群内容器应用的管理都将失效。

Master节点上运行着以下一组关键进程。

- `Kubernetes API Server (kube-apiserver)`：提供了 **HTTP Rest** 接口的关键服务进程，是Kubernetes里所有资源的增、删、改、查等操作的唯一入口，也是集群控制的入口进程。
- `Kubernetes Controller Manager (kube-controller-manager)`：Kubernetes里所有资源对象的自动化控制中心，可以理解为资源对象的“大总管”。
- `Kubernetes Scheduler (kube-scheduler)`：负责资源调度（Pod调度）的进程，相当于公交公司的“调度室”。

另外，在Master节点上还需要启动一个etcd服务，因为Kubernetes里的所有资源对象的数据全部是保存在etcd中的。

## Node（节点）

下图显示一个 Node（节点）上含有4个 Pod（容器组）

![Kubernetes教程：Node概念](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/module_03_nodes.38f0ef71.svg)

Pod（容器组）总是在 **Node（节点）** 上运行。Node（节点）是 kubernetes 集群中的计算机，可以是虚拟机或物理机。每个 Node（节点）都由 master 管理。一个 Node（节点）可以有多个Pod（容器组），kubernetes master 会根据每个 Node（节点）上可用资源的情况，自动调度 Pod（容器组）到最佳的 Node（节点）上。

每个 Kubernetes Node（节点）至少运行：

- Kubelet，负责 master 节点和 worker 节点之间通信的进程；管理 Pod（容器组）和 Pod（容器组）内运行的 Container（容器）。
- 容器运行环境（如Docker）负责下载镜像、创建和运行容器等。

## Event

是一个事件的记录，记录了事件的最早产生时间、最后重现时间、重复次数、发起者、类型，以及导致此事件的原因等众多信息。Event通常会关联到某个具体的资源对象上，是排查故障的重要参考信息，之前我们看到Node的描述信息包括了Event，而Pod同样有Event记录，用来发现某个Pod迟迟无法创建时，可以用kubectl describe pod xxxx来查看它的描述信息，用来定位问题的原因

##  Lable

Label是Kubernetes系统中另外一个核心概念。一个Label是一个`key=value`的键值对，其中key与vaue由用户自己指定。Label可以附加到各种资源对象上，例如Node、Pod、Service、RC等，一个资源对象可以定义任意数量的Label，同一个Label也可以被添加到任意数量的资源对象上去，Label通常在资源对象定义时确定，也可以在对象创建后动态添加或者删除。

我们可以通过指定的资源对象捆绑一个或多个不同的Label来实现多维度的资源分组管理功能，以便于灵活、方便地进行资源分配、调度、配置、部署等管理工作。例如：部署不同版本的应用到不同的环境中；或者监控和分析应用（日志记录、监控、告警）等。一些常用等label示例如下。

## Replication Controller

Replication Controller（简称RC）是Kubernetes系统中的核心概念之一，简单来说，它其实是定义了一个期望的场景，即声明某种Pod的副本数量在任意时刻都符合某个预期值，所以RC的定义包括如下几个部分。

- Pod期待的副本数（replicas）。
- 用于筛选目标Pod的Label Selector。
- 当Pod的副本数量小于预期数量时，用于创建新Pod的Pod模版（template）。

```
apiVersion: v1
kind: ReplicationController
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    tier: frontend
template:
  metadata:
    labels:
      app: app-demo
      tier: frontend
  spec:
    containers:
     - name: tomcat-demo
       image: tomcat
       ports:
       imagePullPolicy: IfNotPresent
       env:
       - name: GET_HOSTS_FROM
         value: dns
       ports:
       - containerPort: 80
```

当我们定义了一个RC并提交到Kubernetes集群中以后，Master节点上的**Controller Manager组件**就得到通知，定期巡检系统中当前存活的目标Pod，并确保目标Pod实例的数量刚好等于此RC的期望值，如果有过多的Pod副本在运行，系统就会停掉一些Pod，否则系统就会再自动创建一些Pod。可以说，通过RC，Kubernetes实现了用户应用集群的高可用性，并且大大减少了系统管理员在传统IT环境中需要完成的许多手工运维工作（如主机监控脚本、应用监控脚本、故障恢复脚本等）。

下面我们以3个Node节点的集群为例，说明Kubernetes如何通过RC来实现Pod副本数量自动控制的机制。假如我们的RC里定义redis-slave这个Pod需要保持3个副本，系统将可能在其中的两个Node上创建Pod。图1.9描述了在两个Node上创建redis-slave Pod的情形。

![screenshot](/home/mikey/Downloads/jsDeliver/resource/img/dr5oXFv0JRGAXF8nAABNjP-OvJk363.png)

假设Node2上的Pod2意外终止，根据RC定义的replicas数量2，Kubernetes将会自动创建并启动一个新的Pod，以保住整个集群中始终有两个redis-slave Pod在运行。

如图所示，系统可能选择Node3或者Node1来创建一个新的Pod。

![screenshot](/home/mikey/Downloads/jsDeliver/resource/img/dr5oXFv0JVeASS5FAABYqOWmPjY884.png)

此外，在运行时，我们可以通过修改RC的副本数量，来实现Pod的动态缩放（Scaling）功能，还可以通过执行kubectl scale命令来一键完成：

```
$kubectl scale rc redis-slave --replicas=3
scaled
```

Scaling的执行结果如图所示。

![screenshot](/home/mikey/Downloads/jsDeliver/resource/img/dr5oXFv0JYeAJO3MAABdk3EvE_w414.png)

需要注意的是，删除RC并不会影响通过该RC已创建好的Pod。为了删除所有Pod，可以设置replicas的值为0，然后更新该RC。另外，kubectl提供了stop和delete命令来一次性删除RC和RC控制的全部Pod。

当我们的应用升级时，通常会通过Build一个新的Docker镜像，并用新的镜像版本来替代旧的版本的方式达到目的，在系统升级的过程中，我们希望是平滑的方式，比如当前系统中10个对应的旧版本的Pod，最佳的方式是旧版本的Pod每次停止一个，同时创建一个新版本的Pod，在整个升级过程中，此消彼长，而运行中的Pod数量始终是10个，几分钟以后，当所有的Pod都已经是最新版本时，升级过程完成。通过RC的机制，Kubernetes很容易就实现了这种高级实用的特性，被称为“滚动升级”（Rolling Update），具体的操作方法详见第四章。

由于Replication Controller与Kubernetes代码中的模块Replication Controller同名，同时这个词也无法准确表达它的本意，所以在Kubernetes v1.2时，它就升级成了另外一个新的概念--Replica Set，官方解释为“下一代的RC”，它与RC当前存在的唯一区别是：Replica Sets支持基于集合的Label selector（Set-based selector），而RC只支持基于等式的Label Selector（equality-based selector），这使得Replica Set的功能更强，下面是等价于之前RC例子的Replica Set的定义（省去了Pod模版部分的内容）：

```
apiVersion: extensions/v1beta1
kind: ReplicaSet
metadata：
  name: frontend
spec:
  selector:
    matchLabels:
      tier: frontend
    matchExpression:
      - {key: tier, operator: In, values: [frontend]}
  template:
```

kubectl命令工具适用于RC的绝大部分命令都同样适用于Replica Set。此外，当前我们很少单独使用Replica Set，它主要被Deployment这个更高层的资源对象所使用，从而形成一整套Pod创建、删除、更新的编排机制。当我们使用Deployment时，无须关心它是如何创建和维护Replica Set的，这一切都是自动发生的。

Replica Set与Deployment这两个重要资源对象逐步替换了之前的RC的作用，是Kubernetes v1.3里Pod自动扩容（伸缩）这个告警功能实现的基础，也将继续在Kubernetes未来的版本中发挥重要的作用。

最后我们总结一下关于RC（Replica Set）的一些特性与作用。

- 在大多数情况下，我们通过定义一个RC实现Pod的创建过程及副本数量的自动控制。
- RC里包括完整的Pod定义模版。
- RC通过Label Selector机制实现对Pod副本的自动控制。
- 通过改变RC里的Pod副本数量，可以实现Pod的扩容或缩容功能。
- 通过改变RC里的Pod模版中的镜像版本，可以实现Pod的滚动升级功能。

## Deployment

Deployment是Kubernetes v1.2引入的概念，引入的目的是为了更好地解决Pod的编排问题。为此，Deployment在内部使用了Replica Set来实现目的，无论从Deployment的作用与目的，它的YAML定义，还是从它的具体命令行操作来看，我们都可以把它看作RC的一次升级，两者相似度超过90%。

Deployment相对于RC的一个最大升级是我们随时知道当前Pod“部署”的进度。实际上由于一个Pod的创建、调度、绑定节点及在目标Node上启动对应的容器这一完整过程需要一定的时间，所以我们期待系统启动N个Pod副本的目标状态，实际上是一个连续变化的“部署过程”导致的最终状态。

Deployment的典型使用场景有以下几个。

- 创建一个Deployment对象来生成对应的Replica Set并完成Pod副本的创建过程。
- 检查Deployment的状态来看部署动作是否完成（Pod副本的数量是否达到预期的值）。
- 更新Deployment以创建新的Pod（比如镜像升级）。
- 如果当前Deployment不稳定，则回滚到一个早先的Deployment版本。
- 暂停Deployment以便于一次性修改多个PodTemplateSpec的配置项，之后再恢复Deployment，进行新的发布。
- 扩展Deployment以应对高负载。
- 查看Deployment的状态，以此作为发布是否成功的指标。
- 清理不再需要的旧版本ReplicaSets。

Deployment的定义与Replica Set的定义很类似，除了API声明与Kind类型等有所区别：

```
apiVersion: extensions/v1beta1      apiVersion: v1
kind: Deployment                    kind: ReplicaSet
metadata:                           metadata:
  name: nginx-deployment              name: nginx-repset
```

下面我们通过运行一些例子来一起直观地感受这个新概念。首先创建一个名为tomcat-deployment.yaml的Deployment描述文件，内容如下：

```
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      tier: frontend
    matchExpressions:
      - {key: tier, operator: In, values: [frontend]}
  template:
    metadata:
      labels:
        app: app-demo
        tier: frontend
    spec:
      containers:
      - name: tomcat-demo
        image: tomcat
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
```

运行下述命令创建Deploymeny:

```
# kubectl create -f tomcat-deployment.yaml
deployment "tomcat-deploy" created
```

运行下述命令查看Deployment的信息：

```
# kubectl get deployments
NAME            DESIRED     CURRENT     UP-TO-DATE      AVAILABLE   AGE
tomcat-deploy   1           1           1               1           4m
```

对上述输出中涉及的数量解释如下：

- DESIRED：Pod副本数量的期望值，即Deployment里定义的Replica。
- CURRENT：当前Replica的值，实际上是Deployment所创建的Replica Set里的Replica值，这个值不断增加，直到达到DESIRED为止，表明整个部署过程完成。
- UP-TO-DATE：最新版本的Pod副本数量，用于指示在滚动升级的过程中，有多少个Pod副本已经成功升级。
- AVAILABLE：当前集群中可用的Pod副本数量，即集群中当前存活的Pod数量。

运行下述命令查看对应的Replica Set，我们看到它的命名与Deployment的名字有关系：

```
# kubectl get rs
NAME                        DESIRED     CURRENT     AGE
tomcat-deploy-1640611518    1           1           1m
```

运行下述命令查看创建的Pod，我们发现Pod的命名以Deployment对应的Replica Set的名字为前缀，这种命名很清晰地表明了一个Replica Set创建了哪些Pod，对于滚动升级这种复杂的过程来说，很容易排查错误：

```
# kubectl get pods
NAME                            READY       STATUS      RESTARTS    AGE
tomcat-deploy-1640611518-zhrsc  1/1         Running     0           3m
```

运行kubectl describe deployments，可以清楚地看到Deployment控制的Pod的水平扩展过程，详见第2章的说明，这里不再赘述。

Pod的管理对象，除了RC和Deployment，还包括ReplicaSet、DaemonSet、StatefulSet、Job等，分别用于不同的应用场景中



# 部署应用

## 简单应用






# 参考资料

[kubernetes教程](https://www.orchome.com/732)

[kuboard](https://kuboard.cn/learning/)