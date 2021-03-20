---
title: Elasticsearch-分布式搜索和分析引擎
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/elasticsearch.jpg
hide: false
date: 2021-01-21 22:36:59
category: 中间件
tags: 搜索引擎
---

# 软件简介

>Elasticsearch 是一个分布式、RESTful 风格的搜索和数据分析引擎，能够解决不断涌现出的各种用例。 作为 Elastic Stack 的核心。其底层是基于Lucene

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

[quick start](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/getting-started-index.html)

格式

`curl -X<VERB> '<PROTOCOL>://<HOST>:<PORT>/<PATH>?<QUERY_STRING>' -d '<BODY>'`

创建Mapping

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

插入数据
```
PUT /post/_doc/1
{
  "id":"1",
  "title":"麦奇的文章",
  "conttext":"按价格卡机是发动机案件发到付件阿里山的房间爱看书的积分"
}
'
```

查询数据

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



修改数据
```text
curl -X POST "localhost:9200/customer/doc/1/_update?pretty&pretty" -H 'Content-Type: application/json' -d'
{
  "doc": { "name": "Jane Doe" }
}
'
```


删除数据
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





# 参考资料

[官方文档](https://www.elastic.co/guide/index.html)

[Elasticsearch简介与实战](https://www.jianshu.com/p/d48c32423789)

[倒排索引](https://www.elastic.co/guide/cn/elasticsearch/guide/current/inverted-index.html)