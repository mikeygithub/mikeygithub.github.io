---
title: Java篇-高性能的Dubbo框架
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/dubbo.png
hide: false
date: 2021-01-22 19:27:12
category: Java相关
tags: Dubbo
---

# 框架简介

>Apache Dubbo is a high-performance, java based open source RPC framework.

# 框架特点

- 基于透明接口的RPC
>Dubbo提供了基于高性能接口的RPC，对用户是透明的。

- 智能负载均衡
>Dubbo支持开箱即用的多种负载平衡策略，可感知下游服务状态以减少总体延迟并提高系统吞吐量。

- 自动服务注册和发现
>Dubbo支持多个服务注册表，可以立即检测在线/离线服务。

- 高扩展性
>Dubbo的微内核和插件设计确保第三方实现可以轻松地将其扩展为协议，传输和序列化等核心功能。

- 运行时流量路由
>可以在运行时配置Dubbo，以便可以根据不同的规则路由流量，这使得支持蓝绿色部署，数据中心感知路由等功能变得容易。

- 可视化服务治理
>Dubbo提供了用于服务管理和维护的丰富工具，例如查询服务元数据，运行状况和统计信息。

# 快速开始

<p class="note note-primary">
下载源码
</p>

```jshelllanguage
git clone https://github.com/apache/dubbo.git dubbo
cd dubbo/dubbo-demo/dubbo-demo-xml
mvn clean install
```
<p class="note note-primary">
运行Zookeeper
</p>

```jshelllanguage
wget https://downloads.apache.org/zookeeper/zookeeper-3.6.2/apache-zookeeper-3.6.2-bin.tar.gz
tar -zxvf apache-zookeeper-3.6.2-bin.tar.gz
cd apache-zookeeper-3.6.2-bin/bin
./zkServer.sh start
```
<p class="note note-primary">
运行程序
</p>

先运行`org.apache.dubbo.demo.provider.Application`

再运行`org.apache.dubbo.demo.consumer.Application`

`确保使用JDK1.8其他版本容易出问题`

# 详细介绍

![框架设计图](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/dubbo-framework.jpg)

图例说明：

- 图中左边淡蓝背景的为服务消费方使用的接口，右边淡绿色背景的为服务提供方使用的接口，位于中轴线上的为双方都用到的接口。
- 图中从下至上分为十层，各层均为单向依赖，右边的黑色箭头代表层之间的依赖关系，每一层都可以剥离上层被复用，其中，Service 和 Config 层为 API，其它各层均为 SPI。
- 图中绿色小块的为扩展接口，蓝色小块为实现类，图中只显示用于关联各层的实现类。
- 图中蓝色虚线为初始化过程，即启动时组装链，红色实线为方法调用过程，即运行时调时链，紫色三角箭头为继承，可以把子类看作父类的同一个节点，线上的文字为调用的方法。

## 各层说明

- **config 配置层**：对外配置接口，以 `ServiceConfig`, `ReferenceConfig` 为中心，可以直接初始化配置类，也可以通过 spring 解析配置生成配置类
- **proxy 服务代理层**：服务接口透明代理，生成服务的客户端 Stub 和服务器端 Skeleton, 以 `ServiceProxy` 为中心，扩展接口为 `ProxyFactory`
- **registry 注册中心层**：封装服务地址的注册与发现，以服务 URL 为中心，扩展接口为 `RegistryFactory`, `Registry`, `RegistryService`
- **cluster 路由层**：封装多个提供者的路由及负载均衡，并桥接注册中心，以 `Invoker` 为中心，扩展接口为 `Cluster`, `Directory`, `Router`, `LoadBalance`
- **monitor 监控层**：RPC 调用次数和调用时间监控，以 `Statistics` 为中心，扩展接口为 `MonitorFactory`, `Monitor`, `MonitorService`
- **protocol 远程调用层**：封装 RPC 调用，以 `Invocation`, `Result` 为中心，扩展接口为 `Protocol`, `Invoker`, `Exporter`
- **exchange 信息交换层**：封装请求响应模式，同步转异步，以 `Request`, `Response` 为中心，扩展接口为 `Exchanger`, `ExchangeChannel`, `ExchangeClient`, `ExchangeServer`
- **transport 网络传输层**：抽象 mina 和 netty 为统一接口，以 `Message` 为中心，扩展接口为 `Channel`, `Transporter`, `Client`, `Server`, `Codec`
- **serialize 数据序列化层**：可复用的一些工具，扩展接口为 `Serialization`, `ObjectInput`, `ObjectOutput`, `ThreadPool`

## 关系说明

