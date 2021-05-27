---
title: Netty
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty.png
date: 2020-12-28 17:38:41
category: 转载文章
tags: Netty
---

转自[敖丙肝了一个月的Netty知识点](https://mp.weixin.qq.com/s/I9PGsWo7-ykGf2diKklGtA)

## NIO 基本概念

### 阻塞（Block）与非阻塞（Non-Block）

阻塞和非阻塞是进程在访问数据的时候，数据是否准备就绪的一种处理方式，当数据没有准备的时候。

**阻塞**：往往需要等待缓冲区中的数据准备好过后才处理其他的事情，否则一直等待在那里。

**非阻塞**:当我们的进程访问我们的数据缓冲区的时候，如果数据没有准备好则直接返回，不会等待。如果数据已经准备好，也直接返回。

**阻塞 IO ：**

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-1.jpg)

**非阻塞 IO ：**

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-2.jpg)

### 同步（Synchronous）与异步（Asynchronous）

同步和异步都是基于应用程序和操作系统处理 IO 事件所采用的方式。比如

**同步：**是应用程序要直接参与 IO 读写的操作。

**异步：**所有的 IO 读写交给操作系统去处理，应用程序只需要等待通知。

同步方式在处理 IO 事件的时候，必须阻塞在某个方法上面等待我们的 IO 事件完成（阻塞 IO 事件或者通过轮询 IO事件的方式），对于异步来说，所有的 IO 读写都交给了操作系统。这个时候，我们可以去做其他的事情，并不需要去完成真正的 IO 操作，当操作完成 IO 后，会给我们的应用程序一个通知。

所以异步相比较于同步带来的直接好处就是在我们处理IO数据的时候，异步的方式我们可以把这部分等待所消耗的资源用于处理其他事务，提升我们服务自身的性能。

**同步 IO ：**

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-3.jpg)

**异步 IO ：**

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-4.jpg)

## Java BIO与NIO对比

### BIO（传统IO）：

BIO是一个同步并阻塞的IO模式，**传统的  java.io 包**，它基于流模型实现，提供了我们最熟知的一些 IO 功能，比如**File抽象、输入输出流**等。**交互方式是同步、阻塞的方式**，也就是说，在读取输入流或者写入输出流时，在读、写动作完成之前，线程会一直阻塞在那里，它们之间的调用是可靠的线性顺序。

### NIO（Non-blocking/New I/O）

NIO 是一种同步非阻塞的 I/O 模型，于 Java 1.4 中引入，对应 java.nio 包，提供了 Channel , Selector，Buffer 等抽象。NIO 中的 N 可以理解为 Non-blocking，不单纯是 New。它支持面向缓冲的，基于通道的 I/O 操作方法。NIO 提供了与传统 BIO 模型中的 `Socket` 和 `ServerSocket` 相对应的 `SocketChannel` 和 `ServerSocketChannel` 两种不同的套接字通道实现,两种通道都支持阻塞和非阻塞两种模式。对于高负载、高并发的（网络）应用，应使用 NIO 的非阻塞模式来开发

### BIO与NIO的对比

| IO模型 | BIO      | NIO        |
| :----- | :------- | :--------- |
| 通信   | 面向流   | 面向缓冲   |
| 处理   | 阻塞  IO | 非阻塞  IO |
| 触发   | 无       | 选择器     |

#### NIO 的 Server 通信的简单模型：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-5.jpg)

#### BIO 的 Server 通信的简单模型：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-6.jpg)

#### NIO的特点：

1. 一个线程可以处理多个通道，减少线程创建数量；
2. 读写非阻塞，节约资源：没有可读／可写数据时，不会发生阻塞导致线程资源的浪费

## Reactor 模型

### 单线程的 Reactor 模型

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-7.jpg)

### 多线程的 Reactor 模型

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-8.jpg)

### 多线程主从 Reactor 模型

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-9.jpg)

## Netty  基础概念

### Netty 简介

Netty 是一个 NIO 客户端服务器框架，可快速轻松地开发网络应用程序，例如协议服务器和客户端。它极大地简化和简化了网络编程，例如 TCP 和 UDP 套接字服务器。

“快速简便”并不意味着最终的应用程序将遭受可维护性或性能问题的困扰。Netty 经过精心设计，结合了许多协议（例如FTP，SMTP，HTTP 以及各种基于二进制和文本的旧式协议）的实施经验。结果，Netty 成功地找到了一种无需妥协即可轻松实现开发，性能，稳定性和灵活性的方法。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-10.jpg)

### Netty 执行流程

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-11.jpg)

### Netty 核心组件

#### Channel

Channel是 Java NIO 的一个基本构造。可以看作是传入或传出数据的载体。因此，它可以被打开或关闭，连接或者断开连接。

#### EventLoop 与 EventLoopGroup

EventLoop 定义了Netty的核心抽象，用来处理连接的生命周期中所发生的事件，在内部，将会为每个Channel分配一个EventLoop。

EventLoopGroup 是一个 EventLoop 池，包含很多的 EventLoop。

Netty 为每个 Channel 分配了一个 EventLoop，用于处理用户连接请求、对用户请求的处理等所有事件。EventLoop 本身只是一个线程驱动，在其生命周期内只会绑定一个线程，让该线程处理一个 Channel 的所有 IO 事件。

一个 Channel 一旦与一个 EventLoop 相绑定，那么在 Channel 的整个生命周期内是不能改变的。一个 EventLoop 可以与多个 Channel 绑定。即 Channel 与 EventLoop 的关系是 n:1，而 EventLoop 与线程的关系是 1:1。

#### ServerBootstrap 与 Bootstrap

Bootstarp 和 ServerBootstrap 被称为引导类，指对应用程序进行配置，并使他运行起来的过程。Netty处理引导的方式是使你的应用程序和网络层相隔离。

Bootstrap 是客户端的引导类，Bootstrap 在调用 bind()（连接UDP）和 connect()（连接TCP）方法时，会新创建一个 Channel，仅创建一个单独的、没有父 Channel 的 Channel 来实现所有的网络交换。

ServerBootstrap 是服务端的引导类，ServerBootstarp 在调用 bind() 方法时会创建一个 ServerChannel 来接受来自客户端的连接，并且该 ServerChannel 管理了多个子 Channel 用于同客户端之间的通信。

#### ChannelHandler 与 ChannelPipeline

ChannelHandler 是对 Channel 中数据的处理器，这些处理器可以是系统本身定义好的编解码器，也可以是用户自定义的。这些处理器会被统一添加到一个 ChannelPipeline 的对象中，然后按照添加的顺序对 Channel 中的数据进行依次处理。

#### ChannelFuture

Netty 中所有的 I/O 操作都是异步的，即操作不会立即得到返回结果，所以 Netty 中定义了一个 ChannelFuture 对象作为这个异步操作的“代言人”，表示异步操作本身。如果想获取到该异步操作的返回值，可以通过该异步操作对象的addListener() 方法为该异步操作添加监 NIO 网络编程框架 Netty 听器，为其注册回调：当结果出来后马上调用执行。

Netty 的异步编程模型都是建立在 Future 与回调概念之上的。

## Netty 源码阅读

源码阅读，最好可以再 Debug 的情况下进行，这样更容易帮助理解，因此在分析 Netty 前的我准备一个客户端和服务端的代码。

### Netty - Server 代码

```java
public class NettyServer {
    public static void main(String[] args) throws InterruptedException {
        EventLoopGroup parentGroup = new NioEventLoopGroup();
        EventLoopGroup childGroup = new NioEventLoopGroup();
        try {

            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(parentGroup, childGroup)
                     .channel(NioServerSocketChannel.class)
                     .childHandler(new ChannelInitializer<SocketChannel>() {

                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {

                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new StringDecoder());
                            pipeline.addLast(new StringEncoder());
                            pipeline.addLast(new SomeSocketServerHandler());
                         }
                    });

            ChannelFuture future = bootstrap.bind(8888).sync();
            System.out.println("服务器已启动。。。");

            future.channel().closeFuture().sync();
        } finally {
            parentGroup.shutdownGracefully();
            childGroup.shutdownGracefully();
        }
    }
}
```

### Server 端 Handler：

```java
public class DemoSocketServerHandler
                       extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg)
            throws Exception {
        System.out.println("Client Address ====== " + ctx.channel().remoteAddress());
        ctx.channel().writeAndFlush("from server:" + UUID.randomUUID());
        ctx.fireChannelActive();
        TimeUnit.MILLISECONDS.sleep(500);
    }
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx,
                                Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }
}
```

### Netty - Client 代码

```
public class NettyClient {
    public static void main(String[] args) throws InterruptedException {
        NioEventLoopGroup eventLoopGroup = new NioEventLoopGroup();
        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(eventLoopGroup)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new StringDecoder(CharsetUtil.UTF_8));
                            pipeline.addLast(new StringEncoder(CharsetUtil.UTF_8));
                            pipeline.addLast(new DemoSocketClientHandler());
                        }
                    });

            ChannelFuture future = bootstrap.connect("localhost", 8888).sync();
            future.channel().closeFuture().sync();
        } finally {
            if(eventLoopGroup != null) {
                eventLoopGroup.shutdownGracefully();
            }
        }
    }
}
```

### Client 端  Handler ：

```
public class DemoSocketClientHandler
               extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg)
            throws Exception {
        System.out.println(msg);
        ctx.channel().writeAndFlush("from client: " + System.currentTimeMillis());
        TimeUnit.MILLISECONDS.sleep(5000);
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx)
            throws Exception {
        ctx.channel().writeAndFlush("from client：begin talking");
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx,
                                Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }
}
```

### NioEventLoopGroup 初始化分析

首先根据 Server 服务端代码，分析 NioEventLoopGroup 的初始化过程。而在分析 NioEventLoopGroup 之前，有必要简单的说一说 NioEventLoopGroup 与 NioEventLoop ，方便后续源码的理解。

#### NioEventLoop 源码分析前了解

**NioEventLoop 的继承体系**

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-12.jpg)

从 NioEventLoop 的继承体系中可以看到，NioEventLoop  本身就是一个 Executor，并且还是一个 单线程的 Executor。Executor  必然拥有一个 `execute(Runnable command)` 的实现方法，而 NioEventLoop 的 `execute()` 实现方法在其父类  SingleThreadEventExecutor 中，找到具体代码：

```
    public void execute(Runnable task) {
        if (task == null) {
            throw new NullPointerException("task");
        }

        boolean inEventLoop = inEventLoop();
        addTask(task);
        if (!inEventLoop) {
            startThread();
            if (isShutdown()) {
                boolean reject = false;
                try {
                    if (removeTask(task)) {
                        reject = true;
                    }
                } catch (UnsupportedOperationException e) {
                    // The task queue does not support removal so the best thing we can do is to just move on and
                    // hope we will be able to pick-up the task before its completely terminated.
                    // In worst case we will log on termination.
                }
                if (reject) {
                    reject();
                }
            }
        }
        if (!addTaskWakesUp && wakesUpForTask(task)) {
            wakeup(inEventLoop);
        }
    }
```

这里不细说，但是贴出这段代码主要为了引出 `startThread();` 这句代码，在跟这句代码会发现，它最终调用了 NioEventLoop 的一个成员 Executor 执行了当前成员的 `execute()` 方法。对应的成员 `io.netty.util.concurrent.SingleThreadEventExecutor#executor`

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-13.jpg)

而 executor 成员的初始化也是在当前代码执行时创建的匿名 Executor ，也就是执行到即新建并且执行当前 匿名 `executr()` 方法。

**总结：**

1. NioEventLoop 本身就是一个 Executor。
2. NioEventLoop 内部封装这一个新的线程 Executor 成员。
3. NioEventLoop 有两个 `execute` 方法，除了本身的 `execute()` 方法对应的还有成员属性 Executor  对应的 `execute()` 方法。

**备注：** 因为这里出现了四个 Executor，为了区分，我们给其新的名称：

> NioEventLoop 本身 Executor：**NioEventLoop**
>
> NioEventLoop 的成员 Executor：**子 Executor**
>
> NioEventLoopGroup 本身 Executor ：**NioEventLoopGroup**
>
> NioEventLoopGroup 的构造参数 Executor ：**总Executor**

**NioEventLoopGroup 的继承体系**

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-14.jpg)

看到继承体系可以直接知道 NioEventLoopGroup 也是一个 Executor，并且是一个线程池的 Executor，所以他也有 `execute()` 方法。对应的实现再其父类之中：`io.netty.util.concurrent.AbstractEventExecutorGroup#execute`

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-15.jpg)

而这里还需要说到的一点是：在 NioEventLoopGroup  的构造中，再其父类 MultithreadEventExecutorGroup 的构造再次引入了一个新的 Executor，

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-16.jpg)

之所以这里提到这个 Executor，是因为这个 Executor 是对应的 `execute()` 就是在 NioEventLoop 中的成员 Executor 的 `execute()` 执行时调用的。也就是下面对应的代码调用。`io.netty.util.internal.ThreadExecutorMap#apply(java.util.concurrent.Executor, io.netty.util.concurrent.EventExecutor)`

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-17.jpg)

到这如果不明白，没关系，因为只是为了引入 NioEventLoopGroup 和 NioEventLoop 的对应的两个 Executor，和两个 Executor 对应的两个 `execute()` 方法。这个后面还会有详细分析。

**总结：**

1. NioEventLoopGroup 是一个线程池线程 Executor。
2. NioEventLoopGroup 也封装了一个线程 Executor。
3. NioEventLoopGroup 也有两个 `execute()`方法。

#### NioEventLoopGroup 初始化代码分析

上面说了基本的了解内容，下面具体分析，从 NioEventLoopGroup 的初始化进入源码分析。

入口我们直接找 NioEventLoopGroup 的无参构造。

```
    public NioEventLoopGroup() {
        this(0);
    }
    public NioEventLoopGroup(int nThreads) {
        // 第二个参数是这个group所包含的executor
        this(nThreads, (Executor) null);
    }
    public NioEventLoopGroup(int nThreads, Executor executor) {
        // 第三个参数是provider，其用于提供selector及selectable的channel，
        // 这个provider是当前JVM中唯一的一个单例的provider
        this(nThreads, executor, SelectorProvider.provider());
    }
    public NioEventLoopGroup(
            int nThreads, Executor executor, final SelectorProvider selectorProvider) {
        // 第四个参数是一个选择策略工厂实例
        this(nThreads, executor, selectorProvider, DefaultSelectStrategyFactory.INSTANCE);
    }
    public NioEventLoopGroup(int nThreads, Executor executor, final SelectorProvider selectorProvider,
                             final SelectStrategyFactory selectStrategyFactory) {
        super(nThreads, executor, selectorProvider, selectStrategyFactory, RejectedExecutionHandlers.reject());
    }
    protected MultithreadEventLoopGroup(int nThreads, Executor executor, Object... args) {
        super(nThreads == 0 ? DEFAULT_EVENT_LOOP_THREADS : nThreads, executor, args);
    }
    protected MultithreadEventExecutorGroup(int nThreads, Executor executor, Object... args) {
        // 第三个参数是选择器工厂实例
        this(nThreads, executor, DefaultEventExecutorChooserFactory.INSTANCE, args);
    }
```

跟到此，可以发现无参构造的基本参数被初始化， `nThreads ：DEFAULT_EVENT_LOOP_THREADS//默认当前CPU逻辑核心数的两倍`，`selectorProvide:SelectorProvider.provider()//当前JVM中唯一的一个单例的provider`，`SelectStrategyFactory:DefaultSelectStrategyFactory.INSTANCE//默认选择策略工厂实例`，`chooserFactory:DefaultEventExecutorChooserFactory.INSTANCE//选择器工厂实例`。到这里只是基本的初始化参数，重点方法为`MultithreadEventExecutorGroup` 的构造方法。下面重点分析：

```
    protected MultithreadEventExecutorGroup(int nThreads, Executor executor,
                                            EventExecutorChooserFactory chooserFactory, Object... args) {
        if (nThreads <= 0) {
            throw new IllegalArgumentException(String.format("nThreads: %d (expected: > 0)", nThreads));
        }

        if (executor == null) {
            // 这个executor是group所包含的executor，其将来会为其所包含的每个eventLoop创建一个线程
            executor = new ThreadPerTaskExecutor(newDefaultThreadFactory());
        }

        children = new EventExecutor[nThreads];

        for (int i = 0; i < nThreads; i ++) {
            boolean success = false;
            try {
                // 创建eventLoop
                children[i] = newChild(executor, args);
                success = true;
            } catch (Exception e) {
                throw new IllegalStateException("failed to create a child event loop", e);
            } finally {
                // 在创建这些eventLoop过程中，只要有一个创建失败，则关闭之前所有已经创建好的eventLoop
                if (!success) {
                    // 关闭之前所有已经创建好的eventLoop
                    for (int j = 0; j < i; j ++) {
                        children[j].shutdownGracefully();
                    }

                    // 终止所有eventLoop上所执行的任务
                    for (int j = 0; j < i; j ++) {
                        EventExecutor e = children[j];
                        try {
                            while (!e.isTerminated()) {
                                e.awaitTermination(Integer.MAX_VALUE, TimeUnit.SECONDS);
                            }
                        } catch (InterruptedException interrupted) {
                            Thread.currentThread().interrupt();
                            break;
                        }
                    }
                }
            }
        }

        // 创建一个选择器
        chooser = chooserFactory.newChooser(children);

        final FutureListener<Object> terminationListener = new FutureListener<Object>() {
            @Override
            public void operationComplete(Future<Object> future) throws Exception {
                if (terminatedChildren.incrementAndGet() == children.length) {
                    terminationFuture.setSuccess(null);
                }
            }
        };

        for (EventExecutor e: children) {
            e.terminationFuture().addListener(terminationListener);
        }

        Set<EventExecutor> childrenSet = new LinkedHashSet<EventExecutor>(children.length);
        Collections.addAll(childrenSet, children);
        readonlyChildren = Collections.unmodifiableSet(childrenSet);
    }
```

