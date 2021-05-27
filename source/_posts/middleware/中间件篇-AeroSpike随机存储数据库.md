---
title: 中间件篇-AeroSpike随机存储数据库
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/as.png'
hide: false
date: 2021-03-28 00:10:11
category: 中间件篇
tags: AeroSpike
---

# 简介

1. Aerospike 是一个分布式、可扩展的数据库，其架构有三个关键目标:

>1. 为 web 规模的应用程序创建一个灵活的、可扩展的平台
2. 提供传统数据库所期望的健壮性和可靠性(如 ACID)
3. 以最少的人工参与提供操作效率


1. T级别大数据高并发的结构化数据存储解决方案，读写操作达微妙级，99%的响应可在1毫秒内实现，99.9%的响应可在5毫秒内实现。
2. 采用混合架构，索引存储在 RAM 中，而数据存储在闪存/固态硬盘(SSD) 上，自动感知集群，可以随意增加节点线性扩容，无需分片，无需人工干预（性能与节点成正比上升），支持多语言集成；与redis相比不太会遇到性能瓶颈大部分的源代码是用 c 语言编写的，符合 ANSI C99标准。

## 为什么要用AS

K-V类型的数据库必须要提的就是redis，redis数据完全存储在内存虽然保证了查询性能，但是成本太高。AS最大的卖点就是可以存储在SSD上，并且保证和redis相同的查询性能。

<p  class="note note-primary">
AS内部在访问SSD屏蔽了文件系统层级，直接访问地址，保证了数据的读取速度。 AS同时支持二级索引与聚合，支持简单的sql操作，相比于其他nosql数据库，有一定优势。
</p>

## Namespaces(库)

AS数据存储的最高层级，类比于传统的数据库的库层级，一个namespace包含记录（records），索引（indexes ）及策略（policies）。
其中策略决定namespace的行为，包括：
1.数据的存储位置是内存还是SSD。
2.一条记录存储的副本个数。
3.过期时间（TTL）：不同redis的针对key设置TTL，AS可以在库的层级进行全局设置，并且支持对于已存在的数据进行TTL的设置。

## Set(表)

存储于namespace，是一个逻辑分区，类比于传统数据库的表。set的存储策略继承自namespace，也可以为set设置单独的存储策略

## Records(行)

类比于传统数据库的行，包含key，Bins（value）,和Metadata（元数据）。key全局唯一，作为K-V数据库一般也是通过key去查询。Bins相当于列，存储具体的数据。元数据存储一些基本信息，例如TTL等。

## Key

提到key，有一个和key伴生的概念是摘要（Digests），当key被存入数据库，key与set信息一起被哈希化成一个160位的摘要。数据库中，摘要为所有操作定位记录。key主要用于应用程序访问，而摘要主要用于数据库内部查找记录.

## Metadata

每一条记录包含以下几条元数据
1.generation（代）：表示记录被修改的次数。该数字在程序度数据时返回，用来确认正在写入的数据从最后一次读开始未被修改过。

2.time-to-live（TTL）：AS会自动根据记录的TTL使其过期。每次在对象上执行写操作TTL就会增加。3.10.1版本以上，可以通过设置策略，使更新记录时不刷新TTL。

3.last-update-time （LUT）：上次更新时间，这是一个数据库内部的元数据，不会返回给客户端。

## Bins

在一条记录里，数据被存储在一个或多个bins里，bins由名称和值组成。bins不需要指定数据类型，数据类型有bins中的值决定。动态的数据类型提供了很好的灵活性。AS中每条记录可以由完全不同的bins组成。记录无模式，你可以记录的任何生命周期增加或删除bins。

在一个库中bins的名称最多包含32k，这是由内部字符串优化所致。（相比于HBase支持几百万列还是有一定差距，如果想直接将HBase表迁移到AS可能需要重新设计存储结构）

# 入门

```shell
# 下载
wget https://www.aerospike.com/artifacts/aerospike-server-community/4.3.0.10/aerospike-server-community-4.3.0.10-el7.tgz
# 解压
tar -zxvf aerospike-server-community-4.3.0.10-el7.tgz
# 进入目录
cd cd aerospike-server-community-4.3.0.10-el7
# 安装
./asinstall
# 启动服务
service aerospike start
# 查看状态
service aerospike status
# 停止服务
service aerospike stop
# 配置文件
vim /etc/aerospike/aerospike.conf
```


