---
title: 中间件篇-RabbitMQ消息服务器
date: 2020-08-18 22:45:53
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/rabbitmq.png
category: 中间件篇
tags: Rabbitmq
---

# 概念

RabbitMQ 是一个由 Erlang 语言开发的 AMQP 的开源实现。

AMQP :Advanced Message Queue,高级消息队列协议。它是应用层协议的一个开放标准,为面向消息的中间件设计,基于此协议的客户端与消息中间件可传递消息,并不受产品、开发语言等条件的限制。

RabbitMQ 最初起源于金融系统,用于在分布式系统中存储转发消息,在易用性、扩展性、高可用性等方面表现不俗。具体特点包括:

1.可靠性(Reliability):RabbitMQ 使用一些机制来保证可靠性,如持久化、传输确认、发布确认。

2.灵活的路由(Flexible Routing):在消息进入队列之前,通过 Exchange 来路由消息的。对于典型的路由功能,RabbitMQ 已经提供了一些内置的 Exchange 来实现。针对更复杂的路由功能,可以将多个 Exchange 绑定在一起,也通过插件机制实现自己的 Exchange 。

3. 消息集群(Clustering):多个 RabbitMQ 服务器可以组成一个集群,形成一个逻辑 Broker 。

4. 高可用(Highly Available Queues):队列可以在集群中的机器上进行镜像,使得在部分节点出问题的情况下队列仍然可用。

5.多种协议(Multi-protocol):RabbitMQ 支持多种消息队列协议,比如 STOMP、MQTT等等。

6.多语言客户端(Many Clients):RabbitMQ 几乎支持所有常用语言,比如 Java、.NET、Ruby 等等。

7.管理界面(Management UI):RabbitMQ 提供了一个易用的用户界面,使得用户可以监控和管理消息 Broker 的许多方面。

8.跟踪机制(Tracing):如果消息异常,RabbitMQ 提供了消息跟踪机制,使用者可以找出发生了什么。

9.插件机制(Plugin System):RabbitMQ 提供了许多插件,来从多方面进行扩展,也可以编写自己的插件。

# RabbitMQ 架构

 ![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/rabbitmq-sturts.png)
 
# Message

 消息,消息是不具名的,它由消息头和消息体组成。消息体是不透明的,而消息头则由一系列的可选属性组成,这些属性包括 routing-key(路由键)、priority(相对于其他消息的优先权)、delivery-mode(指出该消息可能需要持久性存储)等。

# Publisher

 1.消息的生产者,也是一个向交换器发布消息的客户端应用程序。

# Exchange(将消息路由给队列 )

 2.交换器,用来接收生产者发送的消息并将这些消息路由给服务器中的队列。

# Binding(消息队列和交换器之间的关联)

 3. 绑定,用于消息队列和交换器之间的关联。一个绑定就是基于路由键将交换器和消息队列连接起来的路由规则,所以可以将交换器理解成一个由绑定构成的路由表。

# Queue

 4.消息队列,用来保存消息直到发送给消费者。它是消息的容器,也是消息的终点。一个消息可投入一个或多个队列。消息一直在队列里面,等待消费者连接到这个队列将其取走。

# Connection
 
 5.网络连接,比如一个 TCP 连接。

# Channel

 6.信道,多路复用连接中的一条独立的双向数据流通道。信道是建立在真实的 TCP 连接内地虚拟连接,AMQP 命令都是通过信道发出去的,不管是发布消息、订阅队列还是接收消息,这些动作都是通过信道完成。因为对于操作系统来说建立和销毁 TCP 都是非常昂贵的开销,所以引入了信道的概念,以复用一条 TCP 连接。
 
# Consumer

 7.消息的消费者,表示一个从消息队列中取得消息的客户端应用程序。

# Virtual Host
 
 8.虚拟主机,表示一批交换器、消息队列和相关对象。虚拟主机是共享相同的身份认证和加密环境的独立服务器域。

# Broker

 9.表示消息队列服务器实体。

# Exchange 类型

 Exchange 分发消息时根据类型的不同分发策略有区别,目前共四种类型:direct、fanout、topic、headers 。headers 匹配 AMQP 消息的 header 而不是路由键,此外 headers 交换器和direct 交换器完全一致,但性能差很多,目前几乎用不到了,所以直接看另外三种类型:

# Direct 键(routing key)分布:
 
 1.Direct:消息中的路由键(routing key)如果和 Binding 中的 binding key 一致,交换器就将消息发到对应的队列中。它是完全匹配、单播的模式。
 
  ![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/direct-exchange.png)
  
# Fanout(广播分发)
  
 2.Fanout:每个发到 fanout 类型交换器的消息都会分到所有绑定的队列上去。很像子网广播,每台子网内的主机都获得了一份复制的消息。fanout 类型转发消息是最快的。
  
  ![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/fanout-exchange.png)
  
# topic 交换器(模式匹配)

 3.topic 交换器:topic 交换器通过模式匹配分配消息的路由键属性,将路由键和某个模式进行匹配,此时队列需要绑定到一个模式上。它将路由键和绑定键的字符串切分成单词,这些单词之间用点隔开。它同样也会识别两个通配符:符号“#”和符号“”。#匹配 0 个或多个单词,匹配不多不少一个单词。

  ![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/topic-exchange.png)   


 