根据无参构造直接往下跟，可以看到核心部分在最后一个父类的构造里。也就是 `io.netty.util.concurrent.MultithreadEventExecutorGroup#MultithreadEventExecutorGroup(int, java.util.concurrent.Executor, io.netty.util.concurrent.EventExecutorChooserFactory, java.lang.Object...)`。

再这里完成整个 NioEventLoopGroup 的实例初始化，这里分析下，然后再画个图回顾下。

初始化构造参数中的 Executor 参数，当其为空时，将其初始化

```
executor = new ThreadPerTaskExecutor(newDefaultThreadFactory());
```

首先 `newDefaultThreadFactory())` 创建默认的线程工厂，有兴趣可以跟进去看看。然后再创建`ThreadPerTaskExecutor`线程 Executor 对象。（PS：这里创建的 Executor 就是 NioEventLoopGroup 内的 Executor 对象，并不是当前 NioEventLoopGroup  自身，可以称其为 **总 Executor**）。

然后可以看到这里创建了一个 children 数组，根据需要创建的线程数创建对应数量的数组。

```
children = new EventExecutor[nThreads];
```

因为每个 NioEventLoopGroup 都是 NioEventLoop 的集合，所以这里的 children 数组就是当前 NioEventLoopGroup 的 NioEventLoop。所以 NioEventLoop 的创建的实在 NioEventLoopGroup 初始化的时候。下面看 NioEventLoop 的初始化：

```
// 逐个创建nioEventLoop实例
for (int i = 0; i < nThreads; i ++) {
    boolean success = false;
    try {
        // 创建eventLoop
        children[i] = newChild(executor, args);
        success = true;
    } catch (Exception e) {
        // TODO: Think about if this is a good exception type
        throw new IllegalStateException("failed to create a child event loop", e);
    } finally {
        // 在创建这些eventLoop过程中，只要有一个创建失败，则关闭之前所有已经创建好的eventLoop
        if (!success) {
            // 闭之前所有已经创建好的eventLoop
            for (int j = 0; j < i; j ++) {
                children[j].shutdownGracefully();
            }

            // 终止所有eventLoop上所执行的任务
            for (int j = 0; j < i; j ++) {
                EventExecutor e = children[j];
                try {
                    while (!e.isTerminated()) {
                        e.awaitTermination(Integer.MAX_VALUE, TimeUnit.SECONDS);
                    }
                } catch (InterruptedException interrupted) {
                    // Let the caller handle the interruption.
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
    }
}
```

先整体看这段 NioEventLoop 的创建代码，可以看到整个过程中存在一个成功标志，catch 每个 NioEventLoop 创建完成过程，如果发生异常则将所有已经创建的 NioEventLoop 关闭。重点的代码也就在 NioEventLoop 的创建了。所以我们继续跟：`children[i] = newChild(executor, args);`往下走，直接找到 `io.netty.channel.nio.NioEventLoopGroup#newChild` ，因为当前是 NioEventLoopGroup 的创建，所以知道找到子类的 `newChild` 实现。

```
@Override
protected EventLoop newChild(Executor executor, Object... args) throws Exception {
    return new NioEventLoop(this, executor, (SelectorProvider) args[0],
            ((SelectStrategyFactory) args[1]).newSelectStrategy(), (RejectedExecutionHandler) args[2]);
}
```

又将之前合并的 args 参数强转回来，继续跟进 NioEventLoop 构造：

```
NioEventLoop(NioEventLoopGroup parent, Executor executor, SelectorProvider selectorProvider,
             SelectStrategy strategy, RejectedExecutionHandler rejectedExecutionHandler) {
    super(parent, executor, false, DEFAULT_MAX_PENDING_TASKS, rejectedExecutionHandler);
    if (selectorProvider == null) {
        throw new NullPointerException("selectorProvider");
    }
    if (strategy == null) {
        throw new NullPointerException("selectStrategy");
    }
    provider = selectorProvider;
    // 创建一个selector的二元组
    final SelectorTuple selectorTuple = openSelector();
    selector = selectorTuple.selector;
    unwrappedSelector = selectorTuple.unwrappedSelector;
    selectStrategy = strategy;
}
```

这里我们先整体看下，将之前的默认参数初始化到 NioEventLoop 属性中。其中有两处：`openSelector()` 和 `super(parent, executor, false, DEFAULT_MAX_PENDING_TASKS, rejectedExecutionHandler)`。这里先看父类构造：

往下跟，直接就是 SingleThreadEventLoop -> SingleThreadEventExecutor 的初始化，这些也可以在 NioEventLoop 的继承体系可以看到：

```
// io.netty.channel.SingleThreadEventLoop#SingleThreadEventLoop
protected SingleThreadEventLoop(EventLoopGroup parent, Executor executor,
                                boolean addTaskWakesUp, int maxPendingTasks,
                                RejectedExecutionHandler rejectedExecutionHandler) {
    super(parent, executor, addTaskWakesUp, maxPendingTasks, rejectedExecutionHandler);
    // 创建一个收尾队列
    tailTasks = newTaskQueue(maxPendingTasks);
}

// io.netty.util.concurrent.SingleThreadEventExecutor#SingleThreadEventExecutor
protected SingleThreadEventExecutor(EventExecutorGroup parent, Executor executor,
                                    boolean addTaskWakesUp, int maxPendingTasks,
                                    RejectedExecutionHandler rejectedHandler) {
    super(parent);
    this.addTaskWakesUp = addTaskWakesUp;
    this.maxPendingTasks = Math.max(16, maxPendingTasks);
    // 这是当前NioEventLoop所包含的executor
    this.executor = ThreadExecutorMap.apply(executor, this);
    // 创建一个任务队列
    taskQueue = newTaskQueue(this.maxPendingTasks);
    rejectedExecutionHandler = ObjectUtil.checkNotNull(rejectedHandler, "rejectedHandler");
}
```

这里首先创建的是 SingleThreadEventExecutor ，这里重点需要关注的代码是：

```
this.executor = ThreadExecutorMap.apply(executor, this);
```

这里`this` 是 NioEventLoop ，所以`this.executor`就是前面说的 NioEventLoop 里的 Executor，这里我们先称为 **子 Executor**（子：对应的就是 NioEventLoop ，前面说的 总：对应的是 NioEventLoopGroup ）。

而这里  **子 Executor** 的初始化是由一个 `executor` 参数的，这个就是前面 NioEventLoopGroup 构造方法一直带入的 **总 Executor**。那我们继续往下跟，看看这个**子 Executor** 是如何完成的初始化的。

```
    public static Executor apply(final Executor executor, final EventExecutor eventExecutor) {
        ObjectUtil.checkNotNull(executor, "executor");
        ObjectUtil.checkNotNull(eventExecutor, "eventExecutor");
        // 这里创建的executor是子executor
        return new Executor() {
            // 这个execute()是子executor的execute()
            @Override
            public void execute(final Runnable command) {
                // 这里调用了NioEventLoopGroup所包含的executor的execute()
                // 即调用了“总的executor”的execute()
                executor.execute(apply(command, eventExecutor));
            }
        };
    }
```

这段代码细看就会明白，这里创建的 **子 Executor**的创建也就是一个线程的创建，但是重点却在这个线程 Executor 的 `execute()`方法实现，只做了一件事情：就是调用 传入的 **总 Executor** 的 `execute()`方法。所以这里 **子 Executor** 做的事情就是调用 **总 Executor** 的 `execute()`。不要觉得这里绕，因为这还只是初始化，后面这里执行会更绕。[手动捂脸哭]

其实这里的 `apply(command, eventExecutor)`，这里再执行 **总 Executor** 的 `execute()` 时还是会记录当前正在执行的线程，并且再执行完成时将当前记录值删除。

```
public static Runnable apply(final Runnable command, final EventExecutor eventExecutor) {
    ObjectUtil.checkNotNull(command, "command");
    ObjectUtil.checkNotNull(eventExecutor, "eventExecutor");
    return new Runnable() {
        @Override
        public void run() {
            setCurrentEventExecutor(eventExecutor);
            try {
                command.run();
            } finally {
                setCurrentEventExecutor(null);
            }
        }
    };
}
```

这里再 NioEventLoop 的属性 Executor 创建完成时，又去创建了一个普通任务队列`taskQueue = newTaskQueue(this.maxPendingTasks);`并且还创建了一个收尾任务队列`tailTasks = newTaskQueue(maxPendingTasks);`。这几个队列后面会说到。这里继续跟  NioEventLoop 主流程初始化。

到这我们再回去看看 `openSelector()`，这里我们要先知道 SelectorTuple ：

```
private static final class SelectorTuple {
    final Selector unwrappedSelector;  // NIO原生selector
    final Selector selector;  // 优化过的selector

    SelectorTuple(Selector unwrappedSelector) {
        this.unwrappedSelector = unwrappedSelector;
        this.selector = unwrappedSelector;
    }

    SelectorTuple(Selector unwrappedSelector, Selector selector) {
        this.unwrappedSelector = unwrappedSelector;
        this.selector = selector;
    }
}
```

SelectorTuple 只是一个包含两个 Selector 的内部类，用于封装优化前后的 Selector。而 `openSelector()` 方法就是为了返回 Selector 并且根据配置判断是否需要优化当前 Selector 。下面看具体代码：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-18.jpg)

而具体的优化过程有兴趣的可以自己去看看，这里只要知道，若是禁用了优化则 SelectorTuple 的优化后的 Selector 和为优化的 Selector 均为 Nio 原生的 Selector。

而这`io.netty.util.concurrent.MultithreadEventExecutorGroup#MultithreadEventExecutorGroup(int, java.util.concurrent.Executor, io.netty.util.concurrent.EventExecutorChooserFactory, java.lang.Object...)`后面还有在 NioEventLoop 数组创建完成后，还有选择器创建和关闭监听器绑定等，感兴趣可以自己看看，这里不再介绍。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-19.jpg)

到这一个 NioEventLoop 的创建过程的代码也全部看完了。我想如果只看这个肯定还是有点懵，源码这个东西需要自己跟进去去看，debug 一点点的跟，跟着运行的代码去想为何这么实现，不过这里我也画个图，让大家更直观的了解到 NioEventLoopGroup 的创建流程以及主要操作。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-20.jpg)

我想大家结合这个图，再结合上面的分析过程，最好可以自己找到源码，跟一遍，应该可以理解 NioEvnetLoopGroup 的创建。

### ServerBootstrap与 ServerBootstrap 属性配置分析

继承体系：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-21.jpg)

入口代码：

```
//2.创建服务端启动引导/辅助类：ServerBootstrap
ServerBootstrap b = new ServerBootstrap();
//3.给引导类配置两大线程组,确定了线程模型
b.group(bossGroup, workerGroup)
    // (非必备)打印日志
    .handler(new LoggingHandler(LogLevel.INFO))
    // 4.指定 IO 模型
    .channel(NioServerSocketChannel.class)
    .childHandler(new ChannelInitializer<SocketChannel>() {
        @Override
        public void initChannel(SocketChannel ch) {
            ChannelPipeline p = ch.pipeline();
            //5.可以自定义客户端消息的业务处理逻辑
            p.addLast(new HelloServerHandler());
        }
    });

Bootstrap bootstrap = new Bootstrap();
bootstrap.group(eventLoopGroup)
    .channel(NioSocketChannel.class)
    .handler(new ChannelInitializer<SocketChannel>() {
        @Override
        protected void initChannel(SocketChannel ch) throws Exception {
            ChannelPipeline pipeline = ch.pipeline();
            pipeline.addLast(new StringDecoder(CharsetUtil.UTF_8));
            pipeline.addLast(new StringEncoder(CharsetUtil.UTF_8));
            pipeline.addLast(new SomeSocketClientHandler());
        }
    });
```

ServerBootstrap与 Bootstrap 都是启动配置类，唯一不同的是，ServerBootstrap是服务端的启动配置类，Bootstrap  则是客户端的启动配置类，主要用于绑定我们创建的 EventLoopGroup，指定 Channel 的类型以及绑定 Channel 处理器等操作，主要做的都是给 ServerBootstrap与 Bootstrap  的属性赋值操作，所以称其为配置类。可以进入 `group()` 方法里看一眼：

```
public ServerBootstrap group(EventLoopGroup parentGroup, EventLoopGroup childGroup) {
    super.group(parentGroup);
    if (childGroup == null) {
        throw new NullPointerException("childGroup");
    }
    if (this.childGroup != null) {
        throw new IllegalStateException("childGroup set already");
    }
    this.childGroup = childGroup;
    return this;
}
```

其他的方法也是一样，感兴趣可以自己进去看看。这里只是初始化，都是为了后面的操作做准备。

### 服务端 bind 方法 ServerBootstrap.bind() 源码解析

这里我们从这里进入：

```
b.bind(port).sync();
```

直接从 `bind()`方法跟进去：

```
// io.netty.bootstrap.AbstractBootstrap#bind(int)
public ChannelFuture bind(int inetPort) {
    return bind(new InetSocketAddress(inetPort));
}

// 继续跟进
public ChannelFuture bind(SocketAddress localAddress) {
    // 验证group与channelFactory是否为null
    validate(); 
    if (localAddress == null) {
        throw new NullPointerException("localAddress");
    }
    // 这里是一处重点逻辑
    return doBind(localAddress);
}
```

这里显示校验了 Bootstrap 的 group 与 channelFactory 是否绑定成功。然后继续跟进 `doBind()` 方法：

```
private ChannelFuture doBind(final SocketAddress localAddress) {
    // 创建、初始化channel，并将其注册到selector，返回一个异步结果
    final ChannelFuture regFuture = initAndRegister();
    // 从异步结果中获取channel
    final Channel channel = regFuture.channel();
    // 若异步操作执行过程中出现了异常，则直接返回异步对象（直接结束）
    if (regFuture.cause() != null) {
        return regFuture;
    }

    // 处理异步操作完成的情况（可能是正常结束，或发生异常，或任务取消，这些情况都属于有结果的情况）
    if (regFuture.isDone()) {
        ChannelPromise promise = channel.newPromise();
        // 绑定指定的端口
        doBind0(regFuture, channel, localAddress, promise);
        return promise;
    } else {  // 处理异步操作尚未有结果的情况
        final PendingRegistrationPromise promise = new PendingRegistrationPromise(channel);
        // 为异步操作添加监听
        regFuture.addListener(new ChannelFutureListener() {
            // 若异步操作具有了结果（即完成），则触发该方法的执行
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                Throwable cause = future.cause();
                if (cause != null) { // 异步操作执行过程中出现了问题
                    promise.setFailure(cause);
                } else {  // 异步操作正常结果
                    promise.registered();
                    // 绑定指定的端口
                    doBind0(regFuture, channel, localAddress, promise);
                }
            }
        });
        return promise;
    }
}
```

首先再这里，我们先把这个方法整体的逻辑搞清楚，然后再再去研究他的每一步具体的操作，画个图，先理解这个方法做了什么：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-22.jpg)

可以在图中结合代码，找到整个 `dobind()` 的大局处理思路，然后呢，到这里我们还有很多重点细节需要继续跟进，也就是图中标记的 Tag 1、Tag 2。为了方便后面跟进去代码之后方便回来，这里以此标记，然后下面在具体分析 Tag 标记的源码：

> **补充 Tag 0 ：**
>
> ChannelPromise 与 ChannelFuture 了解。
>
> **Tag 1 ：**
>
> 异步创建、初始化channel，并将其注册到selector
>
> ```
> final ChannelFuture regFuture = initAndRegister();
> ```
>
> **Tag 2 ：**
>
> 绑定指定的端口号：
>
> ```
> doBind0(regFuture, channel, localAddress, promise);
> ```

#### 补充 Tag 0：ChannelPromise 与 ChannelFuture

ChannelPromise 是一个特殊的 ChannelFuture，是一个可修改的 ChannelFuture。内部提供了修改当前 Future 状态的方法。在 ChannelFuture 的基础上实现了设置最终状态的修改方法。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-23.jpg)

而 ChannelFuture 只可以查询当前异步操作的结果，不可以修改当前异步结果的 Future 。这里需要知道的就是 ChannelPromise 可以修改当前异步结果的状态，并且在修改状态是会触发监听器。在 `doBind` 方法中主要用于在处理异步执行一直未结束的的操作，将异步结果存在异常的时，将异常赋值给 ChannelPromise 并返回。

#### Tag 1 ：initAndRegister() 初始化并注册 Channel

先找到代码：

```
final ChannelFuture initAndRegister() {
    Channel channel = null;
    try {
        // 创建channel
        channel = channelFactory.newChannel();
        // 初始化channel
        init(channel);
    } catch (Throwable t) {
        if (channel != null) {
            channel.unsafe().closeForcibly();
            return new DefaultChannelPromise(channel, GlobalEventExecutor.INSTANCE).setFailure(t);
        }
        return new DefaultChannelPromise(new FailedChannel(), GlobalEventExecutor.INSTANCE).setFailure(t);
    }

    // 将channel注册到selector
    ChannelFuture regFuture = config().group().register(channel);
    if (regFuture.cause() != null) {
        if (channel.isRegistered()) {
            channel.close();
        } else {
            channel.unsafe().closeForcibly();
        }
    }
    return regFuture;
}
```

