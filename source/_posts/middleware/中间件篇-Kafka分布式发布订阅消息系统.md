---
title: 中间件篇-Kafka分布式发布订阅消息系统
date: 2021-03-20 23:02:58
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/kafka.jpeg
category: 中间件篇
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
./bin/zookeeper-server-start.sh config/zookeeper.properties
```

4.启动kafka

```bash
./bin/kafka-server-start.sh config/server.properties
```

5.创建Topic

```bash
./bin/kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092
```

6.查看创建的Topic

```bash
./bin/kafka-topics.sh --describe --topic quickstart-events --bootstrap-server localhost:9092
Topic: quickstart-events	PartitionCount: 1	ReplicationFactor: 1	Configs: segment.bytes=1073741824
	Topic: quickstart-events	Partition: 0	Leader: 0	Replicas: 0	Isr: 0
```

7.写入事件

```bash
./bin/kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092
This is my first event
This is my second event
```

写入完成后按住 `Ctrl-C` 完成操作.

8.获取事件

Open another terminal session and run the console consumer client to read the events you just created:

```bash
./bin/kafka-console-consumer.sh --topic quickstart-events --from-beginning --bootstrap-server localhost:9092
This is my first event
This is my second event
```

读取完成后按住 `Ctrl-C` 完成操作.

9.使用KAFKA CONNECT将数据导入/导出为事件流

> 您可能在现有系统（如关系数据库或传统消息传递系统）中拥有大量数据，以及许多已经使用这些系统的应用程序。[卡夫卡连接](http://kafka.apache.org/documentation/#连接)允许您不断地从外部系统摄取数据到Kafka，反之亦然。因此，很容易将现有系统与卡夫卡结合起来。为了使这个过程更容易，有数百个这样的连接器随时可用。

 [Kafka Connect section](http://kafka.apache.org/documentation/#connect) 

10.用卡夫卡流处理事件

```java
KStream<String, String> textLines = builder.stream("quickstart-events");

KTable<String, Long> wordCounts = textLines
            .flatMapValues(line -> Arrays.asList(line.toLowerCase().split(" ")))
            .groupBy((keyIgnored, word) -> word)
            .count();

wordCounts.toStream().to("output-topic"), Produced.with(Serdes.String(), Serdes.Long()));
```

 [Kafka Streams demo](http://kafka.apache.org/25/documentation/streams/quickstart) 

[app development tutorial](http://kafka.apache.org/25/documentation/streams/tutorial)  

11.清理环境
如果还希望删除本地Kafka环境的任何数据，包括沿途创建的任何事件，请运行以下命令：

```bash
rm -rf /tmp/kafka-logs /tmp/zookeeper
```

# 脚本详解

```text
./
├── connect-distributed.sh									连接分布式
├── connect-mirror-maker.sh									连接集群镜像
├── connect-standalone.sh										连接单机模式
├── kafka-acls.sh														权限相关
├── kafka-broker-api-versions.sh						broker相关信息					
├── kafka-configs.sh												卡夫卡配置
├── kafka-console-consumer.sh								控制台消费
├── kafka-console-producer.sh								控制台生产
├── kafka-consumer-groups.sh								消费组
├── kafka-consumer-perf-test.sh							消费指标测试
├── kafka-delegation-tokens.sh							委托令牌
├── kafka-delete-records.sh									删除记录
├── kafka-dump-log.sh												保存日志
├── kafka-features.sh												特性
├── kafka-leader-election.sh							  领导者选举		
├── kafka-log-dirs.sh												日志目录
├── kafka-mirror-maker.sh										集群镜像制作
├── kafka-preferred-replica-election.sh			触发指定分区进行“优先副本”选举					
├── kafka-producer-perf-test.sh							生产者指标测试			
├── kafka-reassign-partitions.sh						分区副本迁移功能				
├── kafka-replica-verification.sh						副本验证
├── kafka-run-class.sh											卡夫卡核心脚本
├── kafka-server-start.sh										启动服务
├── kafka-server-stop.sh										停止服务
├── kafka-streams-application-reset.sh			流应用重置相关			
├── kafka-topics.sh													topic管理
├── kafka-verifiable-consumer.sh						验证消费者			
├── kafka-verifiable-producer.sh						验证生产者
├── trogdor.sh															代理相关
├── windows																	windows下的相关脚本
```

# 基础命令









# Kafka 为何如此之快

Kafka 实现了`零拷贝`原理来快速移动数据，避免了内核之间的切换。Kafka 可以将数据记录分批发送，从生产者到文件系统（Kafka 主题日志）到消费者，可以端到端的查看这些批次的数据。

批处理能够进行更有效的数据压缩并减少 I/O 延迟，Kafka 采取顺序写入磁盘的方式，避免了随机磁盘寻址的浪费，更多关于磁盘寻址的了解，请参阅 程序员需要了解的硬核知识之磁盘 。

总结一下其实就是四个要点

- 顺序读写；
- 零拷贝；
- 消息压缩；
- 分批发送。

# 配置文件


<details>
    <summary>
        <span>配置文件</span>
    </summary>

```shell
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# see kafka.server.KafkaConfig for additional details and defaults

