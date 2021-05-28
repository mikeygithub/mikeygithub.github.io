---
title: k8s篇-Minikube使用教程
date: 2020-04-02 00:35:52
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/minikube.png
category: DevOps
tags: Kubernetes
---

## 启动 K8s 集群

`sudo minikube start --vm-driver=none --image-repository=registry.aliyuncs.com/google_containers`

### 启动GUI

`minikube dashboard`

## K8s 部署应用程序

Server.js
```javascript
var http = require('http');

var handleRequest = function(request, response) {
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200);
  response.end('Hello World!');
};
var www = http.createServer(handleRequest);
www.listen(8080);
```
Dockerfile
````yaml
FROM node:6.9.2
EXPOSE 8080
COPY server.js .
CMD node Server.js
````

打包镜像

`docker build -t hello-node:v1 .`

部署应用

`kubectl run hello-node --image=hello-node:v1 --port=8080`

查看Deployment：

`kubectl get deployments`

输出：

>NAME        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
hello-node   1         1         1            1           3m

查看Pod：

`kubectl get pods`

输出：

>NAME                        READY     STATUS    RESTARTS   AGE
hello-node-714049816-ztzrb   1/1       Running   0          6m

查看群集events：

`kubectl get events`

查看kubectl配置：

`kubectl config view`

创建Service

>默认情况，这Pod只能通过Kubernetes群集内部IP访问。要使hello-node容器从Kubernetes虚拟网络外部访问，须要使用Kubernetes Service暴露Pod。

我们可以使用kubectl expose命令将Pod暴露到外部环境：

`kubectl expose deployment hello-node --type=LoadBalancer`

查看刚创建的Service：

`kubectl get services`

输出：

>NAME        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
hello-node   10.0.0.71    <pending>     8080/TCP   6m
kubernetes   10.0.0.1     <none>        443/TCP    14d

>通过--type=LoadBalancer flag来在群集外暴露Service，在支持负载均衡的云提供商上，将配置外部IP地址来访问Service。在Minikube上，该LoadBalancer type使服务可以通过minikube Service 命令访问。

`minikube service hello-node`

将打开浏览器，在本地IP地址为应用提供服务，显示“Hello World”的消息。

最后可以查看到一些日志

`kubectl logs <POD-NAME>`

## K8s 更新应用程序

编辑server.js文件以返回新消息：

`response.end('Hello World Again!');`

build新版本镜像

`docker build -t hello-node:v2 .`

Deployment更新镜像：

`kubectl set image deployment/hello-node hello-node=hello-node:v2`

再次运行应用以查看新消息：

`minikube service hello-node`

## 删除 K8s 集群

现在可以删除在群集中创建的资源：

`kubectl delete service hello-node`
`kubectl delete deployment hello-node`

或者停止Minikube：

`minikube stop`

## K8s kubectl 命令表

[kubectl命令列表](http://docs.kubernetes.org.cn/683.html)  


 