安装AS工具

```shell
# 下载
wget https://www.aerospike.com/artifacts/aerospike-tools/3.16.0/aerospike-tools-3.16.0-el7.tgz
# 解压
tar zxvf aerospike-tools-3.16.0-el7
# 进入目录
cd aerospike-tools-3.16.0-el7
# 查看安装
yum list installed | grep aerospike-tools
```

简单查询

```shell
# 进入aql
aql
# 查看namespaces
show namespaces
# 查询test命名空间下数据
select * from test
# 插入数据
insert into test(pk,id,name,age) values('key1','101','AAA','21');
insert into test(pk,id,name,age) values('key2','102','BBB','18');
# 删除数据
delete from test where pk='key2'
# 查询数据
格式 SELECT * FROM <ns>[.<set>] WHERE PK = <key>
```

# AQL

COMMANDS
  
## DDL

      CREATE INDEX <index> ON <ns>[.<set>] (<bin>) NUMERIC|STRING|GEO2DSPHERE
      CREATE LIST/MAPKEYS/MAPVALUES INDEX <index> ON <ns>[.<set>] (<bin>) NUMERIC|STRING|GEO2DSPHERE
      DROP INDEX <ns>[.<set>] <index>
      Examples:
      
          CREATE INDEX idx_foo ON test.demo (foo) NUMERIC
          DROP INDEX test.demo idx_foo
      
  
## MANAGE UDFS

      REGISTER MODULE '<filepath>'
      REMOVE MODULE <filename>
      
          <filepath> is file path to the UDF module(in single quotes).
          <filename> is file name of the UDF module.
      
      Examples:
      
          REGISTER MODULE '~/test.lua' 
          REMOVE MODULE test.lua
      
  
## USER ADMINISTRATION

      CREATE USER <user> PASSWORD <password> ROLE[S] <role1>,<role2>...
          pre-defined roles: read|read-write|read-write-udf|sys-admin|user-admin
      DROP USER <user>
      SET PASSWORD <password> [FOR <user>]
      GRANT ROLE[S] <role1>,<role2>... TO <user>
      REVOKE ROLE[S] <role1>,<role2>... FROM <user>
      CREATE ROLE <role> PRIVILEGE[S] <priv1[.ns1[.set1]]>,<priv2[.ns2[.set2]]>...
          priv: read|read-write|read-write-udf|sys-admin|user-admin|data-admin
          ns:   namespace.  Applies to all namespaces if not set.
          set:  set name.  Applie to all sets within namespace if not set.
                sys-admin, user-admin and data-admin can't be qualified with namespace or set.
      DROP ROLE <role>
      GRANT PRIVILEGE[S] <priv1[.ns1[.set1]]>,<priv2[.ns2[.set2]]>... TO <role>
      REVOKE PRIVILEGE[S] <priv1[.ns1[.set1]]>,<priv2[.ns2[.set2]]>... FROM <role>
      
      
##  DML

      INSERT INTO <ns>[.<set>] (PK, <bins>) VALUES (<key>, <values>)
      DELETE FROM <ns>[.<set>] WHERE PK = <key>
      TRUNCATE <ns>[.<set>] [upto <LUT>] 
      
          <ns> is the namespace for the record.
          <set> is the set name for the record.
          <key> is the record's primary key.
          <bins> is a comma-separated list of bin names.
          <values> is comma-separated list of bin values, which may include type cast expressions. Set to NULL (case insensitive & w/o quotes) to delete the bin.
          <LUT> is last update time upto which set or namespace needs to be truncated. LUT is either nanosecond since Unix epoch like 1513687224599000000 or in date string in format like "Dec 19 2017 12:40:00".
      
        Type Cast Expression Formats:
      
            CAST(<Value> AS <TypeName>)
            <TypeName>(<Value>)
      
        Supported AQL Types:
      
              Bin Value Type                    Equivalent Type Name(s)
           ===============================================================
            Integer                           DECIMAL, INT, NUMERIC
            Floating Point                    FLOAT, REAL
            Aerospike CDT (List, Map, etc.)   JSON
            Aerospike List                    LIST
            Aerospike Map                     MAP
            GeoJSON                           GEOJSON
            String                            CHAR, STRING, TEXT, VARCHAR
           ===============================================================
      
        [Note:  Type names and keywords are case insensitive.]
      
      Examples:
      
          INSERT INTO test.demo (PK, foo, bar) VALUES ('key1', 123, 'abc')
          INSERT INTO test.demo (PK, foo, bar) VALUES ('key1', CAST('123' AS INT), JSON('{"a": 1.2, "b": [1, 2, 3]}'))
          INSERT INTO test.demo (PK, foo, bar) VALUES ('key1', LIST('[1, 2, 3]'), MAP('{"a": 1, "b": 2}'))
          INSERT INTO test.demo (PK, gj) VALUES ('key1', GEOJSON('{"type": "Point", "coordinates": [123.4, -456.7]}'))
          DELETE FROM test.demo WHERE PK = 'key1'
      