############################# Server Basics #############################

# The id of the broker. This must be set to a unique integer for each broker.
broker.id=0

############################# Socket Server Settings #############################

# The address the socket server listens on. It will get the value returned from 
# java.net.InetAddress.getCanonicalHostName() if not configured.
#   FORMAT:
#     listeners = listener_name://host_name:port
#   EXAMPLE:
#     listeners = PLAINTEXT://your.host.name:9092
#listeners=PLAINTEXT://:9092

# Hostname and port the broker will advertise to producers and consumers. If not set, 
# it uses the value for "listeners" if configured.  Otherwise, it will use the value
# returned from java.net.InetAddress.getCanonicalHostName().
#advertised.listeners=PLAINTEXT://your.host.name:9092

# Maps listener names to security protocols, the default is for them to be the same. See the config documentation for more details
#listener.security.protocol.map=PLAINTEXT:PLAINTEXT,SSL:SSL,SASL_PLAINTEXT:SASL_PLAINTEXT,SASL_SSL:SASL_SSL

# The number of threads that the server uses for receiving requests from the network and sending responses to the network
num.network.threads=3

# The number of threads that the server uses for processing requests, which may include disk I/O
num.io.threads=8

# The send buffer (SO_SNDBUF) used by the socket server
socket.send.buffer.bytes=102400

# The receive buffer (SO_RCVBUF) used by the socket server
socket.receive.buffer.bytes=102400

# The maximum size of a request that the socket server will accept (protection against OOM)
socket.request.max.bytes=104857600


############################# Log Basics #############################

# A comma separated list of directories under which to store log files
log.dirs=/tmp/kafka-logs

# The default number of log partitions per topic. More partitions allow greater
# parallelism for consumption, but this will also result in more files across
# the brokers.
num.partitions=1

# The number of threads per data directory to be used for log recovery at startup and flushing at shutdown.
# This value is recommended to be increased for installations with data dirs located in RAID array.
num.recovery.threads.per.data.dir=1

############################# Internal Topic Settings  #############################
# The replication factor for the group metadata internal topics "__consumer_offsets" and "__transaction_state"
# For anything other than development testing, a value greater than 1 is recommended to ensure availability such as 3.
offsets.topic.replication.factor=1
transaction.state.log.replication.factor=1
transaction.state.log.min.isr=1

############################# Log Flush Policy #############################

# Messages are immediately written to the filesystem but by default we only fsync() to sync
# the OS cache lazily. The following configurations control the flush of data to disk.
# There are a few important trade-offs here:
#    1. Durability: Unflushed data may be lost if you are not using replication.
#    2. Latency: Very large flush intervals may lead to latency spikes when the flush does occur as there will be a lot of data to flush.
#    3. Throughput: The flush is generally the most expensive operation, and a small flush interval may lead to excessive seeks.
# The settings below allow one to configure the flush policy to flush data after a period of time or
# every N messages (or both). This can be done globally and overridden on a per-topic basis.

# The number of messages to accept before forcing a flush of data to disk
#log.flush.interval.messages=10000

# The maximum amount of time a message can sit in a log before we force a flush
#log.flush.interval.ms=1000

############################# Log Retention Policy #############################

# The following configurations control the disposal of log segments. The policy can
# be set to delete segments after a period of time, or after a given size has accumulated.
# A segment will be deleted whenever *either* of these criteria are met. Deletion always happens
# from the end of the log.

# The minimum age of a log file to be eligible for deletion due to age
log.retention.hours=168

# A size-based retention policy for logs. Segments are pruned from the log unless the remaining
# segments drop below log.retention.bytes. Functions independently of log.retention.hours.
#log.retention.bytes=1073741824

