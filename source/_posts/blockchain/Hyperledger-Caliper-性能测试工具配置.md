---
title: Hyperledger Caliper 性能测试工具配置
date: 2020-03-20 23:41:24
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/caliper2.png
category: 区块链篇 
tags: Hyperledger-Caliper
---

# Caliper性能测试工具配置

基本上都是根据官方doc进行操作，个别部分有坑。

[官方doc](https://hyperledger.github.io/caliper/docs/1_Getting_Started.html)

提前安装

>nodejs、node-gyp、docker、docker-compose

## 代码下载

`git clone https://github.com/hyperledger/caliper.git`

## 编译

进入caliper代码根目录，执行以下命令：
`npm install`
`npm run repoclean`
`npm run bootstrap`

## 安装caliper
根据官网步骤进行安装。

[安装步骤](https://github.com/hyperledger/caliper/blob/master/packages/caliper-tests-integration/README.md)
`cd ./packages/caliper-tests-integration`

#### 开启Verdaccio
`npm run start_verdaccio`

成功界面：
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Picture1.png)

#### 发布包

`npm run publish_packages`

#### 安装caliper

`npm run install_cli`

成功界面：
![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Picture2.png)

##### 遇到的问题

1.3.3.1.1.无权限
报错：gyp stack Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/caliper...  
原因：用户没有/usr/local/lib/node_modules/文件夹的写权限  
解决方法：  
（1）官方文档方法：修改npm的安装目录为一个本地用户有权限的目录，命令：`npm config set prefix ~/youdir`，修改后caliper会安装到此目录。  
（2）我的方法：不想修改npm安装目录，并且我在root用户下进行的操作，怀疑安装过程中切换了用户。所以我修改了caliper安装命令，添加`--unsafe-perm`参数，避免用户切换。  
修改文件：`packages/caliper-tests-integration/scripts/npm_install.js`第`65`行  

修改结果：  

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Picture3.png)

修改完后重新执行 `npm run install_cli`  

1.3.3.1.2.卡在`node-pre-gyp`命令

若一直卡在如下界面，重新执行`npm run install_cli`。百度说要vpn，我没有vpn，重新执行命令一样ok。  

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Picture4.png)

1.3.4.验证安装结果执行`caliper -v`，出现如下结果即安装成功

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Picture5.png)


## 测试

运行caliper提供的fabric1.4的sample。  
`cd packages/caliper-samples`  
`caliper benchmark run -w ./ -c benchmark/simple/config.yaml -n network/fabric-v1.4/2org1peergoleveldb/fabric-ccp-go.yaml --caliper-core-skipendscript`  

成功界面：

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Picture6.png)

`caliper-core-skipendscript`加上此参数，caliper执行完会跳过下图配置文件fabric-ccp-go.yaml的end的命令，不关闭fabric环境，这样有助于查看日志。不想保留fabric环境可不加此参数。

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Picture7.png)

Caliper运行日志记录在-w命令指定目录下的log目录中。

## 官网的坑

1.5.1.千万不要执行`npm run cleanup`


![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Picture8.png)


`npm run cleanup`执行过程中会删除安装的caliper，执行完此命令，在执行caliper -v会提示找不到命令。

1.5.2.不能执行One-step install

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Picture9.png)

官网One-step install如下：

One-step install也包含了npm run cleanup命令。所以安装完你依旧会看到如下界面：

![avatar](https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/Picture10.png)

还是不要偷懒使用一步安装了。

## 参考资料

https://github.com/hyperledger/caliper  
https://hyperledger.github.io/caliper/docs/1_Getting_Started.html  
https://github.com/hyperledger/caliper/blob/master/packages/caliper-tests-integration/README.md  


 