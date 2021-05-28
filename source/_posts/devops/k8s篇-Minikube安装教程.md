---
title: k8s篇-Minikube安装教程
date: 2020-03-25 12:39:54
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/minikube.jpeg
category: DevOps
tags: Kubernetes
---
# MINIKUBE INSTALL TUTORIALS

## 环境准备

- Ubuntu16

## 安装 kubectl

```text
curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.18.0/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
kubectl version --client
```

## 安装 Minikube

```text
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_1.8.0_amd64.deb && sudo dpkg -i minikube_1.8.0_amd64.deb
```

>国内可能无法访问,可以采用阿里源

```text
curl -Lo minikube https://github.com/kubernetes/minikube/releases/download/v1.8.0/minikube-linux-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/
```

## 配置 Hypervisor

验证您的系统是否启用了虚拟化支持：`egrep -q 'vmx|svm' /proc/cpuinfo && echo yes || echo no`

>如果上述命令输出“否”：
 如果您在虚拟机中运行，那么您的虚拟机监控程序不允许嵌套虚拟化。你需要使用无（裸金属）驱动器
 如果您在物理机器上运行，请确保您的BIOS启用了硬件虚拟化

## 启动 Minikube

`sudo minikube start --vm-driver=none --image-repository=registry.aliyuncs.com/google_containers`

## 所需镜像如下

>若无法连接谷歌可直接下载以下镜像（要对应版本）

```text
docker pull registry.aliyuncs.com/google_containers/kube-proxy:v1.17.3
docker pull registry.aliyuncs.com/google_containers/kube-controller-manager:v1.17.3
docker pull registry.aliyuncs.com/google_containers/kube-apiserver:v1.17.3
docker pull registry.aliyuncs.com/google_containers/kube-scheduler:v1.17.3
docker pull registry.aliyuncs.com/google_containers/coredns:1.6.5
docker pull registry.aliyuncs.com/google_containers/etcd:3.4.3-0
docker pull registry.aliyuncs.com/google_containers/pause:3.1
docker pull registry.aliyuncs.com/google_containers/storage-provisioner:v1.8.1
```
    
## Kubernetes 可视化界面

`minikube dashboard`

访问控制台的连接即可

## 参考资料

[Github代码库](https://github.com/AliyunContainerService/minikube)
[参考博文](https://yq.aliyun.com/articles/221687)
[官方文档](https://minikube.sigs.k8s.io/docs/start/)  


 