# The maximum size of a log segment file. When this size is reached a new log segment will be created.
log.segment.bytes=1073741824

# The interval at which log segments are checked to see if they can be deleted according
# to the retention policies
log.retention.check.interval.ms=300000

############################# Zookeeper #############################

# Zookeeper connection string (see zookeeper docs for details).
# This is a comma separated host:port pairs, each corresponding to a zk
# server. e.g. "127.0.0.1:3000,127.0.0.1:3001,127.0.0.1:3002".
# You can also append an optional chroot string to the urls to specify the
# root directory for all kafka znodes.
zookeeper.connect=localhost:2181

# Timeout in ms for connecting to zookeeper
zookeeper.connection.timeout.ms=18000


############################# Group Coordinator Settings #############################

# The following configuration specifies the time, in milliseconds, that the GroupCoordinator will delay the initial consumer rebalance.
# The rebalance will be further delayed by the value of group.initial.rebalance.delay.ms as new members join the group, up to a maximum of max.poll.interval.ms.
# The default value for this is 3 seconds.
# We override this to 0 here as it makes for a better out-of-the-box experience for development and testing.
# However, in production environments the default value of 3 seconds is more suitable as this will help to avoid unnecessary, and potentially expensive, rebalances during application startup.
group.initial.rebalance.delay.ms=0
```



</details>


# Simple Example

<details>
    <summary>
        <span>1.配置类</span>
    </summary>

```java
public class KafkaProperties {
    public static final String TOPIC = "topic1";
    public static final String KAFKA_SERVER_URL = "localhost";
    public static final int KAFKA_SERVER_PORT = 9092;

    private KafkaProperties() {}
}
```

</details>



<details>
    <summary>
        <span>2.消费者</span>
    </summary>

```java
package example;
import kafka.utils.ShutdownableThread;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.time.Duration;
import java.util.Collections;
import java.util.Optional;
import java.util.Properties;
import java.util.concurrent.CountDownLatch;

/**
 * 消费者
 */
public class Consumer extends ShutdownableThread {
    private final KafkaConsumer<Integer, String> consumer;
    private final String topic;
    private final String groupId;
    private final int numMessageToConsume;
    private int messageRemaining;
    private final CountDownLatch latch;

    /**
     * @param topic               主题
     * @param groupId             　分组
     * @param instanceId          　实例id
     * @param readCommitted       是否读提交
     * @param numMessageToConsume 消费数量
     * @param latch               同步屏障
     */
    public Consumer(final String topic, final String groupId, final Optional<String> instanceId, final boolean readCommitted, final int numMessageToConsume, final CountDownLatch latch) {
        super("KafkaConsumerExample", false);
        this.groupId = groupId;
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaProperties.KAFKA_SERVER_URL + ":" + KafkaProperties.KAFKA_SERVER_PORT);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        instanceId.ifPresent(id -> props.put(ConsumerConfig.GROUP_INSTANCE_ID_CONFIG, id));
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
        props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "30000");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.IntegerDeserializer");
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        if (readCommitted) {
            props.put(ConsumerConfig.ISOLATION_LEVEL_CONFIG, "read_committed");
        }
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        consumer = new KafkaConsumer<>(props);
        this.topic = topic;
        this.numMessageToConsume = numMessageToConsume;
        this.messageRemaining = numMessageToConsume;
        this.latch = latch;
    }

    KafkaConsumer<Integer, String> get() {
        return consumer;
    }

    /**
     * 处理消费的数据
     */
    @Override
    public void doWork() {
        consumer.subscribe(Collections.singletonList(this.topic));
        ConsumerRecords<Integer, String> records = consumer.poll(Duration.ofSeconds(1));
        for (ConsumerRecord<Integer, String> record : records) {
            System.out.println(groupId + " received message : from partition " + record.partition() + ", (" + record.key() + ", " + record.value() + ") at offset " + record.offset());
        }
        messageRemaining -= records.count();
        if (messageRemaining <= 0) {
            System.out.println(groupId + " finished reading " + numMessageToConsume + " messages");
            latch.countDown();
        }
    }
}
```


</details>



<details>
    <summary>
        <span>3.消费者</span>
    </summary>

```java
package example;

/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.IntegerSerializer;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;

