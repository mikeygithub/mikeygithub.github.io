---
title: k8s篇-安装教程
date: 2020-03-21 21:39:49
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/k8s.png
category: DevOps
tags: Kubernetes
---

# Kubernetes 安装 kubeadm

- 1 事先准备
- 2 检查所需端口
- 2.1 Master节点
- 2.2 工作节点
- 3 Docker 安装
- 4 kubectl 安装
- 5 kubelet和kubeadm 安装

# 事先准备

- 多台Ubuntu 16.04+、CentOS 7或HypriotOS v1.0.1 + 系统  
- 每台机器最少1GB+内存  
- 集群中所有机器之间网络连接正常  
- 每个节点有唯一MAC地址和product_uuid  
- 打开某些端口。请参阅以下部分  

# 检查所需端口

## Master节点

<table>
<tr><th>端口范围</th><th>用途</th></tr>
<tr><td>6443 *</td><td>	Kubernetes API server</td></tr>
<tr><td>2379-2380</td><td>	etcd server client API</td></tr>
<tr><td>10250</td><td>	Kubelet API</td></tr>
<tr><td>10251</td><td>	kube-scheduler</td></tr>
<tr><td>10252</td><td>	kube-controller-manager</td></tr>
<tr><td>10255</td><td>Read-only Kubelet API (Heapster)</td></tr>
</table>

## 工作节点

<table>
<tr><th>端口范围</th><th>用途</th></tr>
<tr><td>10250</td><td>Kubelet API</td></tr>
<tr><td>2379-2380</td><td>Read-only Kubelet API (Heapster)</td></tr>
<tr><td>30000-32767</td><td>NodePort Services默认端口范围。</td></tr>
</table>
	
# Docker 安装

在机器安装Docker，推荐使用1.12 版本（v1.10和v1.11也可以正常使用），1.13和17.03+版本未经过Kubernetes团队的测试和验证。有关安装说明，请参阅Docker官方文档 Docker安装。

# kubectl 安装

在所有机器上安装kubectl，可参考： kubectl安装。

# kubelet和kubeadm 安装

在所有机器上安装以下软件包：

- kubelet
- kubeadm

注意：如果机器上已经安装了kubeadm，则应需要apt-get update && apt-get upgrade或者yum update获得最新版本的kubeadm。如果想了解不同版本的kubeadm，请参考

配置机器：

SSH登录主机。
如果使用的是Ubuntu或HypriotOS，请运行：

```text
apt-get update && apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm
```

如果使用的是CentOS，请运行：

`cat <<EOF > /etc/yum.repos.d/kubernetes.repo`


```text
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
        https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
setenforce 0
yum install -y kubelet kubeadm
systemctl enable kubelet && systemctl start kubelet

```

执行完后，kubelet会进入每隔几秒重新启动一次的循环模式，因为kubelet在等待kubeadm发出的命令。

注意：必须使用运行setenforce 0命令来禁用SELinux，因为需要允许容器访问主机文件系统，这是配置pod网络所要求的。（直到kubelet中对SELinux支持得到改进）

接下来使用kubeadm创建一个集群  


 