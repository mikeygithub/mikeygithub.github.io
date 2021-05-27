---
title: Hyperledger Iroha
date: 2020-03-18 00:36:27
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Iroha.png
category: 区块链篇
tags: Hyperledger-Iroha
---


# Hyperledger Iroha 简介


## 1.1。Iroha的主要特征是什么？
- 简单的部署和维护
- 面向开发人员的各种库
- 基于角色的访问控制
- 化设计，由命令-查询分离原理驱动
- 和身份管理  

在我们的质量模型中，我们专注于并不断改进：

- 性（容错性，可恢复性）
- 效率（尤其是时间行为和资源利用）
- 性（易学性，用户错误保护，适当性可识别性）

## 在哪里可以使用Iroha？

Hyperledger Iroha是通用许可的区块链系统，可用于管理数字资产，身份和序列化数据。这对于银行间结算，中央银行数字货币，支付系统，国家ID和物流等应用可能很有用。

有关详细说明，请检查我们的用例场景部分。

1.3。它与比特币或以太坊有何不同？
比特币和以太坊被设计为无人允许的分类帐，任何人都可以加入并访问所有数据。它们还具有与系统交互所需的本机加密货币。

在Iroha中，没有本机加密货币。相反，为了满足企业的需求，允许进行系统交互，这意味着只有具有必需访问权限的人才能与系统交互。此外，还允许查询，以便可以控制对所有数据的访问。

与以太坊的主要区别尤其在于，Hyperledger Iroha允许用户通过使用系统中的预构建命令来执行常见功能，例如创建和传输数字资产。这就消除了编写繁琐且难以测试的智能合约的需要，从而使开发人员能够更快，风险更低地完成简单的任务。

1.4。它与其他Hyperledger框架或其他许可的区块链有何不同？
Iroha具有一种新颖的，具有Crash容错能力的共识算法（称为YAC [1]），该算法具有很高的性能，并允许以低延迟完成事务。

此外，与其他平台相比，Iroha的内置命令是一个主要优点，因为执行诸如创建数字资产，注册帐户以及在帐户之间转移资产之类的常见任务非常简单。此外，由于故障少，它缩小了攻击媒介，提高了系统的整体安全性。

最后，Iroha是唯一具有强大权限系统的分类帐，允许为所有命令，查询和网络加入设置权限。

[1]	另一个共识
1.5。如何围绕Iroha创建应用程序？
为了将区块链的功能带入您的应用程序，您应该首先考虑它如何与Iroha同行进行接口。一个好的开始是检查“ 概念和体系结构”部分，解释什么是事务和查询，以及应用程序的用户应该如何与之交互。

我们也有几个客户端库，这些库为开发人员提供了形成构建块的工具，例如签名，命令，向Iroha对等方发送消息并检查状态。

Hyperledger Iroha 核心概念
Why Iroha runs in a network? How to understand the objects inside and outside the system? How peers in the network collaborate and decide which data to put into the blockchain? We will look through the basics of Iroha in this section.

- 2.1.1. Account
- 2.1.2. Asset
- 2.1.3. Block
- 2.1.4. Client
- 2.1.5. Command
- 2.1.6. Consensus
- 2.1.7. Domain
- 2.1.8. Peer
- 2.1.9. Permission
- 2.1.10. Proposal
- 2.1.11. Query
- 2.1.12. Quorum
- 2.1.13. Role
- 2.1.14. Signatory
- 2.1.15. Transaction
- 2.1.16. Batch of Transactions
- 2.1.17. Multisignature Transactions
- 2.1.18. Validation
- 2.1.19. Entity-relationship model

# Hyperledger Iroha 内部组成

HL Iroha网络由几个基本组件组成，这些组件提供节点之间的通信。您可以在下面了解它们。

# Iroha体系结构图

2.2.1。Torii
客户的切入点。使用gRPC作为传输。为了与Iroha进行交互，任何人都可以使用gRPC端点（如“ 命令和查询”部分中所述）或使用客户端库。

2.2.2。MST处理器
多签名交易处理器

这是一项内部gRPC服务，可通过Gossip协议发送和接收来自其他对等方的消息。它的任务是发出尚未收到足够签名以达到法定人数的多重签名交易。

2.2.3。对等通信服务
Iroha的内部组件- 通过MstProcessor将交易从Torii 传输到Ordering Gate的中介。PCS的主要目标是隐藏与共识实现交互的复杂性。