嗯？！代码意一看，咋就这么点，也就做了三件事，可是这三件事做的每一个都不是一句代码的可以完成的。这里我们一个一个分析，除了这三件事情，其他的也就是异常后的处理逻辑，所以主流程就是下面的三句代码，也为了跟进继续打上标记吧：

> **Tag 1.1  创建channel**channel = channelFactory.newChannel();
>
> **Tag 1.2 初始化channel**init(channel);
>
> **Tag 1.3  将channel注册到selector**ChannelFuture regFuture = config().group().register(channel);

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-24.jpg)

针对这三处，还是要一处一处分析。

##### Tag 1.1  channelFactory.newChannel()  创建 Channel

找到对应的代码：`io.netty.channel.ReflectiveChannelFactory#newChannel`

```
@Override
public T newChannel() {
    try {
        // 调用无参构造器创建channel
        return constructor.newInstance();
    } catch (Throwable t) {
        throw new ChannelException("Unable to create Channel from class " + constructor.getDeclaringClass(), t);
    }
}
```

这里为什么直接找到 ReflectiveChannelFactory ，需要提一下，在分析 ServerBootstrap与 Bootstrap 启动配置类的时候，设置 channel 的方法，跟进去可以找到针对属性 channelFactory 的赋值代码：

```
public B channel(Class<? extends C> channelClass) {
    if (channelClass == null) {
        throw new NullPointerException("channelClass");
    }
    return channelFactory(new ReflectiveChannelFactory<C>(channelClass));
}
```

可以看到这里 new 的就是 ReflectiveChannelFactory 工厂类，然后再看 ReflectiveChannelFactory 的构造：

```
public ReflectiveChannelFactory(Class<? extends T> clazz) {
    ObjectUtil.checkNotNull(clazz, "clazz");
    try {
        // 将NioServerSocketChannel的无参构造器初始化到constructor
        this.constructor = clazz.getConstructor();
    } catch (NoSuchMethodException e) {
        throw new IllegalArgumentException("Class " + StringUtil.simpleClassName(clazz) +
                                           " does not have a public non-arg constructor", e);
    }
}
```

看到的是 ReflectiveChannelFactory 在创建时初始化了 constructor 属性，将传入的 channel 类 clazz 中获取构造赋值给了 ReflectiveChannelFactory 反射工厂的 constructor 属性。

而我们再 Server  端传入的 channel 类为`NioServerSocketChannel.class` ，所以上面看的 `constructor.newInstance();` 对应的也就是 NioServerSocketChannel 的无参构造。这样我们就继续跟进 NioServerSocketChannel ：

```
// NIO中的provider，其用于创建selector与channel。并且是单例的
private static final SelectorProvider DEFAULT_SELECTOR_PROVIDER = SelectorProvider.provider();

public NioServerSocketChannel() {
    // DEFAULT_SELECTOR_PROVIDER 静态变量
    this(newSocket(DEFAULT_SELECTOR_PROVIDER));
}
```

继续跟进 `newSocket()` ：

```
private static ServerSocketChannel newSocket(SelectorProvider provider) {
    try { 
        // 创建NIO原生的channel => ServerSocketChannel
        return provider.openServerSocketChannel();
    } catch (IOException e) {
        throw new ChannelException(
            "Failed to open a server socket.", e);
    }
}
```

就是返回了一个 Java NIO 原生的 Channel，最后将 NIO 原生的Channel 包装成 NioServerSocketChannel，继续跟进 `this(newSocket(DEFAULT_SELECTOR_PROVIDER))` 找到有参构造具体代码：

```
public NioServerSocketChannel(ServerSocketChannel channel) {
    // 参数1：父channel
    // 参数2：NIO原生channel
    // 参数3：指定当前channel所关注的事件为  接受连接
    super(null, channel, SelectionKey.OP_ACCEPT);
    // 用于对channel进行配置的属性集合
    config = new NioServerSocketChannelConfig(this, javaChannel().socket());
}
```

这里主要做了两件事情，1. 调用父类构造，2. 对 channel 进行配置属性集合。

这里先说下 new NioServerSocketChannelConfig()，这部操作就是给当前 Channel 的 config 进行赋值，用来保存当前 Channel 的属性配置的集合。好了，这个说了我们继续跟主线：`super(null, channel, SelectionKey.OP_ACCEPT)`

```
// io.netty.channel.nio.AbstractNioMessageChannel#AbstractNioMessageChannel
protected AbstractNioMessageChannel(Channel parent, SelectableChannel ch, int readInterestOp) {
    super(parent, ch, readInterestOp);
}

// io.netty.channel.nio.AbstractNioChannel#AbstractNioChannel
protected AbstractNioChannel(Channel parent, SelectableChannel ch, int readInterestOp) {
    super(parent);
    // 这里的this.ch为NIO原生channel
    this.ch = ch;
    this.readInterestOp = readInterestOp;
    try {
        // NIO，非阻塞
        ch.configureBlocking(false);
    } catch (IOException e) {
        try {
            ch.close();
        } catch (IOException e2) {
            if (logger.isWarnEnabled()) {
                logger.warn(
                    "Failed to close a partially initialized socket.", e2);
            }
        }
        throw new ChannelException("Failed to enter non-blocking mode.", e);
    }
}
```

直接找到 AbstractNioChannel 父类构造，这也第一步也是调用父类构造 `super(parent);` 先记着，先看除了调用父类构造还做了什么事情：

> 1. 调用父类构造 super(parent);
> 2. 将前面创建的原生 Channel 复制给属性保存 this.ch = ch;
> 3. 当前 channel 的关注事件属性赋值 this.readInterestOp = readInterestOp;  //  SelectionKey.OP_ACCEPT 接受事件
> 4. 将 NIO 原生 Channel 设置为非阻塞 ch.configureBlocking(false);

在 AbstractNioChannel  构造中就做了这么四件事情，主要需要说的还是其调用父类构造又做了什么事情，找到代码：

```
// io.netty.channel.AbstractChannel#AbstractChannel(io.netty.channel.Channel)
protected AbstractChannel(Channel parent) {
    this.parent = parent;
    // 为channel生成id，由五部分构成
    id = newId();
    // 生成一个底层操作对象unsafe
    unsafe = newUnsafe();
    // 创建与这个channel相绑定的channelPipeline
    pipeline = newChannelPipeline();
}
```

在 AbstractChannel 构造中主要做了三件事：

> 1. 为当前 Channel 生成 id  `newId()`，感兴趣可以跟进去看看。
> 2. 生成一个底层操作对象 unsafe，用于 I/O 线程调用传输时使用，用户代码无法调用。`newUnsafe()`
> 3. 创建与这个channel相绑定的channelPipeline，这也是一个重点操作，不过在这里先不展开细说，后面会单独细跟 channelPipeline 的代码。

所以到此 **Tag 1 : initAndRegister()  ** 中的 **Tag 1.1 newChannel() ** 创建 Channel 才算跟完。针对 **Tag 1.1 newChannel()** 我们也画图简图整理下思路：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-25.jpg)

根据图，在结合上面代码的分析，最好自己再可以跟一遍代码，我想这一块的理解还是没什么问题的。到这也只是创建了 Channel。**Tag 1.1 的 Channel 创建**结束，接着跟进 **Tag 1.2 init(channel)**.

##### Tag 1.2  init(channel)  初始化 Channel

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-26.jpg)

这里我们是从 ServerBootstrap 中的doBind 进入的，所以这里直接找到 `io.netty.bootstrap.ServerBootstrap#init`

```
void init(Channel channel) throws Exception {
    // 获取serverBootstrap中的options属性
    final Map<ChannelOption<?>, Object> options = options0();
    // 将options属性设置到channel
    synchronized (options) {
        setChannelOptions(channel, options, logger);
    }

    // 获取serverBootstrap中的attrs属性
    final Map<AttributeKey<?>, Object> attrs = attrs0();
    synchronized (attrs) {
        // 遍历attrs属性
        for (Entry<AttributeKey<?>, Object> e: attrs.entrySet()) {
            @SuppressWarnings("unchecked")
            AttributeKey<Object> key = (AttributeKey<Object>) e.getKey();
            // 将当前遍历的attr初始化到channel
            channel.attr(key).set(e.getValue());
        }
    }

    // 获取channel的pipeline
    ChannelPipeline p = channel.pipeline();

    // 将serverBootstrap中所有以child开头的属性写入到局部变量，
    // 然后将它们初始化到childChannel中
    final EventLoopGroup currentChildGroup = childGroup;
    final ChannelHandler currentChildHandler = childHandler;
    final Entry<ChannelOption<?>, Object>[] currentChildOptions;
    final Entry<AttributeKey<?>, Object>[] currentChildAttrs;
    synchronized (childOptions) {
        currentChildOptions = childOptions.entrySet().toArray(newOptionArray(0));
    }
    synchronized (childAttrs) {
        currentChildAttrs = childAttrs.entrySet().toArray(newAttrArray(0));
    }

    p.addLast(new ChannelInitializer<Channel>() {
        @Override
        public void initChannel(final Channel ch) throws Exception {
            final ChannelPipeline pipeline = ch.pipeline();
            ChannelHandler handler = config.handler();
            if (handler != null) {
                pipeline.addLast(handler);
            }

            ch.eventLoop().execute(new Runnable() {
                @Override
                public void run() {
                    // 将ServerBootstrapAcceptor处理器添加到pipeline
                    // ServerBootstrapAcceptor处理器用于接收ServerBootstrap中的属性值，
                    // 我们通常称其为连接处理器
                    pipeline.addLast(new ServerBootstrapAcceptor(
                        ch, currentChildGroup, currentChildHandler, currentChildOptions, currentChildAttrs));
                }
            });
        }
    });
}
```

这里做的事情还是很多的，基本操作我在上面注释上也标注出来，还有一些需要继续跟下去的主要操作，还是先标记 **Tag** 然后继续跟下去。这里说一下这里的 options 与 attrs 属性的赋值，其实就是讲我们 ServerBootstrap 与  Bootstrap 在调用 `doBind()` 之前通过  `option()` 与 `attr()` 设置的参数值，其中 options  属性设置到了 Channel 的 config 属性中，attrs 是直接被设置在了 Channel 上的。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-27.jpg)

在设置完 options 属性与 attrs 属性时，接着获取了当前 channel 的 pipeline，接下来还是获取我们在 `doBind()` 之前设置的属性值，以 child 开头的方法 `childOption()` 与 `childAttr()` 设置的属性值。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-28.jpg)

这里使用局部变量记录了所有 Child 相关的值 `currentChildGroup, currentChildHandler, currentChildOptions, currentChildAttrs` 主要用于初始化 childChannel 的属性，`new ServerBootstrapAcceptor(ch, currentChildGroup, currentChildHandler, currentChildOptions, currentChildAttrs))` 主要是创建 连接处理器。

```
p.addLast(new ChannelInitializer<Channel>() {
        @Override
        public void initChannel(final Channel ch) throws Exception {
            final ChannelPipeline pipeline = ch.pipeline();
            ChannelHandler handler = config.handler();
            if (handler != null) {
                pipeline.addLast(handler);
            }

            ch.eventLoop().execute(new Runnable() {
                @Override
                public void run() {
                    // 将ServerBootstrapAcceptor处理器添加到pipeline
                    // ServerBootstrapAcceptor处理器用于接收ServerBootstrap中的属性值，
                    // 我们通常称其为连接处理器
                    pipeline.addLast(new ServerBootstrapAcceptor(
                        ch, currentChildGroup, currentChildHandler, currentChildOptions, currentChildAttrs));
                }
            });
        }
    });
```

> 首先这里想做的事情是：将当前 channel 的 pipeline 中绑定一个初始化处理器 ChannelInitializer ，因为是抽象类，所以需要匿名实现 initChannel方法。而这些主要的操作是处理 childGroup 里面的 channel 的初始化操作。这里我只想主要讲一下这个连接处理器 ServerBootstrapAcceptor 主要做了什么，其他的具体会在后面的 handler 和 pipeline 的时候细说。
>
> **补充：**这里因为 ServerBootstrap 服务端是对用的有两个 EventLoopGroup，在服务端，parentGroup 是用于接收客户端的连接，在 parentGroup 接收到连接之后是将只是将当前转给了 childGroup去处理后续操作，而 childGroup 是用来专门处理连接后的操作的，不关心 channel 的连接任务。**这个其实就是 Netty-Server 的 Reactor 线程池模型的处理逻辑。**

这里主要往下说一下这个连接处理器：ServerBootstrapAcceptor 。

```
ServerBootstrapAcceptor(
    final Channel channel, EventLoopGroup childGroup, ChannelHandler childHandler,
    Entry<ChannelOption<?>, Object>[] childOptions, Entry<AttributeKey<?>, Object>[] childAttrs) {
    this.childGroup = childGroup;
    this.childHandler = childHandler;
    this.childOptions = childOptions;
    this.childAttrs = childAttrs;

    // See https://github.com/netty/netty/issues/1328
    enableAutoReadTask = new Runnable() {
        @Override
        public void run() {
            channel.config().setAutoRead(true);
        }
    };
}
```

ServerBootstrapAcceptor  构造只是将 ServerBootstrap 中配置的 Child 属性设置保存下来。而这里一直说这是连接处理器，是因为当客户端连接发送到服务端时，这个处理器会接收客户端的连接并处理。主要是处理方法是 channelRead 中的实现：

```
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    // msg为客户端发送来的数据，其为NioSocketChannel，即子channel，childChannel
    final Channel child = (Channel) msg;

    // 将来自于ServerBootstrap的child开头属性初始化到childChannel中（childHandler、childOptions、childAttrs）
    child.pipeline().addLast(childHandler);
    setChannelOptions(child, childOptions, logger);
    for (Entry<AttributeKey<?>, Object> e: childAttrs) {
        child.attr((AttributeKey<Object>) e.getKey()).set(e.getValue());
    }

    try {
        // 将childChannel注册到selector 需要注意的是，这里的selector与父channel所注册的selector不是同一个
        childGroup.register(child).addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                if (!future.isSuccess()) {
                    forceClose(child, future.cause());
                }
            }
        });
    } catch (Throwable t) {
        forceClose(child, t);
    }
}
```

这里主要就做了两件事情：

> 1. 初始化 childChannel
> 2. 将成功从 client 连接过来的 channel 注册到 selector 上。

这里一直说子channel，就是因为这里注册的是两个 EventLoopGroup，在 Server 端的处理上 netty 线程模型采用“服务端监听线程”和“IO线程”分离的方式。所以这里 `channelRead` 方法就是在 client 端请求连接到 server 端时，用于将当前连接的 IO 线程绑定到 childChannel 同时注册到 ChildGroup 中的 Selector 中。线程，模型可以参考下面的图：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-29.jpg)

好了，到这里 **Tag 1.2 initChannel ** 代码也分析完了，有些关于 pipeline 、handler、selector 的部分没有细说因为后面会单独说，在这里没有直接展开。

这里也画个图：到时候将这些图在整合到一起，现在是的分析过程就像是化整为零，最后在整合到一起化零为整。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-30.jpg)

这里除了 init(channel) 方法之外，还主要说了下 ServerBootstrapAcceptor 连接处理器。其实主要是 netty-server 的线程模型与代码的结合理解。

##### Tag 1.3  config().group().register(channel)  将channel注册到selector

channle 注册到 Selector 的代码分析：

```
// 
config().group().register(channel);
```

config().group() ：这里就是 Bootstrap 的 EventLoopGroup，而这里是 Server 端的 ServerBootstrap 所以这个其实就是 parentGroup。那这里我们需要找到 register 的方法实现：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-31.jpg)

这里因为 group 是 NioEventLoopGroup，根据 NioEventLoopGroup 的继承体系就可以直接找到 实现 `io.netty.channel.MultithreadEventLoopGroup#register(io.netty.channel.Channel)`。因为只有 MultithreadEventLoopGroup 在其继承体系中。所以找到代码我们继续：

```
public ChannelFuture register(Channel channel) {
    // next() 从eventLoop数组中选择一个eventLoop
    return next().register(channel);
}
```

这里需要了解下 `next()` 方法，因为我们现在是 eventLoopGroup `next()` 就是从当前 group 中获取一个 EventLoop，然后这里在继续跟进需要找 EventLoop 继承体系中实现 register 方法的类：`SingleThreadEventLoop`

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-32.jpg)

```
public ChannelFuture register(Channel channel) {
    // 创建一个 ChannelPromise 然后注册
    return register(new DefaultChannelPromise(channel, this));
}

// ----> 这里继续调用 unsafe 的 register
public ChannelFuture register(final ChannelPromise promise) {
    ObjectUtil.checkNotNull(promise, "promise");
    promise.channel().unsafe().register(this, promise);
    return promise;
}
```

这里调用的 unsafe 的 register 方法，在初始化 eventLoop 的时候说过这个 unsafe 的初始化。是我们直接跟进：

