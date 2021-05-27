---
title: Hyperledger Caliper 测试框架
date: 2020-03-16 22:58:21
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/caliper.png
category: 区块链篇
tags: Hyperledger
---
## Caliper 简介
Caliper是一个区块链性能基准框架，允许用户使用自定义用例测试不同的区块链解决方案，并获得一组性能测试结果。

>Caliper is a blockchain benchmark framework which allows users to measure the performance of a specific blockchain implementation with a set of predefined use cases. Caliper will produce reports containing a number of performance indicators, such as TPS (Transactions Per Second), transaction latency, resource utilisation etc. The intent is for Caliper results to be used as a reference in supporting the choice of a blockchain implementation suitable for the user-specific use-cases. Given the variety of blockchain configurations, network setup, as well as the specific use-cases in mind, it is not intended to be an authoritative performance assessment, nor to be used for simple comparative purposes (e.g. blockchain A does 5 TPS and blockchain B does 10 TPS, therefore B is better). The Caliper project references the definitions, metrics, and terminology as defined by the Performance & Scalability Working Group (PSWG).

## 适用平台

- Hyperledger Besu  
- Hyperledger Burrow
- Ethereum  
- Hyperledger Fabric
- FISCO BCOS
- Hyperledger Iroha
- Hyperledger Sawtooth
- Transaction/read throughput
- Transaction/read latency (minimum, maximum, average, percentile)
- Resource consumption (CPU, Memory, Network IO, …)

## 安装Caliper

Caliper is published as the `hyperledger/caliper-cli` NPM package and the `hyperledger/caliper`
 Docker image, both containing the CLI binary. Refer to the 
Installing from NPM
 and 
Using the Docker image
 sections for the available versions and their intricacies.

Installing and running Caliper usually consists of the following steps, thoroughly detailed by the remaining sections:

Acquire the Caliper CLI either from NPM or from DockerHub.
Execute a bind command through the CLI. This step pulls the specified version of SDK packages for the selected platform.
Start the benchmark through the CLI or by starting the Docker container.
The examples in the rest of the documentation use the 
caliper-benchmarks
 repository as the Caliper workspace since it contains many sample artifacts for benchmarking. Make sure you check out the appropriate tag/commit of the repository, matching the version of Caliper you use.

To clone the caliper-benchmarks repository, run:
```
git clone https://github.com/hyperledger/caliper-benchmarks.git
cd caliper-benchmarks
git checkout <your Caliper version>
```

*Note*: 
>If you are running your custom benchmark, then change this directory path (and other related configurations) accordingly in the examples.


 