---
title: Golang篇-Gin学习笔记
date: 2019-05-23 16:49:25
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/go-gin.jpg
category: Golang
tags: go-gin
---

# Gin简介
>Gin是用Go（Golang）编写的HTTP Web框架。它具有类似于Martini的API，但性能比Martini快40倍。
# 快速开始

## 环境要求
<p class="note note-primary">
    Go 1.7 or Go 1.8 will be no longer supported soon.
</p>

## 安装

To install Gin package, you need to install Go and set your Go workspace first.

1. Download and install it:

```sh
$ go get -u github.com/gin-gonic/gin
```

1. Import it in your code:

```go
import "github.com/gin-gonic/gin"
```

1. (Optional) Import `net/http`. This is required for example if using constants such as `http.StatusOK`.

```go
import "net/http"
```

1. Create your project folder and `cd` inside

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

1. Copy a starting template inside your project

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

1. Run your project

```sh
$ go run main.go
```



# 相关资料

[官网文档](https://github.com/gin-gonic/gin)  
[参考博文](https://geektutu.com/post/quick-go-gin.html)   


 