##  INVOKING UDFS

      EXECUTE <module>.<function>(<args>) ON <ns>[.<set>]
      EXECUTE <module>.<function>(<args>) ON <ns>[.<set>] WHERE PK = <key>
      EXECUTE <module>.<function>(<args>) ON <ns>[.<set>] WHERE <bin> = <value>
      EXECUTE <module>.<function>(<args>) ON <ns>[.<set>] WHERE <bin> BETWEEN <lower> AND <upper>
      
          <module> is UDF module containing the function to invoke.
          <function> is UDF to invoke.
          <args> is a comma-separated list of argument values for the UDF.
          <ns> is the namespace for the records to be queried.
          <set> is the set name for the record to be queried.
          <key> is the record's primary key.
          <bin> is the name of a bin.
          <value> is the value of a bin.
          <lower> is the lower bound for a numeric range query.
          <upper> is the lower bound for a numeric range query.
      
      Examples:
      
          EXECUTE myudfs.udf1(2) ON test.demo
          EXECUTE myudfs.udf1(2) ON test.demo WHERE PK = 'key1'
      
##  OPERATE

      OPERATE <op(<bin>, params...)>[with_policy(<map policy>),] [<op(<bin>, params...)> with_policy (<map policy>) ...] ON <ns>[.<set>] where PK=<key>
      
          <op> name of operation to perform.
          <bin> is the name of a bin.
          <params> parameters for operation.
          <map policy> map operation policy.
          <ns> is the namespace for the records to be queried.
          <set> is the set name for the record to be queried.
          <key> is the record's primary key.
      
      OP
          LIST_APPEND (<bin>, <val>)         
          LIST_INSERT (<bin>, <index>, <val>)
          LIST_SET    (<bin>, <index>, <val>)
          LIST_GET    (<bin>, <index>)       
          LIST_POP    (<bin>, <index>)       
          LIST_REMOVE (<bin>, <index>)       
          LIST_APPEND_ITEMS (<bin>, <list of vals>)         
          LIST_INSERT_ITEMS (<bin>, <index>, <list of vals>)
          LIST_GET_RANGE    (<bin>, <startindex>[, <count>])
          LIST_POP_RANGE    (<bin>, <startindex>[, <count>])
          LIST_REMOVE_RANGE (<bin>, <startindex>[, <count>])
          LIST_TRIM         (<bin>, <startindex>[, <count>])
          LIST_INCREMENT    (<bin>, <index>, <numeric val>) 
          LIST_CLEAR        (<bin>) 
          LIST_SIZE         (<bin>) 
          MAP_PUT             (<bin>, <key>, <val>) [with_policy (<map policy>)]
          MAP_PUT_ITEMS       (<bin>, <map>)  [with_policy (<map policy>)]
          MAP_INCREMENT       (<bin>, <key>, <numeric val>) [with_policy (<map policy>)]
          MAP_DECREMENT       (<bin>, <key>, <numeric val>) [with_policy (<map policy>)]
          MAP_GET_BY_KEY      (<bin>, <key>)  
          MAP_REMOVE_BY_KEY   (<bin>, <key>)  
          MAP_GET_BY_VALUE    (<bin>, <value>)
          MAP_REMOVE_BY_VALUE (<bin>, <value>)
          MAP_GET_BY_INDEX    (<bin>, <index>)
          MAP_REMOVE_BY_INDEX (<bin>, <index>)
          MAP_GET_BY_RANK     (<bin>, <rank>) 
          MAP_REMOVE_BY_RANK  (<bin>, <rank>) 
          MAP_REMOVE_BY_KEY_LIST    (<bin>, <list of keys>)         
          MAP_REMOVE_BY_VALUE_LIST  (<bin>, <list of vals>)         
          MAP_GET_BY_KEY_RANGE      (<bin>, <startkey>, <endkey>)   
          MAP_REMOVEBY_RANGE        (<bin>, <startkey>, <endkey>)   
          MAP_GET_BY_VALUE_RANGE    (<bin>, <startval>, <endval>)   
          MAP_REMOVE_BY_VALUE_RANGE (<bin>, <startval>, <endval>)   
          MAP_GET_BY_INDEX_RANGE    (<bin>, <startindex>[, <count>])
          MAP_REMOVE_BY_INDEX_RANGE (<bin>, <startindex>[, <count>])
          MAP_GET_BY_RANK_RANGE     (<bin>, <startrank> [, <count>])
          MAP_REMOVE_BY_RANK_RANGE  (<bin>, <startrank> [, <count>])
          MAP_CLEAR     (<bin>) 
          MAP_SET_TYPE  (<bin>, <map type>) 
          MAP_SIZE      (<bin>) 
          TOUCH   ()            
          READ    (<bin>)       
          WRITE   (<bin>, <val>)
          PREPEND (<bin>, <val>)
          APPEND  (<bin>, <val>)
          INCR    (<bin>, <numeric val>)
      
      Examples:
      
          OPERATE LIST_APPEND(listbin, 1), LIST_APPEND(listbin2, 10) ON test.demo where PK = 'key1'
          OPERATE LIST_POP_RANGE(listbin, 1, 10) ON test.demo where PK = 'key1'
      
      
