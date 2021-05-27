---
title: Tomcat篇-组件架构
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/tomcat.jpg
date: 2020-12-02 10:08:26
category: 中间件篇
tags: Tomcat
---

# Tomcat总体架构

![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/tomcat-framework.png)

<table>
    <tr>
        <td>组件名称</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>Server</td>
        <td>表示整个Servlet容器，因此Tomcat运行环境中只有唯一一个Servlet实例</td>
    </tr>
    <tr>
        <td>Service</td>
        <td>Service表示一个或者多个Connector的集合，这些Connector共享同一个Container来处理其请求。在同一个Tomcat实例内可以包含任意多个Service实例，他们相互独立</td>
    </tr>  
    <tr>
        <td>Connector</td>
        <td>即Tomcat链接器，用于监听并转化Socker请求，同时将读取的Socket请求交由Container处理，支持不同协议以及不同I/O方式</td>
    </tr>
    <tr>
        <td>Container</td>
        <td>Container表示能够执行客户端请求并返回响应的一类对象。在Tomcat中存在不同级别的容器：Engine、Host、Context、Wrapper</td>
    </tr>  
    <tr>
        <td>Engine</td>
        <td>表示整个Servlet引擎。在Tomcat中，Engine为最高层的容器对象。尽管Engine不是</td>
    </tr>
    <tr>
        <td>Host</td>
        <td>Host作为一类容器，表示Servlet引擎(即Engine)中的虚拟机，与一个服务器的网络名有关，如域名等。客户端可以使用这个网络名连接服务器，真个名称必须要在DNS服务器上注册</td>
    </tr>  
    <tr>
        <td>Context</td>
        <td>Context作为一类容器，用于表示ServletContent，在Servlet规范中，一个ServletContext即表示一个独立的Web应用。</td>
    </tr>
    <tr>
        <td>Wrapper</td>
        <td>Wrapper作为一类容器，用于表示Web应用中定义的Servlet</td>
    </tr>    
    <tr>
        <td>Executor</td>
        <td>表示Tomcat组件可以共享的线程池</td>
    </tr>
</table>


# Tomcat 应用服务器启动

![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/tomcat-start.png)

# Tomcat 请求处理

![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/tomcat-request.png)


# Tomcat 类加载器


![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/tomcat-classloader.png)


除每个Web的类加载器外，Tomcat也提供了3个基础的类加载器和Web应用类加载器，而且这三个类加载器指向的路径和包列表均可以由`catalina.properties`配置。

- Common: 以System为父加载器，是位于Tomcat应用服务器顶层的公用类加载器。其路径为`common.loader`，默认指向$CATALINA_HOME/lib下的包。
- Catalina: 以Common为父加载器，是用于加载Tomcat应用服务器的类加载器，其路径为`server.loader`，默认为空，此时Tomcat使用Common类加载器加载应用资源。
- Shared: 以Common为父加载器，是所有Web应用的父加载器，其路径为`shared.loader`,默认为空。此时Tomcat使用`Common`类加载器作为Web应用的父加载器。
- Web应用: 以Shard为父加载器，加载`/WEB-INF/classs`目录下的未压缩的Class和资源文件以及`/WEB-INF/lib`目录下的Jar包。如前所示，该类加载器只对当前Web应用可见，对其他应用均不可见。


<br>

Java默认类加载机制

```text
从缓存中加载
如果缓存中没有，则从父类加载器中加载。
如果父类加载器没有，则从当前类加载器加载
如果没有则抛出异常
```

Tomcat的加载机制稍有不同`首先尝试通过当前类加载器加载，然后才进行委派`

```text
从缓存中加载
如果没有，则从JVM的Bootstrap类加载器加载。
如果没有，则从当前类加载器加载(按照WEB-INF/classes、WEB-INF/lib的顺序)
如果没有，则从父类加载器加载，由于父类加载器采用的默认的委派模式，所以加载顺序为System、Common、Shared
```

Tomcat提供了delegate属性用于控制是否启用Java委派模式，默认为false，当为true时启用

**作用**
>`Tomcat通过该机制实现了为WEB应用中的Jar包覆盖服务器提供包的目的`，Java核心类库，Servlet规范相关类库是无法覆盖的，此外Java默认的诸多XML工具包，由于位于Jvm的Bootstrap类加载器也无法覆盖，只能通过endorsed的方式实现。



# 参考资料

[Tomcat架构解析.刘光瑞]()

[简单实现HttpServer服务器](https://www.cnblogs.com/biaogejiushibiao/p/10397354.html)   


 