public class Producer extends Thread {
    private final KafkaProducer<Integer, String> producer;
    private final String topic;
    private final Boolean isAsync;
    private int numRecords;
    private final CountDownLatch latch;

    public Producer(final String topic,
                    final Boolean isAsync,
                    final String transactionalId,
                    final boolean enableIdempotency,
                    final int numRecords,
                    final int transactionTimeoutMs,
                    final CountDownLatch latch) {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaProperties.KAFKA_SERVER_URL + ":" + KafkaProperties.KAFKA_SERVER_PORT);
        props.put(ProducerConfig.CLIENT_ID_CONFIG, "DemoProducer");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, IntegerSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        if (transactionTimeoutMs > 0) {
            props.put(ProducerConfig.TRANSACTION_TIMEOUT_CONFIG, transactionTimeoutMs);
        }
        if (transactionalId != null) {
            props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, transactionalId);
        }
        props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, enableIdempotency);

        producer = new KafkaProducer<>(props);
        this.topic = topic;
        this.isAsync = isAsync;
        this.numRecords = numRecords;
        this.latch = latch;
    }

    KafkaProducer<Integer, String> get() {
        return producer;
    }

    @Override
    public void run() {
        int messageKey = 0;
        int recordsSent = 0;
        while (recordsSent < numRecords) {
            String messageStr = "Message_" + messageKey;
            long startTime = System.currentTimeMillis();
            if (isAsync) { // Send asynchronously
                producer.send(new ProducerRecord<>(topic,
                        messageKey,
                        messageStr), new DemoCallBack(startTime, messageKey, messageStr));
            } else { // Send synchronously
                try {
                    producer.send(new ProducerRecord<>(topic,
                            messageKey,
                            messageStr)).get();
                    System.out.println("Sent message: (" + messageKey + ", " + messageStr + ")");
                } catch (InterruptedException | ExecutionException e) {
                    e.printStackTrace();
                }
            }
            messageKey += 2;
            recordsSent += 1;
        }
        System.out.println("Producer sent " + numRecords + " records successfully");
        latch.countDown();
    }
}

class DemoCallBack implements Callback {

    private final long startTime;
    private final int key;
    private final String message;

    public DemoCallBack(long startTime, int key, String message) {
        this.startTime = startTime;
        this.key = key;
        this.message = message;
    }

    /**
     * A callback method the user can implement to provide asynchronous handling of request completion. This method will
     * be called when the record sent to the server has been acknowledged. When exception is not null in the callback,
     * metadata will contain the special -1 value for all fields except for topicPartition, which will be valid.
     *
     * @param metadata  The metadata for the record that was sent (i.e. the partition and offset). An empty metadata
     *                  with -1 value for all fields except for topicPartition will be returned if an error occurred.
     * @param exception The exception thrown during processing of this record. Null if no error occurred.
     */
    public void onCompletion(RecordMetadata metadata, Exception exception) {
        long elapsedTime = System.currentTimeMillis() - startTime;
        if (metadata != null) {
            System.out.println(
                    "message(" + key + ", " + message + ") sent to partition(" + metadata.partition() +
                            "), " +
                            "offset(" + metadata.offset() + ") in " + elapsedTime + " ms");
        } else {
            exception.printStackTrace();
        }
    }
}
```

</details>

<details>
    <summary>
        <span>4.消息处理器</span>
    </summary>

```java
package example;

/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import org.apache.kafka.clients.consumer.ConsumerRebalanceListener;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.KafkaException;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.errors.FencedInstanceIdException;
import org.apache.kafka.common.errors.ProducerFencedException;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicLong;

/**
 * A demo class for how to write a customized EOS app. It takes a consume-process-produce loop.
 * Important configurations and APIs are commented.
 */
public class ExactlyOnceMessageProcessor extends Thread {

    private static final boolean READ_COMMITTED = true;

    private final String inputTopic;
    private final String outputTopic;
    private final String transactionalId;
    private final String groupInstanceId;

    private final KafkaProducer<Integer, String> producer;
    private final KafkaConsumer<Integer, String> consumer;

    private final CountDownLatch latch;

