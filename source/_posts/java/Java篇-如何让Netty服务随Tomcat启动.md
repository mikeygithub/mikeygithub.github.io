---
title: Java篇-如何让Netty服务随Tomcat启动
date: 2020-05-01 08:50:06
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty.png
category: Java相关
tags: netty
---

# 关于在Tomcat容器中启动Netty服务器的方法

>最近在一个web应用上重构一个即时通信功能的,考虑到负载和性能的原因,所以决定采用Netty来作为服务器端,但是如果在主线程中启动netty就会陷入阻塞状态,导致Tomcat无法启动．

# 实现思路

>我们知道，netty在主线程启动会陷入阻塞，那么我们就可以开启一个新线程来启动netty服务器，让主线程启动Tomcat即可


# 相关代码

<details>
    <summary>application-netty.xml</summary>
    
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans   
        http://www.springframework.org/schema/beans/spring-beans-4.1.xsd  
        http://www.springframework.org/schema/context   
        http://www.springframework.org/schema/context/spring-context-4.1.xsd">

    <!-- 扫描关于Netty Websocket的包 -->
    <context:component-scan base-package="com.gxwzu.websocket"/>
    <!-- 把Netty的一些类服务器注册到Spring，方便处理和扩展 -->
    <!-- 用于处理客户端连接请求 -->
	<bean id="bossGroup" class="io.netty.channel.nio.NioEventLoopGroup"/>
	<!-- 用于处理客户端I/O操作 -->
	<bean id="workerGroup" class="io.netty.channel.nio.NioEventLoopGroup"/>
	<!-- 服务器启动引导类 -->
	<bean id="serverBootstrap" class="io.netty.bootstrap.ServerBootstrap" scope="prototype"/>
	<!-- 自定义的Netty Websocket服务器 -->
	<bean id="webSocketServer" class="com.gxwzu.websocket.WebSocketServer">
		<property name="port" value="${chat.server.port}"/>
		<property name="childChannelHandler" ref="webSocketChildChannelHandler" />
	</bean>
</beans>
```

</details>

<details>
    <summary>WebSocketChildChannelHandler</summary>
    
```java
package com.gxwzu.websocket;

import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.stream.ChunkedWriteHandler;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @ProjectName gdm
 * @Author 麦奇
 * @Email biaogejiushibiao@outlook.com
 * @Date 4/28/20 8:19 AM
 * @Version 1.0
 * @Title: WebSocketChildChannelHandler
 * @Description:
 **/

@Component
public class WebSocketChildChannelHandler extends ChannelInitializer<SocketChannel> {

    @Resource(name = "webSocketServerHandler")
    private ChannelHandler webSocketServerHandler;

    @Resource(name = "httpRequestHandler")
    private ChannelHandler httpRequestHandler;

    @Override
    protected void initChannel(SocketChannel ch) throws Exception {
        ch.pipeline().addLast("http-codec", new HttpServerCodec()); // HTTP编码解码器
        ch.pipeline().addLast("aggregator", new HttpObjectAggregator(65536)); // 把HTTP头、HTTP体拼成完整的HTTP请求
        ch.pipeline().addLast("http-chunked", new ChunkedWriteHandler()); // 分块，方便大文件传输，不过实质上都是短的文本数据
        ch.pipeline().addLast("websocket-handler",webSocketServerHandler);
    }

}
```
</details>


<details>
    <summary>WebSocketServer</summary>
    
```java
kage com.gxwzu.websocket;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.util.concurrent.Future;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @ProjectName gdm
 * @Author 麦奇
 * @Email biaogejiushibiao@outlook.com
 * @Date 4/28/20 8:17 AM
 * @Version 1.0
 * @Title: WebSocketServer
 * @Description:
 **/

public class WebSocketServer implements Runnable{

    private final Logger logger = LoggerFactory.getLogger(WebSocketServer.class);

    @Autowired
    private EventLoopGroup bossGroup;
    @Autowired
    private EventLoopGroup workerGroup;
    @Autowired
    private ServerBootstrap serverBootstrap;

    private int port;

    private ChannelHandler childChannelHandler;

    private ChannelFuture serverChannelFuture;

    public WebSocketServer() {}

    @Override
    public void run() {
        build();
    }

