---
title: 笔记篇-GRPC学习笔记
date: 2019-08-04 18:56:57
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/grpc.png
category: 学习笔记
tags: grpc
---

# Grpc介绍

![grpc特点](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/grpc-1.png)

在gRPC中，客户端应用程序可以直接在其他计算机上的服务器应用程序上调用方法，就好像它是本地对象一样，从而使您更轻松地创建分布式应用程序和服务。在许多RPC系统中，gRPC都基于定义服务的思想，即指定可以使用其参数和返回类型远程调用的方法。在服务器端，服务器实现此接口并运行gRPC服务器以处理客户端调用。在客户端，客户端具有一个存根（在某些语言中简称为客户端），提供与服务器相同的方法。

![概念图](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/landing-2.svg)

从Google内部的服务器到您自己的台式机，gRPC客户端和服务器可以在各种环境中运行并相互通信，并且可以使用gRPC支持的任何语言编写。因此，例如，您可以使用Go，Python或Ruby的客户端轻松地用Java创建gRPC服务器。此外，最新的Google API的接口将具有gRPC版本，可让您轻松地在应用程序中内置Google功能。


# 快速开始

必备条件

- **[Go](https://golang.org/)**, any one of the **three latest major** [releases of Go](https://golang.org/doc/devel/release.html).

  For installation instructions, see Go’s [Getting Started](https://golang.org/doc/install) guide.

- **[Protocol buffer](https://developers.google.com/protocol-buffers) compiler**, `protoc`, [version 3](https://developers.google.com/protocol-buffers/docs/proto3).

  For installation instructions, see [Protocol Buffer Compiler Installation](https://grpc.io/docs/protoc-installation/).

- **Go plugins** for the protocol compiler:

    1. Install the protocol compiler plugins for Go using the following commands:

       ```sh
       $ export GO111MODULE=on  # Enable module mode
       $ go get google.golang.org/protobuf/cmd/protoc-gen-go \
                google.golang.org/grpc/cmd/protoc-gen-go-grpc
       ```

    2. Update your `PATH` so that the `protoc` compiler can find the plugins:

       ```sh
       $ export PATH="$PATH:$(go env GOPATH)/bin"
       ```

### Get the example code

The example code is part of the [grpc-go](https://github.com/grpc/grpc-go) repo.

1. [Download the repo as a zip file](https://github.com/grpc/grpc-go/archive/v1.34.0.zip) and unzip it, or clone the repo:

   ```sh
   $ git clone -b v1.34.0 https://github.com/grpc/grpc-go
   ```

2. Change to the quick start example directory:

   ```sh
   $ cd grpc-go/examples/helloworld
   ```

### Run the example

From the `examples/helloworld` directory:

1. Compile and execute the server code:

   ```sh
   $ go run greeter_server/main.go
   ```

2. From a different terminal, compile and execute the client code to see the client output:

   ```sh
   $ go run greeter_client/main.go
   Greeting: Hello world
   ```



# 相关资料

[官方文档](https://grpc.io/docs/)   


 