    public ExactlyOnceMessageProcessor(final String inputTopic,
                                       final String outputTopic,
                                       final int instanceIdx,
                                       final CountDownLatch latch) {
        this.inputTopic = inputTopic;
        this.outputTopic = outputTopic;
        this.transactionalId = "Processor-" + instanceIdx;
        // It is recommended to have a relatively short txn timeout in order to clear pending offsets faster.
        final int transactionTimeoutMs = 10000;
        // A unique transactional.id must be provided in order to properly use EOS.
        producer = new Producer(outputTopic, true, transactionalId, true, -1, transactionTimeoutMs, null).get();
        // Consumer must be in read_committed mode, which means it won't be able to read uncommitted data.
        // Consumer could optionally configure groupInstanceId to avoid unnecessary rebalances.
        this.groupInstanceId = "Txn-consumer-" + instanceIdx;
        consumer = new Consumer(inputTopic, "Eos-consumer",
                Optional.of(groupInstanceId), READ_COMMITTED, -1, null).get();
        this.latch = latch;
    }

    @Override
    public void run() {
        // Init transactions call should always happen first in order to clear zombie transactions from previous generation.
        producer.initTransactions();

        final AtomicLong messageRemaining = new AtomicLong(Long.MAX_VALUE);

        consumer.subscribe(Collections.singleton(inputTopic), new ConsumerRebalanceListener() {
            @Override
            public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
                printWithTxnId("Revoked partition assignment to kick-off rebalancing: " + partitions);
            }

            @Override
            public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
                printWithTxnId("Received partition assignment after rebalancing: " + partitions);
                messageRemaining.set(messagesRemaining(consumer));
            }
        });

        int messageProcessed = 0;
        while (messageRemaining.get() > 0) {
            try {
                ConsumerRecords<Integer, String> records = consumer.poll(Duration.ofMillis(200));
                if (records.count() > 0) {
                    // Begin a new transaction session.
                    producer.beginTransaction();
                    for (ConsumerRecord<Integer, String> record : records) {
                        // Process the record and send to downstream.
                        ProducerRecord<Integer, String> customizedRecord = transform(record);
                        producer.send(customizedRecord);
                    }

                    Map<TopicPartition, OffsetAndMetadata> offsets = consumerOffsets();

                    // Checkpoint the progress by sending offsets to group coordinator broker.
                    // Note that this API is only available for broker >= 2.5.
                    producer.sendOffsetsToTransaction(offsets, consumer.groupMetadata());

                    // Finish the transaction. All sent records should be visible for consumption now.
                    producer.commitTransaction();
                    messageProcessed += records.count();
                }
            } catch (ProducerFencedException e) {
                throw new KafkaException(String.format("The transactional.id %s has been claimed by another process", transactionalId));
            } catch (FencedInstanceIdException e) {
                throw new KafkaException(String.format("The group.instance.id %s has been claimed by another process", groupInstanceId));
            } catch (KafkaException e) {
                // If we have not been fenced, try to abort the transaction and continue. This will raise immediately
                // if the producer has hit a fatal error.
                producer.abortTransaction();

                // The consumer fetch position needs to be restored to the committed offset
                // before the transaction started.
                resetToLastCommittedPositions(consumer);
            }

            messageRemaining.set(messagesRemaining(consumer));
            printWithTxnId("Message remaining: " + messageRemaining);
        }

        printWithTxnId("Finished processing " + messageProcessed + " records");
        latch.countDown();
    }

    private Map<TopicPartition, OffsetAndMetadata> consumerOffsets() {
        Map<TopicPartition, OffsetAndMetadata> offsets = new HashMap<>();
        for (TopicPartition topicPartition : consumer.assignment()) {
            offsets.put(topicPartition, new OffsetAndMetadata(consumer.position(topicPartition), null));
        }
        return offsets;
    }

    private void printWithTxnId(final String message) {
        System.out.println(transactionalId + ": " + message);
    }

    private ProducerRecord<Integer, String> transform(final ConsumerRecord<Integer, String> record) {
        printWithTxnId("Transformed record (" + record.key() + "," + record.value() + ")");
        return new ProducerRecord<>(outputTopic, record.key() / 2, "Transformed_" + record.value());
    }

    private long messagesRemaining(final KafkaConsumer<Integer, String> consumer) {
        final Map<TopicPartition, Long> fullEndOffsets = consumer.endOffsets(new ArrayList<>(consumer.assignment()));
        // If we couldn't detect any end offset, that means we are still not able to fetch offsets.
        if (fullEndOffsets.isEmpty()) {
            return Long.MAX_VALUE;
        }

        return consumer.assignment().stream().mapToLong(partition -> {
            long currentPosition = consumer.position(partition);
            printWithTxnId("Processing partition " + partition + " with full offsets " + fullEndOffsets);
            if (fullEndOffsets.containsKey(partition)) {
                return fullEndOffsets.get(partition) - currentPosition;
            }
            return 0;
        }).sum();
    }

    private static void resetToLastCommittedPositions(KafkaConsumer<Integer, String> consumer) {
        final Map<TopicPartition, OffsetAndMetadata> committed = consumer.committed(consumer.assignment());
        consumer.assignment().forEach(tp -> {
            OffsetAndMetadata offsetAndMetadata = committed.get(tp);
            if (offsetAndMetadata != null)
                consumer.seek(tp, offsetAndMetadata.offset());
            else
                consumer.seekToBeginning(Collections.singleton(tp));
        });
    }
}
```

</details>


<details>
    <summary>
        <span>5.启动生产者</span>
    </summary>

```
import org.apache.kafka.common.errors.TimeoutException;