##  QUERY
      SELECT <bins> FROM <ns>[.<set>]
      SELECT <bins> FROM <ns>[.<set>] WHERE <bin> = <value>
      SELECT <bins> FROM <ns>[.<set>] WHERE <bin> BETWEEN <lower> AND <upper>
      SELECT <bins> FROM <ns>[.<set>] WHERE PK = <key>
      SELECT <bins> FROM <ns>[.<set>] IN <indextype> WHERE <bin> = <value>
      SELECT <bins> FROM <ns>[.<set>] IN <indextype> WHERE <bin> BETWEEN <lower> AND <upper>
      SELECT <bins> FROM <ns>[.<set>] IN <indextype> WHERE <bin> CONTAINS <GeoJSONPoint>
      SELECT <bins> FROM <ns>[.<set>] IN <indextype> WHERE <bin> WITHIN <GeoJSONPolygon>
      
          <ns> is the namespace for the records to be queried.
          <set> is the set name for the record to be queried.
          <key> is the record's primary key.
          <bin> is the name of a bin.
          <value> is the value of a bin.
          <indextype> is the type of a index user wants to query. (LIST/MAPKEYS/MAPVALUES)
          <bins> can be either a wildcard (*) or a comma-separated list of bin names.
          <lower> is the lower bound for a numeric range query.
          <upper> is the lower bound for a numeric range query.
      
      Examples:
      
          SELECT * FROM test.demo
          SELECT * FROM test.demo WHERE PK = 'key1'
          SELECT foo, bar FROM test.demo WHERE PK = 'key1'
          SELECT foo, bar FROM test.demo WHERE foo = 123
          SELECT foo, bar FROM test.demo WHERE foo BETWEEN 0 AND 999
          SELECT * FROM test.demo WHERE gj CONTAINS CAST('{"type": "Point", "coordinates": [0.0, 0.0]}' AS GEOJSON)
      
##  AGGREGATION
      AGGREGATE <module>.<function>(<args>) ON <ns>[.<set>]
      AGGREGATE <module>.<function>(<args>) ON <ns>[.<set>] WHERE <bin> = <value>
      AGGREGATE <module>.<function>(<args>) ON <ns>[.<set>] WHERE <bin> BETWEEN <lower> AND <upper>
      
          <module> is UDF module containing the function to invoke.
          <function> is UDF to invoke.
          <args> is a comma-separated list of argument values for the UDF.
          <ns> is the namespace for the records to be queried.
          <set> is the set name for the record to be queried.
          <key> is the record's primary key.
          <bin> is the name of a bin.
          <value> is the value of a bin.
          <lower> is the lower bound for a numeric range query.
          <upper> is the lower bound for a numeric range query.
      
      Examples:
      
          AGGREGATE myudfs.udf2(2) ON test.demo WHERE foo = 123
          AGGREGATE myudfs.udf2(2) ON test.demo WHERE foo BETWEEN 0 AND 999
      
