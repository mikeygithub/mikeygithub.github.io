---
title: 中间件篇-Elasticsearch分布式搜索和分析引擎
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/elasticsearch.jpg
hide: false
date: 2021-01-21 22:36:59
category: 中间件
tags: 搜索引擎
---

# 软件简介

>Elasticsearch 是一个分布式、RESTful 风格的搜索和数据分析引擎，能够解决不断涌现出的各种用例。 作为 Elastic Stack 的核心。其底层是基于Lucene

# 基础概念

## 1、索引

ElasticSearch将数据存储在一个或多个索引（index）中，这里的索引就像SQL领域的数据库，例如：MySQL里的一个database。

ElasticSearch内部使用Apache Lucenu将数据写入索引或从索引中读取数据。需要注意的是，ElasticSearch中的索引可能有一个或多个Lucene索引构成，具体由索引分片（shard）、复制（replica）机制及其配置决定。

## 2、文档

文档（document）是ElasticSearch中的主要实体。对于所有使用ElasticSearch的场景，最终都会归结到对文档的搜索之上。

文档由字段构成，每个字段包含字段和一个或多个字段值（这种情况下，该字段被称为是多值的，即文档中有多个同名字段）。文档之间可能有各自不同的字段集合，文档没有固定的结构或模式。

从客户端的视角来看，文档就是一个json对象。

## 3、类型

ElasticSearch中每个文档都有自己的类型（type）定义。一个索引中允许存储多种类型的文档，并为不同文档类型提供不同的映射。

类型就像SQL数据库中的一个数据表。

## 4、映射

所有文档在写入索引前都将被分析，而映射则存储着所有分析链所需要的全部信息。例如，如何将输入文本分割为词条，哪些词条应该被过滤掉，或哪些附加处理有必要被调用（例如处理HTML标签）等。

## 5、节点

单个的ElasticSearch服务实例被称为节点（node）。大多数情况下，一个ElasticSearch节点就能够满足我们大多数的需求，但是考虑到容错性和数据快速膨胀，我们需要搭建ElasticSearch集群。

ElasticSearch节点可以按用途分为3类。

- `数据（data）节点：`用来存放数据，提供数据的搜索能力。
- `主（master）节点：`作为监控节点负责控制其他节点的工作。
- `部落（tribe）节点：`负责串联起多个集群，使得我们在多个集群上执行几乎所有可以在单集群ElasticSearch上执行的功能。

## 6、集群

多个协同工作的ElasticSearch节点的集合被称为集群（cluster）。

ElasticSearch的分布式属性使得我们可以轻松处理超过单机负载能力的数据量。同时，集群也是一种无间断提供服务的一种解决方案，即便当某些节点因为宕机或执行管理任务（例如升级）不可用时，ElasticSearch几乎是无缝继承了集群功能。

## 7、分片

ElasticSearch集群允许系统存储的数据总量超过单机容量，为了实现这个功能，ES将数据散布到多个物理的Lucene索引上去，这些Lucene索引被称为分片（shard)，散布这些分片的过程叫做分片处理（sharding）。ElasticSearch会自动完成分片工作，对用户来说分片更像是一个大的索引。

当然，除了ElasticSearch自动进行分片处理外，用户为具体的应用进行参数调优也至关重要，因为分片的数量在索引创建时就被配置好了，之后无法改变，除非创建一个新索引并重新索引全部数据。

## 8、副本

分片处理允许用户推送超过单机容量的数据至ElasticSearch集群。副本（replica）则解决了访问压力过大时单机无法处理所有请求的问题。

实现方法很简单，为每个分片创建冗余的副本，处理查询时可以把这些副本当做最初的主分片（primary shard）使用。

如果主分片所在的主机宕机了，ElasticSearch会自动从该分片的副本中选出一个当做新的主分片，不会中断索引和搜索服务，并且可以在任意时间节点添加或删除副本，可随时调整副本的数量。

# 快速开始

