---
title: 笔记篇-Serverless-FaaS入门
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/servlerless-faas-logo.png
date: 2020-12-10 10:48:02
category: 学习笔记
tags: Faas
---

# Serverless

Serverless由开发者实现的服务端逻辑运行在无状态的计算容器中，它由事件触发， 完全被第三方管理，其业务层面的状态则被开发者使用的数据库和存储资源所记录。Serverless涵盖了很多技术，分为两类：FaaS和BaaS。

# FaaS（Function as a Service，函数即服务）

FaaS意在无须自行管理服务器系统或自己的服务器应用程序，即可直接运行后端代码。其中所指的服务器应用程序，是该技术与容器和PaaS（平台即服务）等其他现代化架构最大的差异。

FaaS可以取代一些服务处理服务器（可能是物理计算机，但绝对需要运行某种应用程序），这样不仅不需要自行供应服务器，也不需要全时运行应用程序。

FaaS产品不要求必须使用特定框架或库进行开发。在语言和环境方面，FaaS函数就是常规的应用程序。例如AWS Lambda的函数可以通过Javascript、Python以及任何JVM语言（Java、Clojure、Scala）等实现。然而Lambda函数也可以执行任何捆绑有所需部署构件的进程，因此可以使用任何语言，只要能编译为Unix进程即可。FaaS函数在架构方面确实存在一定的局限，尤其是在状态和执行时间方面。

在迁往FaaS的过程中，唯一需要修改的代码是“主方法/启动”代码，其中可能需要删除顶级消息处理程序的相关代码（“消息监听器接口”的实现），但这可能只需要更改方法签名即可。在FaaS的世界中，代码的其余所有部分（例如向数据库执行写入的代码）无须任何变化。

相比传统系统，部署方法会有较大变化 – 将代码上传至FaaS供应商，其他事情均可由供应商完成。目前这种方式通常意味着需要上传代码的全新定义（例如上传zip或JAR文件），随后调用一个专有API发起更新过程。

FaaS中的函数可以通过供应商定义的事件类型触发。对于亚马逊AWS，此类触发事件可以包括S3（文件）更新、时间（计划任务），以及加入消息总线的消息（例如Kinesis）。通常你的函数需要通过参数指定自己需要绑定到的事件源。

大部分供应商还允许函数作为对传入Http请求的响应来触发，通常这类请求来自某种该类型的API网关（例如AWS API网关、Webtask）。

# BaaS（Backend as a Service，后端即服务）

BaaS（Backend as a Service，后端即服务）是指我们不再编写或管理所有服务端组件，可以使用领域通用的远程组件（而不是进程内的库）来提供服务。理解BaaS，需要搞清楚它与PaaS的区别。

首先BaaS并非PaaS，它们的区别在于：PaaS需要参与应用的生命周期管理，BaaS则仅仅提供应用依赖的第三方服务。典型的PaaS平台需要提供手段让开发者部署和配置应用，例如自动将应用部署到Tomcat容器中，并管理应用的生命周期。BaaS不包含这些内容，BaaS只以API的方式提供应用依赖的后端服务，例如数据库和对象存储。BaaS可以是公共云服务商提供的，也可以是第三方厂商提供的。其次从功能上讲，BaaS可以看作PaaS的一个子集，即提供第三方依赖组件的部分。

BaaS服务还允许我们依赖其他人已经实现的应用逻辑。对于这点，认证就是一个很好的例子。很多应用都要自己编写实现注册、登录、密码管理等逻辑的代码，而对于不同的应用这些代码往往大同小异。完全可以把这些重复性的工作提取出来，再做成外部服务，而这正是Auth0和Amazon Cognito等产品的目标。它们能实现全面的认证和用户管理，开发团队再也不用自己编写或者管理实现这些功能的代码。

# 创建 FaaS

>本文采用鹅厂的FaaS作为测试

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/serverless-create.png)

创建完成

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/serverless-finish-create.png)


# 编写 FaaS
<details>
  <summary><span>展开代码</span></summary>
  <br>

```go
package main

import (
    "context"
    "fmt"
    "github.com/tencentyun/scf-go-lib/cloudfunction"
)

type DefineEvent struct {
    // test event define
    Key1 string `json:"key1"`
    Key2 string `json:"key2"`
}

func hello(ctx context.Context, event DefineEvent) (string, error) {
    fmt.Println("key1:", event.Key1)
    fmt.Println("key2:", event.Key2)
    return fmt.Sprintf("Hello %s!", event.Key1), nil
}

func main() {
    // Make the handler available for Remote Procedure Call by Cloud Function
    cloudfunction.Start(hello)
}
```
</details>

打包函数

```shell
GOOS=linux GOARCH=amd64 go build -o main main.go
zip main.zip main
```

部署函数

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/serverless-deploy.png)


测试函数

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/serverless-test.png)

发布函数

>先配置好ROLE和Api网关

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/serverless-role.png)

创建触发器

>使用API触发器

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/serverless-role.png)

调用函数

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/serverless-test.png)



# 参考资料

[官方文档](https://cloud.tencent.com/document/product/583/9199)

[看懂 Serverless，这一篇就够了](https://blog.csdn.net/cc18868876837/article/details/90672971)

[Serverless 入门教程](https://www.jianshu.com/p/e7eb45a10f96)

[通过一个案例，理解FaaS的运行逻辑](https://blog.csdn.net/li1669852599/article/details/108795172)   


 