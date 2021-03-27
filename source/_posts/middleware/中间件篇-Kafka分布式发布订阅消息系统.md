---
title: 中间件篇-Kafka分布式发布订阅消息系统
date: 2021-03-20 23:02:58
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/kafka.jpeg
category: 框架
tags: kafka
---
# Kafka 概念

Kafka 是一种高吞吐量、分布式、基于发布/订阅的消息系统,最初由 LinkedIn 公司开发,使用Scala 语言编写,目前是 Apache 的开源项目。

1. `Broker`: Kafka 服务器,负责消息存储和转发

2. `Topic`: 消息类别,Kafka 按照 topic 来分类消息

3. `Partition`: topic 的分区,一个 topic 可以包含多个 partition,topic 消息保存在各个partition 上

4. `Offset`: 消息在日志中的位置,可以理解是消息在 partition 上的偏移量,也是代表该消息的唯一序号

5. `Producer`: 消息生产者

6. `Consumer`: 消息消费者

7. `Consumer` Group: 消费者分组,每个 Consumer 必须属于一个 group

8. `Zookeeper`: 保存着集群 broker、topic、partition 等 meta 数据;另外,还负责 broker 故障发现,partition leader 选举,负载均衡等功能


 ![kafka](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/kafka.png)

# Kafka 数据存储设计

## partition 的数据文件( offset,MessageSize,data )

partition 中的每条 Message 包含了以下三个属性:offset,MessageSize,data,其中 offset 表示 Message 在这个 partition 中的偏移量,offset 不是该 Message 在 partition 数据文件中的实

际存储位置,而是逻辑上一个值,它唯一确定了 partition 中的一条 Message,可以认为 offset 是partition 中 Message 的 id;MessageSize 表示消息内容 data 的大小;data 为 Message 的具体内容。

## 数据文件分段 segment(顺序读写、分段命令、二分查找)

partition 物理上由多个 segment 文件组成,每个 segment 大小相等,顺序读写。每个 segment数据文件以该段中最小的 offset 命名,文件扩展名为.log。这样在查找指定 offset 的 Message 的时候,用二分查找就可以定位到该 Message 在哪个 segment 数据文件中。


## 数据文件索引(分段索引、稀疏存储)

Kafka 为每个分段后的数据文件建立了索引文件,文件名与数据文件的名字是一样的,只是文件扩展名为.index。index 文件中并没有为数据文件中的每条 Message 建立索引,而是采用了稀疏存储的方式,每隔一定字节的数据建立一条索引。这样避免了索引文件占用过多的空间,从而可以将索引文件保留在内存中。

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/kafka-data-file-index.png)

生产者设计

负载均衡(partition 会均衡分布到不同 broker 上)

由于消息 topic 由多个 partition 组成,且 partition 会均衡分布到不同 broker 上,因此,为了有效利用 broker 集群的性能,提高消息的吞吐量,producer 可以通过随机或者 hash 等方式,将消息平均发送到多个 partition 上,以实现负载均衡。

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/kafka-loadblance.png)

## 批量发送

是提高消息吞吐量重要的方式,Producer 端可以在内存中合并多条消息后,以一次请求的方式发送了批量的消息给 broker,从而大大减少 broker 存储消息的 IO 操作次数。但也一定程度上影响了消息的实时性,相当于以时延代价,换取更好的吞吐量。

## 压缩( GZIP 或 Snappy )

Producer 端可以通过 GZIP 或 Snappy 格式对消息集合进行压缩。Producer 端进行压缩之后,在Consumer 端需进行解压。压缩的好处就是减少传输的数据量,减轻对网络传输的压力,在对大数据处理上,瓶颈往往体现在网络上而不是 CPU(压缩和解压会耗掉部分 CPU 资源)。

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/kafka-gzip.png)

## Consumer Group
同一 Consumer Group 中的多个 Consumer 实例,不同时消费同一个 partition,等效于队列模式。partition 内消息是有序的,Consumer 通过 pull 方式消费消息。Kafka 不删除已消费的消息对于 partition,顺序读写磁盘数据,以时间复杂度 O(1)方式提供消息持久化能力。

# 快速开始

1.下载Kafka

```shell
wget https://mirrors.bfsu.edu.cn/apache/kafka/2.7.0/kafka_2.13-2.7.0.tgz
```

2.进行解压

```shell
tar -zxvf kafka_2.13-2.7.0.tgz
```

3.启动zk

```bash
bin/zookeeper-server-start.sh config/zookeeper.properties
```

4.启动kafka

```bash
bin/kafka-server-start.sh config/server.properties
```

5.创建Topic