    /**
     * 构建服务器
     */
    public void build() {
        try {
            long begin = System.currentTimeMillis();
            serverBootstrap.group(bossGroup, workerGroup) //boss辅助客户端的tcp连接请求  worker负责与客户端之前的读写操作
                    .channel(NioServerSocketChannel.class) //配置客户端的channel类型
                    .option(ChannelOption.SO_BACKLOG, 1024) //配置TCP参数，握手字符串长度设置
                    .option(ChannelOption.TCP_NODELAY, true) //TCP_NODELAY算法，尽可能发送大块数据，减少充斥的小块数据
                    .childOption(ChannelOption.SO_KEEPALIVE, true)//开启心跳包活机制，就是客户端、服务端建立连接处于ESTABLISHED状态，超过2小时没有交流，机制会被启动
                    .childOption(ChannelOption.RCVBUF_ALLOCATOR, new FixedRecvByteBufAllocator(592048))//配置固定长度接收缓存区分配器
                    .childHandler(childChannelHandler); //绑定I/O事件的处理类,WebSocketChildChannelHandler中定义
            long end = System.currentTimeMillis();

            logger.info("Netty Websocket服务器启动完成，耗时 " + (end - begin) + " ms，已绑定端口 " + port + " 阻塞式等候客户端连接");

            serverChannelFuture = serverBootstrap.bind(port).sync();
        } catch (Exception e) {
            logger.info(e.getMessage());
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
            e.printStackTrace();
        }

    }

    /**
     * 关闭资源
     */
    public void close(){
        serverChannelFuture.channel().close();
        Future<?> bossGroupFuture = bossGroup.shutdownGracefully();
        Future<?> workerGroupFuture = workerGroup.shutdownGracefully();

        try {
            bossGroupFuture.await();
            workerGroupFuture.await();
        } catch (InterruptedException ignore) {
            ignore.printStackTrace();
        }
    }

    public ChannelHandler getChildChannelHandler() {
        return childChannelHandler;
    }

    public void setChildChannelHandler(ChannelHandler childChannelHandler) {
        this.childChannelHandler = childChannelHandler;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

}
```

</details>


<details>
    <summary>WebSocketChildChannelHandler</summary>

```
package com.gxwzu.websocket;

import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.stream.ChunkedWriteHandler;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @ProjectName gdm
 * @Author 麦奇
 * @Email biaogejiushibiao@outlook.com
 * @Date 4/28/20 8:19 AM
 * @Version 1.0
 * @Title: WebSocketChildChannelHandler
 * @Description:
 **/

@Component
public class WebSocketChildChannelHandler extends ChannelInitializer<SocketChannel> {

    @Resource(name = "webSocketServerHandler")
    private ChannelHandler webSocketServerHandler;

    @Resource(name = "httpRequestHandler")
    private ChannelHandler httpRequestHandler;

    @Override
    protected void initChannel(SocketChannel ch) throws Exception {
        ch.pipeline().addLast("http-codec", new HttpServerCodec()); // HTTP编码解码器
        ch.pipeline().addLast("aggregator", new HttpObjectAggregator(65536)); // 把HTTP头、HTTP体拼成完整的HTTP请求
        ch.pipeline().addLast("http-chunked", new ChunkedWriteHandler()); // 分块，方便大文件传输，不过实质上都是短的文本数据
        ch.pipeline().addLast("http-handler", httpRequestHandler);
        ch.pipeline().addLast("websocket-handler",webSocketServerHandler);
    }

}
```

</details>

<details>
    <summary>AppContext</summary>

```
package com.gxwzu.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Component
@Scope()
public class AppContext {

    private final Logger logger = LoggerFactory.getLogger(AppContext.class);

    @Autowired
    private WebSocketServer webSocketServer;

    private Thread nettyThread;
    
    /**
     * 描述：Tomcat加载完ApplicationContext-main和netty文件后：
     *      1. 启动Netty WebSocket服务器；
     *      2. 加载用户数据；
     *      3. 加载用户交流群数据。
     */
    @PostConstruct
    public void init() {
        nettyThread = new Thread(webSocketServer);
        logger.info("开启独立线程，启动Netty WebSocket服务器...");
        nettyThread.start();
    }

    /**
     * 描述：Tomcat服务器关闭前需要手动关闭Netty Websocket相关资源，否则会造成内存泄漏。
     *      1. 释放Netty Websocket相关连接；
     *      2. 关闭Netty Websocket服务器线程。（强行关闭，是否有必要？）
     */
    @SuppressWarnings("deprecation")
    @PreDestroy
    public void close() {
        logger.info("正在释放Netty Websocket相关连接...");
        webSocketServer.close();
        logger.info("正在关闭Netty Websocket服务器线程...");
        nettyThread.stop();
        logger.info("系统成功关闭！");
    }
}
```
</details>



# 参考资料

[Tomcat 通过listener 启动netty 服务](https://blog.csdn.net/albertfly/article/details/51526423)  


 