- 在 RPC 中，Protocol 是核心层，也就是只要有 Protocol + Invoker + Exporter 就可以完成非透明的 RPC 调用，然后在 Invoker 的主过程上 Filter 拦截点。
- 图中的 Consumer 和 Provider 是抽象概念，只是想让看图者更直观的了解哪些类分属于客户端与服务器端，不用 Client 和 Server 的原因是 Dubbo 在很多场景下都使用 Provider, Consumer, Registry, Monitor 划分逻辑拓普节点，保持统一概念。
- 而 Cluster 是外围概念，所以 Cluster 的目的是将多个 Invoker 伪装成一个 Invoker，这样其它人只要关注 Protocol 层 Invoker 即可，加上 Cluster 或者去掉 Cluster 对其它层都不会造成影响，因为只有一个提供者时，是不需要 Cluster 的。
- Proxy 层封装了所有接口的透明化代理，而在其它层都以 Invoker 为中心，只有到了暴露给用户使用时，才用 Proxy 将 Invoker 转成接口，或将接口实现转成 Invoker，也就是去掉 Proxy 层 RPC 是可以 Run 的，只是不那么透明，不那么看起来像调本地服务一样调远程服务。
- 而 Remoting 实现是 Dubbo 协议的实现，如果你选择 RMI 协议，整个 Remoting 都不会用上，Remoting 内部再划为 Transport 传输层和 Exchange 信息交换层，Transport 层只负责单向消息传输，是对 Mina, Netty, Grizzly 的抽象，它也可以扩展 UDP 传输，而 Exchange 层是在传输层之上封装了 Request-Response 语义。
- Registry 和 Monitor 实际上不算一层，而是一个独立的节点，只是为了全局概览，用层的方式画在一起。

## 模块分包

![模块分包](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/dubbo-modules.jpg)

模块说明：

- **dubbo-common 公共逻辑模块**：包括 Util 类和通用模型。
- **dubbo-remoting 远程通讯模块**：相当于 Dubbo 协议的实现，如果 RPC 用 RMI协议则不需要使用此包。
- **dubbo-rpc 远程调用模块**：抽象各种协议，以及动态代理，只包含一对一的调用，不关心集群的管理。
- **dubbo-cluster 集群模块**：将多个服务提供方伪装为一个提供方，包括：负载均衡, 容错，路由等，集群的地址列表可以是静态配置的，也可以是由注册中心下发。
- **dubbo-registry 注册中心模块**：基于注册中心下发地址的集群方式，以及对各种注册中心的抽象。
- **dubbo-monitor 监控模块**：统计服务调用次数，调用时间的，调用链跟踪的服务。
- **dubbo-config 配置模块**：是 Dubbo 对外的 API，用户通过 Config 使用Dubbo，隐藏 Dubbo 所有细节。
- **dubbo-container 容器模块**：是一个 Standlone 的容器，以简单的 Main 加载 Spring 启动，因为服务通常不需要 Tomcat/JBoss 等 Web 容器的特性，没必要用 Web 容器去加载服务。

整体上按照分层结构进行分包，与分层的不同点在于：

- container 为服务容器，用于部署运行服务，没有在层中画出。
- protocol 层和 proxy 层都放在 rpc 模块中，这两层是 rpc 的核心，在不需要集群也就是只有一个提供者时，可以只使用这两层完成 rpc 调用。
- transport 层和 exchange 层都放在 remoting 模块中，为 rpc 调用的通讯基础。
- serialize 层放在 common 模块中，以便更大程度复用。

## 依赖关系

![依赖关系](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/dubbo-relation.jpg)

图例说明：

- 图中小方块 Protocol, Cluster, Proxy, Service, Container, Registry, Monitor 代表层或模块，蓝色的表示与业务有交互，绿色的表示只对 Dubbo 内部交互。
- 图中背景方块 Consumer, Provider, Registry, Monitor 代表部署逻辑拓扑节点。
- 图中蓝色虚线为初始化时调用，红色虚线为运行时异步调用，红色实线为运行时同步调用。
- 图中只包含 RPC 的层，不包含 Remoting 的层，Remoting 整体都隐含在 Protocol 中。

## 调用链

展开总设计图的红色调用链，如下：

![总设计图](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/dubbo-extension.jpg)

## 暴露服务时序

展开总设计图左边服务提供方暴露服务的蓝色初始化链，时序图如下：

![时序图](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/dubbo-export.jpg)

## 引用服务时序

展开总设计图右边服务消费方引用服务的蓝色初始化链，时序图如下：

![时序图](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/dubbo-refer.jpg)

## 领域模型

在 Dubbo 的核心领域模型中：