```
io.netty.channel.AbstractChannel.AbstractUnsafe#register
@Override
public final void register(EventLoop eventLoop, final ChannelPromise promise) {
    // 对异常情况的处理
    if (eventLoop == null) {
        throw new NullPointerException("eventLoop");
    }
    if (isRegistered()) {
        promise.setFailure(new IllegalStateException("registered to an event loop already"));
        return;
    }
    if (!isCompatible(eventLoop)) {
        promise.setFailure(
            new IllegalStateException("incompatible event loop type: " + eventLoop.getClass().getName()));
        return;
    }

    // channel与eventLoop的绑定就发生在这里，
    // 需要注意，这里的eventLoop还没有绑定线程，因为这个线程还没有创建
    AbstractChannel.this.eventLoop = eventLoop;
    // 判断当前线程与eventLoop所绑定线程是否是同一个线程
    if (eventLoop.inEventLoop()) {
        register0(promise);
    } else {
        try {
            // 执行当前线程所绑定的eventLoop的execute(), 这个execute()会将参数任务写入到任务队列，并创建启动新的线程
            eventLoop.execute(new Runnable() {
                @Override
                public void run() {
                    register0(promise);
                }
            });
        } catch (Throwable t) {
            logger.warn(
                "Force-closing a channel whose registration task was not accepted by an event loop: {}",
                AbstractChannel.this, t);
            closeForcibly();
            closeFuture.setClosed();
            safeSetFailure(promise, t);
        }
    }
}
```

> AbstractUnsafe#register:
>
> 1. 首先判断当前操作是否存在异常情况。
> 2. 将 eventLoop 保存到 channel 的 eventLoop 的属性中（channel 与 eventLoop 的绑定），注意：这里的 eventLoop 里面还没有绑定 thread。
> 3. 判断 EventLoop 的 thread 是否是当前线程：eventLoop.inEventLoop()。这里断点看一下，初始化的时候这里 eventLoop 中的 thread = null。所以这里返回 false。
> 4. 执行当前线程绑定的 eventLoop 的 excute() 方法。执行传入的 runnable ，主要是做的是将参数任务写入到任务队列，并创建启动新的线程
> 5. runnable 中的 run 方法实现：register0(promise);
>
> 这里标记三个 **Tag**
>
> **Tag 1.3.1  register0(promise)** 也就是上面的第 5 步。
>
> **Tag 1.3.2  eventLoop.excute() 执行分析** 也就是上面的第 4 步。
>
> **Tag 1.3.3  eventLoop.excute() 的 run 方法执行分析 ** 也就是 **Tag 1.3.2** 最后执行起来的 run 方法

###### **Tag 1.3.1  register0(promise)**

直接跟进 `register0(promise);`

```
private void register0(ChannelPromise promise) {
    try {
        if (!promise.setUncancellable() || !ensureOpen(promise)) {
            return;
        }
        boolean firstRegistration = neverRegistered;
        doRegister();  // 绑定
        neverRegistered = false;
        registered = true;
        
        pipeline.invokeHandlerAddedIfNeeded();

        safeSetSuccess(promise);
        pipeline.fireChannelRegistered();
        
        if (isActive()) {
            if (firstRegistration) {
                pipeline.fireChannelActive();
            } else if (config().isAutoRead()) {
                beginRead();
            }
        }
    } catch (Throwable t) {
        closeForcibly();
        closeFuture.setClosed();
        safeSetFailure(promise, t);
    }
}
```

这里其他操作感兴趣的自己可以进去看看，这边我们主要看 register 流程，直接找 `doRegister();` 的绑定代码：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-33.jpg)

```
protected void doRegister() throws Exception {
    boolean selected = false;
    for (;;) {
        try {
            // 在这里进行了注册，将NIO原生channel注册到了NIO原生selector
            selectionKey = javaChannel().register(eventLoop().unwrappedSelector(), 0, this);
            return;
        } catch (CancelledKeyException e) {
            if (!selected) {
                eventLoop().selectNow();
                selected = true;
            } else {
                throw e;
            }
        }
    }
}
```

> 这里就是 channel 注册 Selector 的代码：
>
> ```
> selectionKey = javaChannel().register(eventLoop().unwrappedSelector(), 0, this)
> ```
>
> 1. javaChannel()  ：这里获取原生的 Nio Channel，跟进去可以找到这里返回的是  AbstractNioChannel#ch 的 channel。在前面 NioEventGroup 初始化的时候说过这个 NIO Channel 的初始化的过程。
> 2. 然后调用  NIO Channel  的 Regsiter 方法
> 3. Regsiter 方法中首先传入的是 unwrappedSelector 前面初始化的 selector 数组。第二个参数 0 ，就是当前监听的的事件， 0  表示不关注任何事件。为什么这里子 Channel 注册的是不关注任何事件？在前面看到的 Channel 注册一个指定的关注事件：`SelectionKey.OP_ACCEPT` 连接事件，那个 channel 是 Netty 封装的 channel，哪里监听了连接事件之后，只要关注客户端的连接，当 netty 封装的 channel 获取到连接就绪的 channel 的时候就可以拿到当前 channel 需要注册事件了，然后这个时候就可以指定 原生 NIO channel 的需要关注的事件。所以这里默认不关注任何事件就是为后续修改其需要关注指定类型的就绪事件。

到这里 `register0` 的方法说完。前面还有 EventLoop 的线程 thread 的事情没有说明白，也就是  eventLoop 的 excute() 方法执行过程做了什么，返回去找到代码：`io.netty.channel.AbstractChannel.AbstractUnsafe#register`

###### Tag 1.3.2  eventLoop.excute() 执行分析

前面还有 EventLoop 的线程 thread 的事情没有说明白，也就是  eventLoop 的 excute() 方法执行过程做了什么，返回去找到代码：`io.netty.channel.AbstractChannel.AbstractUnsafe#register`

```
// 刚刚往里面跟的是 register0 现在再说一下 execute 
eventLoop.execute(new Runnable() {
    @Override
    public void run() {
        register0(promise);
    }
});
```

往下跟，找到 `io.netty.util.concurrent.SingleThreadEventExecutor#execute`， eventLoop 的父类：

```
public void execute(Runnable task) {
    if (task == null) {
        throw new NullPointerException("task");
    }

    // 判断当前线程与eventLoop所绑定线程是否是同一个
    boolean inEventLoop = inEventLoop();
    // 将任务添加到任务队列
    addTask(task);
    if (!inEventLoop) {
        // 创建并启动一个线程
        startThread();
        if (isShutdown()) {
            boolean reject = false;
            try {
                if (removeTask(task)) {
                    reject = true;
                }
            } catch (UnsupportedOperationException e) {
            }
            if (reject) {
                reject();
            }
        }
    }

    if (!addTaskWakesUp && wakesUpForTask(task)) {
        wakeup(inEventLoop);
    }
}
```

> 首先这个参数：**Runnable task ** 其实就是刚刚我们跟过的方法 `register0`.
>
> 1. 首先判断当前 inEventLoop();  当前线程是否是 EventLoop 中的 thtrad。这里还是 false。
> 2. 将任务添加到任务队列。跟下去可以找到 `taskQueue.offer(task)` ，这里的 taskQueue 任务队列就在跟创建 eventLoop 时 newChild 中初始化创建的.

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-34.jpg)

> 1. inEventLoop = false。首先做的是：`startThread`.

继续跟进：`startThread()`

```
private void startThread() {
    // 若当前eventLoop所绑定线程尚未启动
    if (state == ST_NOT_STARTED) {
        if (STATE_UPDATER.compareAndSet(this, ST_NOT_STARTED, ST_STARTED)) {
            try {
                // 创建并启动一个线程
                doStartThread();
            } catch (Throwable cause) {
                STATE_UPDATER.set(this, ST_NOT_STARTED);
                PlatformDependent.throwException(cause);
            }
        }
    }
}
```

首先判断当前 eventLoop 所绑定线程尚未启动，然后使用 CAS 修改当前线程的启动状态 ，修改成功则执行 `doStartThread()`创建并启动一个线程，继续跟：

```
private void doStartThread() {
    assert thread == null;
    // 调用NioEventLoop所包含的executor的execute()
    // 这个execute()会创建并启动一个线程
    executor.execute(new Runnable() {
        @Override
        public void run() {
            thread = Thread.currentThread();
            if (interrupted) {
                thread.interrupt();
            }

            boolean success = false;
            updateLastExecutionTime();
            try {
                // 执行了一个不会停止的for，用于完成任务队列中的任务
                SingleThreadEventExecutor.this.run();
                success = true;
            } catch (Throwable t) {
                logger.warn("Unexpected exception from an event executor: ", t);
            } finally {
                // 省略......
        }
    });
}
```

这里调用了 NioEventLoop 所包含的 executor 的 execute() 方法，也就是创建线程的逻辑，后面的具体执行逻辑，下一步部分具体看。传入了一个 Runnable。主要是执行了一个 `SingleThreadEventExecutor.this.run();` 线程，用于完成任务队列的任务。后面说。这里主要说一下这个 `executor.execute()`执行的过程。

这里跟进下面代码可以找到之前 **子 Executor** 的初始化创建的匿名内部类：`io.netty.util.internal.ThreadExecutorMap#apply`

```
public static Executor apply(final Executor executor, final EventExecutor eventExecutor) {
    ObjectUtil.checkNotNull(executor, "executor");
    ObjectUtil.checkNotNull(eventExecutor, "eventExecutor");
    return new Executor() {
        @Override
        public void execute(final Runnable command) {
            // 这里调用了NioEventLoopGroup所包含的executor的execute()
            executor.execute(apply(command, eventExecutor));
        }
    };
}
```

所以 execute 方法执行的是这里的 `execute`方法：`executor.execute(apply(command, eventExecutor));`

而在 ThreadExecutorMap 这里的 executor 之前在 NioEventLoopGroup 初始化的时候说了，这个 executor  是 NioEventLoopGroup 初始化过成功构造方法创建的 **总 executor**。然后 apply 方法又将传入的 runnable 包装成了一个新的 Runnable 。

```
public static Runnable apply(final Runnable command, final EventExecutor eventExecutor) {
    ObjectUtil.checkNotNull(command, "command");
    ObjectUtil.checkNotNull(eventExecutor, "eventExecutor");
    return new Runnable() {
        @Override
        public void run() {
            // 做了线程隔离
            setCurrentEventExecutor(eventExecutor);
            try {
                command.run();
            } finally {
                setCurrentEventExecutor(null);
            }
        }
    };
}
```

只是在执行 command 之前做了异步线程隔离的操作。所以到这里就是  **总 executor** 执行了传入了新包装的 runnable。然后我们继续跟进这里的 `executor.execute(apply(command, eventExecutor));` execute 方法。这里需要找到实现方法在这里：`io.netty.util.concurrent.ThreadPerTaskExecutor#execute`

```
public void execute(Runnable command) {
    // 创建并启动一个线程
    threadFactory.newThread(command).start();
}
```

threadFactory 也是之前 NioEventLoopGroup 初始化的线程工厂。这里主要用到这个 **总 executor** 里面的线程工厂来创建线程来着。而这里的 command 就是 apply() 返回的 runnable，也就是包装后的 doStartThread 中的匿名内部类 runnable。所以这里的线程 `newThread(command).start()` 的 start 就执行了commnnd 的 run 方法。最后就执行到 doStartThread 的里面的 run 方法。

所以到这里 EventLoop 中的 thread 的创建并且启动就都这里处理完成了。

这里也画个图说下这个调用过程：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-35.jpg)

到这里我们的 eventLoop.excute() 中的创建线程并启动的流程看完了，那下面我们要单独说一下这个线程启动之后执行的 run 方法做了什么。主要就是详细说下 `threadFactory.newThread(command).start();` 这个线程启动执行执行的 run 代码的解析。

###### Tag 1.3.3  eventLoop.excute() 的 run 方法执行分析

入口还是从 `eventLoop.excute()` 中进去，也就是 eventLoop 的 run 方法执行分析，找到里面的匿名内部类的 runnable 的实现：

```
//  对应的代码位置 io.netty.channel.AbstractChannel.AbstractUnsafe#register
eventLoop.execute(new Runnable() {
     @Override
     public void run() {
         register0(promise);
     }
 });
```

跟进 execute() 找到 `startThread();` 在直接跟进 `doStartThread()`找到下面代码：

```
 private void doStartThread() {
        assert thread == null;
        // 调用NioEventLoop所包含的executor的execute() 这个execute()会创建并启动一个线程
        executor.execute(new Runnable() {
            @Override
            public void run() {
                thread = Thread.currentThread();
                if (interrupted) {
                    thread.interrupt();
                }

                boolean success = false;
                updateLastExecutionTime();
                try {
                    // 执行了一个不会停止的for，用于完成任务队列中的任务
                    SingleThreadEventExecutor.this.run();
                    success = true;
                } catch (Throwable t) {
                    logger.warn("Unexpected exception from an event executor: ", t);
                } finally {
               // 省略。。。
```

这段代码上面都跟过，这里就跳过直接找我们要看的代码：`SingleThreadEventExecutor.this.run();` 这里执行了一个无限循环的代码，用来一直完成任务队列中的任务：这找到实现代码 eventLoop 中的 run() ：

```
protected void run() {
    for (;;) {
        try {
            try {
                // 选择就绪的channel
                switch (selectStrategy.calculateStrategy(selectNowSupplier, hasTasks())) {
                    case SelectStrategy.CONTINUE:    // NioEventLoop不支持
                        continue;
                    case SelectStrategy.BUSY_WAIT:  // NioEventLoop不支持

                    case SelectStrategy.SELECT:  // SELECT = -1 能走到这里，说明当前任务队列中没有任务
                        // 进行阻塞式选择
                        select(wakenUp.getAndSet(false));
                        if (wakenUp.get()) {
                            selector.wakeup();
                        }
                    default:
                }
            } catch (IOException e) {
                rebuildSelector0();
                handleLoopException(e);
                continue;
            }

            cancelledKeys = 0;
            needsToSelectAgain = false;
            // 该变量用于设置“处理就绪channel的IO所使用的时间”与“处理任务队列中任务使用时间”的比例 该值为整型，不大于100
            final int ioRatio = this.ioRatio;
            if (ioRatio == 100) {
                try {
                    processSelectedKeys();
                } finally {
                    runAllTasks();
                }
            } else {
                // 记录处理就绪channel的IO开始执行的时间点
                final long ioStartTime = System.nanoTime();
                try {
                    // 处理就绪channel的IO
                    processSelectedKeys();
                } finally {
                    // 计算出处理就绪channel的IO所使用的时长
                    final long ioTime = System.nanoTime() - ioStartTime;
                    // 执行任务队列中的任务
                    runAllTasks(ioTime * (100 - ioRatio) / ioRatio);
                }
            }
            // 省略。。。
    }
}
```

> 首先我们整体上看一下这个方法。
>
> 1. selectStrategy.calculateStrategy(selectNowSupplier, hasTasks())
> 2. switch - case
> 3. processSelectedKeys()
> 4. runAllTasks()
>
> **Tag 1.3.3.1**：selectStrategy.calculateStrategy
>
> **Tag 1.3.3.2** ：switch - case
>
> **Tag 1.3.3.3** ：processSelectedKeys()
>
> **Tag 1.3.3.4** ：runAllTasks()

###### **Tag 1.3.3.1**：selectStrategy.calculateStrategy

首先找到代码：

```
selectStrategy.calculateStrategy(selectNowSupplier, hasTasks());

// hasTasks  tailTasks 收尾任务队列
protected boolean hasTasks() {
    return super.hasTasks() || !tailTasks.isEmpty();
}

// super.hasTasks()   taskQueue 普通任务队列
protected boolean hasTasks() {
    assert inEventLoop();
    return !taskQueue.isEmpty();
}
```

首先看到 `hasTask` : 返回当前任务队列和收尾队列是否有任务。`selectNowSupplier` : 匿名内部类`io.netty.util.IntSupplier`

继续跟进：calculateStrategy：`io.netty.channel.DefaultSelectStrategy#calculateStrategy` 初始化的默认选择器

```
// SelectStrategy.SELECT = -1
public int calculateStrategy(IntSupplier selectSupplier, boolean hasTasks) throws Exception {
    return hasTasks ? selectSupplier.get() : SelectStrategy.SELECT;
}
```

这里就是如果存在任务则走选择器 `selectSupplier.get()` 否则直接返回 `-1:SELECT` 。

继续跟 get 的任务选择逻辑：selectSupplier : NioEventLoop 中的内部类 IntSupplier

```
public int get() throws Exception {
    return selectNow();
}

// io.netty.channel.nio.NioEventLoop#selectNow
int selectNow() throws IOException {
    try {
        return selector.selectNow();
    } finally {
        // restore wakeup state if needed
        if (wakenUp.get()) {
            selector.wakeup();
        }
    }
}
```

> 1. selector.selectNow() : 方法为 NIO 的非阻塞选择，返回就绪的 channel 的数量，可以为 0。
>
>    补充：Selector 的阻塞选择和非阻塞选择的区别就是，非阻塞选则在当前 select 方法执行时判断循环判断所有的 channel 是否就绪并返回所有的就绪数量，而阻塞式选择则是阻塞指定时间直至阻塞时间内获取到就绪 channel 或者阻塞时间超时时立刻返回。
>
> 2. wakenUp.get() ：返回当前线程是否被阻塞，没有被阻塞时返回 true，当前线程被阻塞返回 false。
>
> 3. selector.wakeup() ：当前线程如果被阻塞，则立刻返回 selector 结果，即唤醒当前线程。
>
> 这是 selectNow() 方法执行的结果，是一个必然大于等于 0 的结果。

所以返回 `calculateStrategy` 方法：如果任务队列存在任务，则通过 Selector 执行非阻塞选择返回就绪的 channel 数量，如果不存在任务，则直接返回 -1。

###### **Tag 1.3.3.2** ：switch - case

现在在返回去看 switch - case 的代码：

```
switch (selectStrategy.calculateStrategy(selectNowSupplier, hasTasks())) {
    case SelectStrategy.CONTINUE:    // -2 NioEventLoop不支持 
        continue;

    case SelectStrategy.BUSY_WAIT:  // -3 NioEventLoop不支持
   
    case SelectStrategy.SELECT:  // -1 能走到这里，说明当前任务队列中没有任务
        // 进行阻塞式选择
        select(wakenUp.getAndSet(false));
        if (wakenUp.get()) {
            selector.wakeup();
        }
    default:
}
```

