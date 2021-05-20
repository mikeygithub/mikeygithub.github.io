---
title: 数据库篇-SQL之COUNT函数详解
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/sql-count.png
hide: false
date: 2021-01-11 23:46:05
category: 数据库
tags: 聚合函数
---

# COUNT 函数用法

>COUNT() 函数返回匹配指定条件的行数。
<p class="note note-primary">
   SQL COUNT(column_name) 语法 
</p>


>COUNT(column_name) 函数返回指定列的值的数目（`NULL 不计入`）：

```sql
SELECT COUNT(column_name) FROM table_name;
```

<p class="note note-primary">
   SQL COUNT(*) 语法
</p>

>COUNT(*) 函数返回表中的记录数：

```sql
SELECT COUNT(*) FROM table_name;
```

<p class="note note-primary">
   SQL COUNT(DISTINCT column_name) 语法 
</p>

>COUNT(DISTINCT column_name) 函数返回指定列的不同值的数目：

```sql
SELECT COUNT(DISTINCT column_name) FROM table_name;
```

注释：`COUNT(DISTINCT) 适用于 ORACLE 和 Microsoft SQL Server，但是无法用于 Microsoft Access。`

# 区别

>COUNT(常量) 和 COUNT(\*)表示的是直接查询符合条件的数据库表的行数。而COUNT(列名)表示的是查询符合条件的列的值不为NULL的行数。

# 性能

```text
count(*)和count(1)执行的效率是完全一样的。
count(*)的执行效率比count(col)高，因此可以用count(*)的时候就不要去用count(col)。
count(col)的执行效率比count(distinct col)高，不过这个结论的意义不大，这两种方法也是看需要去用。
如果是对特定的列做count的话建立这个列的非聚集索引能对count有很大的帮助。
如果经常count(*)的话则可以找一个最小的col建立非聚集索引以避免全表扫描而影响整体性能。
在不加WHERE限制条件的情况下，COUNT(*)与COUNT(COL)基本可以认为是等价的；
但是在有WHERE限制条件的情况下，COUNT(*)会比COUNT(COL)快非常多；
count(0)=count(1)=count(*)
1. count(指定的有效值)--执行计划都会转化为count(*)
2. 如果指定的是列名，会判断是否有null，null不计算
```

# COUNT常见问题

1、COUNT有几种用法？

2、COUNT(字段名)和COUNT(*)的查询结果有什么不同？

3、COUNT(1)和COUNT(*)之间有什么不同？

4、COUNT(1)和COUNT(*)之间的效率哪个更高？

5、为什么《阿里巴巴Java开发手册》建议使用COUNT(*)

6、MySQL的MyISAM引擎对COUNT(*)做了哪些优化？

7、MySQL的InnoDB引擎对COUNT(*)做了哪些优化？

8、上面提到的MySQL对COUNT(*)做的优化，有一个关键的前提是什么？

9、SELECT COUNT(*) 的时候，加不加where条件有差别吗？

10、COUNT(*)、COUNT(1)和COUNT(字段名)的执行过程是怎样的？


 