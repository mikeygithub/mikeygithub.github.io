---
title: Linux篇-Centos安装图形化界面
date: 2018-07-05 14:50:45
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/centos.jpeg
category: Linux学习
tags: Linux
---

>最近有重新来捣鼓捣鼓Linux了，这次撸的版本是centos7.4的，虽然说是不要桌面，但是感觉初学者还是安装一下比较好balalalala。。。。。。。。。废话不说的直接进入正题：

# 安装X

>首先安装X(X Window System),如果不是root用户请先切换到root用户才能操作，命令为：

`su root` 

命令为

`yum groupinstall "X Window System"`
 
回车，安装时间可能会比较长，安装完出现complete！提示，如果出现要确认其他信息则一路输入输入 "y"回车

查看已装软件及可装软件：

`yum grouplist`
 
由于本屌已经安装好了所以就在已经安装的分组的啦

# 安装图形界面软件GNOME(GNOME Desktop)       

>这里需要特别注意！！！！一定要注意 名称必须对应 不同版本的centOS的软件名可能不同 其他Linux系统类似否则会出现No packages in any requested group available to install or update 的错误。

`yum groupinstall "GNOME Desktop"`

 回车，出现提示一路输入"y"确认

这次的安装会更慢，内心等待，安装完会出现complete！提示。

# 进入图形化界面

输入

`startX`
 
速度可能比较慢，可尝试重启

`reboot`

完成.
  


 