> 因为再 `selectStrategy.calculateStrategy` 方法中，不可能返回 -2 和 -3。所以 case 的结果只可能走到  SelectStrategy.SELECT 或者直接 default。而只有当所有任务队列中都没有任务的时候才会返回 -1。也就意味着当任务队列中没有任务时也会景行一次阻塞式选择，通过 `wakenUp.getAndSet(false)` 方法将当前线程设置为阻塞状态。然后就阻塞式 select。

这里我们具体去看看这 select 阻塞选择的逻辑：

```
private void select(boolean oldWakenUp) throws IOException {
    Selector selector = this.selector;
    try {
        // 计数器：用于记录空轮询导致CPU占用率飙升，select()提前结束的次数（其值大于1时）
        int selectCnt = 0;
        // 获取当前时间，也就是for循环第一次开始执行的时间点
        long currentTimeNanos = System.nanoTime();
        // delayNanos() 表示定时任务队列中第一个定时任务还有多久就到开始执行的时间了
        long selectDeadLineNanos = currentTimeNanos + delayNanos(currentTimeNanos);

        for (;;) {
            // 处理小于0.5毫秒的任务
            long timeoutMillis = (selectDeadLineNanos - currentTimeNanos + 500000L) / 1000000L;
            if (timeoutMillis <= 0) {  // 该条件为true，表示具有立即需要执行的定时任务
                if (selectCnt == 0) {  // 只有第一次for循环才会执行下面的“非阻塞选择”
                    selector.selectNow();
                    selectCnt = 1;
                }
                break;
            }

            if (hasTasks() && wakenUp.compareAndSet(false, true)) {
                selector.selectNow();
                selectCnt = 1;
                break;
            }
            
            int selectedKeys = selector.select(timeoutMillis);
            selectCnt ++;
            // 若有就绪的channel了，则直接结束
            if (selectedKeys != 0 || oldWakenUp || wakenUp.get() || hasTasks() || hasScheduledTasks()) {
                break;
            }
            // 若当前线程被中断
            if (Thread.interrupted()) {
                selectCnt = 1;
                break;
            }

            // 获取当前时间
            long time = System.nanoTime();
            // 下面的式子等价于：  time - currentTimeNanos >= timeoutMillis
            // 若下面的条件成立，则说明select()是在指定的阻塞时间过期后才跳出的，即正常结束的
            if (time - TimeUnit.MILLISECONDS.toNanos(timeoutMillis) >= currentTimeNanos) {
                // timeoutMillis elapsed without anything selected.
                selectCnt = 1;
            } else if (SELECTOR_AUTO_REBUILD_THRESHOLD > 0 &&
                       selectCnt >= SELECTOR_AUTO_REBUILD_THRESHOLD) {
                selector = selectRebuildSelector(selectCnt);  // 重构selector
                selectCnt = 1;
                break;
            }
            // 本轮for循环结束时间点，同时也是下一轮for循环的开始时间点
            currentTimeNanos = time;
        }  
    } catch (CancelledKeyException e) {
    }
}
```

这个方法直接画图解释把：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-36.jpg)

而在 switch-case 唯一的代码逻辑也就是在任务队列中没有任务时执行的阻塞 select，而在其他的任何情况下或者阻塞选择存在就绪 channel 或者任务队列新增任务之后都会跳出 switch - case，执行后续逻辑。

###### Tag 1.3.3.3 ：processSelectedKeys()

首先我要说的时这个 `processSelectedKeys` 方法时处理就绪的 channel 的 IO，而代码逻辑走到这里其实并不一定就有已经就绪的 channel，因为看了上面的逻辑会发现代码任务处理为先，而存在任务就会走到这里逻辑，虽然在走到这里之前也执行了 select 的 channel 但是也都是去查看一遍是否存在就绪 channel，所以这里看下面的逻辑需要先有这个理解，最后我们再具体看 `processSelectedKeys` 代码：

```
final int ioRatio = this.ioRatio; // 默认值 50
if (ioRatio == 100) {
    try {
        processSelectedKeys();
    } finally {
        // Ensure we always run tasks.
        runAllTasks();
    }
} else {
    // 记录处理就绪channel的IO开始执行的时间点
    final long ioStartTime = System.nanoTime();
    try {
        // 处理就绪channel的IO
        processSelectedKeys();
    } finally {
        // 计算出处理就绪channel的IO所使用的时长
        final long ioTime = System.nanoTime() - ioStartTime;
        // 执行任务队列中的任务
        runAllTasks(ioTime * (100 - ioRatio) / ioRatio);
    }
}
```

这段代码的整体逻辑再我们看完 runAllTasks 之后再分析，这里存在一个 io 处理与 task 处理的时间分配逻辑。后面再看，这里继续跟进 `processSelectedKeys`

```
private void processSelectedKeys() {
    // 判断channel的selectedKeys是否是优化过的
    if (selectedKeys != null) {
        processSelectedKeysOptimized();  // 优化处理方式
    } else {
        processSelectedKeysPlain(selector.selectedKeys());  // 普通处理方式
    }
}
```

到这里，代码有限判断了当前是否启用的 selectedKey 的优化，再 NioEventLoopGroup 的时候说过，优化就是将selectedKeys 的 set 集合转换成了数组，而再这里也可以得到验证，`selectedKeys`直接产看这个属性就可以看到，这里不进去看了，感兴趣进去看看。然后针对优化和非优化的处理唯一的区别就是处理的 `selectedKeys`对象是数组还是集合。这里直接分析 `processSelectedKeysOptimized` 方法，`processSelectedKeysPlain` 方法可以自己看，一样的处理。

```
private void processSelectedKeysOptimized() {
    for (int i = 0; i < selectedKeys.size; ++i) {
        // 从数组中取出一个元素
        final SelectionKey k = selectedKeys.keys[i];
     // 移除已经取出的 SelectionKey，使 GC 可以处理到已经关闭的 channel
        selectedKeys.keys[i] = null;
        // 获取selectionKey的附件，该附件中可以存放任意数据，不过这里存放的是NIO原生channel
        final Object a = k.attachment();

        if (a instanceof AbstractNioChannel) {
            processSelectedKey(k, (AbstractNioChannel) a);  // 处理就绪事件
        } else {
            NioTask<SelectableChannel> task = (NioTask<SelectableChannel>) a;
            processSelectedKey(k, task); // 这里是测试代码。跟进去可以看到实现方法是测试类
        }
// 省略......
```

这里就是直接轮询 selectedKeys 的集合，每取出一个 selectKey 都会在原数组中移除当前元素，就是为了当 channel 关闭后， GC 可以释放当前 channel 占用的内存。

然后获取 selectKey 中保存的 Nio 原生的 channel，处理就绪后逻辑：`processSelectedKey` 继续跟进：

```
private void processSelectedKey(SelectionKey k, AbstractNioChannel ch) {
    final AbstractNioChannel.NioUnsafe unsafe = ch.unsafe();
    // 处理selectionKey失效的情况
    if (!k.isValid()) {
        final EventLoop eventLoop;
        try {
            eventLoop = ch.eventLoop();
        } catch (Throwable ignored) {
            return;
        }
        if (eventLoop != this || eventLoop == null) {
            return;
        }
        unsafe.close(unsafe.voidPromise());
        return;
    }

    try {
        int readyOps = k.readyOps();
  // 判断当前 channnel 就绪的事件类型
        if ((readyOps & SelectionKey.OP_CONNECT) != 0) {
            // 获取当前selectionKey的interestOps
            int ops = k.interestOps();
            // 先将SelectionKey.OP_CONNECT按位取或，再与ops进行按位与
            ops &= ~SelectionKey.OP_CONNECT;
            // 将修改过的ops再写入到selectionsKey中
            k.interestOps(ops);
            // 连接server
            unsafe.finishConnect();
        }

        // 处理写就绪的情况
        if ((readyOps & SelectionKey.OP_WRITE) != 0) {
            // 强制刷新（将user buffer中的数据写入到网关缓存）
            ch.unsafe().forceFlush();
        }
        // readyOps为0表示当前没有任何channel就绪
        if ((readyOps & (SelectionKey.OP_READ | SelectionKey.OP_ACCEPT)) != 0 || readyOps == 0) {
            // 将网卡缓存中的数据写入到user buffer
            unsafe.read();
        }
    } catch (CancelledKeyException ignored) {
        unsafe.close(unsafe.voidPromise());
    }
}
```

> 这段逻辑就是处理就绪 channel 的 IO 事件的逻辑。
>
> 1. 判断当前 SelectionKey 是否有效。失效结束处理并关闭资源。
>
> 2. 判断当前 channel 的关注事件，针对处理：获取 SelectionKey 的 readyOps。这里的判断逻辑都是使用高效的位运算。readyOps 为当前 SelectionKey 的就绪的事件类型。
>
> 3. (readyOps & SelectionKey.OP_CONNECT) != 0 ：连接就绪事件
>
>    这个事件在 server 端不会关注，只有 client 用来连接 server 时才会关注连接就绪事件。
>
>    连接就绪后，获取当前 SelectionKey 的 interestOps 值，将当前 interestOps 值修改后，调用底层 unsafe 连接server
>
> 4. (readyOps & SelectionKey.OP_WRITE) != 0 ：写就绪事件
>
>    当前 channel 关注的是写就绪事件，此时写操作已经就绪，所以直接调用unsafe将数据写入的网卡缓存。
>
> 5. (readyOps & (SelectionKey.OP_READ | SelectionKey.OP_ACCEPT)) != 0 || readyOps == 0 ：当前channel 关注的是读就绪事件，或者前面因为有新增任务而触发的就绪 channel 处理逻辑，只有因为任务触发的情况下 readyOps  才可能会是 0 ，readyOps  = 0 意味着没有就绪 channel。
>
>    直接调用 unsafe 继续读操作，将网卡缓存的数据读取到用户空间。如果是 readyOps = 0 的情况相当于网卡缓存并没有就绪数据，则时进行的读操作不会读取到数据。

这就是完整的 IO 处理逻辑，主要根据当前 channel 关注的事件进行相应的 unsafe 操作。

###### **Tag 1.3.3.4** ：runAllTasks()

下面我们在看下 `runAllTask` 方法。

```
runAllTasks(ioTime * (100 - ioRatio) / ioRatio);

protected boolean runAllTasks(long timeoutNanos) {
    // 从定时任务队列中取出所有当前马上就要到期的定时任务放入到任务队列
    fetchFromScheduledTaskQueue();
    // 从任务队列中取出一个任务
    Runnable task = pollTask();
    // 若该任务为空，则说明任务队列中已经没有任务了，此时就可以执行收尾任务了
    if (task == null) {
        // 执行收尾队列中的收尾任务
        afterRunningAllTasks();
        return false;
    }

    final long deadline = ScheduledFutureTask.nanoTime() + timeoutNanos;
    // 计数器
    long runTasks = 0;
    long lastExecutionTime;
    for (;;) {
        // 执行任务
        safeExecute(task);
        runTasks ++;
        // 每64个任务查看一次超时
        if ((runTasks & 0x3F) == 0) {
            lastExecutionTime = ScheduledFutureTask.nanoTime();
            if (lastExecutionTime >= deadline) {
                break;
            }
        }

        // 从任务队列中再取出一个任务
        task = pollTask();
        if (task == null) {
            lastExecutionTime = ScheduledFutureTask.nanoTime();
            break;
        }
    } // end-for

    // 处理收尾队列中的任务
    afterRunningAllTasks();
    this.lastExecutionTime = lastExecutionTime;
    return true;
}
```

画图理解一下这个方法：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-37.jpg)

这里面有几个方法大家感兴趣可以进去看看：这部分逻辑不复杂，大家可以自己研究下。

> 1. fetchFromScheduledTaskQueue()
>
>    io.netty.util.concurrent.SingleThreadEventExecutor#fetchFromScheduledTaskQueue
>
>    从定时任务队列中取出所有当前马上就要到期的定时任务放入到任务队列
>
> 2. pollTask()
>
>    io.netty.util.concurrent.SingleThreadEventExecutor#pollTask
>
>    从任务队列中取出一个任务
>
> 3. afterRunningAllTasks()
>
>    io.netty.util.concurrent.SingleThreadEventExecutor#afterRunningAllTasks
>
>    执行收尾任务队列中的所有收尾任务
>
> 4. safeExecute(task)
>
>    io.netty.util.concurrent.AbstractEventExecutor#safeExecute
>
>    执行任务

到此我们的 channel 的 initAndRegister 介绍完成，并且介绍了 channel 就绪后的执行方法 eventLoop 的 execute 调用的 run 方法的逻辑。其实 run 方法不是说注册初始化的时候就调用的，而是通过任务或者就绪 channel 触发的，只是注册时候说到这个代码就直接跟完这个逻辑，让大家也好理解一点。

#### Tag 2  doBind0()  绑定端口号

先看一下面需要跟踪的代码在哪里，上面饶了一个圈，现在回来先看看回到哪里，不然都不知道自己是谁，自己在哪。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-38.jpg)

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-39.jpg)

找到 `doBind0`方法：

```
private static void doBind0(
    final ChannelFuture regFuture, final Channel channel,
    final SocketAddress localAddress, final ChannelPromise promise) {
    channel.eventLoop().execute(new Runnable() {
        @Override
        public void run() {
            if (regFuture.isSuccess()) {  // 只有当channel初始化注册成功后，才会进行绑定
                channel.bind(localAddress, promise).addListener(ChannelFutureListener.CLOSE_ON_FAILURE);
            } else {
                promise.setFailure(regFuture.cause());
            }
        }
    });
}
```

如果初始化失败，则直接返回失败，我们这里跟正确逻辑，直接跟 `channel.bind`方法：

```
public ChannelFuture bind(SocketAddress localAddress, ChannelPromise promise) {
    return pipeline.bind(localAddress, promise);
}
```

这里不多少直接进去，继续探索：

```
public final ChannelFuture bind(SocketAddress localAddress, ChannelPromise promise) {
    return tail.bind(localAddress, promise);
}
```

一样。继续探索：

```
public ChannelFuture bind(final SocketAddress localAddress, final ChannelPromise promise) {
    。。。。
    final AbstractChannelHandlerContext next = findContextOutbound(MASK_BIND);
    EventExecutor executor = next.executor();
    if (executor.inEventLoop()) {
        next.invokeBind(localAddress, promise);
    } else {
        safeExecute(executor, new Runnable() {
            @Override
            public void run() {
                next.invokeBind(localAddress, promise);
            }
        }, promise, null);
    }
    return promise;
}
```

这里涉及到 pipeline 的逻辑后面细说，这里我们直接去看看一下 bind 的代码：

```
private void invokeBind(SocketAddress localAddress, ChannelPromise promise) {
    if (invokeHandler()) {
        try {
            ((ChannelOutboundHandler) handler()).bind(this, localAddress, promise);
        } catch (Throwable t) {
            notifyOutboundHandlerException(t, promise);
        }
    } else {
        bind(localAddress, promise);
    }
}
```

这里找到 bind 实现：`io.netty.channel.DefaultChannelPipeline.HeadContext#bind`

```
public void bind(
    ChannelHandlerContext ctx, SocketAddress localAddress, ChannelPromise promise) {
    unsafe.bind(localAddress, promise);
}
```

继续跟进：`unsafe.bind` : `io.netty.channel.AbstractChannel.AbstractUnsafe#bind`

```
public final void bind(final SocketAddress localAddress, final ChannelPromise promise) {
    // 省略。。。

    // 获取当前channel是否被激活。注意，现在还没有被激活，所以其值为false
    boolean wasActive = isActive();
    try {
        // 绑定
        doBind(localAddress);
    } catch (Throwable t) {
        safeSetFailure(promise, t);
        closeIfClosed();
        return;
    }

    if (!wasActive && isActive()) {
        invokeLater(new Runnable() {
            @Override
            public void run() {
                pipeline.fireChannelActive();  // 触发重写的channelActivate方法的执行
            }
        });
    }
    safeSetSuccess(promise);
}
```

最终找到 AbstractUnsafe 中找到最终调用的 doBind 方法，在调用前又获取了当前 channel 是否被激活，若已经激活则触发 pipeline 的 `fireChannelActive` 方法执行。这个都在 pipeline 再具体细说。当 channel 没有被激活时才去调用 NIO 原生的channel 进行绑定。代码：

```
protected void doBind(SocketAddress localAddress) throws Exception {
    if (PlatformDependent.javaVersion() >= 7) {
        javaChannel().bind(localAddress, config.getBacklog());
    } else {
        javaChannel().socket().bind(localAddress, config.getBacklog());
    }
}
```

`javaChannel()` 即获取 NIO 原生 channel 的方法，再获取到 NIO 原生 channel 之后调用 bind 方法完成绑定。

绑定 `bind` 方法我们就先初步了解最终怎么完成绑定的，要清楚到最后完成 bind 的依然是 NIO 的 channel。关于 pipeline 也是 netty 的一块重点，后面我们再细说。

这边完整的 server 启动初始化到启动的代码我们跟完了，现在可以类比这再把 client 的代码跟一遍，不过现在再看 client 的代码，会有很多不同的理解出来也应该会有很多原来如此的理解吧。

### Client 端启动分析

上面我们跟完了 Server 端的代码初始化到启动分析，下面我们在跟下 Client 端的代码，这两部分有重复代码有相同的逻辑也有不同的地方。从启动类就可以看到他们是有区别的，但是上面理解了在看下面这个会容易很多。第一步找到代码：

