---
title: Java篇-Java解析大型XML文件
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/xml.jpeg'
hide: false
date: 2021-03-29 22:04:38
category: Java相关
tags: 解析XML文件
---

# 项目背景

在一个伸手不见五指的夜晚，开完了漫长的会议后，正准备拔腿就跑的我被Leader逮了个正着，对着我说“我这里有个XML文档需要你帮我解析一下，把解析的内容放入MySQL中”，我心想之前也解析过XML问题应该不大，就爽快的接下了。回到家里打开电脑一看，好家伙5.8G的XML文件，我当时心里？？？

![WeChat Image_20210329225917](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/WeChatImage_20210329225917.png)

好家伙那，我是不是得考虑分片处理了？仔细想想分片了如何对其进行解析呢？会不会加大其解析复杂的了？先不管那么多了，看看他给的结构文档吧，刚打开一看？？？

![](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/image-20210329232408817.png)

这也太多了吧129页，大概瞄了两眼，里面都是描述XML文件中的各个数据组成结构的，涉及到的内容非常繁杂，后面才发现里面写的案例确实是非常的规范，光看文档都化费我好多时间、项目还有一堆BUG等着我呢。

![QQ图片20210329230950](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/aaa.gif)





# 解析思路

通过查阅资料我们知道Java解析XML的方式主要有SAX和DOM两种方式，前者它逐行扫描文档，一边扫描一边解析。而且相比于DOM，SAX可以在解析文档的任意时刻停止解析，后者操作更加灵活但是需要将整个文件加入内存，考虑到文件的大小问题，我们选择前者来进行解析。另外一方面我们需要考虑到文件里的数据组成结构的问题，通过文档可以看出，主要由以下几项组成，标准订阅源的基本 XML 元素:

- PFA

- CountryList

- OccupationList

- RelationshipList

- SanctionsReferencesList

- Description1List

- Description2List

- Description3List

- DateTypeList

- NameTypeList

- RoleTypeList

- Records

- Associations

  其中,<PFA> 是根元素，考虑到需要建立关联关系，对应其每个数据结构建立其对应的数据库表，在解析的过程中将数据线信息存入即可，使用批处理进行数据的插入，保证一定的效率，心想问题应该不大，明天开工解析。

  ![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/img.jk51.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg)

# 开工解析

先对其进行建立对应的数据库表，采用逆向工程生成对应的实体类，SAX的解析方法是通过继承SAX的处理器来实现具体的解析规则，如DefaultHandler的对应方法如下所示：

```java
resolveEntity
notationDecl
unparsedEntityDecl
setDocumentLocator//设置文档位置
startDocument//开始解析文档钩子函数
endDocument//结束解析文档
startPrefixMapping
endPrefixMapping
startElement//开始解析元素
endElement//元素完成解析
characters//解析内容(标签包含的值)
ignorableWhitespace
processingInstruction
skippedEntity
warning
error
fatalError
```

当然因为上面涉及的十多个列表各自的属性类型都不一样，需要编写对应的处理器来进行解析，数据库插入采用最底层的JDBC来进行批量操作，为的是提高效率。



解析工厂

```java
public class SaxService {

    public static void ReadXML(String uri, String NodeName, DefaultHandler handler) {
        try {
            // 创建一个解析XML的工厂对象
            SAXParserFactory parserFactory = SAXParserFactory.newInstance();
            // 创建一个解析XML的对象
            SAXParser parser = parserFactory.newSAXParser();
            // 创建一个解析助手类
            ParsePersonHandler parsePersonHandler = new ParsePersonHandler();
            parser.parse(uri,handler);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {

        }
    }
}
```

对应的解析处理器

```java
public class ParseHandler extends DefaultHandler {

    int flag = 0;
    // 开始解析文档，即开始解析XML根元素时调用该方法
    @Override
    public void startDocument() throws SAXException {
        System.out.println("开始解析XML文档");
    }
    // 开始解析每个元素时都会调用该方法
    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        //TODO
    }

    // 解析到每个元素的内容时会调用此方法
    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        //TODO
    }

    // 每个元素结束的时候都会调用该方法
    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException {
		//TODO
    }
    // 结束解析文档，即解析根元素结束标签时调用该方法
    @Override
    public void endDocument() throws SAXException {
        super.endDocument();
    }
}
```



# 优化手段

1.在数据库设计时候其对应的字段长度设计尽量规范。

2.可以将一些简单列表进行序列化存储在字段中，无需建立相关对应的表。

3.插入数据时尽量选择批量插入，提高效率。





终于把这个东西给搞定了，占用了８个G的数据，可以交差了。

![img](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/u=2093565416,3902274772&fm=26&gp=0.jpg)

# 参考资料

[项目代码](https://github.com/mikeygithub/parse-xml.git)   


 