- Protocol 是服务域，它是 Invoker 暴露和引用的主功能入口，它负责 Invoker 的生命周期管理。
- Invoker 是实体域，它是 Dubbo 的核心模型，其它模型都向它靠扰，或转换成它，它代表一个可执行体，可向它发起 invoke 调用，它有可能是一个本地的实现，也可能是一个远程的实现，也可能一个集群实现。
- Invocation 是会话域，它持有调用过程中的变量，比如方法名，参数等。

## 基本设计原则

- 采用 Microkernel + Plugin 模式，Microkernel 只负责组装 Plugin，Dubbo 自身的功能也是通过扩展点实现的，也就是 Dubbo 的所有功能点都可被用户自定义扩展所替换。
- 采用 URL 作为配置信息的统一格式，所有扩展点都通过传递 URL 携带配置信息。

# 源码分析

```jshelllanguage
git clone https://github.com/apache/dubbo.git dubbo
```

## 简单用例分析

<p class="note note-primary">
provider端
</p>

目录结构
```jshelllanguage
dubbo-demo-xml-provider/src/
└── main
    ├── java
    │   └── org
    │       └── apache
    │           └── dubbo
    │               └── demo
    │                   └── provider
    │                       ├── Application.java
    │                       ├── DemoServiceImpl.java
    │                       └── GreetingServiceImpl.java
    └── resources
        ├── dubbo.properties
        ├── log4j.properties
        └── spring
            └── dubbo-provider.xml
```

配置文件
```xml
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:dubbo="http://dubbo.apache.org/schema/dubbo"
       xmlns="http://www.springframework.org/schema/beans"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.3.xsd
       http://dubbo.apache.org/schema/dubbo http://dubbo.apache.org/schema/dubbo/dubbo.xsd">

    <dubbo:application name="demo-provider">
        <dubbo:parameter key="mapping-type" value="metadata"/>
    </dubbo:application>

    <dubbo:config-center address="zookeeper://127.0.0.1:2181"/>
    <dubbo:metadata-report address="zookeeper://127.0.0.1:2181"/>
    <dubbo:registry id="registry1" address="zookeeper://127.0.0.1:2181"/>

    <dubbo:protocol name="dubbo" port="-1"/>
    <!--注入bean-->
    <bean id="demoService" class="org.apache.dubbo.demo.provider.DemoServiceImpl"/>
    <bean id="greetingService" class="org.apache.dubbo.demo.provider.GreetingServiceImpl"/>
    <!--暴露接口服务-->
    <dubbo:service interface="org.apache.dubbo.demo.DemoService" timeout="3000" ref="demoService" registry="registry1"/>
    <dubbo:service version="1.0.0" group="greeting" timeout="5000" interface="org.apache.dubbo.demo.GreetingService" ref="greetingService"/>

</beans>

```

应用类
```java
public class Application {
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring/dubbo-provider.xml");
        context.start();//启动上下文
        System.in.read();
    }
}
```

```java
public class DemoServiceImpl implements DemoService {
    private static final Logger logger = LoggerFactory.getLogger(DemoServiceImpl.class);

    @Override
    public String sayHello(String name) {
        logger.info("Hello " + name + ", request from consumer: " + RpcContext.getContext().getRemoteAddress());
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "Hello " + name + ", response from provider: " + RpcContext.getContext().getLocalAddress();
    }

    @Override
    public CompletableFuture<String> sayHelloAsync(String name) {
        CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> {
//            try {
//                Thread.sleep(1000);
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
            return "async result";
        });
        return cf;
    }
}
```

```java
public class GreetingServiceImpl implements GreetingService {
    @Override
    public String hello() {
        return "Greetings!";
    }
}

```


<p class="note note-primary">
consumer端
</p>

目录结构

```jshelllanguage
dubbo-demo-xml-consumer/src/
└── main
    ├── java
    │   └── org
    │       └── apache
    │           └── dubbo
    │               └── demo
    │                   └── consumer
    │                       └── Application.java
    └── resources
        ├── dubbo.properties
        ├── log4j.properties
        └── spring
            └── dubbo-consumer.xml
```