```
NioEventLoopGroup eventLoopGroup = new NioEventLoopGroup();
try {
    Bootstrap bootstrap = new Bootstrap();
    bootstrap.group(eventLoopGroup)
        .channel(NioSocketChannel.class)
        .handler(new ChannelInitializer<SocketChannel>() {
            @Override
            protected void initChannel(SocketChannel ch) throws Exception {
                ChannelPipeline pipeline = ch.pipeline();
                pipeline.addLast(new StringDecoder(CharsetUtil.UTF_8));
                pipeline.addLast(new StringEncoder(CharsetUtil.UTF_8));
                pipeline.addLast(new SomeSocketClientHandler());
            }
        });

    ChannelFuture future = bootstrap.connect("localhost", 8888).sync();
    future.channel().closeFuture().sync();
} finally {
    if(eventLoopGroup != null) {
        eventLoopGroup.shutdownGracefully();
    }
}
```

> 1. 创建  NioEventLoopGroup，这个因为和 Server 端是一样的，所以这里不在分析。
> 2. 初始化 Bootstrap 启动配置类，配置启动参数，这个在上面 Server 端的 Bind 方法分析的时候，也有看到都是在哪里使用这个配置的属性的。这里也不细说。
> 3. 客户端启动，也就是：`bootstrap.connect`，这里就是与 Server 端的主要区别。在 Server 端是启动一个服务端服务，使用的是 bind 绑定当前机器的端口，对外暴露服务，而在 Client 端就是主动去连接 Server 端，与服务器建立连接。所以这里是 connect。这里我们主要跟进去看看这个方法

#### Bootstrap.connect() 分析：

先找到 Bootstrap 的代码，跟进去：

```
public ChannelFuture connect(String inetHost, int inetPort) {
    return connect(InetSocketAddress.createUnresolved(inetHost, inetPort));
}

public ChannelFuture connect(SocketAddress remoteAddress) {
    if (remoteAddress == null) {
        throw new NullPointerException("remoteAddress");
    }
    // 验证bootstrap的group、channelFactory与handler是否为空
    validate();
    // 解析并连接地址
    return doResolveAndConnect(remoteAddress, config.localAddress());
}
```

> `InetSocketAddress.createUnresolved` 将输入的连接地址和端口号保存创建创建 InetSocketAddress 对象返回。
>
> `validate()` 方法主要校验 bootstrap 的必须配置是否为空：group、channelFactory与handler是否为空。
>
> 然后调用 `doResolveAndConnect` 方法建立连接

```
private ChannelFuture doResolveAndConnect(final SocketAddress remoteAddress, final SocketAddress localAddress) {
    // 创建、初始化并注册channel
    final ChannelFuture regFuture = initAndRegister();
    final Channel channel = regFuture.channel();
    // 若channel注册完毕
    if (regFuture.isDone()) {
        if (!regFuture.isSuccess()) {
            return regFuture;
        }
        // 解析并连接server端地址
        return doResolveAndConnect0(channel, remoteAddress, localAddress, channel.newPromise());
    } else {
        final PendingRegistrationPromise promise = new PendingRegistrationPromise(channel);
        regFuture.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                Throwable cause = future.cause();
                if (cause != null) {
                    promise.setFailure(cause);
                } else {
                    promise.registered();
                    doResolveAndConnect0(channel, remoteAddress, localAddress, promise);
                }
            }
        });
        return promise;
    }
}
```

> 这段代码我想你看到之后应该很眼熟，这里如果抛开 `doResolveAndConnect0` 方法不看，其他的逻辑可以说是与 Server 端的 bind 方法跟进去看到的是一样的。首先通过异步的方式初始化并注册 channel，然后获取异步结果，判断是否异常，处理异常情况。没有异常，判断当前异步方法是否结束，如果结束根据结束的状态处理结束的逻辑，因为结束可以是正常也可以是异常结束。如果是异步结果一直没有结果，那就建立监听，监听异步结果返回时，触发最终逻辑。
>
> 这里我们也会将当前方法跟进去说一遍，但是只会细说与 Server 端不同的地方。
>
> 按照 Server 端的介绍模式，这里分成三段详细介绍
>
> **Tag 1：initAndRegister();**
>
> **Tag 2：doResolveAndConnect0(channel, remoteAddress, localAddress, promise);**

##### Tag 1：initAndRegister() 分析

```
final ChannelFuture initAndRegister() {
    Channel channel = null;
    try {
        // 创建channel
        channel = channelFactory.newChannel();
        // 初始化channel
        init(channel);
    } catch (Throwable t) {
        if (channel != null) {
            // channel can be null if newChannel crashed (eg SocketException("too many open files"))
            channel.unsafe().closeForcibly();
            // as the Channel is not registered yet we need to force the usage of the GlobalEventExecutor
            return new DefaultChannelPromise(channel, GlobalEventExecutor.INSTANCE).setFailure(t);
        }
        // as the Channel is not registered yet we need to force the usage of the GlobalEventExecutor
        return new DefaultChannelPromise(new FailedChannel(), GlobalEventExecutor.INSTANCE).setFailure(t);
    }

    // 将channel注册到selector
    ChannelFuture regFuture = config().group().register(channel);
    if (regFuture.cause() != null) {
        if (channel.isRegistered()) {
            channel.close();
        } else {
            channel.unsafe().closeForcibly();
        }
    }
        return regFuture;
    }
```

> 这里调用的 `io.netty.bootstrap.AbstractBootstrap#initAndRegister` 的方法与 Server 端调用的完全一样。我们h还是把当前方法分成三部分然后一个一个细说：
>
> **Tag 1.1：channelFactory.newChannel();**
>
> **Tag 1.2：init(channel);**
>
> **Tag 1.3：config().group().register(channel);**

###### Tag 1.1 newChannel() 分析

> 首先在这里不一样的是 Bootstrap 的启动配置类传入的 channel  是 `.channel(NioSocketChannel.class)`。而在 Server 端传入的 `NioServerSoucketChannel` 。
>
> 所以在 Client 端 channelFactory 调用的则是 NioSocketChannel 的无参构造来初始化创建 channel。所以这里直接找到 NioSocketChannel 的构造方法：

```
public NioSocketChannel() {
    // DEFAULT_SELECTOR_PROVIDER：全局唯一的provider，通过它可以创建出selector与channel
    this(DEFAULT_SELECTOR_PROVIDER);
}

// 继续跟进 this
public NioSocketChannel(SelectorProvider provider) {
    this(newSocket(provider));
}
```

> 到这里调用了 newSocket(provider) 方法。主要是创建了原生的 SocketChannel ，`provider.openSocketChannel()` 。初始化 Nio 原生的 channel 之后，就是创建 Netty 包装的 channel 的过程了。

继续往后跟：

```
public NioSocketChannel(Channel parent, SocketChannel socket) {
    super(parent, socket);
    config = new NioSocketChannelConfig(this, socket.socket());
}
```

这里的 `new NioSocketChannelConfig(this, socket.socket())` 与 Server 端一样，此处就不再跟。我们直接跟 super(parent, socket) ：点击去找到 `io.netty.channel.nio.AbstractNioByteChannel#AbstractNioByteChannel`:

```
protected AbstractNioByteChannel(Channel parent, SelectableChannel ch) {
    // 第三个参数： 指定关注事件为读事件 OP_READ
    super(parent, ch, SelectionKey.OP_READ);
}
```

这里就出现了与 Server 端不一样的地方了。不知道大家还记得在 Server 端创建 channel 的时候，指定的关注事件是什么，直接贴上代码：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-40.jpg)

当时跟 Server 端注册 channel 时关注就的是 OP_ACCEPT，而在 Client 端创建的 channel 变成了关注的事件为 OP_READ 事件，因为当 Client 连接 Server 完成时，会由 Server 端通知 Client 端连接成功，所以此时 Client 直接注册 OP_READ 使事件来监听来自 Server 的返回。

然后下面的 super 的代码与 server 端的是同一个父类 `io.netty.channel.nio.AbstractNioChannel#AbstractNioChannel` 。所以后面的代码是与 Server 端一样。如果忘了可以往上翻翻，找到 Server 端的 newChannel 方法就可以看到。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-41.jpg)

##### Tag 1.2  init(channel) 分析

上面跟完了 client 端的 channel  创建，接着就是看 channel 的初始化。同样是先找到代码：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-42.jpg)

因为这是 Client，启动类是 Bootstrap。所以找到对应方法：这也是与 Server 端的区别。

```
void init(Channel channel) throws Exception {
    ChannelPipeline p = channel.pipeline();
    // 将bootstrap中创建的ChannelInitializer处理器添加到pipeline
    p.addLast(config.handler());

    // 将bootstrap中的options初始化到channel
    final Map<ChannelOption<?>, Object> options = options0();
    synchronized (options) {
        setChannelOptions(channel, options, logger);
    }

    // 将bootstrap中的attrs初始化到channel
    final Map<AttributeKey<?>, Object> attrs = attrs0();
    synchronized (attrs) {
        for (Entry<AttributeKey<?>, Object> e: attrs.entrySet()) {
            channel.attr((AttributeKey<Object>) e.getKey()).set(e.getValue());
        }
    }
}
```

> 这里可以明显看到与 Server 端的 init 方法相比，做的事情要少很多。首先将 Bootstrap 配置传入的 handler  添加到 channel 的 pipeline 中 `p.addLast(config.handler());`。然后将 bootstrap 中配置的 attr 和 options 的属性值初始化到 channel 中。

这里稍微比较下 Client 端和 Server 端的 init 方法区别：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-43.jpg)

可以看到当时再 Server 端我们不仅处理了 ParentGroup 的属性初始化，还初始化了以 Child 开头的 ChildGroup 的属性初始化，而再 Server 端是获取 pipeline 将传入的 childHandler 再次注册成一个新的 hanndler 然后添加到当前的 pipeline 中。再 Clinet 端则是直接将配置类传入的 handler 添加到 pipeline。这就是两边主要的区别，也就是因为 Server 传入的是两个 NioEventLoopGrou 才有的处理逻辑上的区别。也就是Server 端使用的是 Reactor 线程池模型，而Client 使用的 Reactor 模型。

Netty-Client 端的 Reactor 模型：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-44.jpg)

所以因为选择模型的区别，再处理逻辑上也有区别。

##### Tag 1.3  register(channel)  分析

这部分就完全与 Server 端一致，所以这里也不再啰嗦。不明白的可以直接翻到前面就可以看到。不在赘述。

#### Tag 2：doResolveAndConnect0 分析

上面 Client 端的 channel 初始化与注册也看了一遍。下面我们继续看 `doResolveAndConnect0` 方法：`io.netty.bootstrap.Bootstrap#doResolveAndConnect0`

```
private ChannelFuture doResolveAndConnect0(final Channel channel, SocketAddress remoteAddress,
                                           final SocketAddress localAddress, final ChannelPromise promise) {
    try {
        final EventLoop eventLoop = channel.eventLoop();
        // 创建一个地址解析器，其中包含一个地址格式匹配器
        final AddressResolver<SocketAddress> resolver = this.resolver.getResolver(eventLoop);

        // 若解析器不支持该地址 或 该地址已经解析过了，则直接对该地址进行连接，
        // 返回可修改的promise，即成功了就成功，失败了则promise中有失败信息
        if (!resolver.isSupported(remoteAddress) || resolver.isResolved(remoteAddress)) {
            doConnect(remoteAddress, localAddress, promise);
            return promise;
        }
        // 以异步方式解析server地址
        final Future<SocketAddress> resolveFuture = resolver.resolve(remoteAddress);

        if (resolveFuture.isDone()) {  // 处理解析完成的情况（成功或异常）
            final Throwable resolveFailureCause = resolveFuture.cause();

            if (resolveFailureCause != null) {  // 若异步解析中出现了问题，则直接关闭channel
                channel.close();
                promise.setFailure(resolveFailureCause);
            } else {  // 处理异步解析成功的情况
                // resolveFuture.getNow() 从异步对象中获取解析结果，即解析过的地址
                doConnect(resolveFuture.getNow(), localAddress, promise);
            }
            return promise;
        }

        resolveFuture.addListener(new FutureListener<SocketAddress>() {
            @Override
            public void operationComplete(Future<SocketAddress> future) throws Exception {
                if (future.cause() != null) {
                    channel.close();
                    promise.setFailure(future.cause());
                } else {
                    doConnect(future.getNow(), localAddress, promise);
                }
            }
        });
    } catch (Throwable cause) {
        promise.tryFailure(cause);
    }
    return promise;
}
```

`doResolveAndConnect0` 方法我们直接画个图看下逻辑流程，具体的需要我们细看的时 `doConnect` 的连接方法。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-45.jpg)

下面我们继续跟 doConnect 方法：

```
private static void doConnect(
    final SocketAddress remoteAddress, final SocketAddress localAddress, final ChannelPromise connectPromise) {

    final Channel channel = connectPromise.channel();
    channel.eventLoop().execute(new Runnable() {
        @Override
        public void run() {
            if (localAddress == null) {
                channel.connect(remoteAddress, connectPromise);
            } else {
                channel.connect(remoteAddress, localAddress, connectPromise);
            }
            // 为promise添加一个异常监听器。连接过程发生异常，则关闭channel
            connectPromise.addListener(ChannelFutureListener.CLOSE_ON_FAILURE);
        }
    });
}
```

这里获取 channel 中绑定的 EventLoop 调用 execute 方法，上面关于 channel 的注册绑定流程大家还有印象没？这里调用的代码就是下面这段：`SingleThreadEventExecutor#execute`

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-46.jpg)

做的事情就是添加任务，因为当前的线程就是 eventLoop ，所以 !inEventLoop == false。在这里的逻辑只是添加任务。上面在介绍的 channel 绑定注册时候走的逻辑还有启动线程，在这里连接的时候相当于线程已经启动，这里只是添加任务，最后任务会在前面介绍的 run 方法里面执行（**Tag 1.3.3  eventLoop.excute() 的 run 方法执行分析**）。

这里就直接看这个匿名内部内的方法，继续跟 connect 方法：`io.netty.channel.AbstractChannel#connect(java.net.SocketAddress, java.net.SocketAddress, io.netty.channel.ChannelPromise)`

```
public ChannelFuture connect(SocketAddress remoteAddress, SocketAddress localAddress, ChannelPromise promise) {
    return pipeline.connect(remoteAddress, localAddress, promise);
}
```

通过 pipeline 进行连接：

```
public final ChannelFuture connect(
    SocketAddress remoteAddress, SocketAddress localAddress, ChannelPromise promise) {
    return tail.connect(remoteAddress, localAddress, promise);
}
```

pipeline 获取为节点进行调用连接：

```
public ChannelFuture connect(
    final SocketAddress remoteAddress, final SocketAddress localAddress, final ChannelPromise promise) {

    if (remoteAddress == null) {
        throw new NullPointerException("remoteAddress");
    }
    if (isNotValidPromise(promise, false)) {
        // cancelled
        return promise;
    }

    // 查找要处理该请求的处理器节点
    final AbstractChannelHandlerContext next = findContextOutbound(MASK_CONNECT);
    // 获取处理器节点的executor
    EventExecutor executor = next.executor();
    if (executor.inEventLoop()) {
        next.invokeConnect(remoteAddress, localAddress, promise);
    } else {
        safeExecute(executor, new Runnable() {
            @Override
            public void run() {
                next.invokeConnect(remoteAddress, localAddress, promise);
            }
        }, promise, null);
    }
    return promise;
}
```

这里首先 `findContextOutbound` 找到处理器节点，后面说。然后获取处理器的 EventExecutor。执行 invokeConnect。这里主要看 `invokeConnect` 连接处理：

```
private void invokeConnect(SocketAddress remoteAddress, SocketAddress localAddress, ChannelPromise promise) {
    if (invokeHandler()) {  // 判断该处理器节点中对应的处理器是否已经添加
        try {
            ((ChannelOutboundHandler) handler()).connect(this, remoteAddress, localAddress, promise);
        } catch (Throwable t) {
            notifyOutboundHandlerException(t, promise);
        }
    } else {
        connect(remoteAddress, localAddress, promise);
    }
}
```

直接继续跟`connect` 方法，这里找到的是匿名内部内 HeadContext：`io.netty.channel.DefaultChannelPipeline.HeadContext#connect`

```
public void connect(
    ChannelHandlerContext ctx,
    SocketAddress remoteAddress, SocketAddress localAddress,
    ChannelPromise promise) {
    // 连接
    unsafe.connect(remoteAddress, localAddress, promise);
}
```

获取到底层 unsafe 对象进行连接：`io.netty.channel.nio.AbstractNioChannel.AbstractNioUnsafe#connect`

```
public final void connect(
    final SocketAddress remoteAddress, final SocketAddress localAddress, final ChannelPromise promise) {
    if (!promise.setUncancellable() || !ensureOpen(promise)) {
        return;
    }
    try {
        if (connectPromise != null) {
            // Already a connect in process.
            throw new ConnectionPendingException();
        }

        boolean wasActive = isActive();
        if (doConnect(remoteAddress, localAddress)) {  // 连接            
            // 省略+......
```

这里进行连接，找到 `doConnect` 连接方法：`io.netty.channel.socket.nio.NioSocketChannel#doConnect`

