---
title: Golang篇-Iris学习笔记
date: 2019-05-25 16:49:39
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/go-iris.png
category: Golang
tags: go-iris
---

# Iris简介
>Iris是一个高效且经过精心设计的跨平台Web框架，具有一组强大的功能。借助无限的潜力和可移植性，构建自己的高性能Web应用程序和API。

# 快速安装
Iris is a cross-platform software.

The only requirement is the [Go Programming Language](https://golang.org/dl/), version 1.14 and above.

```bash
$ mkdir myapp
$ go mod init myapp
$ go get github.com/kataras/iris/v12@masterCopy to clipboardErrorCopied
```

Import it in your code:

```go
import "github.com/kataras/iris/v12"Copy to clipboardErrorCopied
```

### [Troubleshooting](https://www.iris-go.com/docs/#/?id=troubleshooting)

If you get a network error during installation please make sure you set a valid [GOPROXY environment variable](https://github.com/golang/go/wiki/Modules#are-there-always-on-module-repositories-and-enterprise-proxies).

```sh
go env -w GOPROXY=https://goproxy.cn,https://gocenter.io,https://goproxy.io,directCopy to clipboardErrorCopied
```

# 快速开始

```sh
# assume the following codes in main.go file
$ cat main.goCopy to clipboardErrorCopied
package main

import "github.com/kataras/iris/v12"

func main() {
    app := iris.New()

    booksAPI := app.Party("/books")
    {
        booksAPI.Use(iris.Compression)

        // GET: http://localhost:8080/books
        booksAPI.Get("/", list)
        // POST: http://localhost:8080/books
        booksAPI.Post("/", create)
    }

    app.Listen(":8080")
}

// Book example.
type Book struct {
    Title string `json:"title"`
}

func list(ctx iris.Context) {
    books := []Book{
        {"Mastering Concurrency in Go"},
        {"Go Design Patterns"},
        {"Black Hat Go"},
    }

    ctx.JSON(books)
    // TIP: negotiate the response between server's prioritizes
    // and client's requirements, instead of ctx.JSON:
    // ctx.Negotiation().JSON().MsgPack().Protobuf()
    // ctx.Negotiate(books)
}

func create(ctx iris.Context) {
    var b Book
    err := ctx.ReadJSON(&b)
    // TIP: use ctx.ReadBody(&b) to bind
    // any type of incoming data instead.
    if err != nil {
        ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().
            Title("Book creation failure").DetailErr(err))
        // TIP: use ctx.StopWithError(code, err) when only
        // plain text responses are expected on errors.
        return
    }

    println("Received Book: " + b.Title)

    ctx.StatusCode(iris.StatusCreated)
}Copy to clipboardErrorCopied
```

**MVC** equivalent:

```go
import "github.com/kataras/iris/v12/mvc"Copy to clipboardErrorCopied
m := mvc.New(booksAPI)
m.Handle(new(BookController))Copy to clipboardErrorCopied
type BookController struct {
    /* dependencies */
}

// GET: http://localhost:8080/books
func (c *BookController) Get() []Book {
    return []Book{
        {"Mastering Concurrency in Go"},
        {"Go Design Patterns"},
        {"Black Hat Go"},
    }
}

// POST: http://localhost:8080/books
func (c *BookController) Post(b Book) int {
    println("Received Book: " + b.Title)

    return iris.StatusCreated
}Copy to clipboardErrorCopied
```

**Run** your Iris web server:

```sh
$ go run main.go
> Now listening on: http://localhost:8080
> Application started. Press CTRL+C to shut down.Copy to clipboardErrorCopied
```

**List** Books:

```sh
$ curl --header 'Accept-Encoding:gzip' http://localhost:8080/books

[
  {
    "title": "Mastering Concurrency in Go"
  },
  {
    "title": "Go Design Patterns"
  },
  {
    "title": "Black Hat Go"
  }
]Copy to clipboardErrorCopied
```

**Create** a new Book:

```sh
$ curl -i -X POST \
--header 'Content-Encoding:gzip' \
--header 'Content-Type:application/json' \
--data "{\"title\":\"Writing An Interpreter In Go\"}" \
http://localhost:8080/books

> HTTP/1.1 201 CreatedCopy to clipboardErrorCopied
```

That's how an **error** response looks like:

```sh
$ curl -X POST --data "{\"title\" \"not valid one\"}" \
http://localhost:8080/books

> HTTP/1.1 400 Bad Request

{
  "status": 400,
  "title": "Book creation failure"
  "detail": "invalid character '\"' after object key",
}
```




# 相关资料

[官网](https://iris-go.com/)   


 