import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class KafkaConsumerProducerDemo {
    public static void main(String[] args) throws InterruptedException {
        boolean isAsync = args.length == 0 || !args[0].trim().equalsIgnoreCase("sync");
        CountDownLatch latch = new CountDownLatch(2);
        Producer producerThread = new Producer(KafkaProperties.TOPIC, isAsync, null, false, 10000, -1, latch);
        producerThread.start();

        Consumer consumerThread = new Consumer(KafkaProperties.TOPIC, "DemoConsumer", Optional.empty(), false, 10000, latch);
        consumerThread.start();

        if (!latch.await(5, TimeUnit.MINUTES)) {
            throw new TimeoutException("Timeout after 5 minutes waiting for demo producer and consumer to finish");
        }

        consumerThread.shutdown();
        System.out.println("All finished!");
    }
}
```


</details>


<details>
    <summary>
        <span>6.启动消费者</span>
    </summary>


```java
package example;

/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.errors.TimeoutException;
import org.apache.kafka.common.errors.TopicExistsException;
import org.apache.kafka.common.errors.UnknownTopicOrPartitionException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 * This exactly once demo driver takes 3 arguments:
 *   - partition: number of partitions for input/output topic
 *   - instances: number of instances
 *   - records: number of records
 * An example argument list would be `6 3 50000`.
 *
 * If you are using Intellij, the above arguments should be put in the configuration's `Program Arguments`.
 * Also recommended to set an output log file by `Edit Configuration -> Logs -> Save console
 * output to file` to record all the log output together.
 *
 * The driver could be decomposed as following stages:
 *
 * 1. Cleanup any topic whose name conflicts with input and output topic, so that we have a clean-start.
 *
 * 2. Set up a producer in a separate thread to pre-populate a set of records with even number keys into
 *    the input topic. The driver will block for the record generation to finish, so the producer
 *    must be in synchronous sending mode.
 *
 * 3. Set up transactional instances in separate threads which does a consume-process-produce loop,
 *    tailing data from input topic (See {@link ExactlyOnceMessageProcessor}). Each EOS instance will
 *    drain all the records from either given partitions or auto assigned partitions by actively
 *    comparing log end offset with committed offset. Each record will be processed exactly once
 *    as dividing the key by 2, and extend the value message. The driver will block for all the record
 *    processing to finish. The transformed record shall be written to the output topic, with
 *    transactional guarantee.
 *
 * 4. Set up a read committed consumer in a separate thread to verify we have all records within
 *    the output topic, while the message ordering on partition level is maintained.
 *    The driver will block for the consumption of all committed records.
 *
 * From this demo, you could see that all the records from pre-population are processed exactly once,
 * with strong partition level ordering guarantee.
 *
 * Note: please start the kafka broker and zookeeper in local first. The broker version must be >= 2.5
 * in order to run, otherwise the app could throw
 * {@link org.apache.kafka.common.errors.UnsupportedVersionException}.
 */
public class KafkaExactlyOnceDemo {

    private static final String INPUT_TOPIC = "input-topic";
    private static final String OUTPUT_TOPIC = "output-topic";

