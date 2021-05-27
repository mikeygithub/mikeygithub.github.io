---
title: 笔记篇-Lua-脚本学习
date: 2020-05-02 23:32:53
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/luaa.gif
category: 学习笔记
tags: lua
---

# 简介

>Lua is free software distributed in source code. It may be used for any purpose, including commercial purposes, at absolutely no cost.
Lua 是一种轻量小巧的脚本语言，用标准C语言编写并以源代码形式开放， 其设计目的是为了嵌入应用程序中，从而为应用程序提供灵活的扩展和定制功能。

Lua 是巴西里约热内卢天主教大学（Pontifical Catholic University of Rio de Janeiro）里的一个研究小组于 1993 年开发的，该小组成员有：`Roberto Ierusalimschy`、`Waldemar Celes` 和 `Luiz Henrique de Figueiredo`。

## 设计目的

其设计目的是为了嵌入应用程序中，从而为应用程序提供灵活的扩展和定制功能。

## Lua 特性

- 轻量级: 它用标准C语言编写并以源代码形式开放，编译后仅仅一百余K，可以很方便的嵌入别的程序里。
- 可扩展: Lua提供了非常易于使用的扩展接口和机制：由宿主语言(通常是C或C++)提供这些功能，Lua可以使用它们，就像是本来就内置的功能一样。

## 其它特性:
- 支持面向过程(procedure-oriented)编程和函数式编程(functional programming)；
- 自动内存管理；只提供了一种通用类型的表（table），用它可以实现数组，哈希表，集合，对象；
- 语言内置模式匹配；闭包(closure)；函数也可以看做一个值；提供多线程（协同进程，并非操作系统所支持的线程）支持；
- 通过闭包和table可以很方便地支持面向对象编程所需要的一些关键机制，比如数据抽象，虚函数，继承和重载等。

# Lua 应用场景

- 游戏开发
- 独立应用脚本
- Web 应用脚本
- 扩展和数据库插件如：MySQL Proxy 和 MySQL WorkBench
- 安全系统，如入侵检测系统

# 安装

````bash
curl -R -O http://www.lua.org/ftp/lua-5.3.5.tar.gz
tar zxf lua-5.3.5.tar.gz
cd lua-5.3.5
make linux test
````
编译出错  
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/complie-error.png)  
解决方法  
````sudo apt-get install libreadline7 libreadline-dev````  
重新编译  
`make linux test`  
创建软连接    
`sudo ln -s /home/mikey/DATA/DevTools/lua-5.3.5/src/lua /usr/bin/lua`  
测试  
```
mikey@localhost: lua
Lua 5.3.5  Copyright (C) 1994-2018 Lua.org, PUC-Rio
> print("Hello Mikey")
Hello Mikey
> ```  

# Lua 数据库访问

Lua 数据库的操作库：LuaSQL。开源，支持的数据库有：ODBC, ADO, Oracle, MySQL, SQLite 和 PostgreSQL。  

LuaSQL 可以使用 LuaRocks 来安装可以根据需要安装你需要的数据库驱动。  

LuaRocks 安装方法：

````
$ wget http://luarocks.org/releases/luarocks-2.2.1.tar.gz
$ tar zxpf luarocks-2.2.1.tar.gz
$ cd luarocks-2.2.1
$ ./configure; sudo make bootstrap
$ sudo luarocks install luasocket
$ lua
Lua 5.3.0 Copyright (C) 1994-2015 Lua.org, PUC-Rio
> require "socket"
Window 下安装 LuaRocks：`https://github.com/keplerproject/luarocks/wiki/Installation-instructions-for-Windows`
````


安装不同数据库驱动：
````
luarocks install luasql-sqlite3
luarocks install luasql-postgres
luarocks install luasql-mysql
luarocks install luasql-sqlite
luarocks install luasql-odbc
````  
你也可以使用源码安装方式，Lua Github 源码地址：`https://github.com/keplerproject/luasql`

Lua 连接MySql 数据库：

````
实例
require "luasql.mysql"

--创建环境对象
env = luasql.mysql()

--连接数据库
conn = env:connect("数据库名","用户名","密码","IP地址",端口)

--设置数据库的编码格式
conn:execute"SET NAMES UTF8"

--执行数据库操作
cur = conn:execute("select * from role")

row = cur:fetch({},"a")

--文件对象的创建
file = io.open("role.txt","w+");

while row do
    var = string.format("%d %s\n", row.id, row.name)

    print(var)

    file:write(var)

    row = cur:fetch(row,"a")
end


file:close()  --关闭文件对象
conn:close()  --关闭数据库连接
env:close()   --关闭数据库环境
````



# 参考资料

[菜鸟教程](https://www.runoob.com/lua/lua-tutorial.html)
[官方手册](https://www.runoob.com/manual/lua53doc/)  


 