2.2.4。订购门
它是内部Iroha组件（gRPC客户端），可将事务从对等通信服务中继到订购服务。Ordering Gate 从Ordering Service 接收提案（链中的潜在模块），并将其发送到Simulator进行状态验证。它还根据共识回合要求订购服务提供建议。

2.2.5。订购服务
内部Iroha组件（gRPC服务器），该组件从其他对等方接收消息，并将已通过无状态验证传递的多个交易合并到投标中。每个节点都有其自己的订购服务。提案创建可以由以下事件之一触发：

专用于交易收集的期限已到期。
订购服务已收到单个提案允许的最大交易量。
这两个参数（超时和建议的最大大小）都是可配置的（请检查特定于环境的参数页面）。

这两个触发器的共同先决条件是至少一项交易应到达订购服务。否则，将不会形成任何建议。

订购服务还对提案进行初步验证（例如，从提案中清除无状态拒绝的交易）。

2.2.6。经过验证的提案创建者
内部Iroha组件，对订购服务收到的投标中包含的交易执行状态验证。基于已通过状态验证的事务，将创建经过验证的提议并将其传递给Block Creator。所有未通过状态验证的交易都将被删除，并且不包含在已验证的投标中。

2.2.7。块造物主
系统组件，它通过一系列已通过无状态和有状态验证的事务构成块，以便进一步传播到共识。

区块创建者与“ 验证提议创建者”一起构成了一个名为Simulator的组件。

2.2.8。区块共识（YAC）
共识，作为一个组成部分

共识是区块链的核心-它在对等网络中的对等之间保持一致的状态。Iroha使用自己的共识算法，称为“另一个共识”（又名YAC）。

您可以在此处观看视频，其中对共识和YAC的原理进行了详尽的解释。

YAC算法的显着特征是它的可伸缩性，性能和崩溃容错能力。

为了确保网络的一致性，如果缺少块，将通过Synchronizer从另一个对等方下载它们。提交的块存储在Ametsuchi块存储中。

有关共识的一般定义，请检查此链接。

2.2.9。同步器
是共识的一部分。将缺失的块添加到对等方的链中（从其他对等方下载它们以保持一致性）。

2.2.10。Ametsuchi Blockstore 
Iroha存储组件，用于存储块和从块生成的状态，称为World State View。有没有办法让客户端直接与Ametsuchi互动。

2.2.11。世界状态视图
WSV反映了系统的当前状态，可以视为快照。例如，WSV保留有关帐户当前拥有的资产数量的信息 ，但不包含任何交易流的信息历史记录。 

# Hyperledger Iroha 快速入门

在本指南中，我们将创建一个非常基本的Iroha网络，启动它，创建几个事务，并检查写入分类帐中的数据。为简单起见，我们将使用Docker。

注意

Ledger是区块链的代名词，Hyperledger Iroha也被称为分布式Ledger技术框架-本质上与“区块链框架”相同。您可以检查“ 核心概念”部分中使用的其余术语。

3.1。前提条件
对于本指南，您需要一台Docker已安装的机器。您可以阅读如何在Docker网站上安装它。

注意

当然，您可以从头开始构建Iroha，修改其代码并启动自定义节点！如果您想知道如何做–您可以查看Building Iroha部分。在本指南中，我们将使用Iroha的标准发行版作为docker映像。

3.2。启动Iroha 

3.2.1。创建一个Docker网络
要进行操作，Iroha需要一个PostgreSQL数据库。让我们从创建Docker网络开始，以便Postgres和Iroha的容器可以在同一虚拟网络上运行并成功通信。在本指南中，我们将其称为iroha-network，但您可以使用任何名称。在您的终端中输入以下命令：

泊坞窗网络创建iroha-network
3.2.2。启动PostgreSQL容器
现在，我们需要PostgreSQL在容器中运行，将其附加到之前创建的网络，并公开用于通信的端口：

```
docker--name some-postgres\ 
-e POSTGRES_USER = postgres\ 
-e POSTGRES_PASSWORD = mysecretpassword \ 
-p 5432：5432 \ 
--network =iroha-network\ 
-d postgres：9.5 \ 
-c 'max_prepared_transactions = 100'
```

注意

如果已经在主机系统上的默认端口（5432）上运行了Postgres，则应选择另一个将被占用的空闲端口。例如5433：-p 5433:5432

3.2.3。创建Blockstore 
在运行Iroha容器之前，我们可能会创建一个持久卷来存储文件，并为该链存储块。通过以下命令完成：

