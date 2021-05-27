---
title: 笔记篇-Google guava快速入门
index_img: 'https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/google-guava.jpg'
hide: false
date: 2021-04-11 10:05:57
category: 学习笔记
tags: Guava
---

# 简介

>Guava是一种基于开源的Java库，其中包含谷歌正在由他们很多项目使用的很多核心库。这个库是为了方便编码，并减少编码错误。这个库提供用于集合，缓存，支持原语，并发性，常见注解，字符串处理，I/O和验证的实用方法。

# 特点

- 标准化 - Guava库是由谷歌托管。
- 高效 - 可靠，快速和有效的扩展JAVA标准库
- 优化 -Guava库经过高度的优化。

# 入门

```xml
<dependency>
  <groupId>com.google.guava</groupId>
  <artifactId>guava</artifactId>
  <version>30.1.1-jre</version>
  <!-- or, for Android: -->
  <version>30.1.1-android</version>
</dependency>
```

# 教程

Guava 的 Java 反射机制工具类

## 基本工具

 Make using the Java language more pleasant.

- [Using and avoiding null](https://github.com/google/guava/wiki/UsingAndAvoidingNullExplained): `null` can be ambiguous, can cause confusing errors, and is sometimes just plain unpleasant. Many Guava utilities reject and fail fast on nulls, rather than accepting them blindly.
- [Preconditions](https://github.com/google/guava/wiki/PreconditionsExplained): Test preconditions for your methods more easily.
- [Common object methods](https://github.com/google/guava/wiki/CommonObjectUtilitiesExplained): Simplify implementing `Object` methods, like `hashCode()` and `toString()`.
- [Ordering](https://github.com/google/guava/wiki/OrderingExplained): Guava's powerful "fluent `Comparator`" class.
- [Throwables](https://github.com/google/guava/wiki/ThrowablesExplained): Simplify propagating and examining exceptions and errors.

## 集合

 Guava's extensions to the JDK collections ecosystem. These are some of the most mature and popular parts of Guava.

- [Immutable collections](https://github.com/google/guava/wiki/ImmutableCollectionsExplained), for defensive programming, constant collections, and improved efficiency.
- [New collection types](https://github.com/google/guava/wiki/NewCollectionTypesExplained), for use cases that the JDK collections don't address as well as they could: multisets, multimaps, tables, bidirectional maps, and more.
- [Powerful collection utilities](https://github.com/google/guava/wiki/CollectionUtilitiesExplained), for common operations not provided in `java.util.Collections`.
- [Extension utilities](https://github.com/google/guava/wiki/CollectionHelpersExplained): writing a `Collection` decorator? Implementing `Iterator`? We can make that easier.

## 图表

a library for modeling graph

- structured data, that is, entities and the relationships between them. Key features include:

- [Graph](https://github.com/google/guava/wiki/GraphsExplained#graph): a graph whose edges are anonymous entities with no identity or information of their own.
- [ValueGraph](https://github.com/google/guava/wiki/GraphsExplained#valuegraph): a graph whose edges have associated non-unique values.
- [Network](https://github.com/google/guava/wiki/GraphsExplained#network): a graph whose edges are unique objects.
- Support for graphs that are mutable and immutable, directed and undirected, and several other properties.

## 缓存

[缓存](https://github.com/google/guava/wiki/CachesExplained): Local caching, done right, and supporting a wide variety of expiration behaviors.

## 函数式编程

- [函数式编程](https://github.com/google/guava/wiki/FunctionalExplained): Used sparingly, Guava's functional idioms can significantly simplify code.

## 并发

- 并发: Powerful, simple abstractions to make it easier to write correct concurrent code.
  - [ListenableFuture](https://github.com/google/guava/wiki/ListenableFutureExplained): Futures, with callbacks when they are finished.
  - [Service](https://github.com/google/guava/wiki/ServiceExplained): Things that start up and shut down, taking care of the difficult state logic for you.

## 字符操作

- [字符操作](https://github.com/google/guava/wiki/StringsExplained): A few extremely useful string utilities: splitting, joining, padding, and more.

## 原生类型

- [原生类型](https://github.com/google/guava/wiki/PrimitivesExplained): operations on primitive types, like `int` and `char`, not provided by the JDK, including unsigned variants for some types.

## 区间

- [区间](https://github.com/google/guava/wiki/RangesExplained): Guava's powerful API for dealing with ranges on `Comparable` types, both continuous and discrete.

## I/O

- [I/O](https://github.com/google/guava/wiki/IOExplained): Simplified I/O operations, especially on whole I/O streams and files, for Java 5 and 6.

## 哈希

- [哈希](https://github.com/google/guava/wiki/HashingExplained): Tools for more sophisticated hashes than what's provided by `Object.hashCode()`, including Bloom filters.

## 事件总线

- [事件总线](https://github.com/google/guava/wiki/EventBusExplained): Publish-subscribe-style communication between components without requiring the components to explicitly register with one another.

## 数学运算

- [数学运算](https://github.com/google/guava/wiki/MathExplained): Optimized, thoroughly tested math utilities not provided by the JDK.

## 反射

- [反射](https://github.com/google/guava/wiki/ReflectionExplained): Guava utilities for Java's reflective capabilities.

# 参考

[官方文档](https://github.com/google/guava/wiki)

[github guava 地址](https://github.com/google/guava)

https://www.baeldung.com/guava-guide   


 