    public static void main(String[] args) throws InterruptedException, ExecutionException {
        if (args.length != 3) {
            throw new IllegalArgumentException("Should accept 3 parameters: " +
                    "[number of partitions], [number of instances], [number of records]");
        }

        int numPartitions = Integer.parseInt(args[0]);
        int numInstances = Integer.parseInt(args[1]);
        int numRecords = Integer.parseInt(args[2]);

        /* Stage 1: topic cleanup and recreation */
        recreateTopics(numPartitions);

        CountDownLatch prePopulateLatch = new CountDownLatch(1);

        /* Stage 2: pre-populate records */
        Producer producerThread = new Producer(INPUT_TOPIC, false, null, true, numRecords, -1, prePopulateLatch);
        producerThread.start();

        if (!prePopulateLatch.await(5, TimeUnit.MINUTES)) {
            throw new TimeoutException("Timeout after 5 minutes waiting for data pre-population");
        }

        CountDownLatch transactionalCopyLatch = new CountDownLatch(numInstances);

        /* Stage 3: transactionally process all messages */
        for (int instanceIdx = 0; instanceIdx < numInstances; instanceIdx++) {
            ExactlyOnceMessageProcessor messageProcessor = new ExactlyOnceMessageProcessor(
                    INPUT_TOPIC, OUTPUT_TOPIC, instanceIdx, transactionalCopyLatch);
            messageProcessor.start();
        }

        if (!transactionalCopyLatch.await(5, TimeUnit.MINUTES)) {
            throw new TimeoutException("Timeout after 5 minutes waiting for transactionally message copy");
        }

        CountDownLatch consumeLatch = new CountDownLatch(1);

        /* Stage 4: consume all processed messages to verify exactly once */
        Consumer consumerThread = new Consumer(OUTPUT_TOPIC, "Verify-consumer", Optional.empty(), true, numRecords, consumeLatch);
        consumerThread.start();

        if (!consumeLatch.await(5, TimeUnit.MINUTES)) {
            throw new TimeoutException("Timeout after 5 minutes waiting for output data consumption");
        }

        consumerThread.shutdown();
        System.out.println("All finished!");
    }

    private static void recreateTopics(final int numPartitions)
            throws ExecutionException, InterruptedException {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
                KafkaProperties.KAFKA_SERVER_URL + ":" + KafkaProperties.KAFKA_SERVER_PORT);

        Admin adminClient = Admin.create(props);

        List<String> topicsToDelete = Arrays.asList(INPUT_TOPIC, OUTPUT_TOPIC);

        deleteTopic(adminClient, topicsToDelete);

        // Check topic existence in a retry loop
        while (true) {
            System.out.println("Making sure the topics are deleted successfully: " + topicsToDelete);

            Set<String> listedTopics = adminClient.listTopics().names().get();
            System.out.println("Current list of topics: " + listedTopics);

            boolean hasTopicInfo = false;
            for (String listedTopic : listedTopics) {
                if (topicsToDelete.contains(listedTopic)) {
                    hasTopicInfo = true;
                    break;
                }
            }
            if (!hasTopicInfo) {
                break;
            }
            Thread.sleep(1000);
        }

        // Create topics in a retry loop
        while (true) {
            final short replicationFactor = 1;
            final List<NewTopic> newTopics = Arrays.asList(
                    new NewTopic(INPUT_TOPIC, numPartitions, replicationFactor),
                    new NewTopic(OUTPUT_TOPIC, numPartitions, replicationFactor));
            try {
                adminClient.createTopics(newTopics).all().get();
                System.out.println("Created new topics: " + newTopics);
                break;
            } catch (ExecutionException e) {
                if (!(e.getCause() instanceof TopicExistsException)) {
                    throw e;
                }
                System.out.println("Metadata of the old topics are not cleared yet...");

                deleteTopic(adminClient, topicsToDelete);

                Thread.sleep(1000);
            }
        }
    }

    private static void deleteTopic(final Admin adminClient, final List<String> topicsToDelete)
            throws InterruptedException, ExecutionException {
        try {
            adminClient.deleteTopics(topicsToDelete).all().get();
        } catch (ExecutionException e) {
            if (!(e.getCause() instanceof UnknownTopicOrPartitionException)) {
                throw e;
            }
            System.out.println("Encountered exception during topic deletion: " + e.getCause());
        }
        System.out.println("Deleted old topics: " + topicsToDelete);
    }
}
```


</details>


# Stream Example

<details>
    <summary>
        <span>1.生成项目</span>
    </summary>

```bash
        mvn archetype:generate \
            -DarchetypeGroupId=org.apache.kafka \
            -DarchetypeArtifactId=streams-quickstart-java \
            -DarchetypeVersion=2.5.0 \
            -DgroupId=streams.examples \
            -DartifactId=streams.examples \
            -Dversion=0.1 \
            -Dpackage=myapps