[下载软件](https://www.elastic.co/downloads/elasticsearch)

```jshelllanguage
curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.10.2-linux-x86_64.tar.gz
tar -xzvf elasticsearch-7.10.2-linux-x86_64.tar.gz
cd elasticsearch-7.10.2
./bin/elasticsearch
```

华为云加速`wget https://mirrors.huaweicloud.com/elasticsearch/7.9.3/elasticsearch-7.9.3-linux-x86_64.tar.gz`

<p class="note note-danger">
无法使用root启动
</p>

```text
can not run elasticsearch as root
```

1、创建用户：elasticsearch

```jshelllanguage
adduser elasticsearch
```
2、创建用户密码，需要输入两次
```jshelllanguage
passwd elasticsearch
```
3、将对应的文件夹权限赋给该用户
```jshelllanguage
chown -R elasticsearch elasticsearch-6.0.0
```
4、切换至elasticsearch用户
```jshelllanguage
su elasticsearch
```
5、进入启动目录启动 /usr/local/elasticsearch-6.0.0/bin  使用后台启动方式：./elasticsearch -d
```jshelllanguage
./elasticsearch -d
```
6、启动后测试
```jshelllanguage
curl ip:9200
```
如果返回一个json数据说明启动成功

```jshelllanguage
{
  "name" : "mikey",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "02UVRTOaS7mSdfs2oRc43A",
  "version" : {
    "number" : "7.9.3",
    "build_flavor" : "default",
    "build_type" : "tar",
    "build_hash" : "c4138e51121ef06a6404866cddc601906fe5c868",
    "build_date" : "2020-10-16T10:36:16.141335Z",
    "build_snapshot" : false,
    "lucene_version" : "8.6.2",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

# Kibana

>Kibana是一个开源分析和可视化平台，旨在与Elasticsearch合作。您可以使用Kibana来搜索、查看和交互存储在Elasticsearch索引中的数据。您可以轻松地执行高级数据分析，并在各种图表、表格和地图中可视化数据。

下载
```jshelllanguage
curl -L -O https://artifacts.elastic.co/downloads/kibana/kibana-7.10.2-linux-x86_64.tar.gz
tar xzvf kibana-7.10.2-linux-x86_64.tar.gz
cd kibana-7.10.2-linux-x86_64/
```

```jshelllanguage
# 修改配置文件
vim config/kibana.yml
# 添加任何ip都可以访问
server.host: "0.0.0.0"
# 默认语言改为中文
i18n.locale: "zh-CN"
```
启动
```
./bin/kibana
```

打开`http://localhost:5601/`，进入控制台即可对数据进行操作

![image-20210318215614354](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/image-20210318215614354.png)

华为云加速`wget https://mirrors.huaweicloud.com/kibana/7.9.3/kibana-7.9.3-linux-x86_64.tar.gz`

# 快速入门

[QUICK START](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/getting-started-index.html)

## 请求格式

`curl -X<VERB> '<PROTOCOL>://<HOST>:<PORT>/<PATH>?<QUERY_STRING>' -d '<BODY>'`

| `VERB`         | 适当的 HTTP *方法* 或 *谓词* : `GET`、 `POST`、 `PUT`、 `HEAD` 或者 `DELETE`。 |
| -------------- | ------------------------------------------------------------ |
| `PROTOCOL`     | `http` 或者 `https`（如果你在 Elasticsearch 前面有一个 `https` 代理） |
| `HOST`         | Elasticsearch 集群中任意节点的主机名，或者用 `localhost` 代表本地机器上的节点。 |
| `PORT`         | 运行 Elasticsearch HTTP 服务的端口号，默认是 `9200` 。       |
| `PATH`         | API 的终端路径（例如 `_count` 将返回集群中文档数量）。Path 可能包含多个组件，例如：`_cluster/stats` 和 `_nodes/stats/jvm` 。 |
| `QUERY_STRING` | 任意可选的查询字符串参数 (例如 `?pretty` 将格式化地输出 JSON 返回值，使其更容易阅读) |
| `BODY`         | 一个 JSON 格式的请求体 (如果请求需要的话)                    |

## 创建Mapping

```http request
PUT /post
{
  "settings":{
    "number_of_shards":3,
    "number_of_replicas":2
  },
  "mappings":{
    "properties":{
      "id":{"type":"long"},
      "title":{"type":"text"},
      "context":{"type":"text"}
    }
  }
 
}
```

## 插入数据

格式

```js
PUT /{index}/{type}/{id}
{
  "field": "value",
  ...
}
```
实例
```
PUT /post/_doc/1
{
  "id":"1",
  "title":"麦奇的文章",
  "conttext":"按价格卡机是发动机案件发到付件阿里山的房间爱看书的积分"
}
'
```

## 查询数据

```http request
GET /post/_doc/1
```
返回数据
```json
{
  "_index" : "post",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "_seq_no" : 0,
  "_primary_term" : 1,
  "found" : true,
  "_source" : {
    "id" : "1",
    "title" : "麦奇的文章",
    "conttext" : "按价格卡机是发动机案件发到付件阿里山的房间爱看书的积分"
  }
}
```

curl参考
```js
curl -X GET "localhost:9200/customer/doc/1?pretty&pretty" -H 'Content-Type: application/json' -d'
```

## 过滤查询

 查询last_name=Leo的记录

```http
GET /employee/_search?q=last_name:Leo
```

表达式查询

```http
curl -X GET "localhost:9200/megacorp/employee/_search?pretty" -H 'Content-Type: application/json' -d'
{
    "query" : {
        "match" : {
            "last_name" : "Smith"
        }
    }
}
'
```

过滤查询

```http
curl -X GET "localhost:9200/megacorp/employee/_search?pretty" -H 'Content-Type: application/json' -d'
{
    "query" : {
        "bool": {
            "must": {
                "match" : {
                    "last_name" : "smith" 
                }
            },
            "filter": {
                "range" : {
                    "age" : { "gt" : 30 } 
                }
            }
        }
    }
}
'
```

全文搜索

```http
curl -X GET "localhost:9200/megacorp/employee/_search?pretty" -H 'Content-Type: application/json' -d'
{
    "query" : {
        "match" : {
            "about" : "rock climbing"
        }
    }
}
'
```

精确查询

```http
curl -X GET "localhost:9200/megacorp/employee/_search?pretty" -H 'Content-Type: application/json' -d'
{
    "query" : {
        "match_phrase" : {
            "about" : "rock climbing"
        }
    }
}'
```

高亮搜索

```http
curl -X GET "localhost:9200/megacorp/employee/_search?pretty" -H 'Content-Type: application/json' -d'
{
    "query" : {
        "match_phrase" : {
            "about" : "rock climbing"
        }
    },
    "highlight": {
        "fields" : {
            "about" : {}
        }
    }
}'
```

## 统计查询

```http
curl -X GET "localhost:9200/megacorp/employee/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "aggs": {
    "all_interests": {
      "terms": { "field": "interests" }
    }
  }
}'
```

## 修改数据

```http
PUT /blog/_doc/123
{
  "title": "My first blog entry update",
  "text":  "I am starting to get the hang of this...",
  "date":  "2014/01/02",
  "remark": "hhhhhhhhhhhhhhhhhh"
}
```

CURL

```text
curl -X POST "localhost:9200/customer/doc/1/_update?pretty&pretty" -H 'Content-Type: application/json' -d'
{
  "doc": { "name": "Jane Doe" }
}
'
```

## 删除数据

```http
DELETE /blog/_doc/123
```

CURL

```text
curl -X DELETE "localhost:9200/customer/doc/2?pretty&pretty"
```

批处理
```text
curl -X POST "localhost:9200/customer/doc/_bulk?pretty&pretty" -H 'Content-Type: application/json' -d'
{"index":{"_id":"1"}}
{"name": "John Doe" }
{"index":{"_id":"2"}}
{"name": "Jane Doe" }
'
```

# 代码实操

依赖添加
```xml
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-client</artifactId>
    <version>7.11.2</version>
</dependency>
```
在使用前先创建其对应的[Mapping](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/mapping.html)
```http request
PUT /consumer
{
  "settings":{
    "number_of_shards":3,
    "number_of_replicas":2
  },
  "mappings":{
    "properties":{
      "first_name":{"type":"text"},
      "last_name":{"type":"text"},
      "age":{"type":"long"},
      "about":{"type": "text"},
      "interests":{"type": "text"}
    }
  }
}
```

初始化
```java
RestClient restClient = RestClient.builder(new HttpHost("localhost", 9200, "http")).build();
```

简单查询操作

```java
public class Elasticsearch {
    public static void main(String[] args) throws Exception{
        RestClient restClient = RestClient.builder(new HttpHost("localhost", 9200, "http")).build();
        Response response = restClient.performRequest(new Request("GET", "/customer/_doc/1"));
        RequestLine requestLine = response.getRequestLine();
        HttpHost host = response.getHost();
        int statusCode = response.getStatusLine().getStatusCode();
        Header[] headers = response.getHeaders();
        String responseBody = EntityUtils.toString(response.getEntity());
        System.out.println(responseBody.toString());
    }
}
```

异步调用

```java
    @Test
    public void get() throws Exception{
        RestClient restClient = RestClient.builder(new HttpHost("localhost", 9200, "http")).build();
        Request request = new Request(
                "GET",
                "/customer/_doc/1");
        Cancellable cancellable = restClient.performRequestAsync(request,
                new ResponseListener() {
                    @Override
                    public void onSuccess(Response response) {
                        try {
                            System.out.println("请求成功："+ EntityUtils.toString(response.getEntity()).toString());
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Exception exception) {
                        System.out.println("请求异常："+exception.getStackTrace());
                    }
                });
    }
```

# 详细介绍

**Index Versus Index Versus Index**

你也许已经注意到 *索引* 这个词在 Elasticsearch 语境中有多种含义， 这里有必要做一些说明：

索引（名词）：

如前所述，一个 *索引* 类似于传统关系数据库中的一个 *数据库* ，是一个存储关系型文档的地方。 *索引* (*index*) 的复数词为 *indices* 或 *indexes* 。

索引（动词）：

*索引一个文档* 就是存储一个文档到一个 *索引* （名词）中以便被检索和查询。这非常类似于 SQL 语句中的 `INSERT` 关键词，除了文档已存在时，新文档会替换旧文档情况之外。

倒排索引：

关系型数据库通过增加一个 *索引* 比如一个 B树（B-tree）索引 到指定的列上，以便提升数据检索速度。Elasticsearch 和 Lucene 使用了一个叫做 *倒排索引* 的结构来达到相同的目的。

\+ 默认的，一个文档中的每一个属性都是 *被索引* 的（有一个倒排索引）和可搜索的。一个没有倒排索引的属性是不能被搜索到的。




[Elasticsearch: 权威指南](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html)


# 参考资料

[官方文档](https://www.elastic.co/guide/index.html)

[Elasticsearch简介与实战](https://www.jianshu.com/p/d48c32423789)

[倒排索引](https://www.elastic.co/guide/cn/elasticsearch/guide/current/inverted-index.html)