```
protected boolean doConnect(SocketAddress remoteAddress, SocketAddress localAddress) throws Exception {
    if (localAddress != null) {
        doBind0(localAddress);  // 将localAddress绑定到channel
    }

    boolean success = false;
    try {
        // 连接server地址，若本次连接成功，则成功；若不成功，则当前channel的连接就绪
        boolean connected = SocketUtils.connect(javaChannel(), remoteAddress);
        if (!connected) {
            // 指定其关注的事件为  连接就绪
            selectionKey().interestOps(SelectionKey.OP_CONNECT);
        }
        success = true;
        return connected;
    } finally {
        if (!success) {
            doClose();
        }
    }
}
```

`doBind0(localAddress)` 将Client 端指定的端口号绑定到 channel，localAddress 为配置类设置的 Client 端口号。

然后进行连接，这里首先在执行时直接进行连接，如果第一次连接成功则直接返回成功，如果失败，注册 Selector 事件 OP_CONNECT ，即将当前 channel 修改为连接就绪，后续执行到 run 方法时就会再次执行连接，直到连接成功，结束当前连接就绪。

到这就是整个 Client 的启动。整体看下来可以类比 Server 端，大体流程还是差不多的。学就完了。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-47.jpg)

### Pipeline

前面说了那么学完，大家对于 Netty 执行流程，Server 端和 Client 端的启动，大家都有了很深的认识，前面也留了很大一块关于 Netty 服务启动之后的处理过程，这部分也就是前面没有说的 Pipeline 的部分知识点。下面我们就重点说说 Pipeline 。

#### Pipeline 的创建

先找到代码，Pipeline 的创建其实在前面也有看到，这个入口就在Server 端和 Client 端启动的时创建 Channel 的时候。找到代码：`io.netty.channel.AbstractChannel#AbstractChannel(io.netty.channel.Channel)`

```
protected AbstractChannel(Channel parent) {
    this.parent = parent;
    // 为channel生成id，由五部分构成
    id = newId();
    // 生成一个底层操作对象unsafe
    unsafe = newUnsafe();
    // 创建与这个channel相绑定的channelPipeline
    pipeline = newChannelPipeline();
}
```

`newChannelPipeline()` 这个就是 Pipeline 的创建入口，跟进去：

```
protected DefaultChannelPipeline newChannelPipeline() {
    return new DefaultChannelPipeline(this);
}
```

可以看到这里是直接创建了 `DefaultChannelPipeline`。直接找到构造方法：

```
protected DefaultChannelPipeline(Channel channel) {
    this.channel = ObjectUtil.checkNotNull(channel, "channel");
    succeededFuture = new SucceededChannelFuture(channel, null);
    voidPromise =  new VoidChannelPromise(channel, true);

    // 创建尾节点
    tail = new TailContext(this);
    // 创建头节点
    head = new HeadContext(this);

    // 将头尾节点连接
    head.next = tail;
    tail.prev = head;
}
```

> 1. 创建一个记录成功的 succeededFuture 。
> 2. 创建一个记录异常的 voidPromise，在 `VoidChannelPromise` 方法中创建了一个异常监听器，触发重写的 `fireExceptionCaught(cause)` 的方法执行。
> 3. 创建一个尾节点。
> 4. 创建一个头节点。
> 5. 将收尾节点关联起来。

这里我们去看看两个 TailContext 和 HeadContext。两个差不多，先看 `new TailContext(this);`.这里 TailContext 是一个内部类：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-48.jpg)

实现了 ChannelInboundHandler 处理器，是一个 InboundHandler。关于 InboundHandler 和 OutboundHandler 处理器下面单独说，这里不展开。只要知道 InboundHandler 的方法都是处理回调的方法。

这里还是看 TailContext 的构造方法。第一步调用了父类构造，然后修改节点的处理器状态，先进去看看修改节点处理器状态的方法：

```
final boolean setAddComplete() {
    for (;;) {
        int oldState = handlerState; // 获取处理器状态
        if (oldState == REMOVE_COMPLETE) { // 处理器状态为移除状态
            return false;
        }
        // 通过CAS方式将处理器状态修改为 添加完毕
        if (HANDLER_STATE_UPDATER.compareAndSet(this, oldState, ADD_COMPLETE)) {
            return true;
        }
    }
}
```

就是通过 CAS 的方式将当前节点的处理器状态修改为添加完毕。然后我们再回去跟父类构造：

```
AbstractChannelHandlerContext(DefaultChannelPipeline pipeline, EventExecutor executor,
                              String name, Class<? extends ChannelHandler> handlerClass) {
    this.name = ObjectUtil.checkNotNull(name, "name");
    this.pipeline = pipeline;
    // 每个处理器节点都会绑定一个executor
    this.executor = executor;
    // 执行标记
    this.executionMask = mask(handlerClass);
    ordered = executor == null || executor instanceof OrderedEventExecutor;
}
```

这里先是绑定 pipeline 和 executor，不过这里的 executor 传入是 null，每个处理器节点都会绑定一个 Ececutor ，如果当前处理器的 executor 为空则直接使用 channel 的 Executor 来执行当前处理器节点里的处理器方法。

这里我们跟进去看下 `mask(handlerClass)` 方法：

```
static int mask(Class<? extends ChannelHandler> clazz) {
    // 从缓存中尝试着获取标记
    Map<Class<? extends ChannelHandler>, Integer> cache = MASKS.get();
    Integer mask = cache.get(clazz);
    if (mask == null) {
        // 创建一个标记
        mask = mask0(clazz);
        cache.put(clazz, mask);
    }
    return mask;
}
```

可以看到这个方法是一个静态的，首先从缓存中获取标记数据，获取不到为当前处理器类创建缓存标记：`mask0(clazz)`:

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-49.jpg)

这是充分使用了**二进制的开关的性质**，这里方法的作用就是将所有的 InboundHandler 处理器和 OutboundHandler 处理器中定义的方法进行标记，如果其中的方法被实现了，并且方法中没有 `@Skip` 注解，则当前方法对应的二进制位的值是 1，当当前标记位等于 1 时，则标记当前方法时需要执行的。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-50.jpg)

其实这里在 TailContext 和 HeadContext 中所有的标记位都是 1，因为 TailContext 和 HeadContext 分别都实现了 InboundHandler  和 OutboundHandler 接口中的接口。这里说这个主要因为这里在我们自定义的处理器时就会使用到。扎到一个自定义的处理器：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-51.jpg)

我们没有直接实现自 InboundHandler，而是直接继承了 ChannelInboundHandlerAdapter ，大家可以进去看看，在 ChannelInboundHandlerAdapter 中每一个实现方法上都有一个  `@Skip` 注解，而且它默认实现了所有的 InboundHandler 接口的方法，就是为了我们在定义自定义处理器减少一些默认实现的处理，而且为了性能在初始化时将所有的方法打上标记，保证只执行我们自己实现的方法，这就是这个标记的用处。这里 `mask` 处理的都是 InboundHandler  和 OutboundHandler 处理器中的接口方法。

好了到这里 TailContext 节点创建完成，我们接着看 HeadContext 节点：

```
// 头节点既是inbound处理器，也是outbound处理器
final class HeadContext extends AbstractChannelHandlerContext
            implements ChannelOutboundHandler, ChannelInboundHandler {

        private final Unsafe unsafe;

        HeadContext(DefaultChannelPipeline pipeline) {
            super(pipeline, null, HEAD_NAME, HeadContext.class);
            unsafe = pipeline.channel().unsafe();
            setAddComplete();
        }
        // 。。。。
```

HeadContext  也是内部类，这里与 TailContext 不同的是，HeadContext  同时实现了 InboundHandler  和 OutboundHandler。并且创建了一个用于底层 IO 处理的 unsafe 对象。到这里 Pipeline 的初始化创建看完了，可以看到 Pipeline 在 Channel 的创建的时初始化创建的。

下面说一下一个特殊的处理器，前面也是一直看到：`ChannelInitializer`处理器。

#### ChannelInitializer 处理器节点

先看下类图：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-52.jpg)

ChannelInitializer 继承于 ChannelInboundHandler 接口，是一个抽象类，定义了一个抽象方法：

```
protected abstract void initChannel(C ch) throws Exception;
```

以 Server 端为例，我们在使用 ChannelInitializer 时都需要实现 `initChannel` 方法：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-53.jpg)

在 ServerBootstrap 中 `io.netty.bootstrap.ServerBootstrap#init` 方法中可以找到代码：

```
p.addLast(new ChannelInitializer<Channel>() {
    @Override
    public void initChannel(final Channel ch) throws Exception {
        final ChannelPipeline pipeline = ch.pipeline();
        ChannelHandler handler = config.handler();
        if (handler != null) {
            pipeline.addLast(handler);
        }

        ch.eventLoop().execute(new Runnable() {
            @Override
            public void run() {
                pipeline.addLast(new ServerBootstrapAcceptor(
                    ch, currentChildGroup, currentChildHandler, currentChildOptions, currentChildAttrs));
            }
        });
    }
});
```

负责在 accept 新连接的 Channel 的 pipeline 被添加了一个 ChannelInitializer，由于此时这个 Channel 还没有被注册到EventLoop，于是在 addLast 方法的调用链中，会给 pipeline 添加一个 `PendingHandlerAddedTask` ，其目的是在 Channel被注册到 EventLoop 的时候，触发一个回调事件然后在 `AbstractBootstrap.initAndRegister()` 方法中，这个Channel会被注册到 ParentEventLoopGoup，接着会被注册到 ParentEventLoopGoup 中的某一个具体的 EventLoop 然后在AbstractChannel.register0() 方法中，之前注册的 PendingHandlerAddedTask 会被调用，经过一系列调用之后，最终 `ChannelInitializer.handleAdded()` 方法会被触发。所以我们进去看 `ChannelInitializer.handleAdded()` 方法:

```
// 当前处理器所封装的处理器节点被添加到pipeline后就会触发该方法的执行
public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
    if (ctx.channel().isRegistered()) {  // 若channel已经完成了注册
        if (initChannel(ctx)) {
            // 将当前处理器节点从initMap集合中删除
            removeState(ctx);
        }
    }
}
```

可以看到 ChannelInitializer 的方法触发时必须在 Channel 注册完成之后，然后开始执行 initChannel 方法，在初始化操作完成之后又将当前处理器节点从 initMap 集合中移除。现在先看看 initChannel 方法：

```
private boolean initChannel(ChannelHandlerContext ctx) throws Exception {
    // 将当前处理器节点添加到initMap集合中
    if (initMap.add(ctx)) { // Guard against re-entrance.
        try {
            // 调用重写的initChannel()
            initChannel((C) ctx.channel());
        } catch (Throwable cause) {
            exceptionCaught(ctx, cause);
        } finally {
            // 立即将该处理器节点从pipeline上删除
            ChannelPipeline pipeline = ctx.pipeline();
            // 查找在pipeline中是否存在当前处理器
            if (pipeline.context(this) != null) {
                // 将当前处理器节点从pipeline中删除
                pipeline.remove(this);
            }
        }
        return true;
    }
    return false;
}
```

在 `initChannel` 方法中，先将当前处理器节点添加到 initMap 中，然后调用抽象方法 `initChannel` ，由此调用到抽象类的实现方法，也就是在前面 Server 端代码中我们初始化 childHandler 时添加的实现方法，不过 ChannelInitializer 在 Netty 自己的代码中也有多处使用，上面说的 Server 端启动初始化的时候在 init 方法中也就有使用。不过我们自己定义的可以回顾一下：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-54.jpg)

在 Server 端 ServerBootstrap 中我们使用 ChannelInitializer 给 pipeline 中添加处理器节点。

再回到 `initChannel` 方法。继续看再其执行完重新的 `initChannel` 方法之后必然执行 finally 的代码，首先获取当前Pipeline，`pipeline.context(this)` 从 Pieline 查找但其处理器节点是否存在。存在然后 `pipeline.remove(this)` 将其从当前 Pipeline 中移除。

感兴趣可以看下，`pipeline.context` 方法和 `pipeline.remove` 方法，因为 Pipeline 中的处理器节点 时链表形式保存的，所以在这两个方法方法的处理就是链表的查找和删除。

看到这里可以发现 ChannelInitializer 的主要目的是为程序员提供了一个简单的工具，用于在某个 Channel 注册到EventLoop 后，对这个 Channel 执行一些初始化操作。ChannelInitializer 虽然会在一开始会被注册到 Channel 相关的pipeline 里，但是在初始化完成之后，ChannelInitializer 会将自己从pipeline中移除，不会影响后续的操作。刚刚看到的 `pipeline.remove` 就是将当前处理器节点从 pipeline 移除的方法，而在执行完 `initChannel` 方法后，在 `handlerAdded` 方法中又将添加到 `initMap` 中的处理器节点也移除了。

#### Hanndler 添加到 Pipeline

上面说了 ChannelInitializer  处理器节点，看到我们在重写 initChannel 方法时调用的都有 pipeline 新增处理器方法，也就是 `addLast` 方法，这里我们详细看看 addLast 怎么将处理器添加到 pipeline 的：

```
io.netty.channel.DefaultChannelPipeline#addLast(io.netty.channel.ChannelHandler...)
public final ChannelPipeline addLast(ChannelHandler... handlers) {
    // 第一个参数为group，其值默认为null
    return addLast(null, handlers);
}
```

前面说过，每个 Pipeline 都有一个 EventLoop 绑定，这里添加方法默认传入一个 EventLoopGroup 参数，不过这里传了空；继续往下跟：

```
@Override
public final ChannelPipeline addLast(EventExecutorGroup executor, ChannelHandler... handlers) {
    if (handlers == null) {
        throw new NullPointerException("handlers");
    }
    // 遍历所有handlers，逐个添加到pipeline
    for (ChannelHandler h: handlers) {
        if (h == null) {
            break;
        }
        addLast(executor, null, h);// 这里第二个参数是处理器name
    }
    return this;
}
```

遍历传入参数，将 Handler 循环添加到 Pipeline 中：

```
public final ChannelPipeline addLast(EventExecutorGroup group, String name, ChannelHandler handler) {
    final AbstractChannelHandlerContext newCtx;
    synchronized (this) {
        // 检测处理器是否被多次添加
        checkMultiplicity(handler);

        // 将处理器包装为一个节点 filterName() 获取到节点的名称
        newCtx = newContext(group, filterName(name, handler), handler);

        // 将新的节点添加到pipeline
        addLast0(newCtx);
        
        if (!registered) {
            newCtx.setAddPending();
            callHandlerCallbackLater(newCtx, true);
            return this;
        }

        // 获取新建节点绑定的eventLoop
        EventExecutor executor = newCtx.executor();
        // 若该eventLoop绑定的线程与当前线程不是同一个，则执行下面的代码
        if (!executor.inEventLoop()) {
            callHandlerAddedInEventLoop(newCtx, executor);
            return this;
        }
    }
    // 若该eventLoop绑定的线程与当前线程是同一个线程，
    // 则调用重写的handlerAdded()方法
    callHandlerAdded0(newCtx);
    return this;
}
```

> 1. 校验当前处理器是否被多次添加，没有被 @Sharable 注解标注的处理器只可以被添加一次。
> 2. 将处理器包装一个新的节点 `newContext(group, filterName(name, handler), handler)`
> 3. 将新的节点添加到 Pipeline 中。`addLast0(newCtx)`
> 4. 判断 channel 没有注册，处理异常情况。`callHandlerCallbackLater(newCtx, true)`
> 5. 获取新节点的 EventLoop ，判断是否是当前线程，如果不是当前线程执行 `callHandlerAddedInEventLoop(newCtx, executor)`
> 6. 新节点的 EventLoop 是当前线程执行 `callHandlerAdded0(newCtx)`
>
> 这里我们标记几个需要往下细跟的代码：
>
> **Tag Handler 1 ：newContext**
>
> **Tag Handler 2 ：addLast0**
>
> **Tag Handler 3  callHandlerCallbackLater/callHandlerAdded0**

##### Tag Handler 1 ：newContext

这里处理还是比较复杂，我们具体进去看：

```
private AbstractChannelHandlerContext newContext(EventExecutorGroup group, String name, ChannelHandler handler) {
    // childExecutor() 获取与当前处理器节点相绑定的eventLoop
    return new DefaultChannelHandlerContext(this, childExecutor(group), name, handler);
}
```

首先这里我们传入的 group 是 null ，前面一直没有传，这里调用 `childExecutor(group)` 直接跟进去：

```
private EventExecutor childExecutor(EventExecutorGroup group) {
    // 若group为null，则与该节点绑定的eventLoop为null
    if (group == null) {
        return null;
    }
    
    Boolean pinEventExecutor = channel.config().getOption(ChannelOption.SINGLE_EVENTEXECUTOR_PER_GROUP);
    if (pinEventExecutor != null && !pinEventExecutor) {
        return group.next();
    }

    Map<EventExecutorGroup, EventExecutor> childExecutors = this.childExecutors;
    if (childExecutors == null) {
        childExecutors = this.childExecutors = new IdentityHashMap<EventExecutorGroup, EventExecutor>(4);
    }
    EventExecutor childExecutor = childExecutors.get(group);
    if (childExecutor == null) {
        childExecutor = group.next();
        childExecutors.put(group, childExecutor);
    }
    return childExecutor;
}
```

其实在我们没有指定 Group 的时候，这里代码是被直接返回了出去，下面执行逻辑就没有执行，而此时节点的 EventLoop 是在 `EventExecutor executor = newCtx.executor();` 中绑定的：

```
public EventExecutor executor() {
    if (executor == null) {
        return channel().eventLoop();  // 获取到channel所绑定的eventLoop
    } else {
        return executor;
    }
}
```