配置文件
```xml
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:dubbo="http://dubbo.apache.org/schema/dubbo"
       xmlns="http://www.springframework.org/schema/beans"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.3.xsd
       http://dubbo.apache.org/schema/dubbo http://dubbo.apache.org/schema/dubbo/dubbo.xsd">

    <dubbo:application name="demo-consumer">
        <dubbo:parameter key="mapping-type" value="metadata"/>
        <dubbo:parameter key="enable-auto-migration" value="true"/>
    </dubbo:application>

<!--注册地址-->
    <dubbo:registry address="zookeeper://127.0.0.1:2181"/>
<!--引用服务-->
    <dubbo:reference provided-by="demo-provider" id="demoService" check="false"
                     interface="org.apache.dubbo.demo.DemoService"/>

    <dubbo:reference provided-by="demo-provider" version="1.0.0" group="greeting" id="greetingService" check="false"
                     interface="org.apache.dubbo.demo.GreetingService"/>

</beans>
```
应用类
```java
public class Application {
    /**
     * In order to make sure multicast registry works, need to specify '-Djava.net.preferIPv4Stack=true' before
     * launch the application
     */
    public static void main(String[] args) throws Exception {
        //获取服务相关信息
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring/dubbo-consumer.xml");
        context.start();
        //获取Service
        DemoService demoService = context.getBean("demoService", DemoService.class);
        GreetingService greetingService = context.getBean("greetingService", GreetingService.class);
        //多线程调用
        new Thread(() -> {
            while (true) {
                //调用服务
                String greetings = greetingService.hello();
                System.out.println(greetings + " from separated thread.");
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
        //循环调用
        while (true) {
            CompletableFuture<String> hello = demoService.sayHelloAsync("world");
            System.out.println("result: " + hello.get());

            String greetings = greetingService.hello();
            System.out.println("result: " + greetings);

            Thread.sleep(500);
        }
    }
}
```

# Dubbo Admin

目前的管理控制台已经发布 0.1 版本，结构上采取了前后端分离的方式，前端使用 Vue 和 Vuetify 分别作为 Javascript 框架和UI框架，后端采用 Spring Boot 框架。既可以按照标准的 Maven 方式进行打包，部署，也可以采用前后端分离的部署方式，方便开发，功能上，目前具备了服务查询，服务治理(包括 Dubbo 2.7 中新增的治理规则)以及服务测试三部分内容。

### Maven方式部署

- 安装

```sh
git clone https://github.com/apache/dubbo-admin.git
cd dubbo-admin
mvn clean package
cd dubbo-admin-distribution/target
java -jar dubbo-admin-0.1.jar
```

- 访问

http://localhost:8080

### 前后端分离部署

- 前端

```sh
cd dubbo-admin-ui 
npm install 
npm run dev 
```

- 后端

```sh
cd dubbo-admin-server
mvn clean package 
cd target
java -jar dubbo-admin-server-0.1.jar
```

- 访问

http://localhost:8081

- 前后端分离模式下，前端的修改可以实时生效

### 配置: [1](https://dubbo.apache.org/zh/docs/v2.7/admin/ops/introduction/#fn:1)

配置文件为：

```sh
dubbo-admin-server/src/main/resources/application.properties
```

主要的配置有：

```fallback
admin.config-center=zookeeper://127.0.0.1:2181
admin.registry.address=zookeeper://127.0.0.1:2181
admin.metadata-report.address=zookeeper://127.0.0.1:2181
```

三个配置项分别指定了配置中心，注册中心和元数据中心的地址，关于这三个中心的详细说明，可以参考[这里](https://dubbo.apache.org/zh/docs/v2.7/user/configuration/config-center)。

也可以和 Dubbo 2.7 一样，在配置中心指定元数据和注册中心的地址，以 zookeeper 为例，配置的路径和内容如下:

```fallback
# /dubbo/config/dubbo/dubbo.properties
dubbo.registry.address=zookeeper://127.0.0.1:2181
dubbo.metadata-report.address=zookeeper://127.0.0.1:2181
```

配置中心里的地址会覆盖掉本地 `application.properties` 的配置

其他配置请访问 github 中的文档:

```sh
https://github.com/apache/dubbo-admin
```

## Docker 方式运行

Start a Apache Dubbo Admin
```sh
docker run -p 8080:8080 apache/dubbo-admin
```
It will use all default configuration and connect to zookeeper://127.0.0.1:2181

... via docker stack deploy or docker-compose
Example stack.yml:
```sh
version: '3'

services:
  zookeeper:
    image: zookeeper
    ports:
      - 2181:2181
  admin:
    image: apache/dubbo-admin
    depends_on:
      - zookeeper
    ports:
      - 8080
    environment:
      - admin.registry.address=zookeeper://zookeeper:2181
      - admin.config-center=zookeeper://zookeeper:2181
      - admin.metadata-report.address=zookeeper://zookeeper:2181
```
Try in PWD
```sh
Environment variables
admin.registry.address

admin.config-center

admin.metadata-report.address
```

# 性能方面




# 参考资料

[官方文档](http://dubbo.apache.org/zh/docs/v2.7/)  


 