##  EXPLAIN
      EXPLAIN SELECT * FROM <ns>[.<set>] WHERE PK = <key>
      
          <ns> is the namespace for the records to be queried.
          <set> is the set name for the record to be queried.
          <key> is the record's primary key.
      
      Examples:
      
          EXPLAIN SELECT * FROM test.demo WHERE PK = 'key1'
      
      
##  INFO
      SHOW NAMESPACES | SETS | BINS | INDEXES
      SHOW SCANS | QUERIES
      STAT NAMESPACE <ns> | INDEX <ns> <indexname>
      STAT SYSTEM
      ASINFO <ASInfoCommand>
      
##  JOB MANAGEMENT
      KILL_QUERY <transaction_id>
      KILL_SCAN <scan_id>
      
##  USER ADMINISTRATION
      SHOW USER [<user>]
      SHOW USERS
      SHOW ROLE <role>
      SHOW ROLES
      
##  MANAGE UDFS
      SHOW MODULES
      DESC MODULE <filename>
      
          <filepath> is file path to the UDF module(in single quotes).
          <filename> is file name of the UDF module.
      
      Examples:
      
          SHOW MODULES
          DESC MODULE test.lua
      
##  RUN <filepath>
      
##  SYSTEM <bash command>
      
      
##  SETTINGS
        ECHO                          (true | false, default false)
        VERBOSE                       (true | false, default false)
        OUTPUT                        (TABLE | JSON | MUTE | RAW, default TABLE)
        OUTPUT_TYPES                  (true | false, default true)
        TIMEOUT                       (time in ms, default: 1000)
        LUA_USERPATH                  <path>, default : /opt/aerospike/usr/udf/lua
        USE_SMD                       (true | false, default false)
        RECORD_TTL                    (time in sec, default: 0)
        RECORD_PRINT_METADATA         (true | false, default false, prints record metadata)
        REPLICA_ANY                   (true | false, default false)
        KEY_SEND                      (true | false, default false)
        DURABLE_DELETE                (true | false, default false)
        FAIL_ON_CLUSTER_CHANGE        (true | false, default true, policy applies to scans)
        SCAN_PRIORITY                 priority of scan (LOW, MEDIUM, HIGH, AUTO), default : AUTO
        NO_BINS                       (true | false, default false, No bins as part of scan and query result)
        LINEARIZE_READ                (true | false, default false, Make read linearizable, applicable only for namespace with strong_consistency enabled.)
  
      
      To get the value of a setting, run:
        
          aql> GET <setting>
        
      To set the value of a setting, run:
        
          aql> SET <setting> <value>
        
      To reset the value of a setting back to default, run:
        
          aql> RESET <setting>
        
        
##    OTHER
        HELP
        QUIT|EXIT|Q


[下载地址](https://www.aerospike.com/download/server/5.5.0.7/) 
[安装教程](https://www.aerospike.com/docs/operations/install/index.html)
[参考资料](https://www.aerospike.com/docs/operations/install/linux/other/)

# 案例

> 条件：数据库已成功运行


[aerospike-sample-applications](https://github.com/aerospike-examples/aerospike-sample-applications)

导入客户端依赖

```xml
<dependencies>
  <dependency>
    <groupId>com.aerospike</groupId>
    <artifactId>aerospike-client</artifactId>
    <version>5.0.0</version>
  </dependency>
</dependencies>
```

简单测试

```java
import com.aerospike.client.AerospikeClient;
import com.aerospike.client.policy.WritePolicy;
import com.aerospike.client.Bin;
import com.aerospike.client.Key;
import com.aerospike.client.Record;
import com.aerospike.client.Value;

public class Test{
    public static void putRecordGetRecord () {
        AerospikeClient client = new AerospikeClient("localhost", 3000);

        Key key = new Key("test", "demo", "putgetkey");
        Bin bin1 = new Bin("bin1", "value1");
        Bin bin2 = new Bin("bin2", "value2");

        // Write a record
        client.put(null, key, bin1, bin2);

        // Read a record
        Record record = client.get(null, key);
        client.close();   
        System.out.println("Record values are:");
        System.out.println(record);
    }
}
```

# 资料

[aerospike-dev-notebooks](https://github.com/aerospike/aerospike-dev-notebooks.docker)

https://www.developer.aerospike.com/

[aerospike-sample-applications](https://github.com/aerospike-examples/aerospike-sample-applications)  


 