码头工人卷创建块存储
3.2.4。准备配置文件
注意

为简单起见，在本指南中，我们将创建一个仅包含单个节点的网络。要了解如何运行多个对等节点，请遵循部署

现在，我们需要配置Iroha网络。这包括创建配置文件，为用户生成密钥对，编写对等方列表以及创建创世块。

不要害怕-我们已经为本指南准备了一个示例配置，因此您可以立即开始测试Iroha节点。为了获取这些文件，您需要 从Github 克隆Iroha存储库或手动复制它们（不过克隆速度更快）。

`git clone -b master https://github.com/hyperledger/iroha --depth = 1`

暗示

--depth=1选项允许我们仅下载最新的提交并节省一些时间和带宽。如果要获取完整的提交历史记录，则可以忽略此选项。

关于如何设置参数以及如何根据您的环境和负载期望对其进行调整的指南：配置。目前我们不需要这样做。

3.2.5。启动Iroha容器
我们几乎准备启动我们的Iroha集装箱。您只需要知道配置文件的路径（从上述步骤开始）。

让我们使用以下命令在Docker容器中启动Iroha节点：

```
docker run --name iroha \ 
-d \ 
-p 50051：50051 \ 
-v $ { pwd ） / iroha / example：/ opt / iroha_data \ 
-v blockstore：/ tmp / block_store \ 
--network = iroha-network \ 
- e KEY = 'node0'  \
hyperledger / iroha：latest
```

如果成功启动节点，您将在启动容器的同一控制台中看到容器ID。

让我们详细了解一下此命令的作用：

```
docker run --name iroha \ 创建一个容器 iroha
-d \ 在后台运行容器
-p 50051:50051 \ 公开用于与客户端通信的端口（我们将在以后使用）
-v YOUR_PATH_TO_CONF_FILES:/opt/iroha_data \这就是我们如何将配置文件传递到docker容器的方法。示例目录在上面的代码块中指示。
-v blockstore:/tmp/block_store \ 将持久性块存储（Docker卷）添加到容器中，以便在我们停止容器后不会丢失块
--network=iroha-network \将我们的容器添加到先前创建的iroha-network 用于与PostgreSQL服务器通信的容器
-e KEY='node0' \-在此请指出一个密钥名称，该名称将标识允许其确认操作的节点。密钥应与上述配置文件一起放在目录中。
hyperledger/iroha:latest是指向最新版本的图像的引用
```

您可以通过运行查看日志。docker logs iroha

您可以尝试使用示例指南之一，以便将一些事务发送到Iroha并查询其状态。

### 3.3。尝试其他指南

3.3.1。CLI指南：发送您的第一笔交易和查询
3.3.1.1。创建第一笔交易
3.3.1.2。创建第一个查询
3.3.1.3。成为坏蛋
3.3.2。使用Python库发送交易
3.3.2.1。先决条件
3.3.2.2。运行示例交易
3.3.2.3。定义命令
3.3.2.4。运行命令
Hyperledger 综合项目
Hyperledger联盟的想法之一是创建可以一起工作以提供最佳区块链体验的解决方案。在Iroha中，我们相信其他出色的Hyperledger工具和解决方案的集成是使Iroha更好地适合您的用例的一种方式。因此，我们致力于与多个项目的集成，并希望向您详细介绍Iroha可以与之合作的内容。



### 4.1。Hyperledger Ursa
Hyperledger Ursa是一个共享的密码库，使人们（和项目）可以避免重复其他密码工作，并希望在此过程中提高安全性。该库将是供项目（以及可能还有其他项目）放置和使用加密货币的可选存储库。Hyperledger Ursa由子项目组成，这些子项目是密码代码或密码代码接口的内聚实现。

通过在构建过程中仅添加一个标志，可以轻松地使用Ursa库构建Iroha 。它将允许您使用Ursa库中的加密算法代替标准的Iroha加密技术。随着Ursa中新图书馆的发展，将为您提供越来越多的选择！

### 4.2。Hyperledger Explorer
Hyperledger Explorer是一个区块链模块，是The Linux Foundation托管的Hyperledger项目之一。Hyperledger Explorer旨在创建一个用户友好的Web应用程序，可以查看，调用，部署或查询块，事务和相关数据，网络信息（名称，状态，节点列表），链代码和事务族，以及任何其他相关信息存储在分类帐中。