```

</details>



<details>
    <summary>
        <span>2.创建topic</span>
    </summary>

```bash
bin/kafka-topics.sh --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 1 \
    --topic streams-plaintext-input
    
bin/kafka-topics.sh --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 1 \
    --topic streams-wordcount-output \
    --config cleanup.policy=compact
```

</details>


<details>
    <summary>
        <span>3.应用代码</span>
    </summary>

```java
package myapps;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.utils.Bytes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.KeyValueMapper;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.kstream.Produced;
import org.apache.kafka.streams.kstream.ValueMapper;
import org.apache.kafka.streams.state.KeyValueStore;

import java.util.Arrays;
import java.util.Locale;
import java.util.Properties;
import java.util.concurrent.CountDownLatch;

/**
 * In this example, we implement a simple WordCount program using the high-level Streams DSL
 * that reads from a source topic "streams-plaintext-input", where the values of messages represent lines of text,
 * split each text line into words and then compute the word occurence histogram, write the continuous updated histogram
 * into a topic "streams-wordcount-output" where each record is an updated count of a single word.
 */
public class WordCount {

    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "streams-wordcount");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        final StreamsBuilder builder = new StreamsBuilder();

        builder.<String, String>stream("streams-plaintext-input")
               .flatMapValues(value -> Arrays.asList(value.toLowerCase(Locale.getDefault()).split("\\W+")))
               .groupBy((key, value) -> value)
               .count(Materialized.<String, Long, KeyValueStore<Bytes, byte[]>>as("counts-store"))
               .toStream()
               .to("streams-wordcount-output", Produced.with(Serdes.String(), Serdes.Long()));

        final Topology topology = builder.build();
        final KafkaStreams streams = new KafkaStreams(topology, props);
        final CountDownLatch latch = new CountDownLatch(1);

        // attach shutdown handler to catch control-c
        Runtime.getRuntime().addShutdownHook(new Thread("streams-shutdown-hook") {
            @Override
            public void run() {
                streams.close();
                latch.countDown();
            }
        });

        try {
            streams.start();
            latch.await();
        } catch (Throwable e) {
            System.exit(1);
        }
        System.exit(0);
    }
}
```


</details>


[参考资料](http://kafka.apache.org/25/documentation/streams/developer-guide/)

# 集群配置


<details>
    <summary>
        <span>配置文件</span>
    </summary>

```shell
# 结点id/监听地址
broker.id=0
listeners=PLAINTEXT://192.168.182.131:9092
broker.id=1
listeners=PLAINTEXT://192.168.182.131:9092
broker.id=2
listeners=PLAINTEXT://192.168.182.132:9092
# 网络连接线程数
num.network.threads=3
# io线程数
num.io.threads=8
# 缓冲区大小
socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400
socket.request.max.bytes=104857600
# 日志
log.dirs=/tmp/kafka-logs
# 分区
num.partitions=1
num.recovery.threads.per.data.dir=1
offsets.topic.replication.factor=1
transaction.state.log.replication.factor=1
transaction.state.log.min.isr=1
log.retention.hours=168
log.segment.bytes=1073741824
log.retention.check.interval.ms=300000
zookeeper.connect=localhost:2181
zookeeper.connection.timeout.ms=18000
group.initial.rebalance.delay.ms=0
```

</details>


# Kafka Manager

>滴滴Logi-KafkaManager脱胎于滴滴内部多年的Kafka运营实践经验，是面向Kafka用户、Kafka运维人员打造的共享多租户Kafka云平台。专注于Kafka运维管控、监控告警、资源治理等核心场景，经历过大规模集群、海量大数据的考验。内部满意度高达90%的同时，还与多家知名企业达成商业化合作。

[更多内容](https://github.com/didi/Logi-KafkaManager.git)



# 参考资料

[官方文档-快速开始](http://kafka.apache.org/quickstart)

[Apache Kafka 教程](https://www.w3cschool.cn/apache_kafka)

[真的，关于 Kafka 入门看这一篇就够了](https://baijiahao.baidu.com/s?id=1651919282506404758&wfr=spider&for=pc)

[Kafka Github地址](https://github.com/apache/kafka)

[DEVELOPER GUIDE FOR KAFKA STREAMS](http://kafka.apache.org/25/documentation/streams/developer-guide/)   


