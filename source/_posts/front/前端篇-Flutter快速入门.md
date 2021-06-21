---
title: 前端篇-Flutter快速入门
date: 2020-03-29 12:27:39
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/flutter.png
category: 前端相关
tags: Flutter
---

## Flutter 简单介绍

Flutter是谷歌的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。 Flutter可以与现有的代码一起工作。在全世界，Flutter正在被越来越多的开发者和组织使用，并且Flutter是完全免费、开源的。

## Flutter 相关特性

- 快速开发:Flutter的热重载可帮助您快速地进行测试、构建UI、添加功能并更快地修复错误。在iOS和Android模拟器或真机上可以在亚秒内重载，并且不会丢失状态。

- 富有表现力，漂亮的用户界面:使用Flutter内置美丽的Material Design和Cupertino（iOS风格）widget、丰富的motion API、平滑而自然的滑动效果和平台感知，为您的用户带来全新体验。

- 现代的，响应式框架:使用Flutter的现代、响应式框架，和一系列基础widget，轻松构建您的用户界面。使用功能强大且灵活的API（针对2D、动画、手势、效果等）解决艰难的UI挑战。

## Flutter 安装教程

下载 Flutter SDK: 

`wget https://storage.googleapis.com/flutter_infra/releases/stable/linux/flutter_linux_v1.12.13+hotfix.8-stable.tar.xz`

解压:

 `cd ~/development`
 `tar xf ~/Downloads/flutter_linux_v1.12.13+hotfix.8-stable.tar.xz`
 
如果不想安装固定版本的安装包，可以跳过步骤1和2。相反，从GitHub上的Flutter repo获取源代码，并根据需要更改分支或标记。例如：

 `git clone https://github.com/flutter/flutter.git -b stable`

添加Flutter 工具到你的path路径:

```bash
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
export PATH=/home/mikey/DATA/DevTools/flutter/bin:{PATH}:{PATH}:${ANDROID_HOME}/platform-tools
```

可选地，预下载开发二进制文件:

`lutter precache`

运行 flutter doctor

`flutter doctor`
 
此命令检查您的环境并向终端窗口显示报告。Dart SDK与Flutter捆绑在一起，不需要单独安装Dart。仔细检查输出是否有其他需要安装的软件或要执行的其他任务。
例如:

> Android toolchain - develop for Android devices  
    • Android SDK at /Users/obiwan/Library/Android/sdk  
    ✗ Android SDK is missing command line tools; download from https://goo.gl/XxQghQ  
    • Try re-installing or updating your Android SDK,  
      visit https://flutter.dev/setup/#android-setup for detailed instructions.  

## Android Studio 设置

安装插件：

1.flutter

2.dart
 

## Flutter 简单案例

[编写您的第一个 Flutter App](https://flutterchina.club/get-started/codelab/)

## 参考资料

[官网文档](https://flutter.dev/docs)

[安装教程](https://flutter.dev/docs/get-started/install/linux)

[flutter实战](https://book.flutterchina.club/)  


 