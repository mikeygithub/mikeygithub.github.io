---
title: Java篇-枚举的使用
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/javamj.png'
hide: false
password: ''
date: 2018-03-09 23:47:04
category: Java相关
tags: 枚举
---

# 简介

>

Enum是所有 Java 语言枚举类型的公共基本类（注意Enum是抽象类），以下是它的常见方法：

| 返回类型 | 方法名称 | 方法说明 |
| -------- | -------- | -------- |
|int	|compareTo(E o)|	比较此枚举与指定对象的顺序|
|boolean|	equals(Object other)|	当指定对象等于此枚举常量时，返回 true。|
|Class<?>|	getDeclaringClass()	|返回与此枚举常量的枚举类型相对应的 Class 对象|
|String|	name()	|返回此枚举常量的名称，在其枚举声明中对其进行声明|
|int|	ordinal()|	返回枚举常量的序数|（它在枚举声明中的位置，其中初始常量序数为零）|
|String|	toString()	|返回枚举常量的名称，它包含在声明中|
|static<T extends Enum<T>> T	|static valueOf(Class<T> enumType, String name)	|返回带指定名称的指定枚举类型的枚举常量。|


# 案例


定义枚举类型
```java
package com.enumdemo;

public class Main {

    public static void main(String[] args) {

        HttpRequestMethod httpRequestMethod = HttpRequestMethod.POST;

        System.out.println(httpRequestMethod.name());
        System.out.println(httpRequestMethod.getType());
        System.out.println(httpRequestMethod.getDesc());

        String getHttpRequestMethod = "GET";

        switch (HttpRequestMethod.valueOf(getHttpRequestMethod)){
            case GET:
                System.out.println(HttpRequestMethod.GET.getDesc());
        }

    }
}
```

简单使用
```java
package com.enumdemo;
/**
 *http请求枚举类型
 */
public enum HttpRequestMethod {
    //每个枚举成员实际上是一个枚举实例
    GET("get","这是一个get请求"),
    POST("post","这是一个post请求"),
    PUT("put","这是一个put请求"),
    DELETE("delete","这是一个delete请求"),
    OPTIONS("option","这是一个option请求"),
    PATCH("patch","这是一个patch请求"),
    TRACE("trace","这是一个trace请求"),
    CONNECT("connect","这是一个connect请求");
    //类型
    private String type;
    //描述
    private String desc;
    //私有化构造函数
    private HttpRequestMethod(String type,String desc){
        this.type=type;
        this.desc=desc;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }
}
```

# 参考

[Java 枚举(enum) 详解7种常见的用法](https://blog.csdn.net/qq_39949109/article/details/80432477)   


 