在这里，您可以了解如何将Explorer与Iroha结合使用。

### 4.3。Hyperledger Burrow
Hyperledger Burrow为模块化区块链客户端提供了一个经过许可的智能合约解释器，该解释器部分已按照以太坊虚拟机（EVM）的规范进行开发。

我们将很快准备有关如何使用Iroha中集成的Burrow的说明。

# 绑定 Iroha

In this guide we will learn how to install all dependencies, required to build Iroha and how to actually build it.

There will be 3 steps:

1.Installing environment prerequisites  
2.Installing Iroha dependencies (will be performed automatically for Docker)  
3.Building Iroha  

Note

You don’t need to build Iroha to start using it. Instead, you can download prepared Docker image from the Hub, this process explained in details in the Quick Start Guide page of this documentation.

5.1. Prerequisites
In order to successfully build Iroha, we need to configure the environment. There are several ways to do it and we will describe all of them.

Currently, we support Unix-like systems (we are basically targeting popular Linux distros and MacOS). If you happen to have Windows or you don’t want to spend time installing all dependencies you might want to consider using Docker environment. Also, Windows users might consider using WSL

Technically Iroha can be built under Windows natively in experimental mode. This guide covers that way too. All the stages related to native Windows build are separated from the main flow due to its significant differences.

Please choose your preferred platform below for a quick access:

- docker
- linux
- macOS
- windows
- Hint

Having troubles? Check FAQ section or communicate to us directly, in case you were stuck on something. We don’t expect this to happen, but some issues with an environment are possible.

5.1.1. Docker
First of all, you need to install docker and docker-compose. You can read how to install it on the Docker’s website

Note

Please, use the latest available docker daemon and docker-compose.

Then you should clone the Iroha repository to the directory of your choice:

`git clone -b master https://github.com/hyperledger/iroha --depth=1`

Hint

--depth=1 option allows us to download only latest commit and save some time and bandwidth. If you want to get a full commit history, you can omit this option.

When it is done, you need to run the development environment. Run the scripts/run-iroha-dev.sh script:

bash scripts/run-iroha-dev.sh
Hint

Please make sure that Docker is running before executing the script. MacOS users could find a Docker icon in system tray, Linux users can use systemctl start docker

After you execute this script, the following things will happen:

The script will check whether you have containers with Iroha already running. Successful completion finishes with the new container shell.
The script will download hyperledger/iroha:develop-build and postgres images. hyperledger/iroha:develop-build image contains all development dependencies and is based on top of ubuntu:18.04. postgres image is required for starting and running Iroha.
Two containers are created and launched.
The user is attached to the interactive environment for development and testing with iroha folder mounted from the host machine. Iroha folder is mounted to /opt/iroha in Docker container.
Now your are ready to build Iroha! Please go directly to Building Iroha section.

5.1.2. Linux
To build Iroha, you will need the following packages:

build-essential git ca-certificates tar ninja-build curl unzip cmake

Use this code to install environment dependencies on Debian-based Linux distro.

```
apt-get update; \
apt-get -y --no-install-recommends install \
build-essential ninja-build \
git ca-certificates tar curl unzip cmake
```

Note

If you are willing to actively develop Iroha and to build shared libraries, please consider installing the latest release of CMake.

Now you are ready to install Iroha dependencies.

5.1.3. MacOS
If you want to build Iroha from scratch and actively develop it, please use the following code to install all environment dependencies with Homebrew:

`xcode-select --install`
`brew install cmake ninja git gcc@7`

Hint

To install the Homebrew itself please run

`ruby -e "$(curl -fsSL https://raw.githubusercontent.com/homebrew/install/master/install)"`

Now you are ready to install Iroha dependencies.

5.1.4. Windows
Note

All the listed commands are designed for building 64-bit version of Iroha.

5.1.4.1. Chocolatey Package Manager
First of all you need Chocolatey package manager installed. Please refer the guide for chocolatey installation.

5.1.4.2. Building the Toolset
Install CMake, Git, Microsoft compilers via chocolatey being in Administrative mode of command prompt:

choco install cmake git visualstudio2019-workload-vctools ninja
PostgreSQL is not a build dependency, but it is recommended to install it now for the testing later:

choco install postgresql
Don't forget the password you set!
Now you are ready to install Iroha dependencies.

5.2. Installing dependencies with Vcpkg Dependency Manager
Currently we use Vcpkg as a dependency manager for all platforms - Linux, Windows and MacOS. We use a fixed version of Vcpkg to ensure the patches we need will work.