在新节点获取当前节点绑定的 Executor 时如果未绑定，则直接获取当前 Channle 的 eventLoop 。这里再回去看 `childExecutor` 方法，如果要走到下面逻辑则需要到添加 Handler 时传入一个 EventLoopGroup：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-55.jpg)

好了，这样我们的 Group 就不为 null。继续看 childExecutor 下面的逻辑：

```
private EventExecutor childExecutor(EventExecutorGroup group) {
    if (group == null) {
        return null;
    }

    Boolean pinEventExecutor = channel.config().getOption(ChannelOption.SINGLE_EVENTEXECUTOR_PER_GROUP);
    if (pinEventExecutor != null && !pinEventExecutor) {
        // 轮询获取 eventLoop
        return group.next();
    }

    Map<EventExecutorGroup, EventExecutor> childExecutors = this.childExecutors;
    if (childExecutors == null) {
        childExecutors = this.childExecutors = new IdentityHashMap<EventExecutorGroup, EventExecutor>(4);
    }

    EventExecutor childExecutor = childExecutors.get(group);
    if (childExecutor == null) {
        childExecutor = group.next();
        childExecutors.put(group, childExecutor);
    }
    return childExecutor;
}
```

> 1. 获取 channel 的 option 配置的 `SINGLE_EVENTEXECUTOR_PER_GROUP` 值。用来配置当前处理器节点是否绑定使用同一个 EventLoop。不为空并且是 False : 则表示一个group中的每一个处理器都会分配一个 eventLoop，调用 EventLoopGroup 的 `next` 方法，而 `next` 是轮询的方式从 Group 中选取 EventLoop。
> 2. 没有配置使用同一个 eventLoop 则先获取缓存中保存的 EventLoopGroup 对应的 eventLoop，如果缓存中存在则直接返回，如果缓存中不存在则从 EventLoopGroup 获取一个 eventLoop，保存到缓存中并返回。

这就是创建处理器节点中绑定 EventLoop 的方法。所以到这可以看到处理器节点的 EventLoop 可以指定，不指定则直接使用当前 channel 的 EventLoop 。拿到 EventLoop  之后则直接创建处理器节点 `new DefaultChannelHandlerContext`

##### Tag Handler 2 ：addLast0.

这里直接找到代码跟进去：

```
private void addLast0(AbstractChannelHandlerContext newCtx) {
    AbstractChannelHandlerContext prev = tail.prev;
    newCtx.prev = prev;
    newCtx.next = tail;
    prev.next = newCtx;
    tail.prev = newCtx;
}
```

这就是一个链表操作，先获取到当前 Pipeline 的 TailContext 节点，因为这里是我们从 `addLast` 方法跟进来的，所以这里是添加在尾节点前，也就是末尾添加。同样类比其他的 Handler 添加方法 `addBefore`。这里获取到 Tail 节点，将链表收尾关联到新的节点上，完成链表的新增即完成新节点添加。

##### Tag Handler 3  callHandlerCallbackLater/callHandlerAdded0

直接跟 `callHandlerCallbackLater`方法：

```
private void callHandlerAddedInEventLoop(final AbstractChannelHandlerContext newCtx, EventExecutor executor) {
    newCtx.setAddPending(); // 将当前节点状态设置成处理中，等待 callHandlerAdded0 执行完成
    executor.execute(new Runnable() {
        @Override
        public void run() {
            callHandlerAdded0(newCtx);
        }
    });
}
```

可以看到这个方法也是调用的 `callHandlerAdded0` 方法，只不过因为当前节点绑定的 EventLoop 不是当前执行线程，所以需要通过 EventLoop 创建一个新的任务，由任务来完成 `callHandlerAdded0` 方法的执行，而是当前线程则直接执行 `callHandlerAdded0` 方法。继续看 `callHandlerAdded0` 方法：

```
private void callHandlerAdded0(final AbstractChannelHandlerContext ctx) {
    try {
        ctx.callHandlerAdded();
    } catch (Throwable t) {
        boolean removed = false;
        try {
            remove0(ctx);
            ctx.callHandlerRemoved();
            removed = true;
        } catch (Throwable t2) {
            if (logger.isWarnEnabled()) {
                logger.warn("Failed to remove a handler: " + ctx.name(), t2);
            }
        }

        if (removed) {
            fireExceptionCaught(new ChannelPipelineException(
                ctx.handler().getClass().getName() +
                ".handlerAdded() has thrown an exception; removed.", t));
        } else {
            fireExceptionCaught(new ChannelPipelineException(
                ctx.handler().getClass().getName() +
                ".handlerAdded() has thrown an exception; also failed to remove.", t));
        }
    }
}
```

这里直接调用当前处理器的 `callHandlerAdded` 方法，如果异常则将资源移除。进到 `callHandlerAdded` 方法中：

```
final void callHandlerAdded() throws Exception {
    if (setAddComplete()) { // CAS 方式将处理器状态修改为 添加完毕 ADD_COMPLETE
        handler().handlerAdded(this);
    }
}
```

先通过 CAS 修改处理器状态为添加完成，状态修改成功则调用处理器的添加方法完成处理器添加。

到这里处理器的添加完成。添加处理器方法画个图再回顾一下：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-56.jpg)

说到这里，pipeline 的初始化到 Pipeline 中添加 Handler 。那到这里我们在整体的理解下 Pipeline：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-57.jpg)

现在在结合这个图去理解一下 Pipeline 的创建和添加的过程应该心里面会有点不一样认知。当然说到这里还是没有说到 Pipeline 的执行顺序，下面我们从 InboundHandler 处理器和 OutboundHandler 处理器来说 Pipeline 的执行过程。

### Pipeline 中消息的传递与处理

要说 Pipeline 的中的消息处理，首先还是先说下我们的 Handler，因为 Pipeline 中的消息都是由每一个处理器来完成处理的。

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-58.jpg)

ChannelHandler 是 handler 的顶级接口，我们所有的处理器都实现自该接口，当前接口只定义了两个方法：`hanndlerAdded` 和 `handlerRemoved`，用于当前处理器被从 Pipeline 中添加或移除时调用的方法，还有一个过时的处理异常的方法：`exceptionCaught`。

再说 ChannelHandler  两个子类接口：`ChannelInboundHandler` 和 `ChannelOutboundHandler` 这两个接口将处理器方法定义成了两类，`ChannelInboundHandler` 定义了所有的用于处理回调的方法，都是需要出动触发的方法。`ChannelOutboundHandler` 定义的所有的用于主动调用的处理器方法，需要主动调用。

而 `ChannelHandlerAdapter` 则是处理器适配器顶级抽象类，用于定义处理器适配器的规范。

`ChannelInboundHandlerAdapter` 和 `ChannelOutboundHandlerAdapter` 处理器适配器中它帮我们默认实现了所有的 handler 的方法，并且每个方法上面都标记了 `@Skip` 注解，在前面也看到，被标记 `@Skip` 注解的 Handler 方法会被标记，不会被 Handler 执行，这让我们再使用适配器之定义处理器时只要重写我们关心方法即可，重写的方法不会标记 `@Skip` 。

还有一个重要的类需要说下：`ChannelHandlerContext`，上下文对象，每个 Handler 每个方法都需要传递上下文对象，再 Pipeline 中处理器的调用就是通过 `ChannelHandlerContext` 上下文对象完成执行链的调用，也可以用来保存上下文数据。

下面就说重点，Pipeline 中 handler 的执行过程。先定义一个处理器：

> 1. InboundHandler1
>
> 只实现 `channelRead` 方法
>
> ```
> @Override
> public void channelRead(ChannelHandlerContext ctx, Object msg)
>     throws Exception {
>     System.out.println("InboundHandler1 进入 " + msg);
>     ctx.fireChannelRead(msg);
>     System.out.println("InboundHandler1 退出 " + msg);
> }
> ```
>
> 1. InboundHandler2
>
> 只实现 `channelRead` 方法
>
> ```
> @Override
> public void channelRead(ChannelHandlerContext ctx, Object msg)
>     throws Exception {
>     System.out.println("InboundHandler2 进入 " + msg);
>     ctx.fireChannelRead(msg);
>     System.out.println("InboundHandler2 退出 " + msg);
> }
> ```
>
> 1. InboundHandler3
>
> 只实现 `channelRead` 方法
>
> ```
> @Override
> public void channelRead(ChannelHandlerContext ctx, Object msg)
>     throws Exception {
>     System.out.println("InboundHandler3 进入 " + msg);
>     ctx.fireChannelRead(msg);
>     System.out.println("InboundHandler3 退出 " + msg);
> }
> ```
>
> 1. OutboundHandler1
>
> 只实现 `write` 方法
>
> ```
> @Override
> public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise)
>         throws Exception {
>     System.out.println("OutboundHandler1 进入 " + msg);
>     ctx.write(msg, promise);
>     System.out.println("OutboundHandler1 退出 " + msg);
> }
> ```
>
> 1. OutboundHandler2
>
> 只实现 `write` 方法
>
> ```
> @Override
> public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise)
>         throws Exception {
>     System.out.println("OutboundHandler2 进入 " + msg);
>     ctx.write(msg, promise);
>     System.out.println("OutboundHandler2 退出 " + msg);
> }
> ```
>
> 1. OutboundHandler3
>
> 只实现 `write` 方法
>
> ```
> @Override
> public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise)
>         throws Exception {
>     System.out.println("OutboundHandler3 进入 " + msg);
>     ctx.write(msg, promise);
>     System.out.println("OutboundHandler3 退出 " + msg);
> }
> ```

#### InboundHandler 执行流程

添加三个 `InboundHandler`处理器，添加顺序为：

**InboundHandler1  ->  InboundHandler2 ->  InboundHandler3**

添加完成后 Pipeline 如图：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-59.jpg)

此时请求过，Handler 在 Pipeline 的执行流程：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-60.jpg)

当 client 请求到 Server 并写入数据时，触发 Server 端 Head 节点的 `channelRead` 方法，此时调用链开始执行，Head 节点执行 `channelRead` 方法调用 `fireChannelRead` 触发 next 节点的 `channelRead` 方法执行，不过这里会先判断 next 节点的方法标记也就是 mask 是否标记当前 Handler  是否需要执行 `channelRead` 方法，如果重写则调用，否则继续找 next 的 next 节点。举个栗子：如果 handler2 没有重写 `channelRead` 方法，则调用会变成这样：

**Head -> handler1 -> handler3 -> Tail**。

所以 Pipeline 的处理器执行是由 Head 节点开始，由 Head 触发 Inbound 方法，完成调用链执行。

这里我们可以找到执行调用的代码，先看 Head 节点的 channelRead 方法：

```
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    ctx.fireChannelRead(msg);  // 准备调用其下一个节点的channelRead()
}
ctx.fireChannelRead(msg)` 进去看看如果调用下一个节点：`io.netty.channel.AbstractChannelHandlerContext#fireChannelRead
public ChannelHandlerContext fireChannelRead(final Object msg) {
    invokeChannelRead(findContextInbound(MASK_CHANNEL_READ), msg);
    return this;
}
```

这里通过 findContextInbound 方法获取下一个节点，传入的参数 `MASK_CHANNEL_READ` 用来判断当前处理器的 `channelRead` 方法是否被标记需要执行。进入 findContextInbound 方法：

```
private AbstractChannelHandlerContext findContextInbound(int mask) {
    AbstractChannelHandlerContext ctx = this;
    do {
        ctx = ctx.next;
    } while ((ctx.executionMask & mask) == 0);
    return ctx;
}
```

获取当前节点的 Next 节点，判断 Next 节点的 channelRead 方法是否需要执行，不需要则继续获取下一个，知道获取到 Tail 节点，因为 Tail 实现了所有的 InboundHandler 处理器方法。

然后执行 invokeChannelRead 方法，触发 Next 节点的 channelRead 的执行：

```
static void invokeChannelRead(final AbstractChannelHandlerContext next, Object msg) {
    final Object m = next.pipeline.touch(ObjectUtil.checkNotNull(msg, "msg"), next);
    EventExecutor executor = next.executor();
    if (executor.inEventLoop()) {
        next.invokeChannelRead(m);
    } else {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                next.invokeChannelRead(m);
            }
        });
    }
}
```

直接找到  invokeChannelRead 方法：

```
private void invokeChannelRead(Object msg) {
    if (invokeHandler()) {
        try {
            ((ChannelInboundHandler) handler()).channelRead(this, msg);
        } catch (Throwable t) {
            notifyHandlerException(t);
        }
    } else {
        fireChannelRead(msg);
    }
}
```

`invokeHandler()` 方法判断当前处理器状态是否完成，然后调用下一个节点的 channelRead 方法。

Inbound 执行过程的代码以 channelRead 为例就说到这，然后现在看着代码再结合上面的图大家应该很清楚整个执行的流程。

#### OutboundHandler 执行流程

OutboundHandler  与 InboundHandler 不一样，因为 OutboundHandler  的方法是需要我们自己调用，而不像 InboundHandler  处理器的方法是触发调用。所以在这种情况下，如果我们只添加 OutboundHandler  处理器的话，当 Client 发起请求也不会触发 OutboundHandler  的方法执行。因此我们加一个 InboundHandler 方法，用来触发 OutboundHandler 的执行。

定义 WriteInboundHandler ：重写 `channelRead` 方法

```
@Override
public void channelRead(ChannelHandlerContext ctx, Object msg)
    throws Exception {
    System.out.println("WriteInboundHandler  进入 " + msg);
    ctx.channel().write("我是 Server。");
    System.out.println("InboundHWriteInboundHandler andler3 退出 " + msg);
}
```

这里在 WriteInboundHandler 中我们获取到 Channel，然后通过 Channel 将消息写回 Clinet 端。

Hanndler 添加顺序：**WriteInboundHandler  -> OutboundHandler1 -> OutboundHandler2 -> OutboundHandler3**

添加完成后 Pipeline 如图：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-61.jpg)

而此时 client 请求到 Server 并写入数据时，一样是先触发 Head 节点的 channelRead 方法。执行流程如下：

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/netty-62.jpg)

Outbound 的处理流程与 Inbound 的流程是相反的，在 Inbound 中处理是获取 next 节点执行，而在 Outbound 节点中获取的确是 prev 节点的重写方法执行。所以这里的执行顺序会变成跟添加顺序相反的顺序执行。

> 这里首先请求进入 Server 触发 Head 节点的 channelRead 方法执行，然后再获取下一个重写了 channelRead 方法的 Inbound 处理器，找到 WirteHandler 处理器，在 WirteHandler 处理器中掉用 Channel 的 writeAndFlush 方法，找到Tail 节点实现方法，调用了 Write 方法，然后获取 Prev 节点中重写了 write 方法的处理器，找到 Outbound3，然后依次调用 Outbound2 的 write 方法和 Outbound1 的 write 方法，执行完成依次返回。

这里我们可以找到执行调用的代码：

先看 Inbound 处理器执行调用的触发过程，从 `ctx.channel().write` 的方法进入，找到 `io.netty.channel.DefaultChannelPipeline#write(java.lang.Object)`：

```
@Override
public final ChannelFuture write(Object msg) {
    return tail.write(msg);
}
```

可以看到在 Channel 中的 Write 方法直接找到 Tail 调用其重写的 Write 方法：

```
@Override
public ChannelFuture write(Object msg) {
    return write(msg, newPromise());
}
```

往下跟 write 方法：

```
private void write(Object msg, boolean flush, ChannelPromise promise) {
        ObjectUtil.checkNotNull(msg, "msg");
        try {
            if (isNotValidPromise(promise, true)) {
                ReferenceCountUtil.release(msg);
                // cancelled
                return;
            }
        } catch (RuntimeException e) {
            ReferenceCountUtil.release(msg);
            throw e;
        }
        // 查找下一个节点(prev)
        final AbstractChannelHandlerContext next = findContextOutbound(flush ?
                (MASK_WRITE | MASK_FLUSH) : MASK_WRITE);
        final Object m = pipeline.touch(msg, next);
        EventExecutor executor = next.executor();
        if (executor.inEventLoop()) {
            if (flush) {
                next.invokeWriteAndFlush(m, promise);
            } else {
                next.invokeWrite(m, promise);
            }
        } else {
            final AbstractWriteTask task;
            if (flush) {
                task = WriteAndFlushTask.newInstance(next, m, promise);
            }  else {
                task = WriteTask.newInstance(next, m, promise);
            }
            if (!safeExecute(executor, task, promise, m)) {
                task.cancel();
            }
        }
    }
```

可以看到这里先通过 `findContextOutbound` 方法获取下一个节点：

```
private AbstractChannelHandlerContext findContextOutbound(int mask) {
    AbstractChannelHandlerContext ctx = this;
    do {
        ctx = ctx.prev;
    } while ((ctx.executionMask & mask) == 0);
    return ctx;
}
```

在这里我们可以看到，Outbound 的获取顺序是获取的 prev ，并且判断该 handler 中当前方法是否标记需要执行。

获取到下一个节点之后在 wirte 方法中通过 `next.invokeWrite` 方法完成执行器链调用。当然如果我们一个 OutboundHandler 都没有定义的话，`findContextOutbound` 方法最终会获取到 Head 节点，然后执行 Head 节点 write 方法，因为我们在前面看到 HeadContext 节点同时实现了 Inboundhandler 和 OutboundHandler。这里我们去看一下 Head 节点：

```
@Override
public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) {
    unsafe.write(msg, promise);
}
```

最终在 HeadContext 中完成底层 unsafe 的 write 操作。

## 最后

至此整个 Netty 的源码应该了解的都差不多了，大家没事就可以拿出来读一下巩固一遍，脑海里再过一遍，这整个体系就在脑海中建立起来了，基本上稳了。   


 