[STEP 3: CREATE A TOPIC TO STORE YOUR EVENTS](http://kafka.apache.org/quickstart#quickstart_createtopic)

Kafka is a distributed *event streaming platform* that lets you read, write, store, and process [*events*](http://kafka.apache.org/documentation/#messages) (also called *records* or *messages* in the documentation) across many machines.

Example events are payment transactions, geolocation updates from mobile phones, shipping orders, sensor measurements from IoT devices or medical equipment, and much more. These events are organized and stored in [*topics*](http://kafka.apache.org/documentation/#intro_concepts_and_terms). Very simplified, a topic is similar to a folder in a filesystem, and the events are the files in that folder.

So before you can write your first events, you must create a topic. Open another terminal session and run:

```bash
$ bin/kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092
```

All of Kafka's command line tools have additional options: run the `kafka-topics.sh` command without any arguments to display usage information. For example, it can also show you [details such as the partition count](http://kafka.apache.org/documentation/#intro_concepts_and_terms) of the new topic:

```bash
$ bin/kafka-topics.sh --describe --topic quickstart-events --bootstrap-server localhost:9092
Topic:quickstart-events  PartitionCount:1    ReplicationFactor:1 Configs:
    Topic: quickstart-events Partition: 0    Leader: 0   Replicas: 0 Isr: 0
```

#### [STEP 4: WRITE SOME EVENTS INTO THE TOPIC](http://kafka.apache.org/quickstart#quickstart_send)

A Kafka client communicates with the Kafka brokers via the network for writing (or reading) events. Once received, the brokers will store the events in a durable and fault-tolerant manner for as long as you need—even forever.

Run the console producer client to write a few events into your topic. By default, each line you enter will result in a separate event being written to the topic.

```bash
$ bin/kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092
This is my first event
This is my second event
```

You can stop the producer client with `Ctrl-C` at any time.

#### [STEP 5: READ THE EVENTS](http://kafka.apache.org/quickstart#quickstart_consume)

Open another terminal session and run the console consumer client to read the events you just created:

```bash
$ bin/kafka-console-consumer.sh --topic quickstart-events --from-beginning --bootstrap-server localhost:9092
This is my first event
This is my second event
```

You can stop the consumer client with `Ctrl-C` at any time.

Feel free to experiment: for example, switch back to your producer terminal (previous step) to write additional events, and see how the events immediately show up in your consumer terminal.

Because events are durably stored in Kafka, they can be read as many times and by as many consumers as you want. You can easily verify this by opening yet another terminal session and re-running the previous command again.

#### [STEP 6: IMPORT/EXPORT YOUR DATA AS STREAMS OF EVENTS WITH KAFKA CONNECT](http://kafka.apache.org/quickstart#quickstart_kafkaconnect)

You probably have lots of data in existing systems like relational databases or traditional messaging systems, along with many applications that already use these systems. [Kafka Connect](http://kafka.apache.org/documentation/#connect) allows you to continuously ingest data from external systems into Kafka, and vice versa. It is thus very easy to integrate existing systems with Kafka. To make this process even easier, there are hundreds of such connectors readily available.

Take a look at the [Kafka Connect section](http://kafka.apache.org/documentation/#connect) learn more about how to continuously import/export your data into and out of Kafka.

#### [STEP 7: PROCESS YOUR EVENTS WITH KAFKA STREAMS](http://kafka.apache.org/quickstart#quickstart_kafkastreams)

Once your data is stored in Kafka as events, you can process the data with the [Kafka Streams](http://kafka.apache.org/documentation/streams) client library for Java/Scala. It allows you to implement mission-critical real-time applications and microservices, where the input and/or output data is stored in Kafka topics. Kafka Streams combines the simplicity of writing and deploying standard Java and Scala applications on the client side with the benefits of Kafka's server-side cluster technology to make these applications highly scalable, elastic, fault-tolerant, and distributed. The library supports exactly-once processing, stateful operations and aggregations, windowing, joins, processing based on event-time, and much more.

To give you a first taste, here's how one would implement the popular `WordCount` algorithm:

```bash
KStream<String, String> textLines = builder.stream("quickstart-events");

KTable<String, Long> wordCounts = textLines
            .flatMapValues(line -> Arrays.asList(line.toLowerCase().split(" ")))
            .groupBy((keyIgnored, word) -> word)
            .count();

wordCounts.toStream().to("output-topic"), Produced.with(Serdes.String(), Serdes.Long()));
```

The [Kafka Streams demo](http://kafka.apache.org/25/documentation/streams/quickstart) and the [app development tutorial](http://kafka.apache.org/25/documentation/streams/tutorial) demonstrate how to code and run such a streaming application from start to finish.

#### [STEP 8: TERMINATE THE KAFKA ENVIRONMENT](http://kafka.apache.org/quickstart#quickstart_kafkaterminate)

Now that you reached the end of the quickstart, feel free to tear down the Kafka environment—or continue playing around.

1. Stop the producer and consumer clients with `Ctrl-C`, if you haven't done so already.
2. Stop the Kafka broker with `Ctrl-C`.
3. Lastly, stop the ZooKeeper server with `Ctrl-C`.

If you also want to delete any data of your local Kafka environment including any events you have created along the way, run the command:

```bash
$ rm -rf /tmp/kafka-logs /tmp/zookeeper
```