That stable version can only be found inside the Iroha repository, so we will need to clone Iroha. The whole process is pretty similar for all platforms but the exact commands are slightly different.

5.2.1. Linux and MacOS
Run in terminal:

`git clone https://github.com/hyperledger/iroha.git`
`iroha/vcpkg/build_iroha_deps.sh`
`vcpkg/vcpkg integrate install`

After the installation of vcpkg you will be provided with a CMake build parameter like -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake. Save it somewhere for later use and move to Building Iroha section.

5.2.2. Windows
Execute from Power Shell:

`git clone https://github.com/hyperledger/iroha.git`
`powershell -ExecutionPolicy ByPass -File .\iroha\.packer\win\scripts\vcpkg.ps1 .\vcpkg .\iroha\vcpkg`

After the installation of vcpkg you will be provided with a CMake build parameter like -DCMAKE_TOOLCHAIN_FILE=C:/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake. Save it somewhere for later use and move to Building Iroha section.

Note

If you plan to build 32-bit version of Iroha - you will need to install all the mentioned librares above prefixed with x86 term instead of x64.

5.3. Build Process
5.3.1. Cloning the Repository
This step is currently unnecessary since you have already cloned Iroha in the previous step. But if you want, you can clone the Iroha repository to the directory of your choice.

`git clone -b master https://github.com/hyperledger/iroha`
`cd iroha`

Hint

If you have installed the prerequisites with Docker, you don’t need to clone Iroha again, because when you run run-iroha-dev.sh it attaches to Iroha source code folder. Feel free to edit source code files with your host environment and build it within docker container.

5.3.2. Building Iroha
To build Iroha, use these commands:

`cmake -H. -Bbuild -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake -G "Ninja"`
`cmake --build build --target irohad -- -j<number of threads>`

Note

On Docker the path to a toolchain file is /opt/dependencies/scripts/buildsystems/vcpkg.cmake. In other environment please use the path you have got in previous steps.

Number of threads will be defined differently depending on the platform: - On Linux: via nproc. - On MacOS: with sysctl -n hw.ncpu. - On Windows: use echo %NUMBER_OF_PROCESSORS%.

Note

When building on Windows do not execute this from the Power Shell. Better use x64 Native tools command prompt.

Now Iroha is built. Although, if you like, you can build it with additional parameters described below.

5.3.3. CMake Parameters
We use CMake to generate platform-dependent build files. It has numerous flags for configuring the final build. Note that besides the listed parameters cmake’s variables can be useful as well. Also as long as this page can be deprecated (or just not complete) you can browse custom flags via cmake -L, cmake-gui, or ccmake.

Hint

>You can specify parameters at the cmake configuring stage (e.g cmake -DTESTING=ON).

5.3.3.1. Main Parameters
Parameter	Possible values	Default	Description
TESTING	ON/OFF	ON	Enables or disables build of the tests
BENCHMARKING	OFF	Enables or disables build of the Google Benchmarks library
COVERAGE	OFF	Enables or disables lcov setting for code coverage generation
USE_LIBURSA	OFF	Enables usage of the HL Ursa cryptography instead of the standard one
Note

>If you would like to use HL Ursa cryptography for your build, please install Rust in addition to other dependencies. Learn more about HL Ursa integration here.

5.3.3.2. Packaging Specific Parameters
Parameter	Possible values	Default	Description
PACKAGE_ZIP	ON/OFF	OFF	Enables or disables zip packaging
PACKAGE_TGZ	OFF	Enables or disables tar.gz packaging
PACKAGE_RPM	OFF	Enables or disables rpm packaging
PACKAGE_DEB	OFF	Enables or disables deb packaging
5.3.4. Running Tests (optional)
After building Iroha, it is a good idea to run tests to check the operability of the daemon. You can run tests with this code:

`cmake --build build --target test`
Alternatively, you can run the following command in the build folder

`cd build`
`ctest . --output-on-failure`
Note
>Some of the tests will fail without PostgreSQL storage running, so if you are not using scripts/run-iroha-dev.sh script please run Docker container or create a local connection with following parameters:

```
docker run --name some-postgres \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=mysecretpassword \
-p 5432:5432 \
-d postgres:9.5 \
-c 'max_prepared_transactions=100'
```

# Hyperledger Iroha 相关资料
[官方文档](https://iroha.readthedocs.io/en/latest/)


 